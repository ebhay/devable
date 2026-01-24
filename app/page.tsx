"use client";

import { InteractiveHoverButton } from "@/components/ui/interactive-hover-button";
import Link from "next/link";
import { ArrowRight, PlayCircle, BookOpen, Code2, CheckCircle2, Zap, Trophy, Target } from "lucide-react";
import { HowItWorks } from "@/components/HowItWorks";
import { Highlighter } from "@/components/ui/highlighter";
import Footer from "@/components/Footer";
import { HeroVideoDialog } from "@/components/ui/hero-video-dialog"
export default function Home() {
  return (
    <div className="relative min-h-screen w-full bg-gradient-to-b from-white via-gray-50/50 to-white dark:from-gray-950 dark:via-gray-900/50 dark:to-gray-950">
      {/* Ambient Background Elements */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-blue-500/10 blur-3xl dark:bg-blue-500/5"></div>
        <div className="absolute top-1/3 -left-40 h-80 w-80 rounded-full bg-purple-500/10 blur-3xl dark:bg-purple-500/5"></div>
        <div className="absolute bottom-1/4 right-1/4 h-60 w-60 rounded-full bg-pink-500/10 blur-3xl dark:bg-pink-500/5"></div>
      </div>

      {/* Hero Section */}
      <section className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-20 pb-16 sm:pt-24 sm:pb-20 lg:pt-32 lg:pb-28">
        <div className="flex flex-col items-center gap-6 sm:gap-8 lg:gap-10 text-center">
          {/* Badge */}
          <div className="animate-fade-in inline-flex items-center gap-2 rounded-full border border-gray-200/80 bg-white/80 px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm font-medium text-gray-700 shadow-sm backdrop-blur-sm dark:border-gray-700/50 dark:bg-gray-800/40 dark:text-gray-300 transition-all duration-300 hover:shadow-md hover:scale-105">
            <span className="flex h-2 w-2 rounded-full bg-blue-500">
              <span className="absolute inline-flex h-2 w-2 rounded-full bg-blue-400 opacity-75 animate-ping"></span>
            </span>
            <span>Transform YouTube into Your Learning Hub</span>
          </div>

          {/* Hero Title */}
          <h1 className="animate-fade-in-up max-w-5xl text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-gray-900 dark:text-white leading-tight">
            Master Skills with{" "}
            <br className="hidden sm:block" />
            <span className="relative inline-block mt-2">
              <Highlighter action="underline" color="#3B82F6">
                <span className="text-blue-600 dark:text-blue-500">Structured Learning</span>
              </Highlighter>
            </span>
          </h1>

          {/* Subtitle */}
          <p className="animate-fade-in-up delay-100 max-w-2xl text-base sm:text-lg lg:text-xl text-gray-600 dark:text-gray-400 leading-relaxed px-4">
            Turn any YouTube playlist into an organized course. Track progress, stay focused, and
            <span className="font-semibold text-gray-900 dark:text-white"> learn like a pro</span>.
          </p>

          {/* CTA Actions */}
          <div className="animate-fade-in-up delay-200 flex flex-col sm:flex-row items-center gap-3 sm:gap-4 mt-4 sm:mt-6 w-full sm:w-auto px-4 sm:px-0">
            <Link href="/login" className="w-full sm:w-auto">
              <InteractiveHoverButton className="w-full sm:w-auto">
                Start Learning Free
              </InteractiveHoverButton>
            </Link>

            <Link
              href="#features"
              className="group inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-all duration-200 hover:gap-3 w-full sm:w-auto border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
            >
              <span>See Features</span>
              <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
            </Link>
          </div>


        </div>
      </section>

      {/* Video Demo Section */}
      <section className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-16 sm:pb-20 lg:pb-28">
        <div className="relative">
          <HeroVideoDialog
            className="block dark:hidden"
            animationStyle="from-center"
            videoSrc="https://www.youtube.com/embed/dQw4w9WgXcQ"
            thumbnailSrc="https://image2url.com/r2/default/images/1769284812145-7a6ef516-f452-445c-a038-4d2f5a1e90a9.png"
            thumbnailAlt="Hero Video"
          />
          <HeroVideoDialog
            className="hidden dark:block"
            animationStyle="from-center"
            videoSrc="https://www.youtube.com/embed/dQw4w9WgXcQ"
            thumbnailSrc="https://startup-template-sage.vercel.app/hero-dark.png"
            thumbnailAlt="Hero Video"
          />
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-16 sm:pb-20 lg:pb-28">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Everything You Need to Learn Better
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Powerful features designed to help you stay organized and motivated
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Feature 1 */}
          <div className="group relative p-6 rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 hover:shadow-xl hover:shadow-blue-500/10 transition-all duration-300 hover:-translate-y-1">
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="relative">
              <div className="w-12 h-12 rounded-xl bg-blue-500/10 dark:bg-blue-500/20 flex items-center justify-center mb-4">
                <PlayCircle className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                YouTube Integration
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Import any YouTube playlist instantly. No manual setup required.
              </p>
            </div>
          </div>

          {/* Feature 2 */}
          <div className="group relative p-6 rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 hover:shadow-xl hover:shadow-purple-500/10 transition-all duration-300 hover:-translate-y-1">
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-purple-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="relative">
              <div className="w-12 h-12 rounded-xl bg-purple-500/10 dark:bg-purple-500/20 flex items-center justify-center mb-4">
                <Target className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Progress Tracking
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Mark lessons complete and visualize your learning journey.
              </p>
            </div>
          </div>

          {/* Feature 3 */}
          <div className="group relative p-6 rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 hover:shadow-xl hover:shadow-green-500/10 transition-all duration-300 hover:-translate-y-1">
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-green-500/5 to-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="relative">
              <div className="w-12 h-12 rounded-xl bg-green-500/10 dark:bg-green-500/20 flex items-center justify-center mb-4">
                <BookOpen className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Organized Library
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                All your courses in one place. Filter, search, and manage easily.
              </p>
            </div>
          </div>

          {/* Feature 4 */}
          <div className="group relative p-6 rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 hover:shadow-xl hover:shadow-orange-500/10 transition-all duration-300 hover:-translate-y-1">
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-orange-500/5 to-red-500/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="relative">
              <div className="w-12 h-12 rounded-xl bg-orange-500/10 dark:bg-orange-500/20 flex items-center justify-center mb-4">
                <Code2 className="w-6 h-6 text-orange-600 dark:text-orange-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Built-in Compiler
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Practice coding while learning. Support for multiple languages.
              </p>
            </div>
          </div>

          {/* Feature 5 */}
          <div className="group relative p-6 rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 hover:shadow-xl hover:shadow-indigo-500/10 transition-all duration-300 hover:-translate-y-1">
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-indigo-500/5 to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="relative">
              <div className="w-12 h-12 rounded-xl bg-indigo-500/10 dark:bg-indigo-500/20 flex items-center justify-center mb-4">
                <Zap className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Distraction-Free
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                No recommendations, no ads. Just pure focused learning.
              </p>
            </div>
          </div>


        </div>
      </section>

      {/* How It Works Section */}
      <section className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-16 sm:pb-20 lg:pb-28">
        <HowItWorks />
      </section>


      <Footer />
    </div>
  );
}