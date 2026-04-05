// --- GOD-LEVEL SYNTHETIC SOUND ENGINE ---
class NeuralSound {
    constructor() {
        this.ctx = new (window.AudioContext || window.webkitAudioContext)();
    }

    // High-end UI "Tick" for sliders
    tick() {
        if (this.ctx.state === 'suspended') this.ctx.resume();
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(800, this.ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(10, this.ctx.currentTime + 0.05);
        gain.gain.setValueAtTime(0.01, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.05);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start();
        osc.stop(this.ctx.currentTime + 0.05);
    }

    // Success Bloom for clicking buttons
    bloom() {
        if (this.ctx.state === 'suspended') this.ctx.resume();
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(440, this.ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(880, this.ctx.currentTime + 0.2);
        gain.gain.setValueAtTime(0.02, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.2);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start();
        osc.stop(this.ctx.currentTime + 0.2);
    }
}

const AudioUI = new NeuralSound();

// // Custom Cursor Initialization
function initCustomCursor() {
    if (window.matchMedia("(pointer: coarse)").matches) return; // Skip on touch devices

    const dot = document.createElement('div');
    const ring = document.createElement('div');
    dot.className = 'custom-cursor';
    ring.className = 'cursor-follower';
    document.body.appendChild(dot);
    document.body.appendChild(ring);

    document.addEventListener('mousemove', (e) => {
        dot.style.transform = `translate(${e.clientX - 4}px, ${e.clientY - 4}px)`;
        ring.style.transform = `translate(${e.clientX - 16}px, ${e.clientY - 16}px)`;
    });

    const activeElements = 'a, button, input, select, textarea, .glass-card-new, .service-card-new';
    document.querySelectorAll(activeElements).forEach(el => {
        el.addEventListener('mouseenter', () => {
            document.body.classList.add('cursor-active');
            if (el.tagName === 'A' || el.tagName === 'BUTTON') AudioUI.tick();
        });
        el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-active'));
        el.addEventListener('click', () => AudioUI.bloom());
    });
}

// Live Response Trigger - Speed Test Function
function initiateSpeedTest() {
    const phoneNumber = document.getElementById('speedTestNumber').value;
    const resultDiv = document.getElementById('speedTestResult');
    const resultText = resultDiv.querySelector('p');
    
    if (!phoneNumber || phoneNumber.length < 10) {
        resultText.textContent = 'Please enter a valid phone number';
        resultText.style.color = '#ff4444';
        resultDiv.style.display = 'block';
        return;
    }
    
    // Start timing
    const startTime = performance.now();
    
    // Show countdown
    resultText.textContent = 'Calling in 3...';
    resultText.style.color = 'var(--crimson-core)';
    resultDiv.style.display = 'block';
    
    // Simulate the 3-second call initiation
    setTimeout(() => {
        const endTime = performance.now();
        const callTime = ((endTime - startTime) / 1000).toFixed(2);
        
        resultText.innerHTML = `⚡ Call initiated in ${callTime} seconds<br>Your phone should be ringing now.<br><small>If not, your first month is FREE.</small>`;
        resultText.style.color = 'var(--crimson-core)';
        
        // Track the speed test
        if (typeof gtag !== 'undefined') {
            gtag('event', 'speed_test_completed', {
                'phone_length': phoneNumber.length,
                'call_time': callTime
            });
        }
    }, 3000);
}

const GA_MEASUREMENT_ID = 'G-ZYCPQEBGTN';
const ATTRIBUTION_KEYS = [
    'utm_source',
    'utm_medium',
    'utm_campaign',
    'utm_term',
    'utm_content',
    'gclid',
    'gbraid',
    'wbraid',
    'fbclid',
    'msclkid',
    'ttclid',
    'li_fat_id'
];

function safeLocalSet(key, value) {
    try {
        localStorage.setItem(key, value);
    } catch (error) {
        // Storage can be blocked in strict privacy modes.
    }
}

function safeLocalGet(key) {
    try {
        return localStorage.getItem(key);
    } catch (error) {
        return null;
    }
}

function safeSessionSet(key, value) {
    try {
        sessionStorage.setItem(key, value);
    } catch (error) {
        // Ignore storage failures.
    }
}

function safeSessionGet(key) {
    try {
        return sessionStorage.getItem(key);
    } catch (error) {
        return null;
    }
}

function ensureAnalytics() {
    const srcNeedle = `googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
    const hasGtagScript = !!document.querySelector(`script[src*="${srcNeedle}"]`);

    window.dataLayer = window.dataLayer || [];
    if (typeof window.gtag !== 'function') {
        window.gtag = function () {
            window.dataLayer.push(arguments);
        };
    }

    const hasConfig = window.dataLayer.some((entry) => entry && entry[0] === 'config' && entry[1] === GA_MEASUREMENT_ID);
    if (!hasConfig) {
        window.gtag('js', new Date());
        window.gtag('config', GA_MEASUREMENT_ID);
    }

    if (!hasGtagScript) {
        const gaScript = document.createElement('script');
        gaScript.async = true;
        gaScript.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
        document.head.appendChild(gaScript);
    }
}

function getSessionId() {
    const existing = safeSessionGet('coai_session_id');
    if (existing) return existing;

    let generated = '';
    if (window.crypto && typeof window.crypto.randomUUID === 'function') {
        generated = window.crypto.randomUUID();
    } else {
        generated = `sid_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
    }

    safeSessionSet('coai_session_id', generated);
    return generated;
}

function ensureHiddenInput(form, name, value) {
    let field = form.querySelector(`input[name="${name}"]`);
    if (!field) {
        field = document.createElement('input');
        field.type = 'hidden';
        field.name = name;
        form.appendChild(field);
    }
    field.value = value || '';
}

function captureAndStoreAttribution() {
    const params = new URLSearchParams(window.location.search);

    ATTRIBUTION_KEYS.forEach((key) => {
        const value = params.get(key);
        if (value) safeLocalSet(`coai_${key}`, value);
    });

    if (!safeLocalGet('coai_first_touch_url')) {
        safeLocalSet('coai_first_touch_url', window.location.href);
    }
    if (!safeLocalGet('coai_first_touch_referrer')) {
        safeLocalSet('coai_first_touch_referrer', document.referrer || 'direct');
    }
    if (!safeLocalGet('coai_first_touch_at')) {
        safeLocalSet('coai_first_touch_at', new Date().toISOString());
    }

    safeLocalSet('coai_last_seen_url', window.location.href);
}

function setFormAttribution(form) {
    if (!form) return;

    const params = new URLSearchParams(window.location.search);

    ATTRIBUTION_KEYS.forEach((key) => {
        const value = params.get(key) || safeLocalGet(`coai_${key}`) || '';
        ensureHiddenInput(form, key, value);
    });

    ensureHiddenInput(form, 'landing_page', window.location.pathname);
    ensureHiddenInput(form, 'page_title', document.title);
    ensureHiddenInput(form, 'page_url', window.location.href);
    ensureHiddenInput(form, 'referrer_url', document.referrer || 'direct');
    ensureHiddenInput(form, 'first_touch_url', safeLocalGet('coai_first_touch_url') || window.location.href);
    ensureHiddenInput(form, 'first_touch_referrer', safeLocalGet('coai_first_touch_referrer') || document.referrer || 'direct');
    ensureHiddenInput(form, 'first_touch_at', safeLocalGet('coai_first_touch_at') || new Date().toISOString());
    ensureHiddenInput(form, 'last_seen_url', safeLocalGet('coai_last_seen_url') || window.location.href);
    ensureHiddenInput(form, 'session_id', getSessionId());

    if (!form.querySelector('input[name="_trap"]')) {
        const trapWrap = document.createElement('div');
        trapWrap.style.position = 'absolute';
        trapWrap.style.left = '-9999px';
        trapWrap.style.opacity = '0';
        trapWrap.setAttribute('aria-hidden', 'true');

        const trap = document.createElement('input');
        trap.type = 'text';
        trap.name = '_trap';
        trap.tabIndex = -1;
        trap.autocomplete = 'off';
        trap.value = '';
        trapWrap.appendChild(trap);
        form.appendChild(trapWrap);
    }
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
        
        // Auditory Feedback
        AudioUI.tick();

        // Thinking Pulse Animation
        document.body.classList.add('thinking');
        clearTimeout(window.thinkTimeout);
        window.thinkTimeout = setTimeout(() => {
            document.body.classList.remove('thinking');
        }, 500);

        // God-Level Glow Transition
        const parentContainer = totalLossSpan.parentElement.parentElement;
        if (totalMonthlyLoss > 10000) {
            parentContainer.classList.add('high-leak');
        } else {
            parentContainer.classList.remove('high-leak');
        }
    }

