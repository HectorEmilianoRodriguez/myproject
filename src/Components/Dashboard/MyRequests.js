import React from 'react';
import Styles from '../../Styles/MyRequests.module.css';
import { fetchUserPhoto } from '../../Functions/Requests/RequetsUtils';
import { useState, useEffect } from 'react';
import { NotifyUserApprobedOrNot } from '../../Functions/DashMain/DashUtils';
const MyRequests = ({data, submitAccept, submitDeny}) =>{

    const [perfilPhoto, setPerfilPhoto] = useState(null); // Estado para almacenar la URL de la imagen de perfil

   useEffect(()=>{fetchUserPhoto(data.photo, setPerfilPhoto)} ,[])


    return(<>
    
            <div className={Styles.wrapper}>

              <div className={Styles.wrappercontent}>
                
          
                    <img src = {perfilPhoto} alt = 'foto de perfil' className={Styles.image}/>
                  
                    <p>El usuario {data.name} desea unirse a el entorno {data.nameW}</p>

              </div> 

                 <div className={Styles.wrappercontent}>
                        <button className={Styles.ButtonAccept} onClick = {()=>{submitAccept(); NotifyUserApprobedOrNot(data.nameW, data.idUser, 1);}}>Aceptar</button> <button className={Styles.ButtonDeny} onClick = {()=>{submitDeny(); NotifyUserApprobedOrNot(data.nameW, data.idUser, 0);}}>Rechazar</button>
                </div> 


            </div>


         </>);
};

export default MyRequests;