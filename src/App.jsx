import React, { useState, useEffect, useMemo } from "react";
import { 
  Plus, 
  Trash2, 
  Check, 
  Calendar, 
  Search, 
  ListChecks,
  Edit3,
  CheckCircle,
  LayoutDashboard
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import "./App.css";

function App() {
  // Persistence logic
  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem("zen_tasks_v2");
    if (!saved) return [];
    try {
      return JSON.parse(saved);
    } catch (e) {
      return [];
    }
  });

  const [inputValue, setInputValue] = useState("");
  const [priority, setPriority] = useState("medium");
  const [category, setCategory] = useState("personal");
  const [dueDate, setDueDate] = useState("");
  
  const [filter, setFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState("");

  useEffect(() => {
    localStorage.setItem("zen_tasks_v2", JSON.stringify(tasks));
  }, [tasks]);

  const addTask = () => {
    if (!inputValue.trim()) return;
    
    const newTask = {
      id: Date.now(),
      text: inputValue,
      completed: false,
      priority,
      category,
      dueDate: dueDate || new Date().toISOString().split('T')[0],
      createdAt: new Date().toISOString()
    };
    
    setTasks([newTask, ...tasks]);
    setInputValue("");
    setDueDate("");
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

  const startEdit = (task) => {
    setEditingId(task.id);
    setEditText(task.text);
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

  const filteredTasks = useMemo(() => {
    return tasks
      .filter((t) => {
        if (filter === "pending") return !t.completed;
        if (filter === "completed") return t.completed;
        return true;
      })
      .filter((t) => 
        (t.text || "").toLowerCase().includes(searchQuery.toLowerCase())
      );
  }, [tasks, filter, searchQuery]);

  const stats = useMemo(() => {
    const total = tasks.length;
    const completed = tasks.filter(t => t.completed).length;
    const pending = total - completed;
    const progress = total === 0 ? 0 : Math.round((completed / total) * 100);
    
    return { total, completed, pending, progress };
  }, [tasks]);

  return (
    <div className="app-container">
      <header className="header">
        <motion.h1 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          Zen Tasks
        </motion.h1>
        <p>A minimalist workspace for your daily goals.</p>
      </header>

      <main>
        {/* Stats Grid */}
        <div className="dashboard-grid">
          <div className="stat-item">
            <span className="stat-label">Total</span>
            <span className="stat-value">{stats.total}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Done</span>
            <span className="stat-value" style={{ color: 'var(--success)' }}>{stats.completed}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Wait</span>
            <span className="stat-value" style={{ color: 'var(--warning)' }}>{stats.pending}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Goal</span>
            <span className="stat-value" style={{ color: 'var(--primary)' }}>{stats.progress}%</span>
          </div>
        </div>

        {/* Overall Progress */}
        <div className="progress-container">
          <div className="progress-label">
            <span>Productivity Progress</span>
            <span>{stats.progress}%</span>
          </div>
          <div className="progress-bar-bg">
            <motion.div 
              className="progress-bar-fill" 
              initial={{ width: 0 }}
              animate={{ width: `${stats.progress}%` }}
              transition={{ duration: 1 }}
            />
          </div>
        </div>

        {/* Input Card */}
        <section className="input-group">
          <div className="main-input-wrapper">
            <input
              type="text"
              className="todo-input"
              placeholder="Start typing a task..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addTask()}
            />
            <button className="add-btn" onClick={addTask}>
              <Plus size={18} strokeWidth={3} />
              Create Task
            </button>
          </div>
          
          <div className="input-options">
            <select 
              className="option-select"
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
            >
              <option value="low">Priority: Low</option>
              <option value="medium">Priority: Medium</option>
              <option value="high">Priority: High</option>
            </select>
            
            <select 
              className="option-select"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="personal">Personal</option>
              <option value="work">Work</option>
              <option value="urgent">Urgent</option>
            </select>
            
            <input 
              type="date" 
              className="option-select"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
            />
          </div>
        </section>

        {/* Search & Filter */}
        <div className="controls">
          <div className="filter-tabs">
            {['all', 'pending', 'completed'].map((f) => (
              <button
                key={f}
                className={`filter-tab ${filter === f ? 'active' : ''}`}
                onClick={() => setFilter(f)}
              >
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))}
          </div>
          
          <div className="search-box">
            <Search className="search-icon" size={16} />
            <input 
              type="text" 
              placeholder="Find tasks..." 
              className="search-input"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Task List */}
        <div className="task-list">
          <AnimatePresence mode="popLayout">
            {filteredTasks.length > 0 ? (
              filteredTasks.map((task) => (
                <motion.div
                  key={task.id}
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className={`task-item ${task.completed ? 'completed' : ''}`}
                >
                  <div className="checkbox-click" onClick={() => toggleComplete(task.id)}>
                    {task.completed && <Check size={14} color="white" strokeWidth={4} />}
                  </div>

                  <div className="task-content">
                    {editingId === task.id ? (
                      <input
                        autoFocus
                        className="todo-input"
                        value={editText}
                        onChange={(e) => setEditText(e.target.value)}
                        onBlur={saveEdit}
                        onKeyDown={(e) => e.key === "Enter" && saveEdit()}
                        style={{ padding: '0.25rem 0.5rem', marginBottom: 0 }}
                      />
                    ) : (
                      <>
                        <span className="task-text">{task.text}</span>
                        <div className="task-meta">
                          <span className={`badge priority-${task.priority}`}>{task.priority}</span>
                          <span className="task-date">
                            <Calendar size={12} />
                            {task.dueDate}
                          </span>
                        </div>
                      </>
                    )}
                  </div>

                  <div className="task-actions">
                    <button className="action-btn" onClick={() => startEdit(task)}>
                      <Edit3 size={16} />
                    </button>
                    <button className="action-btn delete-btn" onClick={() => deleteTask(task.id)}>
                      <Trash2 size={16} />
                    </button>
                  </div>
                </motion.div>
              ))
            ) : (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="empty-state">
                <LayoutDashboard className="empty-icon" size={64} />
                <p>{searchQuery ? "No tasks match your search." : "No tasks yet. Create one to get started!"}</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      <footer style={{ textAlign: 'center', marginTop: '4rem', color: 'var(--text-muted)', fontSize: '0.825rem' }}>
        <p>Built with Zen philosophy • © 2026</p>
      </footer>
    </div>
  );
}

export default App;
