"use client";

import { useState } from "react";

export default function TestRegister() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const submit = async () => {
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(form),
    });

    const data = await res.json();

    alert(JSON.stringify(data, null, 2));
  };

  return (
    <div style={{ padding: 40 }}>
      <h1>Test Register</h1>

      <input
        placeholder="Name"
        onChange={(e) => setForm({ ...form, name: e.target.value })}
      />
      <br />
      <br />

      <input
        placeholder="Email"
        onChange={(e) => setForm({ ...form, email: e.target.value })}
      />
      <br />
      <br />

      <input
        placeholder="Phone"
        onChange={(e) => setForm({ ...form, phone: e.target.value })}
      />
      <br />
      <br />

      <input
        type="password"
        placeholder="Password"
        onChange={(e) => setForm({ ...form, password: e.target.value })}
      />
      <br />
      <br />

      <input
        type="password"
        placeholder="Confirm Password"
        onChange={(e) =>
          setForm({ ...form, confirmPassword: e.target.value })
        }
      />
      <br />
      <br />

      <button onClick={submit}>Register</button>
    </div>
  );
}