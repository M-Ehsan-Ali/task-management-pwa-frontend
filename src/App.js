import React, { useEffect, useState } from "react";
import {
  Navigate,
  Route,
  BrowserRouter as Router,
  Routes,
} from "react-router-dom";
import Notification from "./Notification";
import Login from "./components/Auth/Login";
import Header from "./components/Header/Header";
import TaskForm from "./components/TaskForm";
import TaskList from "./components/TaskList";
import { requestForToken, sendNotification } from "./firebase";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [fcmToken, setFcmToken] = useState(null);
  // eslint-disable-next-line
  useEffect(() => {
    requestForToken(setFcmToken);
    // Check if user is logged in by verifying the presence of the authentication token
    const token = localStorage.getItem("token");
    if (token) {
      setIsLoggedIn(true);
    }
  }, []);

  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.removeItem("listData");
    sendNotification(null, "User logout", fcmToken);
  };
  const clearFormData = () => {
    return setSelectedRecord(null);
  };
  return (
    <Router>
      <Notification />
      {isLoggedIn && (
        <Header onLogout={handleLogout} clearFormData={clearFormData} />
      )}
      <Routes>
        {/* Public Routes */}
        {!isLoggedIn ? (
          <>
            <Route
              path="/login"
              element={<Login setIsLoggedIn={setIsLoggedIn} />}
            />
            <Route path="/*" element={<Navigate to="/login" replace />} />
          </>
        ) : (
          <>
            <Route
              path="/"
              element={
                <TaskList
                  selectedRecord={selectedRecord}
                  setSelectedRecord={setSelectedRecord}
                  clearFormData={clearFormData}
                />
              }
            />
            <Route
              path="/create-task"
              element={<TaskForm selectedRecord={selectedRecord} />}
            />
            <Route path="/login" element={<Navigate to="/" replace />} />
            <Route path="/signup" element={<Navigate to="/" replace />} />
          </>
        )}
      </Routes>
    </Router>
  );
}

export default App;
