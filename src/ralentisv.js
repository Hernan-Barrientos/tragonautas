const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mysql = require('mysql');
require('dotenv').config();

const app = express();
const PORT = 3001;

app.use(bodyParser.json());
app.use(cors());

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  connectionLimit: 10
});

const executeQuery = (query, values = []) => {
  return new Promise((resolve, reject) => {
    pool.query(query, values, (err, results) => {
      if (err) {
        console.error('Error en la consulta SQL:', err);
        return reject(err);
      }
      resolve(results);
    });
  });
};

const loadCategoriesFromDatabase = async () => {
  try {
    const categoryResults = await executeQuery("SELECT * FROM categories");
    const itemsResults = await executeQuery("SELECT * FROM items ORDER BY ListOrder, id");
    
    const categories = categoryResults.map(category => ({
      id: category.id,
      name: category.name,
      items: itemsResults
        .filter(item => item.category_id === category.id)
        .map(item => ({
          id: item.id,
          nombre: item.nombre,
          con_alcohol: item.con_alcohol,
          disponible_chico: item.disponible_chico,
          disponible_grande: item.disponible_grande,
          precio_tamaño_chico: item.precio_tamaño_chico,
          precio_tamaño_grande: item.precio_tamaño_grande,
          sin_alcohol: item.sin_alcohol,
          precio_tamaño_chico_sin_alcohol: item.precio_tamaño_chico_sin_alcohol,
          precio_tamaño_grande_sin_alcohol: item.precio_tamaño_grande_sin_alcohol,
          precio_unico: item.precio_unico,
          ListOrder: item.ListOrder,
          category_id: item.category_id
        }))
    }));
    
    return categories;
  } catch (error) {
    console.error('Error loading categories:', error);
    throw error;
  }
};

const verificarClave = (req, res, next) => {
  const { claveSecreta } = req.body;
  if (claveSecreta === process.env.SECRET_KEY) {
    return next();
  }
  res.status(401).json({ error: 'Clave incorrecta' });
};

app.post('/passint', async (req, res) => {
  try {
    const { clave } = req.body;
    res.json({ valid: clave === process.env.SECRET_KEY });
  } catch (error) {
    console.error('Error al verificar la clave:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

app.get('/categories', async (req, res) => {
  try {
    const categories = await loadCategoriesFromDatabase();
    res.json(categories);
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ error: 'Error fetching categories' });
  }
});

app.post('/categories', verificarClave, async (req, res) => {
  try {
    const { categoryName } = req.body;
    await executeQuery('INSERT INTO categories (name) VALUES (?)', [categoryName]);
    const categories = await loadCategoriesFromDatabase();
    res.status(201).json(categories);
  } catch (error) {
    console.error('Error creating category:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

app.put('/categories/:categoryId', verificarClave, async (req, res) => {
  try {
    const { categoryId } = req.params;
    const { categoryName } = req.body;
    await executeQuery('UPDATE categories SET name = ? WHERE id = ?', [categoryName, categoryId]);
    const categories = await loadCategoriesFromDatabase();
    res.json(categories);
  } catch (error) {
    console.error('Error updating category:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

app.delete('/categories/:categoryId', verificarClave, async (req, res) => {
  try {
    const { categoryId } = req.params;
    await executeQuery('DELETE FROM items WHERE category_id = ?', [categoryId]);
    await executeQuery('DELETE FROM categories WHERE id = ?', [categoryId]);
    const categories = await loadCategoriesFromDatabase();
    res.json(categories);
  } catch (error) {
    console.error('Error deleting category:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

app.put('/categories/:categoryId/items/reorder', verificarClave, async (req, res) => {
  try {
    const { categoryId } = req.params;
    const { orderedIds } = req.body;

    if (!Array.isArray(orderedIds)) {
      return res.status(400).json({ error: 'Formato de orden inválido' });
    }

    const items = await executeQuery(
      'SELECT id FROM items WHERE category_id = ?',
      [categoryId]
    );
    const validIds = items.map(item => item.id);
    if (
      orderedIds.length !== validIds.length ||
      !orderedIds.every(id => validIds.includes(id))
    ) {
      return res.status(400).json({ error: 'Lista de IDs inválida o incompleta' });
    }

    await executeQuery('START TRANSACTION');
    try {
      for (let i = 0; i < orderedIds.length; i++) {
        await executeQuery(
          'UPDATE items SET ListOrder = ? WHERE id = ? AND category_id = ?',
          [i, orderedIds[i], categoryId]
        );
      }
      await executeQuery('COMMIT');
    } catch (error) {
      await executeQuery('ROLLBACK');
      throw error;
    }

    const categories = await loadCategoriesFromDatabase();
    res.json(categories);
  } catch (error) {
    console.error('Error reordering items:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

app.post('/categories/:categoryId/items', verificarClave, async (req, res) => {
  try {
    const { categoryId } = req.params;
    const item = { ...req.body };
    delete item.claveSecreta;

    const maxOrderResult = await executeQuery(
      'SELECT MAX(ListOrder) as maxOrder FROM items WHERE category_id = ?',
      [categoryId]
    );
    const nextOrder = (maxOrderResult[0].maxOrder ?? -1) + 1;
    item.ListOrder = nextOrder;
    item.category_id = categoryId;

    await executeQuery('INSERT INTO items SET ?', item);
    const categories = await loadCategoriesFromDatabase();
    res.status(201).json(categories);
  } catch (error) {
    console.error('Error creating item:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

app.put('/categories/:categoryId/items/:itemId', verificarClave, async (req, res) => {
  try {
    const { categoryId, itemId } = req.params;
    const item = { ...req.body };
    delete item.claveSecreta;

    await executeQuery(
      'UPDATE items SET ? WHERE id = ? AND category_id = ?',
      [item, itemId, categoryId]
    );
    const categories = await loadCategoriesFromDatabase();
    res.json(categories);
  } catch (error) {
    console.error('Error updating item:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

app.delete('/categories/:categoryId/items/:itemId', verificarClave, async (req, res) => {
  try {
    const { categoryId, itemId } = req.params;
    await executeQuery(
      'DELETE FROM items WHERE id = ? AND category_id = ?',
      [itemId, categoryId]
    );
    const categories = await loadCategoriesFromDatabase();
    res.json(categories);
  } catch (error) {
    console.error('Error deleting item:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});