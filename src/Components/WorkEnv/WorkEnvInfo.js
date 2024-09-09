import React, { useEffect } from 'react';
import Styles from '../../Styles/WorkEnvInfo.module.css'
import { fetchUserPhoto } from '../../Functions/Requests/RequetsUtils';
import { useState } from 'react';
const WorkEnvInfo = ({photo, title, owner, end, type, descButtonn, isButton, eventB}) =>{

    const [perfilPhoto, setPerfilPhoto] = useState(null); // Estado para almacenar la URL de la imagen de perfil

    

    useEffect(()=>{
        fetchUserPhoto(photo, setPerfilPhoto);
    }, []);


    return (<>
                <div className={Styles.Wrapper}>
                            
                    <h2 className={Styles.h2}>"{title}"</h2>
                    <img src ={perfilPhoto} alt = "foto de perfil" className={Styles.image}></img>
                    <p>Líder del entorno : <i><strong>{owner}</strong></i></p>
                    <div className={Styles.InfoWrapper}>
                        <p>Fecha esperada de culminación: <i><strong>{end}</strong></i></p> 
                        <p>Tipo de proyecto: <i><strong>{type}</strong></i></p>
                    </div>
                    
                {isButton && (
                    <button className={Styles.Button} onClick = {()=>{eventB()}}>
                        {descButtonn}
                    </button>
                )}
                    
                </div>
            </>);

};

export default WorkEnvInfo;