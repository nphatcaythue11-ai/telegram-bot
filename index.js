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

const token = process.env.BOT_TOKEN;
// Nếu token không tồn tại (chưa cài Env trên Render), báo lỗi rõ ràng
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

bot.on('callback_query', (query) => {
    bot.sendMessage(query.message.chat.id, "Hệ thống đang tải: " + query.data);
    bot.answerCallbackQuery(query.id);
});

console.log('🚀 [Bot Telegram] Đã khởi chạy thành công!');