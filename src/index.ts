import express from 'express';
import http from 'http';
import socket, { Socket } from 'socket.io';

const app = express();
const server = new http.Server(app);
const io = socket(server);

const data = {
    numUsers: 0
};

function broadcastNumUsers(): void {
    io.emit('update-num-users', data.numUsers);
}

function introUser(socket: Socket): void {
    socket.emit('get-name', 'Introduce yourself!');
}

function broadcastNewChatter(): void {
    const message = {
        name: '',
        payload: 'Sombody joined the chat room!'
    };
    io.emit('server-message', message);
}

io.on('connection', (socket) => {
    broadcastNewChatter();
    introUser(socket);

    data.numUsers++;
    broadcastNumUsers();

    console.log('a user connected');

    socket.on('disconnect', () => {
        console.log('a user DISconnected');
        --data.numUsers;
        broadcastNumUsers();
    });

    socket.on('chat-message', (data) => {
        console.log('a user sent a chat message:', data);

        io.emit('chat-message', data);
    });
    socket.on('typing', (data) => {
        console.log(`${data} is typing...`);
        io.emit('typing-message', data);
    });
});

server.listen(3003, () => console.log('listening on 3003'));
