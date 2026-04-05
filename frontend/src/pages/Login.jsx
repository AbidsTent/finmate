import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { loginUser } from "../services/authApi";
import { setAuth } from "../utils/storage";

export default function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    try {
      const data = await loginUser(form);
      setAuth(data.token, data.user);
      navigate("/");
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <main className="container" style={{ maxWidth: "520px", paddingTop: "80px" }}>
      <div className="panel">
        <h1>Login to FinMate</h1>
        <p className="muted">Enter your email and password to continue.</p>

        <form className="form" onSubmit={handleSubmit}>
          <label className="field">
            <span className="muted">Email</span>
            <input
              className="input"
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
            />
          </label>

          <label className="field">
            <span className="muted">Password</span>
            <input
              className="input"
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              required
            />
          </label>

          <button className="btn" type="submit">Login</button>
        </form>

        {error && <div className="error muted" style={{ display: "block", marginTop: "10px" }}>{error}</div>}

        <p style={{ marginTop: "16px" }}>
          Don’t have an account? <Link to="/register">Create one</Link>
        </p>
      </div>
    </main>
  );
}