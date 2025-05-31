import React, { useState } from "react";
import { useNavigate } from "react-router";
import toast from "react-hot-toast";

export default function Register() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setMail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          "Access-Control-Allow-Origin": "*",
        },
        body: JSON.stringify({
          username: username,
          email: email,
          password: password,
        }),
      }).then((res) => {
        toast.success("registered successfully")
        navigate("/room");
        console.log(res);
        setIsLoading(false);
      });
    } catch (error) {
      toast.error("failed to register an account")
      console.error("Error:", error);
      setIsLoading(false);
    }
  };
  return (
    <form className="flex flex-col items-center" onSubmit={handleRegister}>
      <div className="font-halloween w-full">
        <input
          type="text"
          onChange={(e) => setUsername(e.target.value)}
          className="rounded-md text-2xl text-center outline-none p-2 w-full"
          placeholder="Username"
          required
        />
      </div>
      <div className="my-4 font-halloween w-full">
        <input
          type="email"
          onChange={(e) => setMail(e.target.value)}
          className="rounded-md text-2xl text-center outline-none p-2 w-full"
          placeholder="Email"
          required
        />
      </div>
      <div className="my-4 w-full">
        <input
          type="password"
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
              Register
            </button>
          </>
        ) : (
          <>
            <button
              className="w-full text-white hover:text-white border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-xl text-center me-2 mb-2 dark:border-blue-500 dark:text-blue-500 dark:hover:text-white dark:hover:bg-blue-500 dark:focus:ring-blue-800 px-10 py-3 mt-8"
            >
              Register
            </button>

          </>
        )}
      </div>
    </form>
  );
}
