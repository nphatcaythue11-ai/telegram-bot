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

    // 1. TÍNH NĂNG BÁO GIÁ GIFT GAMEPASS TỰ ĐỘNG
    if (cleanText.match(/(gamepass|gift gp|gift pass|dark blade|yoru|x2 mastery|x2 tien|do trai|kho trai|storage)/)) {
        let gpText = `🎮 BẢNG GIÁ GIFT GAMEPASS (Rate ${config.rateRb}đ/1RB) 🎮\n\n`;
        for (let [name, rb] of Object.entries(config.gamepassList)) {
            let price = (rb * config.rateRb).toLocaleString('vi-VN'); 
            gpText += `🔹 ${name}: ${price}đ\n`;
        }
        gpText += `\nCần múc món nào m cứ hô "Chốt + tên món" nha.`;
        replyPool = [gpText];
    }
    // 2. TÍNH NĂNG TƯ VẤN ROBUX 120H
    else if (cleanText.match(/(120h|120 h|rb 120|robux 120|rb 5 ngay)/)) {
        replyPool = [
            `Bên tớ có Robux 120h siêu uy tín, rate ${config.rateRb}đ/1RB nha. M cần mua bao nhiêu RB?`,
            `RB 120h rate ${config.rateRb} nha bro. Cần mua số lượng thì gõ số RB ra đây t tính tiền cho.`,
            `Robux 120h (5 ngày done) - Đang xài Rate ${config.rateRb} rẻ nhất thị trường. Múc nhiêu báo Sếp Phát nha!`
        ];
    }
    // 3. TÍNH NĂNG QUÉT TÊN TRÁI VĨNH VIỄN TỰ ĐỘNG
    else if (cleanText.match(/(perm|vinh vien|vv|trai)/)) {
        let foundFruit = null;
        let fruitRb = 0;
        
        for (let [name, rb] of Object.entries(config.permFruits)) {
            let regex = new RegExp(`\\b${name}\\b`, "i");
            if (cleanText.match(regex)) {
                foundFruit = name.toUpperCase();
                fruitRb = rb;
                break; 
            }
        }

        if (foundFruit) {
            let price = (fruitRb * config.rateRb).toLocaleString('vi-VN');
            replyPool = [
                `Trái ${foundFruit} vĩnh viễn (Perm) là ${fruitRb} Robux. Nhân Rate ${config.rateRb} thì giá là ${price}đ nha bro.`,
                `Perm ${foundFruit} = ${price} cành nha. Báo giá lẹ vậy đã đủ uy tín chưa sếp? Chốt thì hô "Chốt" t gửi bill.`,
                `Sếp Phát báo giá Perm ${foundFruit}: ${price} VNĐ nha m. Rẻ nhất thị trường rồi đó chốt đi 🐧`
            ];
        } else {
            replyPool = [
                `💥 BẢNG GIÁ PERM HOT (Rate ${config.rateRb}) 💥\n\n` +
                `🦊 Kitsune: ${(4000 * config.rateRb).toLocaleString('vi-VN')}đ\n` +
                `🐆 Leopard: ${(3000 * config.rateRb).toLocaleString('vi-VN')}đ\n` +
                `🍩 Mochi: ${(2400 * config.rateRb).toLocaleString('vi-VN')}đ\n` +
                `🦖 T-Rex: ${(2350 * config.rateRb).toLocaleString('vi-VN')}đ\n` +
                `🌀 Portal: ${(2000 * config.rateRb).toLocaleString('vi-VN')}đ\n` +
                `🧘‍♂️ Buddha: ${(1650 * config.rateRb).toLocaleString('vi-VN')}đ\n\n` +
                `👉 M cần mua trái khác thì cứ chat "Perm + Tên Trái" (VD: Perm Ice, Perm Magma), t báo giá cho!`
            ];
        }
    }
    // 4. CÁC TỪ KHÓA CƠ BẢN
    else if (cleanText.match(/(hi|chao|hello|alo|ê|e|helo|halo|hi shop)/)) {
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
    else if (cleanText.match(/(admin|nguoi that|chu shop|phat|ad)/)) {
        replyPool = ["T là bot rep tự động của sếp Phát nè, m cần gọi sếp ra thì bấm nút Support nha.", "Sếp Phát đang bận làm đơn, m cứ dạo shop đi cần gì t tư vấn cho."];
    }
    // 5. MÁY TÍNH TỰ ĐỘNG (Bắt khách gõ số + rb)
    else {
        const rbMatch = cleanText.match(/(\d+)\s*(rb|robux|r)/);
        if (rbMatch) {
            let amount = parseInt(rbMatch[1]);
            let calculatedPrice = (amount * config.rateRb).toLocaleString('vi-VN'); 
            
            replyPool = [
                `Gói ${amount} RB của m tính ra là ${calculatedPrice}đ nha (Rate ${config.rateRb}). Chốt thì hô "Chốt" t ném SĐT cho!`,
                `${amount} Robux = ${calculatedPrice} cành nha bro. Báo giá lẹ vậy đã keo lỳ chưa?`,
                `Máy tính báo: ${amount} RB x ${config.rateRb} = ${calculatedPrice} VNĐ nha. Dứt luôn khum người anh em?`
            ];
        }
    }

    // 6. ÉP BẤM MENU NẾU KHÔNG HIỂU (SMART FALLBACK)
    if (replyPool.length === 0) {
        setTimeout(() => {
            bot.sendMessage(chatId, "Khúc này gõ lóng quá t chưa load kịp ý m =))) Mày tìm gì thì bấm nút dưới này cho lẹ nha bro 👇", {
                reply_markup: JSON.stringify({
                    inline_keyboard: [
                        [{ text: '🎁 Bảng Giá Gamepass / Perm', callback_data: 'menu_gp' }],
                        [{ text: '⏳ Robux 120H', callback_data: 'menu_rb120' }, { text: '🎮 Mua Acc', callback_data: 'menu_acc' }],
                        [{ text: '🚀 Cày Thuê', callback_data: 'menu_boost' }, { text: '🎧 Gọi Sếp Phát', callback_data: 'menu_admin' }]
                    ]
                })
            });
        }, 1500);
        return; 
    }

    // TRẢ LỜI NGẪU NHIÊN VÀ BÁO ADMIN
    const randomReply = replyPool[Math.floor(Math.random() * replyPool.length)];
    const delay = Math.min(Math.max(randomReply.length * 20, 1000), 2500);

    setTimeout(() => {
        bot.sendMessage(chatId, randomReply);

        if (isChotDon) {
            bot.sendMessage(
                config.adminId, 
                `🔔 SẾP PHÁT ƠI CÓ KHÁCH CHỐT ĐƠN!\nKhách: @${msg.from.username || 'Không có username'}\nNội dung chat: ${msg.text}\nĐang đợi lúa về 0343603537...`
            );
        }
    }, delay);
}

module.exports = { handleKeywordResponse };
