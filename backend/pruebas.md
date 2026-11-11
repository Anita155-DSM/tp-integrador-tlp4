# Pruebas del flujo de tickets → notificaciones

Secuencia manual para verificar el núcleo del backend de punta a punta: crear ticket → suscribir un usuario → cambiar estado → ver la notificación en la bandeja y la línea `[NOTIFICACIÓN]` en consola. Es el mismo recorrido que se muestra en la defensa.

Comandos para **PowerShell** (Windows), usando `Invoke-RestMethod`: arma el JSON a partir de un objeto (`@{...} | ConvertTo-Json`) y ya devuelve la respuesta parseada. El backend corre en el puerto **4000** (ajustar si `API_PORT` es otro).

> **Ojo con `curl.exe -d "{\"...\"}"`:** en Windows PowerShell 5.1 los JSON con espacios (ej. `"Impresora rota"`) llegan cortados al backend y dan error. Por eso los pasos usan `Invoke-RestMethod`.

---

## Prerrequisitos

1. Backend levantado (`npm run dev` desde `backend/`), mostrando conexión + "Seed ejecutado" + puerto.
2. **Base recreada con el seed actual.** El seed solo crea roles si no existen; si la base tiene roles de un seed anterior sin los permisos de tickets/suscripciones/notificaciones, los endpoints van a dar **403** aunque el código esté bien. Recrear antes de probar:

   ```powershell
   docker compose down -v
   docker compose up -d
   # esperar a que Mongo esté "healthy"
   npm run dev
   ```

## Usuarios de prueba (del seed)

| Rol | Email | Contraseña |
|---|---|---|
| admin | admin@tp.com | admin123 |
| operador | operador@tp.com | operador123 |
| usuario | usuario@tp.com | usuario123 |

---

## Paso 0 — Login (operador y usuario)

```powershell
$operador = (Invoke-RestMethod -Method Post http://localhost:4000/api/auth/login -ContentType "application/json" -Body (@{ email = "operador@tp.com"; password = "operador123" } | ConvertTo-Json)).token
$usuario = (Invoke-RestMethod -Method Post http://localhost:4000/api/auth/login -ContentType "application/json" -Body (@{ email = "usuario@tp.com"; password = "usuario123" } | ConvertTo-Json)).token
$operador
```

**Esperado:** la última línea imprime un token largo. Si está vacío, falló el login (puerto o credenciales).

## Paso 1 — El operador crea un ticket

```powershell
$ticket = Invoke-RestMethod -Method Post http://localhost:4000/api/tickets -ContentType "application/json" -Headers @{ Authorization = "Bearer $operador" } -Body (@{ title = "Impresora rota"; description = "No imprime nada" } | ConvertTo-Json)
$ticketId = $ticket.id
$ticket
```

**Esperado:** el ticket con `status: ABIERTO` y un `id`. Queda guardado en `$ticketId`.

## Paso 2 — El usuario se suscribe

```powershell
Invoke-RestMethod -Method Post http://localhost:4000/api/subscriptions -ContentType "application/json" -Headers @{ Authorization = "Bearer $usuario" } -Body (@{ ticketId = $ticketId } | ConvertTo-Json)
```

**Esperado:** el ticket con `isSubscribed: true`.

## Paso 3 — El operador cambia el estado (dispara la notificación)

```powershell
Invoke-RestMethod -Method Patch http://localhost:4000/api/tickets/$ticketId/status -ContentType "application/json" -Headers @{ Authorization = "Bearer $operador" } -Body (@{ status = "EN_PROGRESO" } | ConvertTo-Json)
```

**Esperado:**
- Respuesta: el ticket con `status: EN_PROGRESO`.
- **En la consola del backend** (`npm run dev`): aparece la línea `[NOTIFICACIÓN] ...` (canal consola / Adapter). Es la prueba de que el Observer se disparó.

## Paso 4 — El usuario ve su bandeja

```powershell
$notifs = Invoke-RestMethod http://localhost:4000/api/notifications -Headers @{ Authorization = "Bearer $usuario" }
$notifs
```

**Esperado:** una notificación con `previousStatus: ABIERTO`, `newStatus: EN_PROGRESO`, `read: false` (canal in-app). Queda guardada en `$notifs`.

## Paso 5 — Contador de no leídas

```powershell
Invoke-RestMethod http://localhost:4000/api/notifications/unread-count -Headers @{ Authorization = "Bearer $usuario" }
```

**Esperado:** `count: 1`.

## Paso 6 (opcional) — Marcar como leída

```powershell
Invoke-RestMethod -Method Patch http://localhost:4000/api/notifications/$($notifs[0].id)/read -Headers @{ Authorization = "Bearer $usuario" }
```

**Esperado:** la notificación con `read: true`. Y volver a correr el Paso 5 debería dar `count: 0`.

---

## Pruebas de seguridad (la validación de permisos está en el backend)

Acá se usa `curl.exe -i` porque muestra el código de estado en la primera línea (`Invoke-RestMethod` en cambio tira una excepción con los 4xx).

Sin token → **401**:
```powershell
curl.exe -i http://localhost:4000/api/tickets
```

El usuario común intenta crear un ticket (no tiene `ticket:create`) → **403**:
```powershell
curl.exe -i -X POST http://localhost:4000/api/tickets -H "Content-Type: application/json" -H "Authorization: Bearer $usuario" -d "{}"
```

JSON mal formado → **400** (no 500):
```powershell
curl.exe -i -X POST http://localhost:4000/api/auth/login -H "Content-Type: application/json" -d "{roto"
```

---

## Si algo falla

- **403 inesperado:** casi siempre son los roles sin re-seedear (ver Prerrequisitos). Recrear la base.
- **401 con token:** revisar que el `Authorization: Bearer $token` esté bien y que el token no esté vacío.
- **400 "el cuerpo de la solicitud no es un JSON valido":** el body llegó roto; pasa si se arma el JSON a mano con `curl.exe` en PowerShell (ver la nota del principio).
- **500:** revisar la consola del backend; puede ser un `:id` con formato inválido (CastError) — pendiente de endurecer con un helper de ObjectId.
