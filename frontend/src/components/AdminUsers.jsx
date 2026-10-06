import { useEffect, useState } from "react";
import { getAllUsers, findUserByEmail, findUserByUsername, deleteUser } from "../api";

function AdminUsers({ currentUserId }) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchType, setSearchType] = useState("email");
  const [query, setQuery] = useState("");

  useEffect(() => {
    getAllUsers()
      .then(setUsers)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  async function handleSearch(event) {
    event.preventDefault();
    setError(null);

    try {
      const user =
        searchType === "email"
          ? await findUserByEmail(query.trim())
          : await findUserByUsername(query.trim());
      setUsers([user]);
    } catch (err) {
      setUsers([]);
      setError(err.message);
    }
  }

  async function handleShowAll() {
    setQuery("");
    setError(null);
    try {
      setUsers(await getAllUsers());
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleDelete(user) {
    if (!window.confirm(`Delete ${user.username} and all their notes?`)) {
      return;
    }
    try {
      await deleteUser(user.id);
      setUsers(users.filter((u) => u.id !== user.id));
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <section>
      <h2>Users</h2>

      <form onSubmit={handleSearch}>
        <select value={searchType} onChange={(e) => setSearchType(e.target.value)}>
          <option value="email">Email</option>
          <option value="username">Username</option>
        </select>
        <input
          type={searchType === "email" ? "email" : "text"}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={searchType === "email" ? "user@email.com" : "username"}
          required
        />
        <button type="submit">Search</button>
        <button type="button" onClick={handleShowAll}>
          Show all
        </button>
      </form>

      {error && <p className="error">{error}</p>}

      {loading ? (
        <p>Loading users...</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Username</th>
              <th>Email</th>
              <th>Role</th>
              <th>Created</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id}>
                <td>{u.id}</td>
                <td>{u.username}</td>
                <td>{u.email}</td>
                <td>{u.is_admin ? "Admin" : "User"}</td>
                <td>{new Date(u.created_at).toLocaleDateString()}</td>
                <td>
                  {u.id !== currentUserId && (
                    <button onClick={() => handleDelete(u)}>Delete</button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </section>
  );
}

export default AdminUsers;