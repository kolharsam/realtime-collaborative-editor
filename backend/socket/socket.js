const http = require('http');
const Redis = require('../redis').Redis;
const Socket = require('socket.io');

const socket_port = 4040;

const socketServer = http.createServer();

const io = new Socket(socketServer); // starts socket

io.on('connection', (socket) => {
    socket.on('message', (event) => {
        socket.broadcast.emit('message', event);
        Redis.Set(event);
    });
});

io.on('disconnect', (event) => {
    console.log(`someone disconnected, ${event}`);
});

function createWS() {
    socketServer.listen(socket_port, () => {
        console.log("🔴");
    });
}

exports.StartSocket = createWS;
