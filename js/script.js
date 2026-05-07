// ── Theme ──────────────────────────────────
const themeBtn = document.getElementById('themeButton');
const savedTheme = localStorage.getItem('theme') || 'light';
document.body.dataset.theme = savedTheme;
updateThemeIcon(savedTheme);

function updateThemeIcon(theme) {
    if (!themeBtn) return;
    themeBtn.innerHTML = theme === 'dark' ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
}

themeBtn && themeBtn.addEventListener('click', () => {
    const newTheme = document.body.dataset.theme === 'dark' ? 'light' : 'dark';
    document.body.dataset.theme = newTheme;
    localStorage.setItem('theme', newTheme);
    updateThemeIcon(newTheme);
});

// ── Hamburger ──────────────────────────────
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');

hamburger && hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    navLinks.classList.toggle('open');
});

// Close menu on link click
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
        hamburger && hamburger.classList.remove('open');
        navLinks && navLinks.classList.remove('open');
    });
});

// ── Navbar scroll ──────────────────────────
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
    if (navbar) {
        navbar.classList.toggle('scrolled', window.scrollY > 20);
    }
}, { passive: true });

// ── Reveal on scroll ──────────────────────
const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
            setTimeout(() => entry.target.classList.add('visible'), i * 80);
            revealObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.1 });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

// ── Stats counter ──────────────────────────
function animateCounter(el) {
    const target = parseInt(el.dataset.target);
    const duration = 1200;
    const start = performance.now();
    const update = (time) => {
        const elapsed = time - start;
        const progress = Math.min(elapsed / duration, 1);
        const value = Math.round(progress * target);
        el.textContent = value;
        if (progress < 1) requestAnimationFrame(update);
        else el.textContent = target;
    };
    requestAnimationFrame(update);
}

const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.querySelectorAll('[data-target]').forEach(animateCounter);
            counterObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.4 });

document.querySelectorAll('.stats-grid, .stats-card').forEach(el => counterObserver.observe(el));

// ── Skill bars ────────────────────────────
const skillObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.querySelectorAll('.skill-progress').forEach(bar => {
                setTimeout(() => { bar.style.width = bar.dataset.progress + '%'; }, 200);
            });
            skillObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.2 });

document.querySelectorAll('.skill-category-card').forEach(el => skillObserver.observe(el));
