import React, { useEffect, useRef, useState } from 'react';
import './css/game.css';
import { useQuery, gql,useLazyQuery } from "@apollo/client";

const GET_CHALLENGE = gql`
  query Get_challenge {
    Get_challenge {
      function_name
      problem_statement
    }
  }
`;
const GET_RESULT_OF_CODE = gql`
    query checking_user_code($input: checking_code!){
        checking_user_code(input:$input){
            success
            message
        }
    }
`


const CodeEditor = () => {
  const { data:challenge_data, loading:challenge_loading, error:challenge_error } = useQuery(GET_CHALLENGE);
  const [getcode,{ data:result_data, loading:result_loading, error:result_error }] = useLazyQuery(GET_RESULT_OF_CODE);

  const containerRef = useRef(null);
  const editorRef = useRef(null);

  const [code, setCode] = useState("//write code here");

  const [output, setOutput] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [runningAction, setRunningAction] = useState(null);

  useEffect(() => {
    let loaderScript;

    // Load Monaco only once
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
          editorRef.current = window.monaco.editor.create(containerRef.current, {
            value: code,
            language: "javascript",
            theme: "vs-dark",
            fontFamily: "Fira Code, monospace",
            fontSize: 14,
            minimap: { enabled: false },
            suggestOnTriggerCharacters: false,
            quickSuggestions: false,
            parameterHints: { enabled: false },
            wordBasedSuggestions: false,
            snippetSuggestions: "none",
          });

          const loader = document.getElementById("editor-loader");
          if (loader) loader.remove();
        });
      };

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

  useEffect(() => {
    if (challenge_loading && editorRef.current) {
      editorRef.current.setValue("loading...");
    } else if (challenge_data && editorRef.current) {
      editorRef.current.setValue(`function ${challenge_data.Get_challenge[0].function_name}(){ 
    // Write your function inside this
  }\n`);
    }
  }, [challenge_loading, challenge_data]);

  const runCode = async (actionType) => {
    const code = editorRef.current.getValue();
    setIsRunning(true);

    setRunningAction(actionType); // ✅ track which button was clicked

    try {
      
      const data=await getcode({ variables: { input: { code:code } } });
      console.log(data);
      // if (data.error) {
      //   setOutput('Error: ' + data.error);
      // } else if (data.results) {
      //   let resultText = '';
      //   data.results.forEach((r, idx) => {
      //     resultText += `Test Case ${idx + 1}:`;
      //     resultText += `Input: [${r.input.join(', ')}]`;
      //     resultText += `Expected: ${r.expected}, Got: ${r.output}`;
      //     resultText += r.passed ? '✅ Passed\n\n' : '❌ Failed\n\n';
      //   });
      //   if (data.logs.length > 0) {
      //     resultText += 'Console Logs:\n' + data.logs.join('\n');
      //   }
      //   setOutput(resultText);
      // }
    } catch (err) {
      setOutput('Fetch error: ' + err.message);
    } finally {
      setIsRunning(false);
      setRunningAction(null); // ✅ reset
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
    <>
      <div className="bg-[#0A0E17] text-white p-6 min-h-screen">
        <div className="max-w-4xl mx-auto">
          <h2 className="font-semibold text-2xl mb-3">Problem Statement</h2>
          <p className="mb-4 text-sm leading-relaxed">
            {challenge_loading
              ? "Loading..."
              : challenge_data
                ? challenge_data.Get_challenge[0].problem_statement
                : "Error or no data"}
          </p>
          <p className="mb-4 text-sm leading-relaxed">
            {challenge_loading
              ? "Loading..."
              : challenge_data
                ? 'Make sure to wrap your code in ' + challenge_data.Get_challenge[0].function_name + ' function'
                : "Error or no data"}
          </p>
          {/* <p>Make sure to wrap your code in {data.Get_challenge[0].} funtion </p> */}
          <hr className="border-t border-[#1f2129]" />
        </div>

        <div className="bg-[#0A0E17] flex items-start justify-center p-4">
          <div className="w-full max-w-4xl space-y-4">
            {/* Top bar */}
            <div className="flex justify-between">
              <div>
                <div className="bg-[#0a0e17] border border-[#1f2937] rounded-md text-white text-sm px-3 py-2">
                  JavaScript
                </div>
              </div>
              <div></div>
              <div className="flex items-center space-x-4">
                {/* Reset */}
                <button
                  type="button"
                  onClick={handleReset}
                  className="flex items-center space-x-1 bg-[#0a0e17] border border-[#1f2937] rounded-md text-white text-sm px-3 py-2 hover:bg-[#1f2937]"
                >
                  <i className="fas fa-redo"></i>
                  <span className="font-semibold">Reset</span>
                </button>

                {/* Run */}
                <button
                  type="button"
                  onClick={() => runCode('run')}
                  disabled={isRunning}
                  className={`flex items-center space-x-1 rounded-md text-white text-sm px-4 py-2 ${isRunning
                    ? 'bg-gray-600 cursor-not-allowed'
                    : 'bg-[#0ea5e9] hover:bg-[#0284c7]'
                    }`}
                >
                  <i className="fas fa-play"></i>
                  <span>
                    {isRunning && runningAction === 'run' ? 'Running...' : 'Run'}
                  </span>
                </button>

                {/* Submit */}
                <button
                  type="button"
                  onClick={() => runCode('submit')}
                  disabled={isRunning}
                  className={`flex items-center space-x-1 rounded-md text-white text-sm px-4 py-2 ${isRunning
                    ? 'bg-gray-600 cursor-not-allowed'
                    : 'bg-[#14b8a6] hover:bg-[#0d9488]'
                    }`}
                >
                  <i className="fas fa-paper-plane"></i>
                  <span>
                    {isRunning && runningAction === 'submit'
                      ? 'Submitting...'
                      : 'Submit'}
                  </span>
                </button>
              </div>
            </div>

            {/* Monaco container */}
            <div
              id="container_main"
              ref={containerRef}
              style={{
                width: '800px',
                height: '500px',
                border: '1px solid #ccc',
                margin: '20px auto'
              }}
            >
              <div
                id="editor-loader"
                style={{
                  width: '800px',
                  height: '500px',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  color: 'white'
                }}
              >
                Loading Editor...
              </div>
            </div>

            {/* Output box */}
            <div
              className="bg-[#0a0e17] border border-[#1f2937] rounded-md p-4 text-gray-300 max-w-full"
              aria-label="Output section"
            >
              <p className="font-semibold mb-2 text-white">Output</p>
              <p className="text-sm whitespace-pre-wrap">{output}</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CodeEditor;