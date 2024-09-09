import axios from 'axios';
import Swal from 'sweetalert2';

export const AmIOnWorkEnv = async (setData, setError, idWork) => {
    try {
        const response = await axios.get(`http://127.0.0.1:8000/api/AmIOnWorkEnv/${idWork}`, {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            withCredentials: true
        });

        if (response.data.error === "you are not in this workenv") {
            setError(true);  // Establecer el error para desencadenar la redirección
        } else {
            setData(response.data);  // Guardar los datos en el estado
        }

    } catch (err) {
        console.error(err);
        setError(true);  // Manejo del error
    }
};

export const updatework = async (idWorkEnv, nameW, descriptionW, type, date_start, date_end) => {
    try {
        const response = await axios.put(`http://127.0.0.1:8000/api/updateWorkEnv/`, {

            idWorkEnv,
            nameW,
            descriptionW,
            type,
            date_start,
            date_end
        },{
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            withCredentials: true
        });

        if (response.data.message === "ok") {
            return true;
        }

    } catch (err) {
        console.error(err);
    }
};



export const archivework = async (idWorkEnv, navigate) => {

    Swal.fire({
        title: '¿Estás seguro de archivar este entorno?',
        icon: 'warning',
        confirmButtonText: 'Archivar',
        footer: 'Nadie podrá trabajar en el después de ser archivado, podrás deshacer esta acción más adelante.',
        showCancelButton: true,
        preConfirm: () => {
            Swal.fire({
                title: 'Enviando solicitud...',
                text: 'Por favor espera',
                didOpen: () => {
                    Swal.showLoading();  // Mostrar el spinner de carga
                },
                allowOutsideClick: false, // No permitir cerrar la alerta al hacer clic afuera
            });

            return axios.delete(`http://127.0.0.1:8000/api/deleteWorkEnv/${idWorkEnv}`, 
               
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                withCredentials: true
            })
            .then(response => {
                Swal.close();  // Cerrar el spinner de carga

                if (response.data) {
          
                    Swal.fire('Entorno archivado', 'El entorno se ha archivado con éxito', 'success');
                    setTimeout(()=>{

                        navigate('/dashboard');

                    },200);
                }

                
            })
            .catch(err => {
                Swal.close();  // Cerrar el spinner de carga
                Swal.fire('Error', 'No se pudo enviar la solicitud, intenta más tarde', 'error');
                console.error(err);
            });
        }
    });
};

export const undeleteWorkEnv = async (idWorkEnv, navigate) => {

    Swal.fire({
        title: '¿Estás seguro de desarchivar este entorno?',
        icon: 'warning',
        confirmButtonText: 'desarchivar',
        footer: 'Todos los miembros podrán volver a publicar actividades',
        showCancelButton: true,
        preConfirm: () => {
            Swal.fire({
                title: 'Enviando solicitud...',
                text: 'Por favor espera',
                didOpen: () => {
                    Swal.showLoading();  // Mostrar el spinner de carga
                },
                allowOutsideClick: false, // No permitir cerrar la alerta al hacer clic afuera
            });

            return axios.put(`http://127.0.0.1:8000/api/undeleteWorkEnv/${idWorkEnv}`, 
               
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                withCredentials: true
            })
            .then(response => {
                Swal.close();  // Cerrar el spinner de carga

                if (response.data) {
          
                    Swal.fire('Entorno desarchivado', 'El entorno se ha desarchivado con éxito', 'success');
                    setTimeout(()=>{

                        navigate('/dashboard');

                    },200);
                }

                
            })
            .catch(err => {
                Swal.close();  // Cerrar el spinner de carga
                Swal.fire('Error', 'No se pudo enviar la solicitud, intenta más tarde', 'error');
                console.error(err);
            });
        }
    });
};


export const getWorkEnvOwner = async (idWorkEnv, setData) => {
    try {
        const response = await axios.get(`http://127.0.0.1:8000/api/getWorkEnvOwner/${idWorkEnv}`
,{
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            withCredentials: true
        });

        if (response.data) {
            setData(response.data);
        }

    } catch (err) {
        console.error(err+"Error en lider");
    }
};

export const inputsForm = (namew, start, end) =>{
    return [{ index: '0', placeholder: namew , isPass: false }, 
        { index: '1', placeholder: start, isDate: true },
        { index: '2', placeholder: end, isDate: true }
    ]
}


