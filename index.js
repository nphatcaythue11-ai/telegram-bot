const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

app.get('/', (req, res) => { res.send('Máy chủ Phát Cày Thuê Bot đang hoạt động trơn tru!'); });
app.listen(port, () => { console.log(`[Web Server] Đang chạy trên port ${port}`); });

require('dotenv').config();
const TelegramBot = require('node-telegram-bot-api');
const { sendMainMenu } = require('./src/commands/menu');
const { handleKeywordResponse } = require('./src/handlers/messageHandler');
const config = require('./config');

const token = process.env.BOT_TOKEN;
if (!token) { console.error("❌ LỖI: Chưa tìm thấy BOT_TOKEN!"); process.exit(1); }

const bot = new TelegramBot(token, { polling: true });
const adminStates = new Map();

bot.on('message', (msg) => {
    if (!msg.text) return;
    const text = msg.text, chatId = msg.chat.id, fromId = msg.from.id.toString();

    if (fromId === config.adminId && adminStates.has(chatId)) {
        const state = adminStates.get(chatId);
        if (state === 'WAITING_FOR_ACC') {
            config.liveData.accKho.push(text); adminStates.delete(chatId);
            return bot.sendMessage(chatId, `✅ ĐÃ LÊN KỆ ACC MỚI:\n👉 ${text}`);
        }
        if (state === 'WAITING_FOR_SP') {
            config.liveData.newProducts.push(text); adminStates.delete(chatId);
            return bot.sendMessage(chatId, `✅ ĐÃ THÊM SẢN PHẨM MỚI:\n👉 ${text}`);
        }
    }

    if (text === '/start') return sendMainMenu(bot, chatId);

    if (text === '/admin') {
        if (fromId !== config.adminId) return bot.sendMessage(chatId, "❌ Cấm vào!");
        const options = { reply_markup: JSON.stringify({ inline_keyboard: [
            [{ text: '➕ Lên Kệ Acc', callback_data: 'admin_add_acc' }, { text: '❌ Báo Hết Acc', callback_data: 'admin_clear_acc' }],
            [{ text: '➕ Lên SP Mới', callback_data: 'admin_add_sp' }, { text: '❌ Dọn Sạch SP', callback_data: 'admin_clear_sp' }],
            [{ text: '📦 Xem Tình Trạng Kho', callback_data: 'admin_kho' }]
        ] }) };
        return bot.sendMessage(chatId, "👑 BẢNG ĐIỀU KHIỂN CỦA SẾP PHÁT:", options);
    }

    if (!text.startsWith('/')) handleKeywordResponse(bot, msg);
});

bot.on('callback_query', (query) => {
    const chatId = query.message.chat.id, fromId = query.from.id.toString(), data = query.data;
    let response = "";

    if (data.startsWith('admin_')) {
        if (fromId !== config.adminId) return bot.answerCallbackQuery(query.id, { text: "Cấm bấm bậy!", show_alert: true });
        switch(data) {
            case 'admin_add_acc': adminStates.set(chatId, 'WAITING_FOR_ACC'); response = "✍️ Sếp hãy soạn thông tin Acc muốn bán rồi gửi vào đây:"; break;
            case 'admin_clear_acc': config.liveData.accKho = []; response = "✅ Đã dọn sạch kho Acc!"; break;
            case 'admin_add_sp': adminStates.set(chatId, 'WAITING_FOR_SP'); response = "✍️ Sếp hãy soạn thông tin Sản phẩm mới gửi vào đây:"; break;
            case 'admin_clear_sp': config.liveData.newProducts = []; response = "✅ Đã dọn sạch Sản phẩm mới!"; break;
            case 'admin_kho':
                let khoText = "📦 KHO CỦA SẾP PHÁT:\n👉 Acc:\n" + (config.liveData.accKho.length ? config.liveData.accKho.map(a=>`- ${a}`).join('\n') : "- Hết sạch") + "\n\n👉 Sản phẩm mới:\n" + (config.liveData.newProducts.length ? config.liveData.newProducts.map(p=>`- ${p}`).join('\n') : "- Không có");
                response = khoText; break;
        }
        bot.sendMessage(chatId, response); return bot.answerCallbackQuery(query.id);
    }

    switch(data) {
        case 'menu_acc': response = config.liveData.accKho.length === 0 ? "Kho acc hiện đang trống mấy con báo rồi 😭" : "Kho đang có sẵn mấy con VIP nè:\n👉 " + config.liveData.accKho.join("\n👉 ") + "\n\nƯng con nào type 'Chốt + tên acc' t gửi bill!"; break;
        case 'menu_boost': response = "Nhận cày thuê uy tín. M muốn cày level hay cày đồ?"; break;
        case 'menu_rb120': response = `Robux 120H siêu mượt, rate ${config.rateRb}. M cần mua số lượng bao nhiêu thì gõ ra (VD: 1500 rb)!`; break;
        case 'menu_gp': response = "Gõ chữ 'Perm + Tên trái' (VD: Perm Kitsune) để tớ báo giá tự động nè."; break;
        case 'menu_admin': response = "Đợi xíu nha t hú sếp Nguyên Phát ra check."; bot.sendMessage(config.adminId, `🔔 Khách @${query.from.username || 'ẩn danh'} đang GỌI ADMIN!`); break;
    }

    if (response) bot.sendMessage(chatId, response);
    bot.answerCallbackQuery(query.id);
});
console.log('🚀 [Bot Telegram] Đã khởi chạy thành công!');
