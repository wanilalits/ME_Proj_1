'use client';
import React, { useState, useEffect } from "react";
import { Line } from 'react-chartjs-2';
import Image from "next/image";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
    Filler
} from 'chart.js';
import { updateUser } from '../redux/slice';
import { useDispatch, useSelector } from 'react-redux';

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Tooltip, Legend,   Filler);

const LineGraph = (props) => {
  const dispatch = useDispatch();
  const reduxData = useSelector((state) => state.userData.users);
  const userDispatch = () => {
    var id = props.id;
    var name = reduxData[0].name;
    name = { ...name, [props.mykey]: "bar" };
    var nameArr = [{ id, name }];
    dispatch(updateUser([props.id, nameArr]));
  };

  const [chartData, setChartData] = useState({ 
    labels: Array(15).fill('-'),
    datasets: Array(15).fill(0),
  });


 

  const data = {
    labels: chartData.labels,
    datasets: [
      {
        label: props.Label,
        data: chartData.datasets,
        fill: true,
        tension: 0.3,
        borderColor: 'rgb(115, 194, 51)',
        backgroundColor: 'rgba(115, 194, 51, 0.2)',
        pointRadius: 2,
        borderWidth: 2,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { display: false },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };





useEffect(() => {
  if (!props.liveData || props.liveData.length === 0) return;

  const datasets = props.liveData.map(item =>
    Number(item[props.mykey] || 0)
  );

  const labels = props.liveData.map(item =>
    new Date(item.time).getMinutes()
  );

  setChartData({
 labels: labels,
   datasets: datasets
 });

}, [props.liveData, props.mykey]);

useEffect(() => {
  if (props.liveData && props.liveData.length > 0) {
 //console.log("Live data received in LineGraph:", props.liveData.at(-1)[props.mykey]);
 //console.log ("Live averages received in LineGraph:", props.liveAverages);
  } 
}, [props.liveData, props.liveAverages]);


useEffect(() => {
 //console.log("chartData:", chartData);  
}, [chartData]);


  return (
    <div
      style={{
        backgroundColor: props.bg,
 
     
  
         
        position: 'relative',
        height: '340px',
        border: '3px solid #000',
        borderRadius: '16px',
      
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
        padding: '10px',
    width: "100%",
    maxWidth: "360px",
    boxSizing: "border-box"

      }}
    >
      {/* Header */}
      <div style={{ height: '80px', position: 'relative' }}>
        <Image
          src={props.image}
          alt=""
          width={40}
          height={40}
          style={{ position: 'absolute', top: '8px', right: '12px' }}
        />

        <div style={{ position: 'absolute', top: '55px', left: '10px' }}>
          <button
            onClick={userDispatch}
            style={{
              backgroundColor: '#066b14',
              width: '30px',
              height: '30px',
              border: 'none',
              clipPath: 'polygon(0 0, 0 100%, 100% 50%)',
              boxShadow: '0 4px #024d0e, 0 6px 20px rgba(0, 0, 0, 0.19)',
              color: 'white',
              fontSize: '16px',
              cursor: 'pointer',
            
            }}
          ></button>
        </div>

        <div
          style={{
            fontSize: '20px',
            fontWeight: '600',
            color: '#2f8b0b',
            fontFamily: 'Roboto, sans-serif',
            position: 'absolute',
            top: '4px',
            left: '50%',
            transform: 'translateX(-50%)',
          }}
        >
          {props.Label}
        </div>

        <div
          style={{
            fontSize: '38px',
            color: '#096d12',
            fontFamily: 'Futura, sans-serif',
            position: 'absolute',
            top: '30px',
            left: '50%',
            transform: 'translateX(-50%)',
            animation: 'blink 1.2s infinite',
          }}
        >
   {props.liveData?.at(-1)?.[props.mykey] || ""}
        </div>

        <div
          style={{
            fontSize: '14px',
            fontWeight: '500',
            color: '#2da733',
            position: 'absolute',
            top: '4px',
            left: '10px',
          }}
        >
          Average
        </div>

        <div
          style={{
            fontSize: '16px',
            fontWeight: '600',
            backgroundColor: '#2da733',
            color: 'white',
            padding: '4px 10px',
            borderRadius: '8px',
            position: 'absolute',
            top: '25px',
            left: '10px',
          }}
        >
          {props.liveAverages}
        </div>

        <div
          style={{
            position: 'absolute',
            fontSize: '20px',
            fontWeight: 'bold',
            color: '#08642b',
            top: '40px',
            right: '12px',
          }}
        >
          {props.unit}
        </div>
      </div>

      {/* Chart */}
      <div
        style={{
          marginTop: '20px',
          padding: '10px',
          backgroundColor: '#fff',
          border: '2px solid black',
          height: '180px',
          width: 'auto',
          boxSizing: 'border-box',
        }}
      >
        <Line data={data} options={options} />
      </div>
    </div>
  );
};

export default LineGraph;
