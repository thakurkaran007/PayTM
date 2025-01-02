"use client";

import { Button } from "@repo/ui/src/components/button";
import { Input } from "@repo/ui/src/components/input";
import { useEffect, useRef, useState } from "react";

const Video = () => {
    const [pc, setPc] = useState<RTCPeerConnection | null>(null);
    const localVideoRef = useRef<HTMLVideoElement>(null);
    const remoteVideoRef = useRef<HTMLVideoElement>(null);

    useEffect(() => {
        if (!pc) {
            setPc(new RTCPeerConnection());
        }
    }, [pc]);

    const startWebCam = async () => {
        try {
            const localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
            if (localVideoRef.current) {
                localVideoRef.current.srcObject = localStream;
            }
            const remoteStream = new MediaStream();
            localStream.getTracks().forEach((track) => {
                pc?.addTrack(track, localStream);
            });

            if (pc) {
                pc.ontrack = (event) => {
                    event.streams[0].getTracks().forEach((track) => {
                        remoteStream.addTrack(track);
                    });
                    if (remoteVideoRef.current) {
                        remoteVideoRef.current.srcObject = remoteStream;
                    }
                };  
            }
        } catch (error) {
            console.error("Error accessing webcam:", error);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center h-screen space-y-4">
            <h2 className="text-lg font-bold">Start your Webcam</h2>
            <div className="flex space-x-4">
                <div>
                    <h3 className="text-md font-semibold">Local</h3>
                    <video ref={localVideoRef} autoPlay playsInline className="border rounded"></video>
                </div>
                <div>
                    <h3 className="text-md font-semibold">Remote</h3>
                    <video ref={remoteVideoRef} autoPlay playsInline className="border rounded"></video>
                </div>
            </div>
            <Button variant="default" onClick={startWebCam}>
                Start WebCam
            </Button>
            <h2 className="text-lg font-bold">Create a New Call</h2>
            <Button disabled>Call</Button>
            <h2 className="text-lg font-bold">Join Call</h2>
            <Input placeholder="Enter Call ID" />
            <div className="space-x-2">
                <Button disabled>Answer</Button>
                <Button disabled>Reject</Button>
            </div>
        </div>
    );
};

export default Video;
