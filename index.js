const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

// Web Server ảo để Render giữ bot sống 24/7
app.get('/', (req, res) => {
    res.send('Máy chủ Phát Cày Thuê Bot đang hoạt động trơn tru!');
});

app.listen(port, () => {
    console.log(`[Web Server] Đang chạy trên port ${port}`);
});

// --- CODE BOT TELEGRAM ---
require('dotenv').config();
const TelegramBot = require('node-telegram-bot-api');
const { sendMainMenu } = require('./src/commands/menu');
const { handleKeywordResponse } = require('./src/handlers/messageHandler');
const config = require('./config');

const token = process.env.BOT_TOKEN;
if (!token) {
    console.error("❌ LỖI: Chưa tìm thấy BOT_TOKEN. Hãy kiểm tra biến môi trường!");
    process.exit(1);
}

const bot = new TelegramBot(token, { polling: true });

bot.on('message', (msg) => {
    if (!msg.text) return;
    if (msg.text === '/start') return sendMainMenu(bot, msg.chat.id);
    if (!msg.text.startsWith('/')) handleKeywordResponse(bot, msg);
});

// XỬ LÝ KHI KHÁCH BẤM NÚT TỪ MENU
bot.on('callback_query', (query) => {
    const chatId = query.message.chat.id;
    let response = "";

    // Kịch bản trả lời khi khách bấm nút
    switch(query.data) {
        case 'menu_acc': 
            response = "Kho acc đang bao la, m cần tài chính tầm nhiêu tiền? Type con số ra đây t lấy acc cho lẹ."; 
            break;
        case 'menu_boost': 
            response = "Nhận cày thuê uy tín 10 điểm không có nhưng. M muốn cày level hay cày đồ? Type ra đi bro."; 
            break;
        case 'menu_rb120': 
        case 'menu_robux':
            response = `Bên tớ bán Robux 120H siêu mượt, rate ${config.rateRb}. M cần mua số lượng bao nhiêu thì gõ ra đây (VD: 1500 rb) t tính tiền cho!`; 
            break;
        case 'menu_gp': 
            response = "Tớ có bán full Trái Vĩnh Viễn (Perm) và Gamepass nha. Cậu gõ chữ 'Perm + Tên trái' (VD: Perm Kitsune) để tớ báo giá tự động nè."; 
            break;
        case 'menu_admin': 
            response = "Đợi xíu nha t hú sếp Nguyên Phát ra check. Sếp đang mải rep khách."; 
            // Tự động tag admin khi khách bấm nút gọi Sếp
            bot.sendMessage(config.adminId, `🔔 Sếp Phát ơi, khách @${query.from.username || 'ẩn danh'} đang bấm nút GỌI ADMIN hỗ trợ kìa!`);
            break;
        default:
            response = "Hệ thống đã ghi nhận.";
    }

    // Gửi câu trả lời & tắt cái icon xoay xoay trên nút bấm
    bot.sendMessage(chatId, response);
    bot.answerCallbackQuery(query.id);
});

console.log('🚀 [Bot Telegram] Đã khởi chạy thành công!');
