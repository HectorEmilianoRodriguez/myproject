import React, { useState, useEffect } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { AmIOnWorkEnv, inputsForm, updatework, getWorkEnvOwner, archivework, undeleteWorkEnv } from '../../Functions/WorkEnvMain/WorkEnvUtils';
import LoadingScreen from '../Messages/LoadingScreen';
import Main from '../Main';
import Aside from '../Aside';
import Header from '../Header';
import Styles from '../../Styles/WorkEnv.module.css';
import { countMyNotis, getNotifications, convertirFecha } from '../../Functions/DashMain/DashUtils';
import { AiFillHome, AiOutlineUser, AiFillFolder, AiFillEdit, AiOutlineCalendar, AiOutlineRead, AiFillSave } from "react-icons/ai";
import { Link } from 'react-router-dom';
import Formulario from '../Formulario';
import WorkEnvInfo from './WorkEnvInfo';
import { useNavigate } from 'react-router-dom';
const WorkEnvMain = ({ user, isMain }) => {
   

    const { nameWork, idWork } = useParams();
    const [data, setData] = useState(null); //datos del entorno de trabajo recibido.
    const [error, setError] = useState(false);
    const [totalnotis, setTotalNotis] = useState(0); //notificaciones totales.
    const [notis, setNotis] = useState([]); //obtener notificaciones.
    const [isAsideVisible, setAsideVisible] = useState(true); //para mostrar o no el aside.
    const [isUpdated, setUpdated] = useState(false); //para validar si hay que renderizar o no nuevamente.

    const navigate = useNavigate();

 
    //states para el form
    const [nameWorkk, setnameWork] = useState('');
    const [workStart, setWorkStart] = useState('');
    const [workEnd, setWorkEnd] = useState('');
    const [alerta, setAlerta] = useState('');
    const [selectedOption, setSelectedOption] = useState(null); // Estado para manejar el valor del select
    const [textarea, settextarea] = useState(null); // Estado para manejar el valor del select

    const [ownerWorkEnv, setownerWorkEnv] = useState([]); //obtener datos del lider del entorno


    useEffect(() => {
        AmIOnWorkEnv(setData, setError, idWork);
        countMyNotis(setTotalNotis);
        getNotifications(setNotis);
        getWorkEnvOwner(idWork,setownerWorkEnv);
       
    }, [idWork, isUpdated]);  // Ejecutar cuando `idWork` cambie

    if (error) {
        return <Navigate to="/dashboard" />;  // Redirigir si hay un error
    }

    if (!data) {
        return <LoadingScreen /> // Mostrar mensaje de carga si `data` es `null`
    }

    

    const toggleAside = () => {
        setAsideVisible(!isAsideVisible);
    };

    // Construye los títulos del Aside solo si `data` no es `null`
    const titlesAside = [
        { title: <Link to="/dashboard">Home</Link>, icon: <AiFillHome /> },
        { title: <Link to={`/WorkEnv/${data.title}/${data.idWorkEnv}`}>{data.title}</Link>, icon: <AiFillEdit /> },
        { title: <Link to={`/WorkEnv/${data.title}/${data.idWorkEnv}/Members`}>Miembros</Link>, icon: <AiOutlineUser /> },
        { title: <Link to={`/WorkEnv/${data.title}/${data.idWorkEnv}/Resources`}>Recursos</Link>, icon: <AiFillFolder /> },
        { title: <Link to={`/WorkEnv/${data.title}/${data.idWorkEnv}/ActivitiesCalendar`}>Calendario de actividades</Link>, icon: <AiOutlineCalendar />},
        (data.privilege === 2 || data.privilege === 1) && {title: <Link to={`/workEnv/${data.title}/${data.idWorkEnv}/MyGroupsTasks`}>Mis grupos de tareas</Link>, icon: <AiOutlineRead />},
        {title: <Link to={`/WorkEnv/${data.title}/${data.idWorkEnv}/ArchivedsBoards`}>Tableros archivados</Link>, icon: <AiFillSave />}      
    ];

    const handleSelectChange = (option, actionMeta) => {
        if (actionMeta.action === "select-option") {
            setSelectedOption(option.value); // Guarda la opción seleccionada
        } else if (actionMeta.action === "create-option") {
            setSelectedOption(option.value); // Guarda la opción que el usuario escribió
        }
    };
    
    const handleTextAreaChange = (e) => {
        settextarea(e.target.value);  // Actualiza el estado con el texto ingresado
    };

    const FormGetData = (e, index) =>{
        namew = "";
        const value = e.target.value;
        if (index === 0 ) setnameWork(value);
        if (index === 1 ) setWorkStart(convertirFecha(value));
        if (index === 2 ) setWorkEnd(convertirFecha(value));
    };

    const submitForm = (e) => {
        e.preventDefault();
    
        // Validación del nombre del entorno
        if (!nameWorkk || nameWorkk.length > 30) {
            setAlerta("El nombre del entorno es requerido y no debe exceder los 30 caracteres.");
            return;
        }
    
        // Validación de `selectedOption`
        if (!selectedOption) {
            setAlerta("Debe seleccionar una opción.");
            return;
        }

        setAlerta(''); // Limpiar alerta si todo está bien

        if(updatework(data.idWorkEnv, nameWorkk, textarea, selectedOption, workStart, workEnd )){
            setAlerta('Entorno actualizado exitosamente');
            setUpdated(!isUpdated);
        }
    };

    const submitFormDelete = (e) =>{
        e.preventDefault();
        archivework(data.idWorkEnv, navigate);
    }

    
    let namew = data.title
    
     let inputs = inputsForm(namew, data.date_start, data.date_end);


    return (
        <div className={Styles.Wrapper}>
            <Header 
                numNotis={totalnotis}
                user={user.name}
                email={user.email}
                isWorkEnv={true}
                toggleAside={toggleAside}
                dataNotis={notis}
                setUpdated={setUpdated}
                isUpdated={isUpdated}
            />

            {isAsideVisible && (
                <Aside titles={titlesAside} />
            )}
            {isMain && (
                <Main isMainDash={false}>

                    <div className={Styles.WrapperMain}>
                       
                    {(data.privilege === 2 && data.logicdeleted === 0) && (

                        <Formulario 
                        title={data.title}
                        desc="Introduce los campos que se te indica"
                        inputs={inputs}
                        handleSelectChange={handleSelectChange}
                        selectedOption={selectedOption}
                        handleChange={FormGetData}
                        eventButton={submitForm}
                        descButton="Actualizar entorno"
                        values={[nameWork, workStart, workEnd]}
                        isBox={true}
                        isTextArea={true}
                        handleTextAreaChange={handleTextAreaChange}
                        textAreaValue={textarea}
                        descSelect="Selecciona o escribe el tipo de entorno"
                        alert={alerta}
                        secondButton = {true}
                        eventButton2 = {submitFormDelete}
                        descButton2 = "Archivar"
                        />
                        

                        )}

                       {(data.privilege ===2 && data.logicdeleted === 1) ? (

                            <WorkEnvInfo 
                            title = {data.title}
                            owner = {ownerWorkEnv.name}
                            photo = {ownerWorkEnv.photo}
                            end = {data.date_end}
                            type = {data.type}
                            isButton = {true}
                            descButtonn= "Desarchivar"
                            eventB={()=>{undeleteWorkEnv(data.idWorkEnv, navigate)}}
                            />

                       ):(
                        
                                <WorkEnvInfo 
                                title = {data.title}
                                owner = {ownerWorkEnv.name}
                                photo = {ownerWorkEnv.photo}
                                end = {data.date_end}
                                type = {data.type}
                                isButton = {false}
                                

                                />
                       )} 
                        

                        
                    </div>
                    
                </Main>
            )}


        </div>
    );
};

export default WorkEnvMain;
