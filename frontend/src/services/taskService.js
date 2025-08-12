import React, { useState, useEffect } from "react";

function TaskManager({ user }) {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    Status: "Pending",
  });

  useEffect(() => {
    if (user?.id) {
      fetchTasks();
    }
  }, [user]);

  const fetchTasks = async () => {
    setLoading(true);
    setError("");
    try {
      const token = localStorage.getItem("authToken");
      const res = await fetch(`http://localhost:3001/api/tasks/${user.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.message || "Failed to fetch tasks");
      } else {
        setTasks(data);
      }
    } catch (err) {
      setError("Error fetching tasks");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((fd) => ({ ...fd, [name]: value }));
  };

  const resetForm = () => {
    setFormData({ title: "", description: "", Status: "Pending" });
    setEditingTask(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title.trim() || !formData.description.trim()) {
      setError("Title and Description are required.");
      return;
    }

    setError("");
    setLoading(true);

    try {
      const token = localStorage.getItem("authToken");
      let url = "http://localhost:3001/api/tasks/";
      let method = "POST";

      if (editingTask) {
        url = `http://localhost:3001/api/tasks/update/${editingTask._id}`;
        method = "PUT";
      }

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: formData.title,
          description: formData.description,
          Status: formData.Status, 
          userid: user.id.toString(),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Failed to save task");
      } else {
        fetchTasks(); // refresh task list
        resetForm();
        setShowForm(false);
      }
    } catch (err) {
      setError("Server error while saving task");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (task) => {
    setEditingTask(task);
    setFormData({
      title: task.title,
      description: task.description,
      Status: task.Status,
    });
    setShowForm(true);
    setError("");
  };

  const handleDelete = async (taskId) => {
    if (!window.confirm("Are you sure you want to delete this task?")) return;

    setLoading(true);
    setError("");

    try {
      const token = localStorage.getItem("authToken");
      const res = await fetch(`http://localhost:3001/api/tasks/${taskId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.message || "Failed to delete task");
      } else {
        fetchTasks();
      }
    } catch (err) {
      setError("Server error while deleting task");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  
  const handleAddNewClick = () => {
    resetForm();
    setShowForm(true);
    setError("");
  };

  return (
    <div style={{ padding: "20px", maxWidth: "700px", margin: "auto" }}>
      <h1>{user.name}'s Task Manager</h1>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {/* Add New Task button always visible */}
      <button onClick={handleAddNewClick} style={addTaskBtnStyle}>
        Add New Task
      </button>

      {showForm && (
        <form onSubmit={handleSubmit} style={{ marginTop: "20px", marginBottom: "30px" }}>
          <h3>{editingTask ? "Edit Task" : "Add New Task"}</h3>

          <label>
            Title:
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              style={inputStyle}
              required
            />
          </label>

          <label>
            Description:
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              style={textareaStyle}
              required
            />
          </label>

          <label>
            Status:
            <select
              name="Status"
              value={formData.Status}
              onChange={handleInputChange}
              style={inputStyle}
            >
              <option>Pending</option>
              <option>Completed</option>
            </select>
          </label>

          <button type="submit" disabled={loading} style={btnStyle}>
            {loading ? "Saving..." : editingTask ? "Update Task" : "Add Task"}
          </button>

          <button
            type="button"
            onClick={() => {
              resetForm();
              setShowForm(false);
              setError("");
            }}
            style={{ ...btnStyle, marginLeft: "10px", backgroundColor: "#6c757d" }}
          >
            Cancel
          </button>
        </form>
      )}

      {loading && !showForm && <p>Loading tasks...</p>}

      {!loading && tasks.length === 0 && (
        <p style={{ marginTop: "20px" }}>No tasks found.</p>
      )}

      {!loading && tasks.length > 0 && (
        <table style={tableStyle}>
          <thead>
            <tr>
              <th style={tableHeaderStyle}>Title</th>
              <th style={tableHeaderStyle}>Description</th>
              <th style={tableHeaderStyle}>Status</th>
              <th style={tableHeaderStyle}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {tasks.map((task) => (
              <tr key={task._id}>
                <td style={tableCellStyle}>{task.title}</td>
                <td style={tableCellStyle}>{task.description}</td>
                <td style={tableCellStyle}>{capitalize(task.Status)}</td>
                <td style={tableCellStyle}>
                  <button
                    onClick={() => handleEdit(task)}
                    style={{ marginRight: "10px" }}
                  >
                    Edit
                  </button>
                  <button onClick={() => handleDelete(task._id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

const capitalize = (str) =>
  str ? str.charAt(0).toUpperCase() + str.slice(1).toLowerCase() : "";

const tableStyle = {
  width: "100%",
  borderCollapse: "collapse",
  marginTop: "20px",
};

const tableHeaderStyle = {
  borderBottom: "2px solid #ddd",
  padding: "10px",
  textAlign: "left",
};

const tableCellStyle = {
  borderBottom: "1px solid #ddd",
  padding: "10px",
};

const inputStyle = {
  display: "block",
  width: "100%",
  padding: "8px",
  margin: "5px 0 15px 0",
  borderRadius: "4px",
  border: "1px solid #ccc",
  fontSize: "1em",
};

const textareaStyle = {
  ...inputStyle,
  minHeight: "60px",
  resize: "vertical",
};

const btnStyle = {
  padding: "10px 20px",
  backgroundColor: "#007bff",
  color: "white",
  border: "none",
  borderRadius: "4px",
  cursor: "pointer",
  fontSize: "1em",
};

const addTaskBtnStyle = {
  marginTop: "15px",
  padding: "10px 20px",
  backgroundColor: "#28a745",
  color: "white",
  border: "none",
  borderRadius: "5px",
  cursor: "pointer",
};

export default TaskManager;
