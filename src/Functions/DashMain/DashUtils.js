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
    
            setData(response.data || []);  // Guardar los datos en el estado
        }

    } catch (err) {
        console.error(err);
        
        setData([]);  // Guardar los datos en el estado

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
    
            setData(response.data || []);  // Guardar los datos en el estado
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
    
            setData(response.data || []);  // Guardar los datos en el estado
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
    
            setData(response.data || []);  // Guardar los datos en el estado
        }

    } catch (err) {
        console.error(err);
    }
};

export const getNotifications = async (setData) => {
    try {
        const response = await axios.get(`http://127.0.0.1:8000/api/getNotifications`, {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            withCredentials: true
        });

        if (response.data) {
    
            setData(response.data || []);  // Guardar los datos en el estado
        }

    } catch (err) {
        console.error(err);
    }
};

export const countMyNotis = async (setData) => {
    try {
        const response = await axios.get(`http://127.0.0.1:8000/api/countMyNotis`, {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            withCredentials: true
        });

        if (response.data) {
    
            setData(response.data || []);  // Guardar los datos en el estado
        }

    } catch (err) {
        console.error(err);
    }
};

export const setSeenNotificationn = async (idNoti) => {
    try {
        await axios.get(`http://127.0.0.1:8000/api/setSeenNotificationn/${idNoti}`, {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            withCredentials: true
        });

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
    
            setRequestData(response.data || []);  // Guardar los datos en el estado
        }

    } catch (err) {
        console.error(err);
    }


}

export const NotifyUserApprobedOrNot = async (workenv, idUser, flag) =>{

    try {
        await axios.get(`http://127.0.0.1:8000/api/NotifyUserApprobedOrNot/${workenv}/${idUser}/${flag}`, {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            withCredentials: true
        });

    } catch (err) {
        console.error(err);
    }

}

export const NotifyUserNewRequest = async (workenv, idUser) =>{

    try {
         await axios.get(`http://127.0.0.1:8000/api/NotifyUserNewRequest/${workenv}/${idUser}`, {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            withCredentials: true
        });

    } catch (err) {
        console.error(err);
    }

}

export const newWorkEnv = async (nameW, type, descriptionW, date_start, date_end) =>{

    try {
        const response = await axios.post(`http://127.0.0.1:8000/api/newWorkEnv`, {
            nameW,
            type,
            descriptionW,
            date_start,
            date_end
        },{
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            withCredentials: true
        });

        if(response.data.message === "ok"){
            return true;
        }

    } catch (err) {
        console.error(err);
    }

}


export const getMyArchivedWorkEnvs = async (setData) =>{

    try {
        const response = await axios.get(`http://127.0.0.1:8000/api/getMyArchivedWorkEnvs`,{
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            withCredentials: true
        });

        if(response.data){
            setData(response.data);
        }
    } catch (err) {
        console.error(err);
    }

}


export const showRequestWorkEnvMessage = async (idUser, idWorkEnv, nameW, setUpdated, isUpdated) => {
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

                    return axios.get(`http://127.0.0.1:8000/api/NotifyUserNewRequest/${nameW}/${idUser}`, {
                        headers: {
                            'Content-Type': 'application/json',
                            'Accept': 'application/json'
                        },
                        withCredentials: true
                    })

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
            setRequestData(response.data || []);  // Guardar los datos en el estado
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
            setRequestData(response.data || []);  // Guardar los datos en el estado
        } else {
            setRequestData(null);
        }

    } catch (err) {
        console.error(err);
    }
}, 500); // 500 ms de retraso



export const showRequestJoinWorkEnvMessage = async (idUser, idWorkEnv, nameworkenv, setUpdated, isUpdated) => {
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

            // Primera solicitud: Aprobar la solicitud de unión
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
                    
                    // Segunda solicitud: Notificar al usuario
                    return axios.get(`http://127.0.0.1:8000/api/NotifyUserApprobedOrNot/${nameworkenv}/${idUser}/1`, {
                        headers: {
                            'Content-Type': 'application/json',
                            'Accept': 'application/json'
                        },
                        withCredentials: true
                    });
                } else {
                    throw new Error('No se pudo aprobar la solicitud');
                }
            })
            .then(notificationResponse => {
                // Manejar la respuesta de la notificación
                Swal.fire('Usuario notificado', 'El usuario ha sido notificado exitosamente.', 'success');
            })
            .catch(err => {
                Swal.close();  // Cerrar el spinner de carga
                Swal.fire('Error', 'No se pudo completar el proceso, intenta más tarde', 'error');
                console.error(err);
            });
        }
    });
};

export const showRequestnotJoinWorkEnvMessage = async (idUser, idJoinUserWork, nameworkenv, setUpdated, isUpdated) => {
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

                    // Segunda solicitud: Notificar al usuario
                    return axios.get(`http://127.0.0.1:8000/api/NotifyUserApprobedOrNot/${nameworkenv}/${idUser}/0`, {
                        headers: {
                            'Content-Type': 'application/json',
                            'Accept': 'application/json'
                        },
                        withCredentials: true
                    });

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





export const inputsForm = [{ index: '0', placeholder: 'Nombre del entorno', isPass: false }, 
    { index: '1', placeholder: 'Fecha de inicio', isDate: true },
    { index: '2', placeholder: 'Fecha de fin', isDate: true }
]


export  function convertirFecha(fecha) {
    if (!fecha || typeof fecha !== 'string') {
        
        return fecha;
    }
    
    // Verifica que la fecha esté en el formato dd/mm/aaaa
    const partes = fecha.split('/');
    if (partes.length !== 3) {
        return fecha;
    }

    const dia = partes[0].padStart(2, '0');  // Asegura que el día tenga 2 dígitos
    const mes = partes[1].padStart(2, '0');  // Asegura que el mes tenga 2 dígitos
    const anio = partes[2];

    // Retorna la fecha en formato aaaa-mm-dd
    return `${anio}-${mes}-${dia}`;
}
