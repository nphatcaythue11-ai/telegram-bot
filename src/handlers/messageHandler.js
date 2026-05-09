const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function handleKeywordResponse(bot, msg) {
    const chatId = msg.chat.id;
    try {
        // Gọi thẳng model chuẩn của bản 0.11.1
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const result = await model.generateContent(msg.text);
        const response = await result.response;
        bot.sendMessage(chatId, response.text());
    } catch (error) {
        console.error("Loi:", error);
        bot.sendMessage(chatId, "Lỗi rồi sếp ơi, check lại API Key trên Render xem dán đúng chưa!");
    }
}
module.exports = { handleKeywordResponse };
