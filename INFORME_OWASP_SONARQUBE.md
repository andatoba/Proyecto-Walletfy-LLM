# Informe de Evaluacion OWASP Top 10 (A1-A3) y SonarQube

## Portada
- Curso: [COMPLETAR]
- Docente: Eduardo Cruz
- Estudiante: [COMPLETAR]
- Proyecto: Walletfy - Gestion Personal de Finanzas
- Fecha: [COMPLETAR]
- Repositorio: [COMPLETAR]

## Resumen ejecutivo
Se evaluo la aplicacion Walletfy (frontend y backend) con foco en OWASP Top 10 A1-A3, usando los criterios de los laboratorios secDevLabs. Se identificaron riesgos de control de acceso e inyeccion, se aplicaron correcciones y se definieron pruebas de verificacion. Ademas, se analizo la calidad de codigo con enfoque SonarQube y se aplicaron remediaciones basicas.

## Objetivos
### Objetivo general
- Evaluar y mitigar vulnerabilidades A1-A3 en el proyecto Walletfy, y mejorar la calidad del codigo segun SonarQube.

### Objetivos especificos
- Revisar endpoints del backend y el flujo del chat.
- Aplicar controles de acceso y sanitizacion.
- Documentar evaluacion inicial, correccion y evaluacion posterior.
- Analizar calidad de codigo y remediar incidentes.

## Alcance
- Frontend: React + TypeScript (`src/`).
- Backend: Node/Express (`products-server.js`, `products-server-mongodb.js`, `chat-server.mjs`).
- Function serverless: Cloudflare Pages (`functions/_middleware.js`).

## Metodologia
- Inspeccion de codigo y pruebas basicas de endpoints.
- Criterios basados en laboratorios secDevLabs (A1-A3).
- Verificacion mediante pruebas automatizadas (A1-A3) y checklist manual.
- Analisis de calidad con SonarQube (scanner).

## Evaluacion OWASP A1-A3

### A1 - Broken Access Control
**Evaluacion inicial**
- Vulnerabilidad: endpoints de productos y chat sin autenticacion/autorizacion.
- Riesgo: cualquier cliente podia leer, crear, modificar o eliminar datos.

**Correccion aplicada**
- Control por API key con roles lectura/escritura.
- Headers requeridos: `x-api-key` o `Authorization: Bearer <token>`.
- Variables de entorno:
  - `WALLETFY_READ_KEY`
  - `WALLETFY_WRITE_KEY`
  - `WALLETFY_CHAT_KEY`
- El frontend del chat envia `VITE_CHAT_API_KEY`.

**Evaluacion posterior**
- Sin key: 401.
- Key invalida: 403.
- Escritura solo con key de escritura; lectura con key de lectura/escritura.

**Evidencia**
- Archivos: `products-server.js`, `products-server-mongodb.js`, `chat-server.mjs`, `functions/_middleware.js`.

### A2 - Cryptographic Failures
**Evaluacion inicial**
- Datos de usuario en `localStorage` sin cifrado.
- En desarrollo se usa HTTP local; en produccion se asume HTTPS.

**Correccion aplicada**
- No se aplico cifrado en este alcance porque no se manejan cuentas ni datos sensibles en servidor.

**Evaluacion posterior**
- Riesgo aceptado con recomendacion de mejora:
  - Migrar datos sensibles a backend y cifrar en reposo/transito.
  - Usar TLS y politicas de seguridad (CSP, HSTS) en despliegue.

**Evidencia**
- Documentacion del alcance y recomendaciones en este informe.

### A3 - Injection
**Evaluacion inicial**
- Entrada sin sanitizacion en `req.body` y `req.query`.
- Riesgo de NoSQL injection por operadores `$` o keys con `.`.
- Riesgo de regex abuse en filtros por `name`.

**Correccion aplicada**
- Sanitizacion recursiva para remover `$` y `.` en body/query.
- Escape de regex y limite de longitud en busqueda.
- Whitelist de campos permitidos en create/update.
- Limite de payload con `express.json({ limit: '100kb' })`.

**Evaluacion posterior**
- Operadores NoSQL bloqueados.
- Filtros usan regex escapado.
- Payloads invalidos son rechazados.

**Evidencia**
- Archivos: `products-server.js`, `products-server-mongodb.js`.

## Analisis de calidad de codigo (SonarQube)
### Configuracion y ejecucion
1) Crear `sonar-project.properties`:
```properties
sonar.projectKey=walletfy
sonar.projectName=Walletfy
sonar.sources=src,products-server.js,products-server-mongodb.js,chat-server.mjs,functions
sonar.exclusions=**/node_modules/**,**/dist/**,**/public/**
sonar.javascript.lcov.reportPaths=coverage/lcov.info
```
2) Ejecutar:
```bash
sonar-scanner
```

### Hallazgos (completar con el reporte)
- Bugs: [COMPLETAR]
- Vulnerabilidades: [COMPLETAR]
- Code Smells: [COMPLETAR]
- Security Hotspots: [COMPLETAR]

### Remediaciones aplicadas
- Tipado estricto en chat y `MonthCard`.
- Eliminacion de `console.log` en formulario de eventos.
- Manejo de errores con `unknown` seguro.

### Reevaluacion posterior
- [COMPLETAR: resultados despues de corregir y re-ejecutar SonarQube]

## Pruebas de verificacion A1-A3
Se agrego una prueba automatizada:
```bash
npm run test:security
```
Archivo: `tests/owasp-a1-a3.test.ts`

## Conclusiones
- Se corrigieron los principales riesgos A1 y A3 mediante control de acceso y sanitizacion.
- A2 queda como riesgo aceptado dado el alcance local.
- Se mejoro la mantenibilidad del codigo y se dejaron pruebas para verificacion.

## Anexos / Evidencias
- `products-server-mongodb.js`
- `products-server.js`
- `chat-server.mjs`
- `functions/_middleware.js`
- `src/components/chat/ChatInterface.tsx`
- `src/components/chat/ConfigurationPanel.tsx`
- `src/components/MonthCard.tsx`
- `src/components/EventForm.tsx`
- `README-API.md`
- `README-CHAT.md`
