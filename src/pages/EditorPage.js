import React, { useState, useRef, useEffect } from "react";
import toast from "react-hot-toast";
import Editor from "../components/Editor.js";
import { language, cmtheme } from "../../src/atoms.js";
import { useRecoilState } from "recoil";
import ACTIONS from "../Actions.js";
import { initSocket } from "../socket.js";
import {
  useLocation,
  useNavigate,
  Navigate,
  useParams,
} from "react-router-dom";

import axios from "axios";

const EditorPage = () => {
  const [lang, setLang] = useRecoilState(language);
  const [them, setThem] = useRecoilState(cmtheme);
  const editorRef = useRef(null);
  const [clients, setClients] = useState([]);

  const [isEditorLocked, setEditorLocked] = useState(false);

  const [userChanges, setUserChanges] = useState([]);
  const socketRef = useRef(null);
  const codeRef = useRef(null);
  const location = useLocation();
  const { roomId } = useParams();
  const reactNavigator = useNavigate();
  const [output, setOutput] = useState("");
  const [code, setCode] = useState("");
  const [onlineUsersCount, setOnlineUsersCount] = useState(0);
  const [userInput, setUserInput] = useState("");

  // Update the handleOutput function
  const handleOutput = async (e) => {
    e.preventDefault();
    try {
      setOutput("Executing code..."); // Feedback to user that execution is in progress
      const res = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/execute`,
        {
          clientId: process.env.REACT_APP_clientId,
          clientSecret: process.env.REACT_APP_clientSecret,
          language: lang,
          script: code,
          stdin: userInput, // Add user input
        }
      );
      console.log(res);
      setOutput(res.data.output);
    } catch (error) {
      console.log(error);
      setOutput("Error executing code: " + (error.response?.data?.error || error.message));
    }
  };

  useEffect(() => {
    const init = async () => {
      socketRef.current = initSocket();
      socketRef.current.on("connect_error", (err) => handleErrors(err));
      socketRef.current.on("connect_failed", (err) => handleErrors(err));

      function handleErrors(e) {
        console.log("socket error", e);
        toast.error("Socket connection failed, try again later.");
        reactNavigator("/");
      }
      socketRef.current.emit(ACTIONS.JOIN, {
        roomId,
        username: location.state?.username,
      });

      // Listening for joined event
      socketRef.current.on(
        ACTIONS.JOINED,
        ({ clients, username, socketId }) => {
          if (username !== location.state?.username) {
            toast.success(`${username} joined the room.`);
            console.log(`${username} joined`);
          }
          setClients(clients);
          setOnlineUsersCount(clients.length);
          socketRef.current.emit(ACTIONS.SYNC_CODE, {
            code: codeRef.current,
            socketId,
          });
        }
      );

      // Listening for user changes
      socketRef.current.on(ACTIONS.USER_CHANGES, (changesData) => {
        console.log(changesData);
        updateUserChanges(changesData);
      });

      // Listening for disconnected
      socketRef.current.on(ACTIONS.DISCONNECTED, ({ socketId, username }) => {
        toast.success(`${username} left the room.`);
        setClients((prev) => {
          return prev.filter((client) => client.socketId !== socketId);
        });
        setOnlineUsersCount((prevCount) => prevCount - 1);
      });
    };
    init();
    return () => {
      socketRef.current.off(ACTIONS.JOINED);
      socketRef.current.off(ACTIONS.DISCONNECTED);
      socketRef.current.disconnect();
    };
  }, []);
  useEffect(() => {
    const handleKeyDown = (event) => {
      // Check if Ctrl + Q is pressed
      if (event.ctrlKey && event.key === "q") {
        // Find the Leave button
        const leaveButton = document.querySelector(
          "..text-red-400"
        );
        // Trigger click event on the Leave button
        leaveButton.click();
        event.preventDefault(); // Prevent default browser behavior
      }
    };

    // Add event listener when component mounts
    document.addEventListener("keydown", handleKeyDown);

    // Remove event listener when component unmounts
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);
  useEffect(() => {
    const handleKeyDown = (event) => {
      // Check if Ctrl + E is pressed
      if (event.ctrlKey && event.key === "e") {
        // Find the Analysis button
        const analysisButton = document.getElementById("analysis-button");
        // Trigger click event on the Analysis button
        analysisButton.click();
        event.preventDefault(); // Prevent default browser behavior
      }
    };

    // Add event listener when component mounts
    document.addEventListener("keydown", handleKeyDown);

    // Remove event listener when component unmounts
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);
  useEffect(() => {
    const handleKeyDown = (event) => {
      // Check if Ctrl + J is pressed
      if (event.ctrlKey && event.key === "j") {
        // Find the Copy Room ID button
        const copyRoomIdButton = document.getElementById("copy-room-id-button");
        // Trigger click event on the Copy Room ID button
        copyRoomIdButton.click();
        event.preventDefault(); // Prevent default browser behavior
      }
    };

    // Add event listener when component mounts
    document.addEventListener("keydown", handleKeyDown);

    // Remove event listener when component unmounts
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);
  useEffect(() => {
    const handleKeyDown = (event) => {
      // Check if Ctrl + R is pressed
      if (event.ctrlKey && event.key === "r") {
        // Find the Output button
        const outputButton = document.getElementById("output-button");
        // Trigger click event on the Output button
        outputButton.click();
        event.preventDefault(); // Prevent default browser behavior
      }
    };

    // Add event listener when component mounts
    document.addEventListener("keydown", handleKeyDown);

    // Remove event listener when component unmounts
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  async function copyRoomId() {
    try {
      await navigator.clipboard.writeText(roomId);
      toast.success("Room ID has been copied to your clipboard");
    } catch (err) {
      toast.error("Could not copy the Room ID");
      console.error(err);
    }
  }


  // Function to update user changes userChanges
  const updateUserChanges = (changesData) => {
    setUserChanges(changesData);
  };

  const languageFileExtensions = {
    python: "py",
    cpp: "cpp",
    c: "c",
    csharp: "cs",
    dart: "dart",
    go: "go",
    css: "css",
    html: "html",
    javascript: "js",
    json: "json",
    markdown: "md",
    php: "php",
    jsx: "jsx",
    r: "r",
    rust: "rs",
    ruby: "rb",
    sql: "sql",
    xml: "xml",
    swift: "swift",
    yaml: "yaml",
  };

  const [fileContent, setFileContent] = React.useState("");

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = (e) => {
      const content = e.target.result;
      setFileContent(content);
      socketRef.current.emit(ACTIONS.CODE_CHANGE, {
        roomId,
        code: content,
      });
      setCode(content);
    };

    reader.readAsText(file);
  };



  const handleSaveCode = () => {
    const element = document.createElement("a");
    const file = new Blob([code], { type: "text/plain" });

    const fileExtension = languageFileExtensions[lang] || "txt";

    const fileName = `code.${fileExtension}`;
    element.href = URL.createObjectURL(file);
    element.download = fileName;
    document.body.appendChild(element);
    element.click();
  };


  function leaveRoom() {
    reactNavigator("/");
  }

  if (!location.state) {
    return <Navigate to="/" />;
  }

  return (
    <div className="flex items-center justify-between flex-col">
      <p className="text-6xl text-center font-bold font-halloween text-gray-600">
        CODE
        <span className="text-transparent bg-clip-text bg-gradient-to-r to-indigo-600 from-violet-400">Span</span>
      </p>
      <div className="flex items-center justify-evenly pt-4 text-white text-2xl gap-4">
        <div className="inline-flex text-xl items-center px-5 py-2.5 font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
          Users: <span className="inline-flex text-xl items-center justify-center w-6 h-6 ms-2 font-semibold text-blue-900 bg-blue-200 rounded-full">{onlineUsersCount}</span>

        </div>

        <div className="max-w-sm mx-auto">
          <select
            className="bg-gray-50 border text-xl border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            value={lang}
            onChange={(e) => {
              setLang(e.target.value);
              window.location.reload();
            }}
          >
            <option selected>Language</option>
            <option value="c">C</option>
            <option value="cpp17">CPP</option>
            <option value="csharp">C#</option>
            <option value="css">CSS</option>
            <option value="dart">Dart</option>
            <option value="go">Go</option>
            <option value="json">JSON</option>
            <option value="markdown">Markdown</option>
            <option value="html">HTML</option>
            <option value="javascript">JavaScript</option>
            <option value="jsx">JSX</option>
            <option value="php">PHP</option>
            <option value="python3">Python</option>
            <option value="r">R</option>
            <option value="rust">Rust</option>
            <option value="ruby">Ruby</option>
            <option value="sql">SQL</option>
            <option value="swift">Swift</option>
            <option value="xml">XML</option>
            <option value="yaml">YAML</option>
          </select>
        </div>
        <div className="">
          <select
            className="bg-gray-50 border text-xl border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            value={them}
            onChange={(e) => {
              setThem(e.target.value);
              window.location.reload();
            }}
          >
            <option selected>Theme</option>
            <option value="default">default</option>
            <option value="3024-day">3024-day</option>
            <option value="3024-night">3024-night</option>
            <option value="abbott">abbott</option>
            <option value="abcdef">abcdef</option>
            <option value="ambiance">ambiance</option>
            <option value="ayu-dark">ayu-dark</option>
            <option value="ayu-mirage">ayu-mirage</option>
            <option value="base16-dark">base16-dark</option>
            <option value="base16-light">base16-light</option>
            <option value="bespin">bespin</option>
            <option value="blackboard">blackboard</option>
            <option value="cobalt">cobalt</option>
            <option value="colorforth">colorforth</option>
            <option value="darcula">darcula</option>
            <option value="duotone-dark">duotone-dark</option>
            <option value="duotone-light">duotone-light</option>
            <option value="eclipse">eclipse</option>
            <option value="elegant">elegant</option>
            <option value="erlang-dark">erlang-dark</option>
            <option value="gruvbox-dark">gruvbox-dark</option>
            <option value="hopscotch">hopscotch</option>
            <option value="icecoder">icecoder</option>
            <option value="idea">idea</option>
            <option value="isotope">isotope</option>
            <option value="juejin">juejin</option>
            <option value="lesser-dark">lesser-dark</option>
            <option value="liquibyte">liquibyte</option>
            <option value="lucario">lucario</option>
            <option value="material">material</option>
            <option value="material-darker">material-darker</option>
            <option value="material-palenight">material-palenight</option>
            <option value="material-ocean">material-ocean</option>
            <option value="mbo">mbo</option>
            <option value="mdn-like">mdn-like</option>
            <option value="midnight">midnight</option>
            <option value="monokai">monokai</option>
            <option value="moxer">moxer</option>
            <option value="neat">neat</option>
            <option value="neo">neo</option>
            <option value="night">night</option>
            <option value="nord">nord</option>
            <option value="oceanic-next">oceanic-next</option>
            <option value="panda-syntax">panda-syntax</option>
            <option value="paraiso-dark">paraiso-dark</option>
            <option value="paraiso-light">paraiso-light</option>
            <option value="pastel-on-dark">pastel-on-dark</option>
            <option value="railscasts">railscasts</option>
            <option value="rubyblue">rubyblue</option>
            <option value="seti">seti</option>
            <option value="shadowfox">shadowfox</option>
            <option value="solarized">solarized</option>
            <option value="the-matrix">the-matrix</option>
            <option value="tomorrow-night-bright">tomorrow-night-bright</option>
            <option value="tomorrow-night-eighties">
              tomorrow-night-eighties
            </option>
            <option value="ttcn">ttcn</option>
            <option value="twilight">twilight</option>
            <option value="vibrant-ink">vibrant-ink</option>
            <option value="xq-dark">xq-dark</option>
            <option value="xq-light">xq-light</option>
            <option value="yeti">yeti</option>
            <option value="yonce">yonce</option>
            <option value="zenburn">zenburn</option>
          </select>
        </div>

        <div>
          <button
            id="leave-room-button" // Add id attribute here
            onClick={leaveRoom}
            className="text-xl text-red-700 hover:text-white border border-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg px-5 py-2 text-center me-2 m-1 dark:border-red-500 dark:text-red-500 dark:hover:text-white dark:hover:bg-red-600 dark:focus:ring-red-900 "
          >
            Leave
          </button>
        </div>
        <div className="relative inline-flex items-center justify-center p-0.5 m-2 overflow-hidden text-xl font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-teal-300 to-lime-300 group-hover:from-teal-300 group-hover:to-lime-300 dark:text-white dark:hover:text-gray-900 focus:ring-4 focus:outline-none focus:ring-lime-200 dark:focus:ring-lime-800">
          <button
            id="output-button" // Add id attribute here
            onClick={handleOutput}
            className="relative px-5 py-2 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-transparent group-hover:dark:bg-transparent"
          > Run
          </button>
        </div>

        <div>
          <button
            id="copy-room-id-button" // Add id attribute here
            onClick={copyRoomId}
            className="focus:outline-none text-white bg-yellow-400 hover:bg-yellow-500 focus:ring-4 focus:ring-yellow-300 font-medium rounded-lg text-xl px-5 py-2 me-2 m-2 dark:focus:ring-yellow-900"
          > Room ID </button>
        </div>
        <div
          className="text-white flex gap-4"
        >
          <input
            type="file"
            id="upload"
            onChange={handleFileUpload}
            className="hidden"
          />
          <label htmlFor="upload" className="font-bold">
            <svg class="size-8 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
              <path fill-rule="evenodd" d="M12 3a1 1 0 0 1 .78.375l4 5a1 1 0 1 1-1.56 1.25L13 6.85V14a1 1 0 1 1-2 0V6.85L8.78 9.626a1 1 0 1 1-1.56-1.25l4-5A1 1 0 0 1 12 3ZM9 14v-1H5a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-4a2 2 0 0 0-2-2h-4v1a3 3 0 1 1-6 0Zm8 2a1 1 0 1 0 0 2h.01a1 1 0 1 0 0-2H17Z" clip-rule="evenodd" />
            </svg>

          </label>
          <div onClick={handleSaveCode} className="font-bold">
            <svg class="size-8 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
              <path fill-rule="evenodd" d="M13 11.15V4a1 1 0 1 0-2 0v7.15L8.78 8.374a1 1 0 1 0-1.56 1.25l4 5a1 1 0 0 0 1.56 0l4-5a1 1 0 1 0-1.56-1.25L13 11.15Z" clip-rule="evenodd" />
              <path fill-rule="evenodd" d="M9.657 15.874 7.358 13H5a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-4a2 2 0 0 0-2-2h-2.358l-2.3 2.874a3 3 0 0 1-4.685 0ZM17 16a1 1 0 1 0 0 2h.01a1 1 0 1 0 0-2H17Z" clip-rule="evenodd" />
            </svg>

          </div>

        </div>
      </div>
      <div className="editorWrap">
      </div>
      <Editor
        socketRef={socketRef}
        roomId={roomId}
        onCodeChange={(newcode) => {
          codeRef.current = newcode;
          setCode(newcode);
        }}
        isLocked={isEditorLocked}
        currentUsername={location.state?.username}
        clients={clients}
        output={output}
        userInput={userInput}
        setUserInput={setUserInput}
      />
    </div>
  );
};

export default EditorPage;
