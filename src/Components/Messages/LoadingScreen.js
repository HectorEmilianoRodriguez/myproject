import React from 'react';
import Styles from '../../Styles/LoadingScreen.module.css'

const LoadingScreen = () => {
    return (
        <div className={Styles.loading_screen}>
            <div className={Styles.loading_spinner}></div>
            <p>Cargando...</p>
        </div>
    );
};

export default LoadingScreen;
