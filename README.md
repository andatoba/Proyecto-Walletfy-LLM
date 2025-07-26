# 💰 Walletfy - Gestión Personal de Finanzas

> **Una aplicación sencilla para controlar tus ingresos y gastos**

[![React](https://img.shields.io/badge/React-19-blue)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-✓-blue)](https://www.typescriptlang.org/)
[![Redux](https://img.shields.io/badge/Redux-✓-purple)](https://redux-toolkit.js.org/)

**🚀 [Ver Demo](https://walletfy.cardor.dev)**

---

## � ¿Qué es Walletfy?

Walletfy es una aplicación web que te ayuda a:
- ✅ Llevar control de tu dinero
- ✅ Registrar ingresos y gastos
- ✅ Ver tu balance por meses
- ✅ Buscar transacciones específicas

**¡Todo se guarda automáticamente en tu navegador!**

---

## 🎯 Funcionalidades Principales

### 💵 Balance Inicial
- Define cuánto dinero tienes al empezar
- Agrega dinero extra cuando necesites

### 📝 Crear Eventos
- **Ingresos**: Cuando recibes dinero (salario, ventas, etc.)
- **Gastos**: Cuando gastas dinero (comida, transporte, etc.)
- Puedes agregar:
  - Nombre del evento (máximo 20 caracteres)
  - Descripción opcional
  - Monto
  - Fecha y hora
  - Foto como comprobante

### � Visualización
- Tus eventos se organizan automáticamente por mes
- Cada mes muestra:
  - Total de ingresos (verde)
  - Total de gastos (rojo)
  - Balance final del mes
  - Lista de todos los eventos

### 🔍 Búsqueda
- Busca meses específicos escribiendo el nombre
- Ejemplo: "Enero", "Diciembre 2024", etc.

### 🌙 Tema Oscuro/Claro
- Cambia entre tema claro y oscuro
- Se recuerda tu preferencia

---

## 🛠️ Tecnologías Usadas

**Frontend:**
- React 19 (interfaz de usuario)
- TypeScript (código más seguro)
- TailwindCSS (estilos bonitos)

**Estado:**
- Redux Toolkit (manejo de datos)
- LocalStorage (guardar información)

**Otros:**
- Vite (herramientas de desarrollo)
- TanStack Router (navegación entre páginas)

## 🚀 Cómo Usar la Aplicación

### Paso 1: Configurar tu balance inicial
1. Abre la aplicación
2. En la parte superior verás **"Balance Inicial Actual"**
3. En **"Agregar dinero"** escribe cuánto dinero tienes
4. Haz clic en **"Calcular"**

### Paso 2: Crear un evento (ingreso o gasto)
1. Haz clic en **"Nuevo Evento"** en la barra superior
2. Llena el formulario:
   - **Nombre**: ¿Qué fue? (ej: "Compra supermercado")
   - **Descripción**: Detalles opcionales
   - **Cantidad**: ¿Cuánto dinero?
   - **Fecha**: ¿Cuándo pasó?
   - **Tipo**: ¿Ingreso o Egreso?
   - **Foto**: Opcional (recibo, comprobante)
3. Haz clic en **"Crear Evento"**

### Paso 3: Ver tus eventos
- En la página principal verás tarjetas por cada mes
- Cada tarjeta muestra:
  - Ingresos totales del mes
  - Gastos totales del mes
  - Balance final acumulado
  - Lista de todos los eventos

### Paso 4: Editar o eliminar eventos
- **Para ver detalles**: Haz clic en cualquier evento
- **Para editar**: Haz clic en el ícono del lápiz (azul)
- **Para eliminar**: Haz clic en el ícono de la basura (rojo)

### Paso 5: Buscar eventos
- Usa la barra de búsqueda para encontrar meses específicos
- Escribe: "Enero", "Diciembre 2024", etc.

---

## � Instalación para Desarrolladores

### Requisitos
- Node.js versión 18 o superior
- npm (viene con Node.js)

### Pasos de instalación

1. **Descargar el proyecto**
   ```bash
   git clone https://github.com/andatoba/ProyectReactWall.git
   cd ProyectReactWall
   ```

2. **Instalar dependencias**
   ```bash
   npm install
   ```

3. **Ejecutar en modo desarrollo**
   ```bash
   npm run dev
   ```

4. **Abrir en tu navegador**
   ```
   http://localhost:3000
   ```

### Comandos disponibles

```bash
npm run dev        # Iniciar servidor de desarrollo
npm run build      # Crear versión para producción
npm run preview    # Ver la versión de producción
```

---

## 📁 Estructura del Proyecto (Para Desarrolladores)

```
src/
├── components/              # Componentes reutilizables
│   ├── BalanceFlow.tsx     # Página principal con resumen
│   ├── EventForm.tsx       # Formulario para crear/editar eventos
│   ├── EventModal.tsx      # Ventana para ver detalles de eventos
│   └── Header.tsx          # Barra de navegación superior
├── store/                  # Manejo del estado (Redux)
│   ├── appSlice.ts        # Configuración general (tema, balance)
│   └── eventsSlice.ts     # Eventos (crear, editar, eliminar)
├── types/                  # Definiciones de TypeScript
│   └── event.ts           # Tipo de datos para eventos
├── utils/                  # Funciones auxiliares
│   └── balanceCalculations.ts # Cálculos de balance
└── routes/                 # Páginas de la aplicación
    ├── index.tsx          # Página principal
    └── form/$id.tsx       # Página del formulario
```

---

## 🎨 Personalización

### Cambiar colores
El archivo `tailwind.config.js` contiene la configuración de colores:

```javascript
// Ejemplo para cambiar el color principal
colors: {
  primary: {
    500: '#8b5cf6',  // Púrpura actual
    // Cambia por: '#3b82f6' para azul
  }
}
```

### Modificar el balance inicial por defecto
En `src/store/appSlice.ts` puedes cambiar:

```typescript
initialState: {
  initialBalance: 0,  // Cambia este número
  theme: 'light'
}
```

---

## 🌐 Despliegue (Subir a Internet)

### Opción 1: Cloudflare Pages (Recomendado)
1. Ve a [Cloudflare Pages](https://pages.cloudflare.com/)
2. Conecta tu repositorio de GitHub
3. Configuración:
   - **Build command**: `npm run build`
   - **Output directory**: `build`
4. ¡Listo! Tendrás una URL pública

### Opción 2: Vercel
1. Ve a [Vercel](https://vercel.com/)
2. Conecta tu repositorio
3. Deploy automático

### Opción 3: Netlify
1. Ve a [Netlify](https://netlify.com/)
2. Arrastra la carpeta `build` después de ejecutar `npm run build`

---

## 🔧 Información Técnica (Para Desarrolladores)

### Datos que maneja la aplicación

**Evento (Event):**
```typescript
{
  id: string              // Identificador único
  name: string           // Nombre (máximo 20 caracteres)
  description?: string   // Descripción opcional (máximo 100 caracteres)
  amount: number         // Cantidad de dinero (siempre positiva)
  date: string          // Fecha en formato ISO
  type: 'ingreso' | 'egreso'  // Tipo de transacción
  attachment?: string    // Imagen en base64 (opcional)
}
```

### Estado de la aplicación (Redux)

```typescript
{
  app: {
    theme: 'light' | 'dark',    // Tema actual
    initialBalance: number       // Balance inicial
  },
  events: {
    items: Event[],             // Lista de eventos
    loading: boolean,           // ¿Está cargando?
    error: string | null        // Mensaje de error si hay
  }
}
```

### Validación de datos

Usamos **Zod** para validar que los datos sean correctos:
- El nombre es obligatorio y máximo 20 caracteres
- La descripción es opcional y máximo 100 caracteres
- El monto debe ser un número positivo
- La fecha debe estar en formato correcto
- El tipo debe ser 'ingreso' o 'egreso'

---

## ❓ Preguntas Frecuentes

### ¿Se pierden mis datos si cierro el navegador?
**No.** Todos tus datos se guardan automáticamente en tu navegador (localStorage).

### ¿Puedo usar la aplicación sin internet?
**Sí.** Una vez que cargas la aplicación, funciona sin internet. Solo necesitas internet para la primera carga.

### ¿En qué dispositivos funciona?
**Todos.** La aplicación es responsiva y funciona en:
- 💻 Computadoras
- 📱 Teléfonos móviles
- 📱 Tablets

### ¿Cómo cambio entre tema claro y oscuro?
Haz clic en el ícono del sol/luna en la barra superior.

### ¿Puedo editar un evento después de crearlo?
**Sí.** Haz clic en el ícono del lápiz (azul) al lado de cualquier evento.

### ¿Puedo eliminar un evento?
**Sí.** Haz clic en el ícono de la basura (rojo) al lado de cualquier evento.

### ¿Hay límite de eventos que puedo crear?
**No.** Puedes crear tantos eventos como quieras.

---

## 🎓 Este Proyecto Fue Creado Para

**Bootcamp de React - ESPOL**

### Lo que aprendí desarrollando Walletfy:
- ✅ **React 19**: Componentes, hooks, estado
- ✅ **TypeScript**: Tipado de datos para código más seguro
- ✅ **Redux Toolkit**: Manejo del estado global
- ✅ **TailwindCSS**: Estilos modernos y responsivos
- ✅ **TanStack Router**: Navegación entre páginas
- ✅ **Zod**: Validación de datos
- ✅ **Vite**: Herramientas de desarrollo modernas
- ✅ **Git & GitHub**: Control de versiones
- ✅ **Despliegue**: Publicar aplicaciones en internet

### Funcionalidades implementadas:
- ✅ CRUD completo (Crear, Leer, Actualizar, Eliminar)
- ✅ Persistencia de datos
- ✅ Búsqueda en tiempo real
- ✅ Diseño responsivo
- ✅ Tema claro/oscuro
- ✅ Validación de formularios
- ✅ Carga de archivos (imágenes)

---

## 🤝 Contribuir al Proyecto

¿Quieres mejorar Walletfy? ¡Genial!

### Para principiantes:
1. **Haz un Fork** del proyecto en GitHub
2. **Clona** tu fork a tu computadora
3. **Crea una rama nueva**:
   ```bash
   git checkout -b mi-nueva-funcionalidad
   ```
4. **Haz tus cambios**
5. **Sube tus cambios**:
   ```bash
   git add .
   git commit -m "Agregué nueva funcionalidad"
   git push origin mi-nueva-funcionalidad
   ```
6. **Crea un Pull Request** en GitHub

### Ideas para contribuir:
- � Agregar gráficos
- 📂 Exportar datos a Excel/PDF
- 🏷️ Sistema de categorías
- 🔔 Recordatorios
- 📱 Mejorar la experiencia móvil

---

## 📄 Licencia

Este proyecto está bajo la licencia **MIT**. Puedes usarlo, modificarlo y compartirlo libremente.

---

## 👨‍💻 Contacto

**Desarrollado por:** [Tu Nombre]
**Para:** Bootcamp de React - ESPOL
**Año:** 2025

**GitHub:** [andatoba/ProyectReactWall](https://github.com/andatoba/ProyectReactWall)

---

<div align="center">

**¡Gracias por usar Walletfy! 💜**

Si te gustó el proyecto, ¡dale una ⭐ en GitHub!

</div>
