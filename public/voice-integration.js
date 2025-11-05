window.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => initializeVoiceIntegration(), 2000);
});

function initializeVoiceIntegration() {
    const widget = document.querySelector('elevenlabs-convai');
    if (!widget) {
        console.log('ElevenLabs widget not found, retrying...');
        setTimeout(() => initializeVoiceIntegration(), 1000);
        return;
    }

    window.addEventListener('message', (event) => {
        if (event.data && event.data.type === 'elevenlabs:response') {
            processVoiceInput(event.data.text);
        }
    });

    setupFormListeners();
    console.log('ElevenLabs voice integration initialized');
}

function processVoiceInput(text) {
    if (!text) return;
    console.log('Voice said:', text);

    // Listen for agent confirmations
    if (text.includes("I'll fill in your name as")) {
        const name = text.split("name as ")[1];
        fillFormField('fullName', name);
    }

    if (text.includes("Setting your email to")) {
        const email = text.split("email to ")[1];
        fillFormField('email', email);
    }

    if (text.includes("Recording phone number")) {
        const phone = text.split("phone number ")[1];
        fillFormField('phone', phone);
    }

    // Direct detection from user speech
    const emailMatch = text.match(/([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/);
    if (emailMatch) fillFormField('email', emailMatch[1]);

    const phoneMatch = text.match(/(\d{3}[-.\s]?\d{3}[-.\s]?\d{4})/);
    if (phoneMatch) fillFormField('phone', phoneMatch[1]);
}

function formatPhoneNumber(phone) {
    const digits = phone.replace(/\D/g, '');
    return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6, 10)}`;
}

function fillFormField(fieldId, value) {
    const field = document.getElementById(fieldId) ||
                  document.querySelector(`[name="${fieldId}"]`) ||
                  document.querySelector(`input[id*="${fieldId}"]`);

    if (field) {
        if (field.tagName === 'INPUT' || field.tagName === 'TEXTAREA') {
            field.value = value;
            field.dispatchEvent(new Event('input', { bubbles: true }));
            field.dispatchEvent(new Event('change', { bubbles: true }));
        }

        highlightField(field);
        console.log('Filled field:', fieldId, 'with value:', value);
    } else {
        console.log('Field not found:', fieldId);
    }
}

function highlightField(field) {
    field.style.transition = 'all 0.3s ease';
    field.style.borderColor = '#0046B8';
    field.style.backgroundColor = '#E6F2FF';
    field.style.boxShadow = '0 0 10px rgba(0, 70, 184, 0.3)';

    setTimeout(() => {
        field.style.borderColor = '';
        field.style.backgroundColor = '';
        field.style.boxShadow = '';
    }, 2000);
}

function setupFormListeners() {
    const observer = new MutationObserver(() => {
        document.querySelectorAll('input, textarea, select').forEach(field => {
            if (!field.dataset.voiceEnabled) {
                field.dataset.voiceEnabled = 'true';
                field.addEventListener('change', (e) => {
                    console.log('Field updated:', e.target.id || e.target.name, e.target.value);
                });
            }
        });
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
}
