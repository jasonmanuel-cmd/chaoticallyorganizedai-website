/* ============================================================
   INTRO FLASH PAGE JS — CHAOTICALLY ORGANIZED AI
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
    const introOverlay = document.getElementById('intro-overlay');
    const introLogo = document.getElementById('intro-logo');
    const introCanvas = document.getElementById('intro-canvas');
    if (!introOverlay) return;

    // --- SESSION CHECK (MOBILE & SEO UX) ---
    // If user has already seen the intro this session, skip it completely for faster access.
    if (sessionStorage.getItem('introSeen')) {
        introOverlay.style.display = 'none';
        introOverlay.remove();
        return;
    }

    // Mark as seen immediately so secondary page loads are instant
    sessionStorage.setItem('introSeen', 'true');

    // Add Skip Button after 1.5s
    const skipBtn = document.createElement('button');
    skipBtn.id = 'skip-intro-btn';
    skipBtn.textContent = 'Skip Intro →';
    skipBtn.style.cssText = `
        position: fixed; bottom: 30px; right: 30px; z-index: 10001;
        background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.2);
        color: #fff; padding: 10px 20px; border-radius: 30px; cursor: pointer;
        font-size: 0.8rem; opacity: 0; transition: opacity 0.5s; backdrop-filter: blur(5px);
    `;
    document.body.appendChild(skipBtn);
    setTimeout(() => skipBtn.style.opacity = '1', 1500);

    const finishIntro = () => {
        introOverlay.classList.add('hidden');
        if (typeof codingLoop !== 'undefined') clearInterval(codingLoop);
        skipBtn.remove();
        setTimeout(() => introOverlay.remove(), 1000);
    };

    skipBtn.onclick = finishIntro;
    
    // 2. Start the Matrix digital code effect on canvas
    const ctx = introCanvas.getContext('2d');
    introCanvas.width = window.innerWidth;
    introCanvas.height = window.innerHeight;

    const chars = "010101010101ABCDEFHIJKLMNOPQRSTUVWXYZ";
    const charArr = chars.split("");
    const fontSize = 16;
    const columns = Math.ceil(introCanvas.width / fontSize);
    const drops = [];

    for (let i = 0; i < columns; i++) {
        drops[i] = 1;
    }

    let codingLoop;

    function drawMatrix() {
        ctx.fillStyle = "rgba(0, 0, 0, 0.05)";
        ctx.fillRect(0, 0, introCanvas.width, introCanvas.height);

        ctx.fillStyle = "#00ffcc"; // Neon core green/cyan
        ctx.font = fontSize + "px 'Courier New', monospace";

        for (let i = 0; i < drops.length; i++) {
            const text = charArr[Math.floor(Math.random() * charArr.length)];
            ctx.fillText(text, i * fontSize, drops[i] * fontSize);

            if (drops[i] * fontSize > introCanvas.height && Math.random() > 0.975) {
                drops[i] = 0;
            }
            drops[i]++;
        }
    }

    // Phase transitions
    setTimeout(() => {
        if (!document.getElementById('intro-overlay')) return;
        // Step 2: Transition into digital code
        introOverlay.classList.add('coding');
        codingLoop = setInterval(drawMatrix, 40);
    }, 1800); // Shorter logo phase (1.8s instead of 2.5s) for better UX

    setTimeout(() => {
        if (!document.getElementById('intro-overlay')) return;
        // Step 3: Fade out the intro and reveal content
        finishIntro();
    }, 4500); // Faster overall sequence (4.5s instead of 5.5s)
});
