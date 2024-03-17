const { pool } = require('../dbase/config.js');
const { postQuery } = require("../helpers/filter.js");



exports.getModel = async () => {
  try {
    const inventario = await pool.query('SELECT id, nombre, categoria, precio, stock FROM inventario');
    if (!inventario || !inventario.rows || inventario.rows.length === 0) {
      throw new Error('No se encontraron productos en el inventario');
    }
    return inventario.rows;
  } catch (error) {
    throw new Error(`Error al obtener el inventario: ${error.message}`);
  }
}

exports.getProductoById = async (id) => {
  try {
    if (!id || isNaN(id) || parseInt(id) <= 0) {
      throw new Error('ID de producto no válido');
    }
    const producto = await pool.query('SELECT * FROM inventario WHERE id = $1', [id]);
    return producto.rows[0];
  } catch (error) {
    throw new Error(`Error al obtener producto: ${error.message}`);
  }
}

exports.addjoyasModel = async (nombre, categoria, precio, stock) => {
  try {
    if (!nombre || !categoria || !precio || !stock) {
      throw new Error('Todos los campos son obligatorios');
    }
    if (isNaN(precio) || isNaN(stock) || parseFloat(precio) < 0 || parseInt(stock) < 0) {
      throw new Error('Precio y stock deben ser números válidos y positivos');
    }
    const newProduct = await pool.query('INSERT INTO inventario (nombre, categoria, precio, stock) VALUES ($1, $2, $3, $4) RETURNING *', [nombre, categoria, precio, stock]);
    return { message: 'Producto añadido con éxito', product: newProduct.rows[0] };
  } catch (error) {
    throw new Error(`Error al agregar producto: ${error.message}`);
  }
}

exports.updatejoyasModel = async (id, { nombre, categoria, precio, stock }) => {
  try {
    if (isNaN(id) || parseInt(id) <= 0) {
      throw new Error('ID no válido');
    }
    if (!nombre || !categoria || !precio || !stock) {
      throw new Error('Todos los campos son obligatorios');
    }
    if (isNaN(precio) || isNaN(stock) || parseFloat(precio) < 0 || parseInt(stock) < 0) {
      throw new Error('Precio y stock deben ser números válidos y positivos');
    }
    const query = 'UPDATE inventario SET nombre=$1, categoria=$2, precio=$3, stock=$4 WHERE id=$5 RETURNING *';
    const values = [nombre, categoria, precio, stock, id];
    const updatedProductStock = await pool.query(query, values);
    if (updatedProductStock.rows.length === 0) {
      throw new Error('Producto no encontrado');
    }
    return updatedProductStock.rows;
  } catch (error) {
    throw new Error(`Error al actualizar producto: ${error.message}`);
  }
}

exports.deletejoyasModel = async (id) => {
  if (!id || isNaN(id) || parseInt(id) <= 0) {
    throw new Error('ID de producto no válido');
  }
  const query = 'DELETE FROM inventario WHERE id = $1 RETURNING *';
  const values = [id];
  const deletedProduct = await pool.query(query, values);
  if (deletedProduct.rows.length === 0) {
    throw new Error('Producto no encontrado');
  }
  return { message: 'Producto eliminado con éxito' };
}

exports.limitJoyasModel = async (limit = 10) => {
  try {
    if (isNaN(limit) || parseInt(limit) <= 0) {
      throw new Error('Límite no válido');
    }
    const query = 'SELECT * FROM inventario ORDER BY id DESC LIMIT $1';
    const values = [limit];
    const allProduct = await pool.query(query, values);
    return allProduct.rows;
  } catch (error) {
    throw new Error(`Error al limitar productos: ${error.message}`);
  }
}

exports.orderAndLimitProductModel = async (order_by = 'id_DESC', limit = 10, page = 0) => {
  const validOrders = ['id_ASC', 'id_DESC', 'nombre_ASC', 'nombre_DESC', 'categoria_ASC', 'categoria_DESC', 'precio_ASC', 'precio_DESC', 'stock_ASC', 'stock_DESC'];
  const [attribute, direction] = order_by.split('_');
  if (!validOrders.includes(order_by)) {
    throw new Error('Orden no válida');
  }
  if (isNaN(limit) || parseInt(limit) <= 0) {
    throw new Error('Límite no válido');
  }
  if (isNaN(page) || parseInt(page) < 0) {
    throw new Error('Página no válida');
  }
  const offset = page * limit;
  const query = `SELECT * FROM inventario ORDER BY ${attribute} ${direction} LIMIT $1 OFFSET $2`;
  const values = [limit, offset];
  const { rows } = await pool.query(query, values);
  return rows;
}

exports.productHateoas = async () => {
  try {
    const allProduct = await pool.query('SELECT * FROM inventario');
    if (!allProduct || allProduct.rows.length === 0) {
      throw new Error('No se encontraron productos en la base de datos');
    }
    return allProduct.rows;
  } catch (error) {
    console.error('Error al obtener productos de la base de datos:', error);
    throw error; 
  }
}

exports.filterProductModel = async (filters) => {
  const allowedColumns = ['nombre', 'categoria', 'precio', 'stock'];
  const { query, values } = postQuery('inventario', filters);
  const filterEntries = Object.entries(filters);
  for (const [key] of filterEntries) {
      if (!allowedColumns.includes(key)) {
          throw new Error(`Columna "${key}" no permitida.`);
      }
  }
  const result = await pool.query(query, values);
  return result.rows;
}
