# Especificación del frontend Angular

## Objetivo

Crear una interfaz Angular para consultar y administrar las frutas de la API FastAPI.

## Tecnología

- Angular
- TypeScript
- Angular Router
- Reactive Forms
- HttpClient
- API base: `http://localhost:8000`

## Pantallas

### 1. Lista y detalle de frutas

Ruta: `/frutas`

Esta pantalla tendrá tres zonas:

1. Lista de frutas a la izquierda.
2. Información de la fruta seleccionada en el centro.
3. Acciones debajo del detalle.

#### Lista

- Mostrar todas las frutas obtenidas con `GET /frutas`.
- Mostrar al menos el nombre de cada fruta.
- Permitir seleccionar una fruta.
- Resaltar visualmente la fruta seleccionada.
- Si no hay frutas, mostrar un estado vacío informativo.

#### Detalle

- Mostrar el nombre de la fruta seleccionada.
- Mostrar la calificación en tamaño grande.
- Mostrar una escala visual continua entre rojo y verde:
  - 1: rojo.
  - 10: verde.
  - Valores intermedios: degradado entre ambos extremos.

#### Acciones

- Siempre mostrar el botón `Agregar fruta nueva`.
- Mostrar el botón de edición solo cuando existe una fruta seleccionada.
- El botón de edición se mostrará con el texto `Editar información de <nombre>`.
- Ejemplo: `Editar información de Mango`.

#### Comportamiento

- Al seleccionar una fruta, cargar su información en el panel central.
- Al pulsar `Agregar fruta nueva`, navegar a `/frutas/nueva`.
- Al pulsar el botón de edición, navegar a `/frutas/<id>/editar`.

### 2. Formulario de fruta

Rutas:

- `/frutas/nueva`: crear una fruta.
- `/frutas/:id/editar`: editar una fruta existente.

Esta pantalla solo contendrá el formulario y el botón guardar.

#### Campos

- `nombre`: obligatorio, mínimo 1 carácter y máximo 50.
- `calificacion`: obligatoria, entero entre 1 y 10.

#### Creación

- Inicialmente, los campos estarán vacíos o tendrán valores neutros válidos.
- Al guardar, enviar `POST /frutas` con nombre y calificación.
- Usar el modelo `FrutaCrear`.
- Si la operación termina correctamente, volver a `/frutas`.

#### Edición

- Al abrir la pantalla, cargar la fruta mediante `GET /frutas/:id`.
- Permitir modificar tanto el nombre como la calificación.
- Guardar los valores originales para detectar qué campo cambió.
- Después de guardar:
  - Si únicamente cambió la calificación, usar `PATCH /frutas/:id` con únicamente `calificacion`.
  - Si cambió el nombre, usar `PUT /frutas/:id` con el nombre y la calificación actuales.
- Aunque cambien nombre y calificación simultáneamente, usar `PUT`.
- Si no cambió ningún campo, no realizar una petición y volver a `/frutas`.
- Después de una operación exitosa, volver a `/frutas`.

#### Validación

- Mostrar errores debajo o cerca de cada campo.
- No permitir guardar datos inválidos.
- Mostrar un error general si la API responde `404`, `422` o otro fallo.

## API

| Operación | Método | Endpoint |
|---|---|---|
| Listar frutas | `GET` | `/frutas` |
| Obtener fruta | `GET` | `/frutas/:id` |
| Crear fruta | `POST` | `/frutas` |
| Editar solo calificación | `PATCH` | `/frutas/:id` |
| Editar nombre y/o reemplazar información | `PUT` | `/frutas/:id` |

## Estructura Angular propuesta

```text
frontend/
├── src/
│   ├── app/
│   │   ├── core/
│   │   │   └── services/
│   │   │       └── frutas.service.ts
│   │   ├── features/
│   │   │   └── frutas/
│   │   │       ├── paginas/
│   │   │       │   ├── lista-frutas/
│   │   │       │   └── formulario-fruta/
│   │   │       └── modelos/
│   │   │           └── fruta.model.ts
│   │   ├── app.routes.ts
│   │   └── app.component.ts
│   └── spec.md
└── spec.md
```

## Criterios de aceptación

- Existen exactamente dos experiencias visuales: listado/detalle y formulario.
- El detalle ocupa el centro de la pantalla.
- El botón de edición aparece únicamente con una selección.
- El nombre visible del botón incluye el nombre de la fruta seleccionada.
- El formulario valida nombre y calificación.
- Crear usa `POST`.
- Editar únicamente la calificación usa `PATCH`.
- Editar el nombre usa `PUT` con nombre y calificación.
- Ambas operaciones regresan al listado.
- La pantalla maneja la lista vacía y errores de API.
