import React, { useState } from 'react';
import axios from 'axios';
import './RegisterForm.css';

const RegisterForm = ({ onRegister, setCurrentPage }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('https://localhost:7023/api/users/register', {
                email,
                password
            });
            onRegister(response.data);
        } catch (error) {
            if (error.response) {
                setErrorMessage(error.response.data);
            } else {
                setErrorMessage('Error de conexión con el servidor');
            }
        }
    };
    const handleLoginLinkClick = () => {
        setCurrentPage('login');
    };

    return (
        <div>
            <form className="register-form" onSubmit={handleSubmit}>
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email"
                    required
                />
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Contraseña"
                    required
                />
                {errorMessage && <p>{errorMessage}</p>}
                <button type="submit">Registrarse</button>
                <p>¿Ya tienes una cuenta? <span onClick={handleLoginLinkClick} style={{ color: 'blue', cursor: 'pointer', textDecoration: 'underline' }}>Iniciar sesión</span></p>
            </form>
            <footer className="footer">
                <p>© 2024 Bingo GermanBalaguera. Todos los derechos reservados.</p>
            </footer>
        </div>
    );
};

export default RegisterForm;
