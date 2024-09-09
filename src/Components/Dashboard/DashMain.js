import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from '../../Styles/Dashboard.module.css';
import Header from '../Header';
import Aside from '../Aside';
import Main from '../Main';
import MenuOptions from '../MenuOptions';
import InfoDiv from '../InfoDiv';
import { Link } from 'react-router-dom';
import { AiFillHome, AiFillAlert, AiOutlineHeart, AiOutlinePlus } from "react-icons/ai";
import { getNotApprobedActivities, getAlmostExpiredActivities, 
    getNotSeenComments, getPendingApprovals, getRequestsData, 
    showRequestWorkEnvMessage, searchRequests, debounce, showRequestJoinWorkEnvMessage,
     showRequestnotJoinWorkEnvMessage, searchMyRequests, countMyNotis, getNotifications, inputsForm, convertirFecha,
     newWorkEnv, getMyArchivedWorkEnvs} from '../../Functions/DashMain/DashUtils';
import MyRequests from './MyRequests';
import Requests from './Requests';
import SearchBar from '../SearchBar';
import Formulario from '../Formulario';
const titlesAside = [
  { title: <Link to="/dashboard">Home</Link>, icon: <AiFillHome /> },
  { title: <Link to="/dashboard/JoinWorkEnv">Unirme a un entorno</Link>, icon: <AiOutlineHeart /> },
  { title: <Link to="/dashboard/MyRequests">Solicitudes</Link>, icon: <AiFillAlert /> },
  { title: <Link to="/dashboard/newWorkEnv">Crear nuevo entorno</Link>, icon: <AiOutlinePlus /> }
];

