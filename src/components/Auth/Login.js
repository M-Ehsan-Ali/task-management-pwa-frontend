import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import instance from "../../axiosInstance"; // Import the Axios instance
import { requestForToken, sendNotification } from "../../firebase";

function AuthPage({ setIsLoggedIn }) {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [fcmToken, setFcmToken] = useState(null);
  useEffect(() => {
    requestForToken(setFcmToken);
  }, []);
  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await instance.post(
        isLogin ? "/auth/login" : "/auth/signup",
        {
          ...(isLogin ? {} : { username }),
          email,
          password,
        }
      );
      if (isLogin) {
        const { userId, token } = response.data;
        localStorage.setItem("userId", userId);
        localStorage.setItem("token", token);
        navigate("/"); // Navigate to home page only if logging in
        setIsLoggedIn(true);
        sendNotification(null, "User Logged In", fcmToken);
      } else {
        sendNotification(null, "Account Created", fcmToken);
      }
      setLoading(false);
    } catch (error) {
      console.error("Error:", error);
      if (error.response) {
        sendNotification(null, error.response.data.message, fcmToken);
      } else if (error.request) {
        sendNotification(
          null,
          "No response received. Please try again later.",
          fcmToken
        );
      } else {
        sendNotification(
          null,
          "Error setting up request. Please try again later.",
          fcmToken
        );
      }
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto mt-8 px-4 sm:px-6 lg:px-8">
      <h2 className="text-2xl font-semibold text-center mb-4">
        {isLogin ? "Login" : "Sign Up"}
      </h2>
      <form onSubmit={handleSubmit} className="max-w-sm mx-auto">
        {!isLogin && (
          <div className="mb-4">
            <label
              htmlFor="username"
              className="block text-sm font-medium text-gray-700"
            >
              Username
            </label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Username"
              className="form-input mt-1 block w-full"
            />
          </div>
        )}

        <div className="mb-4">
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700"
          >
            Email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            className="form-input mt-1 block w-full"
            autoComplete="username"
          />
        </div>

        <div className="mb-4">
          <label
            htmlFor="password"
            className="block text-sm font-medium text-gray-700"
          >
            Password
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="form-input mt-1 block w-full"
            autoComplete="current-password"
          />
        </div>

        <button
          disabled={loading}
          type="submit"
          className="bg-blue-500 text-white w-full py-2 rounded-md hover:bg-blue-600 transition-colors duration-300"
        >
          {isLogin ? "Login" : "Sign Up"}
        </button>
      </form>
      <p className="mt-4 text-center text-sm">
        {isLogin ? "Don't have an account?" : "Already have an account?"}
        <button
          onClick={() => setIsLogin((prev) => !prev)}
          className="text-blue-500 hover:underline ml-1"
        >
          {isLogin ? "Sign up" : "Login"}
        </button>
      </p>
    </div>
  );
}

export default AuthPage;
