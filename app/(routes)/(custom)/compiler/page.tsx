"use client";

import React, { useState, useEffect } from "react";
import { FaC } from "react-icons/fa6";
import {
    Hash,
    Coffee,
    Play,
    Download,
    Eraser,
    Loader2,
    Terminal,
    FileCode,
    Copy,
    Check
} from "lucide-react";
import Editor from "@monaco-editor/react";
import {
    SiPython,
    SiJavascript,
    SiTypescript,
    SiCplusplus,
    SiGo,
    SiRust,
} from "react-icons/si";
import { toast } from "sonner";
import { motion, AnimatePresence } from "motion/react";

// Language Configuration (Judge0 IDs)
const LANGUAGE_CONFIG = [
    { name: "Java", ext: "java", icon: <Coffee size={20} />, apiLang: "java", languageId: 62 },
    { name: "Python", ext: "py", icon: <SiPython size={20} />, apiLang: "python", languageId: 71 },
    { name: "C", ext: "c", icon: <FaC size={20} />, apiLang: "c", languageId: 50 },
    { name: "C++", ext: "cpp", icon: <SiCplusplus size={20} />, apiLang: "cpp", languageId: 54 },
    { name: "JavaScript", ext: "js", icon: <SiJavascript size={20} />, apiLang: "javascript", languageId: 63 },
    { name: "TypeScript", ext: "ts", icon: <SiTypescript size={20} />, apiLang: "typescript", languageId: 74 },
    { name: "C#", ext: "cs", icon: <Hash size={20} />, apiLang: "csharp", languageId: 51 },
    { name: "Go", ext: "go", icon: <SiGo size={20} />, apiLang: "go", languageId: 60 },
    { name: "Rust", ext: "rs", icon: <SiRust size={20} />, apiLang: "rust", languageId: 73 },
];

