"use client";

import { getUser } from "@/hooks/getUser";
import { incomingcall, localstream, onGoing, onlineUsers, peerAtom, remotestream, userSocket } from "@/jotai/atoms";
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
  const [pc, setPc] = useAtom(peerAtom);
  const iceCandidateBuffer = useRef<RTCIceCandidateInit[]>([]);

  useEffect(() => {
    if (pc && iceCandidateBuffer.current.length > 0) {
      iceCandidateBuffer.current.forEach(async (candidate) => {
        try {
          if (pc) {
            await pc.addIceCandidate(candidate);
            console.log("Buffered ICE candidate added successfully.");
          }
        } catch (error) {
          console.error("Error adding buffered ICE candidate:", error);
        }
      });
      iceCandidateBuffer.current = [];
    } else {
      console.log("No ICE candidates got buffered.");
    }
  }, [pc, localStream]);
  
  const End = () => {
    setOnGoingCall(null);
    setIncoming(null);
    setPc(null);
  };

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
          [checkPermissions, setLocalStream]
      );

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
      socket.onmessage = async(event) => {
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
          case 'offer':
            const peer = new RTCPeerConnection({
              iceServers: [
                {
                  urls: [
                    "stun:stun.l.google.com:19302",
                    "stun:stun1.l.google.com:19302",
                    "stun:stun2.l.google.com:19302",
                    "stun:stun3.l.google.com:19302",
                  ],
                },
              ],
            });
            peer.ontrack = (event) => {
              console.log("Remote stream received:", event.streams[0]);
              setRemoteStream(event.streams[0]);
            };
            const stream = await getMediaStream();
            if (stream) {
              stream.getTracks().forEach((track) => {
                console.log("Adding track to peer:", track);
                peer.addTrack(track, stream);
              });

            }
            await peer.setRemoteDescription(data.sdp);
            const answer = await peer?.createAnswer();
            await peer?.setLocalDescription(answer);
            socket?.send(JSON.stringify({ type: 'create-answer', user: data.user, sdp: answer }));
            console.log("Answer sent --");
            setPc(peer);
            peer.onicecandidate = (e) => {
              if (e.candidate) {
                socket?.send(JSON.stringify({ type: 'ice-candidate', user: data.user.reciever, candidate: e.candidate }));
              }
            }
            break;
            case 'answer':
              if (!pc)  {
                console.error("Peer connection not set.");
                return;
              }
              await pc.setRemoteDescription(data.sdp);
            break;
            case 'candidate':
              if (!pc) {
                console.log("Peer connection not initialized. Buffering ICE candidate...");
                iceCandidateBuffer.current.push(data.candidates);
              } else {
                try {
                  if (pc instanceof RTCPeerConnection) {
                    await pc.addIceCandidate(data.candidates);
                    console.log("ICE candidate added successfully.");
                  }
                } catch (error) {
                  console.error("Error adding ICE candidate:", error);
                }
              }
            break;
            default:
            console.warn("Unhandled message type:", data.type);
        }
      };
    }

    return () => {
      socket?.close();
    };
  }, [socket, setSocket, setRinging, setIncoming, currUser?.id, setPc, setRemoteStream]);



  return (
    <div className="relative flex flex-col items-center justify-center h-screen space-y-4">
    {incoming?.caller && <IncomingCall />}
    
    {/* Video Containers */}
    <div className="relative w-full h-full">
      <div className="absolute inset-0 border-8">
        <h3 className="text-lg font-semibold text-white absolute top-4 left-4 z-10">Remote</h3>
        <VideoContainer stream={remoteStream} isOnCall={true} isLocalStream={false}/>
      </div>
  
      <div 
        className="absolute bottom-4 right-4 w-[150px] h-[100px] cursor-move bg-black/70 border border-gray-300 rounded-md p-1 z-20"
        draggable
      >
        <h3 className="text-sm font-semibold text-white">Local</h3>
        <VideoContainer stream={localStream} isOnCall={true} isLocalStream={true} />
      </div>
    </div>
  
    {/* Call Control Buttons */}
    <div className="flex justify-center items-center space-x-4">
      <Button 
        onClick={() => toggleMic()} 
        className="p-2 rounded-full bg-gray-200 hover:bg-gray-300 shadow-lg"
      >
        {!mic ? <MdMic size={27} className="text-gray-700" /> : <MdMicOff size={27} className="text-red-500" />}
      </Button>
  
      <Button 
        onClick={End} 
        className="p-2 rounded-full bg-rose-500 hover:bg-rose-600 shadow-lg"
      >
        <MdCallEnd size={27} className="text-white" />
      </Button>
  
      <Button 
        onClick={toggleCamera} 
        className="p-2 rounded-full bg-gray-200 hover:bg-gray-300 shadow-lg"
      >
        {!vid ? <MdVideocamOff size={27} className="text-gray-700" /> : <MdVideocam size={27} className="text-green-500" />}
      </Button>
    </div>
  </div>
  
  );
};

export default Video;
