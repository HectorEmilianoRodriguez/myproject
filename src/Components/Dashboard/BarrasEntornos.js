import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import Styles from '../../Styles/Charts.module.css';


ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const BarrasEntornos = ({ data }) => {

    if (!Array.isArray(data)) {
        return;
    }


    const chartData = {
        labels: data.map(item => item.nameW),  // Nombres de los entornos
        datasets: [
            {
                label: 'Actividades por evaluar',
                data: data.map(item => item.PendingApprovalActivities),
                backgroundColor: 'rgba(75, 192, 192, 0.6)',
            },
            {
                label: 'Actividades por expirar',
                data: data.map(item => item.AlmostExpiredOrExpiredActivities),
                backgroundColor: 'rgba(255, 99, 132, 0.6)',
            },
            {
                label: 'Comentarios pendientes',
                data: data.map(item => item.NotSeenComments),
                backgroundColor: 'rgba(153, 102, 255, 0.6)',
                
            },
            {
                label: 'Solicitudes pendientes',
                data: data.map(item => item.requests),
                backgroundColor: 'rgba(255, 165, 0, 0.6)',
                
            },
        ],
    };

    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: true,
                text: 'Estado actual de los entornos de trabajo',
            },
        },
    };

    return (
        <div className={Styles.ChartBar}>
            <Bar data={chartData} options={options} />
        </div>
    );
};

export default BarrasEntornos;
