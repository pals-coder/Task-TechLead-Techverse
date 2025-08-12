import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./components/Auth/Login";
import Register from "./services/registerService";
import TaskManager from "./services/taskService";
import TaskDetail from './pages/TaskDetail';

function App() {
  const [user, setUser] = useState(null);

  
  const handleLogin = (userData) => {
    setUser(userData);
  };

  const handleLogout = () => {
    setUser(null);
  };

  return (
    <Router>
      <div>
        <nav style={navStyle}>
  <h2 style={{ color: "white" }}>TaskApp</h2>

  {user ? (
    <div style={linkContainerStyle}>
      <button onClick={handleLogout} style={buttonStyle}>Logout</button>
      <a href="/report" style={linkStyle}>Task Report</a>
    </div>
  ) : (
    <div style={linkContainerStyle}>
      <a href="/report" style={linkStyle}>Task Report</a>
      <a href="/register" style={linkStyle}>Register</a>
      <a href="/login" style={linkStyle}>Login</a>
    </div>
  )}
</nav>


        <Routes>
          <Route
            path="/"
            element={user ? <TaskManager /> : <Navigate to="/login" replace />}
          />
          <Route path="/login" element={<Login onLogin={handleLogin} />} />
          <Route path="/register" element={<Register onRegister={handleLogin} />} />
          <Route
          path="/tasks"
          element={user ? <TaskManager user={user} /> : <Navigate to="/login" replace />}
        />
         <Route path="/report" element={<TaskDetail />} />
        </Routes>
      </div>
    </Router>
  );
}

const navStyle = {
  backgroundColor: "#333",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "10px 20px",
};

const linkStyle = {
  color: "white",
  textDecoration: "none",
  marginLeft: "15px",
  fontWeight: "bold",
};

const buttonStyle = {
  backgroundColor: "#ff4d4d",
  border: "none",
  color: "white",
  padding: "8px 15px",
  cursor: "pointer",
  fontWeight: "bold",
};

const linkContainerStyle = {
  display: 'flex',
  gap: '15px',  // space between links
};
export default App;
