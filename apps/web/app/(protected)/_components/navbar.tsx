"use client";
import UserButton from "@/components/auth/user-button";
import { getUser } from "@/hooks/getUser";
import { localstream, onGoing, onlineUsers, ring, userSocket } from "@/jotai/atoms";
import { participants, userType } from "@/schema";
import { Avatar, AvatarFallback, AvatarImage } from "@repo/ui/src/components/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@repo/ui/src/components/dropdown-menu";
import { useAtom } from "jotai";
import { useCallback, useEffect, useState } from "react";
import { FaUser, FaVideo } from "react-icons/fa";

const Navbar = () => {
    const [online] = useAtom(onlineUsers);
    const [socket, setSocket] = useAtom(userSocket);
    const [localStream, setLocalStream] = useAtom(localstream);
    const [ringing, setRinging] = useAtom(ring);
    const currUser = getUser();
    const [onGoingCall, setOnGoingCall] = useAtom(onGoing);

    const checkPermissions = async (): Promise<boolean> => {
        try {
            const cameraPermission = await navigator.permissions.query({ name: "camera" as PermissionName });
            const microphonePermission = await navigator.permissions.query({ name: "microphone" as PermissionName });
            if (cameraPermission.state !== "granted" || microphonePermission.state !== "granted") {
                console.warn("Camera or microphone permissions are not granted.");
                return false;
            }
            return true;
        } catch (error) {
            console.error("Error while checking permissions:", error);
            return false;
        }
    };
    
    const getMediaStream = useCallback(
        async (faceMode?: "user" | "environment"): Promise<MediaStream | null> => {
            const permissionsGranted = await checkPermissions();
            if (!permissionsGranted) return null;
    
            try {
                const devices = await navigator.mediaDevices.enumerateDevices();
                const videoInputs = devices.filter((device) => device.kind === "videoinput");
                const stream = await navigator.mediaDevices.getUserMedia({
                    audio: true,
                    video: {
                        width: { min: 640, ideal: 1280, max: 1920 },
                        height: { min: 360, ideal: 720, max: 1080 },
                        frameRate: { min: 16, ideal: 30, max: 30 },
                        facingMode: videoInputs.length > 0 ? faceMode : undefined,
                    },
                });
                setLocalStream(stream);
                console.log("Local stream set:", stream);
                return stream;
            } catch (error) {
                console.error("Error while getting local stream:", error);
                setLocalStream(null);
                return null;
            }
        },
        [localStream]);

    const handleCall = useCallback(async(user: userType) => {
        const stream = await getMediaStream();
        if (!stream) return;
        if (!socket || !currUser) {
            console.log("Socket is not there");
            return;
        }
        const participants: participants = { caller: { ...currUser }, reciever: { ...user.user } };
        setOnGoingCall({ participants: participants, isRinging: false });
        socket.send(JSON.stringify({ type: 'call', participants }));
        console.log("calling");
      }, [socket, currUser, onGoingCall, online, localStream]);


    return (
        <nav className="bg-secondary flex justify-between items-center p-4 rounded-xl w-[600xl] shadow-sm">
            <div className="flex items-center justify-center space-x-2">
                {
                    online.map((k, i) => (
                        <DropdownMenu key={k.user.email || i}>
                            <DropdownMenuTrigger>
                            <Avatar className="hover: cursor-pointer">
                                <AvatarImage src={k.user.image || ''} />
                                <AvatarFallback className='bg-sky-300 h-full w-full rounded'>
                                    <FaUser />
                                </AvatarFallback>
                            </Avatar>
                            </DropdownMenuTrigger>
                            {
                                !ringing && (
                                    <DropdownMenuContent className="flex items-center justify-center space-x-0 hover: cursor-pointer" onClick={() => handleCall(k)}>
                                        <FaVideo className="h-6 w-6 mr-2 text-green-300"/>
                                        <div className="mr-2">Facetime</div>
                                    </DropdownMenuContent>
                                )
                            }
                        </DropdownMenu>
                    ))
                }
            </div>
            <div>   
                <UserButton />
            </div>
        </nav>
    );
};

export default Navbar;
;