const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
require('dotenv').config();

const httpServer = http.createServer();

let io;

io = new Server(httpServer, {
    cors: {
        origin: process.env.url_origin , // Replace with your frontend URL
        methods: ["GET", "POST"],
        allowedHeaders: ["my-custom-header"],
        credentials: true,
    },
});


let player = {
    name: "player",
    hp: 100,
    maxHP: 100,
    attack: 60,
    turn: 0
}

let enemy = {
    name: "enemy",
    hp: 100,
    maxHP: 100,
    attack: 40,
    turn: 1
};

let turn = 0;

let win = '';

io.on("connection", (socket) => {
    console.log(`user with id-${socket.id}`);

    socket.emit('status', [player, enemy, socket.id]);
    socket.emit('turn', turn);
    
    socket.emit('win', win);

    socket.on('reset',()=>{
        player = {
            name: "player",
            hp: 100,
            maxHP: 100,
            attack: 60,
            turn: 0
        }
        enemy = {
            name: "enemy",
            hp: 100,
            maxHP: 100,
            attack: 40,
            turn: 1
        };
        turn = 0;
        win='';
        // console.log(socket.id)
        socket.broadcast.emit('status', [player, enemy, socket.id]);
        socket.broadcast.emit('turn', turn);
        socket.broadcast.emit('win', '');
    })

    socket.on("attack", (turn) => {

        switch (turn) {
            case 0:
                enemy.hp = enemy.hp - player.attack;
                turn++;
                break;
            case 1:
                player.hp = player.hp - enemy.attack;
                turn--;
                break;
            default:
                console.log("Error: No hay turno");
                break;
        }

        if(player.hp < 0){
            player.hp = 0;
        }
        if(enemy.hp < 0){
            enemy.hp = 0;
        }

        if(enemy.hp == 0 || player.hp == 0){
            let name = player.name;
            if(enemy.hp ==  0){
                name = player.name;
            }

            win = `Ha ganado ${name}`;
            socket.broadcast.emit('win', win);
        }

        socket.broadcast.emit('status', [player, enemy,  socket.id]);
        socket.broadcast.emit('turn', turn);
    });

    socket.on("disconnect", () => {
        console.log("A user disconnected:", socket.id);
    });
});

const PORT = process.env.PORT || 3001;
httpServer.listen(PORT, () => {
    console.log(`Socket.io server is running on port ${PORT}`);
});