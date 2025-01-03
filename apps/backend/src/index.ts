import { WebSocketServer } from "ws";

const wss = new WebSocketServer({ port: 8080 });

let onlineUsers = [];

wss.on('connection', function connection(ws) {
    ws.on('error', console.error);
    ws.on('message', function message(data) {
        const message = JSON.parse(data.toString());
        switch (message.type) {
            case 'add-user':
                onlineUsers.push(message.data);
                break;
        }
    });
});
