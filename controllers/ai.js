const Transaction = require('../models/Transaction');

// --- AI ALGORITHMS (Local Implementation) ---

// 1. NLP: Content Analysis
const performNLP = (text) => {
    if (!text) return [];
    const stopWords = ['the', 'at', 'in', 'on', 'for', 'to', 'and', 'a', 'of', 'via', 'with', 'my', 'is', 'it'];
    return text.toLowerCase()
        .replace(/[^\w\s]/gi, '')
        .split(' ')
        .filter(word => word.length > 2 && !stopWords.includes(word));
};

// 2. User Preference Vector
const createUserVector = (transactions) => {
    const total = transactions.reduce((acc, t) => acc + t.amount, 0);
    if (total === 0) return {};
    const vector = {};
    transactions.forEach(t => { vector[t.category] = (vector[t.category] || 0) + t.amount; });
    Object.keys(vector).forEach(key => { vector[key] = parseFloat((vector[key] / total).toFixed(4)); });
    return vector;
};

// 3. Cosine Similarity
const calculateSimilarity = (userVec, idealVec) => {
    const allCategories = new Set([...Object.keys(userVec), ...Object.keys(idealVec)]);
    let dotProduct = 0, magA = 0, magB = 0;
    allCategories.forEach(cat => {
        const a = userVec[cat] || 0;
        const b = idealVec[cat] || 0;
        dotProduct += a * b;
        magA += a * a;
        magB += b * b;
    });
    return (magA === 0 || magB === 0) ? 0 : (dotProduct / (Math.sqrt(magA) * Math.sqrt(magB)));
};

// --- GEMINI INTEGRATION (Optional Layer) ---
const fetchGeminiInsight = async (prompt) => {
    if (!process.env.GEMINI_API_KEY) return null;
    
    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GEMINI_API_KEY}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: prompt }] }]
            })
        });
        const data = await response.json();
        return data?.candidates?.[0]?.content?.parts?.[0]?.text || null;
    } catch (error) {
        console.error("Gemini API Error:", error);
        return null;
    }
};

// --- CONTROLLER ---

exports.getInsights = async (req, res) => {
    try {
        const userId = req.user.id;
        const transactions = await Transaction.find({ user: userId, type: 'expense' }).sort({ date: -1 }).limit(50);

        if (transactions.length === 0) {
             return res.json({ success: true, insights: [{ title: "No Data", description: "Add expenses to enable AI.", type: "info" }] });
        }

        const insights = [];

        // Run Local Algo
        const wordFreq = {};
        transactions.forEach(t => performNLP(t.description).forEach(w => wordFreq[w] = (wordFreq[w] || 0) + 1));
        const topKeyword = Object.keys(wordFreq).reduce((a, b) => wordFreq[a] > wordFreq[b] ? a : b, null);

        const userVector = createUserVector(transactions);
        const topCategory = Object.keys(userVector).reduce((a, b) => userVector[a] > userVector[b] ? a : b, 'None');
        
        const idealProfile = { 'Rent': 0.30, 'Food': 0.15, 'Groceries': 0.15, 'Transport': 0.10, 'Entertainment': 0.10, 'Savings': 0.20 };
        const similarityScore = calculateSimilarity(userVector, idealProfile);

        // Push Core Algo Insights
        if (topKeyword && wordFreq[topKeyword] > 1) {
            insights.push({ title: "Habit Detected (NLP)", description: `Frequent spending on "${topKeyword}" detected.`, type: "info", reason: "NLP Analysis" });
        }
        
        insights.push({
            title: "Saver Similarity",
            description: `Your spending matches ${(similarityScore * 100).toFixed(0)}% with the Ideal Model.`,
            type: similarityScore > 0.7 ? "success" : "warning",
            reason: "Cosine Similarity Vector"
        });

        // --- GEMINI ENHANCEMENT ---
        // We construct a prompt using the Algo data to get a "Human" summary
        const aiPrompt = `
            Act as a financial advisor.
            User Data:
            - Top Spending Category: ${topCategory}
            - Frequent Keyword: ${topKeyword || 'None'}
            - Match with Ideal Saver Profile: ${(similarityScore * 100).toFixed(0)}%
            
            Give a ONE sentence punchy, encouraging financial tip based on this data. Do not mention "vectors".
        `;

        const geminiResponse = await fetchGeminiInsight(aiPrompt);

        if (geminiResponse) {
            // If Gemini works, we add it as the premium "Headliner" insight
            insights.unshift({
                title: "AI Coach (Gemini)",
                description: geminiResponse,
                type: "purple", // Special color
                reason: "Generative AI"
            });
        }

        res.status(200).json({ success: true, insights });

    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, error: 'Server Error' });
    }
};
