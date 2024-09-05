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
import { getNotApprobedActivities, getAlmostExpiredActivities, getNotSeenComments, getPendingApprovals, getRequestsData, showRequestWorkEnvMessage, searchRequests, debounce, showRequestJoinWorkEnvMessage, showRequestnotJoinWorkEnvMessage, searchMyRequests } from '../../Functions/DashMain/DashUtils';
import MyRequests from './MyRequests';
import Requests from './Requests';
import SearchBar from '../SearchBar';

const titlesAside = [
  { title: <Link to="/dashboard">Home</Link>, icon: <AiFillHome /> },
  { title: <Link to="/dashboard/JoinWorkEnv">Unirme a un entorno</Link>, icon: <AiOutlineHeart /> },
  { title: <Link to="/dashboard/MyRequests">Solicitudes</Link>, icon: <AiFillAlert /> },
  { title: <Link to="/createWorkEnv">Crear nuevo entorno</Link>, icon: <AiOutlinePlus /> }
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
    const [searchPossiblesRequests, setPossibleRequests] = useState(null);
    const [searchPossiblesMyRequests, setPossibleMyRequests] = useState(null);
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
        
    }, [isUpdated]);

    const toggleAside = () => {
        setAsideVisible(!isAsideVisible);
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



    return (
        <div className={styles.body_dashboard}>
            <Header 
                numNotis='3'
                user={user.name}
                email={user.email}
                isWorkEnv={false}
                toggleAside={toggleAside}
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
                </Aside>
            )}
            {/* Lógica condicional para renderizar solo un contenido en el <Main> */}
            {isForm ? (
                <Main>
                    {/* Contenido específico para el formulario */}
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
                                    sendrequest={() => showRequestWorkEnvMessage(data.idWorkEnv, setUpdated, isUpdated)}
                                />
                            ))
                        ) : (
                            requestsData && requestsData.map((data, index) => (
                                <Requests
                                    key={index}
                                    data={data}
                                    sendrequest={() => showRequestWorkEnvMessage(data.idWorkEnv, setUpdated, isUpdated)}
                                />
                            ))
                        )}
                    </div>
                </Main>
            ) : isMyRequests ? (
                <Main>

                    <div className={styles.wrapperRequests}>
                    <SearchBar getSearchData={handleSearchMyRequests} placeholder='Nombre del entorno o del usuario.' />

                    {searchPossiblesMyRequests && searchPossiblesMyRequests.length > 0 ? (


                        searchPossiblesMyRequests.map((data,index)=>(

                            <MyRequests key = {index} data={data} submitAccept={()=>{showRequestJoinWorkEnvMessage(data.idUser, data.idWorkEnv, setUpdated, isUpdated)}} 
                                submitDeny={()=>{showRequestnotJoinWorkEnvMessage(data.idJoinUserWork, setUpdated, isUpdated)}}
                            />
                        ))

                    ) : (

                            SolicitudesPendientes && SolicitudesPendientes.map((data,index) =>(

                                <MyRequests key = {index} data={data} submitAccept={()=>{showRequestJoinWorkEnvMessage(data.idUser, data.idWorkEnv, setUpdated, isUpdated)}} 
                                    submitDeny={()=>{showRequestnotJoinWorkEnvMessage(data.idJoinUserWork, setUpdated, isUpdated)}}
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
                        {ActividadesPorAprobar && ActividadesPorAprobar.map(data => (
                            <Link key={data.idWorkEnv} to={`/WorkEnv/${data.nameW}/${data.idWorkEnv}/Board/${data.nameB}/${data.idBoard}`}>
                                {`Actividad "${data.nameC}" del tablero "${data.nameB}" en el entorno "${data.nameW}"`}
                            </Link>
                        ))}
                    </InfoDiv>
                    <InfoDiv Info={totals.almostExpiredOrExpired} Desc='Actividades por expirar'>
                        {ActividadesPorExpirar && ActividadesPorExpirar.map(data => (
                            <Link key={data.idWorkEnv} to={`/WorkEnv/${data.nameW}/${data.idWorkEnv}/Board/${data.nameB}/${data.idBoard}`}>
                                {`Actividad "${data.nameC}" del tablero "${data.nameB}" en el entorno "${data.nameW}"`}
                            </Link>
                        ))}
                    </InfoDiv>
                    <InfoDiv Info={totals.notSeenComments} Desc='Comentarios pendientes'>
                        {ComentariosNoVistos && ComentariosNoVistos.map(data => (
                            <Link key={data.idWorkEnv} to={`/WorkEnv/${data.nameW}/${data.idWorkEnv}/Board/${data.nameB}/${data.idBoard}`}>
                                {`Comentario en la actividad "${data.nameC}" del tablero "${data.nameB}" en el entorno "${data.nameW}"`}
                            </Link>
                        ))}
                    </InfoDiv>
                    <InfoDiv Info={totals.requests} Desc='Solicitudes'>
                        {SolicitudesPendientes && SolicitudesPendientes.map(data => (
                            <Link key={data.idWorkEnv} to={`/dashboard/MyRequests`}>
                                {`El miembro ${data.name} ha hecho una solicitud para el entorno "${data.nameW}"`}
                            </Link>
                        ))}
                    </InfoDiv>
                </Main>
            )}
        </div>
    );
};

export default DashMain;
