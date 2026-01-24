"use client";

import { useEffect, useState } from "react";
import { X, Loader2, Save, Youtube, Link as LinkIcon } from "lucide-react";
import { toast } from "sonner";
import { Course } from "@/types";
import { motion } from "motion/react";

interface Props {
  course?: Course;
  isOpen: boolean;
  onClose: () => void;
  onUpdated?: (updatedCourse: Course) => void;
}

export default function EditCourseModal({
  course,
  isOpen,
  onClose,
  onUpdated,
}: Props) {
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const playListLink = course?.playlistId ? `https://www.youtube.com/playlist?list=${course.playlistId}` : "";
  const source = course?.source || "custom";

  useEffect(() => {
    if (course && isOpen) {
      setTitle(course.title);
      setDescription(course.description ?? "");
    }
  }, [course, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async () => {
    if (!title?.trim()) {
      toast.error("Please enter a course title.");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch("/api/course/updateCourse", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          courseId: course?.id,
          title,
          description,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Something went wrong");
      }

      toast.success("Course updated successfully!");
      onUpdated?.(data.course);
      onClose();
    } catch (error: any) {
      toast.error(error.message || "Unexpected error occurred");
      console.error("Update course error:", error);
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
        className="relative w-full max-w-xl bg-white dark:bg-[#0A0A0A] border border-gray-200 dark:border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100 dark:border-white/5 bg-gray-50/50 dark:bg-white/[0.02]">
          <div>
            <h2 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-white/60">
              Edit Course
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
              Update your course details
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-white/5 text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6 custom-scrollbar">

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

            {/* Read-only Source Info */}
            <div className="p-4 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5 space-y-3">
              <label className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                Course Source
              </label>

              <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                {source === "youtube" ? (
                  <>
                    <div className="p-1.5 bg-red-100 dark:bg-red-500/20 text-red-600 dark:text-red-400 rounded-lg">
                      <Youtube size={16} />
                    </div>
                    <span>YouTube Playlist</span>
                  </>
                ) : (
                  <>
                    <div className="p-1.5 bg-blue-100 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 rounded-lg">
                      <LinkIcon size={16} />
                    </div>
                    <span>Custom Links</span>
                  </>
                )}
              </div>

              {source === "youtube" && playListLink && (
                <div className="pt-2 border-t border-gray-200 dark:border-white/5">
                  <p className="text-xs text-gray-500 mb-1">Original Playlist URL</p>
                  <code className="block w-full p-2 bg-white dark:bg-black/20 rounded-lg text-xs font-mono text-gray-600 dark:text-gray-400 break-all border border-gray-100 dark:border-white/5">
                    {playListLink}
                  </code>
                </div>
              )}
            </div>
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
                Saving...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <Save size={16} strokeWidth={2.5} />
                Save Changes
              </span>
            )}
          </button>
        </div>
      </motion.div>
    </div>
  );
}
