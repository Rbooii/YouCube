"use client"
import { ToggleTheme } from '@/components/ToggleTheme'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import React, { useState } from 'react'

import { FileAudio, FileVideo, Loader2} from 'lucide-react'

function Homepage() {
  const [btnloading, setBtnLoading] = useState<boolean>(false)
  const [btnloadingAudio, setBtnLoadingAudio] = useState<boolean>(false)
  const [link, setLink] = useState<string>("")
  // Function to extract video ID from YouTube link
  function extractVideoId(url: string): string | null {
    const regExp = /^.*(youtu.be\/|v\/|e\/|u\/\w+\/|embed\/|v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? match[2] : null;
  }

  // Function to generate YouTube embed URL
  function generateEmbedUrl(videoId: string | null): string | null {
    return videoId ? `https://www.youtube.com/embed/${videoId}` : null;
  }

  const videoId = extractVideoId(link);
  const embedUrl = generateEmbedUrl(videoId);

  const handleVideo = async () => {
    try {
      setBtnLoading(true)
      const req = await fetch('/api/Download/video', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          url: link,
          id: videoId
        })
      });

      const res = await req.json();
      const resDownload = res.videoDownloadUrl;

      // Create a temporary link element
      const downloadLink = document.createElement('a');
      downloadLink.href = resDownload;
      downloadLink.target = "_blank"
      downloadLink.setAttribute('download', 'video.mp4'); // Set the file name
      document.body.appendChild(downloadLink);

      // Trigger the download
      downloadLink.click();

      // Clean up
      document.body.removeChild(downloadLink);
      setBtnLoading(false)
    } catch (error) {
      console.error(error);
    }
  };

  const handleAudio = async () => {
    try {
      setBtnLoadingAudio(true)
      const req = await fetch('/api/Download/Audio', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          url: link,
          id: videoId
        })
      });

      const res = await req.json();
      const resDownload = res.audioDownloadUrl;

      // Create a temporary link element
      const downloadLink = document.createElement('a');
      downloadLink.target = "_blank"
      downloadLink.href = resDownload;
      downloadLink.setAttribute('download', 'video.mp3'); // Set the file name
      document.body.appendChild(downloadLink);

      // Trigger the download
      downloadLink.click();

      // Clean up
      document.body.removeChild(downloadLink);
      setBtnLoadingAudio(false)
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <main className='md:w-8/12 w-11/12 mx-auto min-h-screen'>
      <div className='w-full min-h-fit pt-5'>
        <ToggleTheme />
      </div>
      <h1 className='text-center text-5xl font-bold text-red-500'>YouCube</h1>
      <p className='text-center'>A perfect minimalist Youtube Downloader</p>

      <Input placeholder='Video Link' className='mt-5 mx-auto lg:w-9/12 w-11/12 rounded-3xl p-4 font-xl'
        value={link}
        onChange={(e) => setLink(e.target.value)}
      ></Input>


      {embedUrl && (
        <>
          <iframe
            src={embedUrl}
            title="YouTube video player"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className='mx-auto mt-7 rounded-xl w-[320px] h-[200px]'
          ></iframe>

          <Card className='lg:w-9/12 w-11/12 mx-auto mt-5 mb-5 rounded-3xl'>
            <CardHeader>
              <CardTitle>Download Options</CardTitle>
              <CardDescription>Choose Your Prefered Download Options!</CardDescription>
            </CardHeader>
            <CardContent className='flex gap-3 items-center justify-center max-[445px]:block'>
              <Button onClick={handleVideo}
                className='max-[445px]:block max-[445px]:mx-auto hover:scale-105 transition-transform'
              ><div className='flex'>
                  {btnloading && <Loader2 className='mr-2 h-4 w-4 mt-1 animate-spin' />}
                  Download Video<FileVideo className='ml-2' /></div></Button>
              <Button onClick={handleAudio}
                className='max-[445px]:block max-[445px]:mx-auto max-[445px]:mt-3 hover:scale-105 transition-transform'
              ><div className='flex'>
                  {btnloadingAudio && <Loader2 className='mr-2 h-4 w-4 mt-1 animate-spin' />}
                  Download Audio<FileAudio className='ml-2' /></div></Button>
            </CardContent>
          </Card>
        </>
      )}

      <Card className='lg:w-9/12 w-11/12 mx-auto mt-5 mb-5 rounded-3xl'>
        <CardHeader>
          <CardTitle className='text-5xl font-bold text-red-500 text-center'>How To Use ?</CardTitle>
        </CardHeader>
        <CardContent>                   
          <ul className='list-decimal ml-10 text-xl'>
            <li className='mt-1'>Paste The Youtube link</li>
            <li className='mt-1'>Choose wether you want to Download A video or Audio</li>
            <li className='mt-1'>Click One of the button</li>
            <li className='mt-1'>if its Loading just wait usually it wouldn't take up to 1 minute</li>
            <li className='mt-1'>a new Page(tab) with weird url will be opened dont worry its not some sketchy website, its Actually Google's server!</li>
            <li className='mt-1'>Hit the 3 dots and choose download (the video quality is 1:1 with the downloaded video so you can preview it before you download it)</li>
            <li className='mt-1'>If the download wont start, close the Tab (the weird url one)</li>
            <li className='mt-1'>Your Download Will eventually Begin soon!</li>
          </ul>
          <h2 className='text-5xl text-center font-bold mt-3 mb-2 text-red-500'>How it works ?</h2>
          <p className='text-xl'>Hello, Developer Here trying to explain How this Thing Works, so Basically This app Has a Few Steps but For short This app is actually Turning A youtube Video Into A raw GoogleVideo.com Video link Where you can Download the Audio or The Video!</p>
          <ul className='list-disc ml-10 text-xl mt-5'>
            <li className='mt-1'>Link from Youtube url you pasted in is Converted into id</li>
            <li className='mt-1'>id from your video is send to our magically converting server</li>
            <li className='mt-1'>if you choose Video the server will return with a link from googlevideo.com wich basically store that video in google's server (i guess lol)</li>
            <li className='mt-1'>vice versa for Audio</li>
            <li className='mt-1'>and then a New Tab will open in your browser</li>
            <li className='mt-1'>Voila! just click the three dots and choose download! (you can preview the vid/aud before you Download it!)</li>
          </ul>
        </CardContent>
      </Card>
    </main>
  )
}

export default Homepage