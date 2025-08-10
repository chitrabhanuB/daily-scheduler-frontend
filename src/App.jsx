import { useEffect, useState } from "react";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

function App() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("Medium");
  const [deadline, setDeadline] = useState("");
  const [completed, setCompleted] = useState(false);
  const [triggeredAlarms, setTriggeredAlarms] = useState([]); // ✅ track alarms played

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
        body: JSON.stringify({
          title,
          description,
          priority,
          deadline: deadline ? new Date(deadline) : null,
          completed,
        }),
      });

      const newTask = await res.json();
      setTitle("");
      setDescription("");
      setPriority("Medium");
      setDeadline("");
      setCompleted(false);
      setTasks((prev) => [newTask, ...prev]);
    } catch (err) {
      console.error("Error creating task:", err);
    }
  }

  async function handleDelete(id) {
    try {
      await fetch(`${API_URL}/tasks/${id}`, { method: "DELETE" });
      setTasks((prev) => prev.filter((t) => t._id !== id));
      setTriggeredAlarms((prev) => prev.filter((tid) => tid !== id)); // Remove from triggered list
    } catch (err) {
      console.error("Error deleting task:", err);
    }
  }

  async function handleMarkDone(id, currentStatus) {
    try {
      const res = await fetch(`${API_URL}/tasks/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ completed: !currentStatus }),
      });
      const updatedTask = await res.json();

      setTasks((prev) =>
        prev.map((t) => (t._id === id ? updatedTask : t))
      );
    } catch (err) {
      console.error("Error marking task done:", err);
    }
  }

  // 🔔 Alarm checker (only once per task)
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date().getTime();

      tasks.forEach((task) => {
        if (
          task.deadline &&
          !task.completed &&
          !triggeredAlarms.includes(task._id)
        ) {
          const deadlineTime = new Date(task.deadline).getTime();

          // Trigger if within 1 second of deadline
          if (Math.abs(deadlineTime - now) < 1000) {
            const alarm = new Audio("/alarm.mp3");
            alarm.play().catch((err) =>
              console.error("Audio play error:", err)
            );
            alert(`⏰ Task "${task.title}" is due now!`);

            // Mark as triggered
            setTriggeredAlarms((prev) => [...prev, task._id]);
          }
        }
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [tasks, triggeredAlarms]);

  return (
    <div className="app-container">
      <h1>🗓 Daily Task Scheduler</h1>

      {/* Task Form */}
      <form className="task-form" onSubmit={handleAdd}>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Task title"
        />
        <input
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Description"
        />
        <select value={priority} onChange={(e) => setPriority(e.target.value)}>
          <option>Low</option>
          <option>Medium</option>
          <option>High</option>
        </select>
        <input
          type="datetime-local"
          value={deadline}
          onChange={(e) => setDeadline(e.target.value)}
        />
        <label style={{ display: "flex", alignItems: "center", gap: "5px" }}>
          <input
            type="checkbox"
            checked={completed}
            onChange={(e) => setCompleted(e.target.checked)}
          />
          Done?
        </label>
        <button type="submit">➕ Add</button>
      </form>

      {/* Task List */}
      <div className="task-list-container">
        {tasks.length === 0 ? (
          <p style={{ textAlign: "center", color: "#777" }}>No tasks found.</p>
        ) : (
          <ul className="task-list">
            {tasks.map((t) => (
              <li className="task-item" key={t._id}>
                <div>
                  <strong className="task-title">{t.title}</strong>
                  <div className="task-details">
                    {t.description || "—"} •{" "}
                    <span
                      style={{
                        color:
                          t.priority === "High"
                            ? "red"
                            : t.priority === "Medium"
                            ? "orange"
                            : "green",
                        fontWeight: "bold",
                      }}
                    >
                      {t.priority}
                    </span>{" "}
                    •{" "}
                    {t.deadline
                      ? new Date(t.deadline).toLocaleString()
                      : "No deadline"}{" "}
                    • {t.completed ? "✅ Done" : "⌛ Open"}
                  </div>
                </div>
                <div style={{ display: "flex", gap: "5px" }}>
                  <button onClick={() => handleMarkDone(t._id, t.completed)}>
                    {t.completed ? "↩ Undo" : "✔ Mark Done"}
                  </button>
                  <button onClick={() => handleDelete(t._id)}>🗑 Delete</button>
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
