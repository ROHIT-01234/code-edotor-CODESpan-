import React, { useState } from "react";
import { Link } from "react-router-dom";
import Login from "../components/Auth/Login.js";
import Register from "../components/Auth/Register.js";

export default function Auth() {
  const [showlogin, setShowLogin] = useState(true);
  return (
    <div className=" bg-stone-100 h-[100vh] w-[100vw]">

      <div className="flex flex-col items-center h-[90vh] justify-center">
        <div className="mb-4">
          <Link to="/">
            <p className="text-6xl text-center font-bold font-halloween text-gray-600">
                CODE 
                <span className="text-transparent bg-clip-text bg-gradient-to-r to-indigo-600 from-violet-400">Span</span>
              </p>
          </Link>
        </div>
        <div className="bg-violet-900 px-5 py-10 rounded-xl w-[25rem]">
          {showlogin ? <Login /> : <Register />}
          <div className="text-white text-center text-2xl mt-4">
            {showlogin ? (
              <>
                <p>
                  Don't have an account ?{" "}
                  <span
                    onClick={() => setShowLogin(!showlogin)}
                    className="text-sky-300 font-bold cursor-pointer"
                  >
                    Register
                  </span>
                </p>
              </>
            ) : (
              <>
                <p>
                  Already have an account ?{" "}
                  <span
                    onClick={() => setShowLogin(!showlogin)}
                    className="text-sky-300 font-bold cursor-pointer"
                  >
                    Login
                  </span>
                </p>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
