import { useCallback } from "react"; // Import useCallback from 'react'
import instance from "../axiosInstance";
import { sendNotification } from "../firebase";

export default function useProcessQueuedFormRequests() {
  return useCallback(async (selectedRecord, userId, fcmToken, navigate) => {
    const queuedFormRequests =
      JSON.parse(localStorage.getItem("queueFormRequest")) || [];
    await Promise.all(
      queuedFormRequests.map(async (request) => {
        try {
          const endpoint = selectedRecord
            ? `/api/tasks/${selectedRecord._id}?user=${userId}`
            : `/api/tasks?user=${userId}`;
          const method = selectedRecord ? "put" : "post";
          await instance[method](endpoint, request); // Use request instead of queuedFormRequests
          selectedRecord((tasks) =>
            tasks.filter((task) => task.userId !== request.userId)
          );
          sendNotification(
            selectedRecord ? selectedRecord.title : null,
            `Queued ${
              selectedRecord ? "update" : "create"
            } request processed successfully.`,
            fcmToken
          );
          navigate("/");
        } catch (error) {
          console.error(
            `Error processing queued ${
              selectedRecord ? "update" : "create"
            } request:`,
            error
          );
          sendNotification(
            selectedRecord ? selectedRecord.title : null,
            `Queued ${
              selectedRecord ? "update" : "create"
            } request processed successfully.`,
            fcmToken
          );
        }
      })
    );
    localStorage.removeItem("queueFormRequest");
  }, []);
}
// Function to determine priority color
export const getPriorityColor = (priority) => {
  switch (priority) {
    case "High":
      return "text-red-600";
    case "Medium":
      return "text-yellow-600";
    case "Low":
      return "text-green-600";
    default:
      return "";
  }
};

export function formatDate(dateString) {
  const options = { year: "numeric", month: "long", day: "numeric" };
  return new Date(dateString).toLocaleDateString(undefined, options);
}

// Function to render priority text with color
export const renderPriority = (priority) => {
  const priorityColor = getPriorityColor(priority);
  return (
    <div>
      <strong>Priority:</strong>{" "}
      <span className={priorityColor}>{priority}</span>
    </div>
  );
};

// Function to format due date
export const formattedDueDate = (dueDate) => {
  return dueDate ? new Date(dueDate).toISOString().split("T")[0] : "";
};

// Day difference
export const calculateDifferenceInDays = (date) => {
  const today = new Date();
  const oneDay = 24 * 60 * 60 * 1000; // milliseconds in a day
  const dueDateTime = new Date(date).getTime();
  return Math.round((dueDateTime - today.getTime()) / oneDay);
};

export const notifyUser = (title, body, token) => {
  // Check if the browser supports notifications
  if (!("Notification" in window)) {
    console.error("This browser does not support desktop notification");
    return;
  }

  // Check if permission to display notifications has been granted
  if (Notification.permission === "granted") {
    // If permission has been granted, create a notification
    sendNotification(title, body, token);
  } else if (Notification.permission !== "denied") {
    // Otherwise, request permission from the user
    Notification.requestPermission().then(function (permission) {
      // If the user grants permission, create a notification
      if (permission === "granted") {
        sendNotification(title, body, token);
      }
    });
  }
};
