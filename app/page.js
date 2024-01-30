"use client"
import { useState, useEffect } from 'react';
import io from 'socket.io-client';
// require('dotenv').config();

// console.log(process.env.REACT_APP_URL)

let socket = io(process.env.REACT_APP_URL);

export default function App() {

    const [enemy, setEnemy] = useState({});

    const [player, setPlayer] = useState({});

    const [turn, setTurn] = useState(0);

    const [win, setWin] = useState('');

    const [id, setId] = useState('');

    socket.on('status', (status) => {
        setPlayer(status[0]);
        setEnemy(status[1]);
    });
    socket.on('turn', (turn) => {
        setTurn(turn);
    });
    socket.on('win', (win) => {
        setWin(win);
    });

    useEffect(() => {

        socket = io(process.env.REACT_APP_URL);

        socket.on('status', (status) => {
            setPlayer(status[0]);
            setEnemy(status[1]);
            setId(status[2])
        });

        socket.on('turn', (turn) => {
            setTurn(turn);
        });

        socket.on('win', (w) => {
            setWin(w);
        });

        // Clean up the socket connection on unmount
        return () => {
            socket.disconnect();
        };
    }, []);

    return (
        <>
            {
                (player.hp == undefined) ?
                    <></>
                    :
                    <>
                        <div>{id}</div>
                        <div style={{
                            display: "flex",
                            justifyContent: "space-around",
                            fontSize: "20px"
                        }}>
                            <div>
                                <div>{enemy.name}</div>
                                <div>{enemy.hp} / {enemy.maxHP}</div>
                            </div>
                            <div>
                                <div>{player.name}</div>
                                <div>{player.hp} / {player.maxHP}</div>
                            </div>
                        </div>

                        {
                            (!win.includes("ganado")) ?
                                <>
                                    <div style={{
                                        display: "flex",
                                        justifyContent: "space-around",
                                        fontSize: "20px"
                                    }}>
                                        <div>
                                            <div>{enemy.name}</div>
                                            <div>
                                                <button onClick={() => socket.emit('attack', turn)} disabled={enemy.turn != turn}>Atacar a {player.name}</button>
                                            </div>
                                        </div>
                                        <div>
                                            <div>{player.name}</div>
                                            <div>
                                                <button onClick={() => socket.emit('attack', turn)} disabled={player.turn != turn}>Atacar a {enemy.name}</button>
                                            </div>
                                        </div>
                                    </div>
                                </>
                                :
                                <></>
                        }

                        <div style={{
                            display: "flex",
                            alignContent: "center",
                            justifyContent: "center",
                            alignItems: "center",
                            justifyItems: "center",
                        }}>
                            <h1>{win}</h1>
                        </div>

                        <div style={{
                            display: "flex",
                            alignContent: "center",
                            justifyContent: "center",
                            alignItems: "center",
                            justifyItems: "center",
                        }}>
                            {
                                (win.includes("ganado")) ?
                                    <button onClick={() => socket.emit("reset")}>Reset</button>
                                    :
                                    <></>
                            }
                        </div>
                    </>
            }
        </>
    )
}