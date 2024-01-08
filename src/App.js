import React, { useState } from 'react';
import { AuthProvider } from './context/AuthContext';
import RegisterForm from './components/RegisterForm';
import LoginForm from './components/LoginForm';
import Home from './components/Home';
import Lobby from './components/LobbyGame';
import Game from './components/Game';

const App = () => {
    const [currentPage, setCurrentPage] = useState('login');

    const handleRegisterSuccess = () => {
        setCurrentPage('login'); // Cambia a la vista de inicio de sesión después del registro
    };

    const handleLoginSuccess = userData => {
        setCurrentPage('home'); // Cambia a la vista Home después del inicio de sesión
    };

    const handleGoToLobby = () => {
        setCurrentPage('lobby'); // Cambia a la vista del lobby
    };

    const handleGoToGame = () => {
        setCurrentPage('game'); // Cambia a la vista del juego
    };

    const handleGoToHome = () => {
        setCurrentPage('home'); // Cambia a la vista Home
    };
    const handleGoToLogin = () => {
        setCurrentPage('login'); // Cambia a la vista Login
    };

    return (
        <AuthProvider>
            <div className="App">
                {currentPage === 'login' && <LoginForm onLogin={handleLoginSuccess} setCurrentPage={setCurrentPage} />}
                {currentPage === 'register' && <RegisterForm onRegister={handleRegisterSuccess} setCurrentPage={setCurrentPage} />}
                {currentPage === 'home' && <Home onGameStart={handleGoToLobby} onGoToLogin={handleGoToLogin} />}
                {currentPage === 'lobby' && <Lobby onGameStart={handleGoToGame} onGoToLogin={handleGoToLogin} />}
                {currentPage === 'game' && <Game onGoToHome={handleGoToHome} onGoToLogin={handleGoToLogin}/>}
            </div>
        </AuthProvider>
    );
};

export default App;