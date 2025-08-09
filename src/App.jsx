import { useEffect, useState } from "react";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

function App() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");

  async function loadTasks() {
    try {
      const res = await fetch(`${API_URL}/tasks`);
      const data = await res.json();
      setTasks(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error fetching tasks:", err);
      setTasks([]);
    }
  }

  useEffect(() => {
    loadTasks();
  }, []);

  async function handleAdd(e) {
    e.preventDefault();
    if (!title.trim()) return;
    try {
      const res = await fetch(`${API_URL}/tasks`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, priority: "Medium" }),
      });
      const newTask = await res.json();
      setTitle("");
      setTasks((prev) => [newTask, ...prev]);
    } catch (err) {
      console.error("Error creating task:", err);
    }
  }

  async function handleDelete(id) {
    try {
      await fetch(`${API_URL}/tasks/${id}`, { method: "DELETE" });
      setTasks((prev) => prev.filter((t) => t._id !== id));
    } catch (err) {
      console.error("Error deleting task:", err);
    }
  }

  return (
    <div
      style={{
        padding: 20,
        fontFamily: "Arial, sans-serif",
        backgroundColor: "#f9f9f9",
        minHeight: "100vh",
      }}
    >
      <h1 style={{ textAlign: "center", color: "#333" }}>🗓 Daily Task Scheduler</h1>

      <form
        onSubmit={handleAdd}
        style={{
          display: "flex",
          justifyContent: "center",
          marginBottom: 20,
          gap: "10px",
        }}
      >
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="New task title"
          style={{
            padding: 10,
            width: 300,
            borderRadius: 6,
            border: "1px solid #ccc",
            outline: "none",
          }}
        />
        <button
          type="submit"
          style={{
            padding: "10px 16px",
            backgroundColor: "#4CAF50",
            color: "white",
            border: "none",
            borderRadius: 6,
            cursor: "pointer",
          }}
        >
          ➕ Add
        </button>
      </form>

      <div
        style={{
          maxWidth: 500,
          margin: "0 auto",
          background: "white",
          padding: 20,
          borderRadius: 8,
          boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
        }}
      >
        {tasks.length === 0 ? (
          <p style={{ textAlign: "center", color: "#777" }}>No tasks found.</p>
        ) : (
          <ul style={{ listStyle: "none", padding: 0 }}>
            {tasks.map((t) => (
              <li
                key={t._id}
                style={{
                  padding: 12,
                  marginBottom: 10,
                  border: "1px solid #eee",
                  borderRadius: 6,
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <div>
                  <strong style={{ color: "#000" }}>{t.title}</strong>
                  <div style={{ fontSize: 12, color: "#666" }}>
                    {t.description || "—"} • {t.priority} •{" "}
                    {t.completed ? "✅ Done" : "⌛ Open"}
                  </div>
                </div>
                <button
                  onClick={() => handleDelete(t._id)}
                  style={{
                    background: "#ff4d4f",
                    color: "white",
                    border: "none",
                    padding: "6px 10px",
                    borderRadius: 4,
                    cursor: "pointer",
                  }}
                >
                  🗑 Delete
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default App;
