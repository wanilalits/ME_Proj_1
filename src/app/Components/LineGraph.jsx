"use client";

import React, { useState, useEffect, useMemo } from "react";
import { Line } from "react-chartjs-2";
import Image from "next/image";

import {
  Chart as ChartJS,
  LineElement,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
  Filler,
  TimeScale,
} from "chart.js";

import "chartjs-adapter-date-fns";

import { updateUser } from "../redux/slice";
import { useDispatch, useSelector } from "react-redux";

ChartJS.register(
  LineElement,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
  Filler,
  TimeScale
);

const LineGraph = (props) => {
  const dispatch = useDispatch();
  const reduxData = useSelector((state) => state.userData.users);

  // =========================
  // REDUX GRAPH CHANGE
  // =========================
  const userDispatch = () => {
    var id = props.id;
    var name = reduxData?.[0]?.name || {};

    name = {
      ...name,
      [props.mykey]: "bar",
    };

    var nameArr = [{ id, name }];

    dispatch(updateUser([props.id, nameArr]));
  };

  // =========================
  // CHART DATA STATE
  // =========================
  const [chartData, setChartData] = useState([]);

  // =========================
  // CREATE DATASET
  // =========================
  useEffect(() => {
    if (!props.liveData || props.liveData.length === 0) {
      setChartData([]);
      return;
    }

    const formattedData = props.liveData
      .filter((item) => item)
      .map((item) => ({
        x: new Date(item.createdAt || item.time),
        y: Number(item?.[props.mykey] || 0),
      }))
      .filter(
        (item) =>
          item.x instanceof Date &&
          !isNaN(item.x.getTime()) &&
          !isNaN(item.y)
      );

    setChartData(formattedData);
  }, [props.liveData, props.mykey]);

  // =========================
  // FIXED X AXIS DATE RANGE
  // =========================
  const { startOfDay, endOfDay } = useMemo(() => {
    // DEFAULT TODAY
    let start = new Date();
    let end = new Date();

    // IMPORTANT FIX
    // take first graph point date
    if (chartData.length > 0 && chartData[0]?.x) {
      start = new Date(chartData[0].x);
      end = new Date(chartData[0].x);
    }

    // START OF DAY
    start.setHours(0, 0, 0, 0);

    // END OF DAY
    end.setHours(23, 59, 59, 999);

    return {
      startOfDay: start,
      endOfDay: end,
    };
  }, [chartData]);

  // =========================
  // CHART.JS DATA
  // =========================
  const data = {
    datasets: [
      {
        label: props.Label,

        // IMPORTANT FIX
        data: chartData,

        fill: true,
        tension: 0.3,

        borderColor: "rgb(115, 194, 51)",
        backgroundColor: "rgba(115, 194, 51, 0.2)",

        pointRadius: 2,
        pointHoverRadius: 5,
        borderWidth: 1.5,
      },
    ],
  };

  // =========================
  // CHART OPTIONS
  // =========================
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    animation: false,

    plugins: {
      legend: {
        display: false,
      },

      tooltip: {
        intersect: false,
        mode: "index",
      },
    },

    interaction: {
      intersect: false,
      mode: "nearest",
    },

    scales: {
      x: {
        type: "time",

        // IMPORTANT FIX
        min: startOfDay.getTime(),
        max: endOfDay.getTime(),

        time: {
          unit: "minute",

          displayFormats: {
            second: "hh:mm:ss a",
            minute: "hh:mm a",
            hour: "hh:mm a",
            day: "dd MMM",
          },

          tooltipFormat: "dd-MMM-yyyy hh:mm:ss a",
        },

        ticks: {
          autoSkip: true,
          maxTicksLimit: 12,
          maxRotation: 45,
          minRotation: 45,
          color: "black",
          weight: "normal",
        
        },

        grid: {
          color: "rgba(0,0,0,0.08)",
        },

        title: {
          display: true,
          text:
            startOfDay.toLocaleDateString("en-GB", {
              day: "2-digit",
              month: "2-digit",
              year: "2-digit",
            }) + "   Time",

          color: "black",

           font: {
            size: 12,
            weight: "bold",
          },
        },
      },

      y: {
        beginAtZero: true,

        ticks: {
          color: "black",
        },

        grid: {
          color: "rgba(0,0,0,0.08)",
        },

        title: {
          display: true,
          text: String(props.unit || ""),
          color: "black",
          font: {
            size: 14,
            weight: "bold",
          },
        },
      },
    },
  };


  return (
    <div
      style={{
        backgroundColor: props.bg,

        position: "relative",

        height: "340px",

        border: "1.5px solid rgba(0,0,0,0.15)",

        boxShadow: "0 3px 8px rgba(0,0,0,0.12)",

        borderRadius: "8px",

        padding: "10px",

        width: "100%",

        maxWidth: "360px",

        boxSizing: "border-box",
      }}
    >
      {/* ================= HEADER ================= */}
      <div
        style={{
          height: "80px",
          position: "relative",
        }}
      >
        <Image
          src={props.image}
          alt=""
          width={40}
          height={40}
          style={{
            position: "absolute",
            top: "8px",
            right: "12px",
          }}
        />

        {/* GRAPH SWITCH BUTTON */}
        <div
          style={{
            position: "absolute",
            top: "60px",
            left: "10px",
          }}
        >
          <button
            onClick={userDispatch}
            style={{
              backgroundColor: "#066b14",

              width: "30px",
              height: "30px",

              border: "none",

              clipPath: "polygon(0 0, 0 100%, 100% 50%)",

              boxShadow:
                "0 4px #024d0e, 0 6px 20px rgba(0, 0, 0, 0.19)",

              color: "white",

              fontSize: "16px",

              cursor: "pointer",
            }}
          ></button>
        </div>

        {/* TITLE */}
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

        {/* LIVE VALUE */}
        <div
          style={{
            fontSize: "38px",

            color: "#096d12",

            fontFamily: "Futura, sans-serif",

            position: "absolute",

            top: "30px",

            left: "50%",

            transform: "translateX(-50%)",

            animation: "blink 1.2s infinite",
          }}
        >
          {props.liveData?.at(-1)?.[props.mykey] ?? "--"}
        </div>

        {/* AVG TITLE */}
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

        {/* AVG VALUE */}
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
          {isNaN(props.liveAverages)
            ? 0
            : props.liveAverages}
        </div>

        {/* UNIT */}
        <div
          style={{
            position: "absolute",

            fontSize: "20px",

            fontWeight: "bold",

            color: "#08642b",

            top: "45px",

            right: "12px",
          }}
        >
          {props.unit}
        </div>
      </div>

      {/* ================= CHART ================= */}
      <div
        style={{
          marginTop: "0px",

          padding: "5px",

          height: "220px",

          width: "100%",

          boxSizing: "border-box",
        }}
      >
        <Line
          data={data}
          options={options}
        />
      </div>
    </div>
  );
};

export default LineGraph;