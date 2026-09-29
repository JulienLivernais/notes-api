import { useState } from "react";
import { login, getMe } from "../api";

function LoginForm({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  async function handleSubmit(event) {
    event.preventDefault();
    setError(null);

    try {
      await login(email, password);
      const me = await getMe();
      onLogin(me);
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <section>
      <h2>Log in</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          required
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          required
        />
        <button type="submit">Log in</button>
      </form>

      {error && <p className="error">{error}</p>}
    </section>
  );
}

export default LoginForm;