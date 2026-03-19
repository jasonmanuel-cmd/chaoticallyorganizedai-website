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
    const trafficInput = document.getElementById('webTraffic');
    const convRateInput = document.getElementById('convRate');
    const missedCallsInput = document.getElementById('missedCalls');
    const jobValueInput = document.getElementById('jobValue');

    if (!trafficInput || !convRateInput || !missedCallsInput || !jobValueInput) return;

    const traffic = parseFloat(trafficInput.value) || 0;
    const currentCR = parseFloat(convRateInput.value) || 0;
    const missed = parseInt(missedCallsInput.value, 10) || 0;
    const value = parseInt(jobValueInput.value, 10) || 0;

    const missedValueSpan = document.getElementById('missedValue');
    const jobValueDisplay = document.getElementById('jobValueDisplay');
    const totalLossSpan = document.getElementById('totalLoss');

    if (missedValueSpan) missedValueSpan.textContent = missed;
    if (jobValueDisplay) jobValueDisplay.textContent = value;

    const targetCR = 5.0;
    const diffCR = Math.max(0, targetCR - currentCR);
    const webRevenueLeak = Math.round(traffic * (diffCR / 100) * value);
    const phoneRevenueLeak = Math.round(missed * 0.3 * 22 * value);
    const totalMonthlyLoss = webRevenueLeak + phoneRevenueLeak;

    if (totalLossSpan) totalLossSpan.textContent = totalMonthlyLoss.toLocaleString();
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

    const inputs = ['webTraffic', 'convRate', 'missedCalls', 'jobValue'];
    inputs.forEach((id) => {
        const el = document.getElementById(id);
        if (el) el.addEventListener('input', updateCalculator);
    });

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

// Show exit intent popup
function showExitPopup() {
    const popup = document.getElementById('exit-popup');
    if (popup && !safeSessionGet('exit_popup_shown')) {
        popup.style.display = 'flex';
        safeSessionSet('exit_popup_shown', 'true');

        // Track in GA4
        if (typeof gtag !== 'undefined') {
            gtag('event', 'exit_intent_popup', {
                'event_category': 'engagement',
                'page': window.location.pathname
            });
        }
    }
}

// Close exit intent popup
function closeExitPopup() {
    const popup = document.getElementById('exit-popup');
    if (popup) {
        popup.style.display = 'none';
    }
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

// Initialize exit intent and social proof on DOM ready
function initExitIntentAndSocialProof() {
    // Only run on index.html (homepage)
    if (!window.location.pathname.endsWith('index.html') &&
        !window.location.pathname.endsWith('/') &&
        window.location.pathname !== '/') {
        return;
    }

    // Skip if popup already shown
    if (safeSessionGet('exit_popup_shown')) return;

    // Desktop: Exit intent detection (mouse leaves viewport)
    let exitIntentFired = false;
    document.addEventListener('mouseleave', (e) => {
        if (e.clientY <= 0 && !exitIntentFired) {
            exitIntentFired = true;
            showExitPopup();
        }
    });

    // Mobile: Scroll-to-top detection
    let lastScrollTop = 0;
    let hasScrolledDown = false;

    window.addEventListener('scroll', () => {
        const scrollTop = window.scrollY || document.documentElement.scrollTop;

        // Track if user has scrolled down significantly
        if (scrollTop > 300) {
            hasScrolledDown = true;
        }

        // If user scrolls up after being down, trigger popup
        if (hasScrolledDown && scrollTop < lastScrollTop && scrollTop < 100) {
            showExitPopup();
            hasScrolledDown = false; // Only trigger once
        }

        lastScrollTop = scrollTop;
    }, { passive: true });

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
    const currentLang = document.cookie.match(/googtrans=\/en\/([^;]+)/)?.[1] || 'en';
    const targetLang = (currentLang === 'es') ? 'en' : 'es';
    
    const select = document.querySelector('.goog-te-combo');
    if (select) {
        select.value = '/en/' + targetLang;
        select.dispatchEvent(new Event('change'));
        updateLangUI(targetLang);
    } else {
        console.warn('Google Translate not loaded yet.');
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
    setTimeout(() => {
        const currentLang = document.cookie.match(/googtrans=\/en\/([^;]+)/)?.[1] || 'en';
        updateLangUI(currentLang);
    }, 1500);
});
