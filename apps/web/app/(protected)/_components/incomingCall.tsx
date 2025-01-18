import { useCallback } from 'react';
import { incomingcall, localstream, onCall, peerAtom, remotestream, userSocket } from "@/jotai/atoms";
import { Avatar, AvatarFallback, AvatarImage } from "@repo/ui/src/components/avatar";
import { Button } from "@repo/ui/src/components/button";
import { Card, CardContent, CardFooter, CardHeader } from "@repo/ui/src/components/card";
import { useAtom } from "jotai";
import { FaUser } from "react-icons/fa";
import { MdCall, MdCallEnd } from 'react-icons/md';
import { participants } from '@/schema';
import { getUser } from '@/hooks/getUser';

const IncomingCall = () => {
  const currUser = getUser();
  const [incoming, setIncoming] = useAtom(incomingcall);
  const [localStream, setLocalStream] = useAtom(localstream);
  const [remoteStream, setRemoteStream] = useAtom(remotestream);
  const [socket, setSocket] = useAtom(userSocket);
  const [pc, setPc] = useAtom(peerAtom);
  const [call, setCall] = useAtom(onCall);
  
  const decline = () => {
    socket?.send(JSON.stringify({ type: "decline", user: incoming?.caller }));
    setIncoming(null);
  }
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
  

  const createPeer = useCallback(async() => {
      if (!socket) return;
      const newPeer = new RTCPeerConnection({
        iceServers: [
          {
              urls: [
                "stun:stun.l.google.com:19302",
                "stun:stun1.l.google.com:19302",
                "stun:stun2.l.google.com:19302",
                "stun:stun3.l.google.com:19302",
              ],
          }
        ]
      });
      setPc(newPeer);
      newPeer.onnegotiationneeded = async () => {
        const offer = await newPeer.createOffer();
        await newPeer.setLocalDescription(offer);
        socket?.send(JSON.stringify({ type: 'create-offer', user: incoming, sdp: offer }));
      }
      newPeer.ontrack = (e) => {
        console.log("Got remote stream:", e.streams[0]);
        setRemoteStream(e.streams[0]);
      }
      socket.onmessage = async (e) => {
        const data = JSON.parse(e.data);
        switch (data.type) {
          case 'answer':
            await pc?.setRemoteDescription(data.sdp);
            console.log("Answer set");
            newPeer.ontrack = (e) => {
              console.log("Got remote stream:", e.streams[0]);
              setRemoteStream(e.streams[0]);
            }
          break;
          case 'candidate':
            await pc?.addIceCandidate(data.candidate);
            console.log("Candidate added");
          break;
          default:
            console.warn("Unhandled message type:", data.type);
          break;
        }
      }
      newPeer.onicecandidate = (e) => {
        if (e.candidate) {
            socket?.send(JSON.stringify({ type: 'ice-candidate', user: incoming?.caller, candidate: e.candidate }));
        }
      }
      newPeer.ontrack = (e) => {
        console.log("Got remote stream:", e.streams[0]);
        setRemoteStream(e.streams[0]);
      }

      return newPeer;
  }, [incoming, socket, setPc, setRemoteStream]);

  const handleJoin = useCallback(async() => {
      setCall(true);
      const stream = await getMediaStream();
      if (!stream) {
        console.log("Couldn't get stream in getMediaStream");
        return;
      }
      const peer = await createPeer();
      if (!peer) {
        console.log("Couldn't create peer in createPeer");
        return;
      }
      peer.ontrack = (e) => {
        console.log("Got remote stream:", e.streams[0]);
        setRemoteStream(e.streams[0]);
      }
      stream.getTracks().forEach((track) => {
        console.log("Adding track to peer:", track);
        peer.addTrack(track, stream);
      });
  }, [incoming]);


  if (!incoming) return null; 

  if (call) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <Card className="w-80 shadow-lg">
        <CardHeader className="flex items-center space-x-4 p-4">
          <Avatar className="cursor-pointer">
            <AvatarImage src={incoming?.caller.image || ""} />
            <AvatarFallback className="bg-sky-300 h-full w-full rounded-full flex items-center justify-center">
              <FaUser size={24} />
            </AvatarFallback>
          </Avatar>
          <div className="text-lg font-semibold">{incoming?.caller.name}</div>
        </CardHeader>
        <CardContent className="p-4">
          <p className="text-gray-600">Incoming call...</p>
        </CardContent>
        <CardFooter className="flex justify-around p-4">
          <Button className="w-12 h-12 rounded-full bg-green-500 flex items-center justify-center hover:bg-green-600" onClick={() => handleJoin()}>
            <MdCall size={24} className="text-white" />
          </Button>
          <Button className="w-12 h-12 rounded-full bg-red-500 flex items-center justify-center hover:bg-red-600" onClick={decline}>
            <MdCallEnd size={24} className="text-white" />
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default IncomingCall;
