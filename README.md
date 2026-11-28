# tuananh-gift 🦦

A small interactive birthday-gift website (landing page, fortune letter, music radio,
and an OtterBooth photobooth) deployed on Netlify.

## Project structure

```
.
├── index.html                  # Landing page
├── index1.html                 # Intro / transition page (trang bánh sinh nhật)
├── christmas-tree.html         # Cây thông ASCII 12s — chen giữa lá thư và trang bánh
├── fog.html                    # Gương mờ (webcam + thổi + chụm ngón tay vẽ)
├── fortune.html                # Fortune letter
├── radio.html                  # Music radio player
├── photobooth.html             # OtterBooth photobooth (capture, decorate, print)
├── tiramisu-studio-live.html   # Extra page
├── css/                        # Stylesheets
├── js/                         # Scripts (script.js, cursor-trail.js)
├── netlify/functions/          # Serverless functions (Discord webhook)
└── assets/
    ├── img/                    # Shared images / gifs
    ├── audio/                  # Music tracks (.mp3)
    ├── frames/                 # Photobooth frame overlays (PNG with transparent photo holes)
    ├── backgrounds/            # Photobooth background layers (behind photos)
    ├── stickers/
    │   ├── tuananh/            # Personal stickers
    │   ├── fish/               # Undersea stickers
    │   └── bubbles/            # Bubble / star particles
    └── _unused/                # Archived assets not referenced anywhere (safe to delete)
```

## Local development

```bash
netlify dev
```

The Discord webhook URL is read from `.env` (not committed).

## Adding a photobooth frame
1. Design a PNG at the layout's canvas size (e.g. 1200×1800 for the 4×6 print layout),
   leaving the photo areas transparent.
2. Save it to `assets/frames/`.
3. Add a button in `photobooth.html`:
   `<button class="sticker-btn frame-strip" onclick="setFrame('assets/frames/your-frame.png')">Name</button>`

## Adding a background
Save a PNG/JPG (matching the layout aspect ratio) to `assets/backgrounds/`, then add:
`<button class="sticker-btn" onclick="setBackground('assets/backgrounds/your-bg.png')">Name</button>`

## Frame templates (khung thật, ảnh tự khớp vào lỗ)
`js/frames.js` khai báo `window.FRAME_TEMPLATES`. Mỗi khung dùng một ảnh frame thật
trong `assets/frames/templates/<id>.webp` đã được khoét TRONG SUỐT đúng chỗ ô ảnh.
Khi chụp, ảnh tự cắt theo tỉ lệ ô (`cropToFit`) và lọt vào lỗ; frame đè lên trên.

Mỗi template:
- `overlay`: ảnh frame .webp (trong suốt ở ô ảnh)
- `w`,`h`  : kích thước canvas = kích thước ảnh frame (px)
- `slots`  : `{x,y,w,h}` khớp với các lỗ đã khoét
- `poly`   : (tùy, trong từng slot) đa giác `[[x,y],...]` cho ô nghiêng/bo/hình bất kỳ
- `clip`   : (tùy) hàm tự vẽ đường bao ô
- `photoFilter`: (tùy) vd `'grayscale(1)'` cho frame đen trắng
- `duplicate: true`: (tùy) khi In xếp 2 dải trên 1 tờ 4x6 (strip dọc)

### Thêm 1 khung mới từ ảnh thiết kế
1. Có ảnh frame (vd .webp/.png) với hình mẫu người ở chỗ ảnh.
2. Khoét trong suốt vùng ảnh (Photoshop/Figma: xóa vùng người → export PNG/WebP trong suốt),
   lưu vào `assets/frames/templates/<id>.webp`.
3. Thêm 1 object vào `FRAME_TEMPLATES` với `overlay`, `w`, `h`, `slots` khớp các lỗ.
4. Thêm nút `<button class="sticker-btn" onclick="setTemplate('<id>')">Tên</button>`
   vào `#templateListContainer` trong `photobooth.html`.

Ảnh nguồn gốc (có hình mẫu) được lưu ở `assets/_unused/frame-sources/`.

## Khung có sẵn
Danh sách khung = 20 file trong `assets/frames/templates/` + 10 khung Rái Cá trong `assets/frames/`, khai báo ở `js/frames.js`,
chia nhóm theo số ảnh trong bảng chọn khung:

