# Backend API de Frutas

## Objetivo

Crear un backend CRUD en Python que implemente el contrato definido en `openAPI/frutas-api.yaml`.

## Tecnologías

- Python
- FastAPI
- Uvicorn
- SQLite
- Docker
- Pydantic
- SQLAlchemy o SQLite nativo
- Pytest

## Alcance

El backend deberá exponer las operaciones para crear, listar, consultar, reemplazar, actualizar parcialmente y eliminar frutas.

## Endpoints

| Método | Ruta | Respuesta exitosa | Descripción |
|---|---|---:|---|
| `GET` | `/frutas` | `200` | Lista todas las frutas |
| `POST` | `/frutas` | `201` | Crea una fruta |
| `GET` | `/frutas/{id}` | `200` | Obtiene una fruta por identificador |
| `PUT` | `/frutas/{id}` | `200` | Reemplaza una fruta completa |
| `PATCH` | `/frutas/{id}` | `200` | Actualiza uno o ambos campos |
| `DELETE` | `/frutas/{id}` | `204` | Elimina una fruta |

## Modelo de datos

### Fruta

- `id`: entero, generado por SQLite, únicamente de lectura.
- `nombre`: texto obligatorio, entre 1 y 50 caracteres.
- `calificacion`: entero obligatorio, entre 1 y 10.

### Reglas

- `nombre` debe contener al menos un carácter.
- `calificacion` debe estar dentro del rango permitido.
- `PUT` requiere `nombre` y `calificacion`.
- `PATCH` debe incluir al menos un campo válido.
- Los identificadores deben ser mayores o iguales a 1.
- Si una fruta no existe, se devolverá `404` con el detalle `Fruta no encontrada`.
- Los errores de validación devolverán `422`.
- `DELETE` exitoso no devolverá contenido.

## Persistencia

- La base de datos será SQLite.
- El archivo de la base podrá configurarse mediante una variable de entorno.
- La tabla `frutas` contendrá: `id`, `nombre` y `calificacion`.
- La aplicación deberá crear la tabla al iniciarse si todavía no existe.

## Contrato HTTP

- La API responderá exclusivamente con JSON.
- Los modelos Pydantic deberán reflejar las restricciones del OpenAPI.
- Los métodos deben respetar los códigos HTTP definidos en `openAPI/frutas-api.yaml`.
- FastAPI podrá generar la documentación interactiva en `/docs` y `/redoc`.

## Estructura propuesta

```text
backend/
├── app/
│   ├── __init__.py
│   ├── main.py
│   ├── database.py
│   ├── models.py
│   ├── schemas.py
│   ├── repositories.py
│   └── routers/
│       ├── __init__.py
│       └── frutas.py
├── tests/
├── Dockerfile
├── docker-compose.yml
├── requirements.txt
├── pyproject.toml
└── spec.md
```

## Ejecución local

La aplicación se ejecutará mediante Uvicorn con el puerto `8000`.

```text
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

## Docker

- Se deberá incluir un `Dockerfile` basado en una imagen ligera de Python.
- Se podrá incluir `docker-compose.yml` para facilitar el arranque.
- El contenedor deberá publicar el puerto `8000`.
- El volumen podrá persistir el archivo SQLite fuera del contenedor.

## Pruebas esperadas

- Listar cuando no existan frutas.
- Crear una fruta válida.
- Rechazar nombres vacíos o superiores a 50 caracteres.
- Rechazar calificaciones fuera de 1 a 10.
- Obtener una fruta existente.
- Devolver `404` para identificadores inexistentes.
- Reemplazar una fruta mediante `PUT`.
- Actualizar parcialmente mediante `PATCH`.
- Rechazar un `PATCH` sin campos.
- Eliminar una fruta y comprobar que ya no existe.

## Criterios de aceptación

- Todos los endpoints siguen `openAPI/frutas-api.yaml`.
- Las operaciones CRUD usan SQLite como persistencia.
- La aplicación arranca con Uvicorn.
- El proyecto puede construirse y ejecutarse con Docker.
- Las validaciones coinciden con el contrato OpenAPI.
- Existe cobertura de pruebas para los endpoints principales.
