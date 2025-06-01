const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mysql = require('mysql');

const app = express();
const PORT = 443;

let categories = [];

app.use(bodyParser.json());
app.use(cors());
require('dotenv').config();

const dbConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
};


const loadCategoriesFromDatabase = async () => {
  try {
    const connection = mysql.createConnection(dbConfig);
    connection.connect();
    const query = "SELECT table_name FROM information_schema.tables WHERE table_schema = 'tragonautas_menu'";
    const results = await executeQuery(query);
    const categoryPromises = results.map(async (result) => {
      const tableName = result['table_name'];
      const selectQuery = `SELECT * FROM ${tableName}`;
      const selectResults = await executeQuery(selectQuery);
      return {
        name: tableName,
        items: selectResults
      };
    });
    categories = await Promise.all(categoryPromises);
    connection.end();
    console.log('Categories loaded from the database');
  } catch (error) {
    console.error('Error loading categories from the database:', error);
  }
};

loadCategoriesFromDatabase();




function executeQuery(query, values = []) {
  return new Promise((resolve, reject) => {
    const connection = mysql.createConnection(dbConfig);
    connection.connect((err) => {
      if (err) {
        console.error('Error connecting to the database:', err);
        reject(err);
        return;
      }

      connection.query(query, values, (err, results) => {
        connection.end();
        if (err) {
          console.error('Error executing query:', err);
          reject(err);
        } else {
          resolve(results);
        }
      });
    });
  });
}

const verificarClave = (req, res, next) => {
  const claveCorrecta = 'sarasa';
  const claveRecibida = req.body.claveSecreta;
  if (claveRecibida === claveCorrecta) {
    next();
  } else {
    res.status(401).json({ error: 'Clave incorrecta' });
  }
};

app.get('/categories', async (req, res) => {
  try {
    // Fetch categories from the database
    await loadCategoriesFromDatabase();
    // Return the fetched categories
    res.json(categories);
  } catch (error) {
    console.error('Error fetching categories from the database:', error);
    res.status(500).json({ error: 'Error fetching categories' });
  }
});


app.post('/categories', verificarClave, async (req, res) => {
  const categoryName = req.body.categoryName; // Assuming the category name is sent in the request body

  // Aquí puedes validar los datos de categoryName antes de insertarlo en la base de datos

  const createTableQuery = `CREATE TABLE IF NOT EXISTS ${categoryName} (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL,
    con_alcohol BOOLEAN NOT NULL,
    disponible_chico BOOLEAN NOT NULL,
    disponible_grande BOOLEAN NOT NULL,
    precio_tamaño_chico FLOAT NOT NULL,
    precio_tamaño_grande FLOAT NOT NULL,
    sin_alcohol BOOLEAN NOT NULL,
    precio_tamaño_chico_sin_alcohol FLOAT NOT NULL,
    precio_tamaño_grande_sin_alcohol FLOAT NOT NULL,
    precio_unico FLOAT NOT NULL
  )`;

  try {
    await executeQuery(createTableQuery);
    await loadCategoriesFromDatabase(); // Reload categories after creating the table
    res.status(201).json({ message: 'Categoría creada con éxito' });
  } catch (error) {
    console.error('Error creando categoría en la base de datos:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

app.post('/categories/:categoryId/items', verificarClave, async (req, res) => {
  const categoryId = req.params.categoryId;
  const item = req.body;

  // Elimina la propiedad claveSecreta del objeto item
  delete item.claveSecreta;

  // Aquí puedes validar los datos del item antes de insertarlos en la base de datos

  const query = 'INSERT INTO ?? SET ?';
  const values = [categoryId, item];

  try {
    await executeQuery(query, values);
    res.status(201).json({ message: 'Item creado con éxito' });
  } catch (error) {
    console.error('Error insertando item en la base de datos:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});



app.put('/categories/:categoryId', verificarClave, async (req, res) => {
  const categoryId = req.params.categoryId;
  const newCategoryName = req.body.categoryName; // Assuming the new category name is sent in the request body

  // Aquí puedes validar los datos de newCategoryName antes de actualizarlo en la base de datos

  const renameTableQuery = `RENAME TABLE ${categoryId} TO ${newCategoryName}`;

  try {
    await executeQuery(renameTableQuery);
    await loadCategoriesFromDatabase(); // Reload categories after renaming the table
    res.json({ message: 'Categoría actualizada con éxito' });
  } catch (error) {
    console.error('Error actualizando categoría en la base de datos:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

app.put('/categories/:categoryId/items/:itemId', verificarClave, async (req, res) => {
  const categoryId = req.params.categoryId;
  const itemId = req.params.itemId;
  let item = req.body;

  // Elimina la propiedad claveSecreta del objeto item
  delete item.claveSecreta;

  // Valida que el objeto item contenga todas las propiedades requeridas
  const requiredProperties = ['nombre', 'con_alcohol', 'disponible_chico', 'disponible_grande', 'precio_tamaño_chico', 'precio_tamaño_grande', 'sin_alcohol', 'precio_tamaño_chico_sin_alcohol', 'precio_tamaño_grande_sin_alcohol', 'precio_unico'];
  for (const property of requiredProperties) {
    if (item[property] === undefined || item[property] === null || item[property] === '' || item[property] === false || item[property] === 0) {
      item[property] = 0;
    }
  }

  // Aquí puedes validar los datos del item antes de actualizarlos en la base de datos

  const query = 'UPDATE ?? SET ? WHERE id = ?';
  const values = [categoryId, item, itemId];

  try {
    await executeQuery(query, values);
    res.json({ message: 'Item actualizado con éxito' });
  } catch (error) {
    console.error('Error actualizando item en la base de datos:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});



app.delete('/categories/:categoryId', verificarClave, async (req, res) => {
  const categoryId = req.params.categoryId;

  // Aquí puedes realizar las validaciones necesarias antes de eliminar la categoría

  const deleteTableQuery = `DROP TABLE IF EXISTS ${categoryId}`;

  try {
    await executeQuery(deleteTableQuery);
    await loadCategoriesFromDatabase(); // Reload categories after deleting the table
    res.status(200).json({ message: 'Categoría eliminada con éxito' });
  } catch (error) {
    console.error('Error eliminando categoría de la base de datos:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

app.delete('/categories/:categoryId/items/:itemId', verificarClave, async (req, res) => {
  const categoryId = req.params.categoryId;
  const itemId = req.params.itemId;

  const query = 'DELETE FROM ?? WHERE id = ?';
  const values = [categoryId, itemId];

  try {
    await executeQuery(query, values);
    res.status(200).json({ message: 'Item eliminado con éxito' });
  } catch (error) {
    console.error('Error eliminando item de la base de datos:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});






app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
