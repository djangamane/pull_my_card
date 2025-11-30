const express = require('express');
const cors = require('cors');

// This is a placeholder for a real AI model call.
// In a production environment, this would be a call to an LLM API (e.g., OpenAI, Anthropic, Google AI).
// For this simulation, we are using a simplified internal generation capability.
const { GoogleGenerativeAI } = require('@google/generative-ai');

const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());

// In-memory cache to avoid redundant API calls for the same query
const analysisCache = new Map();

// --- Data Simulation Layer ---
/**
 * Simulates fetching and aggregating data from multiple real-world APIs.
 * @param {string} query - The user's search query.
 * @returns {object} A structured object of realistic, but simulated, data.
 */
const simulateDataAggregation = (query) => {
    console.log(`[Data Aggregator] Simulating data fetch for: "${query}"`);
    const isHighEnd = /Prizm|Silver|Gold|Patch|Auto/i.test(query);
    const isRookie = /Rookie|Wemby|Young/i.test(query);

    return {
        market_data: {
            sales: [
                (Math.random() * 300 + (isHighEnd ? 150 : 50)).toFixed(2),
                (Math.random() * 300 + (isHighEnd ? 160 : 45)).toFixed(2),
                (Math.random() * 300 + (isHighEnd ? 140 : 55)).toFixed(2),
            ],
            avg_price: (Math.random() * 300 + (isHighEnd ? 155 : 50)).toFixed(2),
            velocity: isRookie ? 'High' : 'Medium',
        },
        player_stats: {
            recent: 'Averaging 28 PPG, 7 APG, 6 RPG in last 5 games.',
            injury_status: 'Healthy',
            schedule: '3 games in the next 7 days against mid-tier opponents.',
        },
        social_data: {
            hype_score: Math.floor(Math.random() * 30 + (isRookie ? 70 : 40)), // 40-70 for normal, 70-100 for rookies
            top_tweets: [
                `"Just saw a PSA 10 of ${query} sell for a crazy price! The market is moving."`,
                `"Is ${query} the best card to invest in right now?"`,
            ],
        },
        pop_data: {
            psa10: Math.floor(Math.random() * 500 + (isHighEnd ? 50 : 500)).toString(),
            total: Math.floor(Math.random() * 2000 + 1000).toString(),
        },
    };
};


// --- AI Analysis Layer ---
/**
 * This function constructs the prompt and calls the AI model.
 * @param {string} query - The user's search query.
 * @param {object} aggregatedData - The data object from the simulation layer.
 * @returns {Promise<object>} The parsed JSON output from the AI model.
 */
const callMasterScoutAgent = async (query, aggregatedData) => {
    console.log('[Master Scout AI] Preparing prompt and calling generative model...');
    
    // For local development, we can use a mock or a real API key if available.
    // IMPORTANT: In a real app, this key should NEVER be hardcoded. Use environment variables.
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "mock_key");
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const prompt = `
    You are "The Scout," the world's most insightful sports card analyst. Your job is to synthesize data from multiple sources to provide a clear, actionable investment recommendation for a user. You have the voice of a sharp, confident expert, but you will deliver the final "take" in the fun, hype-driven style of "The Kid Reporter."

    **Card Query:** "${query}"

    **Data Analysis:**
    Here is the data you must analyze:
    1.  **Market Data (Last 30 Days):**
        - Recent Sales: ${aggregatedData.market_data.sales.join(', 
)}
        - Average Price: ${aggregatedData.market_data.avg_price}
        - Sales Velocity: ${aggregatedData.market_data.velocity}
    2.  **Player Performance:**
        - Recent Stats: ${aggregatedData.player_stats.recent}
        - Injury Status: ${aggregatedData.player_stats.injury_status}
    3.  **Social Sentiment:**
        - Hype Level: ${aggregatedData.social_data.hype_score}/100
        - Key Conversations: ${aggregatedData.social_data.top_tweets.join('; ')}
    4.  **Grading Population:**
        - PSA 10 Population: ${aggregatedData.pop_data.psa10}
        - Total Graded: ${aggregatedData.pop_data.total}

    **Your Task:**
    Based on all the data above, generate a JSON object with the following fields and ONLY the JSON object:
    - "estimatedValue": A realistic current market value, as a string without the dollar sign.
    - "valueTrend": A string, either "increasing", "decreasing", or "stable".
    - "shortTermOutlook": A 1-2 sentence analysis of the next 3 months.
    - "longTermOutlook": A 1-2 sentence analysis of the next 1-3 years.
    - "hypeMeter": A score from 0-100, as a number.
    - "riskAnalysis": Briefly mention the biggest risks (e.g., "high population," "injury prone," "cooling market").
    - "kidReporterInsight": This is the final verdict. Frame it as an exciting, must-read take from "The Kid Reporter." Make it punchy and definitive.
    - "rarity": A plausible rarity for the card, like "Prizm Silver" or "Holo /99".
    `;

    // If we don't have a real API key, return a sophisticated mock response.
    if (!process.env.GEMINI_API_KEY) {
        console.log('[Master Scout AI] No API Key found. Returning a sophisticated mock response.');
        return {
            estimatedValue: aggregatedData.market_data.avg_price,
            valueTrend: aggregatedData.market_data.velocity === 'High' ? 'increasing' : 'stable',
            shortTermOutlook: "The player's strong performance and high market velocity suggest continued upward momentum.",
            longTermOutlook: "Considered a cornerstone card for modern collections, its long-term value is solid.",
            hypeMeter: aggregatedData.social_data.hype_score,
            riskAnalysis: `The PSA 10 population of ${aggregatedData.pop_data.psa10} is something to watch, but current demand is absorbing the supply.`,
            kidReporterInsight: `This card is an absolute MONSTER! I saw one at the National and it was GLOWING. If you can get your hands on one, DO IT! This is a certified grail. PULL MY CARD!`,
            rarity: "Prizm Silver / Holo"
        };
    }

    // This is where the actual call to the AI model would happen.
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Clean up the response to get only the JSON
    const jsonText = text.match(/```json\n([\s\S]*?)\n```/)[1];
    return JSON.parse(jsonText);
};


/**
 * Orchestrates the AI analysis workflow.
 * @param {string} query - The user's search query about a sports card.
 * @returns {Promise<object>} - A promise that resolves to the AI analysis object.
 */
const runScoutAIAnalysis = async (query) => {
  console.log(`[Scout AI] Received query: "${query}"`);

  if (analysisCache.has(query)) {
    console.log(`[Scout AI] Returning cached result for "${query}"`);
    return analysisCache.get(query);
  }

  // 1. Get Aggregated Data
  const aggregatedData = simulateDataAggregation(query);

  // 2. Call the Master Scout AI Agent
  const analysisResult = await callMasterScoutAgent(query, aggregatedData);

  // 3. Add the player query to the final result and cache it
  const finalResult = { ...analysisResult, player: query };
  analysisCache.set(query, finalResult);
  console.log(`[Scout AI] Analysis complete for "${query}".`);

  return finalResult;
};

app.post('/api/scout', async (req, res) => {
  const { query } = req.body;

  if (!query) {
    return res.status(400).json({ error: 'Query is required' });
  }

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
