// Typing animation for hero page
const roles = ['Technicien Réseaux & Systèmes', 'Étudiant en BTS SIO SISR', "Passionné d'Informatique"];
let roleIndex = 0, charIndex = 0, isDeleting = false;

function typeText() {
    const el = document.getElementById('typingText');
    if (!el) return;

    const current = roles[roleIndex];
    el.textContent = isDeleting ? current.substring(0, charIndex--) : current.substring(0, charIndex++);

    let delay = isDeleting ? 45 : 95;

    if (!isDeleting && charIndex === current.length + 1) {
        isDeleting = true;
        delay = 2200;
    } else if (isDeleting && charIndex < 0) {
        isDeleting = false;
        charIndex = 0;
        roleIndex = (roleIndex + 1) % roles.length;
        delay = 400;
    }

    setTimeout(typeText, delay);
}

document.addEventListener('DOMContentLoaded', typeText);
