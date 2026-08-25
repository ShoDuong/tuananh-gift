// ===============================
// Elements
// ===============================
const envelope = document.getElementById("envelope-container");
const letter = document.getElementById("letter-container");
const noBtn = document.querySelector(".no-btn");
const yesBtn = document.querySelector(".btn[alt='Yes']");

const title = document.getElementById("letter-title");
const catImg = document.getElementById("letter-cat");
const buttons = document.getElementById("letter-buttons");
const finalText = document.getElementById("final-text");
const letterWindow = document.querySelector(".letter-window");
const easterEggText = document.getElementById("easter-egg-bubble");
// ===============================
// Global state
// ===============================
let yesClicked = false;
let otterKissing = false;
let heartInterval = null;
let noTouchCount = 0;
let noTurnedIntoYes = false;

const OTTER_KISS_DURATION = 1800;

// ===============================
// Safety check
// ===============================
if (!envelope || !letter || !noBtn || !yesBtn || !catImg || !buttons || !letterWindow) {
    console.error("Some required elements are missing. Check your HTML IDs/classes.");
}

// ===============================
// Hide title text
// ===============================
if (title) {
    title.textContent = "";
    title.style.display = "none";
}

// ===============================
// Message area under otter/cat
// ===============================
if (finalText) {
    finalText.style.display = "block";
    finalText.textContent = "";
    finalText.style.fontFamily = "'Pixelify Sans', sans-serif";
    finalText.style.fontSize = "1.2rem";
    finalText.style.color = "#d35f74";
    finalText.style.margin = "8px 0 12px 0";
    finalText.style.minHeight = "32px";
    finalText.style.textAlign = "center";
}

// ===============================
// Click otter to kiss
// ===============================
function playOtterKiss() {
    if (!catImg || otterKissing || yesClicked) return;

    otterKissing = true;

    catImg.src = "";

    setTimeout(() => {
        catImg.src = "otter_kiss.gif";
    }, 20);

    setTimeout(() => {
        if (!yesClicked) {
            catImg.src = "otter_heart.gif";
        }

        otterKissing = false;
    }, OTTER_KISS_DURATION);
}

if (catImg) {
    catImg.style.cursor = "pointer";

    catImg.addEventListener("click", playOtterKiss);

    catImg.addEventListener("touchstart", (e) => {
        e.preventDefault();
        playOtterKiss();
    });
}

// ===============================
// Sticker list
// ===============================
const tuanAnhStickers = [
    {
        name: "Sticker 1",
        preview: "Assets/tuananh_sticker/tuananh_sticker_1.png",
        download: "Assets/tuananh_sticker/tuananh_sticker_1.gif",
        emoji: "🥺"
    },
    {
        name: "Sticker 2",
        preview: "Assets/tuananh_sticker/tuananh_sticker_2.png",
        download: "Assets/tuananh_sticker/tuananh_sticker_2.gif",
        emoji: "🕺"
    },
    {
        name: "Sticker 3",
        preview: "Assets/tuananh_sticker/tuananh_sticker_3.png",
        download: "Assets/tuananh_sticker/tuananh_sticker_3.gif",
        emoji: "😉"
    },
    {
        name: "Sticker 4",
        preview: "Assets/tuananh_sticker/tuananh_sticker_4.png",
        download: "Assets/tuananh_sticker/tuananh_sticker_4.gif",
        emoji: "💖"
    }
];

// ===============================
// Inject CSS
// ===============================
const style = document.createElement("style");

