import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import Formulario from '../Formulario';
import styles from '../../Styles/Verify.module.css';
import { AiOutlineLock } from "react-icons/ai";
const fetchCsrfToken = async () => { // Obtener el token CSRF para evitar vulnerabilidades
    try {
        await axios.get('http://127.0.0.1:8000/sanctum/csrf-cookie');
    } catch (error) {
        console.error('Error fetching CSRF token:', error);
    }
};

const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

const AccountVerified = (props) => {
    const location = useLocation();
    const navigate = useNavigate();
    const [userName, setUserName] = useState('');
    const [message, setMessage] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [alerta, setAlerta] = useState('');

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const isVerified = params.get('verified') === 'true';
        const isRecovery = params.get('recovery') === 'true'; 
        const name = params.get('name');
        const token = params.get('token');
        const email = params.get('email');

        if (isVerified) {
            setMessage('Cuenta verificada');
            setUserName(name);
        } else if (isRecovery && token && email) {
            setMessage('Recuperación de cuenta. Por favor, ingresa una nueva contraseña.');
        } else {
            navigate('/'); // Redirige al login si no es ni verificación ni recuperación
        }
    }, [location, navigate]);

    const handlePasswordChange = (e, index) => {
        const value = e.target.value;
        if (index === 0) setNewPassword(value);
        if (index === 1) setConfirmPassword(value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (newPassword.trim() === '' || confirmPassword.trim() === '') {
            setAlerta("Todos los campos son obligatorios");
            return;
        }

        if (!passwordRegex.test(newPassword)) {
            setAlerta("La contraseña debe tener al menos 8 caracteres, incluir una mayúscula, un número y un carácter especial");
            return;
        }

        if (newPassword !== confirmPassword) {
            setAlerta("Las contraseñas no coinciden");
            return;
        }

        try {
            const params = new URLSearchParams(location.search);
            const token = params.get('token'); // Obtén el token de la URL
            const email = params.get('email'); // Obtén el correo de la URL

            // Verifica que el token y el correo estén presentes
            if (!token || !email) {
                setAlerta("Token o correo electrónico no válidos.");
                return;
            }

            await fetchCsrfToken(); // Obtener el token CSRF
            const response = await axios.get(`http://127.0.0.1:8000/api/changePassUser/${token}/${email}/${newPassword}`);

            if (response.data.message === "success") {
                setAlerta("Contraseña actualizada exitosamente. Puedes iniciar sesión con tu nueva contraseña.");
                setTimeout(() => navigate('/'), 2000); // Redirige al inicio después de un breve retraso
            } else {
                setAlerta("El token para verificar su identidad no coincide.");
            }
        } catch (error) {
            console.error('Error en la actualización de contraseña:', error);
            setAlerta("Hubo un error al actualizar la contraseña. Inténtalo de nuevo.");
        }
    };

    return (
        <div className={styles.Wrapper}>
                <div className={styles.Wrapper_Message}>
                <div className={styles.Message_body}>
                    {message.includes('Recuperación de cuenta') ? (
                        <Formulario
                            title="Recuperación de Contraseña"
                            desc="Ingrese una nueva contraseña"
                            inputs={[
                                { index: '0', placeholder: 'Nueva contraseña', isPass: true },
                                { index: '1', placeholder: 'Confirmar contraseña', isPass: true }
                            ]}
                            values={[newPassword, confirmPassword]}
                            handleChange={handlePasswordChange}
                            eventButton={handleSubmit}
                            descButton="Actualizar Contraseña"
                            alert={alerta}
                        > 
                        
                        <AiOutlineLock />
                        <AiOutlineLock />
                        
                        
                        </Formulario>
                    ) : (
                        <div className={styles.Message_body}>
                            <h1>{message}</h1>
                        {userName && <p className={styles.Message_body_p}>Bienvenido, {userName}!, ya puedes iniciar sesión</p>}
                            <div className={styles.button_accept}>
                                <Link to="/">Aceptar</Link>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AccountVerified;
