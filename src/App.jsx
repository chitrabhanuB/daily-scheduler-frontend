import { useEffect, useState } from "react";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

function App() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("Medium");
  const [deadline, setDeadline] = useState("");
  const [triggeredTasks, setTriggeredTasks] = useState([]);

  // Load tasks from backend
  async function loadTasks() {
    try {
      const res = await fetch(`${API_URL}/tasks`);
      const data = await res.json();
      setTasks(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error loading tasks", err);
    }
  }

  // Add task
  async function addTask(e) {
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
          deadline: deadline ? new Date(deadline) : null
        })
      });
      if (res.ok) {
        setTitle("");
        setDescription("");
        setPriority("Medium");
        setDeadline("");
        loadTasks();
      }
    } catch (err) {
      console.error("Error adding task", err);
    }
  }

  // Toggle completion
  async function toggleTask(id, completed) {
    try {
      const res = await fetch(`${API_URL}/tasks/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ completed })
      });
      if (res.ok) {
        loadTasks();
      }
    } catch (err) {
      console.error("Error updating task", err);
    }
  }

  // Delete task
  async function deleteTask(id) {
    try {
      const res = await fetch(`${API_URL}/tasks/${id}`, { method: "DELETE" });
      if (res.ok) {
        loadTasks();
      }
    } catch (err) {
      console.error("Error deleting task", err);
    }
  }

  // Request notification permission
  useEffect(() => {
    if ("Notification" in window) {
      Notification.requestPermission().then((perm) => {
        if (perm !== "granted") {
          console.warn("Notifications are disabled by the user.");
        }
      });
    }
    loadTasks();
  }, []);

  // Check deadlines and trigger notifications
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      tasks.forEach((task) => {
        if (
          task.deadline &&
          !task.completed &&
          !triggeredTasks.includes(task._id)
        ) {
          const taskTime = new Date(task.deadline);
          if (now >= taskTime) {
            if ("Notification" in window && Notification.permission === "granted") {
              new Notification("Task Reminder", {
                body: `${task.title} - ${task.description || "No description"}`,
                icon: "/icon.png" // optional
              });
            }
            setTriggeredTasks((prev) => [...prev, task._id]);
          }
        }
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [tasks, triggeredTasks]);

  return (
    <div className="app">
      <h1>Cloud Task Scheduler</h1>

      {/* Add Task Form */}
      <form onSubmit={addTask}>
        <input
          type="text"
          placeholder="Task title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        ></textarea>
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
        <button type="submit">Add Task</button>
      </form>

      {/* Task List */}
      <ul>
        {tasks.map((task) => (
          <li
            key={task._id}
            style={{
              borderLeft:
                task.priority === "High"
                  ? "5px solid red"
                  : task.priority === "Medium"
                  ? "5px solid orange"
                  : "5px solid green",
              padding: "5px",
              margin: "5px 0"
            }}
          >
            <h3>
              {task.title}{" "}
              {task.completed && <span style={{ color: "green" }}>✔</span>}
            </h3>
            <p>{task.description}</p>
            <p>Priority: {task.priority}</p>
            {task.deadline && (
              <p>Deadline: {new Date(task.deadline).toLocaleString()}</p>
            )}
            <button onClick={() => toggleTask(task._id, !task.completed)}>
              {task.completed ? "Mark as Open" : "Mark as Done"}
            </button>
            <button onClick={() => deleteTask(task._id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
