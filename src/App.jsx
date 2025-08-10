import { useEffect, useState } from "react";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

function App() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("Medium");
  const [deadline, setDeadline] = useState("");
  const [completed, setCompleted] = useState(false);

  const [showModal, setShowModal] = useState(false);
  const [editTaskId, setEditTaskId] = useState(null);

  // Load sound for reminders
  const alarmSound = new Audio("/alarm.mp3"); // Place alarm.mp3 in public folder

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

  // Reminder checker
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      tasks.forEach((task) => {
        if (task.deadline && !task.completed) {
          const taskTime = new Date(task.deadline);
          if (
            Math.abs(taskTime - now) < 1000 * 30 // within 30 seconds
          ) {
            alarmSound.play().catch(() => {});
            if (Notification.permission === "granted") {
              new Notification("⏰ Task Reminder", {
                body: `${task.title} is due now!`,
              });
            }
          }
        }
      });
    }, 10000); // checks every 10 seconds

    return () => clearInterval(interval);
  }, [tasks]);

  // Ask for notification permission
  useEffect(() => {
    if (Notification.permission !== "granted") {
      Notification.requestPermission();
    }
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
      resetForm();
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

  function resetForm() {
    setTitle("");
    setDescription("");
    setPriority("Medium");
    setDeadline("");
    setCompleted(false);
  }

  function handleEditClick(task) {
    setEditTaskId(task._id);
    setTitle(task.title);
    setDescription(task.description || "");
    setPriority(task.priority || "Medium");
    setDeadline(task.deadline ? new Date(task.deadline).toISOString().slice(0, 16) : "");
    setCompleted(task.completed || false);
    setShowModal(true);
  }

  async function handleUpdate(e) {
    e.preventDefault();
    try {
      const res = await fetch(`${API_URL}/tasks/${editTaskId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          description,
          priority,
          deadline: deadline ? new Date(deadline) : null,
          completed,
        }),
      });
      const updatedTask = await res.json();

      setTasks((prev) =>
        prev.map((t) => (t._id === editTaskId ? updatedTask : t))
      );
      setShowModal(false);
      resetForm();
      setEditTaskId(null);
    } catch (err) {
      console.error("Error updating task:", err);
    }
  }

  // Color for priority
  function getPriorityColor(priority) {
    if (priority === "High") return "red";
    if (priority === "Medium") return "orange";
    if (priority === "Low") return "gold";
    return "black";
  }

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
              <li
                className="task-item"
                key={t._id}
                style={{ borderLeft: `6px solid ${getPriorityColor(t.priority)}` }}
              >
                <div>
                  <strong className="task-title">{t.title}</strong>
                  <div className="task-details">
                    {t.description || "—"} • 
                    <span style={{ color: getPriorityColor(t.priority) }}>
                      {t.priority}
                    </span> •{" "}
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
                  <button onClick={() => handleEditClick(t)}>✏ Edit</button>
                  <button onClick={() => handleDelete(t._id)}>🗑 Delete</button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Edit Modal */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>Edit Task</h2>
            <form onSubmit={handleUpdate}>
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
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
              >
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
              <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
                <button type="submit">💾 Save</button>
                <button type="button" onClick={() => setShowModal(false)}>
                  ❌ Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
