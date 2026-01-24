import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { YouTubeVideoData } from "@/types";
import {
  extractVideoId,
  fetchPlaylistVideos,
  fetchVideoMetadata,
  parseDuration,
} from "@/lib/youtube";
import { nanoid } from "nanoid";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { title, description, playlistId, source, links } = body;

    // Verify user exists in DB (handles stale session case)
    const user = await prisma.user.findUnique({
      where: { email: session.user.email as string },
    });

    if (!user) {
      return NextResponse.json(
        { error: "User record not found. Please sign out and sign in again." },
        { status: 401 }
      );
    }

    if (!title || !source) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    if (source === "youtube" && !playlistId) {
      return NextResponse.json(
        { error: "Playlist ID required" },
        { status: 400 }
      );
    }

    if (source === "custom") {
      if (!links || !Array.isArray(links) || links.length === 0) {
        return NextResponse.json(
          { error: "Please provide at least one link" },
          { status: 400 }
        );
      }

      // Extract IDs
      const videoIds = links
        .map(extractVideoId)
        .filter((id): id is string => Boolean(id));

      if (videoIds.length === 0) {
        return NextResponse.json(
          { error: "No valid YouTube video links found" },
          { status: 400 }
        );
      }

      if (videoIds.length > 200) {
        return NextResponse.json(
          { error: "Maximum 200 videos allowed per course" },
          { status: 400 }
        );
      }

      // Fetch metadata in batches
      const videos = await fetchVideoMetadata(videoIds);

      // Normalize lessons
      const lessons = videos.map((video: any, index: number) => ({
        title: video.snippet.title,
        videoId: video.id,
        description: video.snippet.description,
        thumbnail:
          video.snippet.thumbnails.maxres?.url ??
          video.snippet.thumbnails.high?.url ??
          video.snippet.thumbnails.medium?.url ??
          null,
        embedUrl: `https://www.youtube.com/embed/${video.id}`,
        duration: parseDuration(video.contentDetails.duration),
        order: index + 1,
      }));

      // Create course (without transaction)
      const course = await prisma.course.create({
        data: {
          title,
          description,
          source: "custom",
          totalVideos: lessons.length,
          thumbnail: lessons[0]?.thumbnail || null,
          author: {
            connect: { email: session.user.email as string },
          },
          shareId: nanoid(10),
        },
      });

      try {
        // Create lessons
        await prisma.lesson.createMany({
          data: lessons.map((l: any) => ({
            ...l,
            courseId: course.id,
          })),
        });

        return NextResponse.json({
          success: true,
          courseId: course.id,
          totalVideos: lessons.length,
        });
      } catch (error) {
        // Cleanup on failure
        await prisma.course.delete({ where: { id: course.id } }).catch(() => { });
        throw error;
      }

    }

    // Fetch playlist videos
    const videos = await fetchPlaylistVideos(playlistId);

    // Create course (without transaction to avoid timeout/transient errors)
    const createdCourse = await prisma.course.create({
      data: {
        title,
        description,
        playlistId,
        source: "youtube",
        totalVideos: videos.length,
        thumbnail: videos[0]?.thumbnail || null,
        author: {
          connect: { email: session.user.email as string },
        },
        shareId: nanoid(10),
      },
    });

    try {
      // Create lessons
      await prisma.lesson.createMany({
        data: videos.map((video: YouTubeVideoData) => ({
          title: video.title,
          videoId: video.videoId,
          description: video.description,
          thumbnail: video.thumbnail || null,
          embedUrl: `https://www.youtube.com/embed/${video.videoId}`,
          order: video.order,
          courseId: createdCourse.id,
        })),
      });

      return NextResponse.json({ course: createdCourse }, { status: 200 });

    } catch (error) {
      // If lesson creation fails, attempt to clean up the course
      await prisma.course.delete({ where: { id: createdCourse.id } }).catch(() => { });
      throw error; // Re-throw to be caught by outer try-catch
    }
  } catch (error) {
    console.error("Create Course Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
