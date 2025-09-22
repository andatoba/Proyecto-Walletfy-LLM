import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import Product from './models/Product.js';
import Logger from './utils/logger.js';

const app = express();
const PORT = 3030;
const MONGODB_URI = 'mongodb://localhost:27017/walletfy_products';

// Middleware
app.use(cors());
app.use(express.json());

// Middleware para logging de requests
app.use((req, res, next) => {
  const start = Date.now();
  
  res.on('finish', () => {
    const duration = Date.now() - start;
    Logger.request(req.method, req.originalUrl, res.statusCode, duration);
  });
  
  next();
});

// Conexión a MongoDB
const connectDB = async () => {
  try {
    Logger.info('Conectando a MongoDB...');
    await mongoose.connect(MONGODB_URI);
    Logger.success('✅ Conexión exitosa a MongoDB');
    Logger.database('Base de datos: walletfy_products');
  } catch (error) {
    Logger.error('❌ Error al conectar con MongoDB:', error.message);
    process.exit(1);
  }
};

// Helper function para crear respuestas
const createResponse = (success, data = null, message = '', error = '') => {
  return {
    success,
    ...(data && { data }),
    ...(message && { message }),
    ...(error && { error })
  };
};

// Helper function para manejar errores de validación de Mongoose
const handleValidationError = (error) => {
  if (error.name === 'ValidationError') {
    const messages = Object.values(error.errors).map(err => err.message);
    return messages.join(', ');
  }
  if (error.name === 'CastError') {
    return 'ID inválido';
  }
  return error.message || 'Error interno del servidor';
};

// Helper function para construir filtros de búsqueda
const buildSearchFilters = (query) => {
  const filters = {};
  
  // Filtro por nombre (búsqueda parcial, case insensitive)
  if (query.name) {
    filters.name = { $regex: query.name, $options: 'i' };
  }
  
  // Filtro por categoría
  if (query.category) {
    filters.category = query.category;
  }
  
  // Filtro por rango de precios
  if (query.minPrice || query.maxPrice) {
    filters.price = {};
    if (query.minPrice) filters.price.$gte = parseFloat(query.minPrice);
    if (query.maxPrice) filters.price.$lte = parseFloat(query.maxPrice);
  }
  
  // Filtro por disponibilidad
  if (query.inStock !== undefined) {
    filters.inStock = query.inStock === 'true';
  }
  
  return filters;
};

// Routes

// GET /api/products - Listar productos con paginación, filtros y ordenamiento
app.get('/api/products', async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      sortBy = 'createdAt',
      sortOrder = 'desc',
      ...filterParams
    } = req.query;

    // Construir filtros
    const filters = buildSearchFilters(filterParams);
    
    // Configurar paginación
    const pageNum = Math.max(1, parseInt(page));
    const limitNum = Math.min(100, Math.max(1, parseInt(limit))); // Máximo 100 productos por página
    const skip = (pageNum - 1) * limitNum;
    
    // Configurar ordenamiento
    const sortObj = {};
    const validSortFields = ['name', 'price', 'category', 'createdAt', 'updatedAt'];
    const sortField = validSortFields.includes(sortBy) ? sortBy : 'createdAt';
    const sortDirection = sortOrder === 'asc' ? 1 : -1;
    sortObj[sortField] = sortDirection;
    
    // Ejecutar consulta
    const [products, totalCount] = await Promise.all([
      Product.find(filters)
        .sort(sortObj)
        .skip(skip)
        .limit(limitNum)
        .lean(),
      Product.countDocuments(filters)
    ]);
    
    // Calcular información de paginación
    const totalPages = Math.ceil(totalCount / limitNum);
    const hasNextPage = pageNum < totalPages;
    const hasPrevPage = pageNum > 1;
    
    const response = {
      success: true,
      data: products,
      pagination: {
        currentPage: pageNum,
        totalPages,
        totalItems: totalCount,
        itemsPerPage: limitNum,
        hasNextPage,
        hasPrevPage
      },
      filters: filters,
      message: `${products.length} productos encontrados`
    };
    
    res.json(response);
  } catch (error) {
    Logger.error('Error al obtener productos:', error);
    res.status(500).json(createResponse(false, null, '', 'Error interno del servidor'));
  }
});

