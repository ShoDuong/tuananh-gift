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
// Click otter to kiss
// ===============================
function playOtterKiss() {
    if (!catImg || otterKissing || yesClicked) return;

    otterKissing = true;

    catImg.src = "";

    setTimeout(() => {
        catImg.src = "assets/img/otter_kiss.gif";
    }, 20);

    setTimeout(() => {
        if (!yesClicked) {
            catImg.src = "assets/img/otter_heart.gif";
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
        preview: "assets/stickers/tuananh/tuananh_sticker_1.png",
        download: "assets/stickers/tuananh/tuananh_sticker_1.gif",
        emoji: "🥺"
    },
    {
        name: "Sticker 2",
        preview: "assets/stickers/tuananh/tuananh_sticker_2.png",
        download: "assets/stickers/tuananh/tuananh_sticker_2.gif",
        emoji: "🕺"
    },
    {
        name: "Sticker 3",
        preview: "assets/stickers/tuananh/tuananh_sticker_3.png",
        download: "assets/stickers/tuananh/tuananh_sticker_3.gif",
        emoji: "😉"
    },
    {
        name: "Sticker 4",
        preview: "assets/stickers/tuananh/tuananh_sticker_4.png",
        download: "assets/stickers/tuananh/tuananh_sticker_4.gif",
        emoji: "💖"
    }
];

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
        <div class="sticker-quiz-title">Chọn 1 GIF sticker Anh đi nè 🎁</div>
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
    card.setAttribute("role", "button");
    card.setAttribute("tabindex", "0");

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

    card.addEventListener("keydown", (event) => {
        if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            card.click();
        }
    });

    card.addEventListener("pointermove", (event) => {
        const bounds = card.getBoundingClientRect();
        const x = (event.clientX - bounds.left) / bounds.width;
        const y = (event.clientY - bounds.top) / bounds.height;
        card.style.setProperty("--tilt-x", `${(0.5 - y) * 14}deg`);
        card.style.setProperty("--tilt-y", `${(x - 0.5) * 16}deg`);
        card.style.setProperty("--foil-x", `${x * 100}%`);
        card.style.setProperty("--foil-y", `${y * 100}%`);
    });

    card.addEventListener("pointerleave", () => {
        card.style.setProperty("--tilt-x", "0deg");
        card.style.setProperty("--tilt-y", "0deg");
        card.style.setProperty("--foil-x", "50%");
        card.style.setProperty("--foil-y", "50%");
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

    noBtn.src = "assets/img/yes.png";
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

const NO_TRIES_BEFORE_YES = 8;
const NO_DODGE_COOLDOWN = 450;
let lastNoDodge = 0;

function moveNoButton() {
    // Nếu No đã thành Yes rồi thì hover KHÔNG làm gì hết.
    // Phải click mới chạy handleYesClick().
    if (noTurnedIntoYes) {
        return;
    }

    // Nút chạy dưới con trỏ có thể bắn mouseover liên tục — chỉ tính 1 lần mỗi nhịp
    const now = Date.now();
    if (now - lastNoDodge < NO_DODGE_COOLDOWN) return;
    lastNoDodge = now;

    noTouchCount++;

    if (noTouchCount >= NO_TRIES_BEFORE_YES) {
        turnNoIntoYes();
        return;
    }

    const isMobile = window.innerWidth <= 600;

    const min = isMobile ? 50 : 90;
    const max = isMobile ? 110 : 170;

    // Giữ nút No luôn nằm trong khung thư và không đè lên nút Yes
    const area = letterWindow.getBoundingClientRect();
    const wrap = noBtn.parentElement.getBoundingClientRect();
    const yesRect = yesBtn.getBoundingClientRect();
    const pad = 12;

    let moveX = 0;
    let moveY = 0;

    for (let attempt = 0; attempt < 12; attempt++) {
        const distance = Math.random() * (max - min) + min;
        const angle = Math.random() * Math.PI * 2;

        moveX = Math.min(Math.max(Math.cos(angle) * distance, area.left + pad - wrap.left), area.right - pad - wrap.right);
        moveY = Math.min(Math.max(Math.sin(angle) * distance, area.top + 70 - wrap.top), area.bottom - pad - wrap.bottom);

        const overlapsYes =
            wrap.left + moveX < yesRect.right + 10 &&
            wrap.right + moveX > yesRect.left - 10 &&
            wrap.top + moveY < yesRect.bottom + 10 &&
            wrap.bottom + moveY > yesRect.top - 10;

        if (!overlapsYes) break;
    }

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
                window.location.href = "christmas-tree.html";
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
        catImg.src = "assets/img/cat_dance.gif";
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