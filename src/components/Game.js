import React, { useState, useEffect } from 'react';

const Game = () => {
    const [currentBall, setCurrentBall] = useState(null);

    useEffect(() => {
        const eventSource = new EventSource("url_a_tu_backend");

        eventSource.onmessage = (event) => {
            const data = JSON.parse(event.data);
            setCurrentBall(data.nextBall);
        };

        return () => {
            eventSource.close();
        };
    }, []);

    return (
        <div>
            <h1>Juego de Bingo</h1>
            <p>Balota actual: {currentBall}</p>
        </div>
    );
};

export default Game;
