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

## Levantar todo el entorno

Desde la raíz del monorepo:

```powershell
docker compose up -d --build
```

Esto levanta:

- Backend FastAPI y SQLite en `http://localhost:8000`
- Frontend Angular en `http://localhost:4200`
- SonarQube en `http://localhost:9000`
- PostgreSQL interno de SonarQube

Para detener todo:

```powershell
docker compose down
```

Los datos persistentes se conservan en volúmenes Docker. Opcionalmente crea un archivo `.env` a partir de `.env.example` para personalizar las credenciales JDBC de PostgreSQL. Para eliminar también los datos:

```powershell
docker compose down -v
```

## Análisis SonarQube

Se recomienda analizar backend y frontend como proyectos independientes:

- `crud-frutas-backend`: código Python en `backend/app`.
- `crud-frutas-frontend`: código TypeScript en `frontend/src/app`.

Generar primero las pruebas y coberturas:

```powershell
cd backend
C:/Python314/python.exe -m pytest

cd ../frontend
npm run test:ci

cd ..
.\sonarqube\run-analysis.ps1 -Token "TU_TOKEN" -Project backend
.\sonarqube\run-analysis.ps1 -Token "TU_TOKEN" -Project frontend
```

Usa `-Project all` para analizar ambos proyectos.

## Ejecutar frontend y backend juntos

Desde la raíz del monorepo:

```powershell
docker compose up --build
```

- Frontend: `http://localhost:4200`
- Backend: `http://localhost:8000`
- Documentación: `http://localhost:8000/docs`

El frontend Angular permite listar, seleccionar, crear, editar y eliminar frutas. La lista lateral tiene desplazamiento independiente cuando contiene muchos elementos.
