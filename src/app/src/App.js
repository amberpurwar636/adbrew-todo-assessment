import React, { useState, useEffect } from 'react';
import './App.css';

const App = () => {
  const [todos, setTodos] = useState([]);
  const [task, setTask] = useState('');

  // Injected GitHub Codespaces URL fallback
  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/todos/';

  const fetchTodos = async () => {
    try {
      const res = await fetch(API_URL);
      if (res.ok) {
        const data = await res.json();
        setTodos(data);
      }
    } catch (err) {
      console.error("GET Error:", err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!task.trim()) return;

    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json' // Only this is needed for POSTs
        },
        body: JSON.stringify({ title: task }),
      });

      if (res.ok) {
        setTask('');
        fetchTodos(); 
      }
    } catch (err) {
      console.error("POST Error:", err);
    }
  };

  return (
    <div className="App">
      <section className="todo-list">
        <h1>List of TODOs</h1>
        <ul>
          {todos.map(todo => (
            <li key={todo._id || todo.id}>{todo.title}</li>
          ))}
        </ul>
      </section>

      <section className="create-todo">
        <h1>Create a ToDo</h1>
        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="todo">ToDo: </label>
            <input 
              id="todo"
              type="text" 
              value={task} 
              placeholder="What needs to be done?"
              onChange={(e) => setTask(e.target.value)} 
            />
          </div>
          <button type="submit" style={{ marginTop: 10 }}>
            Add ToDo!
          </button>
        </form>
      </section>
    </div>
  );
};

export default App;