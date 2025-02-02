const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const players = {};

io.on('connection', (socket) => {
    console.log('Bir oyuncu bağlandı:', socket.id);

    // Yeni oyuncu ekle
    players[socket.id] = {
        x: Math.floor(Math.random() * 10) * 40,
        y: Math.floor(Math.random() * 10) * 40,
        id: socket.id
    };

    // Tüm oyunculara yeni oyuncuyu bildir
    io.emit('updatePlayers', players);

    // Oyuncu hareket ettiğinde
    socket.on('move', (data) => {
        players[socket.id].x = data.x;
        players[socket.id].y = data.y;
        io.emit('updatePlayers', players);
    });

    // Oyuncu bombayı yerleştirdiğinde
    socket.on('placeBomb', (data) => {
        io.emit('bombPlaced', data);
    });

    // Oyuncu ayrıldığında
    socket.on('disconnect', () => {
        console.log('Bir oyuncu ayrıldı:', socket.id);
        delete players[socket.id];
        io.emit('updatePlayers', players);
    });
});

app.use(express.static('public'));

server.listen(3000, () => {
    console.log('Sunucu http://localhost:3000 adresinde çalışıyor...');
});