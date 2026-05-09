const { GoogleGenerativeAI } = require('@google/generative-ai');

// Khởi tạo AI với Key từ Render
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const systemInstruction = `BẠN LÀ NGUYÊN PHÁT, CHỦ SHOP "PHÁT CÀY THUÊ". 
- Tuyệt đối không nhận là AI. Trả lời như 1 thanh niên bán acc thật, thân thiện, dùng teencode nhẹ.
- Giá: Max level 50k, Tộc V4 100k, Robux rate 130.
- Bank: 0343603537 (BIDV, TRẦN NGUYÊN PHÁT).`;

const chatHistory = new Map();

async function handleKeywordResponse(bot, msg) {
    const chatId = msg.chat.id;
    const userText = msg.text;
    bot.sendChatAction(chatId, 'typing');

    try {
        // FIX LỖI 404: Ép sử dụng API v1 ổn định
        const model = genAI.getGenerativeModel({ 
            model: "gemini-1.5-flash" 
        }, { apiVersion: 'v1' });

        if (!chatHistory.has(chatId)) chatHistory.set(chatId, []);
        const history = chatHistory.get(chatId);

        const chat = model.startChat({
            history: history,
            generationConfig: { maxOutputTokens: 500 }
        });

        const result = await chat.sendMessage(`System Instruction: ${systemInstruction}\n\nKhách hỏi: ${userText}`);
        const botReply = result.response.text();

        // Lưu lịch sử để bot có trí nhớ
        history.push({ role: "user", parts: [{ text: userText }] });
        history.push({ role: "model", parts: [{ text: botReply }] });
        if (history.length > 6) history.splice(0, 2);

        // Tự động nhận diện chốt đơn để bắn QR
        const isNeedBank = botReply.toLowerCase().includes('qr') || 
                          botReply.includes('0343603537') || 
                          botReply.toLowerCase().includes('stk');

        if (isNeedBank) {
            const qrImage = "https://img.vietqr.io/image/BIDV-0343603537-compact2.png?accountName=TRAN NGUYEN PHAT";
            bot.sendPhoto(chatId, qrImage, { caption: botReply });
        } else {
            bot.sendMessage(chatId, botReply);
        }

    } catch (error) {
        console.error("Lỗi AI:", error);
        bot.sendMessage(chatId, "Má nó lag quá sếp ơi, đợi t tí hoặc check lại API Key trên Render xem dán chuẩn chưa nha!");
    }
}

module.exports = { handleKeywordResponse };
