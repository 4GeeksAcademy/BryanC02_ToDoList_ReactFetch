import React, { useEffect, useState } from "react";

const Todos = () => {
  const [todo, setTodo] = useState("");
  const [todoList, setTodoList] = useState([]);
  const username = "bryanC02";

  useEffect(() => {
    // Ensure the user is created
    fetch(`https://playground.4geeks.com/todo/users/${username}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify([])
    })
      .then((res) => {
        if (!res.ok && res.status !== 400) throw new Error("User creation failed");
        return res.json();
      })
      .then(() => fetchTasks())
      .catch((err) => {
        console.error("User creation error:", err);
        fetchTasks();
      });
  }, []);

  const fetchTasks = () => {
    fetch(`https://playground.4geeks.com/todo/users/${username}`)
      .then((res) => res.json())
      .then((data) => {
        console.log("Fetched tasks:", data);
        if (Array.isArray(data.todos)) setTodoList(data.todos);
      })
      .catch((err) => console.error("Fetch error:", err));
  };

  const addTask = () => {
    if (!todo.trim()) return;

    fetch(`https://playground.4geeks.com/todo/todos/${username}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ label: todo, is_done: false })
    })
      .then(() => {
        setTodo("");
        fetchTasks();
      })
      .catch((err) => console.error("Add task error:", err));
  };

  const deleteTask = (taskId) => {
    fetch(`https://playground.4geeks.com/todo/todos/${taskId}`, {
      method: "DELETE"
    })
      .then(() => fetchTasks())
      .catch((err) => console.error("Delete task error:", err));
  };

  return (
    <div className="container mt-5">
      <h1 className="mb-3">Todo List</h1>

      <input
        className="form-control mb-3"
        type="text"
        placeholder="Add a task and press Enter"
        value={todo}
        onChange={(e) => setTodo(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && addTask()}
      />

      <ul className="list-group">
        {todoList
        .filter(task => task.label)
        .map((task) => (
          <li
            key={task.id}
            className="list-group-item d-flex justify-content-between align-items-center"
          >
            {task.label}
            <button
              className="btn btn-sm btn-danger"
              onClick={() => deleteTask(task.id)}
            >
              x
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Todos;