| Nhóm | Khung |
|---|---|
| 🎞️ 2–3 ảnh | Giấy Mộc (mặc định) · Mây Doodle · Sao Đỏ · Bướm Polaroid · Nhung Đỏ · Gingham Đỏ · Vé Rạp Phim · Máy Ảnh Đỏ |
| 🖼️ 4+ ảnh | Sinh Nhật Film · Film Strip · Collage Sinh Nhật · Denim Sao · Vải Đỏ · Polaroid Chồng · Doggo Tuyết · Slay Báo Cắt (6 ảnh) |
| 📸 1 ảnh | Gingham Xanh · Sinh Nhật 1 Ảnh · Wanted · Hóa Đơn |
| 🦦 Khung Rái Cá (`assets/frames/*.png`) | Cute Hột Me · Giấy Kết Hôn · Khung Trơn · Be Yourself · Y2K · One Piece · Rái Cá Ngầu · Rái Cá Memories · Cảnh Sát Rái Cá · Rái Cá Cute |

Sáu file còn ô caro (`đoole`, `butterfly`, `red strip`, `B-day`, `4 collage`, `Receipt`) có `key: true`:
lúc chạy trang tự làm trong suốt phần caro trong mỗi ô (không tạo file mới). Nếu mở bằng `file://`,
ảnh sẽ được vẽ đè lên ô thay vì nằm dưới khung.

## Tự khoét khung bằng Frame Maker
Mở `tools/frame-maker.html` (double-click là chạy, không cần server):
1. Chọn ảnh khung gốc (còn hình mẫu người).
2. Vẽ ô ảnh: **🪄 Đũa phép** (bấm/tô lên hình mẫu, tự dò viền cho ô bo tròn/đám mây/hình lộn xộn), **▭ Chữ nhật** (có thanh Bo góc), **⬭ Elip**, hoặc **⬠ Đa giác** (ô nghiêng). Kéo chấm để chỉnh tay.
3. (Tuỳ chọn) **🛡️ Giữ sticker**: tô những chi tiết của khung nằm đè lên ô ảnh (hoa, nơ, băng keo…) để chúng không bị khoét mất mà hiện đè lên ảnh chụp. Bật "Xem trước kết quả" để kiểm tra.
4. **🗂️ Thứ tự lớp**: ô nào nằm trên ô nào khi chồng nhau (`]` `[` `Ctrl+]` `Ctrl+[`).
5. Tải PNG/WebP đã khoét -> bỏ vào `assets/frames/templates/`.
6. Copy đoạn code -> dán vào mảng `FRAME_TEMPLATES` trong `js/frames.js`. Nút chọn khung trong
   `photobooth.html` tự sinh từ mảng này, không cần thêm nút tay.

## Photobooth
- Bố cục: 3 cột nút (Trang Trí · Chỉnh Ảnh · Vui Vẻ) · camera ở giữa · dải ảnh bên phải.
  Ba khối cao bằng nhau, chỉnh bằng biến CSS `--booth-h` (mặc định 640px).
- Chỉ chụp khi bấm nút chụp tròn hoặc bấm vào khung video.
- **Tự chụp liên tiếp**: khung từ 2 ô trở lên, sau tấm đầu sẽ đếm 5 giây rồi tự chụp tấm kế
  cho tới khi đủ ô. Đồng hồ hiện ngay trong khung camera.
- Hàng nút dưới camera: 🌙/☀️ Night-Sunny · 📁 Upload · ⏺️ Chụp · 🔄 Xoá ảnh · ❓ Hướng dẫn.
- **Reset All** không đụng Night/Sunny, và đưa khung về khung đang chọn (mặc định Giấy Mộc).
- **Xoá Sticker**: xoá sticker nhưng giữ nguyên khung và ảnh.
- **Màu Ảnh**: 12 bộ lọc chỉnh trên từng pixel theo thang Lightroom (Tyndall, Mùa Hè Anime, Dream Core, Ấm, Lạnh, Đen Trắng, Vintage…), áp cho mọi ảnh trong khung và Scrapbook.
  và áp luôn khi xuất Scrapbook.
- **Scrapbook**: ghép ảnh thành trang polaroid (Post 4:5 / Story 9:16) trên nền kẻ sọc navy,
  dùng khung thật `assets/frames/white polaroid.jpg`. Có nút Xáo lại và Lưu ảnh
  (bản lưu cũng tự gửi về Discord).
- **BTS Reel**: ghép sẵn 1 video 720×1280 rồi phát — hậu trường ~4 giây mỗi tấm, xen giữa là ảnh
  vừa chụp (lấy chính nó làm nền mờ + polaroid nổi lên), kết bằng nguyên dải ảnh.
  Chỉ có nút Lưu video và Đóng.
- **Discord**: sau MỖI tấm chụp, tự gửi ảnh (`photo-N.png`) và video hậu trường
  (`bts-tam-N.webm`) qua `netlify/functions/send-photo`.
