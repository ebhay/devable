"use client";

import React from "react";
import Link from "next/link";

export function Footer() {
    return (
        <footer className="w-full mt-10">
            <div className="mx-auto max-w-7xl px-4 py-4">
                <div className="flex justify-center items-center">
                    <p className="text-sm text-gray-700 dark:text-gray-300 tracking-wide">
                        © {new Date().getFullYear()}
                        <span className="mx-2"> Devable</span>
                    </p>
                </div>
            </div>
        </footer>
    );
}

export default Footer;

