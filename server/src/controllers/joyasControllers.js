const HATEOAS = require('../../helpers/hateoas');
const pagination = require('../../helpers/paginator.js');
const {getProductoById, getModel, addjoyasModel, updatejoyasModel, deletejoyasModel, limitJoyasModel, orderAndLimitProductModel, productHateoas, filterProductModel,} = require("../../module/joyasModel.js");

exports.inventario = async (req, res) => {
  try {
    const { id } = req.query;
    if (id) {
      if (isNaN(id) || parseInt(id) <= 0) {
        return res.status(400).json({ error: 'ID de producto no válido' });
      }
      const producto = await getProductoById(id);
      if (!producto) {
        return res.status(404).json({ error: 'Producto no encontrado' });
      }
      return res.status(200).json(producto);
    } else {
      const inventario = await getModel();
      return res.status(200).json(inventario);
    }
  } catch (error) {
    console.error("Error al obtener el inventario:", error);
    return res.status(500).json({ error: "Error interno del servidor" });
  }
};


exports.createNewProduct = async (req, res) => {
  try {
    const { nombre, categoria, metal, precio, stock } = req.body;
    if (!nombre || !categoria || !metal || !precio || !stock ||
        typeof nombre !== 'string' || typeof categoria !== 'string' || typeof metal !== 'string' ||
        typeof precio !== 'number' || typeof stock !== 'number' ||
        isNaN(precio) || isNaN(stock) || precio < 0 || stock < 0) {
      return res.status(400).json({ message: "Datos de producto no válidos" });
    }
    const newProduct = await addjoyasModel(nombre, categoria, metal, precio, stock);
    return res.status(200).json(newProduct);
  } catch (error) {
    console.error(`Error al crear un nuevo producto:`, error);
    return res.status(500).json({ message: "Error interno del servidor" });
  }
};


exports.updateInventarioStock = async (req, res) => {
  try {
    const { nombre, categoria, metal, precio, stock, id } = req.body;
    if (!id || isNaN(id) || parseInt(id) <= 0) {
      return res.status(400).json({ message: "ID de producto no válido" });
    }
    if (!nombre || !categoria || !metal || isNaN(precio) || isNaN(stock)) {
      return res.status(400).json({ message: "Campos de producto incompletos o no válidos" });
    }
    const maxNombreLength = 255;
    const maxCategoriaLength = 50;
    if (nombre.length > maxNombreLength || categoria.length > maxCategoriaLength) {
      return res.status(400).json({ message: "Longitud máxima excedida para nombre o categoría" });
    }
    if (precio < 0 || stock < 0) {
      return res.status(400).json({ message: "Precio o stock no pueden ser negativos" });
    }
    await updatejoyasModel(id, { nombre, categoria, metal, precio, stock });
    res.sendStatus(200);
  } catch (error) {
    console.error("Error al actualizar inventario:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id || isNaN(id) || parseInt(id) <= 0) {
      return res.status(400).json({ message: "ID de producto no válido" });
    }
    const deletedProduct = await deletejoyasModel(id);
    if (!deletedProduct || deletedProduct.length === 0) {
      return res.status(404).json({ message: "Producto no encontrado o no eliminado" });
    }
    return res.status(200).json(deletedProduct);
  } catch (error) {
    console.error(`Error al eliminar el ID ${req.params.id} de inventario:`, error);
    return res.status(500).json({ message: "Error interno del servidor" });
  }
};

exports.limitJoyas = async (req, res) => {
  try {
    let { limit } = req.query;
    if (!limit || isNaN(limit) || parseInt(limit) <= 0) {
      limit = 10;
    }
    const limitProduct = await limitJoyasModel(limit);
    return res.status(200).json(limitProduct);
  } catch (error) {
    console.error(`Error al querer limitar API:`, error);
    return res.status(500).json({ message: "Error interno del servidor" });
  }
};


exports.orderAndLimitProduct = async (req, res) => {
  try {
    let { order_by, limit, page } = req.query;
    if (!order_by || order_by.trim() === '') {
      order_by = 'id_DESC'; 
    }
    limit = parseInt(limit);
    if (isNaN(limit) || limit <= 0) {
      limit = 10;
    }
    page = parseInt(page);
    if (isNaN(page) || page < 0) {
      page = 0; 
    }
    const olJoyas = await orderAndLimitProductModel(order_by, limit, page);
    return res.status(200).json({ joya: olJoyas });
  } catch (error) {
    console.error(`Error al querer ordenar o limitar API:`, error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};


exports.productwithHateoas = async (req, res) => {
  try {
    const allProduct = await productHateoas();
    let entity = '';
    if (req.query.entity && req.query.entity.trim() !== '') {
      entity = req.query.entity.trim();
    }
    const allProductWithHateoas = await HATEOAS(entity, allProduct);
    return res.status(200).json({ allProductWithHateoas });
  } catch (error) {
    console.error(`Error al procesar los datos con HATEOAS:`, error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};

exports.productPagination = async (req, res) => {
  try {
    const { items, page } = req.query;
    console.log('Item:', items, 'Page:', page);
    if (!items || !page) {
      return res.status(400).json({ message: 'Los parámetros items y page son obligatorios.' });
    }
    const isItemsValid = /^[1-9]\d*$/.test(items);
    const isPageValid = /^[1-9]\d*$/.test(page);
    if (!isItemsValid || !isPageValid) {
      return res.status(400).json({ message: 'Los parámetros items y page deben ser números enteros positivos.' });
    }
    try {
      const allProducts = await productHateoas();
      console.log('All products:', allProducts);
      if (!Array.isArray(allProducts) || allProducts.length === 0) {
        return res.status(404).json({ message: 'No se encontraron productos.' });
      }
      const maxPage = Math.ceil(allProducts.length / parseInt(items));
      if (parseInt(page) > maxPage) {
        return res.status(400).json({ message: `Número de página inválido. El valor máximo permitido para page es ${maxPage}.` });
      }
      const pageData = pagination(allProducts, parseInt(items), parseInt(page));
      console.log('Page data:', pageData);
      res.status(200).json(pageData);
    } catch (error) {
      console.error('Error al obtener productos de la base de datos:', error);
      res.status(500).json({ message: "Error interno del servidor" });
    }
  } catch (error) {
    console.error('Error al procesar la paginación:', error.message);
    res.status(500).json({ message: "Error interno del servidor" });
  }
}


exports.filterProduct = async (req, res) => {
  try {
    const { categoria, metal } = req.query; 
    if (!categoria && !metal) {
      return res.status(400).json({ message: 'Se requiere al menos un filtro (metal o categoria).' });
    }
    const filters = { categoria, metal }; 
    console.log('Filtros:', filters);
    const filteredProducts = await filterProductModel(filters);
    console.log('Productos filtrados:', filteredProducts);
    if (!Array.isArray(filteredProducts) || filteredProducts.length === 0) {
      return res.status(404).json({ message: 'No se encontraron productos que coincidan con los filtros proporcionados.' });
    }
    res.status(200).json(filteredProducts);
  } catch (error) {
    console.error('Error al filtrar productos:', error.message);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};


