"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { AnimatedThemeToggler } from "@/components/ui/animated-theme-toggler";
import { LogOut, Plus } from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import CreateCourseModal from "@/components/CreateCourse";

export function Navbar() {
    const { data: session } = useSession();
    const [openCreate, setOpenCreate] = useState(false);
    const pathname = usePathname();

    return (
        <>
            <nav className="fixed top-0 left-0 right-0 z-50 w-full flex items-center justify-between px-6 py-3 backdrop-blur-xl bg-white/80 dark:bg-black/80 border-b border-gray-200/20 dark:border-gray-800/50 shadow-sm transition-all duration-300">
                {/* Logo */}
                <Link href="/" className="flex items-center space-x-2 group">
                    <div className="relative w-8 h-8 transition-transform group-hover:scale-110">
                        <Image
                            src="/logo.svg"
                            alt="Devable Logo"
                            fill
                            className="object-contain"
                            priority
                        />
                    </div>
                    <span className="font-bold text-2xl tracking-tight text-gray-900 dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-blue-500 transition-colors">
                        Devable
                    </span>
                </Link>

                <div className="flex items-center md:gap-6 gap-4">
                    <div className="hidden md:flex items-center space-x-1 text-sm font-medium">
                        <Link
                            href="/dashboard"
                            className={`px-4 py-2 rounded-lg transition-all ${pathname === '/dashboard'
                                ? 'bg-blue-600 text-white shadow-sm'
                                : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                                }`}
                        >
                            Courses
                        </Link>
                        <Link
                            href="/compiler"
                            className={`px-4 py-2 rounded-lg transition-all ${pathname === '/compiler'
                                ? 'bg-blue-600 text-white shadow-sm'
                                : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                                }`}
                        >
                            Compiler
                        </Link>
                    </div>

                    <div className="h-6 w-px bg-border/50 hidden md:block"></div>

                    <div className="flex items-center gap-3">
                        {session ? (
                            <>
                                <button
                                    onClick={() => setOpenCreate(true)}
                                    className="hidden md:flex items-center gap-2 px-3 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm transition-all active:scale-95"
                                >
                                    <Plus size={14} strokeWidth={3} />
                                    <span>Create Course</span>
                                </button>

                                <AnimatedThemeToggler />

                                <button
                                    onClick={() => signOut({ callbackUrl: "/" })}
                                    className="p-2 text-muted-foreground hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full transition-colors"
                                    title="Sign Out"
                                >
                                    <LogOut size={18} />
                                </button>
                            </>
                        ) : (
                            <>
                                <AnimatedThemeToggler />
                                <Link href="/login">
                                    <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white border-none shadow-blue-500/20">
                                        Get Started
                                    </Button>
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </nav>

            <CreateCourseModal
                isOpen={openCreate}
                onClose={() => setOpenCreate(false)}
                onCreated={() => window.location.reload()}
            />
        </>
    );
}

export default Navbar;
