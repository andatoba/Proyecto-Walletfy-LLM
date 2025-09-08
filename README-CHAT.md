# 🤖 Walletfy AI - Asistente de Chat Inteligente y Contextualizado

## 📋 Descripción del Proyecto

Extensión de la aplicación web Walletfy que integra un **asistente de chat conversacional inteligente**. El asistente utiliza los datos financieros específicos del usuario para proporcionar análisis personalizados, consejos y respuestas contextualizadas sobre sus finanzas.

## ✅ Funcionalidades Implementadas

### 1. 🎯 Integración de Componente de Chat con LLM
- ✅ **Interfaz de chat intuitiva y moderna** con diseño responsive
- ✅ **Motor conversacional** impulsado por LLM con servidor de prueba personalizado
- ✅ **Comunicación asíncrona** usando React Query para gestión de estado
- ✅ **Manejo de errores** y estados de carga elegantes

### 2. 📊 Contextualización de Datos de la Aplicación
- ✅ **Objeto JSON estructurado y optimizado** con datos de Walletfy:
  ```json
  {
    "initialBalance": 3000,
    "currentBalance": 2850.75,
    "totalEvents": 15,
    "totalIncome": 2500.00,
    "totalExpenses": 2649.25,
    "monthlyData": [...],
    "recentEvents": [...]
  }
  ```
- ✅ **Contextualización automática** que incluye:
  - Balance inicial y actual del usuario
  - Totales de ingresos y gastos
  - Datos mensuales detallados con balances acumulados
  - Últimas 10 transacciones con fechas y detalles

### 3. ⚡ Gestión Inteligente de la Carga del Modelo
- ✅ **Estado de carga** visual mientras se prepara el contexto
- ✅ **Deshabilitación automática** del input hasta que el contexto esté listo
- ✅ **Información del estado** mostrada en el header (balance actual, eventos totales)

### 4. 🔄 Interacción Asíncrona con el LLM
- ✅ **Envío asíncrono** de consultas sin bloquear la UI
- ✅ **Indicadores de progreso** personalizados ("Analizando tus datos financieros...")
- ✅ **Manejo de timeouts** configurables según el nivel de razonamiento
- ✅ **Respuestas completas** tras único envío

### 5. ⚙️ Personalización del Comportamiento del LLM
- ✅ **System prompt especializado** para finanzas personales
- ✅ **Panel de configuración completo** con controles para:
  - **Temperatura** (0-2): Control de creatividad vs precisión
  - **Top-P** (0-1): Sampling de probabilidad núcleo
  - **Top-K** (0-20): Sampling por cantidad de tokens
  - **Reasoning Effort** (minimal/low/medium/high): Nivel de análisis
  - **Max Tokens**: Límite de respuesta
  - **API Endpoint**: URL configurable del servidor
  - **System Prompt**: Instrucciones editables para el modelo

### 6. 🎮 Usabilidad y Control del Chat
- ✅ **Botón "Limpiar Chat"** para resetear conversación
- ✅ **Navegación integrada** desde el header principal
- ✅ **Mensajes con timestamps** y avatares diferenciados
- ✅ **Interfaz responsive** optimizada para móviles y desktop
- ✅ **Sugerencias de uso** mostradas al iniciar

## 🛠️ Arquitectura Técnica

### Frontend (React + TypeScript)
```
src/components/chat/
├── ChatInterface.tsx      # Componente principal del chat
├── ConfigurationPanel.tsx # Panel de configuración del LLM
```

### Backend (Node.js + Express)
```
chat-server.mjs           # Servidor de chat con respuestas inteligentes
```

### Tecnologías Utilizadas
- **React 19** con TypeScript
- **TanStack Router** para navegación
- **TanStack Query** para gestión de estado asíncrono
- **Redux Toolkit** para estado global
- **Tailwind CSS** para estilos
- **Express.js** para el servidor de chat
- **Lucide React** para iconografía

## 🚀 Cómo Ejecutar el Proyecto

### 1. Instalar dependencias
```bash
npm install
```

### 2. Iniciar el servidor de desarrollo (Frontend)
```bash
npm start
# Se ejecuta en http://localhost:3000
```

### 3. Iniciar el servidor de chat (Backend)
```bash
node chat-server.mjs
# Se ejecuta en http://localhost:4000
```

### 4. Acceder al chat
- Navega a http://localhost:3000
- Haz clic en el botón "Chat IA" en el header
- ¡Comienza a hacer preguntas sobre tus finanzas!

## 💡 Ejemplos de Uso del Chat

### Consultas de Balance
- "¿Cuál es mi balance actual?"
- "¿Cuánto dinero tengo disponible?"

### Análisis de Gastos
- "¿En qué he gastado más dinero?"
- "Muéstrame mis gastos recientes"
- "¿Cuáles son mis patrones de gasto?"

### Consejos Financieros
- "Dame consejos para mejorar mis finanzas"
- "¿Cómo puedo ahorrar más dinero?"
- "¿Mi ratio de gastos es saludable?"

### Análisis Mensual
- "¿Cómo han sido mis finanzas este mes?"
- "Compara mis ingresos y gastos mensuales"
- "¿Cuál fue mi mejor mes financiero?"

## 🎯 Características Destacadas

### ✅ Implementadas
1. **Respuestas Contextualizadas**: El chat conoce tus datos reales de Walletfy
2. **Análisis Inteligente**: Detecta patrones y proporciona insights personalizados
3. **Configuración Avanzada**: Control total sobre el comportamiento del LLM
4. **UX Optimizada**: Interfaz moderna y estados de carga elegantes
5. **Integración Perfecta**: Navegación fluida desde la app principal

### 🔄 Punto Extra (Próxima Implementación)
- **Streaming de Respuestas**: Recepción de respuestas en tiempo real por chunks

## 📊 Validación de Cumplimiento

| Requisito | Estado | Detalles |
|-----------|--------|----------|
| Interfaz de Chat Intuitiva | ✅ | Diseño moderno con avatares y timestamps |
| Motor Conversacional LLM | ✅ | Servidor personalizado con validaciones |
| Contextualización de Datos | ✅ | JSON optimizado con datos de Walletfy |
| Gestión de Carga del Modelo | ✅ | Estados de carga y contexto |
| Interacción Asíncrona | ✅ | React Query + indicadores de progreso |
| Personalización del LLM | ✅ | Panel completo de configuración |
| Control de Usabilidad | ✅ | Limpiar chat + navegación integrada |
| Streaming de Respuestas | 🔄 | Preparado para implementación futura |

## 🔧 Configuración Avanzada

El proyecto incluye validaciones completas para todos los parámetros del LLM:
- Validación de rangos para temperatura, top-p, top-k
- Exclusión mutua entre top-p y top-k
- Validación de reasoning effort levels
- Timeouts adaptativos según el nivel de razonamiento

## 📈 Próximas Mejoras

1. **Implementar streaming de respuestas** con Server-Sent Events
2. **Integración con OpenAI API** real (actualmente usa servidor de prueba)
3. **Soporte para WebLLM** para ejecución local
4. **Historial de conversaciones** persistente
5. **Exportar conversaciones** en formato PDF/texto

---

**Desarrollado por**: Wellington  
**Fecha**: Septiembre 2025  
**Versión**: 1.0.0
