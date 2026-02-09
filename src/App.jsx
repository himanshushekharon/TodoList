import React, { useState } from "react";
import "./App.css";

function App() {
  const [tasks, setTasks] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [filter, setFilter] = useState("all");
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState("");

  const addTask = () => {
    if (!inputValue.trim()) return;
    setTasks([
      ...tasks,
      { id: Date.now(), text: inputValue, completed: false }
    ]);
    setInputValue("");
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter((t) => t.id !== id));
  };

  const toggleComplete = (id) => {
    setTasks(
      tasks.map((t) =>
        t.id === id ? { ...t, completed: !t.completed } : t
      )
    );
  };

  const startEdit = (id, text) => {
    setEditingId(id);
    setEditText(text);
  };

  const saveEdit = () => {
    setTasks(
      tasks.map((t) =>
        t.id === editingId ? { ...t, text: editText } : t
      )
    );
    setEditingId(null);
    setEditText("");
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditText("");
  };

  const filteredTasks = tasks.filter((t) => {
    if (filter === "pending") return !t.completed;
    if (filter === "completed") return t.completed;
    return true;
  });

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.completed).length;

  return (
    <div className="app-container">
      <div className="app">
        <h1>Todo List</h1>

        {/* Stats */}
        <div className="stats">
          <div className="stat-box">
            <h3>Total Tasks</h3>
            <p>{totalTasks}</p>
          </div>
          <div className="stat-box">
            <h3>Completed Tasks</h3>
            <p>{completedTasks}</p>
          </div>
        </div>

        {/* Add Task */}
        <div className="input-section">
          <input
            type="text"
            placeholder="Add new task"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addTask()}
          />
          <button onClick={addTask}>Add</button>
        </div>

        {/* Filters */}
        <div className="filters">
          <button onClick={() => setFilter("all")}>All</button>
          <button onClick={() => setFilter("pending")}>Pending</button>
          <button onClick={() => setFilter("completed")}>Completed</button>
        </div>

        {/* Task List */}
        <ul>
          {filteredTasks.map((task) => (
            <li key={task.id} className="task">
              {editingId === task.id ? (
                <>
                  <input
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                  />
                  <button onClick={saveEdit}>Save</button>
                  <button onClick={cancelEdit}>Cancel</button>
                </>
              ) : (
                <>
                  <input
                    type="checkbox"
                    checked={task.completed}
                    onChange={() => toggleComplete(task.id)}
                  />
                  <span className={task.completed ? "done" : ""}>
                    {task.text}
                  </span>
                  <button onClick={() => startEdit(task.id, task.text)}>
                    Edit
                  </button>
                  <button onClick={() => deleteTask(task.id)}>
                    Delete
                  </button>
                </>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default App;
