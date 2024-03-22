import { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import ytdl from "ytdl-core";

export async function POST(request: NextRequest) {
    try {
        const { url } = await request.json();
        const videoInfo = await ytdl.getInfo(url);
        const videoFormats = ytdl.filterFormats(videoInfo.formats, "videoandaudio");

        // Find a format suitable for direct download
        let preferredFormat = videoFormats.find(format => format.qualityLabel === '1080p' && format.container === 'mp4');
        if (!preferredFormat) {
            // If preferred format is not found, try selecting a lower quality format
            preferredFormat = videoFormats.find(format => format.container === 'mp4');
        }

        if (!preferredFormat) {
            throw new Error('No suitable format found for download');
        }

        // Get the direct URL of the preferred format
        const videoDownloadUrl = preferredFormat.url;
        return NextResponse.json({ videoDownloadUrl });

    } catch (error) {
        console.error("Error:", error);
        return NextResponse.json({ "msg": error });
    }
}
