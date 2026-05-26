"use client";

import React, { useState, useEffect } from "react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import Image from "next/image";
import { updateUser } from "../redux/slice";
import { useDispatch, useSelector } from "react-redux";

ChartJS.register(ArcElement, Tooltip, Legend);

const PieChart = (props) => {
  const dispatch = useDispatch();
  const reduxData = useSelector((state) => state.userData.users);
const startOfDay = new Date();
startOfDay.setHours(0, 0, 0, 0); // 00:00:01.000 AM
const endOfDay = new Date();
endOfDay.setHours(23, 59, 59, 999); // 11:59:59.999 PM
  const userDispatch = () => {
    const id = props.id;
    const name = { ...reduxData[0].name, [props.mykey]: "line" };
    dispatch(updateUser([props.id, [{ id, name }]]));
  };

  const [chartData, setChartData] = useState({
    labels: Array(15).fill("-"),
    datasets: Array(15).fill(0),
    rawDates: [], // store original timestamps for tooltip
  });

  // Generate green shades
  const generateGreenShade = (i) => {
    const green = 120 + i * 5;
    const red = 50 + i * 2;
    const blue = 50 + i;

    return `rgb(${Math.min(red, 140)}, ${Math.min(
      green,
      200
    )}, ${Math.min(blue, 100)})`;
  };

  const backgroundColors = chartData.datasets.map((_, i) =>
    generateGreenShade(i)
  );

  const borderColors = chartData.datasets.map(() => "#ffffff");

  const data = {
    labels: chartData.labels,
    datasets: [
      {
        label: props.Label,
        data: chartData.datasets,
        backgroundColor: backgroundColors,
        borderColor: borderColors,
        borderWidth: 1.2,
         
      },
    ],
  };

  const options = {
    responsive: false,
    maintainAspectRatio: false, // allow chart to use full container size
  radius: "100%",             // fill maximum possible area
    plugins: {
      legend: false,
      tooltip: {
        callbacks: {
          // Tooltip title = full date and time
          title: function (context) {
            const index = context[0].dataIndex;
            const rawDate = chartData.rawDates[index];

            if (!rawDate) return "";

            const date = new Date(rawDate);

            if (isNaN(date.getTime())) return "";

            return date.toLocaleString("en-GB", {
              day: "2-digit",
              month: "short",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
              second: "2-digit",
              hour12: true,
            });
            // Example:
            // 15 May 2026, 02:35:48 PM
          },

          // Tooltip label = Parameter Name + Value
          label: function (context) {
            return `${props.Label}: ${context.raw}`;
          },
        },
      },
    },






  };

  useEffect(() => {
    if (!props.liveData || props.liveData.length === 0) return;

    const datasets = props.liveData.map((item) =>
      Number(item[props.mykey] || 0)
    );

    // Labels shown on chart
    const labels = props.liveData.map((item) => {
      const date = new Date(item.createdAt || item.time);

      return date.toLocaleTimeString("en-IN", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
      });
    });

    // Save original timestamps for tooltip title
    const rawDates = props.liveData.map(
      (item) => item.createdAt || item.time
    );

    setChartData({
      labels,
      datasets,
      rawDates,
    });
  }, [props.liveData, props.mykey]);

  return (
    <div
      style={{
        backgroundColor: props.bg,
        position: "relative",
        height: "340px",
         border: "1.5px solid rgba(0,0,0,0.15)",
    boxShadow: "0 3px 8px rgba(0,0,0,0.12)",
    borderRadius: "8px",
        background: "#fff",
        padding: "10px",
        width: "100%",
        maxWidth: "360px",
        boxSizing: "border-box",
      }}
    >
      {/* Header */}
      <div style={{ height: "80px", position: "relative" }}>
        <Image
          src={props.image}
          alt=""
          width={40}
          height={40}
          style={{ position: "absolute", top: "8px", right: "12px" }}
        />

        <div style={{ position: "absolute", top: "60px", left: "10px" }}>
          <button
            onClick={userDispatch}
            style={{
              backgroundColor: "#066b14",
              width: "30px",
              height: "30px",
              border: "none",
              clipPath: "polygon(0 0, 0 100%, 100% 50%)",
              boxShadow: "0 4px #024d0e, 0 6px 20px rgba(0, 0, 0, 0.19)",
              color: "white",
              fontSize: "16px",
              cursor: "pointer",
            }}
          ></button>
        </div>

        <div
          style={{
            fontSize: "20px",
            fontWeight: "600",
            color: "#2f8b0b",
            fontFamily: "Roboto, sans-serif",
            position: "absolute",
            top: "4px",
            left: "50%",
            transform: "translateX(-50%)",
          }}
        >
          {props.Label}
        </div>

        <div
          style={{
            fontSize: "38px",
            color: "#096d12",
            fontFamily: "Futura, sans-serif",
            position: "absolute",
            top: "30px",
            left: "50%",
            transform: "translateX(-50%)",
          }}
        >
          {props.liveData?.at(-1)?.[props.mykey] || "--"}
        </div>

        <div
          style={{
            fontSize: "14px",
            fontWeight: "500",
            color: "#2da733",
            position: "absolute",
            top: "4px",
            left: "10px",
          }}
        >
          Average
        </div>

        <div
          style={{
            fontSize: "16px",
            fontWeight: "600",
            backgroundColor: "#2da733",
            color: "white",
            padding: "4px 10px",
            borderRadius: "8px",
            position: "absolute",
            top: "25px",
            left: "10px",
          }}
        >
          {isNaN(props.liveAverages) ? 0 : props.liveAverages}
        </div>

        <div
          style={{
            position: "absolute",
            fontSize: "20px",
            fontWeight: "bold",
            color: "#08642b",
            top: "50px",
            right: "12px",
          }}
        >
          {props.unit}
        </div>
      </div>



  {/* X-axis title */}
  <div
    style={{
      position: "absolute",
      bottom: "19px",
      left: "50%",
      transform: "translateX(-50%)",
      whiteSpace: "nowrap",
      zIndex: 10,
    fontSize: "12px",
fontWeight: "bold",
    }}
  >
    {startOfDay.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "2-digit",
    })}&nbsp;&nbsp;&nbsp;
    Time in hh:mm AM/PM
  </div>


      {/* Pie Chart */}
      <div
        style={{
        
          marginTop: "0px",
          padding: "5px",
          backgroundColor: "#fff",
          
          height: "220px",
          width: "100%",
          
          display: "flex",
          justifyContent: "center",
          alignItems: "center",

        }}
      >
        <Pie data={data} options={options} />
      </div>
    </div>
  );
};

export default PieChart;