export default function Compiler() {
    const [activeLang, setActiveLang] = useState(LANGUAGE_CONFIG[0]);
    const [code, setCode] = useState("// Write your code here...");
    const [input, setInput] = useState("");
    const [output, setOutput] = useState("");
    const [isRunning, setIsRunning] = useState(false);
    const [editorTheme, setEditorTheme] = useState("vs");
    const [copied, setCopied] = useState(false);

    // Theme detection
    useEffect(() => {
        const updateTheme = () => {
            setEditorTheme(
                document.documentElement.classList.contains("dark")
                    ? "vs-dark"
                    : "vs"
            );
        };
        updateTheme();
        const observer = new MutationObserver(updateTheme);
        observer.observe(document.documentElement, {
            attributes: true,
            attributeFilter: ["class"],
        });
        return () => observer.disconnect();
    }, []);

    const handleRun = async () => {
        if (!code.trim()) {
            setOutput("Please write some code before running!");
            return;
        }

        setIsRunning(true);
        setOutput("");

        try {
            const response = await fetch("/api/compiler", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    languageId: activeLang.languageId,
                    sourceCode: code,
                    stdin: input,
                }),
            });

            const result = await response.json();

            if (result.compile_output) {
                setOutput(`Compile Error:\n${result.compile_output}`);
            } else if (result.stderr) {
                setOutput(`Runtime Error:\n${result.stderr}`);
            } else if (result.stdout) {
                setOutput(result.stdout);
            } else {
                setOutput("Execution finished with no output.");
            }
        } catch (error: any) {
            setOutput(`Error: ${error.message || "Something went wrong."}`);
        } finally {
            setIsRunning(false);
        }
    };

    const handleExport = () => {
        if (!code.trim()) return;
        const blob = new Blob([code], { type: "text/plain" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `main.${activeLang.ext}`;
        a.click();
        URL.revokeObjectURL(url);
        toast.success(`Downloaded main.${activeLang.ext}`);
    };

    const handleCopy = async () => {
        if (!code) return;
        await navigator.clipboard.writeText(code);
        setCopied(true);
        toast.success("Code copied to clipboard");
        setTimeout(() => setCopied(false), 2000);
    };

    const clearOutput = () => {
        setOutput("");
        toast.info("Terminal cleared");
    }

    return (
        <div className="flex h-[calc(100vh-64px)] w-full overflow-hidden bg-background text-foreground">
            {/* Sidebar - Languages */}
            <div className="w-16 md:w-20 bg-gray-50/50 dark:bg-[#0c0c0c]/50 border-r border-gray-200 dark:border-white/5 flex flex-col items-center py-6 space-y-4 overflow-y-auto custom-scrollbar">
                {LANGUAGE_CONFIG.map((lang) => (
                    <button
                        key={lang.name}
                        onClick={() => setActiveLang(lang)}
                        title={lang.name}
                        className={`relative p-3 rounded-xl transition-all duration-200 group ${activeLang.name === lang.name
                                ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20"
                                : "text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/5"
                            }`}
                    >
                        {lang.icon}
                        {activeLang.name === lang.name && (
                            <motion.div
                                layoutId="active-lang"
                                className="absolute inset-0 border-2 border-blue-400/30 rounded-xl"
                                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                            />
                        )}

                        {/* Tooltip */}
                        <div className="absolute left-14 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">
                            {lang.name}
                        </div>
                    </button>
                ))}
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col min-w-0">

                {/* Top Bar */}
                <div className="h-14 border-b border-gray-200 dark:border-white/5 flex items-center justify-between px-6 bg-white/50 dark:bg-zinc-900/50 backdrop-blur-sm">
                    <div className="flex items-center gap-3">
                        <FileCode size={18} className="text-blue-500" />
                        <span className="font-semibold text-sm text-gray-700 dark:text-gray-200">
                            main.{activeLang.ext}
                        </span>
                    </div>

                    <div className="flex items-center gap-2">
                        <button
                            onClick={handleCopy}
                            className="p-2 text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/5 rounded-lg transition-colors"
                            title="Copy Code"
                        >
                            {copied ? <Check size={16} /> : <Copy size={16} />}
                        </button>
                        <button
                            onClick={handleExport}
                            className="p-2 text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/5 rounded-lg transition-colors"
                            title="Download Code"
                        >
                            <Download size={16} />
                        </button>

                        <div className="w-px h-4 bg-gray-200 dark:bg-white/10 mx-1" />

                        <button
                            onClick={handleRun}
                            disabled={isRunning}
                            className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white px-4 py-1.5 rounded-lg text-sm font-medium shadow-lg shadow-blue-500/20 active:scale-95 transition-all disabled:opacity-70 disabled:pointer-events-none"
                        >
                            {isRunning ? <Loader2 size={14} className="animate-spin" /> : <Play size={14} fill="currentColor" />}
                            {isRunning ? "Running..." : "Run Code"}
                        </button>
                    </div>
                </div>

                {/* Editor Area */}
                <div className="flex-1 flex">
                    {/* Monaco Editor */}
                    <div className="flex-1 relative">
                        <Editor
                            height="100%"
                            language={activeLang.apiLang}
                            theme={editorTheme}
                            value={code}
                            onChange={(v) => setCode(v || "")}
                            options={{
                                fontSize: 14,
                                fontFamily: "'JetBrains Mono', 'Fira Code', Consolas, monospace",
                                fontLigatures: true,
                                minimap: { enabled: false },
                                automaticLayout: true,
                                padding: { top: 20 },
                                scrollBeyondLastLine: false,
                                lineNumbers: "on",
                                renderLineHighlight: "all",
                            }}
                        />
                    </div>

                    {/* I/O Panel */}
                    <div className="w-[35%] border-l border-gray-200 dark:border-white/5 flex flex-col bg-gray-50/50 dark:bg-[#0c0c0c]">

                        {/* Output Section */}
                        <div className="flex-1 flex flex-col min-h-0 border-b border-gray-200 dark:border-white/5">
                            <div className="flex items-center justify-between px-4 py-2 bg-gray-100 dark:bg-white/5 border-b border-gray-200 dark:border-white/5">
                                <div className="flex items-center gap-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                    <Terminal size={14} />
                                    Output
                                </div>
                                <button
                                    onClick={clearOutput}
                                    className="p-1 hover:bg-gray-200 dark:hover:bg-white/10 rounded-md transition-colors"
                                    title="Clear Output"
                                >
                                    <Eraser size={14} className="text-gray-500" />
                                </button>
                            </div>
                            <div className="flex-1 p-4 overflow-auto font-mono text-sm dark:text-gray-300">
                                {output ? (
                                    <pre className="whitespace-pre-wrap break-words">{output}</pre>
                                ) : (
                                    <div className="h-full flex flex-col items-center justify-center text-gray-400 dark:text-zinc-600">
                                        <Play size={32} className="mb-2 opacity-50" />
                                        <p className="text-xs">Run code to see output</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Input Section */}
                        <div className="h-1/3 flex flex-col">
                            <div className="px-4 py-2 bg-gray-100 dark:bg-white/5 border-b border-gray-200 dark:border-white/5">
                                <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                    Standard Input
                                </span>
                            </div>
                            <textarea
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                placeholder="Enter input for your program here..."
                                className="flex-1 w-full p-4 bg-transparent font-mono text-sm focus:outline-none resize-none placeholder:text-gray-400/50"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
