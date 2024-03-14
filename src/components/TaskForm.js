import { Button } from "@windmill/react-ui";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { queueFormRequest } from "../Offline"; // Import the queueFormRequest function
import instance from "../axiosInstance";
import { requestForToken, sendNotification } from "../firebase";
import Alert from "./Alert/Alert";
import { formattedDueDate } from "./utilFunctions";

function TaskForm({ selectedRecord }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [priority, setPriority] = useState("");
  const [fcmToken, setFcmToken] = useState(null);
  const userId = localStorage.getItem("userId");
  const [alertMessage, setAlertMessage] = useState(null);
  const [formSubmittedOffline, setFormSubmittedOffline] = useState(false);

  const navigate = useNavigate();
  // Function to populate form data from selectedRecord
  const populateFormData = (record) => {
    if (record) {
      setTitle(record.title || "");
      setDescription(record.description || "");
      setDueDate(record.dueDate || "");
      setPriority(record.priority || "");
    } else {
      clearFormData();
    }
  };
  // Effect to handle changes in selectedRecord
  useEffect(() => {
    requestForToken(setFcmToken); // Get FCM token
    populateFormData(selectedRecord); // Populate form data if selectedRecord exists
    // eslint-disable-next-line
  }, [selectedRecord]);

  // Function to clear form data
  const clearFormData = () => {
    setTitle("");
    setDescription("");
    setDueDate("");
    setPriority("");
  };

  // Function to handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    const requestData = { title, description, dueDate, priority, userId };

    try {
      if (navigator.onLine) {
        if (!formSubmittedOffline) {
          await submitTask(requestData); // Submit task if online
          setFormSubmittedOffline(false); // Reset the flag after successful submission
        }
      } else {
        if (!formSubmittedOffline) {
          queueFormRequest(requestData); // Queue request if offline
          // Optionally, inform the user that the request is queued for later submission.
          setAlertMessage("Request queued for submission when online.");
          setFormSubmittedOffline(true); // Set the flag to true to indicate form submission has been queued
        }
      }
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred. Please try again.");
    }
  };

  // Function to submit task
  const submitTask = async (requestData) => {
    try {
      const endpoint = selectedRecord
        ? `/api/tasks/${selectedRecord._id}?user=${userId}`
        : `/api/tasks?user=${userId}`;
      const method = selectedRecord ? "put" : "post";
      await instance[method](endpoint, requestData);
      sendNotification(
        selectedRecord ? selectedRecord.title : null,
        selectedRecord ? "Task Updated" : "Task Created",
        fcmToken
      );
      navigate("/"); // Navigate to home page after submission
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred. Please try again.");
    }
  };
  const handleAlertClose = () => {
    setAlertMessage(null);
  };
  return (
    <div className="container mx-auto p-4 md:p-12">
      <h2 className="mb-3 text-2xl font-bold text-gray-800">
        {selectedRecord ? "Edit" : "Create"} Task
      </h2>
      {alertMessage && (
        <Alert message={alertMessage} onClose={handleAlertClose} />
      )}
      <div className="bg-gray-100 rounded-lg shadow-md p-8">
        <form onSubmit={handleSubmit}>
          {/* Form fields */}
          {/* Title */}
          <div className="mb-4">
            <label htmlFor="title" className="block text-gray-700 mb-2">
              Title
            </label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter title"
              className="border border-gray-300 rounded-md p-2 w-full"
            />
          </div>
          {/* Description */}
          <div className="mb-4">
            <label htmlFor="description" className="block text-gray-700 mb-2">
              Description
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter description"
              className="border border-gray-300 rounded-md p-2 w-full"
            />
          </div>
          {/* Due Date */}
          <div className="mb-4">
            <label htmlFor="dueDate" className="block text-gray-700 mb-2">
              Due Date
            </label>
            <input
              id="dueDate"
              type="date"
              value={formattedDueDate(dueDate)}
              onChange={(e) => setDueDate(e.target.value)}
              className="border border-gray-300 rounded-md p-2 w-full"
            />
          </div>
          {/* Priority */}
          <div className="mb-4">
            <label htmlFor="priority" className="block text-gray-700 mb-2">
              Priority
            </label>
            <select
              id="priority"
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              className="border border-gray-300 rounded-md p-2 w-full"
            >
              <option value="">Select Priority</option>
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>
          </div>
          {/* Submit Button */}
          <Button
            type="submit"
            className="w-full bg-blue-500 hover:bg-blue-600"
            disabled={!navigator.onLine} // Disable button when offline
          >
            {selectedRecord ? "Update Task" : "Save Task"}
          </Button>
        </form>
      </div>
    </div>
  );
}

export default TaskForm;
