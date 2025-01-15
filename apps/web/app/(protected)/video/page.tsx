"use client";

import { getUser } from "@/hooks/getUser";
import { incomingcall, localstream, onGoing, onlineUsers, remotestream, userSocket } from "@/jotai/atoms";
import { userType } from "@/schema";
import { Button } from "@repo/ui/src/components/button";
import { useAtom } from "jotai";
import { useCallback, useEffect, useRef, useState } from "react";
import IncomingCall from "../_components/incomingCall";
import VideoContainer from "../_components/VideoContainer";
import { MdCallEnd, MdMic, MdMicOff, MdVideocam, MdVideocamOff } from "react-icons/md";

const Video = () => {
  const currUser = getUser();
  const [localStream, setLocalStream] = useAtom(localstream);
  const [remoteStream, setRemoteStream] = useAtom(remotestream);
  const [socket, setSocket] = useAtom(userSocket);
  const [online, setOnline] = useAtom(onlineUsers);
  const [incoming, setIncoming] = useAtom(incomingcall);
  const [onGoingCall, setOnGoingCall] = useAtom(onGoing);
  const [mic, setMic] = useState<boolean>(false);
  const [vid, setVid] = useState<boolean>(false);
  const [ringing, setRinging] = useState<boolean>(false);
  const [pc, setPc] = useState<RTCPeerConnection | null>(null);

  const End = () => {
  };


  const toggleCamera = useCallback(() => {
    if (localStream) {
      const videoTrack = localStream.getVideoTracks()[0];
      videoTrack.enabled = !videoTrack.enabled;
      setVid(videoTrack.enabled);
    }
  }, [localStream]);

  const toggleMic = useCallback(() => {
    if (localStream) {
      const audioTrack = localStream.getAudioTracks()[0];
      audioTrack.enabled = !audioTrack.enabled;
      setMic(audioTrack.enabled);
    }
  }, [localStream]);

  useEffect(() => {
    if (!socket) {
      const newSocket = new WebSocket("ws://localhost:8080");

      newSocket.onopen = () => {
        console.log("Connected");
        setSocket(newSocket);
        newSocket.send(JSON.stringify({ type: "add-user", id: currUser?.id }));
      };

      newSocket.onclose = () => {
        console.log("Disconnected");
        setSocket(null);
      };
    } else {
      socket.onmessage = (event) => {
        const data = JSON.parse(event.data);
        console.log("data: ", data);

        switch (data.type) {
          case "getUsers":
            if (data.users) {
              const filteredUsers = data.users.filter(
                (u: userType) => u.user.id !== currUser?.id
              );
              setOnline(filteredUsers);
            }
            break;
          case 'incomingCall':
            if (data.participants) {
              setIncoming({ ...data.participants });
              console.log("Participants set to: ", incoming);
            }
            break;
          case 'ringing':
            setRinging(true);
            console.log("ringing is true");
            break;
          case 'declined':
            setRinging(false);
            setOnGoingCall(null);
            console.log("user declined");
            break;
          default:
            console.warn("Unhandled message type:", data.type);
        }
      };
    }

    return () => {
      socket?.close();
    };
  }, [socket, setSocket, setRinging, setIncoming, currUser?.id]);


  return (
    <div className="flex flex-col items-center justify-center h-screen space-y-4">
      {incoming?.caller && <IncomingCall />}
      <div className="flex space-x-4">
        <div>
          <h3 className="text-md font-semibold">Local</h3>
          <VideoContainer stream={localStream} isOnCall={false} isLocalStream={true}/>
        </div>
        <div>
          <h3 className="text-md font-semibold">Remote</h3>
          <VideoContainer stream={remoteStream} isOnCall={false} isLocalStream={false}/>
        </div>
      </div>
      <div className="flex justify-center items-center">
          <Button onClick={toggleMic}>
            { !mic && <MdMic size={27}/> }
            { mic && <MdMicOff size={27}/> }
          </Button>
          <Button onClick={End} className="bg-rose-500"> <MdCallEnd /> </Button>
          <Button onClick={toggleCamera}>
            { !vid && <MdVideocamOff size={27}/> }
            { vid && <MdVideocam size={27}/> }
          </Button>
      </div>
    </div>
  );
};

export default Video;
