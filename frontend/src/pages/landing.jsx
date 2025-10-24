import React from "react";
import classNames from "classnames";

import { GridPattern } from "@/components/ui/grid-pattern";

export default function Landing() {
  return (
    <div className="flex flex-col relative">
      {/* Hero Section */}
      <div className="w-full min-h-screen flex flex-col md:flex-row justify-between px-20 py-12 relative overflow-hidden">
        {/* Grid Pattern with soft blue tone and edge fade */}
        <div className="absolute inset-0 pointer-events-none">
          <GridPattern
            squares={[
              [19, 4],
              [15, 1],
              [18, 2],
              [12, 3],
              [15, 5],
              [10, 10],
              [12, 15],
              [15, 10],
              [10, 15],
              [15, 10],
              [10, 15],
              [15, 10],
            ]}
            className={classNames(
              "[mask-image:radial-gradient(500px_circle_at_center,white,transparent)]",
              "inset-x-0 inset-y-[-30%] h-[200%] skew-y-12"
            )}
            style={{
              stroke: "rgba(59,130,246,.6 )", // <-- change this to the color you want for lines
              fill: "rgba(59,130,246,0.2)", // <-- change this for the filled squares
            }}
          />
          {/* Edge fade mask using gradient */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              maskImage: "radial-gradient(circle, black 70%, transparent 100%)",
              WebkitMaskImage:
                "radial-gradient(circle, black 70%, transparent 100%)",
              maskRepeat: "no-repeat",
              WebkitMaskRepeat: "no-repeat",
              maskSize: "100% 100%",
              WebkitMaskSize: "100% 100%",
            }}
          />
        </div>

        {/* Left Content */}
        <div className="flex flex-col flex-1 justify-center space-y-6 text-center md:text-left relative z-10">
          <p className="text-2xl sm:text-3xl md:text-4xl font-semibold">
            Learn new skills, monetize your knowledge, and grow your community.
          </p>
          <p className="font-sans text-lg">What are you waiting for?</p>
          <button className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold w-max mx-auto md:mx-0 hover:bg-blue-800 transition">
            Explore Courses
          </button>
        </div>

        {/* Right Image */}
        <div className="flex-1 flex justify-end items-center mt-8 md:mt-0 relative z-10">
          <img
            src="https://i.postimg.cc/DfCybcDT/landing.png"
            alt="Landing"
            className="w-[80%] md:max-w-[500px] h-auto"
          />
        </div>
      </div>
    </div>
  );
}