    // Update Pain Graphic
    const currentRev = value * 25; // Estimated baseline
    const potentialRev = currentRev + totalMonthlyLoss;

    const currentRevLabel = document.getElementById('currentRevLabel');
    const potentialRevLabel = document.getElementById('potentialRevLabel');
    const currentRevBar = document.getElementById('currentRevBar');
    const greenBaseBar = document.getElementById('greenBaseBar');
    const leakRevBar = document.getElementById('leakRevBar');

    if (currentRevLabel) currentRevLabel.textContent = '$' + currentRev.toLocaleString();
    if (potentialRevLabel) potentialRevLabel.textContent = '$' + potentialRev.toLocaleString();

    if (currentRevBar) {
        const currentPct = (currentRev / potentialRev) * 100;
        currentRevBar.style.width = currentPct + '%';
        if (greenBaseBar) greenBaseBar.style.width = currentPct + '%';
    }
}

function trackScrollDepth() {
    const fired = new Set();
    const marks = [25, 50, 75, 90];
    window.addEventListener('scroll', () => {
        const scrollTop = window.scrollY || document.documentElement.scrollTop;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        if (docHeight <= 0) return;
        const pct = Math.round((scrollTop / docHeight) * 100);
        marks.forEach((mark) => {
            if (pct >= mark && !fired.has(mark) && typeof gtag !== 'undefined') {
                fired.add(mark);
                gtag('event', 'scroll_depth', { percent: mark, page: window.location.pathname });
            }
        });
    }, { passive: true });
}

