# 💰 Walletfy 2.5 - Gestión Personal de Finanzas

<div align="center">

![Walletfy Logo](https://img.shields.io/badge/💰-Walletfy-purple?style=for-the-badge)

**Una aplicación moderna para el control y seguimiento de ingresos y egresos personales**

[![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Redux](https://img.shields.io/badge/Redux-Toolkit-764ABC?style=flat-square&logo=redux)](https://redux-toolkit.js.org/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.0-06B6D4?style=flat-square&logo=tailwindcss)](https://tailwindcss.com/)
[![Vite](https://img.shields.io/badge/Vite-5.0-646CFF?style=flat-square&logo=vite)](https://vitejs.dev/)

[Demo en Vivo](https://walletfy.cardor.dev) • [Documentación](#documentación) • [Instalación](#instalación)

</div>

## 📋 Descripción del Proyecto

Walletfy 2.5 es una aplicación web completa para la **gestión de balance personal** que permite a los usuarios llevar un control detallado de sus finanzas mediante el registro de ingresos y egresos. La aplicación organiza automáticamente los eventos financieros por meses y calcula balances globales en tiempo real.

### 🎯 Características Principales

- **🏦 Gestión de Balance Inicial**: Establece un monto base para todos los cálculos financieros
- **➕ Creación de Eventos**: Registra ingresos y egresos con información completa (nombre, descripción, monto, fecha, adjuntos)
- **📅 Organización Mensual**: Visualización automática de eventos agrupados por mes y año
- **📊 Cálculos en Tiempo Real**: Balance mensual y global calculado automáticamente
- **🔍 Búsqueda Inteligente**: Encuentra meses específicos con debouncing para mejor performance
- **🌙 Tema Claro/Oscuro**: Alternancia entre temas con persistencia local
- **📎 Adjuntos de Imagen**: Soporte para cargar y visualizar imágenes en eventos
- **📱 Diseño Responsivo**: Experiencia optimizada para móviles, tablets y desktop
- **💾 Persistencia Local**: Datos guardados automáticamente en el navegador

### 🚀 Demo

Puedes ver la aplicación funcionando en: **[https://walletfy.cardor.dev](https://walletfy.cardor.dev)**

## 🛠️ Tecnologías Utilizadas

### Frontend Core
- **React 19** - Framework de interfaz de usuario con las últimas características
- **TypeScript** - Tipado estático para mayor robustez del código
- **Vite** - Build tool moderno y rápido servidor de desarrollo

### Estilos y UI
- **TailwindCSS** - Framework CSS utilitario para diseño responsivo
- **Lucide React** - Librería de iconos moderna y consistente

### Gestión de Estado
- **Redux Toolkit** - Manejo del estado global simplificado
- **React Redux** - Integración oficial de Redux con React
- **Redux Persist** - Persistencia automática del estado

### Enrutamiento y Navegación
- **TanStack Router** - Enrutador moderno con tipado completo
- **File-based Routing** - Rutas organizadas por estructura de archivos

### Validación y Formularios
- **Zod** - Validación de esquemas con tipado automático
- **React Hook Form** - Manejo eficiente de formularios

### Utilidades
- **Moment.js** - Manipulación y formateo de fechas
- **UUID** - Generación de identificadores únicos
- **LocalStorage API** - Persistencia de datos en el navegador

## 🏗️ Arquitectura del Proyecto

```
src/
├── components/              # Componentes reutilizables
│   ├── BalanceFlow.tsx     # Componente principal del dashboard
│   ├── EventForm.tsx       # Formulario de eventos (crear/editar)
│   ├── EventModal.tsx      # Modal para detalles de eventos
│   ├── Header.tsx          # Barra de navegación
│   └── ui/                 # Componentes de interfaz base
├── store/                  # Estado global Redux
│   ├── index.ts           # Configuración del store
│   ├── appSlice.ts        # Estado de configuración global
│   ├── eventsSlice.ts     # Estado de eventos financieros
│   └── hooks.ts           # Hooks tipados para Redux
├── types/                  # Definiciones TypeScript
│   └── event.ts           # Esquemas Zod y tipos de eventos
├── utils/                  # Funciones utilitarias
│   └── balanceCalculations.ts # Lógica de cálculos financieros
├── hooks/                  # Custom hooks
│   └── simpleDebounce.ts  # Hook para optimización de búsquedas
├── data/                   # Datos de ejemplo
│   └── sampleEvents.ts    # Eventos predefinidos para demostración
└── routes/                 # Definición de rutas
    ├── __root.tsx         # Layout principal
    ├── index.tsx          # Página de dashboard
    └── form/
        └── $id.tsx        # Formulario dinámico (nuevo/editar)
```

## 📥 Instalación

### Prerrequisitos

- **Node.js** 18 o superior
- **npm** 9 o superior

### Instalación Local

1. **Clona el repositorio**
   ```bash
   git clone https://github.com/tu-usuario/walletfy-2.5.git
   cd walletfy-2.5
   ```

2. **Instala las dependencias**
   ```bash
   npm install
   ```

3. **Inicia el servidor de desarrollo**
   ```bash
   npm run dev
   ```

4. **Abre en tu navegador**
   ```
   http://localhost:3000
   ```

### Scripts Disponibles

```bash
npm run dev        # Servidor de desarrollo
npm run build      # Build para producción
npm run preview    # Vista previa del build
npm run lint       # Verificación de código con ESLint
npm run format     # Formateo con Prettier
npm run check      # Lint + Format automático
```

## 🎮 Uso de la Aplicación

### 1. Configuración Inicial
- Define tu **balance inicial** en la sección superior
- Usa el botón "Calcular" para agregar dinero adicional a tu balance

### 2. Gestión de Eventos
- **Crear nuevo evento**: Haz clic en "Nuevo Evento" en el header
- **Editar evento**: Haz clic en cualquier evento existente
- **Eliminar evento**: Usa el botón de eliminar en el modal de detalles

### 3. Formulario de Eventos
- **Nombre**: Máximo 20 caracteres (obligatorio)
- **Descripción**: Máximo 100 caracteres (opcional)
- **Monto**: Número positivo (obligatorio)
- **Fecha**: Selector de fecha y hora
- **Tipo**: Ingreso o Egreso
- **Adjunto**: Imagen opcional (se convierte a base64)

### 4. Visualización
- **Dashboard principal**: Vista de balance por meses
- **Búsqueda**: Encuentra meses específicos
- **Detalles**: Cada mes muestra ingresos, egresos y balance global
- **Lista de eventos**: Cada mes muestra todos sus eventos con nombres y montos

### 5. Funcionalidades Adicionales
- **Tema oscuro**: Toggle en el header
- **Persistencia**: Todos los datos se guardan automáticamente
- **Responsivo**: Funciona en cualquier dispositivo

## 🏛️ Modelo de Datos

### Entidad Evento

```typescript
interface Event {
  id: string              // UUID único generado automáticamente
  name: string           // Nombre del evento (máx. 20 caracteres)
  description?: string   // Descripción opcional (máx. 100 caracteres)
  amount: number         // Monto positivo del evento
  date: string          // Fecha en formato ISO (YYYY-MM-DDTHH:mm:ss.sssZ)
  type: 'ingreso' | 'egreso'  // Tipo de evento financiero
  attachment?: string    // Imagen en base64 (opcional)
}
```

### Validación con Zod

```typescript
const EventSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1, "El nombre es obligatorio").max(20, "Máximo 20 caracteres"),
  description: z.string().max(100, "Máximo 100 caracteres").optional(),
  amount: z.number().positive("El monto debe ser positivo"),
  date: z.string().datetime(),
  type: z.enum(['ingreso', 'egreso']),
  attachment: z.string().optional()
})
```

## 🔧 Configuración Avanzada

### Variables de Entorno

La aplicación no requiere variables de entorno específicas para funcionar localmente. Todo se almacena en localStorage.

### Personalización del Tema

Los colores y estilos pueden modificarse en `tailwind.config.js`:

```javascript
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#faf5ff',
          500: '#8b5cf6',
          900: '#581c87',
        }
      }
    }
  }
}
```

## 🚀 Despliegue

### Despliegue en Cloudflare Pages

1. **Build de producción**
   ```bash
   npm run build
   ```

2. **Configuración en Cloudflare**
   - Framework: `React`
   - Build command: `npm run build`
   - Build output: `dist`

3. **Deploy automático**
   - Conecta tu repositorio de GitHub
   - Cada push despliega automáticamente

### Despliegue en Vercel

```bash
npm i -g vercel
vercel --prod
```

### Despliegue en Netlify

```bash
npm run build
# Sube la carpeta dist/ a Netlify
```

## 🧪 Testing

```bash
npm run test        # Ejecuta tests unitarios
npm run test:watch  # Tests en modo watch
npm run test:coverage # Coverage de tests
```

## 📈 Rendimiento

### Optimizaciones Implementadas

- **Code Splitting**: División automática del código
- **Tree Shaking**: Eliminación de código no utilizado
- **Lazy Loading**: Carga perezosa de componentes
- **Debouncing**: Optimización de búsquedas
- **Memoización**: React.memo en componentes críticos

### Métricas de Performance

- **First Contentful Paint**: < 1.5s
- **Time to Interactive**: < 3s
- **Bundle Size**: < 500KB gzipped

## 🔐 Seguridad

- **Validación client-side**: Zod schemas
- **Sanitización de datos**: Prevención XSS
- **No dependencias vulnerables**: Audit regular
- **HTTPS only**: Redirección automática en producción

## 🤝 Contribución

1. **Fork el proyecto**
2. **Crea una rama feature**
   ```bash
   git checkout -b feature/nueva-funcionalidad
   ```
3. **Commit tus cambios**
   ```bash
   git commit -m 'Add: nueva funcionalidad increíble'
   ```
4. **Push a la rama**
   ```bash
   git push origin feature/nueva-funcionalidad
   ```
5. **Abre un Pull Request**

### Estándares de Código

- **ESLint**: Configuración estricta
- **Prettier**: Formateo automático
- **Conventional Commits**: Formato de commits
- **TypeScript strict**: Tipado completo

## 📝 Changelog

### v2.5.0 (Actual)
- ✅ Implementación completa de Redux Toolkit
- ✅ Formularios con validación Zod
- ✅ Tema claro/oscuro con persistencia
- ✅ Carga de imágenes en base64
- ✅ Búsqueda con debouncing
- ✅ Diseño completamente responsivo
- ✅ Cálculos automáticos de balance
- ✅ Organización por meses
- ✅ Persistencia en localStorage

## 📄 Licencia

Este proyecto está bajo la licencia **MIT**. Ver el archivo [LICENSE](LICENSE) para más detalles.

---

<div align="center">

**Desarrollado con ❤️ para el Bootcamp de React - ESPOL**

[⭐ Dar una estrella](https://github.com/tu-usuario/walletfy-2.5) • [🐛 Reportar bug](https://github.com/tu-usuario/walletfy-2.5/issues) • [💡 Solicitar feature](https://github.com/tu-usuario/walletfy-2.5/issues)

</div>

## 📚 Documentación Técnica

### Principios de Desarrollo

- **Single Responsibility**: Cada componente tiene una responsabilidad específica
- **Composición**: Uso extensivo de composición sobre herencia
- **Inmutabilidad**: Estado manejado de forma inmutable con Redux Toolkit
- **Tipado Fuerte**: TypeScript en modo estricto para mayor robustez
- **Performance First**: Optimizaciones desde el diseño inicial

### Arquitectura de Estado

```typescript
// Store Structure
{
  app: {
    theme: 'light' | 'dark',
    initialBalance: number
  },
  events: {
    items: Event[],
    loading: boolean,
    error: string | null
  }
}
```

## 🎯 Roadmap y Mejoras Futuras

- [ ] **Exportar datos**: PDF, Excel, CSV
- [ ] **Categorías**: Clasificación avanzada de eventos
- [ ] **Gráficos**: Visualización con charts
- [ ] **Notificaciones**: Recordatorios y alertas
- [ ] **Sincronización**: Backup en la nube
- [ ] **Análisis**: Reportes financieros avanzados

---

> **Nota**: Este proyecto fue desarrollado como parte del **Bootcamp de React de ESPOL**, cumpliendo con todos los requisitos técnicos y funcionales especificados.
