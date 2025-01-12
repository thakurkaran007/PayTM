"use client";

import { getUser } from "@/hooks/getUser";
import { onlineUsers, userSocket } from "@/jotai/atoms";
import { userType } from "@/schema";
import { Button } from "@repo/ui/src/components/button";
import { useAtom } from "jotai";
import { useEffect, useRef, useState } from "react";

const Video = () => {
  const [socket, setSocket] = useAtom(userSocket);
  const [online, setOnline] = useAtom(onlineUsers);
  const user = getUser();
  const [pc, setPc] = useState<RTCPeerConnection | null>(null);
  const localRef = useRef<HTMLVideoElement>(null);
  const remoteRef = useRef<HTMLVideoElement>(null);

  const Start = () => {
    const Pc = new RTCPeerConnection();
    setPc(Pc);
  };

  useEffect(() => {
    if (!socket) {
      const newSocket = new WebSocket("ws://localhost:8080");

      newSocket.onopen = () => {
        console.log("Connected");
        setSocket(newSocket);
        newSocket.send(JSON.stringify({ type: "add-user", id: user?.id }));
      };

      newSocket.onclose = () => {
        console.log("Disconnected");
        setSocket(null);
      };

      newSocket.onmessage = (event) => {
        const data = JSON.parse(event.data);
        console.log("data: ", data);

        switch (data.type) {
          case "getUsers":
            if (data.users) {

              const filteredUsers = data.users.filter(
                (u: userType) => u.user.id !== user?.id
              );
              setOnline(filteredUsers);
            }
            break;

          default:
            console.warn("Unhandled message type:", data.type);
        }
      };
    } else {
      socket.onmessage = (event) => {
        const data = JSON.parse(event.data);
        console.log("data: ", data);

        switch (data.type) {
          case "getUsers":
            if (data.users) {
              const filteredUsers = data.users.filter(
                (u: userType) => u.user.id !== user?.id
              );
              setOnline(filteredUsers);
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
  }, [socket, setSocket, user?.id]);

  return (
    <div className="flex flex-col items-center justify-center h-screen space-y-4">
      <h2 className="text-lg font-bold">Start Your WebCam</h2>
      <div className="flex space-x-4">
        <div>
          <h3 className="text-md font-semibold">Local</h3>
          <video ref={localRef} autoPlay playsInline className="border rounded"></video>
        </div>
        <div>
          <h3 className="text-md font-semibold">Remote</h3>
          <video ref={remoteRef} autoPlay playsInline className="border rounded"></video>
        </div>
      </div>
      <Button variant={"default"} onClick={Start}>
        Start Web Cam
      </Button>
    </div>
  );
};

export default Video;
