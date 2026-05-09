const { GoogleGenerativeAI } = require('@google/generative-ai');

// Khởi tạo AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function handleKeywordResponse(bot, msg) {
    const chatId = msg.chat.id;
    const userText = msg.text;

    try {
        // CHIÊU CHỐT HẠ: Ép dùng API v1 và model chuẩn
        const model = genAI.getGenerativeModel({ 
            model: "gemini-1.5-flash" 
        }, { apiVersion: 'v1' }); // Dòng này sẽ dẹp sạch lỗi 404

        const chat = model.startChat({
            history: [],
            generationConfig: { maxOutputTokens: 500 }
        });

        const result = await chat.sendMessage(userText);
        const botReply = result.response.text();
        
        bot.sendMessage(chatId, botReply);

    } catch (error) {
        console.error("Lỗi AI Chi Tiết:", error);
        bot.sendMessage(chatId, "Vẫn đang lag sếp ơi, check lại API Key trên Render xem dán chuẩn chưa nha!");
    }
}

module.exports = { handleKeywordResponse };
