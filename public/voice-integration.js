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
    const lowerText = text.toLowerCase();

    console.log('Processing voice input:', text);

    const nameMatch = text.match(/(?:my name is|i am|i'm)\s+([A-Za-z\s]+?)(?:\.|,|$|and|my)/i);
    if (nameMatch) {
        const name = nameMatch[1].trim();
        fillFormField('fullName', name);
        console.log('Detected name:', name);
    }

    const emailMatch = text.match(/([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/);
    if (emailMatch) {
        fillFormField('emailAddress', emailMatch[1]);
        console.log('Detected email:', emailMatch[1]);
    }

    const phoneMatch = text.match(/(\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4})/);
    if (phoneMatch) {
        const phone = phoneMatch[1];
        const formattedPhone = formatPhoneNumber(phone);
        fillFormField('phoneNumber', formattedPhone);
        console.log('Detected phone:', formattedPhone);
    }

    const ssnMatch = text.match(/(\d{3}[-.\s]?\d{2}[-.\s]?\d{4})/);
    if (ssnMatch && !phoneMatch) {
        const ssn = ssnMatch[1].replace(/[.\s]/g, '-');
        fillFormField('ssn', ssn);
        console.log('Detected SSN');
    }

    const dateMatch = text.match(/(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})/);
    if (dateMatch) {
        const month = dateMatch[1].padStart(2, '0');
        const day = dateMatch[2].padStart(2, '0');
        const year = dateMatch[3];
        const formattedDate = `${year}-${month}-${day}`;

        if (lowerText.includes('birth') || lowerText.includes('born')) {
            fillFormField('dateOfBirth', formattedDate);
            console.log('Detected date of birth:', formattedDate);
        } else {
            fillFormField('dateOfBirth', formattedDate);
        }
    }

    const addressMatch = text.match(/(?:address|live at|located at)\s+(.+?)(?:\.|,|$)/i);
    if (addressMatch) {
        fillFormField('currentAddress', addressMatch[1].trim());
        console.log('Detected address:', addressMatch[1].trim());
    }

    if (lowerText.includes('male') && !lowerText.includes('female')) {
        fillFormField('gender', 'Male');
        console.log('Detected gender: Male');
    } else if (lowerText.includes('female')) {
        fillFormField('gender', 'Female');
        console.log('Detected gender: Female');
    }

    const maritalStatusMatch = lowerText.match(/\b(single|married|divorced|widowed)\b/);
    if (maritalStatusMatch) {
        const status = maritalStatusMatch[1].charAt(0).toUpperCase() + maritalStatusMatch[1].slice(1);
        fillFormField('maritalStatus', status);
        console.log('Detected marital status:', status);
    }
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
