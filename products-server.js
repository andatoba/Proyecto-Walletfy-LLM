import express from 'express';
import cors from 'cors';
import { v4 as uuidv4 } from 'uuid';

// Sample products data inline
const sampleProducts = [
  {
    id: '650e8400-e29b-41d4-a716-446655440001',
    name: 'iPhone 15 Pro',
    description: 'Último modelo de iPhone con cámara profesional y chip A17 Pro',
    price: 999.99,
    category: 'electronics',
    imageUrl: 'https://example.com/iphone15pro.jpg',
    inStock: true,
    createdAt: '2025-01-01T10:00:00.000Z',
    updatedAt: '2025-01-01T10:00:00.000Z'
  },
  {
    id: '650e8400-e29b-41d4-a716-446655440002',
    name: 'MacBook Air M3',
    description: 'Laptop ultraligera con chip M3 y pantalla Liquid Retina',
    price: 1299.99,
    category: 'electronics',
    imageUrl: 'https://example.com/macbook-air.jpg',
    inStock: true,
    createdAt: '2025-01-02T11:00:00.000Z',
    updatedAt: '2025-01-02T11:00:00.000Z'
  },
  {
    id: '650e8400-e29b-41d4-a716-446655440003',
    name: 'Auriculares Sony WH-1000XM5',
    description: 'Auriculares inalámbricos con cancelación de ruido premium',
    price: 299.99,
    category: 'electronics',
    imageUrl: 'https://example.com/sony-headphones.jpg',
    inStock: true,
    createdAt: '2025-01-03T12:00:00.000Z',
    updatedAt: '2025-01-03T12:00:00.000Z'
  },
  {
    id: '650e8400-e29b-41d4-a716-446655440004',
    name: 'Curso de Programación JavaScript',
    description: 'Curso completo de JavaScript desde básico hasta avanzado',
    price: 89.99,
    category: 'services',
    inStock: true,
    createdAt: '2025-01-04T13:00:00.000Z',
    updatedAt: '2025-01-04T13:00:00.000Z'
  },
  {
    id: '650e8400-e29b-41d4-a716-446655440005',
    name: 'Camiseta Premium Cotton',
    description: 'Camiseta de algodón 100% orgánico, corte moderno',
    price: 29.99,
    category: 'clothing',
    imageUrl: 'https://example.com/cotton-tshirt.jpg',
    inStock: false,
    createdAt: '2025-01-05T14:00:00.000Z',
    updatedAt: '2025-01-10T15:00:00.000Z'
  }
];

const app = express();
const PORT = 3030;
const API_KEYS = {
  read: process.env.WALLETFY_READ_KEY,
  write: process.env.WALLETFY_WRITE_KEY
};

// Middleware
app.use(cors());
app.use(express.json({ limit: '100kb' }));

const sanitizeInput = (value) => {
  if (Array.isArray(value)) {
    return value.map(sanitizeInput);
  }
  if (value && typeof value === 'object') {
    return Object.keys(value).reduce((acc, key) => {
      if (key.startsWith('$') || key.includes('.')) {
        return acc;
      }
      acc[key] = sanitizeInput(value[key]);
      return acc;
    }, {});
  }
  return value;
};

const pickFields = (source, allowedFields) => {
  return allowedFields.reduce((acc, field) => {
    if (Object.prototype.hasOwnProperty.call(source, field)) {
      acc[field] = source[field];
    }
    return acc;
  }, {});
};

const getApiKey = (req) => {
  const authHeader = req.get('authorization') || req.get('x-api-key');
  if (!authHeader) return null;
  if (authHeader.toLowerCase().startsWith('bearer ')) {
    return authHeader.slice(7).trim();
  }
  return authHeader.trim();
};

const requireApiKey = (role) => (req, res, next) => {
  if (!API_KEYS.write) {
    return res.status(500).json(createResponse(false, null, '', 'Servidor no configurado'));
  }

  const apiKey = getApiKey(req);
  if (!apiKey) {
    return res.status(401).json(createResponse(false, null, '', 'API key requerida'));
  }

  const readKeys = [API_KEYS.read, API_KEYS.write].filter(Boolean);
  const isAuthorized = role === 'read'
    ? readKeys.includes(apiKey)
    : apiKey === API_KEYS.write;

  if (!isAuthorized) {
    return res.status(403).json(createResponse(false, null, '', 'API key inválida'));
  }

  return next();
};

const allowedProductFields = ['name', 'description', 'price', 'category', 'imageUrl', 'inStock'];

app.use((req, res, next) => {
  if (req.body) {
    req.body = sanitizeInput(req.body);
  }
  if (req.query) {
    req.query = sanitizeInput(req.query);
  }
  next();
});

// In-memory storage for products (starts with sample data)
let products = [...sampleProducts];

// Helper function to validate product data
const validateProductData = (productData, isUpdate = false) => {
  const errors = [];
  
  if (!isUpdate && !productData.name) {
    errors.push('El nombre es obligatorio');
  }
  
  if (productData.name && (typeof productData.name !== 'string' || productData.name.length < 1 || productData.name.length > 50)) {
    errors.push('El nombre debe tener entre 1 y 50 caracteres');
  }
  
  if (productData.description && (typeof productData.description !== 'string' || productData.description.length > 200)) {
    errors.push('La descripción debe tener máximo 200 caracteres');
  }
  
  if (!isUpdate && (productData.price === undefined || productData.price === null)) {
    errors.push('El precio es obligatorio');
  }
  
  if (productData.price !== undefined && (typeof productData.price !== 'number' || productData.price <= 0)) {
    errors.push('El precio debe ser un número positivo');
  }
  
  const validCategories = ['electronics', 'clothing', 'food', 'services', 'books', 'home', 'transportation', 'health', 'entertainment', 'other'];
  if (!isUpdate && !productData.category) {
    errors.push('La categoría es obligatoria');
  }
  
  if (productData.category && (typeof productData.category !== 'string' || !validCategories.includes(productData.category))) {
    errors.push('Categoría inválida');
  }
  
  if (productData.imageUrl && typeof productData.imageUrl !== 'string') {
    errors.push('La URL de imagen debe ser una cadena válida');
  }
  
  return errors;
};

