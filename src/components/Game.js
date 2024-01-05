import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Game.css';

const Game = () => {
    const [currentBall, setCurrentBall] = useState(null);
    const [players, setPlayers] = useState([]);
    const [balls, setBalls] = useState([]);

    // Obtener los jugadores desde la API
    useEffect(() => {
        const fetchPlayers = async () => {
            try {
                const response = await axios.get('https://localhost:7023/api/game/players');
                setPlayers(response.data);
            } catch (error) {
                console.error('Error al obtener la lista de jugadores', error);
            }
        };

        fetchPlayers();
    }, []);

    // Obtener la próxima balota desde la API
    useEffect(() => {
        const interval = setInterval(async () => {
            try {
                const response = await axios.get('https://localhost:7023/api/game/nextball');
                const newBall = response.data;
                setBalls(prevBalls => [...prevBalls, newBall]);
                setCurrentBall(newBall);
            } catch (error) {
                console.error('Error al obtener la próxima balota', error);
            }
        }, 5000);

        return () => clearInterval(interval);
    }, []);

    const handleBingo = async () => {
        try {
            // Llamada a la API para verificar si el usuario realmente ha ganado
            const response = await axios.post('https://localhost:7023/api/game/checkbingo', { balls, player: 'PlayerID' });
            if (response.data.isBingo) {
                alert('¡Bingo! ¡Ganaste!');
            } else {
                alert('Lo siento, no es un bingo.');
            }
        } catch (error) {
            console.error('Error al verificar el Bingo', error);
        }
    };

    return (
        <div className="game-container">
            <header className="game-header">
                <h1>Bingo Game</h1>
            </header>
            <div className="current-ball">Current Ball: {currentBall}</div>
            <div className="ball-container">
                {balls.map((ball, index) => (
                    <div key={index} className="ball">{ball}</div>
                ))}
            </div>
            <ul className="player-list">
                {players.map(player => (
                    <li key={player.id}>{player.name}</li>
                ))}
            </ul>
            <button className="bingo-button" onClick={handleBingo}>¡Bingo!</button>
            <footer className="footer-game">
                <p>© 2024 Bingo GermanBalaguera. Todos los derechos reservados.</p>
            </footer>
        </div>
    );
};

export default Game;