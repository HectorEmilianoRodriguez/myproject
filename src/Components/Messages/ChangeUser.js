import React, { useState } from 'react';
import styles from '../../Styles/ChangeUser.module.css';
import Formulario from '../Formulario';
import { AiOutlineLock, AiOutlineUser } from "react-icons/ai";
import axios from 'axios';

const ChangeUser = (props) => {
    const [image, setImage] = useState(null); // Estado para manejar la imagen seleccionada
    const [userName, setUserName] = useState('');
    const [Pass, setPass] = useState('');
    const [Pass2, setPass2] = useState('');
    const [alert, setAlert] = useState('');

    const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    const inputs = [
        { index: '1', placeholder: 'Nombre de usuario' },
        { index: '2', placeholder: 'Nueva contraseña', isPass: true },
        { index: '3', placeholder: 'Repetir nueva contraseña', isPass: true }
    ];

    const datosForm = (e, index) => {
        const value = e.target.value;
        if (index === 0) setUserName(value);
        if (index === 1) setPass(value);
        if (index === 2) setPass2(value);
    };

    // Función para manejar el cambio de archivo
    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            setImage(file); // Almacena el objeto File en lugar de la URL de datos
        }
    };

    const enviarForm = async (e) => {
        e.preventDefault();

        if (Pass.trim() === '' || Pass2.trim() === '' || userName.trim() === '') {
            setAlert("Todos los campos son obligatorios");
            return;
        }

        if (!passwordRegex.test(Pass) || !passwordRegex.test(Pass2)) {
            setAlert("La contraseña debe tener al menos 8 caracteres, incluir una mayúscula, un número y un carácter especial");
            return;
        }

        if (Pass !== Pass2) {
            setAlert("Las contraseñas no coinciden");
            return;
        }

        // Crear FormData para enviar los datos y la imagen
        const formData = new FormData();
        formData.append('userName', userName);
        formData.append('password', Pass);
        if (image) {
            formData.append('photo', image); // Añadir la imagen
        }

        try {
            await axios.post('http://127.0.0.1:8000/api/updateUser', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
                withCredentials: true
            });

            setAlert("Datos actualizados correctamente");
        } catch (error) {
            setAlert("Error al actualizar los datos");
            console.error(error);
        }
    };

    return (
        <div className={styles.Wrapper}>
            <Formulario
                isFile={true}
                inputs={inputs}
                title='Actualización de perfil'
                desc='Introduce tus nuevos datos para actualizar tu perfil'
                descButton='Actualizar datos'
                handleChange={datosForm}
                alert={alert}
                eventButton={enviarForm}
                values={[userName, Pass, Pass2]}
                onFileChange={handleFileChange}
                image={image}
            >
                <AiOutlineUser />
                <AiOutlineLock />
                <AiOutlineLock />
            </Formulario>
        </div>
    );
};

export default ChangeUser;
