const express = require('express');
const cors = require('cors');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());

const analysisCache = new Map();

// --- AI Model Configuration ---
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "mock_key");

async function callGenerativeModel(prompt, isJson = false) {
    if (!process.env.GEMINI_API_KEY) {
        // Return a mock response if no API key is found
        if (isJson) return "{}"; // Return empty JSON object string
        return "This is a mock report due to a missing API key.";
    }
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
}

// --- Data Simulation Layer ---
const simulateDataAggregation = (query) => {
    console.log(`[Data Aggregator] Simulating data fetch for: "${query}"`);
    const isHighEnd = /Prizm|Silver|Gold|Patch|Auto/i.test(query);
    const isRookie = /Rookie|Wemby|Young/i.test(query);
    return {
        market_data: { sales: [(Math.random()*300+(isHighEnd?150:50)).toFixed(2),(Math.random()*300+(isHighEnd?160:45)).toFixed(2),(Math.random()*300+(isHighEnd?140:55)).toFixed(2)], avg_price: (Math.random()*300+(isHighEnd?155:50)).toFixed(2), velocity: isRookie?'High':'Medium' },
        player_stats: { recent: 'Averaging 28 PPG, 7 APG, 6 RPG in last 5 games.', injury_status: 'Healthy', schedule: '3 games in the next 7 days against mid-tier opponents.' },
        social_data: { hype_score: Math.floor(Math.random()*30+(isRookie?70:40)), top_tweets: [`"Just saw a PSA 10 of ${query} sell for a crazy price! The market is moving."`, `"${query} is the best card to invest in right now?"`] },
        pop_data: { psa10: Math.floor(Math.random()*500+(isHighEnd?50:500)).toString(), total: Math.floor(Math.random()*2000+1000).toString() },
    };
};

// --- AI Agent Layer ---

const callMarketAgent = async (market_data, pop_data) => {
    console.log('[Market Agent] Analyzing market data...');
    const prompt = `You are a Market Analyst for sports cards. Analyze the following sales data and population report. What are the key takeaways? Is the market heating up or cooling down? What is the risk associated with the population count? Provide a concise 2-3 sentence report.

    Data:
    - Recent Sales: ${market_data.sales.join(', 
)}
    - Average Price: ${market_data.avg_price}
    - Sales Velocity: ${market_data.velocity}
    - PSA 10 Population: ${pop_data.psa10}
    - Total Graded: ${pop_data.total}`;
    if (!process.env.GEMINI_API_KEY) return `The market shows a high velocity with an average price of ${market_data.avg_price}. The PSA 10 population of ${pop_data.psa10} is a potential risk if demand slows.`;
    return callGenerativeModel(prompt);
};

const callPlayerAgent = async (player_stats) => {
    console.log('[Player Agent] Analyzing player performance...');
    const prompt = `You are a Player Performance Analyst. Based on the player's recent stats and health, what is their current career trajectory? Are they performing well, and what is the short-term outlook based on their schedule? Provide a concise 2-3 sentence report.

    Data:
    - Recent Stats: ${player_stats.recent}
    - Injury Status: ${player_stats.injury_status}
    - Upcoming Schedule: ${player_stats.schedule}`;
    if (!process.env.GEMINI_API_KEY) return `The player is currently healthy and performing at a high level (${player_stats.recent}). Their upcoming schedule appears favorable for continued success.`;
    return callGenerativeModel(prompt);
};

const callHypeAgent = async (social_data) => {
    console.log('[Hype Agent] Analyzing social sentiment...');
    const prompt = `You are a Social Media Analyst in the sports card world. Based on the hype score and recent online conversations, what is the public sentiment around this player/card? Is it trending? Is the community excited or bearish? Provide a concise 2-3 sentence report.

    Data:
    - Hype Score: ${social_data.hype_score}/100
    - Top Conversations: "${social_data.top_tweets.join('", "')}"`;
    if (!process.env.GEMINI_API_KEY) return `Public sentiment is strong, with a Hype Score of ${social_data.hype_score}. Conversations indicate active interest and speculation in the market.`;
    return callGenerativeModel(prompt);
};

