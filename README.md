# API REST - Productos (DPS441 Guía 9)

API REST desarrollada con **Node.js + Express + MySQL** para la gestión de usuarios. Implementa buenas prácticas de seguridad como rate limiting, CORS controlado y cabeceras HTTP con Helmet.

## Tecnologías

- Node.js / Express 5
- MySQL2
- Helmet, CORS, Morgan
- express-rate-limit
- dotenv

## Requisitos previos

- Node.js >= 18
- MySQL corriendo localmente

## Instalación

```bash
git clone <url-del-repositorio>
cd Productos
npm install
```

Copia el archivo de entorno y ajusta los valores:

```bash
cp .env.example .env
```

## Variables de entorno

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=tienda
DB_PORT=3306
PORT=3000
CORS_ORIGIN=*
```

## Scripts

| Comando | Descripción |
|---------|-------------|
| `npm run dev` | Servidor en modo desarrollo con nodemon |
| `npm start` | Servidor en producción |

## Endpoints

Base URL: `http://localhost:3000/api/v1`

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/usuarios` | Listar todos los usuarios |
| GET | `/usuarios/:id` | Obtener usuario por ID |
| POST | `/usuarios` | Crear usuario |
| PUT | `/usuarios/:id` | Actualizar usuario |
| DELETE | `/usuarios/:id` | Eliminar usuario |

### Cuerpo para POST / PUT

```json
{
  "usuario": "nombre_usuario",
  "contrasenia": "contraseña123"
}
```

### Formato de respuesta

```json
{
  "success": true,
  "message": "Usuarios obtenidos exitosamente.",
  "data": [ ... ]
}
```

## Estructura del proyecto

```
src/
├── config/
│   ├── database.config.js   # Configuración de conexión MySQL
│   └── database.js          # Pool de conexiones
├── controllers/
│   └── usuarios.controller.js
├── helpers/
│   └── response.js          # Helper estandarizado de respuestas
├── models/
│   └── usuario.model.js
├── routes/
│   ├── index.js
│   └── usuarios.routes.js
└── index.js                 # Entry point
```

## Rate Limiting

La API limita a **1000 solicitudes cada 30 minutos** por IP en todos los endpoints bajo `/api/v1`.