style.textContent = `
    .floating-heart {
        position: fixed;
        bottom: -30px;
        font-size: 24px;
        animation: floatUp 3s linear forwards;
        pointer-events: none;
        z-index: 9999;
    }

    @keyframes floatUp {
        from {
            transform: translateY(0) scale(1) rotate(0deg);
            opacity: 1;
        }
        to {
            transform: translateY(-100vh) scale(1.6) rotate(20deg);
            opacity: 0;
        }
    }

    @keyframes cuteTextPop {
        0% {
            transform: scale(0.7);
            opacity: 0;
        }
        70% {
            transform: scale(1.08);
            opacity: 1;
        }
        100% {
            transform: scale(1);
            opacity: 1;
        }
    }

    .shake-cute {
        animation: shakeCute 0.35s ease;
    }

    @keyframes shakeCute {
        0% { transform: rotate(0deg); }
        25% { transform: rotate(4deg); }
        50% { transform: rotate(-4deg); }
        75% { transform: rotate(3deg); }
        100% { transform: rotate(0deg); }
    }

    #easter-egg-bubble {
    position: absolute;
    top: 92px;
    right: 38px;
    background: #fff7fb;
    border: 2px solid #ffb6d5;
    border-radius: 18px;
    padding: 9px 13px;
    max-width: 150px;
    font-family: 'Pixelify Sans', sans-serif;
    color: #d35f74;
    font-size: 0.9rem;
    line-height: 1.15;
    text-align: center;
    cursor: pointer;
    z-index: 10;
    box-shadow: 0 8px 18px rgba(255, 105, 180, 0.22);
    animation: easterBubbleFloat 1.2s ease-in-out infinite alternate;
}

#easter-egg-bubble::after {
    content: "";
    position: absolute;
    bottom: -9px;
    left: 24px;
    width: 15px;
    height: 15px;
    background: #fff7fb;
    border-right: 2px solid #ffb6d5;
    border-bottom: 2px solid #ffb6d5;
    transform: rotate(45deg);
}

#easter-egg-bubble:hover {
    transform: scale(1.06);
    background: #ffeaf3;
    color: #ff1493;
}

@keyframes easterBubbleFloat {
    from {
        transform: translateY(0) rotate(-1deg);
    }
    to {
        transform: translateY(-5px) rotate(1deg);
    }
}

    @keyframes easterWiggle {
        from {
            transform: rotate(-1deg) scale(1);
        }
        to {
            transform: rotate(1deg) scale(1.04);
        }
    }

 .achievement-box {
    position: absolute;
    top: 36%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: #fff0f5;
    border: 3px solid #ff69b4;
    border-radius: 20px;
    padding: 16px 22px;
    font-family: 'Pixelify Sans', sans-serif;
    color: #d35f74;
    font-size: 1.05rem;
    box-shadow: 0 10px 25px rgba(255, 105, 180, 0.28);
    z-index: 100000;
    text-align: center;
    min-width: 230px;
    animation: achievementPopCenter 0.45s ease, achievementFloatCenter 1.2s ease infinite alternate;
}

@keyframes achievementPopCenter {
    from {
        transform: translate(-50%, -50%) scale(0.65);
        opacity: 0;
    }
    to {
        transform: translate(-50%, -50%) scale(1);
        opacity: 1;
    }
}

@keyframes achievementFloatCenter {
    from {
        transform: translate(-50%, -50%) translateY(0);
    }
    to {
        transform: translate(-50%, -50%) translateY(-5px);
    }
}

    @keyframes achievementSlide {
        from {
            transform: translateX(120%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }

    @keyframes achievementFloat {
        from {
            transform: translateY(0);
        }
        to {
            transform: translateY(-4px);
        }
    }

    .loading-love-overlay {
        position: fixed;
        inset: 0;
        background: rgba(255, 240, 245, 0.96);
        display: none;
        justify-content: center;
        align-items: center;
        flex-direction: column;
        z-index: 100001;
        font-family: 'Pixelify Sans', sans-serif;
        color: #d35f74;
        text-align: center;
        padding: 20px;
    }

    .loading-love-box {
        background: white;
        border: 3px solid #ff69b4;
        border-radius: 24px;
        padding: 26px 32px;
        box-shadow: 0 14px 35px rgba(255, 105, 180, 0.25);
        max-width: 360px;
        width: 90%;
    }

    .loading-love-title {
        font-size: 1.5rem;
        margin-bottom: 14px;
    }

    .loading-bar {
        width: 100%;
        height: 18px;
        border-radius: 999px;
        background: #ffe4ef;
        overflow: hidden;
        border: 2px solid #ffc0cb;
    }

    .loading-fill {
        width: 0%;
        height: 100%;
        background: linear-gradient(90deg, #ff69b4, #ff1493);
        border-radius: 999px;
        transition: width 0.4s ease;
    }

    .loading-percent {
        margin-top: 10px;
        font-size: 1.1rem;
    }

    .sticker-quiz-overlay {
        position: fixed;
        inset: 0;
        background: rgba(255, 240, 245, 0.97);
        display: none;
        justify-content: center;
        align-items: center;
        z-index: 100002;
        padding: 18px;
        box-sizing: border-box;
    }

    .sticker-quiz-box {
        background: white;
        border: 3px solid #ff69b4;
        border-radius: 26px;
        padding: 22px;
        width: min(92vw, 560px);
        box-shadow: 0 14px 40px rgba(255, 105, 180, 0.28);
        font-family: 'Pixelify Sans', sans-serif;
        color: #d35f74;
        text-align: center;
    }

    .sticker-quiz-title {
        font-size: 1.6rem;
        margin-bottom: 6px;
    }

    .sticker-quiz-subtitle {
        color: #555;
        font-size: 1rem;
        margin-bottom: 18px;
    }

    .sticker-grid {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 14px;
    }

    .sticker-card {
        border: 2px solid #ffc0cb;
        background: #fff7fb;
        border-radius: 20px;
        padding: 12px;
        cursor: pointer;
        transition: transform 0.2s ease, box-shadow 0.2s ease;
    }

    .sticker-card:hover {
        transform: scale(1.05);
        box-shadow: 0 8px 18px rgba(255, 105, 180, 0.25);
    }

    .sticker-card img {
        width: 100%;
        max-width: 150px;
        height: 120px;
        object-fit: contain;
        display: block;
        margin: 0 auto 8px auto;
    }

    .sticker-card-name {
        font-size: 0.95rem;
    }

    .sticker-card-fallback {
        height: 120px;
        display: none;
        justify-content: center;
        align-items: center;
        font-size: 3rem;
    }

    .skip-sticker-btn {
        margin-top: 18px;
        padding: 10px 22px;
        border: none;
        border-radius: 999px;
        background: #ffe4ef;
        color: #d35f74;
        font-family: 'Pixelify Sans', sans-serif;
        font-size: 1rem;
        cursor: pointer;
        box-shadow: 0 8px 18px rgba(255, 105, 180, 0.2);
        transition: transform 0.2s ease, background 0.2s ease;
    }

    .skip-sticker-btn:hover {
        transform: scale(1.05);
        background: #ffd1e3;
    }

    .no-btn.yes-mode {
        cursor: pointer;
        filter: drop-shadow(0 0 10px rgba(255, 105, 180, 0.6));
    }

    @media (max-width: 600px) {
        .achievement-box {
            top: 14px;
            right: 14px;
            left: 14px;
            text-align: center;
        }

        .sticker-grid {
            grid-template-columns: 1fr 1fr;
            gap: 10px;
        }

        .sticker-quiz-title {
            font-size: 1.25rem;
        }

        .sticker-card img {
            height: 95px;
        }

        #easter-egg-bubble {
    top: 82px;
    right: 24px;
    max-width: 120px;
    font-size: 0.78rem;
    padding: 8px 10px;
}
    }
`;

