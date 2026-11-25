import sqlite3
from contextlib import asynccontextmanager

from fastapi import FastAPI, HTTPException, Path, Response, status
from fastapi.middleware.cors import CORSMiddleware

from app.database import get_connection, initialize_database
from app.schemas import Fruta, FrutaCrear, FrutaPatch


@asynccontextmanager
async def lifespan(app: FastAPI):
    initialize_database()
    yield


app = FastAPI(
    title="API de Frutas",
    description="CRUD simple para guardar las frutas que conozco y cuánto me gustan.",
    version="1.0.0",
    lifespan=lifespan,
)


app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:4200"],  # Cambia esto por el origen de tu aplicación Angular
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/frutas", response_model=list[Fruta])
def listar_frutas() -> list[dict]:
    with get_connection() as connection:
        rows = connection.execute(
            "SELECT id, nombre, calificacion FROM frutas ORDER BY id"
        ).fetchall()

    return [dict(row) for row in rows]


@app.post("/frutas", response_model=Fruta, status_code=status.HTTP_201_CREATED)
def crear_fruta(fruta: FrutaCrear) -> dict:
    try:
        with get_connection() as connection:
            cursor = connection.execute(
                "INSERT INTO frutas (nombre, calificacion) VALUES (?, ?)",
                (fruta.nombre, fruta.calificacion),
            )
            connection.commit()
            fruta_id = cursor.lastrowid
            row = connection.execute(
                "SELECT id, nombre, calificacion FROM frutas WHERE id = ?",
                (fruta_id,),
            ).fetchone()
    except sqlite3.IntegrityError as error:
        raise HTTPException(status_code=422, detail=str(error)) from error

    return dict(row)


def obtener_fila(fruta_id: int) -> dict:
    with get_connection() as connection:
        row = connection.execute(
            "SELECT id, nombre, calificacion FROM frutas WHERE id = ?",
            (fruta_id,),
        ).fetchone()

    if row is None:
        raise HTTPException(status_code=404, detail="Fruta no encontrada")

    return dict(row)


@app.get("/frutas/{id}", response_model=Fruta)
def obtener_fruta(id: int = Path(..., ge=1)) -> dict:
    return obtener_fila(id)


@app.put("/frutas/{id}", response_model=Fruta)
def reemplazar_fruta(fruta: FrutaCrear, id: int = Path(..., ge=1)) -> dict:
    obtener_fila(id)

    with get_connection() as connection:
        connection.execute(
            "UPDATE frutas SET nombre = ?, calificacion = ? WHERE id = ?",
            (fruta.nombre, fruta.calificacion, id),
        )
        connection.commit()

    return obtener_fila(id)


@app.patch("/frutas/{id}", response_model=Fruta)
def actualizar_fruta(fruta: FrutaPatch, id: int = Path(..., ge=1)) -> dict:
    fruta_actual = obtener_fila(id)

    nombre = fruta.nombre if fruta.nombre is not None else fruta_actual["nombre"]
    calificacion = (
        fruta.calificacion
        if fruta.calificacion is not None
        else fruta_actual["calificacion"]
    )

    with get_connection() as connection:
        connection.execute(
            "UPDATE frutas SET nombre = ?, calificacion = ? WHERE id = ?",
            (nombre, calificacion, id),
        )
        connection.commit()

    return obtener_fila(id)


@app.delete("/frutas/{id}", status_code=status.HTTP_204_NO_CONTENT)
def eliminar_fruta(id: int = Path(..., ge=1)) -> Response:
    obtener_fila(id)

    with get_connection() as connection:
        connection.execute("DELETE FROM frutas WHERE id = ?", (id,))
        connection.commit()

    return Response(status_code=status.HTTP_204_NO_CONTENT)
