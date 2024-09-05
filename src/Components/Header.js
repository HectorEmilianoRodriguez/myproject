import React, { useState, useEffect } from 'react';
import styles from '../Styles/Header.module.css';
import { Link, useNavigate } from 'react-router-dom';
import { AiOutlineMenu, AiFillBell, AiOutlineLogout, AiFillFilePdf } from "react-icons/ai";
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import ejemploFoto from '../Imgs/perfil_example.png';
import axios from 'axios';


const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/; //expresión regular para validar un email
let perfilPhoto = null; //aqui almacena el url de la imágen de usuario desde el back-end
axios.defaults.withCredentials = true;

const Header = (props,{workEnv}) => {

    const { toggleAside } = props;  // Recibe la función toggleAside
    const navigate = useNavigate(); //utilizado para renderizar otro componente.
    const [perfilPhoto, setPerfilPhoto] = useState(null); // Estado para almacenar la URL de la imagen de perfil
    
    useEffect(() => {
        const fetchUserPhoto = async () => {
            try {
                const response = await axios.get('http://127.0.0.1:8000/api/getUserPhoto', { withCredentials: true });
                setPerfilPhoto(response.config.url); // URL del archivo
            } catch (error) {
                console.error('Error fetching user photo:', error);
                setPerfilPhoto(ejemploFoto); // Fallback a imagen de ejemplo
            }
        };

        fetchUserPhoto();
    }, []);


    const fetchCsrfToken = async () => { //see obtiene el token CSRF generado por el back-end, para evitar vulnerabilidades de este tipo.
        try {
           const response = await axios.get('http://127.0.0.1:8000/sanctum/csrf-cookie');
        } catch (error) {
            console.error('Error fetching CSRF token:', error);
        }
      };

      const Logout = async () => {
        await fetchCsrfToken();

        try {
            const response = await axios.post('http://127.0.0.1:8000/api/logout', {}, {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                withCredentials: true
            });

            if (response.data.message === 'success') {
                navigate('/');
            }
        } catch (error) {
            console.error('Error durante el logout:', error);
        }
    };


    const MySwal = withReactContent(Swal); //esto permite manejar componentes de React dentro del sweetAlert.

    const PerfilDeUser = ({ userName, email }) => { 
        const cambiodepass = () => { // Esta función maneja la lógica del mensaje de cambiar la contraseña
            MySwal.fire({ 
                title: 'Confirmar actualización de perfil',
                text: '¿Estás seguro de que quieres cambiar tus datos? Te enviaremos un correo electrónico para realizar el proceso.',
                icon: 'question',
                showCancelButton: true,
                confirmButtonText: 'Sí, cambiar contraseña',
                cancelButtonText: 'Cancelar'
            }).then((result) => { // then se utiliza para ejecutarse si la promesa fue correcta (busca que es una promesa en JS)
                if (result.isConfirmed) {
                    // Aquí está la lógica del envío de correo electrónico.
                    console.log('Correo enviado a:', email);
                    MySwal.fire({
                        title: 'Correo enviado',
                        text: 'Revisa tu bandeja de entrada para continuar con el proceso.',
                        icon: 'success'
                    });
                }
            });
        };
    
        MySwal.fire({
            title: 'Perfil de usuario',
            html: (
                <div>
                    <img src={perfilPhoto || ejemploFoto} className={styles.MenuPhotoMore} alt="Perfil" />
                    <p><strong>Nombre de usuario:</strong> {userName}</p>
                    <p><strong>Email:</strong> {email}</p>
                </div>
            ),
            icon: 'info',
            showCancelButton: true,
            confirmButtonText: 'Cambiar contraseña o actualizar datos',
            cancelButtonText: 'Cerrar',
            preConfirm: cambiodepass
        });
    };

    
    const fechaActual = new Date();
    const dia = fechaActual.getDate();
    const mes = fechaActual.getMonth() + 1;
    const anio = fechaActual.getFullYear();

    const [showNotis, setShowNotis] = useState(false); //estos hooks son utilizados para mostrar o no las notificaciones o las opciones de usuario
    const [showUser, setShowUser] = useState(false);

    const handleMouseEnter = (origen) => {
        if (origen === "notis") {
            setShowNotis(true);
        } else {
            setShowUser(true);
        }
    };

    const handleMouseLeave = (origen) => {
        if (origen === "notis") {
            setShowNotis(false);
        } else {
            setShowUser(false);
        }
    };

    return (
        <header className={styles.header}>
            <div className={styles.Menu}>
                <div className={styles.MenuIcon} onClick={toggleAside}>
                    <AiOutlineMenu />
                </div>
                <p><strong>M</strong>y<strong>P</strong> {'>'} {`${dia}/${mes}/${anio}`}</p>
            </div>

            <div className={styles.Menu}>
                <div className={styles.MenuIcon}>
                    <span style={{ color: 'red' }}>{props.numNotis}</span>
                    <AiFillBell />
                    
                    <div
                        className={styles.NotisContainer}
                        onMouseEnter={() => handleMouseEnter('notis')}
   
                    >
                        <p>Notificaciones</p> 
                        {showNotis && (
                            <div className={styles.Notis} onMouseLeave={() => handleMouseLeave('notis')}>
                                <Link to="/">test</Link>
                            
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {props.isWorkEnv && 
            
                <div className={styles.Menu}>
                    <div className= {styles.MenuIcon}>
                        <AiFillFilePdf />
                        <Link to = "/reports" state ={{workEnv}}>Reportes</Link>
                    </div>

                </div>
            
            }

            <div className={styles.Menu}>
                <div className={styles.MenuIcon}>
                <img src={perfilPhoto || ejemploFoto} className={styles.MenuPhoto} alt="Perfil" />

                <div
                        className={styles.NotisContainer}
                        onMouseEnter={() => handleMouseEnter('user')}
                    >
                       <p>{props.user}</p>
                       {showUser && (
                            <div className={styles.Notis} onMouseLeave={() => handleMouseLeave('user')}>
                                
                                <div className = {styles.logout}>
                                        <AiOutlineLogout />
                                        <button className={styles.button_accept} onClick = {Logout}>
                                            Cerrar sesión
                                        </button>
         
                                </div>

                            
                                <button className = {styles.button_accept} onClick = { () => PerfilDeUser({ userName: props.user, email: props.email })}>
                                 Mi perfil
                                </button>
                   
                              
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <div>

            </div>
        </header>
    );
};

export default Header;
