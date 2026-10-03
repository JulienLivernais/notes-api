import { useEffect, useState } from "react";
import { getMe, logout } from "./api";
import LoginForm from "./components/LoginForm";
import RegisterForm from "./components/RegisterForm";
import NoteList from "./components/NoteList";
import Profile from "./components/Profile";

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
    return <p>Loading...</p>;
  }

  return (
    <div className="app">
      <h1>Notes</h1>
      {user ? (
        <>
          <header>
            <span>Logged in as {user.username}</span>
            <button onClick={() => setView("notes")}>Notes</button>
            <button onClick={() => setView("profile")}>Profile</button>
            <button onClick={handleLogout}>Log out</button>
          </header>
          {view === "notes" ? (
            <NoteList />
          ) : (
            <Profile user={user} onUpdate={setUser} onDeleted={handleLogout} />
          )}
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