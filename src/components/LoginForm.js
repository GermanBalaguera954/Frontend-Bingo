import React, { useState } from 'react';
import axios from 'axios';
import './LoginForm.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

const LoginForm = ({ onLogin, setCurrentPage }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [rememberMe, setRememberMe] = useState(localStorage.getItem("rememberMe") === "true");
    const [errorMessage, setErrorMessage] = useState('');
    const [passwordVisible, setPasswordVisible] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('https://localhost:7023/api/users/login', {
                email,
                password
            });
            localStorage.setItem("rememberMe", rememberMe ? "true" : "false");
            if (rememberMe) {
                localStorage.setItem("email", email);
            } else {
                localStorage.removeItem("email");
            }
            onLogin(response.data); // Manejo de los datos de autenticación
        } catch (error) {
            // Manejo de errores
            if (error.response) {
                setErrorMessage(error.response.data);
            } else {
                setErrorMessage('Error de conexión con el servidor');
            }
        }
    };

    const handleRegisterClick = () => {
        setCurrentPage('register');
    };

    const togglePasswordVisibility = () => {
        setPasswordVisible(!passwordVisible);
    };

    return (
        <div>
            <form className="login-form" onSubmit={handleSubmit}>
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email"
                    required
                />

                <div className="password-input-container">
                    <input
                        type={passwordVisible ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Contraseña"
                        required
                    />
                    <span className="password-icon" onClick={togglePasswordVisibility}>
                        {passwordVisible
                            ? <FontAwesomeIcon icon={faEyeSlash} />
                            : <FontAwesomeIcon icon={faEye} />}
                    </span>
                </div>

                <div>
                    <input
                        type="checkbox"
                        id="rememberMe"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                    />
                    <label htmlFor="rememberMe">Recuérdame</label>
                </div>
                {errorMessage && <p>{errorMessage}</p>}
                <button type="submit">Iniciar Sesión</button>
                <p>¿No tienes una cuenta? <span onClick={handleRegisterClick} style={{ color: 'blue', cursor: 'pointer', textDecoration: 'underline' }}>Regístrate</span></p>
            </form>
            
            <footer className="footer">
                <p>© 2024 Bingo GermanBalaguera. Todos los derechos reservados.</p>
            </footer>
        </div>
    );
};

export default LoginForm;