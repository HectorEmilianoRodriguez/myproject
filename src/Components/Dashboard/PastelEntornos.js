import React from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import Styles from '../../Styles/Charts.module.css';

ChartJS.register(ArcElement, Tooltip, Legend);

const PastelEntornos = ({ data }) => {
   // Calcula las sumas para cada categoría
    if (data === null) {
        return;
    }


   // Prepara los datos para la gráfica de pastel
   const chartData = {
       labels: ['Entornos Donde Participo', 'Mis Entornos'],
       datasets: [
           {
               data: [data.participant, data.owner],
               backgroundColor: ['rgba(75, 192, 192, 0.6)', 'rgba(255, 99, 132, 0.6)'],
               borderColor: ['rgba(75, 192, 192, 1)', 'rgba(255, 99, 132, 1)'],
               borderWidth: 1,
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
            text: 'Mis entornos vs entornos donde participo',
            },
           tooltip: {
               callbacks: {
                   label: function(tooltipItem) {
                       const label = tooltipItem.label || '';
                       const value = tooltipItem.raw;
                       return `${label}: ${value}`;
                   }
               }
           }
       },
   };

   return (
       <div className={Styles.ChartPie}>
           <Pie data={chartData} options={options} />
       </div>
   );
};


export default PastelEntornos;
