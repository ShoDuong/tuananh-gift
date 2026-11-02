/* ============================================================
   FRAME TEMPLATES — tất cả khung của OtterBooth
   Mỗi khung đã trong suốt đúng chỗ ô ảnh; ảnh chụp tự crop vừa khít
   vào ô rồi khung được vẽ ĐÈ LÊN TRÊN.
   - w,h       : kích thước canvas = kích thước ảnh khung (px)
   - slots     : ô ảnh — ảnh tự khớp, không cần chỉnh tay
   - group     : nhóm hiện trong bảng chọn khung
   - duplicate : khi In xếp 2 dải trên 1 tờ 4x6
   - z / poly / photoFilter : tùy chọn (xem tools/frame-maker.html)
   ============================================================ */
(function () {
  'use strict';
  const base = 'assets/frames/templates/';
  const old  = 'assets/frames/';
  window.FRAME_TEMPLATES = [
    { id: 'kraftStrip', name: '🤎 Giấy Mộc', group: 'Khung Rollbooth', overlay: base + 'kraftStrip.webp', w: 435, h: 1200, duplicate: true,
      slots: [{ x: 28, y: 48, w: 379, h: 349 }, { x: 28, y: 423, w: 379, h: 349 }, { x: 28, y: 798, w: 379, h: 349 }] },
    { id: 'doodleCloud', name: '☁️ Mây Doodle', group: 'Khung Rollbooth', overlay: base + 'doodleCloud.webp', w: 411, h: 1200, duplicate: true,
      slots: [{ x: 18, y: 61, w: 368, h: 350 }, { x: 20, y: 441, w: 371, h: 336 }, { x: 17, y: 807, w: 376, h: 350 }] },
    { id: 'filmStrip', name: '🎞️ Film Strip', group: 'Khung Rollbooth', overlay: base + 'filmStrip.webp', w: 670, h: 1200, duplicate: true,
      slots: [{ x: 86, y: 36, w: 500, h: 264 }, { x: 86, y: 331, w: 500, h: 262 }, { x: 86, y: 623, w: 500, h: 257 }, { x: 86, y: 909, w: 500, h: 255 }] },
    { id: 'bdayFilm', name: '🎂 Sinh Nhật Film', group: 'Khung Rollbooth', overlay: base + 'bdayFilm.webp', w: 400, h: 1200, duplicate: true,
      slots: [{ x: 65, y: 38, w: 272, h: 223 }, { x: 73, y: 282, w: 271, h: 225 }, { x: 62, y: 684, w: 277, h: 231 }, { x: 65, y: 934, w: 279, h: 218 }] },
    { id: 'stack', name: '📚 Polaroid Chồng', group: 'Khung Rollbooth', overlay: base + 'stack.webp', w: 675, h: 1200,
      slots: [{ x: 371, y: 243, w: 215, h: 216 }, { x: 171, y: 317, w: 192, h: 135 }, { x: 134, y: 461, w: 405, h: 219 }, { x: 51, y: 684, w: 219, h: 177 }, { x: 277, y: 688, w: 224, h: 127 }] },
    { id: 'collage4', name: '🖼️ Collage 4', group: 'Khung Rollbooth', overlay: base + 'collage4.webp', w: 670, h: 1200,
      slots: [{ x: 294, y: 316, w: 298, h: 296 }, { x: 91, y: 419, w: 203, h: 200 }, { x: 322, y: 623, w: 252, h: 247 }, { x: 57, y: 624, w: 259, h: 259 }] },
    { id: 'butterfly', name: '🦋 Bướm Polaroid', group: 'Khung Rollbooth', overlay: base + 'butterfly.webp', w: 675, h: 1200,
      slots: [{ x: 56, y: 65, w: 343, h: 281 }, { x: 276, y: 366, w: 348, h: 279 }, { x: 52, y: 694, w: 351, h: 274 }] },
    { id: 'denimStar', name: '👖 Denim Sao', group: 'Khung Rollbooth', overlay: base + 'denimStar.webp', w: 675, h: 1200,
      slots: [{ x: 106, y: 105, w: 184, h: 367 }, { x: 347, y: 110, w: 276, h: 355 }, { x: 88, y: 513, w: 215, h: 355 }, { x: 351, y: 516, w: 293, h: 365 }] },
    { id: 'redFabric', name: '🧵 Vải Đỏ', group: 'Khung Rollbooth', overlay: base + 'redFabric.webp', w: 400, h: 1200,
      slots: [{ x: 84, y: 44, w: 228, h: 184 }, { x: 84, y: 294, w: 228, h: 183 }, { x: 88, y: 548, w: 230, h: 185 }, { x: 102, y: 799, w: 229, h: 183 }] },
    { id: 'redStar', name: '⭐ Sao Đỏ', group: 'Khung Rollbooth', overlay: base + 'redStar.webp', w: 675, h: 1200,
      slots: [{ x: 131, y: 71, w: 421, h: 283 }, { x: 227, y: 437, w: 361, h: 261 }, { x: 147, y: 760, w: 452, h: 254 }] },
    { id: 'redGingham', name: '🧣 Gingham Đỏ', group: 'Khung Rollbooth', overlay: base + 'redGingham.webp', w: 953, h: 1200,
      slots: [{ x: 322, y: 171, w: 303, h: 370 }, { x: 322, y: 559, w: 303, h: 357 }] },
    { id: 'redVelvet', name: '❤️ Nhung Đỏ', group: 'Khung Rollbooth', overlay: base + 'redVelvet.webp', w: 711, h: 1200,
      slots: [{ x: 216, y: 282, w: 278, h: 350 }, { x: 216, y: 634, w: 279, h: 347 }] },
    { id: 'greenNote', name: '🌿 Gingham Xanh', group: 'Khung Rollbooth', overlay: base + 'greenNote.webp', w: 717, h: 1200,
      slots: [{ x: 147, y: 367, w: 432, h: 525 }] },
    { id: 'bdayOne', name: '🎀 Sinh Nhật 1 Ảnh', group: 'Khung Rollbooth', overlay: base + 'bdayOne.webp', w: 675, h: 1200,
      slots: [{ x: 63, y: 235, w: 550, h: 407 }] },
    { id: 'receipt', name: '🧾 Hóa Đơn', group: 'Khung Rollbooth', overlay: base + 'receipt.webp', w: 514, h: 1200,
      slots: [{ x: 32, y: 196, w: 451, h: 562 }] },
    { id: 'wanted', name: '🏴‍☠️ Wanted', group: 'Khung Rollbooth', overlay: base + 'wanted.webp', w: 799, h: 1200,
      slots: [{ x: 69, y: 305, w: 669, h: 627 }] },
    { id: 'f_cute', name: '🍬 Cute Hột Me', group: 'Khung Rái Cá', overlay: old + 'frame1.png', w: 724, h: 2172,
      slots: [{ x: 81, y: 201, w: 563, h: 389 }, { x: 80, y: 639, w: 564, h: 387 }, { x: 81, y: 1079, w: 563, h: 389 }, { x: 81, y: 1518, w: 563, h: 489 }] },
    { id: 'f_marry', name: '💍 Giấy Kết Hôn', group: 'Khung Rái Cá', overlay: old + 'frame2.png', w: 880, h: 2650,
      slots: [{ x: 63, y: 73, w: 754, h: 549 }, { x: 64, y: 684, w: 754, h: 549 }, { x: 68, y: 1296, w: 754, h: 548 }, { x: 63, y: 1809, w: 755, h: 651 }] },
    { id: 'f_plain', name: '🤍 Khung Trơn', group: 'Khung Rái Cá', overlay: old + 'frame3.png', w: 1200, h: 3600,
      slots: [{ x: 14, y: 64, w: 999, h: 1101 }, { x: 14, y: 1236, w: 999, h: 1102 }, { x: 14, y: 2425, w: 999, h: 1103 }] },
    { id: 'f_byo', name: '✌️ Be Yourself', group: 'Khung Rái Cá', overlay: old + 'byo.png', w: 620, h: 1672,
      slots: [{ x: 31, y: 29, w: 553, h: 358 }, { x: 55, y: 436, w: 477, h: 356 }, { x: 26, y: 821, w: 559, h: 360 }, { x: 73, y: 1242, w: 462, h: 344 }] },
    { id: 'f_y2k', name: '💿 Y2K', group: 'Khung Rái Cá', overlay: old + 'y2k.png', w: 880, h: 2650,
      slots: [{ x: 56, y: 55, w: 768, h: 582 }, { x: 55, y: 669, w: 770, h: 581 }, { x: 56, y: 1286, w: 768, h: 579 }, { x: 55, y: 1902, w: 770, h: 572 }] },
    { id: 'f_onepiece', name: '🏴‍☠️ One Piece', group: 'Khung Rái Cá', overlay: old + 'one-piece.png', w: 1024, h: 1536,
      slots: [{ x: 187, y: 202, w: 676, h: 253 }, { x: 181, y: 496, w: 653, h: 253 }, { x: 183, y: 730, w: 678, h: 349 }, { x: 169, y: 1008, w: 692, h: 377 }] },
    { id: 'f_gangster', name: '😎 Rái Cá Ngầu', group: 'Khung Rái Cá', overlay: old + 'otter-gangster.png', w: 941, h: 1672,
      slots: [{ x: 148, y: 286, w: 638, h: 274 }, { x: 152, y: 625, w: 637, h: 286 }, { x: 159, y: 978, w: 619, h: 278 }, { x: 159, y: 1321, w: 627, h: 265 }] },
    { id: 'f_memo', name: '📝 Rái Cá Memories', group: 'Khung Rái Cá', overlay: old + 'otter-memo.png', w: 724, h: 2172,
      slots: [{ x: 96, y: 252, w: 536, h: 319 }, { x: 95, y: 626, w: 537, h: 319 }, { x: 95, y: 999, w: 536, h: 319 }, { x: 95, y: 1372, w: 536, h: 319 }, { x: 90, y: 1746, w: 540, h: 315 }] },
    { id: 'f_police', name: '🚓 Cảnh Sát Rái Cá', group: 'Khung Rái Cá', overlay: old + 'otter-police.png', w: 941, h: 1672,
      slots: [{ x: 100, y: 0, w: 841, h: 532 }, { x: 176, y: 582, w: 571, h: 282 }, { x: 238, y: 915, w: 515, h: 279 }, { x: 210, y: 1245, w: 481, h: 427 }] },
    { id: 'f_otterly', name: '🦦 Rái Cá Cute', group: 'Khung Rái Cá', overlay: old + 'otterly.png', w: 887, h: 1774,
      slots: [{ x: 112, y: 231, w: 677, h: 282 }, { x: 109, y: 580, w: 667, h: 279 }, { x: 109, y: 931, w: 668, h: 278 }, { x: 107, y: 1280, w: 668, h: 332 }] }
  ];
})();
