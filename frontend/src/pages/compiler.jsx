import React from "react";
import { FaC } from "react-icons/fa6";
import { Hash, Coffee } from "lucide-react";
import {
  SiPython,
  SiJavascript,
  SiTypescript,
  SiCplusplus,
  SiGo,
  SiRust,
} from "react-icons/si";

function Compiler() {
  const coreLanguages = [
    { name: "Java", ext: "java", icon: <Coffee size={22} /> },
    { name: "Python3", ext: "py", icon: <SiPython size={22} /> },
    { name: "C", ext: "c", icon: <FaC size={22} /> },
    { name: "C++", ext: "cpp", icon: <SiCplusplus size={22} /> },
    { name: "JavaScript", ext: "js", icon: <SiJavascript size={22} /> },
    { name: "TypeScript", ext: "ts", icon: <SiTypescript size={22} /> },
    { name: "C#", ext: "cs", icon: <Hash size={22} /> },
    { name: "Go", ext: "go", icon: <SiGo size={22} /> },
    { name: "Rust", ext: "rs", icon: <SiRust size={22} /> },
  ];

  const [language, setLanguage] = React.useState(coreLanguages[0].name);
  const [ext, setExt] = React.useState(coreLanguages[0].ext);
  const [code, setCode] = React.useState("");
  const [output, setOutput] = React.useState("");

  const handleExport = () => {
    if (!code.trim()) {
      alert("Code is empty. Write something before exporting!");
      return;
    }
    const blob = new Blob([code], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `main.${ext}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleClear = () => setOutput("");
  const [input, setInput] = React.useState("");
  React.useEffect(() => {
    // Clear input automatically when output is cleared
    if (output === "") setInput("");
  }, [output]);
  const codeRunner = async () => {
    if (!code.trim()) {
      alert("Please write some code before running!");
      return;
    }

    setOutput("Running...");

    // handle language mapping internally (without changing your array)
    const langMap = {
      Java: "java",
      Python3: "python",
      C: "c",
      "C++": "cpp",
      JavaScript: "javascript",
      TypeScript: "typescript",
      "C#": "csharp",
      Go: "go",
      Rust: "rust",
    };

    const apiLang = langMap[language] || language.toLowerCase();

    try {
      const response = await fetch("https://emkc.org/api/v2/piston/execute", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          language: apiLang,
          version: "*",
          files: [
            {
              name: `main.${ext}`,
              content: code,
            },
          ],
          stdin: input,
        }),
      });

      const result = await response.json();

      if (result.run && result.run.output) {
        setOutput(result.run.output);
      } else {
        setOutput("No output or execution failed.");
      }
    } catch (error) {
      console.error(error);
      setOutput("Error: " + error.message);
    }
  };

  return (
    <div
      className="
        flex 
        h-[calc(100vh-64px)]   /* adjust if navbar height differs */
        overflow-hidden 
        
      "
    >
      {/* Sidebar */}
      <div className="w-20 p-2 flex flex-col items-center space-y-2 overflow-y-auto no-scrollbar  border-r ">
        {coreLanguages.map((langItem) => (
          <button
            key={langItem.name}
            onClick={() => {
              setLanguage(langItem.name);
              setExt(langItem.ext);
            }}
            title={langItem.name}
            className={`w-full flex justify-center items-center py-2 border transition
              ${
                language === langItem.name
                  ? "bg-blue-700 text-white font-semibold"
                  : "hover:bg-blue-200"
              }`}
          >
            {langItem.icon}
          </button>
        ))}
      </div>

      {/* Compiler Area */}
      <div className="flex-1 p-3 flex flex-col overflow-hidden">
        <div className="flex justify-between items-center pb-2">
          <h2 className="text-lg font-semibold">Compiler - main.{ext}</h2>
          <div className="space-x-2">
            <button
              onClick={codeRunner}
              className="bg-blue-700 text-white px-4 py-1 rounded hover:bg-blue-600 transition"
            >
              Run
            </button>
            <button
              onClick={handleExport}
              className="bg-blue-700 text-white px-4 py-1 rounded hover:bg-blue-600 transition"
            >
              Export
            </button>
          </div>
        </div>

        <textarea
          className="
            flex-1 mt-2 w-full p-2 text-sm font-mono 
            border border-gray-400 
            resize-none focus:outline-none 
            overflow-auto no-scrollbar 
          "
          placeholder={`Write your ${language} code here...`}
          value={code}
          onChange={(e) => setCode(e.target.value)}
        />
      </div>

      <div className="w-[35%] p-3 flex flex-col overflow-hidden border-l  ">
        {/* Output Area */}
        <div className="flex justify-between items-center pb-2">
          <h2 className="text-lg font-semibold">Output</h2>
          <button
            onClick={handleClear}
            className="bg-blue-700 text-white px-4 py-1  hover:bg-blue-600 transition"
          >
            Clear
          </button>
        </div>

        <div className="flex-1 mt-2 p-2  whitespace-pre-wrap font-mono  text-sm  overflow-auto no-scrollbar rounded">
          {output || "Output will appear here..."}
        </div>
        {/* Input Area */}
        {/* Input Area */}
        <div className="flex flex-col h-[30%] border-t pt-2">
          <div className="flex justify-between items-center pb-2">
            <h2 className="text-lg font-semibold">Input</h2>
            <button
              onClick={() => setInput("")} // clears input field
              className="bg-blue-700 text-white px-4 py-1 hover:bg-blue-600 transition rounded"
            >
              Clear
            </button>
          </div>

          <textarea
            className="flex-1 mt-2 p-2 border border-gray-500  whitespace-pre-wrap font-mono text-sm overflow-auto no-scrollbar focus:outline-none"
            placeholder="Enter your input here... before running the code."
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
        </div>
      </div>
    </div>
  );
}

export default Compiler;
