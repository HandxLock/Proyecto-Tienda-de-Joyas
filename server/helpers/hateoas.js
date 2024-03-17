const sanitize = require('../helpers/sanitize.js');

const HATEOAS = async (entity, data) => {
    if (typeof entity !== 'string' || !Array.isArray(data)) {
        throw new Error('Entrada no válida');
    }
    const result = data.map((item) => {
        const id = item.id && typeof item.id === 'string' ? item.id : '';
        console.log('ID antes de la codificación:', id);
        return {
            nombre: item.nombre,
            links: [
                {
                    href: `http://localhost:3000/joyas/${encodeURIComponent(entity)}?id=${encodeURIComponent(item.id)}`,
                },
            ],
        };
    }).slice(0, 10);
    console.log('Resultado completo de HATEOAS:', result);
    const total = data.length;
    const dataWithHateoas = {
        total,
        results: result,
    };
    console.log(dataWithHateoas);
    return dataWithHateoas;
};

module.exports = HATEOAS;

