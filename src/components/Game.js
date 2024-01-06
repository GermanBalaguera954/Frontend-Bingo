import React, { useState, useEffect } from 'react';
import { HubConnectionBuilder } from '@microsoft/signalr';
import { isBingo } from './BingoLogic';
import './Game.css';

const Game = () => {
    const [bingoCard, setBingoCard] = useState([]);
    const [currentBall, setCurrentBall] = useState(null);
    const [allBalls, setAllBalls] = useState([]);
    const [markedCells, setMarkedCells] = useState(new Set());
    const [message, setMessage] = useState('');
    const [setIsWinner] = useState(false);

    const handleCellClick = (rowIndex, numberIndex, number) => {
        if (allBalls.some(ball => ball.number === number)) {
            const cellId = `${rowIndex}-${numberIndex}`;
            setMarkedCells(prev => {
                const newMarked = new Set(prev);
                if (newMarked.has(cellId)) {
                    newMarked.delete(cellId);
                } else {
                    newMarked.add(cellId);
                }
                // Comprobar si hay bingo después de actualizar las celdas marcadas
                if (isBingo(newMarked)) {
                    console.log("¡Bingo!");
                    setIsWinner(true);
                }
                return newMarked;
            });
            setMessage(''); // Limpiar cualquier mensaje anterior
        } else {
            setMessage("Balota no ha sido anunciada aún.");
            setTimeout(() => setMessage(''), 1000);
        }
    };

    const handleBingoClick = () => {
        if (isBingo(markedCells)) {
            alert("¡Felicidades, has ganado!");
        } else {
            alert("Lo siento, no has ganado. Serás redirigido al inicio.");
            // Redirige al usuario al inicio
            window.location.href = '/';
        }
    };

    useEffect(() => {
        fetch('https://localhost:7023/api/games/generate')
            .then(response => response.json())
            .then(data => {
                if (Array.isArray(data.cardNumbers)) {
                    setBingoCard(data.cardNumbers);
                }
            })
            .catch(error => console.error('Error:', error));
    }, []);

    useEffect(() => {
        const fetchNextBall = () => {
            fetch('https://localhost:7023/api/games/nextball')
                .then(response => response.json())
                .then(data => {
                    if (data && data.column && data.number) {
                        setCurrentBall(data);
                        setAllBalls(prevBalls => [...prevBalls, data]);
                    } else {
                        console.log('Respuesta inesperada:', data);
                    }
                })
                .catch(error => {
                    console.error('Error al obtener la próxima bola:', error);
                });
        };
        const interval = setInterval(fetchNextBall, 5000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        const connection = new HubConnectionBuilder()
            .withUrl('https://localhost:7023/bingohub')
            .build();

        connection.start().then(() => {
            console.log('Conectado al hub de Bingo');
            connection.on('GameWon', () => {
                window.location.href = '/';
            });
        }).catch(err => console.error('Error al conectar con el hub:', err));

        return () => {
            connection.stop();
        };
    }, []);

    return (
        <div className="game-layout">
            <nav className="game-nav">
                <h1>Bingo Game</h1>
            </nav>
            <div className="game-board">
                <div className="bingo-card-section">
                    <div className="bingo-header">
                        {['B', 'I', 'N', 'G', 'O'].map((letter, index) => (
                            <div key={index} className="bingo-header-cell">{letter}</div>
                        ))}
                    </div>
                    <div className="bingo-card">
                        {bingoCard.map((row, rowIndex) => (
                            <div key={rowIndex} className="bingo-row">
                                {row.map((number, numberIndex) => {
                                    const cellId = `${rowIndex}-${numberIndex}`;
                                    const isMarked = markedCells.has(cellId);
                                    return (
                                        <div key={numberIndex}
                                            className={`bingo-cell ${isMarked ? 'marked' : ''}`}
                                            onClick={() => handleCellClick(rowIndex, numberIndex, number)}>
                                            {number}
                                        </div>
                                    );
                                })}
                            </div>
                        ))}
                    </div>
                </div>

                <div className="side-section">
                    <div className="message-container">
                        <p className="message">{message}</p>
                    </div>
                    <div className="current-ball-container">
                        <div className="current-ball">
                            <span className="current-ball-label">Balota actual: </span>
                            <span className="current-ball-value">
                                {currentBall ? `${currentBall.column}${currentBall.number}` : 'Ninguna'}
                            </span>
                        </div>
                    </div>
                    <button onClick={handleBingoClick} className="bingo-button">BINGO</button>
                </div>

                <div class="players-list-section">
                    <div className="players-list">
                        {/* Lista de jugadores */}
                        <h2>Jugadores en sala</h2>
                        {/* Pendiente lista de jugadores que renderizar aquí */}
                    </div>
                </div>
            </div>
            <footer className="footer-game">
                <p>© 2024 Bingo GermanBalaguera. Todos los derechos reservados.</p>
            </footer>
        </div>
    );
};

export default Game;