#!/usr/bin/env node
/**
 * Scout AI + Kid Reporter newsletter workflow (local CLI).
 *
 * Commands:
 *   node scripts/newsletter-cli.mjs generate [focus]
 *   node scripts/newsletter-cli.mjs publish <file>
 *   node scripts/newsletter-cli.mjs send [newsletterId]
 *
 * Storage: data/newsletters.json (created automatically).
 * Recipients: comma-separated NEWSLETTER_RECIPIENTS env or data/subscribers.json.
 */
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import process from "node:process";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { Resend } from "resend";

const [, , command, ...rest] = process.argv;
const DATA_DIR = path.join(process.cwd(), "data");
const NEWSLETTERS_PATH = path.join(DATA_DIR, "newsletters.json");
const SUBSCRIBERS_PATH = path.join(DATA_DIR, "subscribers.json");
const PERPLEXITY_ENDPOINT =
  process.env.PERPLEXITY_API_URL ||
  "https://api.perplexity.ai/chat/completions";
const PERPLEXITY_MODEL =
  process.env.PERPLEXITY_MODEL ||
  process.env.PERPLEXITY_COIN_MODEL ||
  "sonar-pro";
const DAY_MS = 24 * 60 * 60 * 1000;

async function main() {
  if (!command || command === "--help" || command === "-h") {
    printHelp();
    return;
  }

  switch (command) {
    case "generate": {
      const focus = rest.join(" ") || null;
      const briefing = await generateBriefing({ focus });
      console.log(JSON.stringify(briefing, null, 2));
      break;
    }
    case "publish": {
      const file = rest[0];
      if (!file) throw new Error("publish requires a JSON file argument");
      const payload = JSON.parse(await readFile(file, "utf8"));
      const saved = await publishNewsletter(payload);
      console.log(`Published newsletter ${saved.id}`);
      break;
    }
    case "send": {
      const id = rest[0] || null;
      const { recipients } = await sendNewsletter(id);
      console.log(`Sent ${recipients} emails.`);
      break;
    }
    default:
      printHelp(1);
  }
}

function printHelp(exitCode = 0) {
  console.log(`Scout AI Newsletter CLI

Commands:
  newsletter generate [focus]
  newsletter publish <file>
  newsletter send [newsletterId]

Env:
  GEMINI_API_KEY          (required for generate)
  PERPLEXITY_API_KEY      (optional, adds Card Watch section)
  RESEND_API_KEY          (required for send)
  RESEND_FROM_EMAIL       (required for send, e.g. "Scout AI <alerts@example.com>")
  NEWSLETTER_RECIPIENTS   (comma-separated fallback list)
`);
  process.exit(exitCode);
}

async function ensureDataDir() {
  if (!existsSync(DATA_DIR)) {
    await mkdir(DATA_DIR, { recursive: true });
  }
  if (!existsSync(NEWSLETTERS_PATH)) {
    await writeFile(NEWSLETTERS_PATH, "[]", "utf8");
  }
}

async function loadNewsletters() {
  await ensureDataDir();
  try {
    const raw = await readFile(NEWSLETTERS_PATH, "utf8");
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

async function saveNewsletters(list) {
  await ensureDataDir();
  await writeFile(NEWSLETTERS_PATH, JSON.stringify(list, null, 2), "utf8");
}

function initGemini() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is required for generation");
  }
  return new GoogleGenerativeAI(apiKey).getGenerativeModel({
    model: "gemini-1.5-flash",
  });
}

async function generateBriefing({ focus }) {
  const gemini = initGemini();
  const focusLine = focus ? `Focus on ${focus}. ` : "";
  const prompt = `You are the Kid Reporter + Scout AI desk covering sports cards.
${focusLine}Use search to surface the 3 most timely storylines from the last 7-10 days across NBA/NFL/MLB cards, fan culture, and Fanatics/Topps marketplace moves. Include at least one note on Fanatics or partner platforms when credible.
Return ONLY valid JSON:
{
  "headline": string hyped weekly headline,
  "summary": string 2-3 sentences for newsletter intro,
  "insights": [
    {
      "title": string,
      "summary": string,
      "howToAvoid": string practical guidance for collectors,
      "threatLevel": "High" | "Medium" | "Low"
    }
  ],
  "sources": [
    { "uri": string, "title": string }
  ]
}`;

  const response = await gemini.generateContent(prompt);
  const raw = await extractText(response);
  const jsonPayload = sanitizeJson(raw);
  const parsed = JSON.parse(jsonPayload);

  const coinScan = await runPerplexityScan({ focus }).catch((error) => {
    console.warn("Perplexity scan skipped:", error.message);
    return null;
  });

  return normalizeBriefing({ ...parsed, metadata: { coinScan } });
}

