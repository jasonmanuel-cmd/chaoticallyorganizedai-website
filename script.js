function toggleLanguage() {
    const btn = document.getElementById('lang-toggle');
    if (!btn) return;
    const isEn = btn.classList.contains('is-en');
    const cookiePath = ';path=/';
    const oneYear = ';max-age=31536000';
    if (isEn) {
        btn.classList.replace('is-en', 'is-es');
        document.cookie = `googtrans=/en/es${cookiePath}${oneYear}`;
        document.cookie = `googtrans=/auto/es${cookiePath}${oneYear}`;
    } else {
        btn.classList.replace('is-es', 'is-en');
        document.cookie = `googtrans=/en/en${cookiePath}${oneYear}`;
        document.cookie = `googtrans=/auto/en${cookiePath}${oneYear}`;
    }
    window.location.reload();
}

// Live Response Trigger - Speed Test Function
function initiateSpeedTest() {
    const phoneNumber = document.getElementById('speedTestNumber').value;
    const resultDiv = document.getElementById('speedTestResult');
    const resultText = resultDiv.querySelector('p');
    
    if (!phoneNumber || phoneNumber.length < 10) {
        resultText.textContent = 'Please enter a valid phone number';
        resultText.style.color = 'var(--accent-blue)';
        resultDiv.style.display = 'block';
        return;
    }
    
    // Start timing
    const startTime = performance.now();
    
    // Show countdown
    resultText.textContent = 'Calling in 3...';
    resultText.style.color = 'var(--accent-blue)';
    resultDiv.style.display = 'block';
    
    // Simulate the 3-second call initiation
    setTimeout(() => {
        const endTime = performance.now();
        const callTime = ((endTime - startTime) / 1000).toFixed(2);
        
        resultText.innerHTML = `⚡ Call initiated in ${callTime} seconds<br>Your phone should be ringing now.<br><small>If not, your first month is FREE.</small>`;
        resultText.style.color = 'var(--accent-blue)';
        
        // Track the speed test
        if (typeof gtag !== 'undefined') {
            gtag('event', 'speed_test_completed', {
                'phone_length': phoneNumber.length,
                'call_time': callTime
            });
        }
    }, 3000);
}

function syncLanguageToggleState() {
    const btn = document.getElementById('lang-toggle');
    if (!btn) return;
    const cookie = document.cookie || '';
    const isSpanish = cookie.includes('googtrans=/en/es') || cookie.includes('googtrans=/auto/es');
    btn.classList.toggle('is-es', isSpanish);
    btn.classList.toggle('is-en', !isSpanish);
}

function ensureJaxNavLink() {
    document.querySelectorAll('.nav-links').forEach((list) => {
        if (list.querySelector('a[href="jax-coming-soon.html"]')) return;
        const li = document.createElement('li');
        const a = document.createElement('a');
        a.href = 'jax-coming-soon.html';
        a.textContent = 'JAX Preview';
        li.appendChild(a);
        list.appendChild(li);
    });
}

function updateCalculator() {
    const missedCallsInput = document.getElementById('missedCalls');
    const jobValueInput = document.getElementById('jobValue');
    const closeRateInput = document.getElementById('closeRate');

    if (!missedCallsInput || !jobValueInput || !closeRateInput) return;

    const missed = parseInt(missedCallsInput.value, 10) || 0;
    const value = parseInt(jobValueInput.value, 10) || 0;
    const closeRate = (parseInt(closeRateInput.value, 10) || 0) / 100;

    const missedValueSpan = document.getElementById('missedValue');
    const jobValueDisplay = document.getElementById('jobValueDisplay');
    const closeRateValue = document.getElementById('closeRateValue');
    const totalLossSpan = document.getElementById('revenue-leak');

    if (missedValueSpan) missedValueSpan.textContent = missed;
    if (jobValueDisplay) jobValueDisplay.textContent = value.toLocaleString();
    if (closeRateValue) closeRateValue.textContent = Math.round(closeRate * 100);

    // Formula: (Missed Calls * Job Value * 30.4) * Close Rate = Monthly Leak
    const totalMonthlyLoss = Math.round((missed * value * 30.4) * closeRate);

    if (totalLossSpan) {
        totalLossSpan.textContent = totalMonthlyLoss.toLocaleString();
        
        // no-op
    }

}

