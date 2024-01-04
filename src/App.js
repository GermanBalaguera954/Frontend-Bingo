import React, { useState } from 'react';
import { AuthProvider } from './context/AuthContext';
import RegisterForm from './components/RegisterForm';
import LoginForm from './components/LoginForm';
import Home from './components/Home'; 
import Lobby from './components/LobbyGame';
import Game from './components/Game';

const App = () => {
    const [currentPage, setCurrentPage] = useState('login'); // Maneja la página actual
    
    const handleRegisterSuccess = () => {
        setCurrentPage('login'); // Cambia a la vista de inicio de sesión después del registro
    };

    const handleLoginSuccess = userData => {
        setCurrentPage('home'); // Cambia a la vista Home después del inicio de sesión
    };

    const handleStartGame = () => {
        setCurrentPage('lobby'); // Cambia a la vista del lobby al presionar 'Iniciar Juego' en Home
    };

    
    return (
        <AuthProvider>
            <div className="App">
                {currentPage === 'login' && <LoginForm onLogin={handleLoginSuccess} setCurrentPage={setCurrentPage} />}
                {currentPage === 'register' && <RegisterForm onRegister={handleRegisterSuccess} setCurrentPage={setCurrentPage} />}
                {currentPage === 'home' && <Home onGameStart={handleStartGame} />}
                {currentPage === 'lobby' && <Lobby onGameStart={handleStartGame} />}
                {currentPage === 'game' && <Game />}
            </div>
        </AuthProvider>
    );
};

export default App;