const callMasterScoutAgent = async (query, marketReport, playerReport, hypeReport) => {
    console.log('[Master Scout AI] Synthesizing agent reports...');
    const prompt = `
    You are "The Scout," the world's most insightful sports card analyst. You have received reports from your specialist agents. Your job is to synthesize their findings into a single, final investment thesis for the user, delivered as a JSON object. You will also generate a fun, hype-driven final take in the voice of "The Kid Reporter."

    **Card Query:** "${query}"

    **Agent Reports:**
    - Market Analyst Report: "${marketReport}"
    - Player Performance Report: "${playerReport}"
    - Social Hype Report: "${hypeReport}"

    **Your Task:**
    Based on the agent reports, generate a JSON object with the following fields and ONLY the JSON object:
    - "estimatedValue": A realistic current market value, as a string without the dollar sign (e.g., "450.00").
    - "valueTrend": A string, either "increasing", "decreasing", or "stable".
    - "shortTermOutlook": A 1-2 sentence analysis of the next 3 months.
    - "longTermOutlook": A 1-2 sentence analysis of the next 1-3 years.
    - "hypeMeter": A score from 0-100, as a number, based on the Hype Agent's report.
    - "riskAnalysis": Briefly mention the biggest risks based on the reports.
    - "kidReporterInsight": This is the final verdict. Frame it as an exciting, must-read take from "The Kid Reporter." Make it punchy and definitive.
    - "rarity": A plausible rarity for the card, like "Prizm Silver" or "Holo /99".`;

    if (!process.env.GEMINI_API_KEY) {
        return {
            estimatedValue: (Math.random() * 500 + 50).toFixed(2),
            valueTrend: 'increasing',
            shortTermOutlook: "Synthesizing agent reports suggests strong short-term potential based on market heat and player performance.",
            longTermOutlook: "All signs point to this being a solid long-term hold, a true cornerstone for any modern collection.",
            hypeMeter: Math.floor(Math.random() * 30 + 70),
            riskAnalysis: "The primary risk identified by the Market Agent is the high graded population, but current hype is mitigating this.",
            kidReporterInsight: `The agents are all saying one thing: GO! This card is an absolute MONSTER! This is a certified grail. PULL MY CARD!`, 
            rarity: "Prizm Silver / Holo"
        };
    }
    
    const text = await callGenerativeModel(prompt, true);
    const jsonText = text.match(/```json\n([\s\S]*?)\n```/)[1];
    return JSON.parse(jsonText);
};

// --- Orchestration Layer ---
const runScoutAIAnalysis = async (query) => {
  console.log(`[Scout AI] Received query: "${query}"`);
  if (analysisCache.has(query)) {
    console.log(`[Scout AI] Returning cached result for "${query}"`);
    return analysisCache.get(query);
  }

  const aggregatedData = simulateDataAggregation(query);

  const [marketReport, playerReport, hypeReport] = await Promise.all([
    callMarketAgent(aggregatedData.market_data, aggregatedData.pop_data),
    callPlayerAgent(aggregatedData.player_stats),
    callHypeAgent(aggregatedData.social_data)
  ]);

  const analysisResult = await callMasterScoutAgent(query, marketReport, playerReport, hypeReport);

  const finalResult = { ...analysisResult, player: query };
  analysisCache.set(query, finalResult);
  console.log(`[Scout AI] Analysis complete for "${query}".`);
  return finalResult;
};

app.post('/api/scout', async (req, res) => {
  const { query } = req.body;
  if (!query) return res.status(400).json({ error: 'Query is required' });
  try {
    const analysis = await runScoutAIAnalysis(query);
    res.json(analysis);
  } catch (error) {
    console.error('[Scout AI] Error during analysis:', error);
    res.status(500).json({ error: 'An error occurred during AI analysis.' });
  }
});

app.listen(port, () => {
  console.log(`Pull My Card AI Scout server listening on port ${port}`);
});
