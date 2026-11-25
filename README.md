# CRUD de Frutas

Monorepo para una API de frutas construida con FastAPI y un frontend que se podrá añadir posteriormente.

## Estructura

```text
crudPython/
├── backend/       # API FastAPI + SQLite
├── frontend/      # Aplicación frontend (pendiente de implementación)
├── openAPI/       # Contrato OpenAPI
└── sonarqube/     # Infraestructura local de análisis
```

## Backend

Desde `backend`:

```powershell
docker compose up --build
```

La API estará disponible en `http://localhost:8000` y Swagger UI en `http://localhost:8000/docs`.

## SonarQube local

```powershell
cd sonarqube
docker compose up -d
```

Abre `http://localhost:9000`. El usuario inicial es `admin` y deberás cambiar la contraseña en el primer acceso.

Después crea un token de proyecto y un proyecto local llamado `crud-frutas`, y ejecuta:

```powershell
cd ..
.\sonarqube\run-analysis.ps1 -Token "TU_TOKEN"
```
