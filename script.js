// DOM Elements
const modeToggle = document.getElementById('modeToggle');
const dashboardBtn = document.getElementById('dashboardBtn');
const mainProgress = document.getElementById('mainProgress');
const mindmapNodes = document.querySelectorAll('.mindmap-node');
const sidebarLinks = document.querySelectorAll('.sidebar-menu a');
const moduleSections = document.querySelectorAll('.module-section');
const accordionHeaders = document.querySelectorAll('.accordion-header');
const quizContainers = document.querySelectorAll('.quiz-container');

// Dark Mode Toggle
if (modeToggle) {
    modeToggle.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
        const icon = modeToggle.querySelector('i');
        if (document.body.classList.contains('dark-mode')) {
            icon.classList.remove('fa-moon');
            icon.classList.add('fa-sun');
            localStorage.setItem('darkMode', 'enabled');
        } else {
            icon.classList.remove('fa-sun');
            icon.classList.add('fa-moon');
            localStorage.setItem('darkMode', 'disabled');
        }
    });
}

// Check for saved dark mode preference
if (localStorage.getItem('darkMode') === 'enabled') {
    document.body.classList.add('dark-mode');
    if (modeToggle) {
        const icon = modeToggle.querySelector('i');
        icon.classList.remove('fa-moon');
        icon.classList.add('fa-sun');
    }
}

// Dashboard Navigation
if (dashboardBtn) {
    dashboardBtn.addEventListener('click', () => {
        showSection('dashboard');
        updateSidebarActive('dashboardBtn');
    });
}

// Mindmap Navigation
mindmapNodes.forEach(node => {
    node.addEventListener('click', () => {
        const target = node.getAttribute('data-target');
        showSection(target);
        updateSidebarActive(target);
    });
});

// Sidebar Navigation
sidebarLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href').substring(1);
        showSection(targetId);
        updateSidebarActive(targetId);
    });
});

// Show Section Function
function showSection(sectionId) {
    moduleSections.forEach(section => section.classList.remove('active'));
    const el = document.getElementById(sectionId);
    if (el) el.classList.add('active');

    const sections = ['home', 'intro', 'chap1', 'chap2', 'chap3', 'chap4', 'chap5', 'evaluation', 'dashboard'];
    const currentIndex = sections.indexOf(sectionId);
    if (currentIndex !== -1 && mainProgress) {
        const progress = ((currentIndex + 1) / sections.length) * 100;
        mainProgress.style.width = `${Math.min(progress, 100)}%`;
    }
}

// Update Sidebar Active Link
function updateSidebarActive(target) {
    sidebarLinks.forEach(link => link.classList.remove('active'));

    if (target === 'dashboardBtn') {
        const dashboardLink = document.querySelector('a[href="#dashboard"]');
        if (dashboardLink) dashboardLink.classList.add('active');
        return;
    }

    let selector = `a[href="#${target}"]`;
    if (target === 'home') selector = `a[href="#home"]`;

    const activeLink = document.querySelector(selector);
    if (activeLink) activeLink.classList.add('active');
}

// Quiz Functionality
quizContainers.forEach((container) => {
    const options = container.querySelectorAll('.quiz-option');
    const submitBtn = container.querySelector('.submit-answer');
    const hintBtn = container.querySelector('.show-hint');
    const feedbackEl = container.querySelector('.feedback');

    let selectedOption = null;

    options.forEach(option => {
        option.addEventListener('click', () => {
            options.forEach(opt => opt.classList.remove('selected'));
            option.classList.add('selected');
            selectedOption = option;
        });
    });

    if (submitBtn) {
        submitBtn.addEventListener('click', () => {
            if (!selectedOption) {
                alert('Veuillez sélectionner une réponse');
                return;
            }

            if (hintBtn) hintBtn.style.display = 'none';

            const isCorrect = selectedOption.getAttribute('data-correct') === 'true';
            feedbackEl.classList.remove('correct', 'incorrect', 'show');

            if (isCorrect) {
                feedbackEl.classList.add('correct', 'show');
                feedbackEl.innerHTML = '<i class="fas fa-check-circle"></i> <strong>Bravo !</strong> Votre réponse est correcte.';
                selectedOption.classList.add('correct');
            } else {
                feedbackEl.classList.add('incorrect', 'show');
                feedbackEl.innerHTML = '<i class="fas fa-times-circle"></i> <strong>Incorrect.</strong> Réessayez ou consultez le cours pour plus de détails.';
                selectedOption.classList.add('incorrect');
                const correct = container.querySelector('.quiz-option[data-correct="true"]');
                if (correct) correct.classList.add('correct');
            }

            options.forEach(opt => opt.style.pointerEvents = 'none');
            submitBtn.disabled = true;
            submitBtn.style.opacity = '0.6';
        });
    }

    if (hintBtn) {
        hintBtn.addEventListener('click', () => {
            feedbackEl.classList.add('correct', 'show');
            feedbackEl.innerHTML = '<i class="fas fa-lightbulb"></i> <strong>Indice :</strong> Consultez la section correspondante du cours pour trouver la réponse.';
            hintBtn.style.display = 'none';
        });
    }
});

// Accordion Functionality
accordionHeaders.forEach(header => {
    header.addEventListener('click', () => {
        const content = header.nextElementSibling;
        const icon = header.querySelector('i');

        header.classList.toggle('active');

        if (content.classList.contains('show')) {
            content.classList.remove('show');
            if (icon) { icon.classList.remove('fa-chevron-up'); icon.classList.add('fa-chevron-down'); }
        } else {
            content.classList.add('show');
            if (icon) { icon.classList.remove('fa-chevron-down'); icon.classList.add('fa-chevron-up'); }
        }
    });
});

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    if (mainProgress) mainProgress.style.width = '35%';
    setTimeout(() => { if (mainProgress) mainProgress.classList.add('pulse'); }, 1000);
    const hash = window.location.hash.substring(1) || 'home';
    updateSidebarActive(hash);
});
