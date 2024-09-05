import React from "react";
import Styles from '../../Styles/Requests.module.css';

const Requests = ({data, sendrequest})=>{


    return(<>

              <div className={Styles.Wrapper}>

                 <p>Entorno de trabajo "<strong>{data.nameW}</strong>"</p>
                 <p>Project Manager: "<strong>{data.name} - {data.email}</strong>"</p>
                 <p>Miembros activos: "<strong>{data.Miembros}</strong>"</p>
                 <div className={Styles.Info}>
                    <p>Fecha de inicio "<strong>{data.date_start}</strong>"</p>
                    <p>Fecha de termino "<strong>{data.date_end}</strong>"</p>
                 </div>

                 <button className={Styles.Button} onClick ={()=>sendrequest()}>
                    Solicitar unirse
                 </button>
              </div>
        

          </>);



};

export default Requests;