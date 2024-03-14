import React, { useState } from "react";
import { Link } from "react-router-dom";

const Header = ({ onLogout, clearFormData }) => {
  const [menuOpen, setMenuOpen] = useState(false);

  const handleCreateTaskClick = () => {
    // Call the clearFormData function to clear the form data
    clearFormData();
    // Close the menu after clicking "Create Task"
    setMenuOpen(false);
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const closeMenu = () => {
    setMenuOpen(false);
  };

  return (
    <header className="bg-blue-500 text-white py-4">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
        <h1 className="text-xl font-bold">Task Manager</h1>
        <nav className="flex flex-wrap items-center">
          {/* Dropdown menu for navigation */}
          <div className="relative">
            <button
              onClick={toggleMenu}
              className="text-white py-2 px-3 lg:hidden"
            >
              Menu
            </button>
            {menuOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10">
                <Link
                  to="/"
                  className="block w-full text-left px-4 py-2 text-sm text-gray-800 hover:bg-gray-100"
                  onClick={closeMenu}
                >
                  Home
                </Link>
                <Link
                  to="/create-task"
                  onClick={handleCreateTaskClick}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-800 hover:bg-gray-100"
                >
                  Create Task
                </Link>
                <button
                  onClick={() => {
                    onLogout();
                    closeMenu();
                  }}
                  className="block w-full text-left px-4 py-2 text-sm text-red-800 hover:bg-gray-100"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
          {/* Regular navigation items for larger screens */}
          <Link to="/" className="hidden lg:block mr-4">
            Home
          </Link>
          <Link
            to="/create-task"
            className="hidden lg:block mr-4"
            onClick={handleCreateTaskClick}
          >
            Create Task
          </Link>
          <button
            onClick={() => {
              onLogout();
              closeMenu();
            }}
            className="hidden lg:block bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-md text-sm sm:text-base"
          >
            Logout
          </button>
        </nav>
      </div>
    </header>
  );
};

export default Header;
