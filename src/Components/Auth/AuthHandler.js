import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { checkAuthStatus } from '../../Functions/AuthMain/AuthUtils';

const AuthHandler = ({ setUser, children }) => {
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        checkAuthStatus(setUser, navigate, location);
    }, [location, navigate, setUser]);

    return children; // Renderiza los componentes hijos envueltos por este componente
};

export default AuthHandler;