document.head.appendChild(style);

// ===============================
// Easter egg click text
// ===============================
function triggerEasterEgg() {
    if (finalText) {
        finalText.textContent = "Easter egg unlocked hehe 🦦✨";
        finalText.style.animation = "none";
        void finalText.offsetWidth;
        finalText.style.animation = "cuteTextPop 0.3s ease";
    }

    // Trigger otter kiss GIF
    playOtterKiss();

    launchMiniConfetti();

    for (let i = 0; i < 12; i++) {
        setTimeout(createFloatingHeart, i * 90);
    }
}

if (easterEggText) {
    easterEggText.addEventListener("click", triggerEasterEgg);

    easterEggText.addEventListener("touchstart", (e) => {
        e.preventDefault();
        triggerEasterEgg();
    });
}

// ===============================
// Create loading overlay
// ===============================
const loadingOverlay = document.createElement("div");
loadingOverlay.className = "loading-love-overlay";

loadingOverlay.innerHTML = `
    <div class="loading-love-box">
        <div class="loading-love-title">Đang gửi tình iu... 💌</div>
        <div class="loading-bar">
            <div class="loading-fill" id="loading-fill"></div>
        </div>
        <div class="loading-percent" id="loading-percent">0%</div>
    </div>
`;

document.body.appendChild(loadingOverlay);

