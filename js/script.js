// Initialisation des variables globales
const projects = [
    {
        title: "Portfolio Personnel",
        description: "Site web portfolio responsive avec HTML, CSS et JavaScript",
        category: "web",
        image: "img/portfolio.jpg",
        links: {
            live: "https://rayantruc.github.io",
            github: "https://github.com/rayantruc/rayantruc.github.io"
        }
    },
    {
        title: "Application de Gestion",
        description: "Application de gestion de stocks et de commandes",
        category: "app",
        image: "img/gestion.jpg",
        links: {
            live: "#",
            github: "https://github.com/rayantruc/gestion-app"
        }
    }
];

// DOM Elements
const themeButton = document.getElementById('themeButton');
const projectsGrid = document.querySelector('.projects-grid');
const filterButtons = document.querySelectorAll('.filter-btn');
const modal = document.getElementById('modal');
const contactForm = document.getElementById('contactForm');
const skillBars = document.querySelectorAll('.skill-progress');
const statNumbers = document.querySelectorAll('.stat-number');

// Theme Toggle avec localStorage
const currentTheme = localStorage.getItem('theme') || 'light';
document.body.dataset.theme = currentTheme;
themeButton.textContent = currentTheme === 'dark' ? '☀️' : '🌙';

themeButton.addEventListener('click', () => {
    const newTheme = document.body.dataset.theme === 'dark' ? 'light' : 'dark';
    document.body.dataset.theme = newTheme;
    themeButton.textContent = newTheme === 'dark' ? '☀️' : '🌙';
    localStorage.setItem('theme', newTheme);
});

// Typing Animation améliorée
const roles = ['Développeur Web', 'Étudiant en BTS SIO', 'Passionné d\'Informatique'];
let roleIndex = 0;
let charIndex = 0;
let isDeleting = false;
let typingDelay = 100;

function typeText() {
    const typingText = document.querySelector('.typing-text');
    const currentRole = roles[roleIndex];
    
    if (!isDeleting && charIndex <= currentRole.length) {
        typingText.textContent = "Je suis " + currentRole.substring(0, charIndex);
        charIndex++;
        typingDelay = 100;
    } else if (isDeleting && charIndex >= 0) {
        typingText.textContent = "Je suis " + currentRole.substring(0, charIndex);
        charIndex--;
        typingDelay = 50;
    }

    if (charIndex === currentRole.length + 1) {
        isDeleting = true;
        typingDelay = 2000;
    } else if (charIndex === 0 && isDeleting) {
        isDeleting = false;
        roleIndex = (roleIndex + 1) % roles.length;
        typingDelay = 500;
    }

    setTimeout(typeText, typingDelay);
}

// Démarrer l'animation de typing
document.addEventListener('DOMContentLoaded', typeText);

// Gestion des projets
function filterProjects(category) {
    const projectCards = document.querySelectorAll('.project-card');
    projectCards.forEach(card => {
        const shouldShow = category === 'all' || card.dataset.category === category;
        card.style.opacity = '0';
        setTimeout(() => {
            card.style.display = shouldShow ? 'block' : 'none';
            if (shouldShow) {
                card.style.opacity = '1';
            }
        }, 300);
    });
}

filterButtons.forEach(button => {
    button.addEventListener('click', () => {
        filterButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
        filterProjects(button.dataset.filter);
    });
});

// Animation des compétences
function animateSkills() {
    skillBars.forEach(bar => {
        const progress = bar.dataset.progress;
        setTimeout(() => {
            bar.style.width = `${progress}%`;
        }, 200);
    });
}

// Animation des statistiques
let statsAnimated = false;
function animateStats() {
    if (statsAnimated) return;
    
    statNumbers.forEach(stat => {
        const target = parseInt(stat.dataset.target);
        let current = 0;
        const increment = target / 40;
        const interval = setInterval(() => {
            if (current >= target) {
                stat.textContent = target;
                clearInterval(interval);
            } else {
                current += increment;
                stat.textContent = Math.round(current);
            }
        }, 50);
    });
    statsAnimated = true;
}

// Intersection Observer pour les animations au scroll
const observerCallback = (entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            if (entry.target.classList.contains('skill-progress')) {
                animateSkills();
            } else if (entry.target.classList.contains('stats')) {
                animateStats();
            } else if (entry.target.classList.contains('bts-card')) {
                entry.target.style.animation = 'slideUp 0.8s var(--animation-timing) forwards';
            }
            observer.unobserve(entry.target);
        }
    });
};

const observer = new IntersectionObserver(observerCallback, {
    threshold: 0.2
});

// Observer les éléments pour les animations
document.querySelectorAll('.skill-progress, .stats, .bts-card').forEach(el => {
    observer.observe(el);
});

// Smooth Scroll
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Gestion du formulaire de contact
contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const submitBtn = contactForm.querySelector('.submit-btn');
    submitBtn.disabled = true;
    submitBtn.textContent = 'Envoi en cours...';

    try {
        // Simulation d'envoi (à remplacer par votre logique d'envoi réelle)
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        contactForm.reset();
        submitBtn.textContent = 'Message envoyé !';
        setTimeout(() => {
            submitBtn.disabled = false;
            submitBtn.textContent = 'Envoyer';
        }, 2000);
    } catch (error) {
        submitBtn.textContent = 'Erreur, réessayez';
        submitBtn.disabled = false;
    }
});

// Initialisation des projets
function initializeProjects() {
    projectsGrid.innerHTML = '';
    projects.forEach(project => {
        const projectCard = document.createElement('div');
        projectCard.className = 'project-card';
        projectCard.dataset.category = project.category;
        projectCard.innerHTML = `
            <img src="${project.image}" alt="${project.title}">
            <h3>${project.title}</h3>
            <p>${project.description}</p>
            <div class="project-links">
                <a href="${project.links.live}" target="_blank" class="btn btn-primary">Voir le projet</a>
                <a href="${project.links.github}" target="_blank" class="btn btn-secondary">GitHub</a>
            </div>
        `;
        projectsGrid.appendChild(projectCard);
    });
}

// Initialisation au chargement de la page
document.addEventListener('DOMContentLoaded', () => {
    initializeProjects();
    if (window.location.hash) {
        const target = document.querySelector(window.location.hash);
        if (target) {
            setTimeout(() => {
                target.scrollIntoView({ behavior: 'smooth' });
            }, 100);
        }
    }
});
