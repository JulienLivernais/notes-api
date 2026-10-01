import { useState } from "react";
import { register, login, getMe } from "../api";

function RegisterForm({ onLogin, onSwitch }) {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  async function handleSubmit(event) {
    event.preventDefault();
    setError(null);

    try {
      await register(username, email, password);
      await login(email, password);
      const me = await getMe();
      onLogin(me);
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <section>
      <h2>Create an account</h2>
      <form onSubmit={handleSubmit}>
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
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password (8 characters min)"
          minLength={8}
          maxLength={128}
          required
        />
        <button type="submit">Sign up</button>
      </form>

      {error && <p className="error">{error}</p>}

      <p>
        Already have an account?{" "}
        <button type="button" onClick={onSwitch}>
          Log in
        </button>
      </p>
    </section>
  );
}

export default RegisterForm;