// ===============================
// Create sticker quiz overlay
// ===============================
const stickerQuizOverlay = document.createElement("div");
stickerQuizOverlay.className = "sticker-quiz-overlay";

stickerQuizOverlay.innerHTML = `
    <div class="sticker-quiz-box">
        <div class="sticker-quiz-title">Chọn 1 GIF sticker Tuấn Anh đi nè 🎁</div>
        <div class="sticker-quiz-subtitle">Bấm sticker nào là tải GIF đó về máy nha 💖</div>
        <div class="sticker-grid" id="sticker-grid"></div>
        <button id="skip-sticker-btn" class="skip-sticker-btn">Skip sticker ➜</button>
    </div>
`;

document.body.appendChild(stickerQuizOverlay);

const stickerGrid = document.getElementById("sticker-grid");
const skipStickerBtn = document.getElementById("skip-sticker-btn");

// ===============================
// Skip sticker button
// ===============================
if (skipStickerBtn) {
    skipStickerBtn.addEventListener("click", () => {
        stickerQuizOverlay.style.display = "none";

        if (finalText) {
            finalText.textContent = "Skip sticker rồi nha, đi tiếp nè 💌";
            finalText.style.animation = "none";
            void finalText.offsetWidth;
            finalText.style.animation = "cuteTextPop 0.3s ease";
        }

        setTimeout(() => {
            startLoveLoading();
        }, 400);
    });
}

// ===============================
// Build sticker cards
// ===============================
tuanAnhStickers.forEach((sticker, index) => {
    const card = document.createElement("div");
    card.className = "sticker-card";

    card.innerHTML = `
        <img 
            src="${sticker.preview}" 
            alt="${sticker.name}" 
            onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';"
        />
        <div class="sticker-card-fallback">${sticker.emoji}</div>
        <div class="sticker-card-name">${sticker.name}</div>
    `;

    card.addEventListener("click", () => {
        downloadSticker(sticker.download, `tuan-anh-sticker-${index + 1}.gif`);

        if (finalText) {
            finalText.textContent = `Đã tặng ${sticker.name} rồi nha 🎁`;
            finalText.style.animation = "none";
            void finalText.offsetWidth;
            finalText.style.animation = "cuteTextPop 0.3s ease";
        }

        stickerQuizOverlay.style.display = "none";

        setTimeout(() => {
            startLoveLoading();
        }, 600);
    });

    stickerGrid.appendChild(card);
});

// ===============================
// Floating hearts
// ===============================
function createFloatingHeart() {
    const heart = document.createElement("div");
    heart.className = "floating-heart";

    const hearts = ["💖", "💕", "💗", "💓", "🌸", "✨"];
    heart.textContent = hearts[Math.floor(Math.random() * hearts.length)];

    heart.style.left = Math.random() * 100 + "vw";
    heart.style.fontSize = Math.random() * 12 + 18 + "px";

    document.body.appendChild(heart);

    setTimeout(() => {
        heart.remove();
    }, 3000);
}

function startFloatingHearts() {
    if (heartInterval) return;

    heartInterval = setInterval(() => {
        createFloatingHeart();
    }, 450);
}

// ===============================
// Click Envelope
// ===============================
if (envelope) {
    envelope.addEventListener("click", () => {
        envelope.style.display = "none";
        letter.style.display = "flex";

        setTimeout(() => {
            letterWindow.classList.add("open");
        }, 50);

        startFloatingHearts();
    });
}

