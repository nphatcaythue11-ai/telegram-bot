const { responses } = require('../data/templates');
const config = require('../../config');

function removeAccents(str) { return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase(); }

function handleKeywordResponse(bot, msg) {
    const chatId = msg.chat.id, rawText = msg.text.toLowerCase(), cleanText = removeAccents(rawText);
    bot.sendChatAction(chatId, 'typing');
    let replyPool = [], isChotDon = false;

    // ==============================================
    // ƯU TIÊN 1: CHỐT ĐƠN & GỬI BANK (QUAN TRỌNG NHẤT)
    // ==============================================
    if (cleanText.match(/\b(chot|muc|hup|lay luon|ok lay|mua lun|mua luon|mup)\b/)) { 
        replyPool = responses.chot_don; isChotDon = true; 
    }
    else if (cleanText.match(/\b(stk|bank|chuyen khoan|ck|thanh toan|so tai khoan|ngan hang|momo|atm|sdt)\b/)) { 
        replyPool = responses.bank_info; isChotDon = true; 
    }
    
    // ==============================================
    // ƯU TIÊN 2: CÁC DỊCH VỤ KHÁC
    // ==============================================
    else if (cleanText.match(/(gamepass|gift gp|gift pass|dark blade|yoru|x2 mastery|x2 tien|do trai|kho trai|storage)/)) {
        let gpText = `🎮 BẢNG GIÁ GAMEPASS (Rate ${config.rateRb}) 🎮\n\n`;
        for (let [name, rb] of Object.entries(config.gamepassList)) gpText += `🔹 ${name}: ${(rb * config.rateRb).toLocaleString('vi-VN')}đ\n`;
        replyPool = [gpText];
    }
    // HỎI ACC KHÁC
    else if (cleanText.match(/(acc khac|con khac|acc nao khac|them acc|con acc khong)/) && config.liveData.accKho.length > 0) {
        replyPool = ["Hết sạch rồi bro ơi, kho còn đúng nhiêu đó t show hết ra rồi. M không múc nhanh thằng khác húp á 🐧"];
    }
    // HỎI MUA ACC
    else if (cleanText.match(/\b(acc|nick|tai khoan|ac|ak|nich|njck|nit)\b/)) {
        if (config.liveData.accKho.length === 0) replyPool = ["Kho acc hiện đang trống 😭 Sếp Phát đang cày chưa up lên kịp."];
        else replyPool = [`Kho đang có sẵn hàng cho m nè:\n\n${config.liveData.accKho.map(a => `🔹 ${a}`).join('\n')}\n\nChốt con nào hô "Chốt + Tên Acc" t gửi bill luôn!`];
    }
    // HỎI HÀNG MỚI (Đã fix lỗi dính chữ "hot" trong "chot")
    else if (cleanText.match(/(san pham moi|mon moi|sp moi|dich vu moi|\bhot\b)/)) {
        if (config.liveData.newProducts.length === 0) replyPool = ["Chưa có món gì mới đâu m."];
        else replyPool = [`Hàng mới về nóng hổi đây bro ơi:\n\n${config.liveData.newProducts.map(p => `🎁 ${p}`).join('\n')}\n\nMúc thì gõ "Chốt"!`];
    }
    // ROBUX 120H
    else if (cleanText.match(/(120h|120 h|rb 120|robux 120|rb 5 ngay)/)) {
        replyPool = [`Bên tớ có Robux 120h siêu uy tín, rate ${config.rateRb}đ/1RB nha. M cần mua bao nhiêu RB?`];
    }
    // TRÁI VĨNH VIỄN
    else if (cleanText.match(/(perm|vinh vien|vv|trai)/)) {
        let foundFruit = null, fruitRb = 0;
        for (let [name, rb] of Object.entries(config.permFruits)) {
            if (cleanText.match(new RegExp(`\\b${name}\\b`, "i"))) { foundFruit = name.toUpperCase(); fruitRb = rb; break; }
        }
        if (foundFruit) replyPool = [`Trái ${foundFruit} vĩnh viễn (Perm) là ${fruitRb} Robux. Nhân Rate ${config.rateRb} thì giá là ${(fruitRb * config.rateRb).toLocaleString('vi-VN')}đ nha bro.`];
        else replyPool = [`💥 BẢNG GIÁ PERM HOT (Rate ${config.rateRb}) 💥\n🦊 Kitsune: ${(4000 * config.rateRb).toLocaleString('vi-VN')}đ\n🐆 Leopard: ${(3000 * config.rateRb).toLocaleString('vi-VN')}đ\n👉 M cần mua trái khác chat "Perm + Tên Trái" nha!`];
    }
    // CHÀO HỎI & CÀY THUÊ
    else if (cleanText.match(/\b(hi|chao|hello|alo|ê|e|helo|halo|hi shop)\b/)) replyPool = responses.greetings;
    else if (cleanText.match(/(cay thue|cay lv|treo may|treo acc|up lv|fam|farm|thue cay)/)) replyPool = responses.cay_thue;
    // MÁY TÍNH ROBUX
    else {
        const rbMatch = cleanText.match(/(\d+)\s*(rb|robux|r)\b/);
        if (rbMatch) replyPool = [`Gói ${rbMatch[1]} RB tính ra là ${(parseInt(rbMatch[1]) * config.rateRb).toLocaleString('vi-VN')}đ (Rate ${config.rateRb}). Chốt thì hô "Chốt"!`];
    }

    // NẾU KHÔNG HIỂU -> ÉP MENU
    if (replyPool.length === 0) {
        setTimeout(() => { bot.sendMessage(chatId, "Khúc này gõ lóng quá t chưa load kịp =))) Bấm nút đi bro 👇", { reply_markup: JSON.stringify({ inline_keyboard: [ [{ text: '🎁 Bảng Giá Gamepass / Perm', callback_data: 'menu_gp' }], [{ text: '⏳ Robux 120H', callback_data: 'menu_rb120' }, { text: '🎮 Mua Acc', callback_data: 'menu_acc' }], [{ text: '🚀 Cày Thuê', callback_data: 'menu_boost' }, { text: '🎧 Gọi Sếp Phát', callback_data: 'menu_admin' }] ] }) }); }, 1500); return;
    }

    const randomReply = replyPool[Math.floor(Math.random() * replyPool.length)];
    setTimeout(() => {
        bot.sendMessage(chatId, randomReply);
        // BÁO SẾP PHÁT KHI CÓ ĐƠN
        if (isChotDon) bot.sendMessage(config.adminId, `🔔 SẾP PHÁT ƠI CÓ KHÁCH CHỐT ĐƠN!\nKhách: @${msg.from.username || 'ẩn danh'}\nNội dung chat: ${msg.text}\nĐang đợi lúa về 0343603537...`);
    }, Math.min(Math.max(randomReply.length * 20, 1000), 2500));
}
module.exports = { handleKeywordResponse };
