import React from 'react';
import './Home.css';

const Home = ({ onGameStart }) => {
    return (
        <div className="home-container">
            <h1 className="home-title">Bienvenido al Bingo el Gran Buda</h1>
            <button className="home-button" onClick={onGameStart}>Iniciar Juego</button>
            <footer className="footer">
                <p>© 2024 Bingo GermanBalaguera. Todos los derechos reservados.</p>
            </footer>
        </div>
    );
};

export default Home;
