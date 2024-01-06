import React, { useState, useEffect } from 'react';
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
            // Aquí puedes agregar lógica adicional para manejar la victoria.
        } else {
            alert("Lo siento, no has ganado. Serás redirigido al inicio.");
            // Redirige al usuario al inicio
            window.location.href = '/'; // Asume que '/' es tu ruta de inicio
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

    return (
        <div>
            <nav className="game-nav">
                <h1>Bingo Game</h1>
            </nav>
            <p className="message">{message}</p>
            <div className="game">

                <div className="game-container">
                    <div className="bingo-section">
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
                </div>

                <div className="bingo-container">
                    <div className="current-ball-container">
                        <div className="current-ball">
                            <span className="current-ball-label">Bola Actual:</span>
                            <span className="current-ball-value">
                                {currentBall ? `${currentBall.column}${currentBall.number}` : 'Ninguna'}
                            </span>
                        </div>
                    </div>
                    {/* <div className="all-balls">
                        {allBalls.map((ball, index) => (
                            <span key={index} className="ball">{`${ball.column}${ball.number}`}</span>
                        ))}
                    </div> */}
                </div>
                <button onClick={handleBingoClick} className="bingo-button">Bingo</button>
                <footer className="footer-game">
                    <p>© 2024 Bingo GermanBalaguera. Todos los derechos reservados.</p>
                </footer>
            </div>
        </div>
    );
};

export default Game;