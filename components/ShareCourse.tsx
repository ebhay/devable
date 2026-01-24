"use client";

import { useMemo, useState } from "react";
import { X, Check, Copy, Share2 } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface ShareCourseModalProps {
  isOpen: boolean;
  onClose: () => void;
  shareId: string;
}

export default function ShareCourseModal({
  isOpen,
  onClose,
  shareId,
}: ShareCourseModalProps) {
  const [copied, setCopied] = useState(false);

  const shareUrl = useMemo(() => {
    const base =
      process.env.NEXTAUTH_URL ??
      (typeof window !== "undefined" ? window.location.origin : "");
    return `${base}/course/${shareId}`;
  }, [shareId]);

  const handleCopy = async () => {
    if (copied) return;

    await navigator.clipboard.writeText(shareUrl);
    setCopied(true);

    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  if (!isOpen) return null;

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
        className="relative w-full max-w-lg bg-white dark:bg-[#0A0A0A] border border-gray-200 dark:border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100 dark:border-white/5 bg-gray-50/50 dark:bg-white/[0.02]">
          <div>
            <h2 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-white/60">
              Share Course
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
              Share this course with others
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
        <div className="p-6 space-y-6">
          <div className="p-4 rounded-xl bg-blue-50 dark:bg-blue-500/10 border border-blue-100 dark:border-blue-500/20 flex flex-col items-center text-center space-y-2">
            <div className="p-3 bg-blue-100 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 rounded-full mb-1">
              <Share2 size={24} />
            </div>
            <h3 className="font-semibold text-gray-900 dark:text-white">Share your learning path</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 max-w-xs">
              Anyone with this link can view the course content and structure.
            </p>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Unique Share Link
            </label>
            <div className="flex gap-2">
              <div className="flex-1 px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-gray-900 dark:text-white text-sm font-mono truncate items-center flex">
                {shareUrl}
              </div>
              <button
                onClick={handleCopy}
                disabled={copied}
                className={`flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${copied
                    ? "bg-green-100 dark:bg-green-500/20 text-green-700 dark:text-green-400"
                    : "bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-600/20"
                  }`}
              >
                {copied ? (
                  <>
                    <Check size={16} />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy size={16} />
                    <span>Copy</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-gray-50/50 dark:bg-white/[0.02] border-t border-gray-100 dark:border-white/5 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/5 transition-colors"
          >
            Close
          </button>
        </div>
      </motion.div>
    </div>
  );
}
