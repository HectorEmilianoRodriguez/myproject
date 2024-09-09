import React, { useState, useEffect } from 'react';
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import './App.css';
import AuthMain from './Components/Auth/AuthMain';
import DashMain from './Components/Dashboard/DashMain';
import AccountVerified from './Components/Messages/AccountVerify';
import WorkEnvMain from './Components/WorkEnv/WorkEnvMain';
import ChangeUser from './Components/Messages/ChangeUser';
import { checkAuthStatus } from './Functions/AuthMain/AuthUtils';
import LoadingScreen from './Components/Messages/LoadingScreen';

function App() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true); // Agregado para controlar el estado de carga

    useEffect(() => {
        const fetchAuthStatus = async () => {
            await checkAuthStatus(setUser);
            setLoading(false); // Establece la carga como completa después de verificar el estado de autenticación
        };

        fetchAuthStatus();
    }, []);

    if (loading) {
        return <LoadingScreen/>;
    }

    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={user ? <Navigate to="/dashboard" /> : <AuthMain isLoginView={true} setUser={setUser} />} />
                <Route path="/register" element={user ? <Navigate to="/dashboard" /> : <AuthMain isLoginView={false} setUser={setUser} />} />
                <Route
                    path="/dashboard"
                    element={user ? <DashMain user={user} isWorkEnv={false} isForm={false} /> : <Navigate to="/" />}
                />
                <Route
                    path="/WorkEnv/:nameWork/:idWork"
                    element={user ? <WorkEnvMain user={user} isMain={true}/> : <Navigate to="/" />}
                />
                <Route
                    path="/ChangeMyPerfil"
                    element={user ? <ChangeUser user={user} /> : <Navigate to="/" />}
                />
                <Route path="/accountverified" element={<AccountVerified />} />
                <Route
                    path="/dashboard/JoinWorkEnv"
                    element={user ? <DashMain user={user} isWorkEnv={false} isForm={false} isRequests={true} /> : <Navigate to="/" />}
                />
                <Route
                    path="/dashboard/MyRequests"
                    element={user ? <DashMain user={user} isWorkEnv={false} isForm={false} isRequests={false} isMyRequests = {true} /> : <Navigate to="/" />}
                />
                <Route
                    path="/dashboard/newWorkEnv"
                    element={user ? <DashMain user={user} isWorkEnv={false} isForm={true} isRequests={false} isMyRequests = {false} /> : <Navigate to="/" />}
                />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