async function runPerplexityScan({ focus }) {
  const key = process.env.PERPLEXITY_API_KEY;
  if (!key) return null;

  const windowDays = Math.max(
    Number.parseInt(process.env.PERPLEXITY_WINDOW_DAYS ?? "10", 10),
    1,
  );
  const now = new Date();
  const start = new Date(now.getTime() - windowDays * DAY_MS);
  const focusLine = focus
    ? `Prioritize signals related to "${focus}".`
    : "Prioritize Fanatics marketplace moves, Topps releases, and hobby safety issues.";

  const prompt = `You are a scout for sports card news.
Time window: ${start.toISOString()} to ${now.toISOString()} (${windowDays} days).
${focusLine}
Find credible developments collectors care about (market shifts, Fanatics/Topps updates, scam alerts, notable auctions). Return JSON only:
{
  "summary": string,
  "findings": [
    {
      "title": string,
      "summary": string,
      "howToAvoid": string,
      "threatLevel": "High" | "Medium" | "Low",
      "sources": [ { "uri": string, "title": string } ]
    }
  ],
  "sources": [ { "uri": string, "title": string } ]
}`;

  const res = await fetch(PERPLEXITY_ENDPOINT, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${key}`,
    },
    body: JSON.stringify({
      model: PERPLEXITY_MODEL,
      max_tokens: Number.parseInt(
        process.env.PERPLEXITY_MAX_TOKENS ?? "1100",
        10,
      ),
      temperature: Number.parseFloat(
        process.env.PERPLEXITY_TEMPERATURE ?? "0.15",
      ),
      response_format: {
        type: "json_schema",
        json_schema: {
          name: "card_watch",
          schema: {
            type: "object",
            properties: {
              summary: { type: "string" },
              findings: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    title: { type: "string" },
                    summary: { type: "string" },
                    howToAvoid: { type: "string" },
                    threatLevel: {
                      type: "string",
                      enum: ["High", "Medium", "Low"],
                    },
                    sources: {
                      type: "array",
                      items: {
                        type: "object",
                        properties: {
                          uri: { type: "string" },
                          title: { type: "string" },
                        },
                        required: ["uri"],
                      },
                    },
                  },
                  required: ["summary"],
                },
              },
              sources: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    uri: { type: "string" },
                    title: { type: "string" },
                  },
                  required: ["uri"],
                },
              },
            },
            required: ["summary"],
          },
        },
      },
      messages: [
        { role: "system", content: "Be concise. Respond in English." },
        { role: "user", content: prompt },
      ],
    }),
  });

  if (!res.ok) {
    const payload = await safeJson(res);
    const message = payload?.error?.message || res.statusText;
    throw new Error(`Perplexity error (${res.status}): ${message}`);
  }

  const payload = await res.json();
  const content = payload?.choices?.[0]?.message?.content;
  if (!content) return null;
  return typeof content === "string" ? JSON.parse(content) : content;
}

function normalizeBriefing(raw) {
  const insights = Array.isArray(raw?.insights)
    ? raw.insights.map((item, index) => ({
        title: textValue(item?.title) || `Insight ${index + 1}`,
        summary:
          textValue(item?.summary) ||
          "Add a short summary for this storyline.",
        howToAvoid:
          textValue(item?.howToAvoid) ||
          "Add a collector takeaway or action.",
        threatLevel: normalizeThreatLevel(item?.threatLevel),
      }))
    : [];

  const sources = Array.isArray(raw?.sources)
    ? raw.sources
        .map((item, index) => ({
          uri: textValue(item?.uri),
          title: textValue(item?.title) || `Source ${index + 1}`,
        }))
        .filter((s) => s.uri)
    : [];

  return {
    id: raw?.id || `nl_${Date.now()}`,
    headline: textValue(raw?.headline) || "Scout AI Weekly",
    summary:
      textValue(raw?.summary) ||
      "Weekly drop from the Kid Reporter + Scout AI desk.",
    insights,
    sources,
    status: raw?.status || "draft",
    publishedAt: raw?.publishedAt || null,
    metadata: raw?.metadata || {},
  };
}

async function publishNewsletter(payload) {
  const briefing = normalizeBriefing(payload);
  const list = await loadNewsletters();
  const now = new Date().toISOString();
  const publishedAt =
    briefing.status === "published"
      ? briefing.publishedAt || now
      : briefing.publishedAt;

  const saved = {
    ...briefing,
    publishedAt,
    emailSentAt: null,
  };

  const existingIndex = list.findIndex((item) => item.id === saved.id);
  if (existingIndex !== -1) {
    list[existingIndex] = saved;
  } else {
    list.unshift(saved);
  }

  await saveNewsletters(list);
  return saved;
}

async function sendNewsletter(id) {
  const fromEmail = process.env.RESEND_FROM_EMAIL;
  const resendKey = process.env.RESEND_API_KEY;
  if (!fromEmail || !resendKey) {
    throw new Error("RESEND_API_KEY and RESEND_FROM_EMAIL are required to send");
  }

  const newsletters = await loadNewsletters();
  const newsletter = id
    ? newsletters.find((item) => item.id === id)
    : newsletters.find((item) => item.status === "published") || newsletters[0];

  if (!newsletter) {
    throw new Error("No newsletter found to send");
  }

  const recipients = await loadRecipients();
  if (!recipients.length) {
    throw new Error("No recipients found (set NEWSLETTER_RECIPIENTS or data/subscribers.json)");
  }

  const resend = new Resend(resendKey);
  const { subject, html, text } = renderEmail(newsletter);

  await resend.emails.send({
    from: fromEmail,
    to: [fromEmail],
    bcc: recipients,
    subject,
    html,
    text,
  });

  // Mark email sent locally
  const list = newsletters.map((item) =>
    item.id === newsletter.id
      ? { ...item, emailSentAt: new Date().toISOString() }
      : item,
  );
  await saveNewsletters(list);

  return { recipients: recipients.length };
}

async function loadRecipients() {
  const envList = (process.env.NEWSLETTER_RECIPIENTS || "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  let fileList = [];
  if (existsSync(SUBSCRIBERS_PATH)) {
    try {
      const raw = await readFile(SUBSCRIBERS_PATH, "utf8");
      const parsed = JSON.parse(raw);
      fileList = Array.isArray(parsed)
        ? parsed
            .map((entry) =>
              typeof entry === "string" ? entry : entry?.email || "",
            )
            .filter(Boolean)
        : [];
    } catch {
      fileList = [];
    }
  }

  return Array.from(new Set([...envList, ...fileList]));
}

function renderEmail(newsletter) {
  const subject = `Scout AI: ${newsletter.headline}`;
  const preheader = newsletter.summary || "";
  const coinScan = newsletter.metadata?.coinScan || null;

  const htmlInsights = (newsletter.insights || [])
    .map(
      (insight) => `
        <li style="margin-bottom:14px;">
          <h3 style="margin:0;color:#0f172a;font-size:17px;">${escapeHtml(insight.title || "")}</h3>
          <p style="margin:6px 0;color:#1f2937;line-height:1.5;">${escapeHtml(
            insight.summary || "",
          )}</p>
          <p style="margin:4px 0;color:#dc2626;font-weight:600;">Threat: ${escapeHtml(
            insight.threatLevel || "Medium",
          )}</p>
          <p style="margin:4px 0;color:#0f766e;">Kid Reporter take: ${escapeHtml(
            insight.howToAvoid || "",
          )}</p>
        </li>
      `,
    )
    .join("");

  const htmlSources = (newsletter.sources || [])
    .map(
      (source) => `
        <li style="margin-bottom:6px;">
          <a href="${escapeAttr(source.uri)}" style="color:#2563eb;text-decoration:none;">
            ${escapeHtml(source.title || source.uri || "")}
          </a>
        </li>
      `,
    )
    .join("");

  const htmlCoin = coinScan
    ? `
    <section style="margin:20px 0 0;padding:16px;border:1px solid #e5e7eb;border-radius:12px;background:#f8fafc;">
      <h3 style="margin:0 0 8px;color:#0f172a;">Card Watch — Powered by Perplexity</h3>
      ${escapeHtml(coinScan.summary || "")}
      ${
        Array.isArray(coinScan.findings) && coinScan.findings.length
          ? `<ul style="padding-left:18px;margin:12px 0 0;">${coinScan.findings
              .map(
                (f) => `
              <li style="margin-bottom:10px;">
                <strong>${escapeHtml(f.title || "Watch")}</strong>: ${escapeHtml(
                  f.summary || "",
                )}
                <div style="color:#0f766e;">Move: ${escapeHtml(
                  f.howToAvoid || "",
                )}</div>
              </li>
            `,
              )
              .join("")}</ul>`
          : ""
      }
    </section>`
    : "";

  const html = `
    <div style="font-family:Inter,Arial,sans-serif;max-width:640px;margin:0 auto;padding:24px;background:#0f172a;color:#e2e8f0;">
      <p style="margin:0 0 8px;color:#a5b4fc;letter-spacing:0.2em;text-transform:uppercase;font-size:11px;">Scout AI + Kid Reporter</p>
      <h1 style="margin:0 0 12px;font-size:28px;line-height:1.2;color:#f8fafc;">${escapeHtml(
        newsletter.headline,
      )}</h1>
      <p style="margin:0 0 18px;color:#cbd5e1;">${escapeHtml(preheader)}</p>
      <ol style="list-style:none;padding:0;margin:0 0 16px;background:#ffffff;border-radius:16px;padding:18px;border:1px solid #e2e8f0;color:#0f172a;">
        ${htmlInsights}
      </ol>
      ${htmlCoin}
      ${
        htmlSources
          ? `<div style="margin-top:18px;">
          <h3 style="margin:0 0 6px;color:#e2e8f0;">Sources</h3>
          <ul style="padding-left:18px;margin:0;color:#cbd5e1;">${htmlSources}</ul>
        </div>`
          : ""
      }
      <p style="margin-top:20px;font-size:12px;color:#94a3b8;">
        You’re getting this because you subscribe to Scout AI drops. Brought to you by the Kid Reporter.
      </p>
    </div>
  `;

  const textParts = [
    `Scout AI: ${newsletter.headline}`,
    "",
    newsletter.summary || "",
  ];
  (newsletter.insights || []).forEach((insight, idx) => {
    textParts.push(
      "",
      `${idx + 1}. ${insight.title || "Insight"}`,
      `Summary: ${insight.summary || ""}`,
      `Threat: ${insight.threatLevel || "Medium"}`,
      `Move: ${insight.howToAvoid || ""}`,
    );
  });
  if (coinScan?.summary) {
    textParts.push("", "Card Watch:", coinScan.summary);
  }
  if ((coinScan?.findings || []).length) {
    coinScan.findings.forEach((f) => {
      textParts.push(
        "",
        `${f.title || "Finding"}`,
        `Summary: ${f.summary || ""}`,
        `Move: ${f.howToAvoid || ""}`,
      );
    });
  }
  if ((newsletter.sources || []).length) {
    textParts.push("", "Sources:");
    newsletter.sources.forEach((s) =>
      textParts.push(`- ${s.title || s.uri}: ${s.uri}`),
    );
  }

  return { subject, html, text: textParts.join("\n") };
}

function sanitizeJson(raw) {
  if (!raw || typeof raw !== "string") {
    throw new Error("Gemini response was empty");
  }
  const first = raw.indexOf("{");
  const last = raw.lastIndexOf("}");
  if (first === -1 || last === -1 || last < first) {
    throw new Error("Gemini returned invalid JSON");
  }
  return raw.slice(first, last + 1);
}

async function extractText(response) {
  if (!response) return "";
  if (typeof response.text === "function") {
    return response.text();
  }
  if (typeof response.text === "string") {
    return response.text;
  }
  const candidates = response.candidates || [];
  const parts = candidates[0]?.content?.parts;
  if (Array.isArray(parts)) {
    return parts
      .map((part) => (typeof part.text === "string" ? part.text : ""))
      .join("");
  }
  return "";
}

function textValue(value) {
  return typeof value === "string" ? value.trim() : "";
}

function normalizeThreatLevel(level) {
  const normalized = textValue(level).toLowerCase();
  if (normalized === "high") return "High";
  if (normalized === "medium") return "Medium";
  if (normalized === "low") return "Low";
  return "Medium";
}

async function safeJson(res) {
  try {
    return await res.json();
  } catch {
    return null;
  }
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function escapeAttr(value) {
  return escapeHtml(value).replace(/"/g, "&quot;");
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