const DashMain = ({ user, isWorkEnv, isForm, isRequests, isMyRequests }) => {
    const [isAsideVisible, setAsideVisible] = useState(true);
    const [data, setData] = useState([]);
    const [dataTotalEntornos, setDataTotalEntornos] = useState([]);
    const [MisEntornos, setMisEntornos] = useState([]);
    const [EntornosParticipo, setEntornosParticipo] = useState([]);
    const [ActividadesPorAprobar, setActividadesPorAprobar] = useState([]);
    const [ActividadesPorExpirar, setActividadesPorExpirar] = useState([]);
    const [ComentariosNoVistos, setComentariosNoVistos] = useState([]);
    const [SolicitudesPendientes, setSolicitudesPendientes] = useState([]);
    const [requestsData, setRequests] = useState([]);
    const [searchPossiblesRequests, setPossibleRequests] = useState([]);
    const [searchPossiblesMyRequests, setPossibleMyRequests] = useState([]);
    const [notis, setNotis] = useState([]);
    const [notistotal, setNotistotal] = useState(0);
    const [selectedOption, setSelectedOption] = useState(null); // Estado para manejar el valor del select
    const [textarea, settextarea] = useState(null); // Estado para manejar el valor del select

    const [archivedWork, setArchivedWorks] = useState([]); //para obtener los entornos archivados.


    //states para el form
    const [nameWork, setnameWork] = useState('');
    const [workStart, setWorkStart] = useState('');
    const [workEnd, setWorkEnd] = useState('');
    const [alerta, setAlerta] = useState('');

    const [isUpdated, setUpdated] = useState (false);
    const [totals, setTotals] = useState({
        pendingApproval: 0,
        almostExpiredOrExpired: 0,
        notSeenComments: 0,
        requests: 0
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const statsResponse = await axios.get('http://127.0.0.1:8000/api/getAllStatsUser', {
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    },
                    withCredentials: true
                });
                setData(statsResponse.data || []);
                
                const totalPendingApproval = statsResponse.data.reduce((acc, item) => acc + item.PendingApprovalActivities, 0);
                const totalAlmostExpiredOrExpired = statsResponse.data.reduce((acc, item) => acc + item.AlmostExpiredOrExpiredActivities, 0);
                const totalNotSeenComments = statsResponse.data.reduce((acc, item) => acc + item.NotSeenComments, 0);
                const totalRequests = statsResponse.data.reduce((acc, item) => acc + item.requests, 0);
                
                setTotals({
                    pendingApproval: totalPendingApproval,
                    almostExpiredOrExpired: totalAlmostExpiredOrExpired,
                    notSeenComments: totalNotSeenComments,
                    requests: totalRequests
                });

                const workEnvsResponse = await axios.get('http://127.0.0.1:8000/api/CountMyWorkEnvs', {
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    },
                    withCredentials: true
                });
                setDataTotalEntornos(workEnvsResponse.data || []);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        const getWorkEnvs = async () => {
            try {
                const response = await axios.get('http://127.0.0.1:8000/api/getMyWorkEnvs', {
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    },
                    withCredentials: true
                });
                setMisEntornos(response.data.owner);   
                setEntornosParticipo(response.data.participant);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
        getWorkEnvs();
        getNotApprobedActivities(setActividadesPorAprobar);
        getAlmostExpiredActivities(setActividadesPorExpirar);
        getNotSeenComments(setComentariosNoVistos);
        getPendingApprovals(setSolicitudesPendientes);
        getRequestsData(setRequests);
        searchRequests('', setPossibleRequests); // Inicializa la búsqueda con texto vacío
        searchMyRequests('',setPossibleMyRequests);
        getNotifications(setNotis);
        countMyNotis(setNotistotal);
        getMyArchivedWorkEnvs(setArchivedWorks);
        
    }, [isUpdated]);

    const toggleAside = () => {
        setAsideVisible(!isAsideVisible);
    };

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

    const handleSearch = debounce(async (searchText, setLoading) => {
        try {
            searchRequests(searchText, (data) => {
                setPossibleRequests(data);
                setLoading(false);
            });
        } catch (error) {
            console.error('Error during search:', error);
            setLoading(false);
        }
    }, 300);  // 300ms debounce handleSearchMyRequests


    const handleSearchMyRequests = debounce(async (searchText, setLoading) => {
        try {
            searchMyRequests(searchText, (data) => {
                setPossibleMyRequests(data);
                setLoading(false);
            });
        } catch (error) {
            console.error('Error during search:', error);
            setLoading(false);
        }
    }, 300);
    
   
    const FormGetData = (e, index) =>{
        const value = e.target.value;
        if (index === 0 ) setnameWork(value);
        if (index === 1 ) setWorkStart(convertirFecha(value));
        if (index === 2 ) setWorkEnd(convertirFecha(value));
    };

    const submitForm = (e) => {
        e.preventDefault();
    
        // Validación del nombre del entorno
        if (!nameWork || nameWork.length > 30) {
            setAlerta("El nombre del entorno es requerido y no debe exceder los 30 caracteres.");
            return;
        }
    
       
        // Validación de `selectedOption`
        if (!selectedOption) {
            setAlerta("Debe seleccionar una opción.");
            return;
        }

        setAlerta(''); // Limpiar alerta si todo está bien

        if(newWorkEnv(nameWork, selectedOption, textarea, workStart, workEnd )){
            setAlerta('Nuevo entorno creado exitosamente');
            setUpdated(!isUpdated);
        }


    };
    

    return (
        <div className={styles.body_dashboard}>
            <Header 
                numNotis={notistotal}
                user={user.name}
                email={user.email}
                isWorkEnv={false}
                toggleAside={toggleAside}
                dataNotis = {notis}
                setUpdated = {setUpdated}
                isUpdated = {isUpdated}
            />
            {isAsideVisible && !isWorkEnv && (
                <Aside titles={titlesAside}>
                    <MenuOptions 
                        title='Mis entornos de trabajo'
                        linkTo='/WorkEnv'
                        details={MisEntornos}
                    />
                    <MenuOptions 
                        title='Entornos donde participo'
                        linkTo='/WorkEnv'
                        details={EntornosParticipo}
                    /> 
                     <MenuOptions 
                        title='Mis entornos archivados'
                        linkTo='/WorkEnv'
                        details={archivedWork}
                    /> 
                </Aside>
            )}
            {/* Lógica condicional para renderizar solo un contenido en el <Main> */}
            {isForm ? (
                <Main isMainDash = {false}>
                    
                    <Formulario 
                        title = "Nuevo entorno"
                        desc = "Introduce los campos que se te indica"
                        inputs = {inputsForm}
                        handleSelectChange= {handleSelectChange}
                        selectedOption={selectedOption}
                        handleChange={FormGetData}
                        eventButton = {submitForm}
                        descButton = "Crear nuevo entorno"
                        values = {[nameWork, workStart, workEnd]}
                        isBox = {true}
                        isTextArea = {true}
                        handleTextAreaChange = {handleTextAreaChange}
                        textAreaValue = {textarea}
                        descSelect = "Selecciona o escribe el tipo de entorno"
                        alert = {alerta}
                    >
                        
                    </Formulario>
                    



                </Main>
            ) : isRequests ? (
                <Main isMainDash={false}>
                    <SearchBar getSearchData={handleSearch} placeholder='Nombre o email del project manager, titulo, fecha de inicio o termino del entorno....' />
                    <div className={styles.wrapperRequests}>
                        {searchPossiblesRequests && searchPossiblesRequests.length > 0 ? (
                            searchPossiblesRequests.map((data, index) => (
                                <Requests
                                    key={index}
                                    data={data}
                                    sendrequest={() => showRequestWorkEnvMessage(data.idUser, data.idWorkEnv, data.nameW, setUpdated, isUpdated)}
                                />
                            ))
                        ) : (
                            requestsData && requestsData.map((data, index) => (
                                <Requests
                                    key={index}
                                    data={data}
                                    sendrequest={() => showRequestWorkEnvMessage(data.idUser, data.idWorkEnv, data.nameW, setUpdated, isUpdated)}
                                />
                            ))
                        )}
                    </div>
                </Main>
            ) : isMyRequests ? (
                <Main isMainDash={false}>
                    <SearchBar getSearchData={handleSearchMyRequests} placeholder='Nombre del entorno o del usuario.' />
                    <div className={styles.wrapperRequests}>

                    {searchPossiblesMyRequests && searchPossiblesMyRequests.length > 0 ? (
                        

                        searchPossiblesMyRequests.map((data,index)=>(

                            <MyRequests key = {index} data={data} submitAccept={()=>{showRequestJoinWorkEnvMessage(data.idUser, data.idWorkEnv, data.nameW, setUpdated, isUpdated)}} 
                                submitDeny={()=>{showRequestnotJoinWorkEnvMessage(data.idUser, data.idJoinUserWork, data.nameW, setUpdated, isUpdated)}}
                            />
                        ))

                    ) : (

                            SolicitudesPendientes && SolicitudesPendientes.map((data,index) =>(

                                <MyRequests key = {index} data={data} submitAccept={()=>{showRequestJoinWorkEnvMessage(data.idUser, data.idWorkEnv, data.nameW, setUpdated, isUpdated)}} 
                                    submitDeny={()=>{showRequestnotJoinWorkEnvMessage(data.idUser, data.idJoinUserWork, data.nameW, setUpdated, isUpdated)}}
                                />


                            ))

                        )}

                    </div>
                </Main>
            ) : (
                <Main isMainDash={true} data={data} data2={dataTotalEntornos === null ? null : dataTotalEntornos}>
                    <InfoDiv Info={!dataTotalEntornos.owner ? '0' : dataTotalEntornos.owner} Desc='Mis entornos de trabajo'>
                        {MisEntornos && MisEntornos.map(data => (
                            <Link key={data.idWorkEnv} to={`/WorkEnv/${data.title}/${data.idWorkEnv}`}>
                                {data.title}
                            </Link>
                        ))}
                    </InfoDiv>
                    <InfoDiv Info={!dataTotalEntornos.participant ? '0' : dataTotalEntornos.participant} Desc='Entornos donde participo'>
                        {EntornosParticipo && EntornosParticipo.map(data => (
                            <Link key={data.idWorkEnv} to={`/WorkEnv/${data.title}/${data.idWorkEnv}`}>
                                {data.title}
                            </Link>
                        ))}
                    </InfoDiv>
                    <InfoDiv Info={totals.pendingApproval} Desc='Actividades por evaluar'>
                    {Array.isArray(ActividadesPorAprobar) && ActividadesPorAprobar.length > 0 ? (
                        ActividadesPorAprobar.map(data => (
                            <Link key={data.idWorkEnv} to={`/WorkEnv/${data.nameW}/${data.idWorkEnv}/Board/${data.nameB}/${data.idBoard}`}>
                                {`Actividad "${data.nameC}" del tablero "${data.nameB}" en el entorno "${data.nameW}"`}
                            </Link>
                        ))
                    ) : (
                        <p>No hay actividades por evaluar.</p>  // Mensaje cuando el array está vacío
                    )}
                </InfoDiv>

                <InfoDiv Info={totals.almostExpiredOrExpired} Desc='Actividades por expirar'>
                        {Array.isArray(ActividadesPorExpirar) && ActividadesPorExpirar.length > 0 ? (
                            ActividadesPorExpirar.map(data => (
                                <Link key={data.idWorkEnv} to={`/WorkEnv/${data.nameW}/${data.idWorkEnv}/Board/${data.nameB}/${data.idBoard}`}>
                                    {`Actividad "${data.nameC}" del tablero "${data.nameB}" en el entorno "${data.nameW}"`}
                                </Link>
                            ))
                        ) : (
                            <p>No hay actividades por expirar.</p>  // Mensaje cuando el array está vacío
                        )}
                    </InfoDiv>

                    <InfoDiv Info={totals.notSeenComments} Desc='Comentarios pendientes'>
                        {Array.isArray(ComentariosNoVistos) && ComentariosNoVistos.length > 0 ? (
                            ComentariosNoVistos.map(data => (
                                <Link key={data.idWorkEnv} to={`/WorkEnv/${data.nameW}/${data.idWorkEnv}/Board/${data.nameB}/${data.idBoard}`}>
                                    {`Comentario en la actividad "${data.nameC}" del tablero "${data.nameB}" en el entorno "${data.nameW}"`}
                                </Link>
                            ))
                        ) : (
                            <p>No hay comentarios pendientes.</p>  // Mensaje cuando el array está vacío
                        )}
                    </InfoDiv>

                    <InfoDiv Info={totals.requests} Desc='Solicitudes'>
                        {Array.isArray(SolicitudesPendientes) && SolicitudesPendientes.length > 0 ? (
                            SolicitudesPendientes.map(data => (
                                <Link key={data.idWorkEnv} to={`/dashboard/MyRequests`}>
                                    {`El miembro ${data.name} ha hecho una solicitud para el entorno "${data.nameW}"`}
                                </Link>
                            ))
                        ) : (
                            <p>No hay solicitudes pendientes.</p>  // Mensaje cuando el array está vacío
                        )}
                    </InfoDiv>

                </Main>
            )}
        </div>
    );
};

export default DashMain;
