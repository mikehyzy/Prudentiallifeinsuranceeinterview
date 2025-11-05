window.addEventListener('DOMContentLoaded', () => {
    console.log('ElevenLabs integration starting...');

    // Listen for messages from ElevenLabs widget
    window.addEventListener('message', (event) => {
        console.log('Message received:', event);

        if (event.data && event.data.type === 'elevenlabs:tool') {
            console.log('Tool call detected!', event.data);
            if (event.data.tool === 'fillFormField') {
                fillFormField(event.data.parameters.fieldName, event.data.parameters.value);
            }
        }
    });

    // Also listen for direct tool events
    window.addEventListener('fillFormField', (event) => {
        console.log('Direct tool event:', event);
        if (event.detail) {
            fillFormField(event.detail.fieldName, event.detail.value);
        }
    });
});

function fillFormField(fieldName, value) {
    console.log(`FILLING: ${fieldName} = ${value}`);

    const field = document.getElementById(fieldName) ||
                  document.querySelector(`[name="${fieldName}"]`);

    if (field) {
        field.value = value;
        field.style.borderColor = '#0046B8';
        field.style.backgroundColor = '#E6F2FF';
        setTimeout(() => {
            field.style.borderColor = '';
            field.style.backgroundColor = '';
        }, 2000);
        console.log('✓ Field filled successfully');
    } else {
        console.log('✗ Field not found:', fieldName);
    }
}
