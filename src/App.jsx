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
        body: JSON.stringify({ title, priority: "Medium" })
      });
      const newTask = await res.json();
      setTitle("");
      setTasks(prev => [newTask, ...prev]);
    } catch (err) {
      console.error("Error creating task:", err);
    }
  }

  async function handleDelete(id) {
    try {
      await fetch(`${API_URL}/tasks/${id}`, { method: "DELETE" });
      setTasks(prev => prev.filter(t => t._id !== id));
    } catch (err) {
      console.error("Error deleting task:", err);
    }
  }

  return (
    <div style={{ padding: 20, fontFamily: "Arial" }}>
      <h1>Daily Task Scheduler</h1>

      <form onSubmit={handleAdd} style={{ marginBottom: 16 }}>
        <input
          value={title}
          onChange={e => setTitle(e.target.value)}
          placeholder="New task title"
          style={{ padding: 8, width: 300 }}
        />
        <button type="submit" style={{ marginLeft: 8, padding: "8px 12px" }}>
          Add
        </button>
      </form>

      {tasks.length === 0 ? (
        <p>No tasks found.</p>
      ) : (
        <ul>
          {tasks.map(t => (
            <li key={t._id} style={{ marginBottom: 8 }}>
              <strong>{t.title}</strong>{" "}
              <button onClick={() => handleDelete(t._id)} style={{ marginLeft: 8 }}>
                Delete
              </button>
              <div style={{ fontSize: 12, color: "#666" }}>
                {t.description || "—"} • {t.priority} • {t.completed ? "Done" : "Open"}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default App;
