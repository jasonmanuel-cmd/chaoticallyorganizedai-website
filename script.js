
// Menu Toggle
const menuToggle = document.querySelector('.menu-toggle');
const navLinks = document.querySelector('.nav-links');
const pageOverlay = document.querySelector('.page-overlay');

menuToggle.addEventListener('click', (event) => {
    navLinks.classList.toggle('active');
    pageOverlay.style.display = navLinks.classList.contains('active') ? 'block' : 'none';
    event.stopPropagation();
});

document.addEventListener('click', (event) => {
    if (navLinks.classList.contains('active') && !navLinks.contains(event.target)) {
        navLinks.classList.remove('active');
        pageOverlay.style.display = 'none';
    }
});

// Copyright Year
document.getElementById('year').textContent = new Date().getFullYear();