// ===============================
// Funny No messages
// ===============================
const noMessages = [
    "Ủa bấm nhầm hả? 🥺",
    "Không được chọn No đâu nha 😤",
    "Nút này bị cấm rồi hehe",
    "Try again bestie 😌",
    "No chạy trước nha 🏃‍♀️💨",
    "Bạn chắc chưa? Nghĩ lại đi 😭",
    "No said: hôm nay tui nghỉ làm 😌",
    "Hehe bắt không được đâu 😝",
    "Error 404: No option not found 💅",
    "System rejected your answer 😌",
    "Bạn không có quyền chọn No nha 🫵",
    "No button đang bảo trì rồi á 🛠️",
    "Sai đáp án rồi, chọn lại đi 😭",
    "Tui giả bộ không thấy lựa chọn đó nha 🙈"
];

function showNoMessage() {
    if (!finalText) return;

    const randomMessage = noMessages[Math.floor(Math.random() * noMessages.length)];

    finalText.style.display = "block";
    finalText.textContent = randomMessage;

    finalText.style.animation = "none";
    void finalText.offsetWidth;
    finalText.style.animation = "cuteTextPop 0.3s ease";
}

function shakeCat() {
    if (!catImg || otterKissing || yesClicked) return;

    catImg.classList.remove("shake-cute");

    void catImg.offsetWidth;

    catImg.classList.add("shake-cute");
}

// ===============================
// No button becomes Yes after 7 tries
// IMPORTANT:
// Hover will NOT redirect after it becomes Yes.
// It only redirects/continues when user actually clicks.
// ===============================
function turnNoIntoYes() {
    if (noTurnedIntoYes) return;

    noTurnedIntoYes = true;

    noBtn.src = "yes.png";
    noBtn.alt = "Yes";
    noBtn.classList.add("yes-mode");

    noBtn.style.transform = "translate(0px, 0px)";
    noBtn.style.transition = "transform 0.3s ease";

    if (finalText) {
        finalText.textContent = "No đã suy nghĩ lại và chuyển thành Yes rồi 💅 Bấm vào đi nè!";
        finalText.style.animation = "none";
        void finalText.offsetWidth;
        finalText.style.animation = "cuteTextPop 0.3s ease";
    }

    launchMiniConfetti();
}

function moveNoButton() {
    // Nếu No đã thành Yes rồi thì hover KHÔNG làm gì hết.
    // Phải click mới chạy handleYesClick().
    if (noTurnedIntoYes) {
        return;
    }

    noTouchCount++;

    if (noTouchCount >= 7) {
        turnNoIntoYes();
        return;
    }

    const isMobile = window.innerWidth <= 600;

    const min = isMobile ? 40 : 160;
    const max = isMobile ? 90 : 240;

    const distance = Math.random() * (max - min) + min;
    const angle = Math.random() * Math.PI * 2;

    const moveX = Math.cos(angle) * distance;
    const moveY = Math.sin(angle) * distance;

    noBtn.style.transition = "transform 0.3s ease";
    noBtn.style.transform = `translate(${moveX}px, ${moveY}px)`;

    showNoMessage();
    shakeCat();
}

// Computer hover
noBtn.addEventListener("mouseover", moveNoButton);

// Mobile touch
noBtn.addEventListener("touchstart", (e) => {
    e.preventDefault();

    if (noTurnedIntoYes) {
        handleYesClick();
    } else {
        moveNoButton();
    }
});

// Click No / changed-Yes button
noBtn.addEventListener("click", (e) => {
    e.preventDefault();

    if (noTurnedIntoYes) {
        handleYesClick();
    } else {
        moveNoButton();
    }
});

// ===============================
// Confetti fireworks
// ===============================
function launchMiniConfetti() {
    if (typeof confetti !== "function") return;

    confetti({
        particleCount: 80,
        spread: 80,
        startVelocity: 35,
        origin: { x: 0.5, y: 0.65 },
        colors: ["#ff69b4", "#ff1493", "#ffc0cb", "#ffffff"]
    });
}

