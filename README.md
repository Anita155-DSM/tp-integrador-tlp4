# tp-integrador-tlp4

**Dominio:** A — Mesa de ayuda **Base de datos:** MongoDB + Mongoose **Organización del backend:** Carpeta por tipo de archivo

## Integrantes

- **PEREZ JACQUELINE, Anahi** 
- **DUARTE OBED, Natanael**

## Descripción

Mesa de ayuda donde se cargan tickets que pasan por los estados `ABIERTO`, `EN_PROGRESO`, `RESUELTO` y `CERRADO`. Los usuarios pueden suscribirse a un ticket y, cada vez que cambia su estado, todos los suscriptores reciben una notificación en la bandeja de la aplicación y se registra una línea en la consola del backend. El acceso a cada acción está controlado por roles y permisos.

## Requisitos previos

- Docker y Docker Compose
- Git
- (Opcional, para desarrollo local) Node.js 22 o superior

## Cómo ejecutar el proyecto

1. Clonar el repositorio:

   ```bash
   git clone https://github.com/Anita155-DSM/tp-integrador-tlp4.git
   cd tp-integrador-tlp4
   ```
2. Crear el archivo de variables de entorno:

   ```bash
   cp .env.example .env
   ```
3. Levantar los servicios:

   ```bash
   docker compose up --build
   ```
4. El seed de roles, permisos y usuarios de prueba se ejecuta automáticamente al arrancar el backend (no hay que correr ningún comando extra).
5. Abrir la aplicación:
   - Frontend: http://localhost:8080
   - API: http://localhost:3000/api

> Si los puertos `3000`, `8080` o `27017` ya están ocupados en la máquina, liberarlos antes de levantar (o cambiar `API_PORT` / `DB_PORT` en `.env`).

### Comandos de Docker útiles

```bash
docker compose up -d          # levantar en segundo plano
docker compose ps             # estado (buscá "healthy")
docker compose logs db        # ver qué dice Mongo
docker compose logs backend   # ver el backend (acá aparecen las líneas [NOTIFICACIÓN])
docker compose config         # ver el compose con las variables ya reemplazadas
docker volume ls              # ver que exista el volumen
docker compose down           # apagar (conserva los datos)
docker compose down -v        # apagar y borrar los datos de Mongo
```

## Ejecución sin Docker (opcional)

Se necesita un MongoDB accesible con el usuario y la contraseña del `.env`. La forma más simple es levantar solo la base con Docker:

```bash
cp .env.example .env
docker compose up -d db
```

Backend (lee el `.env` de la raíz; `DB_HOST` debe ser `localhost`):

```bash
cd backend
npm install
npm run dev
```

Frontend (en otra terminal):

```bash
cd frontend
npm install
npm run dev
```

El frontend queda en http://localhost:5173 y usa `VITE_API_URL` (por defecto `http://localhost:3000/api`).

## Variables de entorno

| Variable | Descripción | Ejemplo |
| --- | --- | --- |
| `DB_HOST` | Host de la base de datos (solo sin Docker; en Compose el backend usa `db`) | `localhost` |
| `DB_PORT` | Puerto de la base de datos | `27017` |
| `DB_USER` | Usuario | `tlp4` |
| `DB_PASSWORD` | Contraseña | `tlp4` |
| `DB_NAME` | Nombre de la base | `tp_integrador` |
| `JWT_SECRET` | Clave para firmar los tokens | `cambiar-esto` |
| `API_PORT` | Puerto del backend | `3000` |
| `VITE_API_URL` | URL de la API para el frontend | `http://localhost:3000/api` |

## Usuarios de prueba

| Rol | Email | Contraseña |
| --- | --- | --- |
| admin | admin@tp.com | admin123 |
| operador | operador@tp.com | operador123 |
| usuario | usuario@tp.com | usuario123 |

Permisos de cada rol:

| Rol | Permisos |
| --- | --- |
| usuario | `ticket:read`, `subscription:create`, `subscription:delete`, `notification:read` |
| operador | los de usuario + `ticket:create`, `ticket:update`, `ticket:change-status` |
| admin | los de operador + `ticket:delete`, `user:read`, `user:assign-role` |

## Cómo probar el flujo de notificaciones

1. Ingresar como `usuario` y suscribirse a un ticket.
2. En otra ventana (o en incógnito), ingresar como `operador` y cambiar el estado de ese ticket.
3. Volver a la sesión de `usuario`: la notificación aparece en la bandeja.
4. Verificar la notificación en la consola del backend:

   ```bash
   docker compose logs backend
   ```

   Debe aparecer una línea como:

   ```
   [NOTIFICACIÓN] Para: usuario@tp.com | Ticket #<id> | Estado: ABIERTO → EN_PROGRESO
   ```

## Endpoints principales

Todas las rutas, salvo `register` y `login`, requieren el header `Authorization: Bearer <token>`. Sin token se responde `401`; sin el permiso, `403`; con un id de formato inválido, `400`.

| Método | Ruta | Permiso requerido |
| --- | --- | --- |
| POST | /api/auth/register | — |
| POST | /api/auth/login | — |
| GET | /api/auth/me | — (solo token) |
| GET | /api/users | user:read |
| PATCH | /api/users/:id/role | user:assign-role |
| GET | /api/tickets | ticket:read |
| POST | /api/tickets | ticket:create |
| GET | /api/tickets/:id | ticket:read |
| PUT | /api/tickets/:id | ticket:update |
| PATCH | /api/tickets/:id/status | ticket:change-status |
| DELETE | /api/tickets/:id | ticket:delete |
| POST | /api/subscriptions | subscription:create |
| DELETE | /api/subscriptions/:ticketId | subscription:delete |
| GET | /api/notifications | notification:read |
| GET | /api/notifications/unread-count | notification:read |
| PATCH | /api/notifications/:id/read | notification:read |

## Patrones y principios SOLID

Ver [PATTERNS.md](./PATTERNS.md).
