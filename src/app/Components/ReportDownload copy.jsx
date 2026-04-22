import { useState } from "react";
import DateTimePicker from "react-datetime-picker";
const ReportDownload = () => {
  const [nstartDate, setStartDaten] = useState(new Date());
  const [nendDate, setEndDaten] = useState(new Date());
  const [loading, setLoading] = useState(false);
  const [loading1, setLoading1] = useState(false);
  const [device, setDevice] = useState("Device_0"); // default value
  const [devicenickname, setDevicenickname] = useState("Greya Composter"); // default value
  const wasteData = {
  "Wet Waste (Mixed Organic Waste)": 0.2,
  "Food Waste": 8.8,
  "Garden Waste": 1,
};
   const [selectedOption, setSelectedOption] = useState(
    Object.keys(wasteData)[0]
  );
  const [input2, setInput2] = useState("10");
  const [op, setOp] = useState(2);
  const [open, setOpen] = useState(false);
  
  
  // fetch data and create excel
  const fetchDataAndCreateExcel = async () => {
    setLoading(true);
    let a = new Date(nstartDate);
    let b = new Date(nendDate);
    a = new Date(a.getTime() - 5.5 * 60 * 60 * 1000);
    b = new Date(b.getTime() - 5.5 * 60 * 60 * 1000);
    try {
      const res = await fetch(
        window.location.origin +
          "/api/users/sensorslog?purp=filterbydate&s=" +
          a +
          "&e=" +
          b +
          "&deviceid=" +
          device,
      );
      const exceldata = await res.json();
      const worksheet = XLSX.utils.json_to_sheet(exceldata);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Sensor_Data");
      const excelBuffer = XLSX.write(workbook, {
        bookType: "xlsx",
        type: "array",
      });
      const blob = new Blob([excelBuffer], {
        type: "application/octet-stream",
      });
      saveAs(blob, "Sensors_Data.xlsx");
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };
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



 {/* 🔥 Custom Dropdown */}
      <div style={{ position: "relative", width: "90%", marginLeft: "14px", marginTop: "20px" }}>
        
        {/* Selected Box */}
        <div
          onClick={() => setOpen(!open)}
          style={{
            height: "35px",
            border: "1px solid #ccc",
            borderRadius: "8px",
            padding: "8px 35px 8px 10px",
            display: "flex",
            alignItems: "center",
            cursor: "pointer",
            background: "#fff",
          }}
        >
          {selectedOption}

          {/* Arrow */}
          <span
            style={{
              position: "absolute",
              right: "10px",
              transition: "0.2s",
              transform: open ? "rotate(180deg)" : "rotate(0deg)",
            }}
          >
            ▼
          </span>
        </div>

        {/* Dropdown List */}
      {open && (
          <div>
            {Object.keys(wasteData).map((item, i) => (
              <div key={i} onClick={() => handleSelect(item)}>
                {item}
              </div>
            ))}
          </div>
        )}
      </div>






     {/* Dropdown */}
      <div style={{ position: "relative",
              top: "40px",
              width: "100%",
              background: "#fff",
              border: "1px solid #ccc",
              borderRadius: "8px",
              boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
              zIndex: 10,
              overflow: "hidden",
       }}>
        <div onClick={() => setOpen(!open)}>
          {selectedOption} ▼
        </div>

        {open && (
          <div>
            {Object.keys(wasteData).map((item, i) => (
              <div key={i} onClick={() => handleSelect(item)}>
                {item}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Date Pickers and Generate Report */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "30px",
          flexWrap: "wrap",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "15px",
            flexWrap: "wrap",
          }}
        >
          <div
            style={{
              fontSize: "14px",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <label style={{ fontWeight: "bold", marginBottom: "5px" }}>
              Start Date:
            </label>
            <DateTimePicker
              onChange={setStartDaten}
              value={nstartDate}
              format="dd/MM/yyyy hh:mm a"
              disableClock={true}
            />
          </div>
          <div
            style={{
              fontSize: "14px",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <label style={{ fontWeight: "bold", marginBottom: "5px" }}>
              End Date:
            </label>
            <DateTimePicker
              onChange={setEndDaten}
              value={nendDate}
              format="dd/MM/yyyy hh:mm a"
              disableClock={true}
              minDate={nstartDate}
            />
          </div>

          <div style={{ textAlign: "left" }}>⟳ Last Update</div>
        </div>

        <button
          style={{
            backgroundColor: "#1BA94C",
            color: "white",
            border: "none",
            padding: "8px 20px",
            borderRadius: "4px",
            fontWeight: "bold",
            cursor: "pointer",
          }}
          onClick={fetchDataAndCreateExcel}
          disabled={loading}
        >
          {loading ? "Generating..." : "Generate Report"}
        </button>

        {/* Dropdown */}
        <select
          style={{ padding: "3px", marginLeft: "5px" }}
          value={device} // 👈 bind state here
          onChange={(e) => {
            setDevice(e.target.value);
            setDevicenickname(e.target.options[e.target.selectedIndex].text);
          }} // 👈 update state
        >
          <option value="Device_0">Greya Composter</option>
          <option value="Device_1">PIT 1</option>
          <option value="Device_2">PIT 2</option>
          <option value="Device_3">PIT 3</option>
          <option value="Device_4">PIT 4</option>
          <option value="Device_5">PIT 5</option>
          <option value="Device_6">PIT 6</option>
        </select>
        {/* {device} */}

        <text style={{ color: "black", fontWeight: "bold" }}>
          {devicenickname}
        </text>
      </div>
    </div>
  );
};

export default ReportDownload;
