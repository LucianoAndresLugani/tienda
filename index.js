const express = require('express');
const morgan = require('morgan'); // Importamos morgan
const app = express();
const PORT = 3001;

// Middleware para interpretar JSON en el cuerpo de las solicitudes
app.use(express.json());

// Token personalizado para mostrar el cuerpo de las solicitudes POST
morgan.token('body', (req) => JSON.stringify(req.body));

// Configurar Morgan para registrar el método, la URL, el estado, el tamaño de la respuesta, el tiempo de respuesta y el cuerpo
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'));

// Datos codificados de productos
let products = [
  { id: 1, name: "Laptop", price: 999.99 },
  { id: 2, name: "Smartphone", price: 499.99 },
  { id: 3, name: "Headphones", price: 79.99 },
  { id: 4, name: "Keyboard", price: 49.99 }
];

// Ruta para obtener la lista de productos
app.get('/api/products', (req, res) => {
  res.json(products);
});

// Ruta para obtener un producto por ID
app.get('/api/products/:id', (req, res) => {
  const id = Number(req.params.id);
  const product = products.find(p => p.id === id);

  if (product) {
    res.json(product);
  } else {
    res.status(404).json({ error: 'Product not found' });
  }
});

// Ruta para eliminar un producto por ID
app.delete('/api/products/:id', (req, res) => {
  const id = Number(req.params.id);
  const index = products.findIndex(p => p.id === id);

  if (index !== -1) {
    products.splice(index, 1);
    res.status(204).end();  // 204 significa "No Content"
  } else {
    res.status(404).json({ error: 'Product not found' });
  }
});

// Ruta para agregar un nuevo producto
app.post('/api/products', (req, res) => {
  const { name, price } = req.body;

  if (!name || !price) {
    return res.status(400).json({ error: 'Name and price are required' });
  }

  const existingProduct = products.find(p => p.name === name);
  if (existingProduct) {
    return res.status(400).json({ error: 'Product name must be unique' });
  }

  const newProduct = {
    id: Math.floor(Math.random() * 1000000),
    name,
    price
  };

  products.push(newProduct);
  res.status(201).json(newProduct);
});

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
