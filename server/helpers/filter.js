const postQuery = (entity, filters) => {
    const allowedColumns = ['nombre', 'categoria', 'precio_min', 'precio_max', 'stock', 'metal'];
    const table = entity.toLowerCase();
    let query = `SELECT * FROM ${table} WHERE 1 = 1`;
    const values = [];
    if (Object.keys(filters).length > 0) {
        const filterEntries = Object.entries(filters);
        console.log('filter entries', filterEntries);
        for (const [key, value] of filterEntries) {
            if (!allowedColumns.includes(key)) {
                throw new Error(`Columna "${key}" no permitida.`);
            }
            if (value !== undefined && value !== null) {
                if(key === 'precio_min'){
                    query += ` AND precio >= $${values.length + 1}`;
                    console.log('query', query);
                }
                if(key === 'precio_max'){
                    query += ` AND precio <= $${values.length + 1}`;
                    console.log('query', query);
                }
                if(key !== 'precio_min' && key !== 'precio_max'){
                    query += ` AND ${key} = $${values.length + 1}`;
                    console.log('query', query);
                }
                values.push(value);
            }
        }
    }
    return { query, values };
};

module.exports = { postQuery };
