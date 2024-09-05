import axios from 'axios';
import imgdefault from '../../Imgs/perfil_example.png';
export const fetchUserPhoto = async (filename, setPerfilPhoto) => {
    try {
        const response = await axios.post('http://127.0.0.1:8000/api/getPhoto', 
            { filename }, // Enviando el nombre del archivo correctamente
            { withCredentials: true, responseType: 'blob' } // Asegurarse de recibir la imagen como un blob
        );

        // Crear una URL para el blob
        const imageUrl = URL.createObjectURL(response.data);
        setPerfilPhoto(imageUrl); // Establecer la URL creada como fuente de la imagen
    } catch (error) {
        console.error('Error fetching user photo:', error);
        setPerfilPhoto(imgdefault); // Fallback a imagen de ejemplo
    }
};