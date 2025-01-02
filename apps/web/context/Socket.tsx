import { useEffect, useState } from "react";

const useSocket = () => {
    const [socket, setSocket] = useState<WebSocket | null>(null);
    useEffect(() => {
        if (!socket) {
            const ws = new WebSocket("ws://localhost:8080");
            ws.onopen = () => {
                console.log("Connected to server");
            };
            ws.onerror = (error) => console.error("Error at: ",error);
            ws.onclose = () => {
                console.log("Disconnected from server");
            };
            setSocket(ws);
        }
    }, [socket]);
    return socket;
}

export default useSocket;