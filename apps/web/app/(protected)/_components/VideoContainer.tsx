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
            console.log("VideoContainer rendered")
            videoRef.current.srcObject = stream;
        }
    }, [stream]);
    return (
        <video className="rounded border w-[800px]" autoPlay playsInline muted={isLocalStream}></video>
    )
}
export default VideoContainer;