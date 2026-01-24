"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState, useRef } from "react";
import { toast } from "sonner";
import EditCourse from "./EditCourse";
import ShareCourseModal from "./ShareCourse";
import { ShineBorder } from "@/components/ui/shine-border";
import { MoreVertical, PlayCircle, Clock, CheckCircle2 } from "lucide-react";

type Course = {
  id: string;
  title: string;
  description?: string;
  thumbnail?: string;
  totalVideos: number;
  completedLessons: number;
  percentage: number;
  type: "created" | "saved";
  shareId: string;
  source: "youtube" | "custom";
  playlistId?: string;
  authorId: string;
};

type FilterType = "all" | "created" | "saved";

export default function AllCourses() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [filter, setFilter] = useState<FilterType>("all");
  const [loading, setLoading] = useState(true);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<Course | undefined>(undefined);
  const [shareOpen, setShareOpen] = useState(false);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        const res = await fetch("/api/course/getAllCourse");
        const data = await res.json();
        setCourses(data.courses || []);
      } catch (error) {
        // silent fail
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  const handleUpdateCourse = (updated: Course) => {
    setCourses((prev) => prev.map((c) => (c.id === updated.id ? { ...c, ...updated } : c)));
  };

  const handleDeleteCourse = async (courseId: string) => {
    if (!window.confirm("Delete this course?")) return;
    const prevCourses = courses;
    setCourses((c) => c.filter((course) => course.id !== courseId));
    try {
      const res = await fetch(`/api/course/deleteCourse?courseId=${courseId}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed");
      toast.success("Course deleted");
    } catch (error) {
      setCourses(prevCourses);
      toast.error("Failed to delete");
    }
  };

  const filteredCourses = useMemo(() => {
    if (filter === "all") return courses;
    return courses.filter((c) => c.type === filter);
  }, [courses, filter]);

  return (
    <>
      <div className="space-y-6">
        {/* HEADER & FILTERS */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h2 className="text-2xl font-bold tracking-tight text-foreground">
            Your Library
            <span className="ml-2 text-sm font-medium text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
              {filteredCourses.length}
            </span>
          </h2>
          <div className="flex p-1 bg-muted/50 rounded-lg backdrop-blur-sm border border-border">
            {["all", "created", "saved"].map((f) => (
              <FilterButton
                key={f}
                label={f.charAt(0).toUpperCase() + f.slice(1)}
                active={filter === f}
                onClick={() => setFilter(f as FilterType)}
              />
            ))}
          </div>
        </div>

        {/* CONTENT */}
        {loading ? (
          <CourseSkeleton />
        ) : filteredCourses.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredCourses.map((course) => (
              <CourseCard
                key={course.id}
                course={course}
                openMenuId={openMenuId}
                setOpenMenuId={setOpenMenuId}
                onDelete={handleDeleteCourse}
                setOpen={setOpen}
                setSelectedCourse={setSelectedCourse}
                setShareOpen={setShareOpen}
              />
            ))}
          </div>
        )}
      </div>

      {selectedCourse && (
        <>
          <EditCourse
            course={selectedCourse}
            isOpen={open}
            onClose={() => setOpen(false)}
            onUpdated={(u) => { handleUpdateCourse(u); setOpen(false); }}
          />
          <ShareCourseModal
            isOpen={shareOpen}
            onClose={() => setShareOpen(false)}
            shareId={selectedCourse.shareId || ""}
          />
        </>
      )}
    </>
  );
}

// --- SUB COMPONENTS ---

function FilterButton({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all duration-200 ${active
        ? "bg-background text-foreground shadow-sm"
        : "text-muted-foreground hover:text-foreground hover:bg-background/50"
        }`}
    >
      {label}
    </button>
  );
}

function CourseCard({
  course,
  openMenuId,
  setOpenMenuId,
  onDelete,
  setOpen,
  setSelectedCourse,
  setShareOpen,
}: any) {
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        if (openMenuId === course.id) setOpenMenuId(null);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [openMenuId, course.id, setOpenMenuId]);

  return (
    <div className="group relative h-full flex flex-col bg-card rounded-2xl overflow-hidden border border-border/50 hover:shadow-xl hover:shadow-blue-500/10 transition-all duration-300 hover:-translate-y-1">
      <ShineBorder
        className="opacity-0 group-hover:opacity-100 pointer-events-none z-0"
        shineColor={["#3b82f6", "#8b5cf6"]}
      />

      <Link href={`/course/${course.shareId}`} className="relative z-10 flex flex-col h-full">
        {/* THUMBNAIL */}
        <div className="relative aspect-video w-full overflow-hidden bg-muted">
          {course.thumbnail ? (
            <Image
              src={course.thumbnail}
              alt={course.title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-muted-foreground">
              <PlayCircle size={48} className="opacity-20" />
            </div>
          )}

          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full text-white font-medium border border-white/20">
              <PlayCircle size={16} /> Resume
            </div>
          </div>

          <div className="absolute bottom-2 right-2 px-2 py-1 bg-black/80 backdrop-blur text-[10px] font-bold text-white rounded">
            {course.totalVideos} Lectures
          </div>
        </div>

        {/* INFO */}
        <div className="p-4 flex-1 flex flex-col gap-2">
          <h3 className="font-semibold text-base line-clamp-2 leading-tight group-hover:text-blue-500 transition-colors">
            {course.title}
          </h3>

          <p className="text-sm text-muted-foreground line-clamp-2 flex-1">
            {course.description || "No description provided."}
          </p>

          {/* PROGRESS */}
          <div className="mt-4 pt-4 border-t border-border/50">
            <div className="flex items-center justify-between text-xs font-medium mb-1.5">
              <span className="text-muted-foreground flex items-center gap-1.5">
                {course.percentage === 100 ? (
                  <CheckCircle2 size={14} className="text-green-500" />
                ) : (
                  <Clock size={14} />
                )}
                {course.percentage}% Complete
              </span>
            </div>
            <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${course.percentage === 100 ? "bg-green-500" : "bg-blue-600"}`}
                style={{ width: `${course.percentage}%` }}
              />
            </div>
          </div>
        </div>
      </Link>

      {/* MENU */}
      <div className="absolute top-2 right-2 z-20" ref={menuRef}>
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setOpenMenuId(openMenuId === course.id ? null : course.id);
          }}
          className="p-1.5 rounded-full bg-black/50 text-white backdrop-blur hover:bg-black/70 transition opacity-0 group-hover:opacity-100"
        >
          <MoreVertical size={16} />
        </button>

        {openMenuId === course.id && (
          <div className="absolute right-0 top-full mt-2 w-32 rounded-lg bg-popover border border-border shadow-xl overflow-hidden py-1 animate-in fade-in zoom-in-95 origin-top-right">
            <button
              onClick={(e) => { e.preventDefault(); e.stopPropagation(); setOpenMenuId(null); setSelectedCourse(course); setOpen(true); }}
              className="w-full text-left px-3 py-2 text-sm hover:bg-accent hover:text-accent-foreground"
            >
              Edit
            </button>
            <button
              onClick={(e) => { e.preventDefault(); e.stopPropagation(); setOpenMenuId(null); setSelectedCourse(course); setShareOpen(true); }}
              className="w-full text-left px-3 py-2 text-sm hover:bg-accent hover:text-accent-foreground"
            >
              Share
            </button>
            <button
              onClick={(e) => { e.preventDefault(); e.stopPropagation(); setOpenMenuId(null); onDelete(course.id); }}
              className="w-full text-left px-3 py-2 text-sm text-destructive hover:bg-destructive/10"
            >
              Delete
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function CourseSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="rounded-2xl border border-border bg-card overflow-hidden h-[300px] animate-pulse">
          <div className="h-48 bg-muted" />
          <div className="p-4 space-y-3">
            <div className="h-4 w-3/4 bg-muted rounded" />
            <div className="h-3 w-full bg-muted rounded" />
          </div>
        </div>
      ))}
    </div>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center border border-dashed border-border rounded-xl p-12 text-center bg-muted/10">
      <div className="h-16 w-16 bg-muted/20 rounded-full flex items-center justify-center mb-4">
        <PlayCircle size={32} className="text-muted-foreground opacity-50" />
      </div>
      <h3 className="text-lg font-semibold">No courses here yet</h3>
      <p className="text-muted-foreground text-sm max-w-sm mt-1 mb-6">
        Get started by creating your first course from a YouTube playlist!
      </p>
    </div>
  );
}
