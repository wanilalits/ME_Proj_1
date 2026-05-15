import { useState, useEffect } from "react";
import DateTimePicker from "react-datetime-picker";
import { FaCalendarAlt } from "react-icons/fa";
//import DateTimePicker from "react-datetime-picker";
 import "react-datetime-picker/dist/DateTimePicker.css";
import "react-calendar/dist/Calendar.css";
import "react-clock/dist/Clock.css"; 

const ExcelReportData = {
  "21 Days Cycle": 21,
  "30 Days Cycle": 30,
  "Custom": 0,
};

const DropdownWithDateTime = () => {
const [open, setOpen] = useState(false);
const [show, setShow] = useState(false);
const [loading, setLoading] = useState(false);
const [selectedLabel, setSelectedLabel] = useState( Object.keys(ExcelReportData)[0] );
const [selectedValue, setSelectedValue] = useState(ExcelReportData[selectedLabel] );

  const [dateTime, setDateTime] = useState(new Date());

  const handleSelect = (label) => {
    
    setSelectedLabel(label);
    setSelectedValue(ExcelReportData[label]);
    setOpen(false);
  };

const getBackDate = () => {
  if (selectedValue===0)
  {setShow(true)
    return  
  }
  const newDate = new Date(dateTime);
  newDate.setDate(newDate.getDate() - selectedValue);
  setShow(false)
  return newDate;
};

useEffect(() => {
  // console.log(dateTime)
 //console.log(selectedValue)
 const backDate = getBackDate(dateTime, selectedValue);
 //console.log(getBackDate())

  }, [selectedValue]); // 👈 dependency array



  return (
    <div
      style={{
        backgroundColor: "white",
        height: "340px",
        border: "3px solid #000",
        borderRadius: "16px",
        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.05)",
        width: "100%",
        maxWidth: "360px",
      }}
    >
      {/* ⏱ Date Time Picker */}
      <div style={{ marginTop: "20px", marginLeft:"20px", marginBottom:"10px" }}>
        <DateTimePicker
          onChange={setDateTime}
          value={dateTime}
          clearIcon={null}
          calendarIcon={<FaCalendarAlt color="green" />}
            format="dd/MM/yyyy hh:mm a"
              disableClock={true}
              //minDate={nstartDate}
        />
      </div>
   {/* 🔽 Dropdown */}
<div style={{ position: "relative", width: "85%", marginTop: "0px", marginLeft:"20px", marginBottom:"15px" }}>
        <div
          onClick={() => setOpen(!open)}
          style={{
            height: "40px",
            border: "1px solid #ccc",
            borderRadius: "8px",
            padding: "8px 35px 8px 10px",
            display: "flex",
            alignItems: "center",
            cursor: "pointer",
            background: "#fff",
          }}
        >

          {selectedLabel}

          <span
            style={{
              position: "absolute",
              right: "18px",
              transform: open ? "rotate(180deg)" : "rotate(0deg)",
            }}
          >
            ▼
          </span>
        </div>

        {open && (
          <div
            style={{
              position: "absolute",
              top: "45px",
              width: "100%",
              background: "#fff",
              border: "1px solid #ccc",
              borderRadius: "8px",
              boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
              zIndex: 10,
            }}
          >
            {Object.keys(ExcelReportData).map((label, i) => (
              <div
                key={i}
                onClick={() => handleSelect(label)}
                style={{
                  padding: "10px",
                  cursor: "pointer",
                }}
                onMouseEnter={(e) =>
                  (e.target.style.background = "#f5f5f5")
                }
                onMouseLeave={(e) =>
                  (e.target.style.background = "#fff")
                }
              >
                {label}
              </div>
            ))}
          </div>
        )}
      </div>

   {/* ⏱ Date Time Picker */}
     { show && (
      <div style={{ marginTop: "0px", marginLeft:"20px", marginBottom:"10px" }}>
        <DateTimePicker
          onChange={setDateTime}
           value={new Date(dateTime.getTime() - 24 * 60 * 60 * 1000)} // 1 day back
          clearIcon={null}
           calendarIcon={<FaCalendarAlt color="red" />}
            format="dd/MM/yyyy hh:mm a"
              disableClock={true}
              //minDate={nstartDate}
        />
      </div>
)}

 <button
          style={{
            backgroundColor: "#1BA94C",
            color: "white",
            border: "none",
            padding: "7px 20px",
            borderRadius: "5px",
            fontWeight: "bold",
            cursor: "pointer",
            marginLeft:"20px"
          }}>
 {loading ? "Generating..." : "Generate Report"}
        </button>

{/* <br>/
 
    
        Selected Cycle:---
        {selectedLabel}

      <br/>
        {selectedValue} 

       Date & Time:----
         {dateTime ? dateTime.toLocaleString() : "Not selected"}  */}
    

      {/* 🔥 CSS FIX */}
      <style>
        {`
        .react-datetime-picker {
          width: 90% !important;
        }

        .react-datetime-picker__wrapper {
          width: 100% !important;
          display: flex;
          justify-content: space-between;
          border-radius: 8px;
          border: 1px solid #ccc;
          padding: 6px 10px;
          box-sizing: border-box;
        }

        .react-datetime-picker__inputGroup {
          flex-grow: 1;
          min-height: 28px;
          display: flex;
          align-items: center;
        }

        .react-calendar {
          width: 280px !important;
          max-width: 150%;
          font-size: 12px;
          border-radius: 10px;
        }

        .react-clock {
          width: 200px !important;
          height: 200px !important;
        }

        .react-datetime-picker__calendar {
  position: absolute !important;
  top: 110% !important;   /* 👇 move DOWN */
  left: 10px !important; /* 👈 move LEFT */
  z-index: 20;
}
        .react-datetime-picker__clock {
          z-index: 20;
        }
        `}
      </style>
    </div>
  );
};

export default DropdownWithDateTime;