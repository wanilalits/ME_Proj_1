import React from "react";
import { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import { FaCalendarAlt } from "react-icons/fa";
import "react-datepicker/dist/react-datepicker.css";
import { saveAs } from "file-saver";
import * as XLSX from "xlsx";
const ExcelReportData = {
  "21 Days Cycle": 21,
  "30 Days Cycle": 30,
  Custom: 1,
};

function Header(props) {
  let datetimepicker1 = false;
  const [datetimepicker2, setDatetimepicker2] = useState(true);
  const [open, setOpen] = useState(false);
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedLabel, setSelectedLabel] = useState(
    Object.keys(ExcelReportData)[0],
  );
  const [selectedValue, setSelectedValue] = useState(
    ExcelReportData[selectedLabel],
  );
  const [dateTime, setDateTime] = useState(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0); // Set time to 00:00:00.000
    return d;
  });

  const [dateTime2, setDateTime2] = useState(new Date());

  const handleSelect = (label) => {
    // console.log(label);
    console.log(ExcelReportData[label]);
    setSelectedLabel(label);
    setSelectedValue(ExcelReportData[label]);
    setDateTime2(
      new Date(
        dateTime.getTime() +
          Number(ExcelReportData[label]) * 24 * 60 * 60 * 1000,
      ),
    );

    if (ExcelReportData[label] === 1) {
      setDatetimepicker2(false); // enable picker
    } else {
      setDatetimepicker2(true); // disable picker
    }
    setOpen(false);
  };

  const fetchDataAndCreateExcel = async () => {
    setLoading(true);
    let a = dateTime; //Start Day
    let b = dateTime2; //End Date
    a = new Date(a.getTime() - 5.5 * 60 * 60 * 1000);
    b = new Date(b.getTime() - 5.5 * 60 * 60 * 1000);
    try {
      const res = await fetch(
        `${window.location.origin}/api/users/sensorslog?purp=filterbydate&s=${a}&e=${b}&deviceid=${props.deviceid}`,
      );
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
      worksheet["!cols"] = [
        { wch: 8.25 },
        { wch: 13.25 },
        { wch: 17.88 },
        { wch: 5 },
        { wch: 10.25 },
        { wch: 16.88 },
        { wch: 15.38 },
        { wch: 11.5 },
        { wch: 18.25 },
      ];

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

   useEffect(() => {
if (dateTime>dateTime2)
{setDateTime2(new Date())}

  }, [dateTime2]); // 👈 dependency array
 
  return (
    <div
      style={{
        fontSize: "14px",

        width: "100%",
        maxWidth: "250px",
      }}
    >
      <div
        style={{
          marginBottom: "5px",
        }}
      >
        <DatePicker
          onChange={setDateTime}
          selected={dateTime}
          format="dd/MM/yyyy hh:mm a"
          showTimeInput
          timeIntervals={1}
          timeFormat="hh:mm aa"
        dateFormat="dd/MM/yyyy hh:mm:ss aa"
          readOnly={false}
        />
      </div>
      
      {/* ⏱ Date Time Picker */}

      <div
        style={{
          marginTop: "0px",
          marginLeft: "0px",
          marginBottom: "0px",
        }}
      >
        <DatePicker
          onChange={setDateTime2}
          selected={dateTime2 }
          readOnly={false}
                showTimeInput
          timeIntervals={5}
          timeFormat="hh:mm aa"
          dateFormat="dd/MM/yyyy hh:mm:ss aa"
    
        />
      </div>
<span
  style={{
    fontSize: "12px",
    color: "#666",
    fontWeight: "normal",
  }}
>
  {(() => {
    const diffMs = Math.abs(dateTime2 - dateTime);

    let totalMinutes = Math.floor(diffMs / (1000 * 60));

    const minutesInYear = 365 * 24 * 60;
    const minutesInDay = 24 * 60;
    const minutesInHour = 60;

    const years = Math.floor(totalMinutes / minutesInYear);
    totalMinutes %= minutesInYear;

    const days = Math.floor(totalMinutes / minutesInDay);
    totalMinutes %= minutesInDay;

    const hours = Math.floor(totalMinutes / minutesInHour);
    const minutes = totalMinutes % minutesInHour;

    const parts = [];

    if (years > 0) {
      parts.push(`${years} ${years === 1 ? "year" : "years"}`);
    }

    if (days > 0) {
      parts.push(`${days} ${days === 1 ? "day" : "days"}`);
    }

    if (hours > 0) {
      parts.push(`${hours} ${hours === 1 ? "hour" : "hours"}`);
    }

    if (minutes > 0 || parts.length === 0) {
      parts.push(`${minutes} ${minutes === 1 ? "minute" : "minutes"}`);
    }

    // Example outputs:
    // "5 minutes"
    // "3 hours 12 minutes"
    // "8 days 4 hours"
    // "1 year 5 days 26 minutes"

    return parts.join(" ");
  })()}
</span>



<div
  style={{
    display: "flex",
    alignItems: "center",
    gap: "5px", // space between buttons
    flexWrap: "nowrap", // keep both buttons on the same line
   width : "100%",
  
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
          width : "100%"
        }}
        onClick={() => {
          fetchDataAndCreateExcel();
        }}
      >
        {loading ? "Downloading..." : "Download custom Report"}
      </button>



      </div>
  
    </div>
  );
}

export default Header;