ensureAnalytics();

// Menu Toggle
const menuToggle = document.querySelector('.menu-toggle');
const navLinks = document.querySelector('.nav-links');
const navMain = document.querySelector('.nav-main');
const pageOverlay = document.querySelector('.page-overlay');

if (menuToggle && navLinks && navMain) {
    menuToggle.addEventListener('click', (event) => {
        navLinks.classList.toggle('active');
        navMain.classList.toggle('active');
        const expanded = navLinks.classList.contains('active');
        menuToggle.setAttribute('aria-expanded', expanded ? 'true' : 'false');
        if (pageOverlay) pageOverlay.style.display = expanded ? 'block' : 'none';
        if (expanded) {
            const firstLink = navLinks.querySelector('a');
            if (firstLink) firstLink.focus();
        }
        event.stopPropagation();
    });

    document.addEventListener('click', (event) => {
        if ((navLinks.classList.contains('active') || navMain.classList.contains('active')) && !navMain.contains(event.target)) {
            navLinks.classList.remove('active');
            navMain.classList.remove('active');
            menuToggle.setAttribute('aria-expanded', 'false');
            if (pageOverlay) pageOverlay.style.display = 'none';
        }
    });

    document.addEventListener('keydown', (event) => {
        if ((event.key === 'Escape' || event.key === 'Esc') && navLinks.classList.contains('active')) {
            navLinks.classList.remove('active');
            navMain.classList.remove('active');
            menuToggle.setAttribute('aria-expanded', 'false');
            menuToggle.focus();
            if (pageOverlay) pageOverlay.style.display = 'none';
        }
    });
}

const yearSpan = document.getElementById('year');
if (yearSpan) yearSpan.textContent = new Date().getFullYear();

