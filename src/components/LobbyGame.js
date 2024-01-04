import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Lobby.css';

const Lobby = ({ onGameStart }) => {
    const [players, setPlayers] = useState([]);
    const [cards, setCards] = useState([]); // Estado para las tarjetas
    const [isGameStarting, setIsGameStarting] = useState(false);
    const [timer, setTimer] = useState(60); // Temporizador de 60 segundos

    // Se Obtiene los jugadores desde la API
    useEffect(() => {
        const fetchPlayers = async () => {
            try {
                const response = await axios.get('/api/lobby/players');
                setPlayers(response.data.players);
            } catch (error) {
                console.error('Error al obtener la lista de jugadores', error);
            }
        };

        fetchPlayers();
    }, []);

    // Lógica del temporizador
    useEffect(() => {
        let timerId;
        if (players.length > 0 && !isGameStarting) {
            timerId = setInterval(() => {
                setTimer(prevTimer => prevTimer - 1);
            }, 1000);
        }

        return () => clearInterval(timerId);
    }, [players, isGameStarting]);

    // Iniciar juego cuando termina el temporizador
    useEffect(() => {
        if (timer <= 0) {
            onGameStart();
            setIsGameStarting(true);
        }
    }, [timer, onGameStart]);

    // Función para agregar una nueva tarjeta
    const addCard = () => {
        const newCard = { id: Math.random(), content: "Nueva Tarjeta" };
        setCards(previousCards => [...previousCards, newCard]);
    };

    return (
        <>
            <nav className="lobby-nav">
                <span>Usuario actual: [Usuario]</span> { }
            </nav >
            <div className="lobby-container">
                <h1 className="lobby-header">Mas jugadores ingresando Por favor espere</h1>
                {isGameStarting ? (
                    <p>El juego está comenzando...</p>
                ) : (
                    <div>
                        <p>Tiempo restante para iniciar el juego: {timer} segundos</p>
                        <p>Jugadores en espera:</p>
                        <ul>
                            {players.map(player => (
                                <li key={player.id}>{player.name}</li>
                            ))}
                        </ul>
                        <button className="lobby-button" onClick={addCard}>Crear Tarjeton</button>
                        <div>
                            {cards.map(card => (
                                <div key={card.id} className="card">
                                    {card.content}
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
            <footer className="lobby-footer">
                <p>© 2024 Bingo GermanBalaguera. Todos los derechos reservados.</p>
            </footer>
        </>
    );
};

export default Lobby;