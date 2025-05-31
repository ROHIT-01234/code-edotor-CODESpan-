import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router";
import toast from "react-hot-toast";


export default function Login() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);


  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/api/login`,
        {
          username: username,
          password: password,
        }
      );

      if (response.data) {
        toast.success("login successful")
        console.log("success");
        navigate("/room");
      } else {
        toast.error("failed to login")
        console.log("failed login");
      }
    } catch (error) {
      if (error.response) {
        console.error(
          "Request failed with status code:",
          error.response.status
        );
        toast.error("falied to login");
        console.error("Error message:", error.response.data);
      } else if (error.request) {
        console.error("No response received:", error.request);
      } else {
        console.error("Error during request setup:", error.message);
      }
    }
    setIsLoading(false);
  };
  return (
    <form className="flex flex-col items-center" onSubmit={handleLogin}>
      <div className="w-full">
        <input
          type="text"
          onChange={(e) => setUsername(e.target.value)}
          className="rounded-md text-2xl text-center outline-none p-2 w-full"
          placeholder="Username"
          required
        />
      </div>
      <div className="mt-4 w-full">
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="rounded-md text-2xl text-center outline-none p-2 w-full"
          placeholder="Password"
          required
        />
      </div>
      <div className="w-full">
        {isLoading ? (
          <>
            <button
              type="submit"
              className="cursor-wait w-full text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-xl text-center me-2 mb-2 px-10 py-3 mt-8"

              disabled
            >
              Login
            </button>
          </>
        ) : (
          <>
            <button
              className=" w-full text-white hover:text-white border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-xl text-center me-2 mb-2 dark:border-blue-500 dark:text-blue-500 dark:hover:text-white dark:hover:bg-blue-500 dark:focus:ring-blue-800 px-10 py-3 mt-8"
            >
              Login
            </button>
          </>
        )}
      </div>
    </form>
  );
}
