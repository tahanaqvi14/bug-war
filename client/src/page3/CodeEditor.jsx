import React, { useEffect, useRef, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import './css/codeeditor.css';
import { SocketContext } from '../App';
import { useQuery, gql, useLazyQuery } from "@apollo/client";
import { useStore  } from '../../store/Store';

const GET_CHALLENGE = gql`
  query Get_challenge {
    Get_challenge {
      function_name
      problem_statement
      id_number
    }
  }
`;
// const Get_match=gql`
//   query Get_matchinfo{
//   Get_matchinfo{
//     participants
//     winner
//     matchId
//     }
//   }
// `;

const GET_RESULT_OF_CODE = gql`
  query checking_user_code($input: checking_code!) {
    checking_user_code(input: $input) {
      success
      message {
        passed
        message
        consolelogs
        results {
          case
          expected
          output
          passed
        }
      }
    }
  }
`;

const CodeEditor = () => {
  const matchinfo = useStore((state) => state.data);
  console.log(matchinfo);
  const socket = useContext(SocketContext)


  const { data: challenge_data, loading: challenge_loading, error: challenge_error } = useQuery(GET_CHALLENGE);
  // const { data: match_data, loading: match_loading, error: match_error } = useQuery(Get_match);
  // console.log(match_data)
  const [getcode] = useLazyQuery(GET_RESULT_OF_CODE);

  const [result, setresult] = useState([]);
  const [consolelogs, setconsolelogs] = useState([]);
  
  // Refs only for Monaco editor container
  const containerRef = useRef(null);
  const editorRef = useRef(null);
  const outputRef = useRef(null); // 👈 new ref for the output box
  const [timeLeft, setTimeLeft] = useState(5 * 60 + 23); // 5:23 initially

  // State for UI
  const [code, setCode] = useState("//write code here");
  const [output, setOutput] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [runningAction, setRunningAction] = useState(null);

  // Load Monaco editor once
  useEffect(() => {
    if (socket) {
      console.log(`Socket connected in codeeditor component:${socket.id}`);
    }

    let loaderScript;

    if (!window.monaco) {
      loaderScript = document.createElement("script");
      loaderScript.src =
        "https://cdn.jsdelivr.net/npm/monaco-editor@0.43.0/min/vs/loader.js";

      loaderScript.onload = () => {
        window.require.config({
          paths: {
            vs: "https://cdn.jsdelivr.net/npm/monaco-editor@0.43.0/min/vs",
          },
        });

        window.require(["vs/editor/editor.main"], () => {
          // 🏜️ Define your custom desert-light theme
          window.monaco.editor.defineTheme("desertLight", {
            base: "vs", // start from light theme
            inherit: true,
            rules: [
              { token: "", foreground: "4B2E05", background: "FCE9B8" }, // default text
              { token: "keyword", foreground: "A65304", fontStyle: "bold" },
              { token: "number", foreground: "B06A14" },
              { token: "string", foreground: "A64B2A" },
              { token: "comment", foreground: "8B7E6A", fontStyle: "italic" },
              { token: "function", foreground: "C75B12" },
              { token: "type", foreground: "A65304" },
            ],
            colors: {
              "editor.background": "#FCE9B8",
              "editor.foreground": "#4B2E05",
              "editorCursor.foreground": "#7A4F0A",
              "editor.lineHighlightBackground": "#F8DFA7",
              "editorLineNumber.foreground": "#C18C46",
              "editor.selectionBackground": "#F7D48B",
              "editor.inactiveSelectionBackground": "#F7D48B66",
              "editorBracketMatch.background": "#F8E0A3",
              "editorBracketMatch.border": "#C18C46",
              "editorIndentGuide.background": "#EFD7A5",
              "editorWhitespace.foreground": "#EFD7A5",
            },
          });

          // ✨ Create the editor using that theme
          editorRef.current = window.monaco.editor.create(containerRef.current, {
            value: code,
            language: "javascript",
            theme: "desertLight", // <-- use your new theme here
            fontFamily: "Fira Code, monospace",
            fontSize: 14,
            minimap: { enabled: false },
          });

          // 🧹 Remove the loader after init
          const loader = document.getElementById("editor-loader");
          if (loader) loader.remove();
        })
      }
      document.body.appendChild(loaderScript);
    }

    return () => {
      if (editorRef.current) {
        editorRef.current.dispose();
      }
      if (loaderScript) {
        document.body.removeChild(loaderScript);
      }
    };
  }, []);

  // Put challenge starter function inside editor
  useEffect(() => {
    if (challenge_loading && editorRef.current) {
      editorRef.current.setValue("loading...");
    } else if (challenge_data && editorRef.current) {
      editorRef.current.setValue(
        `function ${challenge_data.Get_challenge[0].function_name}(){ 
  //Write your function inside this
}\n`
      );
    }
  }, [challenge_loading, challenge_data]);


  useEffect(() => {
    if (timeLeft <= 0) return;
    const timer = setTimeout(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearTimeout(timer);
  }, [timeLeft]);

  const minutes = String(Math.floor(timeLeft / 60)).padStart(2, "0");
  const seconds = String(timeLeft % 60).padStart(2, "0");


  const runCode = async (actionType) => {
    const code = editorRef.current.getValue();
    setIsRunning(true);
    setRunningAction(actionType);
    console.log(challenge_data.Get_challenge[0].id_number)
    try {
      const { data } = await getcode({
        variables: { input: { code, challengeid: challenge_data.Get_challenge[0].id_number } },
      });
      console.log(data.checking_user_code);
      // if(data.checking_user_code.message.results.)
      setresult(data.checking_user_code)


      if (data.checking_user_code.message.consolelogs && data.checking_user_code.message.consolelogs.length > 0) {
        let a=data.checking_user_code.message.consolelogs;
        let a1 = a.slice(0, Math.floor(a.length / 2));
        console.log('results',a1);
        setconsolelogs(a1);
      }
      
      // const msg = data.checking_user_code.message;
      // console.log(msg)

      // if (msg.consolelogs != null) {
      //   setOutput(msg.consolelogs.join("\n"));

      // } else if (msg.message) {
      //   setOutput(msg.message);
      // }

      // setInputVal(msg.input ? `Input: ${msg.input}` : '');
      // setExpectedVal(msg.expected ? `Expected output: ${msg.expected}` : '');
      // setPassedVal(
      //   msg.passed != null
      //     ? msg.passed
      //       ? "✅ Test cases Passed\n\n"
      //       : "❌ Test cases Failed\n\n"
      //     : ''
      // );

    } catch (err) {
      setOutput("Fetch error: " + err.message);
    } finally {
      setIsRunning(false);
      setRunningAction(null);
    }
  };

  const handleReset = () => {
    const initialCode = `function ${challenge_data.Get_challenge[0].function_name}(){
  //Write your function inside this
}\n`;
    setCode(initialCode);
    if (editorRef.current) editorRef.current.setValue(initialCode);
  };

  return (
    <div className="maindiv">
      {/* Countdown and Player Section */}
      <div className="countdown-page">
        <div className="main-container">
          <div className="top-bar">
            {/* Countdown Section */}
            <div className="countdown-container">
              <div
                className="countdown-clock"
                style={{ color: timeLeft <= 0 ? "#FF0000" : "var(--sun-yellow)" }}
              >
                {timeLeft > 0 ? `${minutes}:${seconds}` : "00:00"}
              </div>
            </div>

            {/* Players Section */}
            <div className="players-container">
              <div className="player-card">
                <div className="position-badge position-3">VU</div>
                <div className="player-info">
                  <div className="player-name">VultureDev</div>
                </div>
                <span>Points: 0</span>
              </div>

              <div className="player-card">
                <div className="position-badge position-4">JS</div>
                <div className="player-info">
                  <div className="player-name">JSRacer</div>
                </div>
                <span>Points: 0</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Editor + Problem Section */}
      <div className="app-container">
        {/* Left side */}
        <div className="problem-section">
          <h2>Problem Statement</h2>
          <p>
            {challenge_loading
              ? "Loading..."
              : challenge_data
                ? challenge_data.Get_challenge[0].problem_statement
                : "Error loading challenge."}
          </p>
          <p>
            {challenge_loading
              ? ""
              : challenge_data
                ? "Make sure to wrap your code in " +
                challenge_data.Get_challenge[0].function_name +
                " function"
                : ""}
          </p>
        </div>

        {/* Right side */}
        <div className="editor-section">
          <div className="button-bar">
            <div className="lang">JavaScript</div>
            <div className="buttons">
              <button onClick={handleReset}>Reset</button>
              <button
                onClick={() => runCode("run")}
                disabled={isRunning}
              >
                {isRunning && runningAction === "run"
                  ? "Running..."
                  : "Run"}
              </button>
              <button
                onClick={() => runCode("submit")}
                disabled={isRunning}
              >
                {isRunning && runningAction === "submit"
                  ? "Submitting..."
                  : "Submit"}
              </button>
            </div>
          </div>

          {/* Monaco container */}
          <div id="container_main" ref={containerRef}>
            <div id="editor-loader">Loading Editor...</div>
          </div>

          {/* Output section */}
          <div className="output" ref={outputRef}>
            <h3>Output</h3>
            <pre>{output}</pre>
            <p>{result.success === false && result.message.message}</p>

            {/* Show test results */}
            <div className="flex gap-4">
              {result?.message?.results?.map((item, index) => (
                <div key={index}>
                  <p className="font-semibold">
                    Case: {item["case"].join(", ")}
                  </p>
                  <p>Expected: {item.expected}</p>
                  <p>Output: {item.output === null ? "undefined (no return value)" : item.output}
                  </p>
                  <p className="mt-2 font-bold">
                    {item.passed ? "✅ Test Passed" : "❌ Test Failed"}
                  </p>
                </div>
              ))}
            </div>
            <div className='mt-4'>
              <p>Console Logs:</p>
              <pre>{consolelogs.join("\n")}</pre>
            </div>

            {/* <p>{inputVal}</p>
            <p>{expectedVal}</p>
            <p>{passedVal}</p> */}

          </div>
        </div>
      </div>
    </div>
  );
};

export default CodeEditor;
