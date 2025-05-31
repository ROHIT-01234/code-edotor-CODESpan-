import React, { useEffect, useRef, useState } from "react";
import { language, cmtheme } from "../../src/atoms.js";
import { useRecoilValue } from "recoil";
import ACTIONS from "../Actions.js";
// CODE MIRROR
import Codemirror from "codemirror";
import "codemirror/lib/codemirror.css";

// Import themes and modes as needed
import "./EditorAddon.js";

const Editor = ({
  socketRef,
  roomId,
  onCodeChange,
  isLocked,
  output,
  userInput,
  setUserInput,
  fileContent, // new prop for file content
}) => {
  const editorRef = useRef(null);
  const lang = useRecoilValue(language);
  const editorTheme = useRecoilValue(cmtheme);
  const [code, setCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const fetchCodeSuggestion = async () => {
    console.log("Fetching code suggestions");

    // Prevent multiple simultaneous suggestion requests
    if (isLoading) return;

    try {
      setIsLoading(true);
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/suggest-code`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          codeSnippet: code,
          language: lang,
        }),
      });

      const data = await response.json();

      if (data.suggestion) {
        // Append the suggestion to the existing code
        const newCode = code + '\n' + data.suggestion;

        editorRef.current.setValue(newCode);
        setCode(newCode);

        socketRef.current.emit(ACTIONS.CODE_CHANGE, {
          roomId,
          code: newCode,
        });
      }
    } catch (error) {
      console.error("Error fetching code suggestion:", error);
      // Optionally show an error toast or message to the user
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    async function init() {
      if (editorRef.current) {
        editorRef.current.toTextArea();
      }
      editorRef.current = Codemirror.fromTextArea(
        document.getElementById("realtimeEditor"),
        {
          mode: { name: lang },
          theme: editorTheme,
          autofocus: true,
          dragDrop: true,
          autoCloseTags: true,
          autoCloseBrackets: true,
          lineNumbers: true,
          extraKeys: { Tab: "autocomplete" },
          autocomplete: true,
          readOnly: isLocked ? "nocursor" : false,
          lineWrapping: true,
          styleActiveLine: true,
          matchBrackets: true,
        }
      );

      editorRef.current.on("change", (instance, changes) => {
        const { origin } = changes;
        const newCode = instance.getValue();
        setCode(newCode);
        onCodeChange(newCode);
        if (origin !== "setValue") {
          socketRef.current.emit(ACTIONS.CODE_CHANGE, {
            roomId,
            code: newCode,
          });
        }
      });
    }

    init();
  }, [lang]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      // More specific event checking
      if (e.altKey && e.key === "s") {
        // Ensure the editor or its wrapper is actually focused
        const activeElement = document.activeElement;
        const editorWrapper = editorRef.current?.getWrapperElement();
        const editorTextArea = editorRef.current?.getTextArea();

        if (activeElement === editorTextArea ||
          editorWrapper?.contains(activeElement)) {
          e.preventDefault();
          fetchCodeSuggestion(e);
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    // Cleanup listener on unmount
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [lang, code, fetchCodeSuggestion]);

  useEffect(() => {
    if (socketRef.current && socketRef.current.connected) {
      socketRef.current.emit(ACTIONS.TOGGLE_EDITOR_LOCK, {
        roomId,
        editorLocked: isLocked,
      });
      socketRef.current.on(
        ACTIONS.TOGGLE_EDITOR_LOCK,
        ({ roomId, editorLocked }) => {
          editorRef.current.setOption(
            "readOnly",
            editorLocked ? "nocursor" : false
          );
        }
      );
    }
  }, [isLocked, socketRef.current]);

  useEffect(() => {
    if (socketRef.current) {
      socketRef.current.on(ACTIONS.CODE_CHANGE, ({ code }) => {
        if (code !== null) {
          editorRef.current.setValue(code);
          setCode(code);
        }
      });
    }

    return () => {
      socketRef.current.off(ACTIONS.CODE_CHANGE);
    };
  }, [socketRef.current]);

  // New effect to update editor content when fileContent prop changes
  useEffect(() => {
    if (fileContent !== undefined && fileContent !== null && editorRef.current) {
      editorRef.current.setValue(fileContent);
      setCode(fileContent);
      onCodeChange(fileContent);
    }
  }, [fileContent]);





  return (
    <div className="flex h-full">
      <div>
        <div className="border-2 border-blue-400 rounded-lg p-2 m-2 h-[520px]">
          <textarea id="realtimeEditor"></textarea>
        </div>
        <div className="grid grid-cols-2 gap-2 p-2">
          <div className="relative w-full min-w-[200px]">
            <textarea
              class="peer h-full min-h-[100px] w-full resize-none rounded-[7px] border border-blue-gray-200 border-t-transparent bg-transparent px-3 py-2.5 font-sans text-sm font-bold text-white outline outline-0 transition-all placeholder-shown:border placeholder-shown:border-blue-gray-200 placeholder-shown:border-t-blue-gray-200 focus:border-2 focus:border-green-500 focus:border-t-transparent focus:outline-0 disabled:resize-none disabled:border-0 disabled:bg-blue-gray-50"
              placeholder=" "
              value={userInput}
              onChange={(e) => {
                setUserInput(e.target.value);

              }}></textarea>
            <label
              className="before:content[' '] after:content[' '] pointer-events-none absolute left-0 -top-1.5 flex h-full w-full select-none text-4xl font-bold leading-tight text-white transition-all before:pointer-events-none before:mt-[6.5px] before:mr-1 before:box-border before:block before:h-1.5 before:w-2.5 before:rounded-tl-md before:border-t before:border-l before:border-blue-gray-200 before:transition-all after:pointer-events-none after:mt-[6.5px] after:ml-1 after:box-border after:block after:h-1.5 after:w-2.5 after:flex-grow after:rounded-tr-md after:border-t after:border-r after:border-blue-gray-200 after:transition-all peer-placeholder-shown:text-sm peer-placeholder-shown:leading-[3.75] peer-placeholder-shown:text-blue-gray-500 peer-placeholder-shown:before:border-transparent peer-placeholder-shown:after:border-transparent peer-focus:text-xl peer-focus:leading-tight peer-focus:text-white peer-focus:before:border-t-2 peer-focus:before:border-l-2 peer-focus:before:border-green-500 peer-focus:after:border-t-2 peer-focus:after:border-r-2 peer-focus:after:border-green-500 peer-disabled:text-transparent peer-disabled:before:border-transparent peer-disabled:after:border-transparent peer-disabled:peer-placeholder-shown:text-blue-gray-500">
              Input
            </label>
          </div>
          <div className="border-2 border-green-500 rounded-lg p-2 h-[20vh]">
            <p className="text-white font-bold text-xl">Output</p>
            <p className="text-white mt-4">{output}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Editor;
