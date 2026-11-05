/* ============================================================
   FRAME TEMPLATES — khung của OtterBooth
   Danh sách = đúng các file đang có trong assets/frames/templates/.
   - Khung đã khoét lỗ trong suốt: ảnh nằm dưới, khung đè lên trên.
   - key: true  = file còn ô caro/trắng; lúc chạy trang tự làm trong suốt
                  phần caro/trắng trong mỗi ô (không tạo file mới).
   - w,h       : kích thước canvas (px)   - slots : ô ảnh, ảnh tự vừa ô
   - group     : nhóm trong bảng chọn khung (theo số ảnh) + nhóm Khung Rái Cá (assets/frames/*.png)
   - duplicate : khi In xếp 2 dải trên 1 tờ 4x6
   ============================================================ */
(function () {
  'use strict';
  const base = 'assets/frames/templates/';
  const old  = 'assets/frames/';
  window.FRAME_TEMPLATES = [
    { id: 'kraftStrip', name: '🤎 Giấy Mộc', group: '🎞️ Khung 2–3 Ảnh', overlay: base + 'kraftStrip.webp', w: 435, h: 1200, duplicate: true,
      slots: [{ x: 28, y: 48, w: 379, h: 349 }, { x: 28, y: 423, w: 379, h: 349 }, { x: 28, y: 798, w: 379, h: 349 }] },
    { id: 'doodleCloud', name: '☁️ Mây Doodle', group: '🎞️ Khung 2–3 Ảnh', overlay: base + 'đoole.webp', key: true, w: 411, h: 1200, duplicate: true,
      slots: [{ x: 18, y: 61, w: 370, h: 349 }, { x: 43, y: 442, w: 327, h: 334 }, { x: 23, y: 814, w: 365, h: 338 }] },
    { id: 'redStar', name: '⭐ Sao Đỏ', group: '🎞️ Khung 2–3 Ảnh', overlay: base + 'redStar.webp', w: 675, h: 1200,
      slots: [{ x: 131, y: 71, w: 421, h: 283 }, { x: 227, y: 437, w: 361, h: 261 }, { x: 147, y: 760, w: 452, h: 254 }] },
    { id: 'butterfly', name: '🦋 Bướm Polaroid', group: '🎞️ Khung 2–3 Ảnh', overlay: base + 'butterfly.webp', key: true, w: 675, h: 1200,
      slots: [{ x: 65, y: 73, w: 327, h: 267 }, { x: 285, y: 375, w: 329, h: 263 }, { x: 61, y: 703, w: 334, h: 255 }] },
    { id: 'redVelvet', name: '❤️ Nhung Đỏ', group: '🎞️ Khung 2–3 Ảnh', overlay: base + 'redVelvet.webp', w: 711, h: 1200,
      slots: [{ x: 216, y: 282, w: 278, h: 350 }, { x: 216, y: 634, w: 279, h: 347 }] },
    { id: 'redGingham', name: '🧣 Gingham Đỏ', group: '🎞️ Khung 2–3 Ảnh', overlay: base + 'red strip.webp', key: true, w: 953, h: 1200,
      slots: [{ x: 324, y: 172, w: 300, h: 367 }, { x: 324, y: 560, w: 300, h: 354 }] },
    { id: 'bdayFilm', name: '🎞️ Sinh Nhật Film', group: '🖼️ Khung 4+ Ảnh', overlay: base + 'B-day.webp', key: true, w: 400, h: 1200, duplicate: true,
      slots: [{ x: 62, y: 36, w: 277, h: 227 }, { x: 71, y: 280, w: 275, h: 228 }, { x: 60, y: 681, w: 281, h: 235 }, { x: 62, y: 932, w: 283, h: 222 }] },
    { id: 'filmStrip', name: '🎞️ Film Strip', group: '🖼️ Khung 4+ Ảnh', overlay: base + 'filmStrip.webp', w: 670, h: 1200, duplicate: true,
      slots: [{ x: 86, y: 36, w: 500, h: 264 }, { x: 86, y: 331, w: 500, h: 262 }, { x: 86, y: 623, w: 500, h: 257 }, { x: 86, y: 909, w: 500, h: 255 }] },
    { id: 'collage4', name: '🎂 Collage Sinh Nhật', group: '🖼️ Khung 4+ Ảnh', overlay: base + '4 collage.webp', key: true, w: 670, h: 1200,
      slots: [{ x: 94, y: 423, w: 201, h: 196 }, { x: 301, y: 323, w: 292, h: 292 }, { x: 61, y: 628, w: 257, h: 257 }, { x: 327, y: 626, w: 249, h: 246 }] },
    { id: 'denimStar', name: '👖 Denim Sao', group: '🖼️ Khung 4+ Ảnh', overlay: base + 'denimStar.webp', w: 675, h: 1200,
      slots: [{ x: 106, y: 105, w: 184, h: 367 }, { x: 347, y: 110, w: 276, h: 355 }, { x: 88, y: 513, w: 215, h: 355 }, { x: 351, y: 516, w: 293, h: 365 }] },
    { id: 'redFabric', name: '🧵 Vải Đỏ', group: '🖼️ Khung 4+ Ảnh', overlay: base + 'redFabric.webp', w: 400, h: 1200,
      slots: [{ x: 84, y: 44, w: 228, h: 184 }, { x: 84, y: 294, w: 228, h: 183 }, { x: 88, y: 548, w: 230, h: 185 }, { x: 102, y: 799, w: 229, h: 183 }] },
    { id: 'stack', name: '📚 Polaroid Chồng', group: '🖼️ Khung 4+ Ảnh', overlay: base + 'stack.webp', w: 675, h: 1200,
      slots: [{ x: 371, y: 243, w: 215, h: 216 }, { x: 171, y: 317, w: 192, h: 135 }, { x: 134, y: 461, w: 405, h: 219 }, { x: 51, y: 684, w: 219, h: 177 }, { x: 277, y: 688, w: 224, h: 127 }] },
    { id: 'greenNote', name: '🌿 Gingham Xanh', group: '📸 Khung 1 Ảnh', overlay: base + 'greenNote.webp', w: 717, h: 1200,
      slots: [{ x: 147, y: 367, w: 432, h: 525 }] },
    { id: 'bdayOne', name: '🎀 Sinh Nhật 1 Ảnh', group: '📸 Khung 1 Ảnh', overlay: base + 'bdayOne.webp', w: 675, h: 1200,
      slots: [{ x: 63, y: 235, w: 550, h: 407 }] },
    { id: 'wanted', name: '🏴‍☠️ Wanted', group: '📸 Khung 1 Ảnh', overlay: base + 'wanted.webp', w: 799, h: 1200,
      slots: [{ x: 69, y: 305, w: 669, h: 627 }] },
    { id: 'receipt', name: '🧾 Hóa Đơn', group: '📸 Khung 1 Ảnh', overlay: base + 'Receipt.webp', key: true, w: 514, h: 1200,
      slots: [{ x: 33, y: 197, w: 449, h: 561 }] },
    { id: 'theatreTicket', name: '🎭 Vé Rạp Phim', group: '🎞️ Khung 2–3 Ảnh', overlay: base + 'theather.webp', w: 398, h: 1200,
      slots: [{ x: 25, y: 29, w: 349, h: 255 }, { x: 25, y: 306, w: 349, h: 256 }, { x: 25, y: 584, w: 349, h: 255 }] },
    { id: 'redCamera', name: '📷 Máy Ảnh Đỏ', group: '🎞️ Khung 2–3 Ảnh', overlay: base + 'Gemini_Generated_Image_jc3t86jc3t86jc3t.webp', key: true, w: 410, h: 1200,
      slots: [{ x: 15, y: 317, w: 257, h: 213 }, { x: 38, y: 628, w: 252, h: 179 }, { x: 30, y: 919, w: 284, h: 231 }] },
    { id: 'doggoSnow', name: '🐶 Doggo Tuyết', group: '🖼️ Khung 4+ Ảnh', overlay: base + '695b91d10ae9f.webp', w: 396, h: 1200,
      slots: [{ x: 34, y: 51, w: 328, h: 236 }, { x: 37, y: 322, w: 325, h: 238 }, { x: 34, y: 594, w: 327, h: 247 }, { x: 54, y: 896, w: 302, h: 221 }] },
    { id: 'slayCollage', name: '🗞️ Slay Báo Cắt', group: '🖼️ Khung 4+ Ảnh', overlay: base + 'Gemini_Generated_Image_xhe7tkxhe7tkxhe7.webp', key: true, w: 675, h: 1200,
      slots: [{ x: 147, y: 308, w: 187, h: 208 }, { x: 155, y: 541, w: 185, h: 210 }, { x: 162, y: 771, w: 185, h: 211 }, { x: 353, y: 253, w: 174, h: 211 }, { x: 362, y: 485, w: 155, h: 209 }, { x: 369, y: 717, w: 142, h: 210 }] },
    /* ---------- KHUNG RÁI CÁ: các file .png cũ nằm ngoài assets/frames/ ---------- */
    { id: 'f_cute', name: '🍬 Cute Hột Me', group: '🦦 Khung Rái Cá', overlay: old + 'frame1.png', w: 724, h: 2172,
      slots: [{ x: 81, y: 201, w: 563, h: 389 }, { x: 80, y: 639, w: 564, h: 387 }, { x: 81, y: 1079, w: 563, h: 389 }, { x: 81, y: 1518, w: 563, h: 489 }] },
    { id: 'f_marry', name: '💍 Giấy Kết Hôn', group: '🦦 Khung Rái Cá', overlay: old + 'frame2.png', w: 880, h: 2650,
      slots: [{ x: 63, y: 73, w: 754, h: 549 }, { x: 64, y: 684, w: 754, h: 549 }, { x: 68, y: 1296, w: 754, h: 548 }, { x: 63, y: 1809, w: 755, h: 651 }] },
    { id: 'f_plain', name: '🤍 Khung Trơn', group: '🦦 Khung Rái Cá', overlay: old + 'frame3.png', w: 1200, h: 3600,
      slots: [{ x: 14, y: 64, w: 999, h: 1101 }, { x: 14, y: 1236, w: 999, h: 1102 }, { x: 14, y: 2425, w: 999, h: 1103 }] },
    { id: 'f_byo', name: '✌️ Be Yourself', group: '🦦 Khung Rái Cá', overlay: old + 'byo.png', w: 620, h: 1672,
      slots: [{ x: 31, y: 29, w: 553, h: 358 }, { x: 55, y: 436, w: 477, h: 356 }, { x: 26, y: 821, w: 559, h: 360 }, { x: 73, y: 1242, w: 462, h: 344 }] },
    { id: 'f_y2k', name: '💿 Y2K', group: '🦦 Khung Rái Cá', overlay: old + 'y2k.png', w: 880, h: 2650,
      slots: [{ x: 56, y: 55, w: 768, h: 582 }, { x: 55, y: 669, w: 770, h: 581 }, { x: 56, y: 1286, w: 768, h: 579 }, { x: 55, y: 1902, w: 770, h: 572 }] },
    { id: 'f_onepiece', name: '🏴‍☠️ One Piece', group: '🦦 Khung Rái Cá', overlay: old + 'one-piece.png', w: 1024, h: 1536,
      slots: [{ x: 187, y: 202, w: 676, h: 253 }, { x: 181, y: 496, w: 653, h: 253 }, { x: 183, y: 730, w: 678, h: 349 }, { x: 169, y: 1008, w: 692, h: 377 }] },
    { id: 'f_gangster', name: '😎 Rái Cá Ngầu', group: '🦦 Khung Rái Cá', overlay: old + 'otter-gangster.png', w: 941, h: 1672,
      slots: [{ x: 148, y: 286, w: 638, h: 274 }, { x: 152, y: 625, w: 637, h: 286 }, { x: 159, y: 978, w: 619, h: 278 }, { x: 159, y: 1321, w: 627, h: 265 }] },
    { id: 'f_memo', name: '📝 Rái Cá Memories', group: '🦦 Khung Rái Cá', overlay: old + 'otter-memo.png', w: 724, h: 2172,
      slots: [{ x: 96, y: 252, w: 536, h: 319 }, { x: 95, y: 626, w: 537, h: 319 }, { x: 95, y: 999, w: 536, h: 319 }, { x: 95, y: 1372, w: 536, h: 319 }, { x: 90, y: 1746, w: 540, h: 315 }] },
    { id: 'f_police', name: '🚓 Cảnh Sát Rái Cá', group: '🦦 Khung Rái Cá', overlay: old + 'otter-police.png', w: 941, h: 1672,
      slots: [{ x: 100, y: 0, w: 841, h: 532 }, { x: 176, y: 582, w: 571, h: 282 }, { x: 238, y: 915, w: 515, h: 279 }, { x: 210, y: 1245, w: 481, h: 427 }] },
    { id: 'f_otterly', name: '🦦 Rái Cá Cute', group: '🦦 Khung Rái Cá', overlay: old + 'otterly.png', w: 887, h: 1774,
      slots: [{ x: 112, y: 231, w: 677, h: 282 }, { x: 109, y: 580, w: 667, h: 279 }, { x: 109, y: 931, w: 668, h: 278 }, { x: 107, y: 1280, w: 668, h: 332 }] }
  ];
})();
