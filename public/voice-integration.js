// Define fillFormField globally so ElevenLabs can call it
window.fillFormField = function(fieldName, value) {
    console.log(`Filling form field: ${fieldName} = ${value}`);

    // Try multiple ways to find the field
    let field = document.getElementById(fieldName);
    if (!field) field = document.querySelector(`input[name="${fieldName}"]`);
    if (!field) field = document.querySelector(`[data-field="${fieldName}"]`);
    if (!field) field = document.querySelector(`input#${fieldName}`);

    if (field) {
        field.value = value;
        field.style.borderColor = '#0046B8';
        field.style.backgroundColor = '#E6F2FF';
        setTimeout(() => {
            field.style.borderColor = '';
            field.style.backgroundColor = '';
        }, 2000);
        console.log('✓ Successfully filled field:', fieldName);
        return { success: true };
    } else {
        console.log('✗ Could not find field:', fieldName);
        return { success: false, error: 'Field not found' };
    }
};

console.log('Voice integration loaded. fillFormField is available:', typeof window.fillFormField);
