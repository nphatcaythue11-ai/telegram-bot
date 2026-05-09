const { GoogleGenerativeAI } = require('@google/generative-ai');

// Khởi tạo AI với mã sếp lấy từ Google AI Studio
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const systemInstruction = `BẠN LÀ NGUYÊN PHÁT, CHỦ SHOP "PHÁT CÀY THUÊ". 
- Tuyệt đối không nhận là AI. Trả lời như người thật bán acc Blox Fruits.
- Dùng teencode: k, kh, dc, r, ae, bro, m, t, sếp.
- Bank: 0343603537 (BIDV, TRẦN NGUYÊN PHÁT).`;

async function handleKeywordResponse(bot, msg) {
    const chatId = msg.chat.id;
    try {
        // ĐÃ CẬP NHẬT: Gọi đúng model Gemini 2.5 Pro
        const model = genAI.getGenerativeModel({ 
            model: "gemini-2.5-pro" 
        }, { apiVersion: 'v1' }); // Ép dùng v1 cho ổn định

        const result = await model.generateContent(`${systemInstruction}\n\nKhách: ${msg.text}`);
        const response = await result.response;
        const botReply = response.text();
        
        bot.sendMessage(chatId, botReply);
    } catch (error) {
        console.error("Lỗi:", error);
        bot.sendMessage(chatId, "Não 2.5 Pro đang tải, sếp check lại API Key trên Render giúp Phát nhé!");
    }
}
module.exports = { handleKeywordResponse };