// GET /api/products/:id - Obtener producto por ID
app.get('/api/products/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json(createResponse(false, null, '', 'ID inválido'));
    }
    
    const product = await Product.findById(id);
    
    if (!product) {
      return res.status(404).json(createResponse(false, null, '', 'Producto no encontrado'));
    }
    
    res.json(createResponse(true, product, 'Producto obtenido exitosamente'));
  } catch (error) {
    Logger.error('Error al obtener producto:', error);
    const errorMessage = handleValidationError(error);
    res.status(500).json(createResponse(false, null, '', errorMessage));
  }
});

// POST /api/products - Crear nuevo producto
app.post('/api/products', async (req, res) => {
  try {
    const productData = req.body;
    
    const newProduct = new Product(productData);
    const savedProduct = await newProduct.save();
    
    Logger.success(`Producto creado: ${savedProduct.name} (ID: ${savedProduct._id})`);
    res.status(201).json(createResponse(true, savedProduct, 'Producto creado exitosamente'));
  } catch (error) {
    Logger.error('Error al crear producto:', error);
    const errorMessage = handleValidationError(error);
    const statusCode = error.name === 'ValidationError' ? 400 : 500;
    res.status(statusCode).json(createResponse(false, null, '', errorMessage));
  }
});

// PUT /api/products/:id - Actualizar producto
app.put('/api/products/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json(createResponse(false, null, '', 'ID inválido'));
    }
    
    // Remover campos que no deben ser actualizados
    delete updateData._id;
    delete updateData.createdAt;
    delete updateData.isDeleted;
    
    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      updateData,
      { 
        new: true, 
        runValidators: true 
      }
    );
    
    if (!updatedProduct) {
      return res.status(404).json(createResponse(false, null, '', 'Producto no encontrado'));
    }
    
    Logger.success(`Producto actualizado: ${updatedProduct.name} (ID: ${updatedProduct._id})`);
    res.json(createResponse(true, updatedProduct, 'Producto actualizado exitosamente'));
  } catch (error) {
    Logger.error('Error al actualizar producto:', error);
    const errorMessage = handleValidationError(error);
    const statusCode = error.name === 'ValidationError' || error.name === 'CastError' ? 400 : 500;
    res.status(statusCode).json(createResponse(false, null, '', errorMessage));
  }
});

// DELETE /api/products/:id - Eliminar producto (eliminación lógica)
app.delete('/api/products/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json(createResponse(false, null, '', 'ID inválido'));
    }
    
    // Eliminación lógica - marcar como eliminado pero mantener en BD
    const deletedProduct = await Product.findByIdAndUpdate(
      id,
      { isDeleted: true },
      { new: true }
    );
    
    if (!deletedProduct) {
      return res.status(404).json(createResponse(false, null, '', 'Producto no encontrado'));
    }
    
    Logger.warn(`Producto eliminado (lógicamente): ${deletedProduct.name} (ID: ${deletedProduct._id})`);
    res.json(createResponse(true, deletedProduct, 'Producto eliminado exitosamente'));
  } catch (error) {
    Logger.error('Error al eliminar producto:', error);
    const errorMessage = handleValidationError(error);
    res.status(500).json(createResponse(false, null, '', errorMessage));
  }
});

// GET /api/health - Health check con estado de MongoDB
app.get('/api/health', async (req, res) => {
  try {
    // Verificar conexión a MongoDB
    const dbState = mongoose.connection.readyState;
    const dbStatus = {
      0: 'disconnected',
      1: 'connected',
      2: 'connecting',
      3: 'disconnecting'
    };
    
    const isDbConnected = dbState === 1;
    
    // Obtener estadísticas de la base de datos
    let dbStats = null;
    let productCount = 0;
    
    if (isDbConnected) {
      try {
        productCount = await Product.countDocuments();
        const db = mongoose.connection.db;
        dbStats = await db.stats();
      } catch (error) {
        Logger.warn('No se pudieron obtener estadísticas de la BD:', error.message);
      }
    }
    
    const healthData = {
      status: isDbConnected ? 'OK' : 'ERROR',
      timestamp: new Date().toISOString(),
      server: {
        uptime: process.uptime(),
        memory: process.memoryUsage(),
        nodeVersion: process.version
      },
      database: {
        status: dbStatus[dbState],
        connected: isDbConnected,
        host: mongoose.connection.host,
        name: mongoose.connection.name,
        productCount,
        ...(dbStats && {
          collections: dbStats.collections,
          dataSize: `${(dbStats.dataSize / 1024 / 1024).toFixed(2)} MB`,
          storageSize: `${(dbStats.storageSize / 1024 / 1024).toFixed(2)} MB`
        })
      }
    };
    
    const statusCode = isDbConnected ? 200 : 503;
    const message = isDbConnected ? 'Servidor funcionando correctamente' : 'Problemas de conectividad con la base de datos';
    
    res.status(statusCode).json(createResponse(isDbConnected, healthData, message));
  } catch (error) {
    Logger.error('Error en health check:', error);
    res.status(500).json(createResponse(false, null, '', 'Error interno del servidor'));
  }
});

