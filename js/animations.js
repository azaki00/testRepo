/**
 * High-Performance Decoupled Interaction Interceptors
 */
document.addEventListener('DOMContentLoaded', () => {
    // Intercept Elements Matrix For In-View Animations
    const elementsToAnimate = document.querySelectorAll(
        '.grid > div, .card, .stat-item, .industry-card, .about-content, .about-visuals, .illustration-card, .section-header, .dual-panel, .animate-fade-up, .animate-fade-left, .animate-fade-right'
    );
    
    elementsToAnimate.forEach(el => {
        if (!el.classList.contains('animate-fade-up') && 
            !el.classList.contains('animate-fade-left') && 
            !el.classList.contains('animate-fade-right')) {
            el.classList.add('reveal-frame');
        }
    });

    const intersectionConfig = { threshold: 0.1, rootMargin: '0px 0px -40px 0px' };

    const frameObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('triggered');
                observer.unobserve(entry.target);
            }
        });
    }, intersectionConfig);

    elementsToAnimate.forEach(targetItem => frameObserver.observe(targetItem));

    // Stagger Class Injector Loop
    const continuousGrids = document.querySelectorAll('.stagger-animate');
    continuousGrids.forEach(grid => {
        const nestedChildren = grid.children;
        Array.from(nestedChildren).forEach((childNode, stepIndex) => {
            childNode.style.transitionDelay = `${(stepIndex + 1) * 0.08}s`;
        });
    });

    // Numeric Incremental Progression Logic
    const counterElements = document.querySelectorAll('.counter');
    const counterObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                initializeCounterValue(entry.target);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 1 });

    counterElements.forEach(counterItem => counterObserver.observe(counterItem));

    function initializeCounterValue(element) {
        const structuralLimit = parseInt(element.getAttribute('data-target'), 10);
        let startingBase = 0;
        const totalDuration = 1800; // Milliseconds execution run
        const refreshRate = 1000 / 60; // 60 FPS profile matrix tracking
        const stepAdjustment = structuralLimit / (totalDuration / refreshRate);

        const counterInterval = setInterval(() => {
            startingBase += stepAdjustment;
            if (startingBase >= structuralLimit) {
                element.textContent = structuralLimit.toLocaleString();
                clearInterval(counterInterval);
            } else {
                element.textContent = Math.floor(startingBase).toLocaleString();
            }
        }, refreshRate);
    }
});