const { GoogleGenerativeAI } = require('@google/generative-ai');
const config = require('../../config');

// Khởi tạo Não AI Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const systemInstruction = `BẠN LÀ NGUYÊN PHÁT, CHỦ SHOP "PHÁT CÀY THUÊ". BẠN LÀ NGƯỜI THẬT, MỘT GAME THỦ ROBLOX VÀ SELLER CHUYÊN NGHIỆP.
- KHÔNG BAO GIỜ nhận mình là AI. Trả lời như 1 thanh niên bán acc thật.
- Dùng teencode: k, kh, dc, r, ae, bro, m, t, sếp.
- Cụ thể: Max level 50k, Tộc V4 100k, Robux rate 130.
- Nếu khách muốn mua/bank/qr: Bảo khách bank vào 0343603537 (BIDV, TRẦN NGUYÊN PHÁT).`;

const chatHistory = new Map();

async function handleKeywordResponse(bot, msg) {
    const chatId = msg.chat.id;
    const userText = msg.text;

    bot.sendChatAction(chatId, 'typing');

    try {
        // FIX LỖI 404: Thay đổi cách gọi model chuẩn v1
        const model = genAI.getGenerativeModel({ 
            model: "gemini-1.5-flash", // Giữ nguyên tên model
        });

        if (!chatHistory.has(chatId)) { chatHistory.set(chatId, []); }
        const history = chatHistory.get(chatId);

        // Bổ sung system instruction vào tin nhắn đầu tiên để AI không quên bài
        const chat = model.startChat({
            history: history,
            generationConfig: { maxOutputTokens: 500 }
        });

        // Gộp instruction vào để AI luôn nhớ mình là ai
        const fullPrompt = `System: ${systemInstruction}\n\nUser: ${userText}`;
        const result = await chat.sendMessage(fullPrompt);
        let botReply = result.response.text();

        history.push({ role: "user", parts: [{ text: userText }] });
        history.push({ role: "model", parts: [{ text: botReply }] });
        if (history.length > 6) history.splice(0, 2);

        let isSendQR = false;
        if (botReply.toLowerCase().includes('qr') || botReply.includes('0343603537')) {
            isSendQR = true;
        }

        setTimeout(() => {
            if (isSendQR) {
                const qrImageLink = "https://img.vietqr.io/image/BIDV-0343603537-compact2.png?accountName=TRAN NGUYEN PHAT";
                bot.sendPhoto(chatId, qrImageLink, { caption: botReply });
                bot.sendMessage(config.adminId, `🔔 CÓ KHÁCH XIN QR: @${msg.from.username || 'ẩn danh'}`);
            } else {
                bot.sendMessage(chatId, botReply);
            }
        }, 1000);

    } catch (error) {
        console.error("Lỗi AI Chi Tiết:", error);
        bot.sendMessage(chatId, "Hệ thống đang bảo trì não xíu sếp ơi =))) Bấm menu chọn cho lẹ nha 👇", {
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
