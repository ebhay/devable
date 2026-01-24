"use client";

import { useState } from "react";
import { X, Loader2, Youtube, Link as LinkIcon, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "motion/react";
import { MagicCard } from "@/components/ui/magic-card";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onCreated?: () => void;
}

export default function CreateCourseModal({
  isOpen,
  onClose,
  onCreated,
}: Props) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [source, setSource] = useState<"youtube" | "custom">("youtube");
  const [playListLink, setplayListLink] = useState("");
  const [loading, setLoading] = useState(false);
  const [videoLinks, setVideoLinks] = useState<string[]>([""]);

  if (!isOpen) return null;

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setplayListLink("");
    setSource("youtube");
    setVideoLinks([""]);
  };

  const extractPlaylistId = (url: string) => {
    if (url.includes("list=")) {
      return url.split("list=")[1].split("&")[0];
    }
    return url;
  };

  const updateVideoLink = (index: number, value: string) => {
    const updated = [...videoLinks];
    updated[index] = value;
    setVideoLinks(updated);

    if (index === videoLinks.length - 1 && value.trim() !== "") {
      setVideoLinks([...updated, ""]);
    }
  };

  const removeVideoLink = (index: number) => {
    setVideoLinks(videoLinks.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (!title.trim()) {
      toast.error("Please enter a course title.");
      return;
    }

    if (source === "youtube" && !playListLink.trim()) {
      toast.error("Please enter a YouTube playlist ID.");
      return;
    }

    try {
      setLoading(true);

      const playlistId =
        source === "youtube" ? extractPlaylistId(playListLink) : null;

      const res = await fetch("/api/course/createCourse", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          description,
          source,
          playlistId,
          links: source === "custom"
            ? videoLinks.filter((link) => link.trim() !== "")
            : [],
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Something went wrong");
      }

      toast.success("Course created successfully!");

      resetForm();
      onCreated?.();
      onClose();
    } catch (error: any) {
      toast.error(error.message || "Unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-md transition-opacity"
        onClick={onClose}
      />

      {/* Modal */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="relative w-full max-w-xl flex flex-col max-h-[90vh]"
      >
        <MagicCard
          className="w-full"
          gradientSize={400}
          gradientColor="#1a1a1a"
          gradientOpacity={0.8}
          gradientFrom="#9E7AFF"
          gradientTo="#FE8BBB"
        >
          <div className="bg-white dark:bg-[#0A0A0A] rounded-2xl overflow-hidden flex flex-col max-h-[90vh]">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100 dark:border-white/5 bg-gray-50/50 dark:bg-white/[0.02]">
              <div>
                <h2 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-white/60">
                  Create New Course
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                  Turn chaos into structured learning
                </p>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-white/5 text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6 custom-scrollbar">

              {/* Source Selector */}
              <div className="grid grid-cols-2 gap-3 p-1 bg-gray-100 dark:bg-white/5 rounded-xl border border-transparent dark:border-white/5">
                <button
                  onClick={() => setSource("youtube")}
                  className={`flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg text-sm font-medium transition-all duration-200 ${source === "youtube"
                    ? "bg-white dark:bg-blue-600 text-gray-900 dark:text-white shadow-sm"
                    : "text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                    }`}
                >
                  <Youtube size={18} />
                  <span>YouTube Playlist</span>
                </button>
                <button
                  onClick={() => setSource("custom")}
                  className={`flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg text-sm font-medium transition-all duration-200 ${source === "custom"
                    ? "bg-white dark:bg-blue-600 text-gray-900 dark:text-white shadow-sm"
                    : "text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                    }`}
                >
                  <LinkIcon size={18} />
                  <span>Custom Links</span>
                </button>
              </div>

              {/* Form Fields */}
              <div className="space-y-5">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Course Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Master Next.js 14"
                    className="w-full px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-gray-900 dark:text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Description
                  </label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={3}
                    placeholder="Briefly describe what students will learn..."
                    className="w-full px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-gray-900 dark:text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all resize-none"
                  />
                </div>

                {source === "youtube" ? (
                  <div className="space-y-2 animate-in fade-in slide-in-from-top-2">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Playlist URL <span className="text-red-500">*</span>
                    </label>
                    <input
                      value={playListLink}
                      onChange={(e) => setplayListLink(e.target.value)}
                      placeholder="https://www.youtube.com/playlist?list=..."
                      className="w-full px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-gray-900 dark:text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all font-mono text-sm"
                    />
                    <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                      <Youtube size={12} />
                      Supported: Public & Unlisted playlists
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3 animate-in fade-in slide-in-from-top-2">
                    <div className="flex items-center justify-between">
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Video Links <span className="text-muted-foreground font-normal">({videoLinks.filter(l => l).length})</span>
                      </label>
                    </div>

                    <div className="space-y-2 max-h-[200px] overflow-y-auto custom-scrollbar pr-2">
                      {videoLinks.map((link, index) => (
                        <div key={index} className="flex items-center gap-2 group">
                          <div className="flex items-center justify-center w-6 h-6 rounded-full bg-gray-100 dark:bg-white/10 text-xs font-medium text-gray-500 dark:text-gray-400 shrink-0">
                            {index + 1}
                          </div>
                          <input
                            value={link}
                            onChange={(e) => updateVideoLink(index, e.target.value)}
                            placeholder="https://youtube.com/watch?v=..."
                            className="flex-1 px-3 py-2 rounded-lg bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-sm text-gray-900 dark:text-white focus:outline-none focus:border-blue-500 transition-colors font-mono"
                            autoFocus={index === videoLinks.length - 1 && index > 0}
                          />
                          {videoLinks.length > 1 && (
                            <button
                              onClick={() => removeVideoLink(index)}
                              className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg opacity-0 group-hover:opacity-100 transition-all"
                              tabIndex={-1}
                            >
                              <Trash2 size={16} />
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Footer */}
            <div className="px-6 py-4 bg-gray-50/50 dark:bg-white/[0.02] border-t border-gray-100 dark:border-white/5 flex justify-end gap-3">
              <button
                onClick={onClose}
                className="px-5 py-2.5 rounded-xl text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/5 transition-colors"
              >
                Cancel
              </button>

              <button
                onClick={handleSubmit}
                disabled={loading}
                className="relative px-6 py-2.5 rounded-xl text-sm font-bold text-white bg-blue-600 hover:bg-blue-500 shadow-lg shadow-blue-600/20 hover:shadow-blue-600/30 active:scale-[0.98] transition-all disabled:opacity-70 disabled:pointer-events-none"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <Loader2 size={16} className="animate-spin" />
                    Creating...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <Plus size={16} strokeWidth={3} />
                    Create Course
                  </span>
                )}
              </button>
            </div>
          </div>
        </MagicCard>
      </motion.div>
    </div>
  );
}

