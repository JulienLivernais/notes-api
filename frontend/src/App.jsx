import { useEffect, useState } from "react";
import { getMe, logout } from "./api";
import LoginForm from "./components/LoginForm";
import RegisterForm from "./components/RegisterForm";
import NoteList from "./components/NoteList";
import Profile from "./components/Profile";
import AdminUsers from "./components/AdminUsers";
import "./App.css";

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showRegister, setShowRegister] = useState(false);
  const [view, setView] = useState("notes");

  useEffect(() => {
    if (!localStorage.getItem("access_token")) {
      setLoading(false);
      return;
    }
    getMe()
      .then(setUser)
      .catch(() => logout())
      .finally(() => setLoading(false));
  }, []);

  function handleLogout() {
    logout();
    setUser(null);
    setShowRegister(false);
    setView("notes");
  }

  if (loading) {
    return <p className="empty">Loading...</p>;
  }

  return (
    <div className="app">
      <h1 className="app-title">Notes-api</h1>
      {user ? (
        <>
          <header className="topbar">
            <span className="topbar-user">{user.username}</span>
            <nav>
              <button className={view === "notes" ? "active" : ""} onClick={() => setView("notes")}>
                Notes
              </button>
              <button className={view === "profile" ? "active" : ""} onClick={() => setView("profile")}>
                Profile
              </button>
              {user.is_admin && (
                <button className={view === "admin" ? "active" : ""} onClick={() => setView("admin")}>
                  Admin
                </button>
              )}
              <button onClick={handleLogout}>Log out</button>
            </nav>
          </header>
          {view === "notes" && <NoteList />}
          {view === "profile" && (
            <Profile user={user} onUpdate={setUser} onDeleted={handleLogout} />
          )}
          {view === "admin" && user.is_admin && <AdminUsers currentUserId={user.id} />}
        </>
      ) : showRegister ? (
        <RegisterForm onLogin={setUser} onSwitch={() => setShowRegister(false)} />
      ) : (
        <LoginForm onLogin={setUser} onSwitch={() => setShowRegister(true)} />
      )}
    </div>
  );
}

export default App;