// Helper function to create response
const createResponse = (success, data = null, message = '', error = '') => {
  return {
    success,
    ...(data && { data }),
    ...(message && { message }),
    ...(error && { error })
  };
};

// Routes

// GET /api/products - Listar todos los productos
app.get('/api/products', requireApiKey('read'), (req, res) => {
  try {
    res.json(createResponse(true, products, 'Productos obtenidos exitosamente'));
  } catch (err) {
    res.status(500).json(createResponse(false, null, '', 'Error interno del servidor'));
  }
});

// GET /api/products/:id - Obtener producto por ID
app.get('/api/products/:id', requireApiKey('read'), (req, res) => {
  try {
    const { id } = req.params;
    const product = products.find(p => p.id === id);
    
    if (!product) {
      return res.status(404).json(createResponse(false, null, '', 'Producto no encontrado'));
    }
    
    res.json(createResponse(true, product, 'Producto obtenido exitosamente'));
  } catch (err) {
    res.status(500).json(createResponse(false, null, '', 'Error interno del servidor'));
  }
});

// POST /api/products - Crear nuevo producto
app.post('/api/products', requireApiKey('write'), (req, res) => {
  try {
    const productData = pickFields(req.body, allowedProductFields);
    if (Object.keys(productData).length === 0) {
      return res.status(400).json(createResponse(false, null, '', 'Datos inválidos'));
    }
    const validationErrors = validateProductData(productData);
    
    if (validationErrors.length > 0) {
      return res.status(400).json(createResponse(false, null, '', validationErrors.join(', ')));
    }
    
    const now = new Date().toISOString();
    const newProduct = {
      id: uuidv4(),
      name: productData.name,
      description: productData.description || '',
      price: productData.price,
      category: productData.category,
      imageUrl: productData.imageUrl || '',
      inStock: productData.inStock !== undefined ? productData.inStock : true,
      createdAt: now,
      updatedAt: now
    };
    
    products.push(newProduct);
    res.status(201).json(createResponse(true, newProduct, 'Producto creado exitosamente'));
  } catch (err) {
    res.status(500).json(createResponse(false, null, '', 'Error interno del servidor'));
  }
});

// PUT /api/products/:id - Actualizar producto
app.put('/api/products/:id', requireApiKey('write'), (req, res) => {
  try {
    const { id } = req.params;
    const updateData = pickFields(req.body, allowedProductFields);
    
    const productIndex = products.findIndex(p => p.id === id);
    if (productIndex === -1) {
      return res.status(404).json(createResponse(false, null, '', 'Producto no encontrado'));
    }

    if (Object.keys(updateData).length === 0) {
      return res.status(400).json(createResponse(false, null, '', 'No hay campos válidos para actualizar'));
    }
    
    const validationErrors = validateProductData(updateData, true);
    if (validationErrors.length > 0) {
      return res.status(400).json(createResponse(false, null, '', validationErrors.join(', ')));
    }
    
    const existingProduct = products[productIndex];
    const updatedProduct = {
      ...existingProduct,
      ...updateData,
      id: existingProduct.id, // Ensure ID doesn't change
      createdAt: existingProduct.createdAt, // Ensure createdAt doesn't change
      updatedAt: new Date().toISOString()
    };
    
    products[productIndex] = updatedProduct;
    res.json(createResponse(true, updatedProduct, 'Producto actualizado exitosamente'));
  } catch (err) {
    res.status(500).json(createResponse(false, null, '', 'Error interno del servidor'));
  }
});

// DELETE /api/products/:id - Eliminar producto
app.delete('/api/products/:id', requireApiKey('write'), (req, res) => {
  try {
    const { id } = req.params;
    const productIndex = products.findIndex(p => p.id === id);
    
    if (productIndex === -1) {
      return res.status(404).json(createResponse(false, null, '', 'Producto no encontrado'));
    }
    
    const deletedProduct = products[productIndex];
    products.splice(productIndex, 1);
    
    res.json(createResponse(true, deletedProduct, 'Producto eliminado exitosamente'));
  } catch (err) {
    res.status(500).json(createResponse(false, null, '', 'Error interno del servidor'));
  }
});

// Health check endpoint
app.get('/api/health', requireApiKey('read'), (req, res) => {
  res.json(createResponse(true, { status: 'OK', timestamp: new Date().toISOString() }, 'Servidor funcionando correctamente'));
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json(createResponse(false, null, '', 'Error interno del servidor'));
});

// 404 handler
app.use((req, res) => {
  res.status(404).json(createResponse(false, null, '', 'Endpoint no encontrado'));
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
  console.log(`📚 API Endpoints disponibles:`);
  console.log(`   GET    /api/products      - Listar todos los productos`);
  console.log(`   GET    /api/products/:id  - Obtener producto por ID`);
  console.log(`   POST   /api/products      - Crear nuevo producto`);
  console.log(`   PUT    /api/products/:id  - Actualizar producto`);
  console.log(`   DELETE /api/products/:id  - Eliminar producto`);
  console.log(`   GET    /api/health        - Estado del servidor`);
  console.log(`\n💾 Iniciado con ${products.length} productos de ejemplo`);
});

export default app;
