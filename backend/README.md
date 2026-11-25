# Backend API de Frutas

Implementación CRUD con los endpoints:

- `GET /frutas`
- `POST /frutas`
- `GET /frutas/{id}`
- `PUT /frutas/{id}`
- `PATCH /frutas/{id}`
- `DELETE /frutas/{id}`

## Levantar con Docker Compose

Desde esta carpeta:

```powershell
cd backend
docker compose up --build
```

La API estará disponible en `http://localhost:8000`.

Documentación interactiva:

- Swagger UI: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`

## Probar en Postman

1. Crear: `POST http://localhost:8000/frutas`

```json
{
  "nombre": "Mango",
  "calificacion": 9
}
```

2. Obtener: `GET http://localhost:8000/frutas/1`

3. Reemplazar: `PUT http://localhost:8000/frutas/1`

```json
{
  "nombre": "Mango maduro",
  "calificacion": 10
}
```

4. Actualizar parcialmente: `PATCH http://localhost:8000/frutas/1`

```json
{
  "calificacion": 8
}
```

5. Eliminar: `DELETE http://localhost:8000/frutas/1`

Debe devolver `204` sin contenido. Consultar un id eliminado devuelve `404` con:

```json
{
  "detail": "Fruta no encontrada"
}
```

## Detener

```powershell
docker compose down
```

Para borrar también la base de datos persistida:

```powershell
docker compose down -v
```
