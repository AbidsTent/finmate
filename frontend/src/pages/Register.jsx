import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { registerUser } from "../services/authApi";
import { setAuth } from "../utils/storage";

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    try {
      const data = await registerUser(form);
      setAuth(data.token, data.user);
      navigate("/");
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <main className="container" style={{ maxWidth: "520px", paddingTop: "80px" }}>
      <div className="panel">
        <h1>Create Account</h1>
        <p className="muted">Register to access your dashboard.</p>

        <form className="form" onSubmit={handleSubmit}>
          <label className="field">
            <span className="muted">Name</span>
            <input
              className="input"
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              required
            />
          </label>

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

          <button className="btn" type="submit">Create Account</button>
        </form>

        {error && <div className="error muted" style={{ display: "block", marginTop: "10px" }}>{error}</div>}

        <p style={{ marginTop: "16px" }}>
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </div>
    </main>
  );
}