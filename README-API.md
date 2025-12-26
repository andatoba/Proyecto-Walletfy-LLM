# API de Productos con MongoDB - Walletfy

## 📋 Descripción

API REST completa para gestión de productos con persistencia en MongoDB utilizando Mongoose. Incluye paginación, filtros, ordenamiento y eliminación lógica.

## 🚀 Configuración Inicial

### Prerrequisitos
- Node.js v16 o superior
- MongoDB (local o remoto)

### Variables de entorno (seguridad)
Define llaves para control de acceso:
```bash
export WALLETFY_READ_KEY="clave-lectura"
export WALLETFY_WRITE_KEY="clave-escritura"
```

### Instalación
```bash
# Clonar el repositorio
git clone https://github.com/andatoba/Proyecto-Walletfy-LLM.git
cd Proyecto-Walletfy-LLM

# Instalar dependencias
npm install

# Iniciar MongoDB (si es local)
mongod

# Ejecutar el servidor
npm run backend:mongodb
```

## 🌐 Endpoints

### Base URL: `http://localhost:3030`

Todas las solicitudes requieren `x-api-key` (o `Authorization: Bearer <token>`).

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/products` | Listar productos con filtros y paginación |
| GET | `/api/products/:id` | Obtener producto por ID |
| POST | `/api/products` | Crear nuevo producto |
| PUT | `/api/products/:id` | Actualizar producto |
| DELETE | `/api/products/:id` | Eliminar producto (lógico) |
| GET | `/api/health` | Estado del servidor y base de datos |

## 🔍 Parámetros de Consulta (GET /api/products)

### Paginación
- `page`: Número de página (default: 1)
- `limit`: Productos por página (default: 10, máximo: 100)

### Filtros
- `name`: Filtrar por nombre (búsqueda parcial, case insensitive)
- `category`: Filtrar por categoría exacta
- `minPrice`: Precio mínimo
- `maxPrice`: Precio máximo
- `inStock`: Disponibilidad (true/false)

### Ordenamiento
- `sortBy`: Campo para ordenar (name, price, category, createdAt, updatedAt)
- `sortOrder`: Dirección (asc/desc, default: desc)

### Ejemplos de Consultas
```bash
# Obtener productos de electrónicos ordenados por precio
GET /api/products?category=electronics&sortBy=price&sortOrder=asc

# Buscar productos con "iPhone" en el nombre
GET /api/products?name=iPhone

# Productos entre $100 y $500, página 2
GET /api/products?minPrice=100&maxPrice=500&page=2&limit=5

# Solo productos en stock
GET /api/products?inStock=true
```

## 📝 Estructura del Producto

```json
{
  "id": "ObjectId",
  "name": "string (1-50 chars, requerido)",
  "description": "string (0-200 chars, opcional)",
  "price": "number (positivo, requerido)",
  "category": "enum (requerido)",
  "imageUrl": "string (URL válida, opcional)",
  "inStock": "boolean (default: true)",
  "createdAt": "ISO Date",
  "updatedAt": "ISO Date"
}
```

### Categorías Válidas
- `electronics`
- `clothing`
- `food`
- `services`
- `books`
- `home`
- `transportation`
- `health`
- `entertainment`
- `other`

## 📋 Ejemplos de Uso

### 1. Crear Producto
```bash
POST /api/products
Content-Type: application/json

{
  "name": "iPad Air",
  "description": "Tablet ligera con chip M1",
  "price": 599.99,
  "category": "electronics",
  "imageUrl": "https://example.com/ipad-air.jpg",
  "inStock": true
}
```

### 2. Actualizar Producto
```bash
PUT /api/products/64a1b2c3d4e5f6789012345
Content-Type: application/json

{
  "price": 549.99,
  "inStock": false
}
```

### 3. Obtener Productos con Paginación
```bash
GET /api/products?page=1&limit=5&sortBy=price&sortOrder=asc
```

### 4. Filtrar por Categoría y Precio
```bash
GET /api/products?category=electronics&minPrice=200&maxPrice=800
```

## 📊 Respuestas de la API

### Respuesta Exitosa (Lista)
```json
{
  "success": true,
  "data": [...],
  "pagination": {
    "currentPage": 1,
    "totalPages": 3,
    "totalItems": 25,
    "itemsPerPage": 10,
    "hasNextPage": true,
    "hasPrevPage": false
  },
  "filters": {...},
  "message": "10 productos encontrados"
}
```

### Respuesta Exitosa (Individual)
```json
{
  "success": true,
  "data": {...},
  "message": "Producto obtenido exitosamente"
}
```

### Respuesta de Error
```json
{
  "success": false,
  "error": "Descripción del error"
}
```

## 🗄️ Base de Datos

### Configuración MongoDB
- **Base de datos**: `walletfy_products`
- **Colección**: `products`
- **Puerto por defecto**: `27017`

### Índices Creados
- `name` (1)
- `category` (1)  
- `price` (1)
- `inStock` (1)
- `isDeleted` (1)

### Eliminación Lógica
Los productos eliminados no se borran físicamente. Se marca el campo `isDeleted: true` y se filtran automáticamente de las consultas.

## 🔍 Health Check

### GET /api/health
Retorna información del estado del servidor y base de datos:

```json
{
  "success": true,
  "data": {
    "status": "OK",
    "timestamp": "2025-09-22T...",
    "server": {
      "uptime": 3600,
      "memory": {...},
      "nodeVersion": "v22.17.1"
    },
    "database": {
      "status": "connected",
      "connected": true,
      "host": "localhost",
      "name": "walletfy_products",
      "productCount": 25,
      "collections": 2,
      "dataSize": "0.45 MB",
      "storageSize": "1.23 MB"
    }
  },
  "message": "Servidor funcionando correctamente"
}
```

## 📝 Logger Personalizado

El servidor incluye un sistema de logging con colores:
- **INFO** (Cyan): Información general
- **SUCCESS** (Verde): Operaciones exitosas
- **WARN** (Amarillo): Advertencias
- **ERROR** (Rojo): Errores
- **DATABASE** (Magenta): Operaciones de BD
- **REQUEST** (Colores según status): Logs de peticiones HTTP

## ⚡ Códigos de Estado HTTP

- `200` - OK
- `201` - Creado
- `400` - Solicitud incorrecta (validación)
- `404` - No encontrado
- `500` - Error interno del servidor
- `503` - Servicio no disponible (problemas de BD)

## 🛠️ Desarrollo

```bash
# Servidor con memoria (Tarea 1)
npm run backend

# Servidor con MongoDB (Tarea 2)
npm run backend:mongodb

# Frontend
npm run dev
```
