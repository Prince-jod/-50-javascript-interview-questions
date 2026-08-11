const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
});

const categories = [
    "Food",
    "Travel",
    "Shopping",
    "Bills",
    "Entertainment",
    "Health",
    "Education",
    "Other",
];

async function categorizeExpense(description) {
    const prompt = `
You are an expense categorization assistant.

Categorize the following expense into exactly ONE of these categories:

${categories.join(", ")}

Expense description:
"${description}"

Return ONLY the category name.
Do not return any explanation.
`;

    const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
    });

    const category = response.text.trim();

    // Make sure Gemini returns only a category we allow
    if (categories.includes(category)) {
        return category;
    }

    return "Other";
}

module.exports = {
    categorizeExpense,
};