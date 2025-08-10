import { useEffect, useState } from "react";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

function App() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("Medium");
  const [deadline, setDeadline] = useState("");

  async function loadTasks() {
    try {
      const res = await fetch(`${API_URL}/tasks`);
      const data = await res.json();
      setTasks(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error fetching tasks:", err);
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
        body: JSON.stringify({
          title,
          description,
          priority,
          deadline: deadline ? new Date(deadline) : null,
        }),
      });
      const newTask = await res.json();
      setTitle("");
      setDescription("");
      setPriority("Medium");
      setDeadline("");
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

  async function handleMarkDone(id) {
    try {
      const res = await fetch(`${API_URL}/tasks/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ completed: true }),
      });
      const updatedTask = await res.json();
      setTasks((prev) =>
        prev.map((t) => (t._id === id ? updatedTask : t))
      );
    } catch (err) {
      console.error("Error marking task as done:", err);
    }
  }

  return (
    <div style={{ padding: 20, fontFamily: "Arial, sans-serif", backgroundColor: "#f9f9f9", minHeight: "100vh" }}>
      <h1 style={{ textAlign: "center", color: "#333" }}>🗓 Daily Task Scheduler</h1>

      {/* Task Form */}
      <form
        onSubmit={handleAdd}
        style={{
          display: "flex",
          flexDirection: "column",
          maxWidth: 400,
          margin: "0 auto",
          gap: "10px",
          background: "white",
          padding: 20,
          borderRadius: 8,
          boxShadow: "0 2px 6px rgba(0,0,0,0.1)"
        }}
      >
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Task title"
          style={{ padding: 10, borderRadius: 6, border: "1px solid #ccc" }}
        />
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Task description"
          style={{ padding: 10, borderRadius: 6, border: "1px solid #ccc" }}
        />
        <select
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
          style={{ padding: 10, borderRadius: 6, border: "1px solid #ccc" }}
        >
          <option>Low</option>
          <option>Medium</option>
          <option>High</option>
        </select>
        <input
          type="date"
          value={deadline}
          onChange={(e) => setDeadline(e.target.value)}
          style={{ padding: 10, borderRadius: 6, border: "1px solid #ccc" }}
        />
        <button
          type="submit"
          style={{ padding: "10px", backgroundColor: "#4CAF50", color: "white", border: "none", borderRadius: 6, cursor: "pointer" }}
        >
          ➕ Add Task
        </button>
      </form>

      {/* Task List */}
      <div style={{ maxWidth: 500, margin: "20px auto", background: "white", padding: 20, borderRadius: 8, boxShadow: "0 2px 6px rgba(0,0,0,0.1)" }}>
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
                  alignItems: "center"
                }}
              >
                <div>
                  <strong style={{ color: "#000" }}>{t.title}</strong>
                  <div style={{ fontSize: 12, color: "#666" }}>
                    {t.description || "—"} • Priority: {t.priority} •{" "}
                    {t.deadline ? new Date(t.deadline).toLocaleDateString() : "No deadline"} •{" "}
                    {t.completed ? "✅ Done" : "⌛ Open"}
                  </div>
                </div>
                <div style={{ display: "flex", gap: "5px" }}>
                  {!t.completed && (
                    <button
                      onClick={() => handleMarkDone(t._id)}
                      style={{
                        background: "#1890ff",
                        color: "white",
                        border: "none",
                        padding: "6px 10px",
                        borderRadius: 4,
                        cursor: "pointer"
                      }}
                    >
                      ✔ Mark Done
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(t._id)}
                    style={{
                      background: "#ff4d4f",
                      color: "white",
                      border: "none",
                      padding: "6px 10px",
                      borderRadius: 4,
                      cursor: "pointer"
                    }}
                  >
                    🗑 Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default App;
