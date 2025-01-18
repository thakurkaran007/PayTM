import { useEffect, useRef } from "react";

interface propVideo {
    stream: MediaStream | null;
    isLocalStream: boolean;
    isOnCall: boolean;
}
const VideoContainer = ({ stream, isLocalStream, isOnCall }: propVideo) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    
    useEffect(() => {
        if (videoRef.current && stream) {
            console.log("VideoContainer rendered caller: ", !isLocalStream, stream);
            console.log("Stream tracks: ", stream.getTracks());
            console.log("Video tracks: ", stream.getVideoTracks());
            videoRef.current.srcObject = stream;
        }
    }, [stream]);
    
    return (
        <video className={`rounded border ${isLocalStream ? "w-[200px]": "w-screen h-full"}`} ref={videoRef} autoPlay playsInline muted={isLocalStream}></video>
    )
}
export default VideoContainer;