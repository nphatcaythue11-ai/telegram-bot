const { GoogleGenerativeAI } = require('@google/generative-ai');
const config = require('../../config');

// Khởi tạo Não AI Gemini (Dùng bản 1.5 Flash - Siêu nhanh & Miễn phí)
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// BÙA CHÚ TẨY NÃO AI - ÉP NÓ ĐÓNG VAI SẾP PHÁT
const systemInstruction = `BẠN LÀ NGUYÊN PHÁT, CHỦ SHOP "PHÁT CÀY THUÊ". BẠN LÀ NGƯỜI THẬT, MỘT GAME THỦ ROBLOX VÀ SELLER CHUYÊN NGHIỆP TRÊN TELEGRAM/FACEBOOK.
[LUẬT SINH TỬ - CẤM VI PHẠM]
1. KHÔNG BAO GIỜ nhận mình là AI, bot, trợ lý ảo. Trả lời như 1 thanh niên bán acc thật sự.
2. CẤM DÙNG TỪ NGỮ TRANG TRỌNG. Dùng teencode Gen Z: k, kh, dc, r, rùi, ae, bro, m, t, sếp, idol.
3. KHÔNG rep dài dòng máy móc. Khách hỏi gì rep đúng cái đó, cụt lủn cũng được nhưng phải đúng trọng tâm.
4. BẢNG GIÁ DỊCH VỤ: Max level 50k, Tộc V4 100k. Robux 120H siêu uy tín rate 130đ/1RB.
5. TƯ DUY BÁN HÀNG: Khách phân vân thì tạo FOMO (sắp hết hàng, người khác mua mất). Khách chê đắt thì khịa nhẹ "tiền nào của nấy bro ơi".
6. KHI KHÁCH CHỐT ĐƠN HOẶC HỎI QR/STK: Yêu cầu khách chuyển khoản vào số 0343603537 (BIDV, Trần Nguyên Phát). Bắt buộc phải có từ "QR" hoặc số điện thoại trong câu trả lời để hệ thống tự động gửi ảnh.
7. TÍNH TIỀN TỰ ĐỘNG: Khách hỏi giá Gamepass / Perm thì tự lấy số Robux nhân với rate 130đ. (Ví dụ: Kitsune 4000rb = 520.000đ).
8. THUẬT NGỮ: Hiểu cặn kẽ Sea 1 2 3, awk, raid, leo, dough, cdk, v4, pvp, max lvl... Khách nhắn sai chính tả hoặc viết tắt vẫn phải hiểu.`;

// Bộ nhớ siêu việt (Memory ngắn hạn để bot không bị ngáo)
const chatHistory = new Map();

async function handleKeywordResponse(bot, msg) {
    const chatId = msg.chat.id;
    const userText = msg.text;

    // Giả lập đang bấm điện thoại nhắn tin
    bot.sendChatAction(chatId, 'typing');

    try {
        const model = genAI.getGenerativeModel({ 
            model: "gemini-1.5-flash",
            systemInstruction: systemInstruction 
        });

        // Lấy lịch sử đoạn hội thoại trước đó của khách này
        if (!chatHistory.has(chatId)) {
            chatHistory.set(chatId, []);
        }
        const history = chatHistory.get(chatId);

        // Nạp lịch sử vào AI để bắt đầu chat
        const chat = model.startChat({
            history: history,
        });

        // Gửi câu nói của khách cho AI phân tích
        const result = await chat.sendMessage(userText);
        let botReply = result.response.text();

        // Lưu tin nhắn vào não bot (Lưu 10 tin gần nhất thôi cho nhẹ RAM Render)
        history.push({ role: "user", parts: [{ text: userText }] });
        history.push({ role: "model", parts: [{ text: botReply }] });
        if (history.length > 10) history.splice(0, 2);

        // ==============================================
        // LOGIC CHỐT ĐƠN: AI TỰ BẮN ẢNH QR VÀ BÁO SẾP
        // ==============================================
        let isSendQR = false;
        if (botReply.toLowerCase().includes('qr') || botReply.includes('0343603537')) {
            isSendQR = true;
        }

        // Delay một xíu cho giống người gõ phím
        setTimeout(() => {
            if (isSendQR) {
                // Đổi BIDV thành VCB nếu sếp dùng Vietcombank nhé
                const qrImageLink = "https://img.vietqr.io/image/BIDV-0343603537-compact2.png?accountName=TRAN NGUYEN PHAT";
                bot.sendPhoto(chatId, qrImageLink, { caption: botReply });
                bot.sendMessage(config.adminId, `🔔 SẾP PHÁT ƠI CÓ KHÁCH CHỐT ĐƠN / XIN QR!\nKhách: @${msg.from.username || 'ẩn danh'}\nĐang đợi lúa về SePay...`);
            } else {
                bot.sendMessage(chatId, botReply);
            }
        }, 1500);

    } catch (error) {
        console.error("Lỗi AI:", error);
        bot.sendMessage(chatId, "Má lag quá lag t chưa load kịp ý m =))) Bấm menu chọn lẹ cho t nha bro 👇", {
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
