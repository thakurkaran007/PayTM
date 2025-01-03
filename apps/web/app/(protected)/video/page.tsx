import { socketState } from "@/recoil/atoms";
import { Button } from "@repo/ui/src/components/button";
import { useSession } from "next-auth/react";
import { useEffect, useRef } from "react";
import { useRecoilState } from "recoil";

const Video = () => {
    const user = useSession().data?.user;
    const [socket, setSocket] = useRecoilState(socketState);
    const localRef = useRef<HTMLVideoElement>(null);
    const remoteRef = useRef<HTMLVideoElement>(null);

    const Start = () => {

    }

    useEffect(() => {
        if (!socket) {
            const newSocket = new WebSocket("ws://localhost:8080");
            newSocket.onopen = () => {
                console.log("Connected");
                setSocket(newSocket);
            }
            newSocket.send(JSON.stringify({type: "add-user", id: user?.id}));
            newSocket.onclose = () => {
                console.log("Disconnected");
                setSocket(null);
            }
        } else {
            socket.onmessage = (event) => {
                const message = JSON.parse(event.data);
                
            }
        }
        return () => {
            socket?.close();
        }
    }, [socket]);

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
    )
}