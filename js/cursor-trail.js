(function () {
  const style = document.createElement("style");
  style.textContent = `
    html, body { cursor: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='32' height='32' viewBox='0 0 32 32'%3E%3Cpath d='M16 3c-3 0-5 3-5 6 0 1 .2 2 .6 2.8C8.5 10.5 5 12 5 15c0 2 1.7 3.4 3.8 3.4.8 0 1.6-.2 2.2-.5-1 2.5-.5 5.7 2.2 7.5 1.4 1 2.9.2 3.2-1.4.3 1.6 1.8 2.4 3.2 1.4 2.7-1.8 3.2-5 2.2-7.5.6.3 1.4.5 2.2.5C24.3 18.4 26 17 26 15c0-3-3.5-4.5-6.6-3.2.4-.8.6-1.8.6-2.8 0-3-2-6-4-6Z' fill='%23d58aa2' stroke='%235b3b5d' stroke-width='1.5'/%3E%3C/svg%3E") 12 12, auto; }
    .cursor-trail { position: fixed; z-index: 999999; pointer-events: none; font-size: 18px; line-height: 1; animation: cursor-trail-fade .8s ease-out forwards; }
    @keyframes cursor-trail-fade { to { opacity: 0; transform: translate(var(--trail-x), var(--trail-y)) rotate(18deg) scale(.5); } }
  `;
  document.head.appendChild(style);

  const symbols = ["🐾", "💖", "✨"];
  let lastSpawn = 0;
  function spawnTrail(event) {
    const now = performance.now();
    if (now - lastSpawn < 70) return;
    lastSpawn = now;
    const trail = document.createElement("span");
    trail.className = "cursor-trail";
    trail.textContent = symbols[Math.floor(Math.random() * symbols.length)];
    trail.style.left = `${event.clientX}px`;
    trail.style.top = `${event.clientY}px`;
    trail.style.setProperty("--trail-x", `${(Math.random() - .5) * 34}px`);
    trail.style.setProperty("--trail-y", `${-18 - Math.random() * 28}px`);
    document.body.appendChild(trail);
    trail.addEventListener("animationend", () => trail.remove(), { once: true });
  }

  document.addEventListener("pointermove", spawnTrail, { passive: true });
  document.addEventListener("pointerdown", (event) => {
    spawnTrail(event);
    spawnTrail({ clientX: event.clientX + 12, clientY: event.clientY + 8 });
  }, { passive: true });
})();