- **Nghiêng sticker & chữ**: chọn 1 sticker/chữ trên ảnh rồi kéo núm ↻ trên đầu nó, hoặc dùng ô **Nghiêng** (slider −180°…180°, nút ↺ ↻ 5°, nút 0°) ở cột Chỉnh Ảnh. Add Cute Text có thanh **Nghiêng chữ** (−45°…45°, bấm đúp để về 0°) áp lúc thêm chữ.
- **Sticker**: 1 danh sách chung + ô tìm kiếm, 6 cái mỗi hàng, không có GIF, và không lặp lại
  các sticker đã dùng ở phần khác của web (rái cá, Tuấn Anh).
- **🔤 Add Cute Text** (luôn hiện ngay dưới các cột nút bên trái, có sẵn chữ mẫu): gõ chữ → tự tạo sticker kiểu chữ cắt báo; mỗi lần gõ / bấm 🎲 ra kiểu khác. Bấm ➕ Thêm hoặc Enter để dán vào ảnh.
- Chọn từng sticker chỉ thêm 1 cái; chỉ các nút spam mới rải nhiều.
- **Nút spam** (mỗi ô lưới 1 con, không trùng nhau): Biển Cả · Cat Gang (pack3 16–20, 25) ·
  Flower (19, 21, 22, pack3_14) · Sunny · Otter Party.
- **Điện thoại** (màn hình ≤ 760px): xếp 1 cột dọc — camera + nút chụp → dải ảnh → các nút lưới 4 cột → Add Cute Text; popup hiện từ dưới lên. CSS nằm ở khối `<style id="booth-mobile">`, desktop không đổi.
- Phóng to tổng thể bằng biến CSS `--booth-zoom` (mặc định `.8`).

## Cây thông · Gương mờ · Quả cầu tuyết
- **Luồng:** `index.html` (thư) → `christmas-tree.html` (chỉ có nút PLAY, bấm là chạy 12s, xong có nút *Vào tiệc sinh nhật* hoặc *Bỏ qua →*) → `index1.html` (bánh, giữ nguyên). Dòng chuyển trang nằm ở `js/script.js` (bản cũ: `js/script.js.bak-before-tree`).
- **🪞 Gương Mờ** (`fog.html`): nút trong nhóm *Vui Vẻ* mở trang riêng. Giơ 1 ngón trỏ (hoặc chuột / ngón tay trên màn hình) để vẽ nét mảnh; không còn chức năng xoá — nét vẽ **tự mờ dần và biến mất hẳn** (kể cả khi đang vẽ; ~3 giây nhạt một nửa, 10 giây sau nét cuối thì sạch hẳn; nút *⏳ tự mờ: bật/tắt*), nút *🌫️ phủ mờ lại* (hoặc phím C) cho sương dâng phủ cả gương. Thổi vào mic = mờ thêm (hơi thở cũng tan dần). Nút 📸 đếm 3-2-1 rồi chụp → Tải ảnh / In ảnh. Thanh brush 2–20. Cần https/localhost. Bản trước: `fog.html.bak-before-autofog`.
- **❄️ Quả Cầu Tuyết** (`js/snowball.js`): popup 3 giây ở photobooth; bấm quả cầu để lắc. Nút **❄️ Quả Cầu Tuyết** trong nhóm *Vui Vẻ* mở lại popup này (thay cho nút 🎄 Cây Thông). Nút 🌺 Hoa Nở Lại và mưa hoa tự động đã bỏ.
- **⛄ Người tuyết trong phim cây thông**: khoảng giây 12 đi từ mép phải vào, đứng cạnh cây và vẫy tay; nút *Vào tiệc sinh nhật* hiện ở giây 15.6. (`js/snowman.js` là bản popup cũ, không dùng nữa.)
- **Trang cây thông còn có:** cây to + màu sặc sỡ hơn, nhiều quả treo nhiều màu, quả cầu tuyết rơi, pháo hoa ASCII từ giây ~14.6 (có tiếng nổ), xe tuần lộc của ông già Noel bay ngang từ giây 15.2 (lặp mỗi 17 giây, có tiếng chuông xe), nhạc nền Jingle Bells tự tổng hợp (nút 🔊/🔇 góc trên trái). Nút *Vào tiệc sinh nhật* hiện ở giây 17.5. Bản trước: `christmas-tree.html.bak-before-extras`.
- **Kiểu cây giống ảnh mẫu + màn kết:** nền đêm tối, thân cây là mảng chữ nhiều ký tự với ~30% đèn đủ màu (bật dần khi sao chổi xoắn xuống), mặt trăng ASCII góc trên trái, dòng MERRY CHRISTMAS 2026 ở dưới. Phim xong, bấm màn hình hoặc nút *Vào tiệc sinh nhật* → hộp quà hồng to bật lên, mở nắp, đường ray vàng mọc ra, đoàn tàu 5 toa quà chạy ~2 vòng rồi chạy ra ngoài → mờ dần sang `index1.html` (khoảng 9 giây). Không còn nút *Bỏ qua* hay *Quay lại Photobooth*: trang cây thông luôn đi tới trang thổi nến `index1.html`; phím R xem lại. Bản trước: `christmas-tree.html.bak-before-train`.
- **Bản 3D:** hộp quà và đoàn tàu ở màn kết là vật thể 3D dựng bằng điểm (có ánh sáng, mặt bên tối, giấy chấm bi, ruy băng bóng, nơ 3D, nắp lật bay lên; đầu tàu có nồi hơi, ống khói, khói, đèn pha, bánh xe quay; toa quà nhiều màu/hoa văn). Ông già Noel + xe trượt + 3 tuần lộc (con đầu mũi đỏ) vẽ bằng đường nét SDF, to gấp ~2–3 lần, bay vòng quanh bầu trời mỗi 14 giây (bay qua phía trước to, vòng ra sau nhỏ và nằm sau mặt trăng). Bản trước: `christmas-tree.html.bak-before-3d`.
- **Thứ tự cảnh (mới):** bấm PLAY → hộp quà 3D + đoàn tàu (~8 giây) → chuyển cảnh tan dần có viền kim tuyến sang phim cây thông → giây ~20.5 pháo hoa bắn lên ghép thành chữ HAPPY BIRTHDAY + nhạc Happy Birthday → chữ rơi xuống, màn hình mờ dần → `index1.html` (thổi nến). Không còn bấm để mở màn kết; Space tạm dừng, R xem lại từ đầu. Thêm dây kim tuyến vàng/bạc quấn cây, sao lấp lánh nền, quà to hơn, sàn dịu hơn, phát sáng mạnh hơn. Bản trước: `christmas-tree.html.bak-before-flow`.
- **Gương mờ nhẹ hơn:** lớp sương tính ở 1/4 độ phân giải rồi phóng to, bắt bàn tay trên khung 480px với model nhẹ, hơi thở vẽ bằng gradient thay vì blur. Bản trước: `fog.html.bak-before-perf`.

