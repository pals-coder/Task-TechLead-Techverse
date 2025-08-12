import React, { useEffect, useState } from 'react';
import $ from 'jquery';
import { addTask } from '../../services/taskService';

const TaskForm = ({ userId, onTaskAdded }) => {
  const [name, setName] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    $('#taskForm').validate({
      rules: {
        name: {
          required: true,
          minlength: 3,
        },
      },
      messages: {
        name: {
          required: "Please enter task name",
          minlength: "Task name must be at least 3 characters",
        },
      },
      submitHandler: () => handleSubmit(),
    });
  }, []);

  const handleSubmit = async () => {
    try {
      const task = { userId, name, status: 'pending' };
      await addTask(task);
      setName('');
      onTaskAdded();
    } catch (err) {
      setError('Failed to add task');
    }
  };

  return (
    <form id="taskForm">
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <div>
        <label>Task Name:</label>
        <input
          type="text"
          name="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>
      <button type="submit">Add Task</button>
    </form>
  );
};

export default TaskForm;