document.addEventListener('DOMContentLoaded', () => {
    captureAndStoreAttribution();

    const currentPath = window.location.pathname.split('/').pop() || 'index.html';
    const links = document.querySelectorAll('.nav-links a');
    links.forEach((link) => {
        const href = link.getAttribute('href');
        if (href === currentPath || (currentPath === '' && href === 'index.html')) {
            link.classList.add('active');
        }
    });

    const inputs = ['missedCalls', 'jobValue', 'closeRate'];
    inputs.forEach((id) => {
        const el = document.getElementById(id);
        if (el) el.addEventListener('input', updateCalculator);
    });

    // Initial calculation
    updateCalculator();

    document.querySelectorAll('a[href*="intake.html"], a[href^="tel:"], a[href^="mailto:"]').forEach((btn) => {
        btn.addEventListener('click', function () {
            const href = this.getAttribute('href') || '';
            let ctaType = 'form';
            if (href.startsWith('tel:')) ctaType = 'phone';
            if (href.startsWith('mailto:')) ctaType = 'email';

            if (typeof gtag !== 'undefined') {
                gtag('event', 'cta_click', {
                    cta_type: ctaType,
                    cta_href: href,
                    location: window.location.pathname
                });
            }
        });
    });

    document.querySelectorAll('form').forEach((form) => {
        setFormAttribution(form);
        const formAction = (form.getAttribute('action') || '').toLowerCase();
        const isLeadForm = formAction.includes('formspree.io') || form.id === 'calcUnlockForm';

        const formId = form.id || form.getAttribute('name') || 'unknown';
        if (typeof gtag !== 'undefined') {
            gtag('event', 'form_view', { form_id: formId, page: window.location.pathname });
        }

        let started = false;
        const markStart = () => {
            if (started) return;
            started = true;
            if (typeof gtag !== 'undefined') {
                gtag('event', 'form_start', { form_id: formId, page: window.location.pathname });
            }
        };
        form.addEventListener('focusin', markStart);
        form.addEventListener('input', markStart);

        form.addEventListener('submit', function (event) {
            const trap = this.querySelector('input[name="_trap"]');
            if (trap && trap.value && trap.value.trim() !== '') {
                event.preventDefault();
                if (typeof gtag !== 'undefined') {
                    gtag('event', 'bot_form_blocked', { form_id: formId, page: window.location.pathname });
                }
                return;
            }

            if (typeof gtag !== 'undefined') {
                gtag('event', 'form_submit', {
                    form_id: formId,
                    page: window.location.pathname
                });
            }

            if (isLeadForm) {
                if (typeof fbq !== 'undefined') fbq('track', 'Lead');

                markUserConverted();
                if (socialProofInterval) {
                    clearInterval(socialProofInterval);
                    socialProofInterval = null;
                }
                if (toastTimeout) {
                    clearTimeout(toastTimeout);
                    toastTimeout = null;
                }
                hideSocialProofToast();
            }
        });
    });

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

    trackScrollDepth();
    initExitIntentAndSocialProof();
});

/* ============================================
   EXIT INTENT POPUP & SOCIAL PROOF NOTIFICATIONS
   ============================================ */

// Social proof notification messages
const socialProofMessages = [
    "<span class=\"toast-name\">David T.</span> from Delano just booked an audit",
    "<span class=\"toast-name\">Maria S.</span> from Shafter requested a quote",
    "<span class=\"toast-name\">James R.</span> from Bakersfield downloaded the guide",
    "<span class=\"toast-name\">Robert L.</span> from Wasco started a free trial",
    "<span class=\"toast-name\">Sarah K.</span> from Oildale booked a consultation",
    "<span class=\"toast-name\">Mike R.</span> from Bakersfield signed up for services",
    "<span class=\"toast-name\">Jennifer H.</span> from Delano requested a callback",
    "<span class=\"toast-name\">Carlos M.</span> from Shafter downloaded the ROI calculator",
    "<span class=\"toast-name\">Amanda P.</span> from Bakersfield booked a demo",
    "<span class=\"toast-name\">Tom W.</span> from Rosedale started his free audit"
];

