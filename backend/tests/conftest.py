import sqlite3

import pytest
from fastapi.testclient import TestClient


@pytest.fixture()
def temp_database(tmp_path, monkeypatch):
    database_path = tmp_path / "test_frutas.db"
    monkeypatch.setenv("DATABASE_PATH", str(database_path))

    import app.database as database

    monkeypatch.setattr(database, "DATABASE_PATH", str(database_path))

    database.initialize_database()

    yield database_path


@pytest.fixture()
def client(temp_database):
    from app.main import app

    with TestClient(app) as test_client:
        yield test_client
