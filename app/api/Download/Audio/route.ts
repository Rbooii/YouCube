import { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import ytdl from "ytdl-core";

export async function POST(request: NextRequest) {
    try {
        const { url } = await request.json();
        const videoInfo = await ytdl.getInfo(url);
        const audioFormats = ytdl.filterFormats(videoInfo.formats, "audioonly");

        // Find a format suitable for direct download
        let preferredFormat = audioFormats.find(format => format.audioQuality === 'AUDIO_QUALITY_MEDIUM' && format.container === 'mp4');
        if (!preferredFormat) {
            // If preferred format is not found, try selecting a lower quality format
            preferredFormat = audioFormats.find(format => format.container === 'mp4');
        }

        if (!preferredFormat) {
            throw new Error('No suitable format found for download');
        }

        // Get the direct URL of the preferred format
        const audioDownloadUrl = preferredFormat.url;
        return NextResponse.json({ audioDownloadUrl });

    } catch (error) {
        console.error("Error:", error);
        return NextResponse.json({ "msg": error });
    }
}
