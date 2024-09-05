import React from 'react';
import Styles from '../Styles/Main.module.css';
import BarrasEntornos from './Dashboard/BarrasEntornos';
import PastelEntornos from './Dashboard/PastelEntornos';

const Main = (props) => {
    return (
        <main className={props.isMainDash ? Styles.maindash : Styles.main}>
            

            {props.isMainDash && (
                   <div className={Styles.MainActivities}>
                   {props.children}
                   </div>
            )}

            {!props.isMainDash && (
                props.children
            )}

            {props.isMainDash && (

                <div className={Styles.ChartsContainer}>
                     <BarrasEntornos data={props.data} />
                     <PastelEntornos data={props.data2} />    
                </div>
                   
            )}
        </main>
    );
};

export default Main;
