import axios from "axios";

const API_KEY = process.env.YOUTUBE_API_KEY;
const BASE_URL = "https://www.googleapis.com/youtube/v3";

export const extractVideoId = (url: string): string | null => {
    const regex =
        /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
    const match = url.match(regex);
    return match ? match[1] : null;
};

export const parseDuration = (duration: string): number => {
    const match = duration.match(/PT(\d+H)?(\d+M)?(\d+S)?/);
    if (!match) return 0;

    const hours = parseInt(match[1]) || 0;
    const minutes = parseInt(match[2]) || 0;
    const seconds = parseInt(match[3]) || 0;

    return hours * 3600 + minutes * 60 + seconds;
};

export const fetchVideoMetadata = async (videoIds: string[]) => {
    if (!API_KEY) throw new Error("YouTube API Key is missing");

    // YouTube API allows max 50 ids per request
    const chunks = [];
    for (let i = 0; i < videoIds.length; i += 50) {
        chunks.push(videoIds.slice(i, i + 50));
    }

    const results = [];

    for (const chunk of chunks) {
        const response = await axios.get(`${BASE_URL}/videos`, {
            params: {
                part: "snippet,contentDetails",
                id: chunk.join(","),
                key: API_KEY,
            },
        });
        results.push(...response.data.items);
    }

    return results;
};

export const fetchPlaylistVideos = async (playlistId: string) => {
    if (!API_KEY) throw new Error("YouTube API Key is missing");

    let videos: any[] = [];
    let nextPageToken = "";

    do {
        const response = await axios.get(`${BASE_URL}/playlistItems`, {
            params: {
                part: "snippet,contentDetails",
                playlistId: playlistId,
                maxResults: 50,
                pageToken: nextPageToken,
                key: API_KEY,
            },
        });

        const items = response.data.items
            .filter((item: any) => item.snippet && item.snippet.resourceId && item.snippet.resourceId.videoId)
            .map((item: any, index: number) => ({
                title: item.snippet.title,
                description: item.snippet.description,
                thumbnail:
                    item.snippet.thumbnails?.high?.url ||
                    item.snippet.thumbnails?.medium?.url ||
                    item.snippet.thumbnails?.default?.url,
                videoId: item.snippet.resourceId.videoId,
                order: index + videos.length + 1, // Global order across pages
            }));

        videos = [...videos, ...items];
        nextPageToken = response.data.nextPageToken;
    } while (nextPageToken && videos.length < 200); // Limit to 200 for now

    return videos;
};
