import { useState } from "react";
import { Link, useNavigate } from "react-router";
import axios, { AxiosError } from "axios";
import { useAuth } from "../context/authContext";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();
  const { setUser, setIsLoggedin } = useAuth();
  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Send login data to the backend
    try {
      const response = await axios.post("api/auth/login", { email, password });
      console.log("Login response:", response.data);
      setUser(response.data.data);
      setIsLoggedin(true);
      navigate("/");
    } catch (error) {
      // Narrowing down to AxiosError
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError;
        setErrorMessage("Server error occurred");
        if (axiosError.response) {
          // The server responded with a status code out of the 2xx range
          console.error("Response data:", axiosError.response.data);
          setErrorMessage("Server error occurred");
        } else if (axiosError.request) {
          // The request was made but no response was received
          console.error(
            "Request was made but no response received:",
            axiosError.request
          );
          setErrorMessage("No response from server");
        } else {
          // Something went wrong in setting up the request
          console.error("Error setting up request:", axiosError.message);
          setErrorMessage("Request setup error");
        }
      } else {
        // Handle non-Axios errors (e.g., coding errors, or other runtime errors)
        console.error("Non-Axios error:", error);
        setErrorMessage("An unexpected error occurred");
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-sm bg-white p-8 rounded-lg shadow-md">
        <Link to="/">
          <img
            src="/logo.png"
            alt="Checkrr Logo"
            width={150}
            height={50}
            className="mx-auto mb-4 cursor-pointer"
          />
        </Link>
        <h1 className="text-2xl font-bold text-center mb-4">Login</h1>
        {errorMessage && (
          <p className="text-red-500 text-center mb-4">{errorMessage}</p>
        )}
        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label htmlFor="email" className="block text-gray-700">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded mt-1"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="password" className="block text-gray-700">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded mt-1"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full py-2 text-white bg-blue-600 rounded hover:bg-blue-700 transition duration-300"
          >
            Login
          </button>
        </form>
        <div className="flex items-center my-4">
          <hr className="flex-grow border-gray-300" />
          <span className="mx-2 text-gray-500">or</span>
          <hr className="flex-grow border-gray-300" />
        </div>

        <p className="text-center mt-4">
          Don&apos;t have an account?{" "}
          <Link to="/signup" className="text-blue-600 hover:underline">
            Sign up
          </Link>
        </p>
      </div>
      {/* Footer */}
      <footer className="mt-10 text-center">
        <p>© 2024 Checkrr. All rights reserved.</p>
      </footer>
    </div>
  );
}
