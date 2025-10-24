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

  // Export code as main.{ext}
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

  // Clear output
  const handleClear = () => setOutput("");

  return (
    <div className="mt-16 p-10 flex h-screen overflow-hidden ">
      {/* Sidebar */}
      <div className="w-20 bg-gray-100 h-full p-2 flex flex-col items-center space-y-2 overflow-y-auto no-scrollbar">
        {coreLanguages.map((langItem) => (
          <button
            key={langItem.name}
            onClick={() => {
              setLanguage(langItem.name);
              setExt(langItem.ext);
            }}
            title={langItem.name}
            className={`w-full flex justify-center items-center py-2 border
              ${language === langItem.name ? "bg-blue-700 font-bold" : "bg-white hover:bg-blue-200"}
            `}
          >
            {langItem.icon}
          </button>
        ))}
      </div>

      {/* Compiler Area */}
      <div className="flex-1  h-full p-3 flex flex-col border-l border-r border-gray-300 overflow-hidden">
        <div className="flex justify-between items-center pb-2 border-b border-gray-400">
          <h2 className="text-lg font-semibold">Compiler - main.{ext}</h2>
          <button
            onClick={handleExport}
            className="bg-blue-500 text-white px-4 py-1 rounded-sm hover:bg-blue-600 transition"
          >
            Export
          </button>
        </div>

        <textarea
          className="flex-1 mt-2 w-full p-2 text-sm font-mono border border-gray-400 resize-none focus:outline-none overflow-auto no-scrollbar bg-white"
          placeholder={`Write your ${language} code here...`}
          value={code}
          onChange={(e) => setCode(e.target.value)}
        />
      </div>

      {/* Output Area */}
      <div className="w-[35%] h-full p-3 flex flex-col border-l border-gray-300 overflow-hidden">
        <div className="flex justify-between items-center pb-2 border-b border-gray-400">
          <h2 className="text-lg font-semibold">Output</h2>
          <button
            onClick={handleClear}
            className="bg-blue-500 text-white px-4 py-1 rounded-sm hover:bg-blue-600 transition"
          >
            Clear
          </button>
        </div>

        <div className="flex-1 mt-2 p-2  border border-gray-400 text-sm font-mono overflow-auto no-scrollbar">
          {output || "Output will appear here..."}
        </div>
      </div>
    </div>
  );
}

export default Compiler;
