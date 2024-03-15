import React from "react";
import { renderPriority } from "../utilFunctions";

const TaskDetailModal = ({
  title,
  dueDate,
  priority,
  description,
  dateMessage,
  isDueDateNear,
  handleCloseModal,
}) => {
  // useEffect(() => {
  //   const differenceInDays = calculateDifferenceInDays(dueDate);
  //   if (differenceInDays < 0) {
  //     setIsDueDateNear(true);
  //     setDateMessage("This task is overdue");
  //   } else if (differenceInDays === 0) {
  //     // Due date is today or overdue
  //     setIsDueDateNear(true);
  //     setDateMessage("This task's due date is today");
  //   } else if (differenceInDays === 1) {
  //     // Due date is tomorrow
  //     setIsDueDateNear(true);
  //     setDateMessage("This task's due date is approaching! It's due tomorrow");

  //     notifyUser(title, `The task "${title}" is due tomorrow`, token);
  //   } else {
  //     // Due date is not near
  //     setIsDueDateNear(false);
  //   }
  //   // eslint-disable-next-line
  // }, []);

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75">
      <div className="bg-white rounded-lg w-full max-w-md mx-4 md:mx-auto">
        <div className="p-6">
          <h2 className="text-xl font-bold mb-4">{title}</h2>
          <div className="mb-4">
            <strong>Description:</strong>
          </div>
          <div className="border border-gray-300 p-4 mb-4 h-32 overflow-y-auto">
            {description}
          </div>
          <p>
            <strong>Due Date:</strong> {dueDate}
          </p>
          <p>{renderPriority(priority)}</p>
          {isDueDateNear && <div className="text-red-600">{dateMessage}</div>}
        </div>
        <div className="bg-gray-100 px-6 py-4 flex justify-end">
          <button
            onClick={handleCloseModal}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors duration-300"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaskDetailModal;
