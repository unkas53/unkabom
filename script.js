const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const tileSize = 40;
const socket = io();

let players = {};
let bombs = [];

socket.on('updatePlayers', (updatedPlayers) => {
    players = updatedPlayers;
});

socket.on('bombPlaced', (bomb) => {
    bombs.push(bomb);
    setTimeout(() => {
        bombs = bombs.filter(b => b.id !== bomb.id);
    }, 2000);
});

function drawGame() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Oyuncuları çiz
    Object.values(players).forEach(player => {
        ctx.fillStyle = 'blue';
        ctx.fillRect(player.x, player.y, tileSize, tileSize);
    });

    // Bombaları çiz
    bombs.forEach(bomb => {
        ctx.fillStyle = 'red';
        ctx.fillRect(bomb.x, bomb.y, tileSize, tileSize);
    });

    requestAnimationFrame(drawGame);
}

document.addEventListener('keydown', (e) => {
    const player = players[socket.id];
    if (!player) return;

    switch (e.key) {
        case 'ArrowUp':
            player.y = Math.max(player.y - tileSize, 0);
            break;
        case 'ArrowDown':
            player.y = Math.min(player.y + tileSize, canvas.height - tileSize);
            break;
        case 'ArrowLeft':
            player.x = Math.max(player.x - tileSize, 0);
            break;
        case 'ArrowRight':
            player.x = Math.min(player.x + tileSize, canvas.width - tileSize);
            break;
        case ' ':
            socket.emit('placeBomb', { x: player.x, y: player.y, id: socket.id });
            break;
    }

    socket.emit('move', { x: player.x, y: player.y });
});

drawGame();