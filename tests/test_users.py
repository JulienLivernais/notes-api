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
    assert response.status_code == 400

# DUPLICATES
# //////////////////////////

def register_and_login(client, username, email):
    client.post("/auth/register", json={
        "username": username,
        "email": email,
        "password": "test1234"
    })
    login = client.post("/auth/login", data={
        "username": email,
        "password": "test1234"
    })
    return {"Authorization": f"Bearer {login.json()['access_token']}"}


def test_update_username_already_taken(client):
    register_and_login(client, "taken-name", "taken@example.com")
    headers = register_and_login(client, "other-name", "other@example.com")
    response = client.patch("/users/me", json={"username": "taken-name"}, headers=headers)
    assert response.status_code == 400
    assert response.json()["detail"] == "Username already taken"


def test_update_email_already_registered(client):
    register_and_login(client, "first-user", "first@example.com")
    headers = register_and_login(client, "second-user", "second@example.com")
    response = client.patch("/users/me", json={"email": "first@example.com"}, headers=headers)
    assert response.status_code == 400
    assert response.json()["detail"] == "Email already registered"


def test_update_with_own_username_is_allowed(client):
    headers = register_and_login(client, "same-name", "same@example.com")
    response = client.patch("/users/me", json={"username": "same-name"}, headers=headers)
    assert response.status_code == 200