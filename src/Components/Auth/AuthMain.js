import React, { useState } from 'react';
import Formulario from '../Formulario';
import styles from '../../Styles/Form.module.css';
import logo from '../../Imgs/logo.png';
import { AiOutlineMail, AiOutlineLock, AiOutlineUser } from "react-icons/ai";
import { Link, useNavigate } from 'react-router-dom';
import { pedirCorreo, eventLogin, eventRegister, inputsLogin, inputsRegister } from '../../Functions/AuthMain/AuthUtils'; // Importar funciones del archivo utilitario
import axios from 'axios';
// Configurar Axios para incluir credenciales en las peticiones al back-end (enviar la cookie.)
axios.defaults.withCredentials = true;

const AuthMain = ({ isLoginView, setUser }) => {
    
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [passwordver, setPasswordver] = useState('');
    const [alerta, setAlerta] = useState('');

    const navigate = useNavigate();

    const handleChange = (e, index) => {
        const value = e.target.value;
        if (isLoginView) {
            if (index === 0) setEmail(value);
            if (index === 1) setPassword(value);
        } else {
            if (index === 0) setName(value);
            if (index === 1) setEmail(value);
            if (index === 2) setPassword(value);
            if (index === 3) setPasswordver(value);
        }
    };

    return (
        <div className={styles.Wrapper_Auth}>
            <div className={styles.Wrapper_Info}>
                <h1>MyProject System</h1>
                <img src={logo} className={styles.Wrapper_Info_Logo} alt="Logo" />
                <p>{isLoginView ? "Bienvenido de vuelta." : "Registro de cuenta"}</p>
                <p>{isLoginView ? "Por favor, identifíquese en el formulario del lado derecho." : "Reciba un correo electrónico para registrarse."}</p>
                <div className={styles.Form_Links}>
                    <Link to={isLoginView ? '/register' : '/'}>{isLoginView ? 'No tengo una cuenta' : 'Ya tengo una cuenta'}</Link>
                    <button onClick={() => pedirCorreo(setAlerta)} className={styles.ForgotAccountButton}>
                        Olvidé mi contraseña
                    </button>
                </div>
            </div>

            <Formulario
                title={isLoginView ? 'Inicio de sesión' : 'Registro de cuenta'}
                inputs={isLoginView ? inputsLogin : inputsRegister}
                desc={isLoginView ? "Bienvenido, digita tus credenciales" : 'Regístrese por primera vez'}
                descButton={isLoginView ? 'Ingresar' : 'Registrarse'}
                eventButton={isLoginView ? (e) => eventLogin(e, email, password, setAlerta, setUser, navigate) : (e) => eventRegister(e, name, email, password, passwordver, setAlerta)}
                values={isLoginView ? [email, password] : [name, email, password, passwordver]}
                handleChange={handleChange}
                alert={alerta}
            >
                {!isLoginView && <AiOutlineUser />}
                <AiOutlineMail />
                <AiOutlineLock />
                {!isLoginView && <AiOutlineLock />}
            </Formulario>
        </div>
    );
};

export default AuthMain;
