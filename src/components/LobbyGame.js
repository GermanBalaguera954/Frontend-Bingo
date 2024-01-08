import React, { useState, useEffect } from 'react';
import './LobbyGame.css';

const Lobby = ({ onGameStart, onGoToLogin }) => {
    const [isGameStarting] = useState(false);
    const [timer, setTimer] = useState(5);
    const username = localStorage.getItem('username') || 'Invitado';
    
    const handleLogout = () => {
        localStorage.removeItem('username');
        onGoToLogin();
    };

    useEffect(() => {
        let timerId;
        if (timer > 0) {
            timerId = setInterval(() => {
                setTimer(prevTimer => prevTimer - 1);
            }, 1000);
        }
        return () => clearInterval(timerId);
    }, [timer]);

    useEffect(() => {
        if (timer <= 0 && !isGameStarting) {
        }
    }, [timer, isGameStarting]);

    return (
        <div>
            <nav className="lobby-nav">
                <h1>Bingo Game</h1>
                <span className="user-info">Usuario: {username}</span>
                <button onClick={handleLogout} className="logout-button">Logout</button>
            </nav>
            <div className='container-lobby'>
                <div className='layout-lobby'>
                    <h1 className="lobby-header">Hay mas jugadores ingresando</h1>
                    <div className='lobby-timer'>
                        <p>Tiempo restante para iniciar el juego: {timer} segundos</p>
                        <p>Jugadores en espera:</p>
                        {
                            timer <= 0 && (
                                <button className="lobby-button" onClick={onGameStart}>Crear Tarjeton</button>
                            )
                        }
                    </div>
                </div>
            </div>
            <footer className="footer">
                <p>© 2024 Bingo GermanBalaguera. Todos los derechos reservados.</p>
            </footer>
        </div>
    );
};

export default Lobby;