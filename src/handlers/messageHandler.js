const { GoogleGenerativeAI } = require('@google/generative-ai');
const config = require('../../config');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const systemInstruction = `BẠN LÀ NGUYÊN PHÁT, CHỦ SHOP "PHÁT CÀY THUÊ". 
- Tuyệt đối không nhận là AI. Trả lời như 1 thanh niên bán acc thật, thân thiện, Gen Z.
- Dùng teencode: k, kh, dc, r, ae, bro, m, t, sếp.
- Giá: Max level 50k, Tộc V4 100k, Robux rate 130.
- Bank: 0343603537 (BIDV, TRẦN NGUYÊN PHÁT).`;

const chatHistory = new Map();

async function handleKeywordResponse(bot, msg) {
    const chatId = msg.chat.id;
    const userText = msg.text;
    bot.sendChatAction(chatId, 'typing');

    try {
        // FIX LỖI 404: Dùng model bản mới nhất của Google
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest" });

        if (!chatHistory.has(chatId)) chatHistory.set(chatId, []);
        const history = chatHistory.get(chatId);

        const chat = model.startChat({
            history: history,
            generationConfig: { maxOutputTokens: 500 }
        });

        // Gửi tin nhắn kèm vai diễn
        const result = await chat.sendMessage(`${systemInstruction}\n\nKhách hỏi: ${userText}`);
        const botReply = result.response.text();

        history.push({ role: "user", parts: [{ text: userText }] });
        history.push({ role: "model", parts: [{ text: botReply }] });
        if (history.length > 6) history.splice(0, 2);

        // Tự động nhả QR khi khách cần thanh toán
        if (botReply.toLowerCase().includes('qr') || botReply.includes('0343603537')) {
            const qrImageLink = "https://img.vietqr.io/image/BIDV-0343603537-compact2.png?accountName=TRAN NGUYEN PHAT";
            bot.sendPhoto(chatId, qrImageLink, { caption: botReply });
        } else {
            bot.sendMessage(chatId, botReply);
        }

    } catch (error) {
        console.error("Lỗi AI Chi Tiết:", error);
        bot.sendMessage(chatId, "Má lag quá t chưa load kịp ý m =))) Bấm menu chọn cho lẹ nha bro 👇");
    }
}

module.exports = { handleKeywordResponse };