let socialProofIndex = 0;
let toastTimeout = null;
let socialProofInterval = null;

// Check if user has already converted (submitted a form)
function hasUserConverted() {
    return safeSessionGet('user_converted') === 'true';
}

// Mark user as converted
function markUserConverted() {
    safeSessionSet('user_converted', 'true');
}

// Show social proof toast notification
function showSocialProofToast() {
    // Don't show if user has converted
    if (hasUserConverted()) return;

    const toast = document.getElementById('social-proof-toast');
    const toastMessage = document.getElementById('toast-message');

    if (!toast || !toastMessage) return;

    // Set message
    toastMessage.innerHTML = socialProofMessages[socialProofIndex];

    // Show toast
    toast.style.display = 'block';
    toast.classList.remove('toast-hide');

    // Move to next message
    socialProofIndex = (socialProofIndex + 1) % socialProofMessages.length;

    // Clear any existing timeout
    if (toastTimeout) clearTimeout(toastTimeout);

    // Auto-dismiss after 5 seconds
    toastTimeout = setTimeout(() => {
        hideSocialProofToast();
    }, 5000);
}

// Hide social proof toast
function hideSocialProofToast() {
    const toast = document.getElementById('social-proof-toast');
    if (toast) {
        toast.classList.add('toast-hide');
        setTimeout(() => {
            toast.style.display = 'none';
            toast.classList.remove('toast-hide');
        }, 500);
    }
}

// Initialize social proof on DOM ready
function initExitIntentAndSocialProof() {
    // Only run on index.html (homepage)
    if (!window.location.pathname.endsWith('index.html') &&
        !window.location.pathname.endsWith('/') &&
        window.location.pathname !== '/') {
        return;
    }

    // Start social proof notifications after 10 seconds
    setTimeout(() => {
        // Show first notification
        showSocialProofToast();

        // Then show every 25 seconds
        socialProofInterval = setInterval(() => {
            showSocialProofToast();
        }, 25000);
    }, 10000);
}

/* ============================================
   LANGUAGE TRANSLATION SYSTEM (EN/ES)
   ============================================ */

function toggleLanguage() {
    // Determine target based on UI state or localStorage
    const currentLang = localStorage.getItem('user_requested_lang') || 'en';
    const targetLang = (currentLang === 'es') ? 'en' : 'es';
    
    // 1. Store preference immediately
    localStorage.setItem('user_requested_lang', targetLang);
    updateLangUI(targetLang);

    // 2. Set the cookie
    setGoogtransCookie(targetLang);
    
    // 3. Reliable switch requires a reload for Google Translate to pick up the change
    location.reload();
}

function setGoogtransCookie(lang) {
    const val = (lang === 'es') ? '/en/es' : '/en/en';
    const domain = window.location.hostname;
    const expires = 'path=/;';
    
    // Set for current domain
    document.cookie = `googtrans=${val}; ${expires}`;
    
    // Also set for domain variations to cover all bases
    if (domain && domain !== 'localhost' && !domain.match(/^\d/)) {
        document.cookie = `googtrans=${val}; ${expires} domain=${domain};`;
        document.cookie = `googtrans=${val}; ${expires} domain=.${domain};`;
    }
}

function updateLangUI(lang) {
    const btn = document.getElementById('lang-toggle');
    if (!btn) return;
    
    if (lang === 'es') {
        btn.classList.add('is-es');
        btn.classList.remove('is-en');
    } else {
        btn.classList.add('is-en');
        btn.classList.remove('is-es');
    }
}

