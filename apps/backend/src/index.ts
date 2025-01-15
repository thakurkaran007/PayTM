import { UserRole } from '@prisma/client';
import { WebSocketServer, WebSocket } from 'ws';
import { getUser } from './user.js';

const wss = new WebSocketServer({ port: 8080 });
console.log('Server started on port 8080');

interface User {
  socket: WebSocket;
  user: {
    id?: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
    role?: UserRole | null;
  };
}

let onlineUsers: User[] = [];

wss.on('connection', (socket: WebSocket) => {
  console.log('New connection established');

  socket.on('error', console.error);

  socket.on('message', async (data) => {
    try {
      const message = JSON.parse(data.toString());

      switch (message.type) {
        case 'add-user':
            const x = await getUser(message.id);
            if (x) {
              onlineUsers.push({ socket: socket, user: x });
              broadcastUserList();
            } else {
              console.error(`User with ID ${message.id} could not be added. db fetch error`);
            }
          break;
          case 'call':
            console.log("currSocket: ", socket);
            let user = onlineUsers.find((u) => u.user.id === message.participants.reciever.id);
            user?.socket.send(
                JSON.stringify({ type: 'incomingCall', participants: message.participants })
            );
            socket.send(JSON.stringify({ type: "ringing" }));
            break;
          case 'decline':
              let z = onlineUsers.find((u) => u.user.id === message.user.id);
              z?.socket.send(
                JSON.stringify({ type: "declined" })
              );
            break;
        default:
          console.error('Unknown message type:', message.type);
      }
    } catch (error) {
      console.error('Error parsing message:', error);
    }
  });

  socket.on('close', () => {
    onlineUsers = onlineUsers.filter((user) => user.socket !== socket);
    broadcastUserList();
  });
});

function broadcastUserList() {
  broadcast({ type: 'getUsers', users: onlineUsers });
}


function broadcast(message: object) {
  const data = JSON.stringify(message);
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(data);
    }
  });
}

