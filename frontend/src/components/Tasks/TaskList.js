import React, { useEffect, useState } from "react";
import { getTasks, deleteTask, updateTask } from "../../services/taskService";

const TaskList = ({ userId, refreshTrigger }) => {
  const [tasks, setTasks] = useState([]);
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [editedName, setEditedName] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const data = await getTasks(userId);
        setTasks(data);
      } catch {
        setError("Failed to load tasks");
      }
    };
    if (userId) fetchTasks();
  }, [userId, refreshTrigger]);

  const handleDelete = async (taskId) => {
    try {
      await deleteTask(taskId);
      setTasks(tasks.filter((task) => task._id !== taskId));
    } catch {
      setError("Failed to delete task");
    }
  };

  const startEditing = (task) => {
    setEditingTaskId(task._id);
    setEditedName(task.name);
  };

  const cancelEditing = () => {
    setEditingTaskId(null);
    setEditedName("");
  };

  const saveEdit = async (taskId) => {
    try {
      await updateTask(taskId, { name: editedName });
      setTasks(
        tasks.map((task) =>
          task._id === taskId ? { ...task, name: editedName } : task
        )
      );
      cancelEditing();
    } catch {
      setError("Failed to update task");
    }
  };

  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div>
      <h2>Your Tasks</h2>
      <ul>
        {tasks.length ? (
          tasks.map((task) => (
            <li key={task._id}>
              {editingTaskId === task._id ? (
                <>
                  <input
                    type="text"
                    value={editedName}
                    onChange={(e) => setEditedName(e.target.value)}
                  />
                  <button onClick={() => saveEdit(task._id)}>Save</button>
                  <button onClick={cancelEditing}>Cancel</button>
                </>
              ) : (
                <>
                  {task.name}{" "}
                  <button onClick={() => startEditing(task)}>Edit</button>
                  <button onClick={() => handleDelete(task._id)}>Delete</button>
                </>
              )}
            </li>
          ))
        ) : (
          <li>No tasks found</li>
        )}
      </ul>
    </div>
  );
};

export default TaskList;