// Initial UI sync
document.addEventListener('DOMContentLoaded', () => {
    // On load, ensure cookie matches localStorage preference
    const storedLang = localStorage.getItem('user_requested_lang') || 'en';
    
    // Check if current cookie matches
    const currentCookie = document.cookie.match(/googtrans=\/en\/([^;]+)/);
    const cookieLang = currentCookie ? currentCookie[1] : 'en';

    if (storedLang !== cookieLang) {
        setGoogtransCookie(storedLang);
        // If we just had to set the cookie, we might need a reload, 
        // but only if Google Translate hasn't already done its work.
        // For now, let's just sync the UI.
    }
    
    const syncUI = () => {
        const isES = document.cookie.indexOf('googtrans=/en/es') !== -1;
        updateLangUI(isES ? 'es' : 'en');
    };
    
    syncUI();
    setTimeout(syncUI, 500);
});
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
    const totalSteps = 4;
    const currentFormStep = document.getElementById(`step-${currentStep}`);
    
    // Simple Validation
    const inputs = currentFormStep.querySelectorAll('input[required], select[required]');
    let valid = true;
    inputs.forEach(input => {
        if (!input.value) {
            valid = false;
            input.style.borderColor = 'var(--crimson-core)';
        } else {
            input.style.borderColor = 'var(--glass-border)';
        }
    });

    if (!valid) return;

    // Logic: Filter out "1 truck" and "0 missed calls" (Step 1 & 2 check)
    if (currentStep === 1) {
        const trucks = document.getElementById('truckCount').value;
        if (trucks === '1') {
            showNoFit('It looks like you\'re just getting started. Our systems are currently optimized for fleets of 2+ trucks. Keep growing and check back soon!');
            return;
        }
    }

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
            <h3 style="color:var(--crimson-core);">We aren't a fit yet.</h3>
            <p style="color:#fff; margin:20px 0;">${message}</p>
            <a href="index.html" class="btn">Return Home</a>
        </div>
    `;
}

// Initialize Everything
document.addEventListener('DOMContentLoaded', () => {
    initCustomCursor();
    captureAndStoreAttribution();
    ensureAnalytics();

    // --- REVEAL ANIMATION ---
    document.body.style.opacity = '0';
    setTimeout(() => {
        document.body.style.transition = 'opacity 1s cubic-bezier(0.4, 0, 0.2, 1)';
        document.body.style.opacity = '1';
    }, 100);

    // --- HEADER SCROLL EFFECT ---
    const header = document.getElementById('main-header');
    if (header) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        });
    }

    // --- MOBILE MENU TOGGLE ---
    const menuToggle = document.getElementById('menu-toggle');
    const navLinks = document.getElementById('nav-links');
    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', () => {
            const isOpened = menuToggle.getAttribute('aria-expanded') === 'true';
            menuToggle.setAttribute('aria-expanded', !isOpened);
            navLinks.classList.toggle('active');
            document.body.style.overflow = isOpened ? '' : 'hidden'; // Prevent scroll when menu open
            AudioUI.tick();
        });

        // Close menu on link click
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                menuToggle.setAttribute('aria-expanded', 'false');
                navLinks.classList.remove('active');
                document.body.style.overflow = '';
            });
        });
    }

    // --- ACTIVE PAGE HIGHLIGHT ---
    const currentPath = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav-links a').forEach(link => {
        if (link.getAttribute('href') === currentPath) {
            link.classList.add('active');
        }
    });

    // --- SMOOTH SCROLL ---
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            const target = document.querySelector(targetId);
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // --- YEAR UPDATER ---
    const yearEl = document.getElementById('year');
    if (yearEl) yearEl.textContent = new Date().getFullYear();
});

// --- LANGUAGE SWITCHER ---
function toggleLanguage() {
    const btn = document.getElementById('lang-toggle');
    if (!btn) return;
    
    AudioUI.tick();
    
    // Check current state
    const isEn = btn.classList.contains('is-en');
    
    if (isEn) {
        // Switch to ES
        btn.classList.replace('is-en', 'is-es');
        // Logic for translation (Google Translate or manual)
        if (typeof google === 'object' && google.translate) {
            const el = document.querySelector('.goog-te-combo');
            if (el) {
                el.value = 'es';
                el.dispatchEvent(new Event('change'));
            }
        }
    } else {
        // Switch to EN
        btn.classList.replace('is-es', 'is-en');
        if (typeof google === 'object' && google.translate) {
            const el = document.querySelector('.goog-te-combo');
            if (el) {
                el.value = 'en';
                el.dispatchEvent(new Event('change'));
            }
        }
    }
}
