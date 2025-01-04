import { WebSocketServer, WebSocket } from "ws";
import { db } from "@repo/db/index";

const wss = new WebSocketServer({ port: 8080 });
console.log("server started on port 8080");

interface User {
  socket: WebSocket;
  id: string;
}

let onlineUsers: User[] = [];

wss.on('connection', (socket: WebSocket) => {
  socket.on('error', console.error);

  socket.on('message', (data) => {
    const message = JSON.parse(data.toString());
    try {
      switch (message.type) {
        case 'add-user':
            onlineUsers.push({ socket, id: message.id });
            break;
      }
    } catch (error) {
      console.error('Error parsing message:', error);
    }
  });

  socket.on('close', () => {
    onlineUsers = onlineUsers.filter(user => user.socket !== socket);
  });
});
