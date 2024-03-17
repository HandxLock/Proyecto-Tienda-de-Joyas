function sanitize(input) {
    if (typeof input !== 'string') {
        throw new Error('Input must be a string');
    }
    const sanitizedInput = input.replace(/<[^>]*>?/gm, '');
    const escapedInput = sanitizedInput
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
    return escapedInput;
}

module.exports = sanitize;
