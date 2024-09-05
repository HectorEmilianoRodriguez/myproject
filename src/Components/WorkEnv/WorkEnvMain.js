import React, { useState, useEffect } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { AmIOnWorkEnv } from '../../Functions/WorkEnvMain/WorkEnvUtils';

const WorkEnvMain = ({ user }) => {
    const { nameWork, idWork } = useParams();
    const [data, setData] = useState(null);
    const [error, setError] = useState(false);


    useEffect(() => {
        AmIOnWorkEnv(setData, setError, idWork);
    }, [idWork]);  // Ejecutar cuando `idWork` cambie

    if (error) {
        return <Navigate to="/dashboard" />;  // Redirigir si hay un error
    }

    return (
        <div>
            <h1>Detalles del Entorno</h1>
  
            {data && (
                <>
                    <p>Nombre del entorno: {data.title}</p>
                    <p>Tipo: {data.type}</p>
                    <p>Descripción: {data.descriptionW}</p>
                    <p>Fecha de inicio: {data.date_start}</p>
                    <p>Fecha de fin: {data.date_end}</p>
                    <p>Privilegio: {data.privilege}</p>
                </>
            )}
            <p>Usuario: {user.name}</p>
        </div>
    );
};

export default WorkEnvMain;
