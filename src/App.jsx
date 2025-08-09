import { useEffect, useState } from "react";

function App() {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    fetch("https://daily-task-scheduler-backend.onrender.com/tasks")
      .then(res => res.json())
      .then(data => {
        console.log("Fetched data type:", Array.isArray(data) ? "Array" : typeof data);
        console.log("Fetched data content:", data);
        setTasks(data);
      })
      .catch(err => console.error("Error fetching tasks:", err));
  }, []);

  return (
    <div>
      <h1>Daily Task Scheduler</h1>
      {tasks.length > 0 ? (
        <ul>
          {tasks.map(task => (
            <li key={task._id}>
              <strong>{task.title}</strong> - {task.description}
            </li>
          ))}
        </ul>
      ) : (
        <p>No tasks found.</p>
      )}
    </div>
  );
}

export default App;
