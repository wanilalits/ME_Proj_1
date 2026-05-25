import React from "react";
import { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import { FaCalendarAlt } from "react-icons/fa";
import "react-datepicker/dist/react-datepicker.css";
import { saveAs } from "file-saver";
import * as XLSX from "xlsx";
import CyclePopup from "./CyclePopup";

const ExcelReportData = {
  Custom: 1,
  "21 Days Cycle": 21,
  "30 Days Cycle": 30,
};

function Header(props) {
  let datetimepicker1 = false;
  const [showPopup, setShowPopup] = useState(false);
  const [tileControl, setTileControl] = useState({
    buttonText: "Add Cycle",
    bagroundColour: "white",
    loadDBData: false,
    cycleStatus: null,
    cycleDaysremain:null
  });
  const [loading, setLoading] = useState(false);
  const [dateTime, setDateTime] = useState(null);
  const [dateTime2, setDateTime2] = useState(null);

  const fetchDataAndCreateExcel = async () => {
    setLoading(true);
    let a = dateTime; //Start Day
    let b = dateTime2; //End Date
    a = new Date(a.getTime() - 5.5 * 60 * 60 * 1000);
    b = new Date(b.getTime() - 5.5 * 60 * 60 * 1000);
    try {
      const res = await fetch(`${window.location.origin}/api/users/sensorslog?purp=filterbydate&s=${a}&e=${b}&deviceid=${props.deviceid}`);
      const exceldata = await res.json();

      // ✅ Step 1: Modify Data
      const modifiedData = exceldata.map((item, index) => {
        const utc = new Date(item.createdAt);

        // Convert UTC → IST (+5:30)
        const ist = new Date(utc.getTime() + 0);
        const time12hr =
          ist.toLocaleDateString("en-GB") +
          " " +
          ist.toLocaleTimeString("en-IN", {
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
            hour12: true,
          });

        return {
          "🔢 Sr.No": index + 1,
          "💧 Humidity (%)": item.Humidity,
          "🌡️ Temperature (°C)": item.Temperature,
          "⚗️ pH": item.Ph,
          "🧪 H2S (ppm)": item.H2s,
          "🌫️ Ammonia (ppm)": item.Ammonia,
          "🔥 Methane (ppm)": item.Methane,
          "🌍 CO2 (ppm)": item.Co2,
          "⏰ Time(IST)": time12hr.toLocaleString(),
        };
      });

      // ✅ Step 2: Create Sheet
      const worksheet = XLSX.utils.json_to_sheet(modifiedData);

      // ✅ Step 3: Try to make header bold (may not work in free version)
      const range = XLSX.utils.decode_range(worksheet["!ref"]);

      for (let col = range.s.c; col <= range.e.c; col++) {
        const cellAddress = XLSX.utils.encode_cell({ r: 0, c: col });

        if (worksheet[cellAddress]) {
          worksheet[cellAddress].s = {
            font: { bold: true },
          };
        }
      }

      // ✅ Step 4: Column widths (improves look)
      worksheet["!cols"] = [{ wch: 8.25 }, { wch: 13.25 }, { wch: 17.88 }, { wch: 5 }, { wch: 10.25 }, { wch: 16.88 }, { wch: 15.38 }, { wch: 11.5 }, { wch: 18.25 }];

      // ✅ Step 5: Workbook
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Sensor_Data");

      // ✅ Step 6: Export
      const excelBuffer = XLSX.write(workbook, {
        bookType: "xlsx",
        type: "array",
      });

      const blob = new Blob([excelBuffer], {
        type: "application/octet-stream",
      });

      saveAs(blob, "Sensors_Data_" + props.deviceid + ".xlsx");
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCycleData = async () => {
    try {
      const res = await fetch(`/api/users/cycles?deviceid=${encodeURIComponent(props.deviceid)}`);
      const result = await res.json();
      //   console.log(result);
      if (result.data) {
        setDateTime(new Date(result.data.Startdate));
        setDateTime2(new Date(result.data.enddate));
        props.setCycleEndDate(new Date(result.data.enddate));
        setTileControl((prev) => ({ ...prev, bagroundColour: "#B6EAC8", loadDBData: true, buttonText: "Edit Cycle" }));

        // ✅ Check endDate status (past, current, or future)
        const endDate = new Date(result.data.enddate);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        endDate.setHours(0, 0, 0, 0);
        
        const timeDiff = endDate - today;
        const daysDiff = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
    
        if (daysDiff < 0) {
          //console.log(`📅 PAST DATE: ${Math.abs(daysDiff)} days ago`);
           setTileControl((prev) => ({ ...prev, cycleStatus: "Before cycle is completed", cycleDaysremain:Math.abs(daysDiff)}));
         props.setCycleStatus(true)

          } else if (daysDiff === 0) {
         // console.log(`📅 CURRENT DATE: Today`);
           setTileControl((prev) => ({ ...prev, cycleStatus: "Cycle is compleating Today", cycleDaysremain:(null)}));
       props.setCycleStatus(false)
          } else {
          //console.log(`📅 FUTURE DATE: ${daysDiff} days in future`);
           setTileControl((prev) => ({ ...prev, cycleStatus: "Remain to complete Cycle", cycleDaysremain:Math.abs(daysDiff)}));
        props.setCycleStatus(false)
          }
        props.setCycleEnd(new Date(result.data.enddate));
      

      }
      if (!res.ok) {
        //throw new Error(result.message || "Failed to fetch data");
props.setCycleEndDate(null);
        setTileControl((prev) => ({
          ...prev,
          bagroundColour: "white",
          loadDBData: false,
          buttonText: "Add Cycle",
        }));
        setDateTime(null);
        setDateTime2(null);

        return;
      }

      //   setCycleData(result.data);
    } catch (err) {
      console.error(err);
    } finally {
    }
  };

  useEffect(() => {
      fetchCycleData();
  }, [props.deviceid]);

  return (
    <div
      style={{
        border: "1.5px solid rgba(0,0,0,0.15)",
        boxShadow: "0 3px 8px rgba(0,0,0,0.12)",
        borderRadius: "8px",
        padingTop: "10px",
        paddingBottom: "10px",
        paddingLeft: "10px",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          marginBottom: "0px",
          gap: "8px",
        }}
      >
        {/* ⏱ Date Time Picker_1 */}
        <div
          style={{
            minWidth: "200px",
            fontSize: "14px",
          }}
        >
          {tileControl.loadDBData === true && tileControl.bagroundColour === "#B6EAC8" ? "Cycle start date:-" : "Start date:-"}
          <br />
          <DatePicker
            onChange={(date) => {
              setDateTime(date);
              setTileControl((prev) => ({ ...prev, bagroundColour: "white" }));
            }}
            placeholderText="__/__/____  __:__:__"
            selected={dateTime}
            format="dd/MM/yyyy hh:mm a"
            showTimeInput
            timeIntervals={1}
            timeFormat="hh:mm aa"
            dateFormat="dd/MM/yyyy hh:mm:ss aa"
            readOnly={false}
            className="green-datepicker"
          />
        </div>

        {/* ⏱ Date Time Picker_2 */}
        <div
          style={{
            minWidth: "200px",
            fontSize: "14px",
          }}
        >
          {tileControl.loadDBData === true && tileControl.bagroundColour === "#B6EAC8"  ? "Cycle end date:-" : "End date:-"}
          <br />
          <DatePicker
            onChange={(date) => {
              setDateTime2(date);
              setTileControl((prev) => ({ ...prev, bagroundColour: "white" }));
            }}
            placeholderText="__/__/____  __:__:__"
            selected={dateTime2}
            readOnly={false}
            showTimeInput
            timeIntervals={5}
            timeFormat="hh:mm aa"
            dateFormat="dd/MM/yyyy hh:mm:ss aa"
            className="green-datepicker"
          />
        </div>
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          marginBottom: "0px",
          gap: "0px",
        }}
      ></div>
      <span
        style={{
          fontSize: "12px",
          color: "#666",
          fontWeight: "normal",
        }}
      >
        {dateTime2 && dateTime && tileControl.cycleDaysremain && tileControl.bagroundColour === "#B6EAC8" ? (
          <>
            {tileControl.cycleDaysremain} day&nbsp;
          </>
        ) : (
          ""
        )}
      </span>

      <span
        style={{
          fontSize: "12px",
          color: "#666",
          fontWeight: "normal",
          cursor: "pointer", // shows hand cursor
        }}
        onClick={() => { fetchCycleData(); }}>
        {tileControl.loadDBData === true && tileControl.bagroundColour === "#B6EAC8" ? (
          <span className="cycle-running">
          {tileControl.cycleStatus}
            <span className="dots"></span>
          </span>) 
          : tileControl.loadDBData === true && tileControl.bagroundColour === "white"? 
          (<> Generate report or ↻ Refresh here to load Cycle Data </>) 
           : tileControl.loadDBData ===false? (
          <>Cycle not found... ↻ Refresh &nbsp;&nbsp;&nbsp;&nbsp; or click to Add Cycle buttom </>) 
          : ( "↻ Refresh")}
      </span>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "5px", // space between buttons
          flexWrap: "nowrap", // keep both buttons on the same line
          width: "100%",
        }}
      >
        <button
          style={{
            backgroundColor: "#1BA94C",
            color: "white",
            border: "none",
            padding: "10px 10px",
            borderRadius: "5px",
            fontWeight: "bold",
            cursor: "pointer",
            width: "auto",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
          onClick={() => {
            fetchDataAndCreateExcel();
          }}
        >
          {loading ? "Generating..." : "Generate Report"}
        </button>

        <button
          style={{
            backgroundColor: "#1BA94C",
            color: "white",
            border: "none",
            padding: "10px 10px",
            borderRadius: "5px",
            fontWeight: "bold",
            cursor: "pointer",
            width: "auto",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
          onClick={() => setShowPopup(true)}
        >
          {tileControl.loadDBData === false ? "Add Cycle" : "Edit Cycle"}
        </button>
      </div>

      <CyclePopup showPopup={showPopup} setShowPopup={setShowPopup} deviceid={props.deviceid} fetchCycleData={fetchCycleData}></CyclePopup>

      <style jsx global>
        {`
          .react-datepicker-wrapper {
            height: "45px";
          }
          .react-datepicker__input-container input {
            height: 40px;
            width: 95%;
            line-height: 20px;
            font-size: 15px;
            box-sizing: border-box;

            border: 1px solid #ccc;
            border-radius: 6px; /* Rounded corners */
            padding-left: 12px;
            padding-right: 0px;
          }

          .react-datepicker__input-container input:focus {
            border-color: #0070f3;
          }

          /* Apply only to DatePicker having className="green-datepicker" */
          .green-datepicker {
            height: 40px;
            line-height: 20px;
            font-size: 15px;
            box-sizing: border-box;

            border: 1px solid #ccc;
            border-radius: 6px; /* Rounded corners */
            background-color: ${tileControl.bagroundColour};
          }

          .green-datepicker:focus {
            border-color: #0070f3;
            outline: none;
          }

          .cycle-running {
            font-weight: bold;
            animation: blinkColor 4s infinite;
          }

          .dots::after {
            content: "";
            animation: dots 4s steps(4, end) infinite;
          }

          @keyframes blinkColor {
            0% {
              color: red;
            }
            50% {
              color: black;
            }
            100% {
              color: red;
            }
          }

          @keyframes dots {
            0% {
              content: ".";
            }
            25% {
              content: "..";
            }
            50% {
              content: "...";
            }
            75% {
              content: "....";
            }
            100% {
              content: ".....";
            }
          }
        `}
      </style>
    </div>
  );
}

export default Header;
