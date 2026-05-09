function sendMainMenu(bot, chatId) {
    const options = {
        reply_markup: JSON.stringify({
            inline_keyboard: [
                [{ text: '💸 Bảng Giá', callback_data: 'menu_price' }, { text: '🎮 Mua Acc', callback_data: 'menu_acc' }],
                [{ text: '🚀 Cày Thuê', callback_data: 'menu_boost' }]
            ]
        })
    };
    bot.sendMessage(chatId, "Chào đằng ấy! Chọn dịch vụ bên dưới để tớ tư vấn lẹ cho nha 👇", options);
}
module.exports = { sendMainMenu };