import React, { useState, useEffect } from 'react';
import './LobbyGame.css';

const Lobby = ({ onGameStart }) => {
    const [isGameStarting] = useState(false);//Inicio de Juego
    const [timer, setTimer] = useState(5); // Temporizador

    // useEffect para el temporizador
    useEffect(() => {
        let timerId;
        if (timer > 0) {
            timerId = setInterval(() => {
                setTimer(prevTimer => prevTimer - 1);
            }, 1000);
        }
        return () => clearInterval(timerId);
    }, [timer]);

    // Inicia juego cuando termina el temporizador
    useEffect(() => {
        if (timer <= 0 && !isGameStarting) {
        }
    }, [timer, isGameStarting]);

    return (
        <div>
            <nav className="lobby-nav">
                <span>Usuario actual: [Usuario]</span> { }
            </nav >
            <div className="lobby-container">
                <h1 className="lobby-header">Mas jugadores ingresando ¡Por favor espere!</h1>
                <div>
                    <p>Tiempo restante para iniciar el juego: {timer} segundos</p>
                    <p>Jugadores en espera:</p>
                    {
                        timer <= 0 && (
                            <button className="lobby-button" onClick={onGameStart}>Crear Tarjeton</button>
                        )
                    }
                </div>
            </div>
            <footer className="lobby-footer">
                <p>© 2024 Bingo GermanBalaguera. Todos los derechos reservados.</p>
            </footer>
        </div>
    );
};

export default Lobby;