function markActiveNav() {
    const current = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav-links a').forEach((link) => {
        if (link.getAttribute('href') === current) link.classList.add('active');
    });
}

function initSentientMesh() {
    const canvas = document.getElementById('sentient-mesh');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const pointer = { x: 0, y: 0 };
    let w = 0;
    let h = 0;
    const spacing = 60;

    function resize() {
        const rect = canvas.getBoundingClientRect();
        w = Math.max(1, Math.floor(rect.width));
        h = Math.max(1, Math.floor(rect.height));
        canvas.width = w;
        canvas.height = h;
    }

    function draw() {
        ctx.clearRect(0, 0, w, h);
        ctx.strokeStyle = 'rgba(122,255,219,0.18)';
        ctx.lineWidth = 1;
        for (let x = 0; x < w + spacing; x += spacing) {
            ctx.beginPath();
            for (let y = 0; y < h + spacing; y += spacing) {
                const dx = x - pointer.x;
                const dy = y - pointer.y;
                const dist = Math.sqrt(dx * dx + dy * dy) || 1;
                const influence = Math.max(0, 30 - dist / 12);
                const wave = Math.sin((y + performance.now() * 0.03) * 0.02) * 4;
                const nx = x + wave + influence * 0.22;
                const ny = y + Math.cos((x + performance.now() * 0.02) * 0.02) * 3;
                if (y === 0) ctx.moveTo(nx, ny);
                else ctx.lineTo(nx, ny);
            }
            ctx.stroke();
        }
        requestAnimationFrame(draw);
    }

    window.addEventListener('mousemove', (e) => {
        const rect = canvas.getBoundingClientRect();
        pointer.x = e.clientX - rect.left;
        pointer.y = e.clientY - rect.top;
    });

    window.addEventListener('resize', resize);
    resize();
    draw();
}

function initLiveRevenueTicker() {
    const valueEl = document.getElementById('live-revenue-value');
    if (!valueEl) return;
    let value = 148230;
    setInterval(() => {
        value += Math.floor(Math.random() * 420) + 90;
        valueEl.textContent = value.toLocaleString();
    }, 2800);
}

function initModeToggle() {
    const toggle = document.getElementById('mode-toggle');
    if (!toggle) return;
    const applyMode = () => {
        document.body.classList.toggle('ai-organized', toggle.checked);
        document.body.classList.toggle('manual-chaos', !toggle.checked);
    };
    toggle.addEventListener('change', applyMode);
    applyMode();
}

function initProofMap() {
    const popupClient = document.getElementById('map-client');
    if (!popupClient) return;
    const beforeEl = document.getElementById('map-before');
    const afterEl = document.getElementById('map-after');
    const impactEl = document.getElementById('map-impact');
    document.querySelectorAll('.map-pin').forEach((pin) => {
        pin.addEventListener('mouseenter', () => {
            popupClient.textContent = pin.dataset.client || 'Client';
            beforeEl.textContent = pin.dataset.before || '';
            afterEl.textContent = pin.dataset.after || '';
            impactEl.textContent = pin.dataset.impact || '';
        });
    });
}

function initJaxSentinel() {
    const panel = document.getElementById('jax-sentinel');
    const open = document.getElementById('jax-open');
    const run = document.getElementById('jax-run');
    const input = document.getElementById('jax-command');
    const log = document.getElementById('jax-log');
    if (!panel || !open || !run || !input || !log) return;

    open.addEventListener('click', () => panel.classList.toggle('active'));
    const execute = () => {
        const cmd = (input.value || '').toLowerCase().trim();
        if (!cmd) return;
        let target = null;
        if (cmd.includes('hvac') || cmd.includes('1200') || cmd.includes('starting')) target = '#svc-websites';
        else if (cmd.includes('pricing') || cmd.includes('package')) target = '#services';
        else if (cmd.includes('calculator') || cmd.includes('roi')) target = '#calculator';
        else if (cmd.includes('diagnostic')) target = '#diagnostic';
        if (target) {
            const el = document.querySelector(target);
            if (el) {
                el.scrollIntoView({ behavior: 'smooth', block: 'center' });
                el.classList.add('jax-highlight');
                setTimeout(() => el.classList.remove('jax-highlight'), 1500);
                log.textContent = `Command accepted -> navigated to ${target}`;
            }
        } else {
            log.textContent = 'Command not recognized. Try: "show hvac package", "open pricing", "go calculator".';
        }
        input.value = '';
    };

    run.addEventListener('click', execute);
    input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') execute();
    });
}

