const { GoogleGenerativeAI } = require('@google/generative-ai');
const config = require('../../config');

// Khởi tạo AI với Key sếp đã cài trên Render
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const systemInstruction = `BẠN LÀ NGUYÊN PHÁT, CHỦ SHOP "PHÁT CÀY THUÊ". 
- Tuyệt đối không nhận là AI. Trả lời như người thật bán acc Blox Fruits.
- Dùng teencode: k, kh, dc, r, ae, bro, m, t, sếp.
- Bank: 0343603537 (BIDV, TRẦN NGUYÊN PHÁT).`;

const chatHistory = new Map();

async function handleKeywordResponse(bot, msg) {
    const chatId = msg.chat.id;
    const userText = msg.text;
    bot.sendChatAction(chatId, 'typing');

    try {
        // SỬA LỖI 404: Dùng model chính xác không có tiền tố thừa
        const model = genAI.getGenerativeModel({ 
            model: "gemini-1.5-flash-latest" // Thêm chữ -latest để chắc chắn có não
        });

        if (!chatHistory.has(chatId)) { chatHistory.set(chatId, []); }
        const history = chatHistory.get(chatId);

        const chat = model.startChat({
            history: history,
            generationConfig: { maxOutputTokens: 400 }
        });

        // Nạp hướng dẫn nhân vật vào mỗi câu chat
        const result = await chat.sendMessage(`System: ${systemInstruction}\n\nKhách: ${userText}`);
        let botReply = result.response.text();

        // Lưu trí nhớ ngắn hạn
        history.push({ role: "user", parts: [{ text: userText }] });
        history.push({ role: "model", parts: [{ text: botReply }] });
        if (history.length > 6) history.splice(0, 2);

        // Tự động bắn QR khi khách muốn chốt đơn
        let isSendQR = botReply.toLowerCase().includes('qr') || botReply.includes('0343603537');

        setTimeout(() => {
            if (isSendQR) {
                const qrImageLink = "https://img.vietqr.io/image/BIDV-0343603537-compact2.png?accountName=TRAN NGUYEN PHAT";
                bot.sendPhoto(chatId, qrImageLink, { caption: botReply });
            } else {
                bot.sendMessage(chatId, botReply);
            }
        }, 1000);

    } catch (error) {
        console.error("Lỗi AI Chi Tiết:", error);
        bot.sendMessage(chatId, "Má lag quá t chưa load kịp ý m =))) Bấm menu chọn cho lẹ nha bro 👇");
    }
}

module.exports = { handleKeywordResponse };
