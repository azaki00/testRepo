/**
 * Global Enterprise Layout Event Routing Core 
 */
document.addEventListener('DOMContentLoaded', () => {
    // Universal Interactive Ripple Inbound Trigger Bindings
    const dynamicRippleButtons = document.querySelectorAll('.ripple');
    
    dynamicRippleButtons.forEach(buttonElement => {
        buttonElement.addEventListener('click', function(clickEvent) {
            const rippleWrapper = this;
            const existingWaves = rippleWrapper.querySelectorAll('.ripple-wave');
            existingWaves.forEach(wave => wave.remove());

            const structuralWave = document.createElement('span');
            structuralWave.classList.add('ripple-wave');
            
            const elementDiameter = Math.max(rippleWrapper.clientWidth, rippleWrapper.clientHeight);
            const waveRadius = elementDiameter / 2;

            structuralWave.style.width = structuralWave.style.height = `${elementDiameter}px`;
            structuralWave.style.left = `${clickEvent.clientX - rippleWrapper.getBoundingClientRect().left - waveRadius}px`;
            structuralWave.style.top = `${clickEvent.clientY - rippleWrapper.getBoundingClientRect().top - waveRadius}px`;

            rippleWrapper.appendChild(structuralWave);
        });
    });

    // Native Dynamic Interactive Accordion Action Loops
    const accordionTriggers = document.querySelectorAll('.accordion-trigger');
    
    accordionTriggers.forEach(triggerButton => {
        triggerButton.addEventListener('click', function() {
            const focusedItem = this.parentElement;
            const containerContent = focusedItem.querySelector('.accordion-content');
            const isActiveState = focusedItem.classList.contains('open');

            // Collapse Adjacent Elements For Strict Focus Profile
            const openSiblings = focusedItem.parentElement.querySelectorAll('.accordion-item.open');
            openSiblings.forEach(sibling => {
                sibling.classList.remove('open');
                sibling.querySelector('.accordion-content').style.maxHeight = null;
            });

            if (!isActiveState) {
                focusedItem.classList.add('open');
                containerContent.style.maxHeight = `${containerContent.scrollHeight}px`;
            } else {
                focusedItem.classList.remove('open');
                containerContent.style.maxHeight = null;
            }
        });
    });
});

/**
 * Enterprise Form Validation Engine
 */
function validateContactForm(event) {
    event.preventDefault();
    const errorLogDisplay = document.getElementById('form-error-feedback');
    errorLogDisplay.classList.add('hidden');
    errorLogDisplay.textContent = "";

    const clientMail = document.getElementById('form-email').value.trim();
    const clientPhone = document.getElementById('form-phone').value.trim();

    // Strict Corporate Verification Filters
    const genericConsumerDomains = ['@gmail.', '@yahoo.', '@hotmail.', '@outlook.', '@live.'];
    const matchingFlag = genericConsumerDomains.some(bannedString => clientMail.toLowerCase().includes(bannedString));

    if (matchingFlag) {
        errorLogDisplay.textContent = "System Requirement: Please process queries via an authentic corporate email domain hierarchy.";
        errorLogDisplay.classList.remove('hidden');
        return false;
    }

    const internationalPhoneSyntax = /^\+?[1-9]\d{1,14}$/;
    if (!internationalPhoneSyntax.test(clientPhone.replace(/[\s()+-]/g, ''))) {
        errorLogDisplay.textContent = "Format Failure: Please output a structurally accurate global E.164 telecommunication entry vector.";
        errorLogDisplay.classList.remove('hidden');
        return false;
    }

    alert("Routing Parameters Accepted. Enterprise architectural ticket recorded securely under TDNT protocol.");
    document.getElementById('contact-enterprise-form').reset();
    return true;
}