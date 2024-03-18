import React, { useCallback, useEffect, useState } from "react";
import { FiEdit, FiTrash2 } from "react-icons/fi";
import { Link, useNavigate } from "react-router-dom";
import instance from "../axiosInstance";
import { requestForToken, sendNotification } from "../firebase";
import Alert from "./Alert/Alert";
import TaskDetailModal from "./Modal/TaskDetailModal";
import useProcessQueuedFormRequests, {
  calculateDifferenceInDays,
  formatDate,
} from "./utilFunctions";
function TaskList({ selectedRecord, setSelectedRecord, clearFormData }) {
  const [tasks, setTasks] = useState([]);
  const [selectedTask, setSelectedTask] = useState(null);
  const [alert, setAlert] = useState(null);
  const [loading, setLoading] = useState(true);
  const [fcmToken, setFcmToken] = useState(null);
  const [isDueDateNear, setIsDueDateNear] = useState(false);
  const [dateMessage, setDateMessage] = useState("");

  const navigate = useNavigate();
  const userId = localStorage.getItem("userId");
  const processQueuedFormRequests = useProcessQueuedFormRequests();

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await instance.get(`/api/tasks?user=${userId}`);
        setTasks(response.data);
        localStorage.setItem("listData", JSON.stringify(response.data));
        setLoading(false);
      } catch (error) {
        console.error("Error fetching tasks:", error);
        let collection = localStorage.getItem("listData");
        setTasks(JSON.parse(collection));
        // Handle error, maybe set an alert or retry mechanism
        setLoading(false);
      }
    };

    requestForToken(setFcmToken);
    return () => {
      fetchTasks();
    };
  }, [userId]);
  useEffect(() => {
    return () => {
      processQueuedFormRequests(selectedRecord, userId, fcmToken, navigate);
    };
    // eslint-disable-next-line
  }, []);

  const processQueuedDeleteRequests = useCallback(async () => {
    const queuedDeleteRequests =
      JSON.parse(localStorage.getItem("queuedDeleteRequests")) || [];
    await Promise.all(
      queuedDeleteRequests.map(async (request) => {
        try {
          await instance.delete(
            `/api/tasks/${request.taskId}?user=${request.userId}`
          );
          setTasks((tasks) =>
            tasks.filter((task) => task._id !== request.taskId)
          );
          sendNotification(
            null,
            "Queued delete request processed successfully.",
            fcmToken
          );
        } catch (error) {
          console.error("Error processing queued delete request:", error);
          sendNotification(
            null,
            "Queued delete request processed successfully.",
            fcmToken
          );
        }
      })
    );
    localStorage.removeItem("queuedDeleteRequests");
    // eslint-disable-next-line
  }, []);
  useEffect(() => {
    processQueuedDeleteRequests();
    // eslint-disable-next-line
  }, []);

  const handleDelete = async (taskName, taskId, userId) => {
    try {
      if (navigator.onLine) {
        await instance.delete(`/api/tasks/${taskId}?user=${userId}`);
        setTasks(tasks.filter((task) => task._id !== taskId));
        sendNotification(taskName, "Task Deleted", fcmToken);
        setSelectedTask(null);
      } else {
        const queuedDeleteRequests =
          JSON.parse(localStorage.getItem("queuedDeleteRequests")) || [];
        queuedDeleteRequests.push({ taskId, userId });
        localStorage.setItem(
          "queuedDeleteRequests",
          JSON.stringify(queuedDeleteRequests)
        );
        setAlert("Delete request queued for later.");
      }
    } catch (error) {
      console.error("Error deleting task:", error);
      sendNotification(
        null,
        "Failed to delete task. Please try again later.",
        fcmToken
      );
    }
  };

  const handleTitleClick = (task) => {
    setSelectedTask(task);
  };

  const handleAlertClose = () => {
    setAlert(null);
  };

  const handleCreateTaskClick = () => {
    if (!selectedTask) {
      clearFormData();
    }
  };

  const handleCloseModal = () => {
    setSelectedTask(null);
  };
  useEffect(() => {
    tasks.forEach((task) => {
      const differenceInDays = calculateDifferenceInDays(task.dueDate);
      const title = task.title;

      if (differenceInDays === 1) {
        // Due date is tomorrow
        setIsDueDateNear(true);
        setDateMessage(`The task ${title} is due tomorrow`);
        sendNotification(
          title,
          `The task "${title}" is due tomorrow`,
          fcmToken
        );
      } else if (differenceInDays === 0) {
        // Due date is today or overdue
        setIsDueDateNear(true);
        setDateMessage(`The task ${title} is due today`);
        sendNotification(title, `The task "${title}" is due today`, fcmToken);
      } else if (differenceInDays < 0) {
        // Task is overdue
        setDateMessage(`The task ${title} is overdue`);
        sendNotification(title, `The task "${title}" is overdue`, fcmToken);
      } else {
        setIsDueDateNear(false);
      }
    });
    // eslint-disable-next-line
  }, [tasks]);

  return (
    <div className="container mx-auto p-4 md:p-12">
      <h2 className="mb-3 text-2xl font-bold text-gray-800">Task List</h2>
      <div className="my-4 bg-white p-4 rounded-lg shadow-md overflow-x-auto">
        {alert && <Alert message={alert} onClose={handleAlertClose} />}
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100">
              <th>#</th>
              <th>Title</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading
              ? loading
              : tasks.map((task, index) => (
                  <tr
                    key={task._id}
                    className={index % 2 === 1 ? "bg-gray-100" : ""}
                  >
                    <td className="text-center">{++index}</td>
                    <td
                      onClick={() => handleTitleClick(task)}
                      className="cursor-pointer text-center text-gray-700 hover:text-blue-500 md:text-center md:truncate"
                    >
                      {task.title}
                    </td>
                    <td className="text-center gap-2 flex justify-center">
                      <Link
                        to={`/create-task`}
                        onClick={() => setSelectedRecord(task)}
                        className="hidden md:inline-block px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors duration-300"
                      >
                        Edit
                      </Link>
                      <button
                        className="hidden md:inline-block px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors duration-300"
                        onClick={() =>
                          handleDelete(task.title, task._id, task.userId)
                        }
                      >
                        Delete
                      </button>
                      {/* Mobile View */}
                      <div className="md:hidden flex gap-2">
                        <Link
                          onClick={() => {
                            setSelectedRecord(task);
                          }}
                          to={`/create-task`}
                        >
                          <FiEdit className="cursor-pointer text-blue-500 hover:text-blue-700" />
                        </Link>
                        <FiTrash2
                          className="cursor-pointer text-red-500 hover:text-red-700"
                          onClick={() =>
                            handleDelete(task.title, task._id, task.userId)
                          }
                        />
                      </div>
                    </td>
                  </tr>
                ))}
          </tbody>
        </table>
        {selectedTask && (
          <TaskDetailModal
            dateMessage={dateMessage}
            title={selectedTask.title}
            isDueDateNear={isDueDateNear}
            description={selectedTask.description}
            dueDate={formatDate(selectedTask.dueDate)}
            priority={selectedTask.priority}
            handleCloseModal={handleCloseModal}
          />
        )}
      </div>
      <Link
        to="/create-task"
        onClick={handleCreateTaskClick}
        className="block w-full py-2 px-4 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors text-center duration-300"
      >
        Create New Task
      </Link>
    </div>
  );
}

export default TaskList;
