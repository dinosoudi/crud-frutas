# Frontend Angular de Frutas

Interfaz Angular para administrar frutas mediante la API FastAPI.

## Ejecutar en desarrollo

Desde esta carpeta:

```powershell
npm install
npm start
```

La aplicación estará disponible en `http://localhost:4200`.

El servidor de desarrollo utiliza `proxy.conf.json` para reenviar `/api` al backend de `http://localhost:8000`.

## Funcionalidad

- `/frutas`: lista y detalle de frutas.
- `/frutas/nueva`: creación de una fruta.
- `/frutas/:id/editar`: edición y eliminación de una fruta.
- La lista lateral tiene desplazamiento vertical independiente.
- La calificación usa una escala visual de rojo a verde.
- El botón rojo permite eliminar la fruta seleccionada.

## Ejecutar con Docker

Desde la raíz del monorepo:

```powershell
docker compose up --build
```

Frontend: `http://localhost:4200`

Backend: `http://localhost:8000`

## Build y pruebas

```powershell
npm run build
npm test
```
