import React, { useState } from "react";
import { v4 as uuidV4 } from "uuid";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();

  const [roomId, setRoomId] = useState("");
  const [username, setUsername] = useState("");
  const createNewRoom = (e) => {
    e.preventDefault();
    const id = uuidV4();
    setRoomId(id);
    toast.success("Created a new room");
  };

  const joinRoom = () => {
    if (!roomId || !username) {
      toast.error("ROOM ID & username is required");
      return;
    }

    // Redirect
    navigate(`/editor/${roomId}`, {
      state: {
        username,
      },
    });
  };

  const handleInputEnter = (e) => {
    if (e.code === "Enter") {
      joinRoom();
    }
  };

  return (
    <>
      <div className="bg-stone-100 h-[100vh] w-[100vw]">

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
            <form className="flex flex-col items-center">
              <div className="w-full">
                <input
                  type="text"
                  onChange={(e) => setRoomId(e.target.value)}
                  className="rounded-md text-2xl text-center outline-none p-2 w-full"
                  placeholder="Room ID"
                  value={roomId}
                  onKeyUp={handleInputEnter}
                  required
                />
              </div>
              <div className="mt-4 w-full">
                <input
                  type="text"
                  onChange={(e) => setUsername(e.target.value)}
                  className="rounded-md text-2xl text-center outline-none p-2 w-full"
                  placeholder="Username"
                  value={username}
                  onKeyUp={handleInputEnter}
                  required
                />
              </div>
              <div className="w-full">
                <button
                  onClick={joinRoom}
                  className=" w-full text-white hover:text-white border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-xl text-center me-2 mb-2 dark:border-blue-500 dark:text-blue-500 dark:hover:text-white dark:hover:bg-blue-500 dark:focus:ring-blue-800 px-10 py-3 mt-8"
                >
                  Join
                </button>
              </div>
            </form>
            <div className="text-white text-xl text-center mt-4">
              <p>
                Don't have a room ID ?{" "}
                <span
                  onClick={createNewRoom}
                  className="text-sky-300 font-bold cursor-pointer"
                >
                  Create One
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