function launchFireworks() {
    if (typeof confetti !== "function") {
        console.warn("Confetti library not loaded.");
        return;
    }

    const colors = ["#ff69b4", "#ff1493", "#ffc0cb", "#ffe4e1", "#ffffff"];

    confetti({
        particleCount: 160,
        spread: 100,
        startVelocity: 45,
        origin: { x: 0.5, y: 0.6 },
        colors: colors
    });

    setTimeout(() => {
        confetti({
            particleCount: 120,
            spread: 120,
            startVelocity: 50,
            origin: { x: 0.2, y: 0.5 },
            colors: colors
        });
    }, 600);

    setTimeout(() => {
        confetti({
            particleCount: 120,
            spread: 120,
            startVelocity: 50,
            origin: { x: 0.8, y: 0.5 },
            colors: colors
        });
    }, 1200);

    const duration = 2500;
    const end = Date.now() + duration;

    function frame() {
        confetti({
            particleCount: 5,
            angle: 60,
            spread: 70,
            origin: { x: 0 },
            colors: colors
        });

        confetti({
            particleCount: 5,
            angle: 120,
            spread: 70,
            origin: { x: 1 },
            colors: colors
        });

        if (Date.now() < end) {
            requestAnimationFrame(frame);
        }
    }

    frame();
}

// ===============================
// Achievement
// ===============================
function showAchievement() {
    const achievement = document.createElement("div");
    achievement.className = "achievement-box";
    achievement.innerHTML = `
        🏆 Achievement Unlocked<br>
        <strong>Bảnh trai nhất đời 💖</strong>
    `;

    document.body.appendChild(achievement);

    setTimeout(() => {
        achievement.remove();
    }, 3500);
}

// ===============================
// Sticker Quiz
// ===============================
function showStickerQuiz() {
    stickerQuizOverlay.style.display = "flex";
}

// ===============================
// Download Sticker
// ===============================
function downloadSticker(fileUrl, fileName) {
    const link = document.createElement("a");
    link.href = fileUrl;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    link.remove();
}

// ===============================
// Love Loading then redirect
// ===============================
function startLoveLoading() {
    loadingOverlay.style.display = "flex";

    const loadingFill = document.getElementById("loading-fill");
    const loadingPercent = document.getElementById("loading-percent");

    const steps = [
        { percent: 10, text: "10% - Đang gói sticker..." },
        { percent: 35, text: "35% - Đang thêm tim..." },
        { percent: 60, text: "60% - Đang gửi tình iu..." },
        { percent: 85, text: "85% - Gần xong rồi..." },
        { percent: 100, text: "100% - Doneeee 💖" }
    ];

    let index = 0;

    const interval = setInterval(() => {
        const step = steps[index];

        loadingFill.style.width = step.percent + "%";
        loadingPercent.textContent = step.text;

        index++;

        if (index >= steps.length) {
            clearInterval(interval);

            setTimeout(() => {
                window.location.href = "index1.html";
            }, 900);
        }
    }, 650);
}

// ===============================
// YES is clicked
// ===============================
function handleYesClick() {
    if (yesClicked) return;

    yesClicked = true;

    if (title) {
        title.textContent = "";
        title.style.display = "none";
    }

    if (catImg) {
        catImg.src = "cat_dance.gif";
    }

    if (easterEggText) {
        easterEggText.style.display = "none";
    }

    letterWindow.classList.add("final");

    buttons.style.display = "none";

    if (finalText) {
        finalText.style.display = "block";
        finalText.textContent = "Yayyyy accepted 💕";

        finalText.style.animation = "none";
        void finalText.offsetWidth;
        finalText.style.animation = "cuteTextPop 0.3s ease";
    }

    launchFireworks();
    showAchievement();

    for (let i = 0; i < 18; i++) {
        setTimeout(createFloatingHeart, i * 110);
    }

    setTimeout(() => {
        showStickerQuiz();
    }, 2700);
}

yesBtn.addEventListener("click", handleYesClick);