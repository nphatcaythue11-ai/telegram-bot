const { responses } = require('../data/templates');
const config = require('../../config');

function removeAccents(str) {
    return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
}

function handleKeywordResponse(bot, msg) {
    const chatId = msg.chat.id;
    const rawText = msg.text.toLowerCase();
    const cleanText = removeAccents(rawText);

    bot.sendChatAction(chatId, 'typing');

    let replyPool = [];
    let isChotDon = false;

    // Bắt từ khóa
    if (cleanText.match(/(hi|chao|hello|alo|ê|e|helo|halo|hi shop)/)) {
        replyPool = responses.greetings;
    } 
    else if (cleanText.match(/(gia|nhieu tien|bao nhieu|nhiu|gia sao|bang gia|bn|may tien)/)) {
        replyPool = responses.ask_prices;
    } 
    else if (cleanText.match(/(acc|nick|tai khoan|ac|ak|nich|njck|nit)/)) {
        replyPool = responses.buy_acc;
    }
    else if (cleanText.match(/(cay thue|cay lv|treo may|treo acc|up lv|fam|farm|cay thue|thue cay)/)) {
        replyPool = responses.cay_thue;
    }
    else if (cleanText.match(/(chot|muc|hup|lay luon|ok lay|mua lun|mua luon|mup)/)) {
        replyPool = responses.chot_don;
        isChotDon = true; 
    }
    else if (cleanText.match(/(stk|bank|chuyen khoan|ck|thanh toan|so tai khoan|ngan hang|momo|atm|sdt)/)) {
        replyPool = responses.bank_info;
        isChotDon = true; 
    }
    else if (cleanText.match(/(robux|gamepass|rb|pass)/)) {
        replyPool = ["Robux dạo này rate ngon, m cần mua bao nhiêu?", "Gamepass hay Robux zin t đều có, ib số lượng m cần coi."];
    }
    else if (cleanText.match(/(admin|nguoi that|chu shop|phat|ad)/)) {
        replyPool = ["T là bot rep tự động của sếp Phát nè, m cần gọi sếp ra thì bấm nút Support nha.", "Sếp Phát đang bận làm đơn, m cứ dạo shop đi cần gì t tư vấn cho."];
    }

    // NẾU KHÔNG HIỂU -> ÉP BẤM MENU
    if (replyPool.length === 0) {
        setTimeout(() => {
            bot.sendMessage(chatId, "Khúc này gõ lóng quá t chưa load kịp ý m =))) Mày tìm gì thì bấm nút dưới này cho lẹ nha bro 👇", {
                reply_markup: JSON.stringify({
                    inline_keyboard: [
                        [{ text: '🎮 Mua Acc', callback_data: 'menu_acc' }, { text: '🚀 Cày Thuê', callback_data: 'menu_boost' }],
                        [{ text: '💸 Mua Robux', callback_data: 'menu_robux' }, { text: '🎧 Gọi Sếp Phát', callback_data: 'menu_admin' }]
                    ]
                })
            });
        }, 1500);
        return; 
    }

    // TRẢ LỜI NGẪU NHIÊN NẾU CÓ TỪ KHÓA
    const randomReply = replyPool[Math.floor(Math.random() * replyPool.length)];
    const delay = Math.min(Math.max(randomReply.length * 20, 1000), 2500);

    setTimeout(() => {
        bot.sendMessage(chatId, randomReply);

        // NẾU KHÁCH CHỐT ĐƠN -> BÁO ADMIN
        if (isChotDon) {
            bot.sendMessage(
                config.adminId, 
                `🔔 SẾP PHÁT ƠI CÓ KHÁCH CHỐT ĐƠN!\nKhách: @${msg.from.username || 'Không có username'}\nNội dung chat: ${msg.text}\nĐang đợi lúa về...`
            );
        }
    }, delay);
}

module.exports = { handleKeywordResponse };
