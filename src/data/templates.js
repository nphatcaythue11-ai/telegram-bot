const responses = {
    greetings: [
        "Phát Cày Thuê xin chào! Cậu cần tư vấn gì thế ạ? 🥰",
        "Ui khách vip tới, nãy giờ đợi cậu nhắn á 🥺 Cậu cần tìm gì tớ tư vấn nha.",
        "Dạ shop nghe đây ạ, anh trai cần em hỗ trợ gì không?",
        "Chào người anh em thiện lành, vào đây là đúng ổ rùi đó =)))",
        "Bành trướng lãnh vực tư vấn! Mày cần mua gì nói t nghe lẹ nào 🐧",
        "Trời ơi rồng đến nhà tôm, sếp lượn shop em tìm món gì chốt đơn nào?",
        "Nghe.",
        "Cần gì?",
        "Alo.",
        "Hỏi lẹ đi đang bận cày rank nè pa 🐧",
        "Chào idol, nãy giờ lượn shop mỏi chân chưa, chốt được món nào không?",
        "Hello bro, dạo này game gủng sao rồi, vô đây t nâng cấp acc cho."
    ],
    ask_prices: [
        "Dạ bảng giá dịch vụ bên em: Max level 50k, Tộc V4 100k. Anh cần gói nào ạ?",
        "Max lv 50 cành nha bro, đang có flash sale nè múc lẹ không tí sếp Phát đổi giá á 🔥",
        "Max lv 50k thui, nma t khuyên thật m thêm 50k nữa lấy combo V4 cho khỏe, đi farm bao sướng.",
        "Đang deal ngon 50k max level nè, chốt lẹ chứ sắp hết slot cày rồi bro ơi.",
        "Kèo này keo lỳ nha: 50k max level, 100k lên thẳng V4. Chốt khum?",
        "Giá bên tớ 10 điểm không có nhưng nha: 50k max lv, múc liền đi chần chờ gì nữa.",
        "Giá thị trường sao t không biết chứ giá shop sếp Phát t để là rẻ nhất sàn: 50k max level.",
        "Lv 50k. V4 100k.",
        "50 cành max cấp nha m."
    ],
    buy_acc: [
        "Mua acc thì m coi cần build đường nào? PvP hay đi farm để t lựa cho con acc chuẩn chỉ.",
        "Shop Phát Cày Thuê dạo này toàn acc Kitsune với Leo vip thôi, tài chính ông bao nhiêu để t quăng ảnh cho?",
        "Acc bên tớ uy tín ngang ngửa thầy Gojo nha =))) Đưa tài chính đây tớ lấy acc cho.",
        "Cậu muốn tìm acc tầm giá bao nhiêu ạ? Tớ lôi tài khoản ngon nhất trong kho ra cho cậu nha 🌸",
        "Cầm bao nhiêu lúa trong tay rồi? Quăng con số ra đây t lựa acc ngon cho m quẩy tung Sea 3.",
        "Acc thì nhiều nma quan trọng là ông thích xài trái ác quỷ gì? Thích kiếm hay thích súng hơn?"
    ],
    cay_thue: [
        "Đưa acc đây t cày xuyên màn đêm cho. Sáng dậy là có acc max level quẩy.",
        "Farm tiền hay up lv t bao hết. Ông cần cày món gì báo t lên lịch làm luôn.",
        "Đang rảnh slot cày nè, m chốt nhanh t vô acc làm luôn không phải đợi đâu.",
        "Nhận cày thuê bao VIP PRO NO1 sever! Đưa nick đây t cân tất 💪",
        "Để t bế acc m lên 1 tầm cao mới, cày bao tốc độ luôn."
    ],
    bank_info: [
        "Chốt! VCB hoặc BIDV thẳng tiến. Nội dung: [Tên nick]. Bank xong vứt bill đây t xử lý lẹ.",
        "Lúa về là acc bay sang nha. STK đây: BIDV/VCB. Nội dung nhớ ghi tên m vô.",
        "Cậu chuyển khoản vô BIDV/Vietcombank nha, nhớ ghi đúng nội dung để tớ còn check bill cho cậu á 💖",
        "Nhận stk rồi thì ck nhanh t còn giữ acc cho, ck xong quăng bill vô đây tao check.",
        "Bạn vui lòng thanh toán qua Vietcombank hoặc BIDV nhé. Xác nhận bill xong bên mình sẽ giao hàng ngay.",
        "Tiền trao cháo múc nè. Quăng lúa vô BIDV đi người anh em, 5p sau có đồ chơi."
    ],
    chot_don: [
        "Ok chốt deal! Quăng lúa qua số 0343603537 (Momo/ZaloPay/Bank) nha m. Bank xong chụp bill t check lẹ.",
        "Nhanh gọn lẹ! Lúa ném thẳng vô SĐT 0343603537 nhé bro, nhận được tiền t làm liền cho nóng.",
        "Chốt luôn! Cậu chuyển khoản hoặc Momo vào số 0343603537 nha, ck xong hú tớ 1 tiếng 💖",
        "Keo lỳ! Bắn tiền qua số 0343603537 đi người anh em, xíu có đồ chơi quẩy rank.",
        "Uy tín 100%. Thông tin thanh toán qua SĐT: 0343603537. Chờ tiền nhảy là t giao hàng 🐧",
        "Chốt nha! Bank thẳng vô 0343603537, bắn tiền xong gửi hóa đơn vô đây tao xử lý."
    ],
    fallback: [ 
        "Ủa aloo? Gõ tiếng việt không dấu t đọc mù mắt quá, gõ lại đi ba =)))",
        "Ý là m đang hỏi cái gì? Lằng nhằng quá bấm vô cái menu ở dưới cho lẹ đi.",
        "Bị lú hả trời, t chưa load kịp. Bấm nút chọn dịch vụ đi bro.",
        "Đọc chả hiểu gì... Nay t lười dịch quá, m bấm nút cho lẹ nha.",
        "Tớ chưa hiểu ý cậu lắm 🥺 Cậu bấm vào các nút bên dưới để tớ hỗ trợ dễ hơn nha.",
        "Nói lại rõ ràng vào! Muốn mua gì thì type đúng tên dịch vụ ra đây không thì bấm nút."
    ]
};

module.exports = { responses };
