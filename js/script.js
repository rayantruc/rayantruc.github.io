// Project Data
const projects = [
    {
        title: "Project 1",
        description: "A web application built with React",
        category: "web",
        image: "brand-asana.svg",
        links: {
            live: "https://project1.com",
            github: "https://github.com/username/project1"
        }
    },
    // Add more projects here
];

// DOM Elements
const themeButton = document.getElementById('themeButton');
const projectsGrid = document.querySelector('.projects-grid');
const filterButtons = document.querySelectorAll('.filter-btn');
const modal = document.getElementById('modal');
const contactForm = document.getElementById('contactForm');
const skillBars = document.querySelectorAll('.skill-progress');

// Theme Toggle
themeButton.addEventListener('click', () => {
    document.body.dataset.theme = document.body.dataset.theme === 'dark' ? 'light' : 'dark';
    themeButton.textContent = document.body.dataset.theme === 'dark' ? '☀️' : '🌙';
});

// Typing Animation
const roles = ['developpeur web', 'Informatitien réseau', 'Problem Solver'];
let roleIndex = 0;
let charIndex = 0;

function typeText() {
    const typingText = document.querySelector('.typing-text');
    const currentRole = roles[roleIndex];
    
    if (charIndex < currentRole.length) {
        typingText.textContent = "Je suis " + currentRole.substring(0, charIndex + 1);
        charIndex++;
        setTimeout(typeText, 100);
    } else {
        setTimeout(eraseText, 2000);
    }
}

function eraseText() {
    const typingText = document.querySelector('.typing-text');
    const currentRole = roles[roleIndex];
    
    if (charIndex > 0) {
        typingText.textContent = "Je suis " + currentRole.substring(0, charIndex - 1);
        charIndex--;
        setTimeout(eraseText, 50);
    } else {
        roleIndex = (roleIndex + 1) % roles.length;
        setTimeout(typeText, 500);
    }
}

// Initialize typing animation
typeText();

// Project Filtering
function filterProjects(category) {
    const projectCards = document.querySelectorAll('.project-card');
    projectCards.forEach(card => {
        if (category === 'all' || card.dataset.category === category) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
}

filterButtons.forEach(button => {
    button.addEventListener('click', () => {
        filterButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
        filterProjects(button.dataset.filter);
    });
});

// Skill Animation
function animateSkills() {
    skillBars.forEach(bar => {
        const progress = bar.dataset.progress;
        bar.style.width = `${progress}%`;
    });
}

// Intersection Observer for skill animation
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            animateSkills();
        }
    });
});

observer.observe(document.querySelector('#skills'));

// Contact Form
contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = {
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        message: document.getElementById('message').value
    };
    
    // Here you would typically send the form data to a server
    console.log('Form submitted:', formData);
    contactForm.reset();
    alert('Thank you for your message! I will get back to you soon.');
});

// Modal Functions
function openModal(project) {
    const modalTitle = document.getElementById('modal-title');
    const modalDescription = document.getElementById('modal-description');
    const modalLinks = document.getElementById('modal-links');
    
    modalTitle.textContent = project.title;
    modalDescription.textContent = project.description;
    modalLinks.innerHTML = `
        <a href="${project.links.live}" target="_blank">Live Demo</a>
        <a href="${project.links.github}" target="_blank">GitHub</a>
    `;
    
    modal.style.display = 'block';
}

document.querySelector('.close-modal').addEventListener('click', () => {
    modal.style.display = 'none';
});

window.addEventListener('click', (e) => {
    if (e.target === modal) {
        modal.style.display = 'none';
    }
});

// Initialize Projects
function initializeProjects() {
    projects.forEach(project => {
        const projectCard = document.createElement('div');
        projectCard.className = 'project-card';
        projectCard.dataset.category = project.category;
        projectCard.innerHTML = `
            <img src="${project.image}" alt="${project.title}">
            <h3>${project.title}</h3>
            <p>${project.description}</p>
        `;
        projectCard.addEventListener('click', () => openModal(project));
        projectsGrid.appendChild(projectCard);
    });
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    initializeProjects();
    animateSkills();
});