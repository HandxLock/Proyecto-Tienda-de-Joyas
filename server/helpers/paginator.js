const pagination = (data, items, page) => {
    if (!Array.isArray(data) || data.length === 0) {
        throw new Error('Los datos proporcionados no son válidos.');
    }
    if (isNaN(items) || isNaN(page) || parseInt(items) <= 0 || parseInt(page) <= 0) {
        throw new Error('Los valores de "items" y "page" deben ser números positivos.');
    }
    const pageInt = parseInt(page);
    const itemsInt = parseInt(items);
    const startIndex = (pageInt - 1) * itemsInt;
    const endIndex = pageInt * itemsInt;
    const res = {};
    if (endIndex < data.length) {
        res.next = {
            page: pageInt + 1,
            items: itemsInt,
        };
    }
    if (startIndex > 0) {
        res.previous = {
            page: pageInt - 1,
            items: itemsInt,
        };
    }
    res.res = data.slice(startIndex, endIndex);

    return res;
};

module.exports = pagination;
