from fastapi.testclient import TestClient


def register_and_login(client: TestClient, email: str, username: str) -> str:
    client.post("/auth/register", json={
        "username": username,
        "email": email,
        "password": "test1234"
    })
    response = client.post("/auth/login", data={
        "username": email,
        "password": "test1234"
    })
    return response.json()["access_token"]


def test_create_note(client):
    token = register_and_login(client, "note@example.com", "noteuser")
    response = client.post("/notes/", json={
        "title": "My first note",
        "content": "Hello world"
    }, headers={"Authorization": f"Bearer {token}"})
    assert response.status_code == 201
    assert response.json()["title"] == "My first note"


def test_get_notes(client):
    token = register_and_login(client, "note2@example.com", "noteuser2")
    client.post("/notes/", json={
        "title": "Note 1",
        "content": "Content 1"
    }, headers={"Authorization": f"Bearer {token}"})
    response = client.get("/notes/", headers={"Authorization": f"Bearer {token}"})
    assert response.status_code == 200
    assert len(response.json()) == 1


def test_get_note_by_id(client):
    token = register_and_login(client, "note3@example.com", "noteuser3")
    created = client.post("/notes/", json={
        "title": "Note by id",
        "content": "Content"
    }, headers={"Authorization": f"Bearer {token}"})
    note_id = created.json()["id"]
    response = client.get(f"/notes/{note_id}", headers={"Authorization": f"Bearer {token}"})
    assert response.status_code == 200
    assert response.json()["id"] == note_id


def test_update_note(client):
    token = register_and_login(client, "note4@example.com", "noteuser4")
    created = client.post("/notes/", json={
        "title": "Old title",
        "content": "Old content"
    }, headers={"Authorization": f"Bearer {token}"})
    note_id = created.json()["id"]
    response = client.patch(f"/notes/{note_id}", json={
        "title": "New title"
    }, headers={"Authorization": f"Bearer {token}"})
    assert response.status_code == 200
    assert response.json()["title"] == "New title"


def test_delete_note(client):
    token = register_and_login(client, "note5@example.com", "noteuser5")
    created = client.post("/notes/", json={
        "title": "To delete",
        "content": "Content"
    }, headers={"Authorization": f"Bearer {token}"})
    note_id = created.json()["id"]
    response = client.delete(f"/notes/{note_id}", headers={"Authorization": f"Bearer {token}"})
    assert response.status_code == 204


def test_get_note_not_found(client):
    token = register_and_login(client, "note6@example.com", "noteuser6")
    response = client.get("/notes/999", headers={"Authorization": f"Bearer {token}"})
    assert response.status_code == 404


def test_get_note_another_user(client):
    token1 = register_and_login(client, "user1@example.com", "user1")
    token2 = register_and_login(client, "user2@example.com", "user2")
    created = client.post("/notes/", json={
        "title": "Private note",
        "content": "Secret"
    }, headers={"Authorization": f"Bearer {token1}"})
    note_id = created.json()["id"]
    response = client.get(f"/notes/{note_id}", headers={"Authorization": f"Bearer {token2}"})
    assert response.status_code == 404