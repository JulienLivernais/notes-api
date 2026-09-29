import { useEffect, useState } from "react";
import { getMe, logout } from "./api";
import LoginForm from "./components/LoginForm";
import NoteList from "./components/NoteList";

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

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
            <button onClick={handleLogout}>Log out</button>
          </header>
          <NoteList />
        </>
      ) : (
        <LoginForm onLogin={setUser} />
      )}
    </div>
  );
}

export default App;