import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Game.css';

const Game = () => {
    const [currentBall, setCurrentBall] = useState(null);
    const [players, setPlayers] = useState([]);
    const [balls, setBalls] = useState([]);
    const [bingoCard] = useState(Array.from({ length: 25 }, () => Math.floor(Math.random() * 75) + 1));


    // Obtener los jugadores desde la API
    useEffect(() => {
        const fetchPlayers = async () => {
            try {
                const response = await axios.get('pendiente api');
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
                const response = await axios.get('pendiente api');
                const newBall = response.data;
                setBalls(prevBalls => [...prevBalls, newBall]);
                setCurrentBall(newBall);
            } catch (error) {
                console.error('Error al obtener la próxima balota', error);
            }
        }, 5000);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="game">
            <nav className="game-nav">
                <h1>Bingo Game</h1>
            </nav>
            <div className="game-container">
                <div className="bingo-section">
                    <div className="bingo-header">
                        {['B', 'I', 'N', 'G', 'O'].map((letter, index) => (
                            <div key={index} className="bingo-header-cell">{letter}</div>
                        ))}
                    </div>
                    <div className="bingo-card">
                        {bingoCard.map((number, index) => (
                            <div key={index} className="bingo-cell">{number}</div>
                        ))}
                    </div>
                </div>

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
            </div>
            <footer className="footer-game">
                <p>© 2024 Bingo GermanBalaguera. Todos los derechos reservados.</p>
            </footer>
        </div>
    );
};

export default Game;