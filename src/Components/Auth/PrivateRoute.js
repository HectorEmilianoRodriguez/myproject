import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

const PrivateRoute = ({ user, children }) => {
    const location = useLocation();

    if (!user) {
        // Guardar la ruta actual para redirigir después de autenticarse
        localStorage.setItem('redirectAfterLogin', location.pathname);
        return <Navigate to="/" />;
    }

    return children;
};

export default PrivateRoute;
