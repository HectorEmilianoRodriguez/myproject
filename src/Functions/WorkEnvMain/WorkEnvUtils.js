import axios from 'axios';

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

