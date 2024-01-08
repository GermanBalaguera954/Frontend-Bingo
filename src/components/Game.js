import React, { useState, useEffect, useRef } from 'react';
import { HubConnectionBuilder } from '@microsoft/signalr';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import './Game.css';

const Game = ({ onGoToHome, onGoToLogin }) => {
    const [bingoCard, setBingoCard] = useState([]);
    const [currentBall, setCurrentBall] = useState(null);
    const [allBalls, setAllBalls] = useState([]);
    const [markedCells, setMarkedCells] = useState(new Set());
    const [message, setMessage] = useState('');
    const [gameType, setGameType] = useState('');
    const [gameStarted, setGameStarted] = useState(false);
    const username = localStorage.getItem('username') || 'Invitado';
    const MySwal = withReactContent(Swal);
    const connection = useRef(null);

    //Color para la celdas del tarjeton
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
                return newMarked;
            });
            setMessage('');
        } else {
            setMessage("Balota no ha sido anunciada aún.");
            setTimeout(() => setMessage(''), 1000);
        }
    };

    //Verificacion para saber si hubo bingo
    const handleBingoClick = async () => {
        const requestData = {
            MarkedCellNumbers: Array.from(markedCells).reduce((acc, cellId) => {
                const [row, col] = cellId.split('-').map(Number);
                acc[cellId] = bingoCard[row][col];
                return acc;
            }, {}),
            GameType: gameType,
            DrawnNumbers: allBalls.map(ball => ball.number)
        };
        try {
            const response = await fetch('https://localhost:7023/api/games/checkBingo', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestData)
            });

            const result = await response.json();
            if (result) {
                MySwal.fire({
                    title: '¡Felicidades!',
                    text: '¡Has ganado!',
                    icon: 'success',
                    confirmButtonText: 'Genial'
                }).then(() => {
                    onGoToHome();
                });
            } else {
                MySwal.fire({
                    title: 'Oh no...',
                    text: 'Lo siento, aún no tienes bingo y serás redirigido al home.',
                    icon: 'error',
                    confirmButtonText: 'Aceptar'
                }).then(() => {
                    onGoToHome();
                });
            }
        } catch (error) {
            console.error('Error al verificar el bingo:', error);
        }
    };

    const handleGameTypeChange = (e) => {
        setGameType(e.target.value);
        setGameStarted(true);
    };

    const handleLogout = () => {
        localStorage.removeItem('username');
        onGoToLogin();
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

    //Sorteo de balotas
    useEffect(() => {
        let intervalId;
        const drawBall = async () => {
            try {
                const response = await fetch('https://localhost:7023/api/games/draw');
                const data = await response.json();

                if (typeof data === 'string') {
                    console.log(data);
                    clearInterval(intervalId);
                } else if (data && data.column && data.number) {
                    setCurrentBall(data);
                    setAllBalls(prevBalls => [...prevBalls, data]);
                    console.log("Balota sorteada:", data);
                } else {
                    console.error('Formato de respuesta inesperado:', data);
                }
            } catch (error) {
                console.error('Error al sortear balota:', error);
            }
        };
        intervalId = setInterval(() => {
            drawBall();
        }, 1000);
        return () => clearInterval(intervalId);
    }, []);

    //Reinicio de sorteo de balotas
    useEffect(() => {
        const startGame = async () => {
            try {
                const response = await fetch('https://localhost:7023/api/games/start', { method: 'POST' });
                const data = await response.json();
                console.log(data);
            } catch (error) {
                console.error('Error al iniciar el juego:', error);
            }
        };
        startGame();
    }, []);

     // Establecer la conexión con SignalR
    useEffect(() => {
        connection.current = new HubConnectionBuilder()
            .withUrl("https://localhost:7023/bingoHub")
            .build();

        connection.current.start()
            .then(() => console.log("Conectado con el Hub de Bingo"))
            .catch(err => console.error('Error al conectar con el Hub:', err));

        connection.current.on("ReceiveMessage", (message) => {
            alert(message);
            onGoToHome();
        });
        return () => {
            if (connection.current) {
                connection.current.stop();
            }
        };
    }, [onGoToHome]);

    return (
        <div>
            <nav className="game-nav">
                <h1>Bingo Game</h1>
                <span className="user-info">Usuario: {username}</span>
                <button onClick={handleLogout} className="logout-button">Logout</button>
            </nav>

            <div className="container-game">
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
                    <div className="game-type-selection">
                        <label>
                            Selecciona el tipo de juego:
                            <select
                                value={gameType} onChange={handleGameTypeChange} disabled={gameStarted}>
                                <option value="">Seleccione</option>
                                <option value="fullHouse">Cartón Pleno</option>
                                <option value="horizontalLine">Línea Horizontal</option>
                                <option value="verticalLine">Línea Vertical</option>
                                <option value="diagonal">Diagonal</option>
                                <option value="corners">Esquinas</option>
                            </select>
                        </label>
                    </div>
                </div>

                <div class="players-list-section">
                    <div className="players-list">
                        {/* Pendiente Lista de jugadores */}
                        <h2>Jugadores en sala</h2>
                        {/* Pendiente lista de jugadores que renderizar aquí */}
                    </div>
                </div>
            </div>

            <footer className="footer">
                <p>© 2024 Bingo GermanBalaguera. Todos los derechos reservados.</p>
            </footer>
        </div>
    );
};

export default Game;