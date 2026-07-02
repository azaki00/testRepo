/**
 * Global Architecture Navigation Interactions
 */
document.addEventListener('DOMContentLoaded', () => {
    const mainNav = document.getElementById('main-nav');
    const mobileToggle = document.querySelector('.mobile-toggle');
    const navLinks = document.querySelector('.nav-links');
    const themeToggle = document.getElementById('theme-toggle');
    const themeIcon = themeToggle?.querySelector('.theme-toggle-icon');

    const applyTheme = (theme) => {
        document.body.classList.toggle('theme-light', theme === 'light');
        document.body.classList.toggle('theme-dark', theme === 'dark');
        localStorage.setItem('epoc-theme', theme);

        if (themeToggle) {
            themeToggle.setAttribute('aria-pressed', String(theme === 'light'));
            themeToggle.setAttribute('aria-label', theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode');
            themeToggle.title = theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode';
            if (themeIcon) {
                const iconPath = theme === 'light' ? 'images/Icon Logo - Dark.png' : 'images/Icon Logo - Light.png';
                themeIcon.style.backgroundImage = `url('${iconPath}')`;
            }
        }
    };

    // Sticky Scroll Event Validation
    window.addEventListener('scroll', () => {
        if (window.scrollY > 20) {
            mainNav.classList.add('scrolled');
        } else {
            mainNav.classList.remove('scrolled');
        }
    });

    // Mobile Navigation Toggle
    mobileToggle.addEventListener('click', () => {
        mobileToggle.classList.toggle('active');
        navLinks.classList.toggle('active');
    });

    // Theme Toggle
    const savedTheme = localStorage.getItem('epoc-theme');
    const initialTheme = savedTheme === 'light' ? 'light' : 'dark';
    applyTheme(initialTheme);

    themeToggle?.addEventListener('click', () => {
        const nextTheme = document.body.classList.contains('theme-light') ? 'dark' : 'light';
        applyTheme(nextTheme);
    });

    // Outer Document Click Dismiss Closure
    document.addEventListener('click', (e) => {
        if (!mobileToggle.contains(e.target) && !navLinks.contains(e.target) && navLinks.classList.contains('active')) {
            mobileToggle.classList.remove('active');
            navLinks.classList.remove('active');
        }
    });
});