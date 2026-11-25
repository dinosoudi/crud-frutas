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

## Pruebas unitarias

Instalar las dependencias de desarrollo y ejecutar las pruebas desde `backend`:

```powershell
python -m pip install -r requirements-dev.txt
python -m pytest
```

Las pruebas cubren los seis endpoints CRUD, validaciones y respuestas de error. El resultado actual es 17 pruebas aprobadas y 98 % de cobertura de código.

## SonarQube local

```powershell
cd sonarqube
docker compose up -d
```

Abre `http://localhost:9000`. El usuario inicial es `admin` y deberás cambiar la contraseña en el primer acceso.

El `docker-compose.yml` acepta credenciales mediante variables `SONAR_JDBC_USERNAME` y `SONAR_JDBC_PASSWORD`. Para uso local puede conservar los valores predeterminados seguros para Docker aislado. Para un entorno compartido, crea `sonarqube/.env` con credenciales propias.

Después crea un token de proyecto y un proyecto local llamado `crud-frutas`, y ejecuta:

```powershell
cd ..
.\sonarqube\run-analysis.ps1 -Token "TU_TOKEN"
```

No guardes el token en archivos versionados ni en el historial de Git.
