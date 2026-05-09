function sendMainMenu(bot, chatId) {
    const options = {
        reply_markup: JSON.stringify({
            inline_keyboard: [
                [{ text: '🎁 Bảng Giá Gamepass / Perm', callback_data: 'menu_gp' }],
                [{ text: '⏳ Robux 120H', callback_data: 'menu_rb120' }, { text: '🎮 Mua Acc', callback_data: 'menu_acc' }],
                [{ text: '🚀 Cày Thuê', callback_data: 'menu_boost' }, { text: '🎧 Gọi Sếp Phát', callback_data: 'menu_admin' }]
            ]
        })
    };
    bot.sendMessage(chatId, "Chào đằng ấy! Chọn dịch vụ bên dưới để tớ tư vấn lẹ cho nha 👇", options);
}
module.exports = { sendMainMenu };
