import os
import sqlite3
from contextlib import contextmanager
from pathlib import Path

DATABASE_PATH = os.getenv("DATABASE_PATH", "/data/frutas.db")


def initialize_database() -> None:
    database_file = Path(DATABASE_PATH)
    if database_file.parent != Path("."):
        database_file.parent.mkdir(parents=True, exist_ok=True)

    with sqlite3.connect(database_file) as connection:
        connection.execute(
            """
            CREATE TABLE IF NOT EXISTS frutas (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                nombre TEXT NOT NULL,
                calificacion INTEGER NOT NULL CHECK (calificacion BETWEEN 1 AND 10)
            )
            """
        )


@contextmanager
def get_connection():
    connection = sqlite3.connect(DATABASE_PATH)
    connection.row_factory = sqlite3.Row
    try:
        yield connection
    finally:
        connection.close()