// Middleware para manejo de errores globales
app.use((err, req, res, next) => {
  Logger.error('Error no manejado:', err);
  res.status(500).json(createResponse(false, null, '', 'Error interno del servidor'));
});

// 404 handler
app.use((req, res) => {
  res.status(404).json(createResponse(false, null, '', 'Endpoint no encontrado'));
});

// Función para inicializar el servidor
const startServer = async () => {
  try {
    // Conectar a MongoDB
    await connectDB();
    
    // Opcional: Inicializar con datos de ejemplo si la BD está vacía
    const productCount = await Product.countDocuments();
    if (productCount === 0) {
      Logger.info('Base de datos vacía, insertando productos de ejemplo...');
      
      const sampleProducts = [
        {
          name: 'iPhone 15 Pro',
          description: 'Último modelo de iPhone con cámara profesional y chip A17 Pro',
          price: 999.99,
          category: 'electronics',
          imageUrl: 'https://example.com/iphone15pro.jpg',
          inStock: true
        },
        {
          name: 'MacBook Air M3',
          description: 'Laptop ultraligera con chip M3 y pantalla Liquid Retina',
          price: 1299.99,
          category: 'electronics',
          imageUrl: 'https://example.com/macbook-air.jpg',
          inStock: true
        },
        {
          name: 'Auriculares Sony WH-1000XM5',
          description: 'Auriculares inalámbricos con cancelación de ruido premium',
          price: 299.99,
          category: 'electronics',
          imageUrl: 'https://example.com/sony-headphones.jpg',
          inStock: true
        },
        {
          name: 'Curso de Programación JavaScript',
          description: 'Curso completo de JavaScript desde básico hasta avanzado',
          price: 89.99,
          category: 'services',
          inStock: true
        },
        {
          name: 'Camiseta Premium Cotton',
          description: 'Camiseta de algodón 100% orgánico, corte moderno',
          price: 29.99,
          category: 'clothing',
          imageUrl: 'https://example.com/cotton-tshirt.jpg',
          inStock: false
        }
      ];
      
      await Product.insertMany(sampleProducts);
      Logger.success(`✅ ${sampleProducts.length} productos de ejemplo insertados`);
    }
    
    // Iniciar servidor
    app.listen(PORT, () => {
      Logger.success(`🚀 Servidor corriendo en http://localhost:${PORT}`);
      Logger.info('📚 API Endpoints disponibles:');
      Logger.info('   GET    /api/products      - Listar productos con filtros y paginación');
      Logger.info('   GET    /api/products/:id  - Obtener producto por ID');
      Logger.info('   POST   /api/products      - Crear nuevo producto');
      Logger.info('   PUT    /api/products/:id  - Actualizar producto');
      Logger.info('   DELETE /api/products/:id  - Eliminar producto (lógico)');
      Logger.info('   GET    /api/health        - Estado del servidor y BD');
      Logger.info('');
      Logger.info('🔍 Parámetros de consulta disponibles:');
      Logger.info('   ?page=1&limit=10         - Paginación');
      Logger.info('   ?name=iPhone             - Filtrar por nombre');
      Logger.info('   ?category=electronics    - Filtrar por categoría');
      Logger.info('   ?minPrice=100&maxPrice=500 - Filtrar por rango de precio');
      Logger.info('   ?inStock=true            - Filtrar por disponibilidad');
      Logger.info('   ?sortBy=price&sortOrder=asc - Ordenamiento');
      Logger.database(`💾 Base de datos: ${mongoose.connection.name}`);
    });
    
  } catch (error) {
    Logger.error('❌ Error al iniciar servidor:', error);
    process.exit(1);
  }
};

// Manejo de señales para cierre graceful
process.on('SIGINT', async () => {
  Logger.warn('Recibida señal SIGINT, cerrando servidor...');
  await mongoose.connection.close();
  Logger.info('Conexión a MongoDB cerrada');
  process.exit(0);
});

// Iniciar el servidor
startServer();

export default app;