import React from 'react';
import './Home.css';

const Home = ({ onGameStart }) => {
    const username = localStorage.getItem('username') || 'Invitado';
    return (
        <div>
            <nav className="home-nav">
                <h1>Bingo Game</h1>
                <span className="user-info">Usuario: {username}</span>
            </nav>
            <div className='app-container'>
                <div className="home-container">
                    <h1 className="home-title">¡Bienvenido buena suerte!</h1>
                    <button className="home-button" onClick={onGameStart}>Iniciar Juego</button>
                </div>
                <footer className="footer">
                    <p>© 2024 Bingo GermanBalaguera. Todos los derechos reservados.</p>
                </footer>
            </div>
        </div>
    );
};

export default Home;
