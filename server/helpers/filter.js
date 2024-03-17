const postQuery = (entity, filters) => {
    const allowedColumns = ['nombre', 'categoria', 'precio', 'stock'];
    const table = entity.toLowerCase();
    let query = `SELECT * FROM ${table} WHERE 1 = 1`;
    const values = [];
    if (Object.keys(filters).length > 0) {
        const filterEntries = Object.entries(filters);
        for (const [key, value] of filterEntries) {
            if (!allowedColumns.includes(key)) {
                throw new Error(`Columna "${key}" no permitida.`);
            }
            query += ` AND ${key} = $${values.length + 1}`;
            values.push(value);
        }
    }
    return { query, values };
};

module.exports = { postQuery };
