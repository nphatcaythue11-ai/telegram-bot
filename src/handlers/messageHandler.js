const { responses } = require('../data/templates');
const config = require('../../config');

function removeAccents(str) {
    return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
}

function handleKeywordResponse(bot, msg) {
    const chatId = msg.chat.id;
    const cleanText = removeAccents(msg.text.toLowerCase());
    bot.sendChatAction(chatId, 'typing');

    let replyPool = responses.fallback;

    if (cleanText.match(/(hi|chao|hello|alo|ê|e)/)) replyPool = responses.greetings;
    else if (cleanText.match(/(gia|nhieu|gia sao)/)) replyPool = responses.ask_prices;
    else if (cleanText.match(/(acc|nick|tai khoan)/)) replyPool = responses.buy_acc;
    else if (cleanText.match(/(cay thue|cay lv)/)) replyPool = responses.cay_thue;
    else if (cleanText.match(/(stk|bank|chuyen khoan)/)) replyPool = responses.bank_info;

    const randomReply = replyPool[Math.floor(Math.random() * replyPool.length)];
    
    setTimeout(() => {
        bot.sendMessage(chatId, randomReply);
    }, 1500);
}
module.exports = { handleKeywordResponse };