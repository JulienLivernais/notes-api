def test_change_password_success(client):
    client.post("/auth/register", json={
        "username": "pwd-user",
        "email": "pwd1@example.com",
        "password": "test1234"
    })
    login = client.post("/auth/login", data={
        "username": "pwd1@example.com",
        "password": "test1234"
    })
    token = login.json()["access_token"]
    response = client.patch("/users/me", json={
        "password": "newpass1234",
        "current_password": "test1234"
    }, headers={"Authorization": f"Bearer {token}"})
    assert response.status_code == 200

    relogin = client.post("/auth/login", data={
        "username": "pwd1@example.com",
        "password": "newpass1234"
    })
    assert relogin.status_code == 200


def test_change_password_with_wrong_current(client):
    client.post("/auth/register", json={
        "username": "pwd-user2",
        "email": "pwd2@example.com",
        "password": "test1234"
    })
    login = client.post("/auth/login", data={
        "username": "pwd2@example.com",
        "password": "test1234"
    })
    token = login.json()["access_token"]
    response = client.patch("/users/me", json={
        "password": "newpass1234",
        "current_password": "wrongpassword"
    }, headers={"Authorization": f"Bearer {token}"})
    assert response.status_code == 401