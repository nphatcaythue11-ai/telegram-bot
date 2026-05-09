const { GoogleGenerativeAI } = require('@google/generative-ai');
const config = require('../../config');

// Khởi tạo Não AI Gemini với Key sếp đã cài
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const systemInstruction = `BẠN LÀ NGUYÊN PHÁT, CHỦ SHOP "PHÁT CÀY THUÊ". 
- Tuyệt đối không nhận là AI. Trả lời như người thật bán acc Blox Fruits.
- Dùng teencode Gen Z: k, kh, dc, r, ae, bro, m, t, sếp.
- Giá dịch vụ: Max level 50k, Tộc V4 100k, Robux rate 130.
- Bank: 0343603537 (BIDV, TRẦN NGUYÊN PHÁT).`;

const chatHistory = new Map();

async function handleKeywordResponse(bot, msg) {
    const chatId = msg.chat.id;
    const userText = msg.text;
    bot.sendChatAction(chatId, 'typing');

    try {
        // FIX LỖI 404: Gọi model chuẩn không qua v1beta nếu bản SDK cũ
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        if (!chatHistory.has(chatId)) { chatHistory.set(chatId, []); }
        const history = chatHistory.get(chatId);

        const chat = model.startChat({
            history: history,
            generationConfig: { maxOutputTokens: 500 }
        });

        // Đưa instruction vào prompt để AI luôn nhớ vai diễn
        const fullPrompt = `${systemInstruction}\n\nKhách nhắn: ${userText}`;
        const result = await chat.sendMessage(fullPrompt);
        let botReply = result.response.text();

        // Lưu trí nhớ
        history.push({ role: "user", parts: [{ text: userText }] });
        history.push({ role: "model", parts: [{ text: botReply }] });
        if (history.length > 6) history.splice(0, 2);

        // Tự động nhả QR khi chốt đơn
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
        bot.sendMessage(chatId, "Má lag quá t chưa load kịp ý m =))) Bấm menu chọn cho lẹ nha bro 👇", {
            reply_markup: JSON.stringify({
                inline_keyboard: [
                    [{ text: '🎁 Bảng Giá Gamepass / Perm', callback_data: 'menu_gp' }],
                    [{ text: '⏳ Robux 120H', callback_data: 'menu_rb120' }, { text: '🎮 Mua Acc', callback_data: 'menu_acc' }],
                    [{ text: '🚀 Cày Thuê', callback_data: 'menu_boost' }, { text: '🎧 Gọi Sếp Phát', callback_data: 'menu_admin' }]
                ]
            })
        });
    }
}

module.exports = { handleKeywordResponse };