## Nhạc Giáng Sinh xuyên suốt
- `assets/audio/jingle-bells.mp3`: bản Jingle Bells (giai điệu dân gian) thu lại từ chính nhạc tổng hợp của trang cây thông, ~54 giây, lặp liền mạch.
- Rời trang cây thông → lưu `currentTrackSrc = jingle-bells.mp3`, `musicTime = 0`, `musicPlaying = true` vào localStorage. Trang bánh (`index1.html`) phát bài này thay cho nhạc cũ nếu đi từ cây thông; photobooth đọc `currentTrackSrc` sẵn nên phát tiếp; trang radio có thêm bài **07. 🎄 Jingle Bells — Nhạc Giáng Sinh** (được chọn sẵn), bấm bài khác trong danh sách để đổi.
- Bản trước: `*.bak-before-xmasmusic`.

## Trang bánh kem (index1.html) — theme ASCII Giáng Sinh
- Chỉ đổi giao diện, giữ nguyên logic/ID: thêm `<style id="ascii-xmas-theme">` + lớp trang trí `#asciiXmasLayer` (script `ascii-xmas-layer`).
- Nền đêm xanh navy giống trang cây thông, tuyết ASCII rơi, dải tuyết ASCII dưới đáy, chữ HAPPY BIRTHDAY bằng ký tự vàng lấp lánh.
- Popup điều ước + thiệp sinh nhật: thẻ tối viền mảnh, màu nhấn theo mood (Classic = vàng, Matcha = xanh thông, Strawberry = đỏ berry), font JetBrains Mono + Playfair.
- Bản cũ: `index1.html.bak-before-asciitheme`.

## Photobooth — nút 💿 Single Photo
- Nút mới trong nhóm Vui Vẻ (cạnh Quả Cầu Tuyết), gọi `openSinglePhoto()`.
- Hai tấm màn nhung đỏ kéo vào từ hai bên → khung polaroid (camera trực tiếp, đen trắng) + đĩa CD xoay liên tục phía sau.
- Chỉ chụp 1 tấm (đếm 3-2-1, flash). Sau đó: 💾 Tải ảnh (PNG 1600×2000 gồm cả màn, polaroid, đĩa, chú thích) hoặc ↺ Chụp lại. ✕ / Esc để đóng, màn mở ra lại.
- Toàn bộ code nằm ở `#single-photo-style` + `#single-photo-script` cuối file, không đụng logic cũ. Bản cũ: `photobooth.html.bak-before-singlephoto`.
- (Cập nhật) Nút 💿 Single Photo dời xuống dưới khung "Add Cute Text", kèm nút 🖼️ Frame bên cạnh (mở bảng chọn khung `frameModal`). Bản trước: `photobooth.html.bak-before-modeduo`.
