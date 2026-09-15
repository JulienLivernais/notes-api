
# REGISTER AND LOGIN
# //////////////////////////

def test_register(client):
    response = client.post("/auth/register", json={
        "username": "testuser",
        "email": "test@example.com",
        "password": "test1234"
    })
    assert response.status_code == 200
    assert response.json()["email"] == "test@example.com"

def test_register_duplicate_email(client):
    client.post("/auth/register", json={
        "username": "testuser",
        "email": "duplicate@example.com",
        "password": "test1234"
    })
    response = client.post("/auth/register", json={
        "username": "testuser2",
        "email": "duplicate@example.com",
        "password": "test1234"
    })
    assert response.status_code == 400
    assert response.json()["detail"] == "Email already registered"

def test_login(client):
    client.post("/auth/register", json={
        "username": "loginuser",
        "email": "login@example.com",
        "password": "test1234"
    })
    response = client.post("/auth/login", data={
        "username": "login@example.com",
        "password": "test1234"
    })
    assert response.status_code == 200
    assert "access_token" in response.json()

def test_login_wrong_password(client):
    response = client.post("/auth/login", data={
        "username": "login@example.com",
        "password": "wrongpassword"
    })
    assert response.status_code == 401
    assert response.json()["detail"] == "Invalid credentials"


# ACCESS AND REFRESH TOKENS
# //////////////////////////

def test_login_returns_both_tokens(client):
    client.post("/auth/register", json={
        "username": "refresh-user",
        "email": "refresh1@example.com",
        "password": "test1234"
    })
    response = client.post("/auth/login", data={
        "username": "refresh1@example.com",
        "password": "test1234"
    })
    assert response.status_code == 200
    assert "refresh_token" in response.json()


def test_refresh_success(client):
    client.post("/auth/register", json={
        "username": "refresh-user2",
        "email": "refresh2@example.com",
        "password": "test1234"
    })
    login = client.post("/auth/login", data={
        "username": "refresh2@example.com",
        "password": "test1234"
    })
    response = client.post("/auth/refresh", json={
        "refresh_token": login.json()["refresh_token"]
    })
    assert response.status_code == 200
    assert "access_token" in response.json()


def test_refresh_rejects_access_token(client):
    client.post("/auth/register", json={
        "username": "refresh-user3",
        "email": "refresh3@example.com",
        "password": "test1234"
    })
    login = client.post("/auth/login", data={
        "username": "refresh3@example.com",
        "password": "test1234"
    })
    response = client.post("/auth/refresh", json={
        "refresh_token": login.json()["access_token"]
    })
    assert response.status_code == 401


def test_access_rejects_refresh_token(client):
    client.post("/auth/register", json={
        "username": "refresh-user4",
        "email": "refresh4@example.com",
        "password": "test1234"
    })
    login = client.post("/auth/login", data={
        "username": "refresh4@example.com",
        "password": "test1234"
    })
    response = client.get("/users/me", headers={
        "Authorization": f"Bearer {login.json()['refresh_token']}"
    })
    assert response.status_code == 401