function initDiagnosticFlow() {
    const app = document.getElementById('diagnostic-app');
    if (!app) return;
    let step = 1;
    const total = 5;
    const prev = document.getElementById('diag-prev');
    const next = document.getElementById('diag-next');
    const generate = document.getElementById('diag-generate');
    const result = document.getElementById('diag-result');
    const calls = document.getElementById('diag-calls');
    const ticket = document.getElementById('diag-ticket');
    const confidence = document.getElementById('diag-confidence');

    function syncRanges() {
        const c1 = document.getElementById('diag-calls-value');
        const c2 = document.getElementById('diag-ticket-value');
        const c3 = document.getElementById('diag-confidence-value');
        if (calls && c1) c1.textContent = calls.value;
        if (ticket && c2) c2.textContent = Number(ticket.value).toLocaleString();
        if (confidence && c3) c3.textContent = confidence.value;
    }

    function renderStep() {
        app.querySelectorAll('.diag-step').forEach((el) => el.classList.remove('active'));
        const current = app.querySelector(`.diag-step[data-step="${step}"]`);
        if (current) current.classList.add('active');
        if (prev) prev.style.display = step === 1 ? 'none' : 'inline-block';
        if (next) next.style.display = step === total ? 'none' : 'inline-block';
        if (generate) generate.style.display = step === total ? 'inline-block' : 'none';
        syncRanges();
    }

    [calls, ticket, confidence].forEach((el) => {
        if (el) el.addEventListener('input', syncRanges);
    });

    if (prev) prev.addEventListener('click', () => { step = Math.max(1, step - 1); renderStep(); });
    if (next) next.addEventListener('click', () => { step = Math.min(total, step + 1); renderStep(); });
    if (generate) {
        generate.addEventListener('click', () => {
            const trade = document.getElementById('diag-trade')?.value || 'Service Business';
            const missed = Number(calls?.value || 0);
            const avgTicket = Number(ticket?.value || 0);
            const closeRate = 0.28;
            const monthly = Math.round(missed * avgTicket * 30.4 * closeRate);
            const confidenceScore = Number(confidence?.value || 5);
            const bottleneck = document.getElementById('diag-bottleneck')?.value || 'Lead handling';
            const summary = [
                `Growth Map for ${trade}`,
                `Estimated recoverable monthly revenue: $${monthly.toLocaleString()}`,
                `Current confidence score: ${confidenceScore}/10`,
                `Primary bottleneck: ${bottleneck}`,
                'Next move: deploy Package 1 foundation + missed-call AI layer.'
            ].join('\n');
            result.style.display = 'block';
            result.innerHTML = `<strong>Instant Growth Map Ready</strong><br><br>${summary.replace(/\n/g, '<br>')}<br><br><button class="btn btn-primary" id="download-growth-map" type="button">Download Growth Map</button>`;
            const dl = document.getElementById('download-growth-map');
            if (dl) {
                dl.addEventListener('click', () => {
                    const blob = new Blob([summary], { type: 'text/plain;charset=utf-8' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = 'coai-growth-map.txt';
                    a.click();
                    URL.revokeObjectURL(url);
                });
            }
        });
    }
    renderStep();
}

function initRoiDashboard() {
    const modal = document.getElementById('roi-modal');
    const open = document.getElementById('open-roi-dashboard');
    const close = document.getElementById('close-roi-dashboard');
    const output = document.getElementById('roi-output');
    const overhead = document.getElementById('roi-overhead');
    const missed = document.getElementById('roi-missed');
    const ticket = document.getElementById('roi-ticket');
    const closeRate = document.getElementById('roi-close');
    if (!modal || !open || !close || !output || !overhead || !missed || !ticket || !closeRate) return;

    const render = () => {
        const m = Number(missed.value || 0);
        const t = Number(ticket.value || 0);
        const c = Math.max(0, Number(closeRate.value || 0)) / 100;
        const o = Number(overhead.value || 0);
        const monthlyRecovered = Math.round(m * t * 30.4 * c);
        const annualRecovered = monthlyRecovered * 12;
        const roi = o > 0 ? ((annualRecovered - o * 12) / (o * 12)) * 100 : 0;
        output.innerHTML = `Estimated monthly recovered revenue: <strong>$${monthlyRecovered.toLocaleString()}</strong><br>Estimated annual recovered revenue: <strong>$${annualRecovered.toLocaleString()}</strong><br>Projected annual ROI: <strong>${roi.toFixed(1)}%</strong>`;
    };

    [overhead, missed, ticket, closeRate].forEach((el) => el.addEventListener('input', render));
    open.addEventListener('click', () => { modal.classList.add('active'); render(); });
    close.addEventListener('click', () => modal.classList.remove('active'));
    modal.addEventListener('click', (e) => { if (e.target === modal) modal.classList.remove('active'); });
}

function initMagneticButtons() {
    if (window.matchMedia('(pointer: coarse)').matches) return;
    document.querySelectorAll('.btn, .btn-hero-primary, .btn-hero-secondary').forEach((btn) => {
        btn.addEventListener('mousemove', (e) => {
            const r = btn.getBoundingClientRect();
            const dx = (e.clientX - (r.left + r.width / 2)) * 0.12;
            const dy = (e.clientY - (r.top + r.height / 2)) * 0.18;
            btn.style.transform = `translate(${dx}px, ${dy}px)`;
        });
        btn.addEventListener('mouseleave', () => {
            btn.style.transform = '';
        });
    });
}

/* --- AUDIO PLAYER CONTROL --- */
function toggleAudio(type) {
    const card = document.getElementById(`audio-${type}`);
    const audio = document.getElementById(`audio-file-${type}`);
    const btn = card.querySelector('.play-btn');

    if (!audio) return;

    if (audio.paused) {
        // Pause all other audios first
        document.querySelectorAll('audio').forEach(a => {
            a.pause();
            a.currentTime = 0;
        });
        document.querySelectorAll('.audio-card').forEach(c => c.classList.remove('playing'));
        document.querySelectorAll('.play-btn').forEach(b => b.textContent = '▶');

        audio.play();
        card.classList.add('playing');
        btn.textContent = '⏸';
    } else {
        audio.pause();
        card.classList.remove('playing');
        btn.textContent = '▶';
    }

    audio.onended = () => {
        card.classList.remove('playing');
        btn.textContent = '▶';
    };
}

/* --- MULTI-STEP FORM LOGIC --- */
let currentStep = 1;

function nextStep(step) {
    const currentFormStep = document.getElementById(`step-${currentStep}`);
    
    // Simple Validation
    const inputs = currentFormStep.querySelectorAll('input[required], select[required]');
    let valid = true;
    inputs.forEach(input => {
        if (!input.value) {
            valid = false;
            input.style.borderColor = 'var(--accent-blue)';
        } else {
            input.style.borderColor = 'var(--glass-border)';
        }
    });

    if (!valid) return;

    // 1-person businesses are fully supported.
    if (currentStep === 2) {
        const bottleneck = document.getElementById('bottleneck').value;
        if (bottleneck === 'none') {
             showNoFit('If you have 0 bottlenecks, you might already be at peak efficiency! Our AI thrives on fixing systems that are currently leaking.');
             return;
        }
    }

    currentFormStep.classList.remove('active');
    currentStep = step;
    const nextFormStep = document.getElementById(`step-${currentStep}`);
    if (nextFormStep) nextFormStep.classList.add('active');
    
    updateStepIndicators();
}

function prevStep(step) {
    const currentFormStep = document.getElementById(`step-${currentStep}`);
    currentFormStep.classList.remove('active');
    currentStep = step;
    const nextFormStep = document.getElementById(`step-${currentStep}`);
    if (nextFormStep) nextFormStep.classList.add('active');
    
    updateStepIndicators();
}

function updateStepIndicators() {
    document.querySelectorAll('.indicator-dot').forEach((dot, index) => {
        if (index + 1 <= currentStep) {
            dot.classList.add('active');
        } else {
            dot.classList.remove('active');
        }
    });
}

function showNoFit(message) {
    const container = document.querySelector('.step-form-container');
    container.innerHTML = `
        <div class="no-fit-message">
            <h3 style="color:var(--accent-blue);">We aren't a fit yet.</h3>
            <p style="color:#fff; margin:20px 0;">${message}</p>
            <a href="index.html" class="btn">Return Home</a>
        </div>
    `;
}

function enforceGlobalBrandConsistency() {
    const canonicalEmail = 'KIO2Organized@gmail.com';

    // Keep all contact links and visible email text consistent site-wide.
    document.querySelectorAll('a[href^="mailto:"]').forEach((link) => {
        link.setAttribute('href', `mailto:${canonicalEmail}`);
        if (link.textContent && link.textContent.includes('@')) {
            link.textContent = canonicalEmail;
        }
    });

    // Keep top nav and footer intake CTAs consistent across pages.
    document.querySelectorAll('a[href="intake.html"]').forEach((link) => {
        const text = (link.textContent || '').trim().toLowerCase();
        if (text.includes('free growth audit') || text.includes('claim my growth audit')) {
            link.textContent = 'Run My Growth Diagnostic';
        }
    });
}

// --- LANGUAGE SWITCHER ---
function toggleLanguage() {
    const btn = document.getElementById('lang-toggle');
    if (!btn) return;

    const isEn = btn.classList.contains('is-en');

    // Use cookie-based control for reliable Google Translate toggling.
    const cookiePath = ';path=/';
    const oneYear = ';max-age=31536000';

    if (isEn) {
        btn.classList.replace('is-en', 'is-es');
        document.cookie = `googtrans=/en/es${cookiePath}${oneYear}`;
        document.cookie = `googtrans=/auto/es${cookiePath}${oneYear}`;
        window.location.reload();
    } else {
        btn.classList.replace('is-es', 'is-en');
        document.cookie = `googtrans=/en/en${cookiePath}${oneYear}`;
        document.cookie = `googtrans=/auto/en${cookiePath}${oneYear}`;
        window.location.reload();
    }
}

function syncLanguageToggleState() {
    const btn = document.getElementById('lang-toggle');
    if (!btn) return;
    const cookie = document.cookie || '';
    const isSpanish = cookie.includes('googtrans=/en/es') || cookie.includes('googtrans=/auto/es');
    btn.classList.toggle('is-es', isSpanish);
    btn.classList.toggle('is-en', !isSpanish);
}

function ensureJaxNavLink() {
    const navLists = document.querySelectorAll('.nav-links');
    navLists.forEach((list) => {
        if (list.querySelector('a[href="jax-coming-soon.html"]')) return;
        const li = document.createElement('li');
        const a = document.createElement('a');
        a.href = 'jax-coming-soon.html';
        a.textContent = 'JAX Preview';
        li.appendChild(a);
        list.appendChild(li);
    });
}

// Initialize Everything
document.addEventListener('DOMContentLoaded', () => {
    enforceGlobalBrandConsistency();
    syncLanguageToggleState();
    ensureJaxNavLink();
    markActiveNav();

    const header = document.getElementById('main-header');
    window.addEventListener('scroll', () => {
        if (!header) return;
        header.classList.toggle('scrolled', window.scrollY > 40);
    }, { passive: true });

    const menuToggle = document.getElementById('menu-toggle');
    const navMain = document.querySelector('.nav-main');
    if (menuToggle && navMain) {
        menuToggle.addEventListener('click', () => {
            const expanded = menuToggle.getAttribute('aria-expanded') === 'true';
            menuToggle.setAttribute('aria-expanded', String(!expanded));
            navMain.classList.toggle('active');
        });
    }

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            const target = document.querySelector(targetId);
            if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
    });

    document.querySelectorAll('#year').forEach((el) => { el.textContent = new Date().getFullYear(); });

    const inputs = ['missedCalls', 'jobValue', 'closeRate'];
    inputs.forEach((id) => { const el = document.getElementById(id); if (el) el.addEventListener('input', updateCalculator); });
    updateCalculator();

    if ('IntersectionObserver' in window) {
        const revealObserver = new IntersectionObserver((entries, obs) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                    obs.unobserve(entry.target);
                }
            });
        }, { rootMargin: '0px 0px -100px 0px', threshold: 0.1 });

        document.querySelectorAll('.reveal').forEach((el) => revealObserver.observe(el));
    }

    initSentientMesh();
    initLiveRevenueTicker();
    initModeToggle();
    initProofMap();
    initJaxSentinel();
    initDiagnosticFlow();
    initRoiDashboard();
    initMagneticButtons();
});
