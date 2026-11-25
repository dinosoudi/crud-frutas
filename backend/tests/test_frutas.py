from fastapi.testclient import TestClient


def crear_fruta(client: TestClient, nombre: str = "Mango", calificacion: int = 9):
    response = client.post(
        "/frutas",
        json={"nombre": nombre, "calificacion": calificacion},
    )
    assert response.status_code == 201
    return response.json()


def test_listar_sin_frutas(client: TestClient):
    response = client.get("/frutas")

    assert response.status_code == 200
    assert response.json() == []


def test_crear_fruta_valida(client: TestClient):
    fruta = crear_fruta(client)

    assert fruta["id"] >= 1
    assert fruta["nombre"] == "Mango"
    assert fruta["calificacion"] == 9


def test_crear_fruta_rechaza_nombre_vacio(client: TestClient):
    response = client.post("/frutas", json={"nombre": "", "calificacion": 5})

    assert response.status_code == 422


def test_crear_fruta_rechaza_calificacion_fuera_de_rango(client: TestClient):
    response = client.post("/frutas", json={"nombre": "Pera", "calificacion": 11})

    assert response.status_code == 422


def test_listar_frutas(client: TestClient):
    crear_fruta(client)

    response = client.get("/frutas")

    assert response.status_code == 200
    assert len(response.json()) == 1


def test_obtener_fruta_existente(client: TestClient):
    fruta = crear_fruta(client)

    response = client.get(f"/frutas/{fruta['id']}")

    assert response.status_code == 200
    assert response.json() == fruta


def test_obtener_fruta_inexistente(client: TestClient):
    response = client.get("/frutas/999")

    assert response.status_code == 404
    assert response.json() == {"detail": "Fruta no encontrada"}


def test_obtener_fruta_con_id_invalido(client: TestClient):
    response = client.get("/frutas/0")

    assert response.status_code == 422


def test_reemplazar_fruta(client: TestClient):
    fruta = crear_fruta(client)

    response = client.put(
        f"/frutas/{fruta['id']}",
        json={"nombre": "Mango maduro", "calificacion": 10},
    )

    assert response.status_code == 200
    assert response.json()["nombre"] == "Mango maduro"
    assert response.json()["calificacion"] == 10


def test_reemplazar_fruta_inexistente(client: TestClient):
    response = client.put(
        "/frutas/999",
        json={"nombre": "Mango", "calificacion": 9},
    )

    assert response.status_code == 404


def test_patch_actualiza_calificacion(client: TestClient):
    fruta = crear_fruta(client)

    response = client.patch(
        f"/frutas/{fruta['id']}",
        json={"calificacion": 8},
    )

    assert response.status_code == 200
    assert response.json()["nombre"] == "Mango"
    assert response.json()["calificacion"] == 8


def test_patch_actualiza_nombre(client: TestClient):
    fruta = crear_fruta(client)

    response = client.patch(
        f"/frutas/{fruta['id']}",
        json={"nombre": "Guayaba"},
    )

    assert response.status_code == 200
    assert response.json()["nombre"] == "Guayaba"


def test_patch_sin_campos(client: TestClient):
    fruta = crear_fruta(client)

    response = client.patch(f"/frutas/{fruta['id']}", json={})

    assert response.status_code == 422


def test_patch_con_valores_nulos(client: TestClient):
    fruta = crear_fruta(client)

    response = client.patch(
        f"/frutas/{fruta['id']}",
        json={"nombre": None, "calificacion": None},
    )

    assert response.status_code == 422


def test_patch_fruta_inexistente(client: TestClient):
    response = client.patch("/frutas/999", json={"calificacion": 8})

    assert response.status_code == 404


def test_eliminar_fruta(client: TestClient):
    fruta = crear_fruta(client)

    response = client.delete(f"/frutas/{fruta['id']}")

    assert response.status_code == 204
    assert client.get(f"/frutas/{fruta['id']}").status_code == 404


def test_eliminar_fruta_inexistente(client: TestClient):
    response = client.delete("/frutas/999")

    assert response.status_code == 404
