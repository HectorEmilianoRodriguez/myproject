import axios from 'axios';
import Swal from 'sweetalert2';

// Configurar Axios para incluir credenciales en las peticiones al back-end (enviar la cookie.)
axios.defaults.withCredentials = true;

export const fetchCsrfToken = async () => {
    try {
        await axios.get('http://127.0.0.1:8000/sanctum/csrf-cookie');
    } catch (error) {
        console.error('Error fetching CSRF token:', error);
    }
};

// Función para enviar el correo de recuperación
export const sentRecoverEmail = async (email) => {
    try {
        const response = await axios.get(`http://127.0.0.1:8000/api/recoversent/${email}`);
        return response.data.message;
    } catch (error) {
        console.error('Error en recuperar cuenta:', error);
        throw error;
    }
};

// Función para pedir el correo y mostrar mensajes de éxito o error
export const pedirCorreo = async (setAlerta) => {
    const { value: userInput } = await Swal.fire({
        title: 'Ingrese su correo electrónico',
        input: 'text',
        inputLabel: 'Correo electrónico',
        inputPlaceholder: 'micorreo@gmail.com',
        showCancelButton: true,
        inputValidator: (value) => {
            if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value)) {
                return "Ingrese un correo electrónico válido";
            }
        }
    });

    if (userInput) {
        // Mostrar el mensaje de carga después de obtener el input
        Swal.fire({
            title: 'Enviando...',
            text: 'Estamos procesando tu solicitud',
            allowOutsideClick: false,
            didOpen: () => {
                Swal.showLoading();  // Muestra el spinner de carga
            }
        });

        try {
            const message = await sentRecoverEmail(userInput);

            // Cerrar el mensaje de carga
            Swal.close();

            if (message === "noexists") {
                Swal.fire('Error', 'No existe una cuenta registrada con este correo electrónico.', 'error');
            } else {
                Swal.fire('Éxito', `Te hemos enviado un correo a ${userInput} para recuperar tu cuenta`, 'success');
            }
        } catch (error) {
            // Cerrar el mensaje de carga en caso de error
            Swal.close();
            Swal.fire('Error', 'Hubo un problema al enviar el correo de recuperación. Inténtelo de nuevo más tarde.', 'error');
        }
    }
};

export const checkAuthStatus = async (setUser) => {
    try {
        await fetchCsrfToken();
        const response = await axios.get('http://127.0.0.1:8000/api/user', {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            withCredentials: true
        });

        if (response.data) {
            setUser(response.data);
        } else {
            setUser(null); // Asegúrate de establecer el usuario como nulo si no está autenticado
        }
    } catch (error) {
        console.log('No autenticado', error);
        setUser(null); // Asegúrate de establecer el usuario como nulo si hay un error
    }
};


export const eventLogin = async (e, email, password, setAlerta, setUser, navigate) => {
    e.preventDefault();

    if (email.trim().length === 0 || password.trim().length === 0) {
        setAlerta("Todos los campos son obligatorios");
        return;
    }

    try {
        await fetchCsrfToken();

        const response = await axios.post('http://127.0.0.1:8000/api/login', {
            email,
            password
        }, {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            withCredentials: true
        });

        if (response.data.message === "Por favor, verifica tu cuenta") {
            setAlerta("Primero verifique su cuenta vía correo electrónico.");
        } else if (response.data.message === "Credenciales inválidas") {
            setAlerta("Credenciales no válidas");
        } else {
            await fetchCsrfToken();
            const userResponse = await axios.get('http://127.0.0.1:8000/api/user', {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                withCredentials: true
            });
            setUser(userResponse.data);
            navigate('/dashboard');
        }
    } catch (error) {
        console.error('Error login:', error);
        setAlerta("Hubo un problema con el inicio de sesión. Inténtelo de nuevo.");
    }
};

export const eventRegister = async (e, name, email, password, passwordver, setAlerta) => {
    e.preventDefault();

    if (name.trim().length === 0 || email.trim().length === 0 || password.trim().length === 0 || passwordver.trim().length === 0) {
        setAlerta("Todos los campos son obligatorios");
        return;
    }

    if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email)) {
        setAlerta("El correo electrónico no es válido");
        return;
    }

    if (!/^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(password)) {
        setAlerta("La contraseña debe tener al menos 8 caracteres, incluir una mayúscula, un número y un carácter especial");
        return;
    }

    if (password !== passwordver) {
        setAlerta("Las contraseñas no coinciden");
        return;
    }

    setAlerta("");

    try {
        await fetchCsrfToken();

        const response = await axios.post('http://127.0.0.1:8000/api/register', {
            name,
            email,
            password,
        });

        if (response.data.message === "success") {
            setAlerta("Registro exitoso. Por favor, verifica tu correo electrónico.");
        } else {
            setAlerta("Seleccione otro nombre de usuario, ese ya está en uso.");
        }
    } catch (error) {
        setAlerta("Hubo un error en el registro. Por favor, intenta de nuevo.");
    }
};


export const inputsLogin = [
    { index: '1', placeholder: 'Correo electrónico', isPass: false },
    { index: '2', placeholder: 'Contraseña', isPass: true }
];

export const inputsRegister = [
    { index: '1', placeholder: 'Nombre de usuario', isPass: false },
    { index: '2', placeholder: 'Correo electrónico', isPass: false },
    { index: '3', placeholder: 'Contraseña', isPass: true },
    { index: '4', placeholder: 'Repetir contraseña', isPass: true }
];