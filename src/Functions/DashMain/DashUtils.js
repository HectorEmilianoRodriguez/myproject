import axios from 'axios';
import Swal from 'sweetalert2';

export const getNotApprobedActivities = async (setData) => {
    try {
        const response = await axios.get(`http://127.0.0.1:8000/api/getNotApprobedActivities/`, {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            withCredentials: true
        });

        if (response.data) {
    
            setData(response.data);  // Guardar los datos en el estado
        }

    } catch (err) {
        console.error(err);
    }
};

export const getAlmostExpiredActivities = async (setData) => {
    try {
        const response = await axios.get(`http://127.0.0.1:8000/api/getAlmostExpiredActivities/`, {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            withCredentials: true
        });

        if (response.data) {
    
            setData(response.data);  // Guardar los datos en el estado
        }

    } catch (err) {
        console.error(err);
    }
};

export const getNotSeenComments = async (setData) => {
    try {
        const response = await axios.get(`http://127.0.0.1:8000/api/getNotSeenComments/`, {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            withCredentials: true
        });

        if (response.data) {
    
            setData(response.data);  // Guardar los datos en el estado
        }

    } catch (err) {
        console.error(err);
    }
};

export const getPendingApprovals = async (setData) => {
    try {
        const response = await axios.get(`http://127.0.0.1:8000/api/getPendingApprovals/`, {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            withCredentials: true
        });

        if (response.data) {
    
            setData(response.data);  // Guardar los datos en el estado
        }

    } catch (err) {
        console.error(err);
    }
};

export const getRequestsData = async (setRequestData) =>{

    try {
        const response = await axios.get(`http://127.0.0.1:8000/api/getPossibleRequests`, {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            withCredentials: true
        });

        if (response.data) {
    
            setRequestData(response.data);  // Guardar los datos en el estado
        }

    } catch (err) {
        console.error(err);
    }


}

export const showRequestWorkEnvMessage = async (idWorkEnv, setUpdated, isUpdated) => {
    Swal.fire({
        title: '¿Deseas unirte a este entorno de trabajo?',
        icon: 'question',
        confirmButtonText: 'Enviar solicitud',
        footer: 'Se le enviará tu solicitud al líder del entorno',
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

            return axios.get(`http://127.0.0.1:8000/api/joinOnWorkEnv/${idWorkEnv}`, {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                withCredentials: true
            })
            .then(response => {
                Swal.close();  // Cerrar el spinner de carga

                if (response.data) {
                    setUpdated(!isUpdated);
                    Swal.fire('Solicitud enviada', 'Tu solicitud ha sido enviada con éxito', 'success');
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

export const debounce = (func, delay) => { //función utilizada para realizar peticiones pausadas al back-end.
    let timeout;
    return (...args) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => {
            func.apply(this, args);
        }, delay);
    };
};



export const searchRequests = debounce(async (busqueda, setRequestData) => {
    try {
        const response = await axios.get(`http://127.0.0.1:8000/api/searchRequests/${busqueda}`, {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            withCredentials: true
        });

        if (response.data) {
            setRequestData(response.data);  // Guardar los datos en el estado
        } else {
            setRequestData(null);
        }

    } catch (err) {
        console.error(err);
    }
}, 500); // 500 ms de retraso


export const searchMyRequests = debounce(async (busqueda, setRequestData) => {
    try {
        const response = await axios.get(`http://127.0.0.1:8000/api/getPendingApprovalsSearch/${busqueda}`, {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            withCredentials: true
        });

        if (response.data) {
            setRequestData(response.data);  // Guardar los datos en el estado
        } else {
            setRequestData(null);
        }

    } catch (err) {
        console.error(err);
    }
}, 500); // 500 ms de retraso


export const showRequestJoinWorkEnvMessage = async (idUser,idWorkEnv, setUpdated, isUpdated) => {
    Swal.fire({
        title: '¿Estás seguro de aceptar la solicitud?',
        icon: 'question',
        confirmButtonText: 'Sí, confirmar',
        footer: 'Se le notificará al miembro que ha sido aceptado',
        showCancelButton: true,
        preConfirm: () => {
            Swal.fire({
                title: 'Aceptando solicitud...',
                text: 'Por favor espera',
                didOpen: () => {
                    Swal.showLoading();  // Mostrar el spinner de carga
                },
                allowOutsideClick: false, // No permitir cerrar la alerta al hacer clic afuera
            });

            return axios.get(`http://127.0.0.1:8000/api/approbeRequestWorkEnv/${idUser}/${idWorkEnv}`, {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                withCredentials: true
            })
            .then(response => {
                Swal.close();  // Cerrar el spinner de carga

                if (response.data) {
                    setUpdated(!isUpdated);
                    Swal.fire('Solicitud aceptada', 'La solicitud ha sido aprobada', 'success');
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

export const showRequestnotJoinWorkEnvMessage = async (idJoinUserWork, setUpdated, isUpdated) => {
    Swal.fire({
        title: '¿Estás seguro de rechazar la solicitud?',
        icon: 'warning',
        confirmButtonText: 'Sí, confirmar',
        footer: 'Se le notificará al miembro que no ha sido aceptado.',
        showCancelButton: true,
        preConfirm: () => {
            Swal.fire({
                title: 'Rechazando solicitud...',
                text: 'Por favor espera',
                didOpen: () => {
                    Swal.showLoading();  // Mostrar el spinner de carga
                },
                allowOutsideClick: false, // No permitir cerrar la alerta al hacer clic afuera
            });

            return axios.get(`http://127.0.0.1:8000/api/notapprobeRequestWorkEnv/${idJoinUserWork}`, {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                withCredentials: true
            })
            .then(response => {
                Swal.close();  // Cerrar el spinner de carga

                if (response.data) {
                    Swal.fire('Solicitud rechazada', 'La solicitud ha sido rechazada', 'success');
                    setUpdated(!isUpdated);
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
