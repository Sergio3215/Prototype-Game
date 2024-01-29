"use client"
import { useState, useEffect } from 'react'
import io from 'socket.io-client';

let socket = io("localhost:3001");

export default function App() {

    const [enemy, setEnemy] = useState({});

    const [player, setPlayer] = useState({});

    const [turn, setTurn] = useState(0);

    const [win, setWin] = useState('')

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

        socket = io("localhost:3001");

        socket.on('status', (status) => {
            setPlayer(status[0]);
            setEnemy(status[1]);
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
                        <div style={{
                            display:"flex",
                            alignContent: "center",
                            justifyContent: "center",
                            alignItems: "center",
                            justifyItems: "center",
                        }}>
                            <h1>{win}</h1>
                        </div>
                    </>
            }
        </>
    )
}