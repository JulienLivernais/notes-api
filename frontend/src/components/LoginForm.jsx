import { useState } from "react";
import { login, getMe, GITHUB_LOGIN_URL } from "../api";

function LoginForm({ onLogin, onSwitch }) {
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

      <p className="divider">or</p>

      <a className="github-button" href={GITHUB_LOGIN_URL}>
        <img src="/GitHub_Invertocat_White.svg" alt="" />
        Sign in with GitHub
      </a>

      {error && <p className="error">{error}</p>}

      <p>
        No account yet?{" "}
        <button type="button" onClick={onSwitch}>
          Create an account
        </button>
      </p>
    </section>
  );
}

export default LoginForm;