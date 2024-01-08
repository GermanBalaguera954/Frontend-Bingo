import React, { useState } from 'react';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import './LoginForm.css';

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

            const { token } = response.data;
            localStorage.setItem("token", token);
            if (rememberMe) {
                localStorage.setItem("rememberMe", "true");
                localStorage.setItem("email", email);
            } else {
                localStorage.removeItem("rememberMe");
                localStorage.removeItem("email");
            }

            // Decodifica el token para obtener el nombre de usuario
            const decodedToken = jwtDecode(token);
            const username = decodedToken["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"];
            localStorage.setItem("username", username);

            onLogin();
        } catch (error) {
            if (error.response) {
                setErrorMessage(error.response.data);
            } else {
                setErrorMessage('Error de conexión con el servidor');
            }
        }
    };

    const togglePasswordVisibility = () => {
        setPasswordVisible(!passwordVisible);
    };

    const handleRegisterClick = () => {
        setCurrentPage('register');
    };

    return (
        <div>
            <nav className="login-nav">
                <h1>BIENVENIDOS AL BINGO GRAN BUDA </h1>
            </nav>
            <div className='container-login'>
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
                            autoComplete="current-password"
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
            </div>

            <footer className="footer">
                <p>© 2024 Bingo GermanBalaguera. Todos los derechos reservados.</p>
            </footer>
        </div>
    );
};

export default LoginForm;