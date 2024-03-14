import React, { useEffect } from "react";

function Alert({ message, onClose }) {
  useEffect(() => {
    const timeout = setTimeout(() => {
      onClose();
    }, 5000);

    return () => clearTimeout(timeout);
  }, [onClose]);

  return (
    <div
      className={`py-2 px-4 mb-4 rounded ${
        message?.includes("successfully") || message?.includes("Created")
          ? "bg-green-200 text-green-800"
          : "bg-red-200 text-red-800"
      }`}
    >
      {message}
    </div>
  );
}

export default Alert;
