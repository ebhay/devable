"use client";

import { Search, ClipboardPaste, Zap, ChartLine } from "lucide-react";
import { ShineBorder } from "@/components/ui/shine-border";

const features = [
    {
        icon: Search,
        title: "Find a YouTube Playlist",
        description:
            "Discover any playlist on YouTube that you want to learn from seriously. Tutorials, bootcamps, or lecture series.",
        step: "01",
    },
    {
        icon: ClipboardPaste,
        title: "Paste the URL",
        description:
            "Copy the playlist link and paste it into Devable. We instantly turn it into a structured, trackable course.",
        step: "02",
    },
    {
        icon: Zap,
        title: "Learn Distraction-Free",
        description:
            "Watch videos in our clean player - no ads, no recommendations, no comments. Just pure focus.",
        step: "03",
    },
    {
        icon: ChartLine,
        title: "Track Your Progress",
        description:
            "Mark lectures complete, see percentages, and resume exactly where you left off. Gamify your learning.",
        step: "04",
    },
];

export function HowItWorks() {
    return (
        <section className="relative w-full py-20 md:py-32 overflow-hidden">
            <div className="container px-4 md:px-6 mx-auto relative z-10">

                {/* Section Header */}
                <div className="flex flex-col items-center justify-center text-center mb-16 space-y-4">
                    <div className="inline-block rounded-lg bg-blue-100 dark:bg-blue-900/30 px-3 py-1 text-sm font-medium text-blue-600 dark:text-blue-300">
                        Process
                    </div>
                    <h2 className="text-3xl md:text-5xl font-bold tracking-tighter bg-clip-text text-transparent bg-gradient-to-b from-gray-900 to-gray-600 dark:from-white dark:to-gray-400">
                        How Devable Works
                    </h2>
                    <p className="max-w-[700px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
                        From chaos to completion in 4 simple steps.
                    </p>
                </div>

                {/* Steps Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {features.map((feature, index) => (
                        <div
                            key={index}
                            className="group relative flex flex-col h-full bg-white dark:bg-gray-950 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                        >
                            {/* Shine Border Effect */}
                            <ShineBorder
                                className="opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                                shineColor={["#3b82f6", "#8b5cf6", "#ec4899"]} /* Blue, Violet, Pink */
                                duration={10}
                            />

                            {/* Card Content */}
                            <div className="relative z-10 p-6 flex flex-col h-full border border-gray-100 dark:border-gray-800 rounded-xl bg-white/50 dark:bg-gray-950/50 backdrop-blur-sm">

                                {/* Step Number */}
                                <span className="absolute top-4 right-4 text-6xl font-black text-gray-100 dark:text-gray-900 -z-10 select-none group-hover:text-blue-50/50 dark:group-hover:text-blue-900/10 transition-colors">
                                    {feature.step}
                                </span>

                                {/* Icon */}
                                <div className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform duration-300">
                                    <feature.icon className="h-6 w-6" />
                                </div>

                                {/* Text */}
                                <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                                    {feature.title}
                                </h3>
                                <p className="text-gray-500 dark:text-gray-400 leading-relaxed text-sm flex-grow">
                                    {feature.description}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>

            </div>

            {/* Background Decor */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full max-w-7xl -z-10 pointer-events-none">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-[100px]" />
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-[100px]" />
            </div>

        </section>
    );
}
