import React, { useState } from 'react';
import { AuthProvider } from './context/AuthContext';
import RegisterForm from './components/RegisterForm';
import LoginForm from './components/LoginForm';
import Home from './components/Home';
import Lobby from './components/LobbyGame';
import Game from './components/Game';

const App = () => {
    const [currentPage, setCurrentPage] = useState('login');
    const handleChangePage = (page) => setCurrentPage(page);

    return (
        <AuthProvider>
            <div className="App">
                {currentPage === 'login' && <LoginForm onLogin={() => handleChangePage('home')} />}
                {currentPage === 'register' && <RegisterForm onRegister={() => handleChangePage('login')} />}
                {currentPage === 'home' && <Home onGameStart={() => handleChangePage('lobby')} />}
                {currentPage === 'lobby' && <Lobby onGameStart={() => handleChangePage('game')} />}
                {currentPage === 'game' && <Game />}
            </div>
        </AuthProvider>
    );
};

export default App;