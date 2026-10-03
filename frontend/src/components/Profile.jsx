import { useState } from "react";
import { updateMe, deleteMe } from "../api";

function Profile({ user, onUpdate, onDeleted }) {
  const [username, setUsername] = useState(user.username);
  const [email, setEmail] = useState(user.email);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  async function handleInfoSubmit(event) {
    event.preventDefault();
    setMessage(null);
    setError(null);

    const fields = {};
    if (username !== user.username) {
      fields.username = username;
    }
    if (email !== user.email) {
      fields.email = email;
    }
    if (Object.keys(fields).length === 0) {
      setMessage("Nothing to update");
      return;
    }

    try {
      const updated = await updateMe(fields);
      onUpdate(updated);
      setMessage("Profile updated");
    } catch (err) {
      setError(err.message);
    }
  }

  async function handlePasswordSubmit(event) {
    event.preventDefault();
    setMessage(null);
    setError(null);

    try {
      await updateMe({ password: newPassword, current_password: currentPassword });
      setCurrentPassword("");
      setNewPassword("");
      setMessage("Password changed");
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleDelete() {
    if (!window.confirm("Delete your account and all your notes?")) {
      return;
    }
    try {
      await deleteMe();
      onDeleted();
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <section>
      <h2>Profile</h2>
      <p>Member since {new Date(user.created_at).toLocaleDateString()}</p>

      {message && <p className="success">{message}</p>}
      {error && <p className="error">{error}</p>}

      <h3>Account</h3>
      <form onSubmit={handleInfoSubmit}>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Username"
          minLength={3}
          maxLength={30}
          required
        />
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          required
        />
        <button type="submit">Save</button>
      </form>

      <h3>Change password</h3>
      <form onSubmit={handlePasswordSubmit}>
        <input
          type="password"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
          placeholder="Current password"
          required
        />
        <input
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          placeholder="New password (8 characters min)"
          minLength={8}
          maxLength={128}
          required
        />
        <button type="submit">Change password</button>
      </form>

      <h3>Danger zone</h3>
      <button onClick={handleDelete}>Delete my account</button>
    </section>
  );
}

export default Profile;