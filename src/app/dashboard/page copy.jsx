"use client";
import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { saveAs } from "file-saver";
import * as XLSX from "xlsx";
import humidity from "../../../public/Image/humidity.png";
import temperature from "../../../public/Image/temperature.png";
import ph from "../../../public/Image/ph.png";
import H2S from "../../../public/Image/H2S.png";
import CO2 from "../../../public/Image/CO2.png";
import NH3 from "../../../public/Image/NH3.png";
import CH4 from "../../../public/Image/CH4.png";

import LineGraph from "../Components/LineGraph";
import PiChart from "../Components/PiChart";
import HeaderBanner from "../Components/HeaderBanner";
import BarGraph from "../Components/BarGraph";
import Header_1 from "../Components/Header_1";
import { useDispatch, useSelector } from "react-redux";
import { addUser } from "../redux/slice";
import Tile from "../Components/Tile";
import ReportDownload from "../Components/ReportDownload";
function page() {
  const [graphselect, SetGraphselect] = useState({
    Humidity: "line",
    Temperature: "bar",
    Ph: "pi",
    H2s: "line",
    Ammonia: "line",
    Methane: "line",
    Co2: "bar",
  });
  const [loading, setLoading] = useState(false);
  const [Graphdata, setGraphData] = useState([]);;
  const [liveAverages, setLiveAverages] = useState({});
  const [device, setDevice] = useState("Device_0"); // default value
  const [devicenickname, setDevicenickname] = useState("Greya Composter"); // default value
  const [highlight, setHighlight] = useState(false);
  const [rtkid, setRtkid] = useState(null);
  const [curredate, setCurredate] = useState(null);
  const [CycleEnd, setCycleEnd]=useState(null)
   const [cycleStatus, setCycleStatus]=useState(null)

  const params = useParams();
  const dispatch = useDispatch();
  const router = useRouter();
  const reduxData = useSelector((state) => state.userData.users);
  let key; //graph update due to this change


   const getFirstGraphdata = async () => {
  try {
    let s;
    let e;
    // IF inactive3
    if (cycleStatus === true) {
      console.log("come here..........");
   
//this block from here is not running
      // Convert CycleDate to Date object
      const baseDate = new Date(CycleEnd);
   console.log("End here..........");
      // Start = 12:00:01 AM
      const inactiveStart = new Date(baseDate);
      inactiveStart.setHours(0, 0, 1, 0);

      // End = 11:59:59 PM
      const inactiveEnd = new Date(baseDate);
      inactiveEnd.setHours(23, 59, 59, 999);

      s = inactiveStart.toISOString();
      e = inactiveEnd.toISOString();

     console.log("Inactive Start:", s);
      console.log("Inactive End:", e);
       console.log("End here..........");
    }
else
{
 // DEFAULT CASE
    const now = new Date();

    // Start = today 12:00:01 AM
    const startDate = new Date();
    startDate.setHours(0, 0, 1, 0);

    // End = current time + 30 min
    const endDate = new Date(now.getTime() + 30 * 60 * 1000);

    s = startDate.toISOString();
    e = endDate.toISOString();

    //console.log("Default Start:", s);
    //console.log("Default End:", e);
}

console.log(s, e)
    const res = await fetch(
      `${window.location.origin}/api/users/sensorslog?purp=filterbydate&deviceid=${device}&s=${s}&e=${e}`);
    const updated = await res.json();
console.log (updated)
    setGraphData(updated);
      const averages = {
        Ammonia: Number((updated.map((item) => Number(item.Ammonia || 0)).reduce((a, b) => a + b, 0) / updated.length).toFixed(2)),
        Co2: Number((updated.map((item) => Number(item.Co2 || 0)).reduce((a, b) => a + b, 0) / updated.length).toFixed(2)),
        H2s: Number((updated.map((item) => Number(item.H2s || 0)).reduce((a, b) => a + b, 0) / updated.length).toFixed(2)),
        Humidity: Number((updated.map((item) => Number(item.Humidity || 0)).reduce((a, b) => a + b, 0) / updated.length).toFixed(2)),
        Methane: Number((updated.map((item) => Number(item.Methane || 0)).reduce((a, b) => a + b, 0) / updated.length).toFixed(2)),
        Ph: Number((updated.map((item) => Number(item.Ph || 0)).reduce((a, b) => a + b, 0) / updated.length).toFixed(2)),
        Temperature: Number((updated.map((item) => Number(item.Temperature || 0)).reduce((a, b) => a + b, 0) / updated.length).toFixed(2)),
      };
      //console.log("Averages calculated:", averages);
      setLiveAverages((prev) => ({ ...prev, ...averages }));
    } catch (error) {}
  };

  // 🔹 Arrow function to get last new data
  const getdata = async () => {
    if (Graphdata && Graphdata.length === 0) {
      getFirstGraphdata();
      return;
    }

    try {
      const response = await fetch(window.location.origin + "/api/users/sensorslog?purp=1&deviceid=" + device);
      const result = await response.json();
     
      setGraphData((prev) => {
        if (result?.length > 0 && result[0]._id?.toString() !== prev?.at(-1)?._id?.toString()) {
          const updated = [...prev, result[0]];
          
          const averages = {
            Ammonia: Number((updated.map((item) => Number(item.Ammonia || 0)).reduce((a, b) => a + b, 0) / updated.length).toFixed(2)),
            Co2: Number((updated.map((item) => Number(item.Co2 || 0)).reduce((a, b) => a + b, 0) / updated.length).toFixed(2)),
            H2s: Number((updated.map((item) => Number(item.H2s || 0)).reduce((a, b) => a + b, 0) / updated.length).toFixed(2)),
            Humidity: Number((updated.map((item) => Number(item.Humidity || 0)).reduce((a, b) => a + b, 0) / updated.length).toFixed(2)),
            Methane: Number((updated.map((item) => Number(item.Methane || 0)).reduce((a, b) => a + b, 0) / updated.length).toFixed(2)),
            Ph: Number((updated.map((item) => Number(item.Ph || 0)).reduce((a, b) => a + b, 0) / updated.length).toFixed(2)),
            Temperature: Number((updated.map((item) => Number(item.Temperature || 0)).reduce((a, b) => a + b, 0) / updated.length).toFixed(2)),
          };
          //console.log("Averages calculated:", averages);
          setLiveAverages((prev) => ({ ...prev, ...averages }));
          return updated;
        }

        return prev;
      });
    } catch (error) {
      //   console.error(error);
    }
  };

  //Log Off
  const onLogoff = () => {
    setLoading(true);
    try {
      fetch(window.location.origin + "/api/users/logoff")
        .then((response) => response.json())
        .then(() => router.push("./login"))
        .catch((error) => {});
    } catch {
      setLoading(false);
    }
  };
  // setThemeColor is a function that sets the theme color of the browser based on the cycle status (active/idle) to give a visual indication of data refresh cycle along with the title change done in runCycle function
  const setThemeColor = (color) => {
    let meta = document.querySelector("meta[name='theme-color']");

    if (!meta) {
      meta = document.createElement("meta");
      meta.name = "theme-color";
      document.head.appendChild(meta);
    }

    meta.setAttribute("content", color);
  };
  //runCycle is a color and title animation that runs for 5 sec (green) and then turns to gray for 25 sec, repeating every 30 sec to indicate data refresh cycle
  const runCycle = () => {
    // 🟢 Active state (5 sec)
    document.title = "🟢 Greya Smart Composter";
    setThemeColor("#8de38a"); // green

    setTimeout(() => {
      // ⚪ Idle/faint state (remaining 25 sec)
      document.title = "⚪ Greya Smart Composter";
      setThemeColor("#318035"); // gray
    }, 2000);
  };

  useEffect(() => {
   
 console.log("-------------"+new Date(CycleEnd).toISOString())
   console.log("........."+cycleStatus)
  }, [CycleEnd, cycleStatus]);

  

  useEffect(() => {
  
  if (cycleStatus == null) return;

  console.log("cycleStatus changed:", cycleStatus);
    runCycle(); //blinking animation cycle
      getFirstGraphdata();
      setCurredate(new Date()); // Set current date and time on component mount

      const intervalId = setInterval(() => {
     
        getdata();
        setCurredate(new Date()); // Set current date and time on component mount
        runCycle(); // repeat cycle every 30 sec
      }, 30000);
      return () => clearInterval(intervalId); // ✅ cleanup old interval

  }, [device, cycleStatus]);

//cycleStatus set by child component



  useEffect(() => {
    if (!curredate) return;

    setHighlight(true); // turn ON highlight

    const timer = setTimeout(() => {
      setHighlight(false); // turn OFF after 2 sec
    }, 1000);

    return () => clearTimeout(timer);
  }, [curredate]);

 

  useEffect(() => {
    dispatch(addUser([graphselect]));
  }, []);

  useEffect(() => {
    if (reduxData.length > 0) {
      setRtkid(reduxData[0].id);
      SetGraphselect(reduxData[0].name);
    }
    // console.log("reduxData in useEffect:", reduxData);
  }, [reduxData]);
  return (
    <>
      <div
        style={{
          fontFamily: "Arial, sans-serif",
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "10px",
          boxSizing: "border-box",
          
        }}
      >
        <HeaderBanner />

        {/* Date Pickers and Generate Report */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            marginBottom: "10px",
            flexWrap: "wrap",
             border: "1px solid rgba(0,0,0,0.15)",
    boxShadow: "0 2px 8px rgba(0,0,0,0.12)",
    borderRadius: "8px",
    padding: "10px",
    gap: "15px",
          }}
        >
      <Header_1 deviceid={device}  setCycleEnd={setCycleEnd} setCycleStatus={setCycleStatus}></Header_1>
          {/*Station Select*/}
            <div
               style={{
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    gap: "10px",

    border: "1px solid rgba(0,0,0,0.15)",
    boxShadow: "0 2px 8px rgba(0,0,0,0.12)",
    borderRadius: "8px",
    padding: "10px",
    paddingTop:"1px",
    marginBottom: "0px",
  }}
 >
   <div style={{ color: "black", fontWeight: "normal", fontSize: "14px" }}>Select Station</div>
        {/* Dropdown to delect Device */}
              <select
                style={{  marginLeft: "0px", height: "40px", border: "1px solid #ccc", borderRadius: "8px", padding: "8px 35px 8px 10px", marginTop:"-5px" }}
                value={device} // 👈 bind state here
                onChange={(e) => {
                  setGraphData([]);
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
              {/* device Name*/}
              <div style={{ color: "black", fontWeight: "normal", marginLeft: "8px", fontSize: "14px", margin : "0px", padding : "0px" }}>Station Seleced:-</div>
              <div style={{ color: "black", fontWeight: "bold", marginLeft: "8px", fontSize: "14px", margin : "0px", padding : "0px" }}>{devicenickname} </div>
            </div>
     {/*Last Update*/}      
<div
  style={{
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    gap: "10px",
    border: "1px solid rgba(0,0,0,0.15)",
    boxShadow: "0 2px 8px rgba(0,0,0,0.12)",
    borderRadius: "8px",
    padding: "10px",
    marginBottom: "0px",
    paddingTop:"1px"
  }}


>
<div
                style={{
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <button
                  style={{
                    backgroundColor: "#1BA94C",
                    color: "#fff",
                    border: "none",
                    padding: "8px 20px",
                    borderRadius: "6px",
                    fontWeight: "bold",
                    fontSize: "14px",
                    cursor: "pointer",
                    transition: "background-color 0.3s ease",
                  }}
                  onClick={() => {
                    runCycle(); // trigger title animation immediately
                    getFirstGraphdata(); // Refresh graph data if needed
                    getdata(); // Refresh latest sensor values
                    setCurredate(new Date()); // Update current date and time
                  }}
                >
                  ⟳ Last Update
                </button>

                <div style={{ fontSize: "12px", color: "#666", marginTop: "5px" }}>
                  {Graphdata.at(-1)?.createdAt && !isNaN(new Date(Graphdata.at(-1).createdAt))
                    ? `Last Updated: ${new Date(Graphdata.at(-1).createdAt)
                        .toLocaleString("en-GB", {
                          day: "2-digit",
                          month: "short",
                          year: "2-digit",
                          hour: "2-digit",
                          minute: "2-digit",
                          second: "2-digit",
                          hour12: true,
                        })
                        .replace(",", " - ")}`
                    : "Updating..."}
                </div>
              </div>
              <div
                style={{
                  fontSize: "12px",
                  color: highlight ? "#000" : "#666", // 👈 change color
                  fontWeight: highlight ? "semi-bold" : "normal", // 👈 bold effect
                  marginTop: "5px",
                  transition: "all 1s ease", // 👈 smooth effect
                }}
              >
                {curredate
                  ? `Last checked: ${curredate
                      .toLocaleString("en-GB", {
                        timeZone: "Asia/Kolkata",
                        day: "2-digit",
                        month: "short",
                        year: "2-digit",
                        hour: "2-digit",
                        minute: "2-digit",
                        second: "2-digit",
                        hour12: true,
                      })
                      .replace(",", " - ")}`
                  : "Updating..."}
              </div>
        
</div>
{/* Logout*/}
<div
  style={{
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    gap: "10px",

    border: "1px solid rgba(0,0,0,0.15)",
    boxShadow: "0 2px 8px rgba(0,0,0,0.12)",
    borderRadius: "8px",
    padding: "10px",
    marginBottom: "0px",
  }}
>
    
            <button
              style={{
                backgroundColor: "#1BA94C",
                color: "white",
                border: "none",
                padding: "8px 20px",
                borderRadius: "6px",
                fontWeight: "bold",
                cursor: "pointer",
              }}
              onClick={onLogoff}
              disabled={loading}
            >
              {loading ? "loging Out..." : "Log Out"}
            </button>
        
</div>


        </div>
<hr></hr>
        {/* Graph  */}
        <div
          style={{
             display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    flexWrap: "wrap",
    gap: "20px",
    marginBottom: "30px",
    width: "100%",
          }}
        >
          {graphselect.Humidity == "line" ? (
            <LineGraph liveData={Graphdata} liveAverages={liveAverages.Humidity} Label={"Humidity"} mykey={"Humidity"} key={devicenickname} image={humidity} bg={"rgb(255, 255, 255)"} unit={"%"} />
          ) : graphselect.Humidity == "bar" ? (
            <BarGraph liveData={Graphdata} liveAverages={liveAverages.Humidity} Label={"Humidity"} mykey={"Humidity"} key={devicenickname} image={humidity} bg={"rgb(255, 255, 255)"} unit={"%"} />
          ) : graphselect.Humidity == "pi" ? (
            <PiChart liveData={Graphdata} liveAverages={liveAverages.Humidity} Label={"Humidity"} mykey={"Humidity"} key={devicenickname} image={humidity} bg={"rgb(255, 255, 255)"} unit={"%"} />
          ) : (
            <>{null}</>
          )}

          {graphselect.Temperature == "line" ? (
            <LineGraph
              liveData={Graphdata}
              liveAverages={liveAverages.Temperature}
              Label={"Temperature"}
              mykey={"Temperature"}
              key={`A-1-${devicenickname}`}
              image={temperature}
              bg={"rgb(255, 255, 255)"}
              unit={"°C"}
            />
          ) : graphselect.Temperature == "bar" ? (
            <BarGraph
              liveData={Graphdata}
              liveAverages={liveAverages.Temperature}
              Label={"Temperature"}
              mykey={"Temperature"}
              key={`A-1-${devicenickname}`}
              image={temperature}
              bg={"rgb(255, 255, 255)"}
              unit={"°C"}
            />
          ) : graphselect.Temperature == "pi" ? (
            <PiChart
              liveData={Graphdata}
              liveAverages={liveAverages.Temperature}
              Label={"Temperature"}
              mykey={"Temperature"}
              key={`A-1-${devicenickname}`}
              image={temperature}
              bg={"rgb(255, 255, 255)"}
              unit={"°C"}
            />
          ) : (
            <>{null}</>
          )}

          {graphselect.Ph == "line" ? (
            <LineGraph liveData={Graphdata} liveAverages={liveAverages.Ph} Label={"pH"} mykey={"Ph"} key={`A-2-${devicenickname}`} image={ph} bg={"rgb(255, 255, 255)"} unit={"pH"} />
          ) : graphselect.Ph == "bar" ? (
            <BarGraph liveData={Graphdata} liveAverages={liveAverages.Ph} Label={"pH"} mykey={"Ph"} key={`A-2-${devicenickname}`} image={ph} bg={"rgb(255, 255, 255)"} unit={"pH"} />
          ) : graphselect.Ph == "pi" ? (
            <PiChart liveData={Graphdata} liveAverages={liveAverages.Ph} Label={"pH"} mykey={"Ph"} key={`A-2-${devicenickname}`} image={ph} bg={"rgb(255, 255, 255)"} unit={"pH"} />
          ) : (
            <>{null}</>
          )}

          {device === "Device_0" &&
            (graphselect.H2s == "line" ? (
              <LineGraph liveData={Graphdata} liveAverages={liveAverages.H2s} Label={"H2S"} mykey={"H2s"} key={`A-3-${devicenickname}`} image={H2S} bg={"rgb(255, 255, 255)"} unit={"ppm"} />
            ) : graphselect.H2s == "bar" ? (
              <BarGraph liveData={Graphdata} liveAverages={liveAverages.H2s} Label={"H2S"} mykey={"H2s"} key={`A-3-${devicenickname}`} image={H2S} bg={"rgb(255, 255, 255)"} unit={"ppm"} />
            ) : graphselect.H2s == "pi" ? (
              <PiChart liveData={Graphdata} liveAverages={liveAverages.H2s} Label={"H2S"} mykey={"H2s"} key={`A-3-${devicenickname}`} image={H2S} bg={"rgb(255, 255, 255)"} unit={"ppm"} />
            ) : (
              <>{null}</>
            ))}

          {device === "Device_0" &&
            (graphselect.Ammonia == "line" ? (
              <LineGraph
                liveData={Graphdata}
                liveAverages={liveAverages.Ammonia}
                Label={"Ammonia"}
                mykey={"Ammonia"}
                key={`A-4-${devicenickname}`}
                image={NH3}
                bg={"rgb(255, 255, 255)"}
                unit={"ppm"}
              />
            ) : graphselect.Ammonia == "bar" ? (
              <BarGraph liveData={Graphdata} liveAverages={liveAverages.Ammonia} Label={"Ammonia"} mykey={"Ammonia"} key={`A-4-${devicenickname}`} image={NH3} bg={"rgb(255, 255, 255)"} unit={"ppm"} />
            ) : graphselect.Ammonia == "pi" ? (
              <PiChart liveData={Graphdata} liveAverages={liveAverages.Ammonia} Label={"Ammonia"} mykey={"Ammonia"} key={`A-4-${devicenickname}`} image={NH3} bg={"rgb(255, 255, 255)"} unit={"ppm"} />
            ) : (
              <>{null}</>
            ))}

          {device === "Device_0" &&
            (graphselect.Methane == "line" ? (
              <LineGraph
                liveData={Graphdata}
                liveAverages={liveAverages.Methane}
                Label={"Methane"}
                mykey={"Methane"}
                key={`A-5-${devicenickname}`}
                image={CH4}
                bg={"rgb(255, 255, 255)"}
                unit={"ppm"}
              />
            ) : graphselect.Methane == "bar" ? (
              <BarGraph liveData={Graphdata} liveAverages={liveAverages.Methane} Label={"Methane"} mykey={"Methane"} key={`A-5-${devicenickname}`} image={CH4} bg={"rgb(255, 255, 255)"} unit={"ppm"} />
            ) : graphselect.Methane == "pi" ? (
              <PiChart liveData={Graphdata} liveAverages={liveAverages.Methane} Label={"Methane"} mykey={"Methane"} key={`A-5-${devicenickname}`} image={CH4} bg={"rgb(255, 255, 255)"} unit={"ppm"} />
            ) : (
              <>{null}</>
            ))}

          {device === "Device_0" &&
            (graphselect.Co2 == "line" ? (
              <LineGraph liveData={Graphdata} liveAverages={liveAverages.Co2} Label={"CO2"} mykey={"Co2"} key={`A-6-${devicenickname}`} image={CO2} bg={"rgb(255, 255, 255)"} unit={"ppm"} />
            ) : graphselect.Co2 == "bar" ? (
              <BarGraph liveData={Graphdata} liveAverages={liveAverages.Co2} Label={"CO2"} mykey={"Co2"} key={`A-6-${devicenickname}`} image={CO2} bg={"rgb(255, 255, 255)"} unit={"ppm"} />
            ) : graphselect.Co2 == "pi" ? (
              <PiChart liveData={Graphdata} liveAverages={liveAverages.Co2} Label={"CO2"} mykey={"Co2"} key={`A-6-${devicenickname}`} image={CO2} bg={"rgb(255, 255, 255)"} unit={"ppm"} />
            ) : (
              <>{null}</>
            ))}
          <Tile key_1={device}></Tile>
          <ReportDownload> </ReportDownload>
        </div>

        {/* Dashboard Metrics */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
            gap: "20px",
            marginBottom: "30px",
          }}
        >
          {/* Humidity Card */}
          <div
            style={{
              backgroundColor: "#f5f5f5",
              borderRadius: "8px",
              padding: "15px",
              boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: "10px",
              }}
            >
              <div style={{ fontWeight: "bold", fontSize: "12px" }}>Avg: {liveAverages.Humidity || 0}%</div>
            </div>
            <div
              style={{
                textAlign: "center",
                marginTop: "-20px",
                fontSize: "16px",
              }}
            >
              <div style={{ fontWeight: "bold", marginBottom: "5px" }}>Humidity</div>
              <div
                style={{
                  fontSize: "26px",
                  fontWeight: "bold",
                  marginBottom: "5px",
                }}
              >
                {Graphdata?.at(-1)?.Humidity ?? "--"}%
              </div>
              <div
                style={{
                  height: "4px",
                  backgroundColor: "#ddd",
                  borderRadius: "2px",
                  marginBottom: "5px",
                }}
              >
                <div
                  style={{
                    marginTop: "15px",
                    width: `${Number(Graphdata?.at(-1)?.Humidity) || 0}%`,
                    maxWidth: "100%",
                    height: "100%",
                    backgroundColor: "#73B10F",
                    borderRadius: "2px",
                  }}
                ></div>
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  fontSize: "12px",
                }}
              >
                <span>0</span>
                <span>100</span>
              </div>
            </div>
          </div>

          {/* H2S Card */}
          {device === "Device_0" ? (
            <div
              style={{
                backgroundColor: "#f5f5f5",
                borderRadius: "8px",
                padding: "15px",
                boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: "10px",
                }}
              >
                <div style={{ fontWeight: "bold", fontSize: "12px" }}>Avg: {liveAverages.H2s || 0} ppm</div>
              </div>
              <div
                style={{
                  textAlign: "center",
                  marginTop: "-20px",
                  fontSize: "16px",
                }}
              >
                <div style={{ fontWeight: "bold", marginBottom: "5px" }}>H₂S</div>
                <div
                  style={{
                    fontSize: "26px",
                    fontWeight: "bold",
                    marginBottom: "20px",
                  }}
                >
                  {Graphdata?.at(-1)?.H2s ?? "--"}ppm
                </div>
              </div>
            </div>
          ) : (
            <></>
          )}
          {/* Temperature Card */}
          <div
            style={{
              backgroundColor: "#f5f5f5",
              borderRadius: "8px",
              padding: "15px",
              boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: "10px",
              }}
            >
              <div style={{ fontWeight: "bold", fontSize: "12px" }}>Avg: {liveAverages.Temperature || 0}&#176;C</div>
            </div>
            <div
              style={{
                textAlign: "center",
                marginTop: "-20px",
                fontSize: "16px",
              }}
            >
              <div style={{ fontWeight: "bold", marginBottom: "5px" }}>Temperature</div>
              <div
                style={{
                  fontSize: "26px",
                  fontWeight: "bold",
                  marginBottom: "20px",
                }}
              >
                {Graphdata?.at(-1)?.Temperature ?? "--"}°C
              </div>
            </div>
          </div>

          {/* PH Card */}
          <div
            style={{
              backgroundColor: "#f5f5f5",
              borderRadius: "8px",
              padding: "15px",
              boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: "10px",
              }}
            >
              <div style={{ fontWeight: "bold", fontSize: "12px" }}>Avg: {liveAverages.Ph || 0}pH</div>
            </div>
            <div
              style={{
                textAlign: "center",
                marginTop: "-20px",
                fontSize: "16px",
              }}
            >
              <div style={{ fontWeight: "bold", marginBottom: "5px" }}>PH</div>
              <div
                style={{
                  fontSize: "26px",
                  fontWeight: "bold",
                  marginBottom: "20px",
                }}
              >
                {Graphdata?.at(-1)?.Ph ?? "--"}pH
              </div>
            </div>
          </div>

          {/* Methane Card */}

          {device === "Device_0" ? (
            <div
              style={{
                backgroundColor: "#f5f5f5",
                borderRadius: "8px",
                padding: "15px",
                boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: "10px",
                }}
              >
                <div style={{ fontWeight: "bold", fontSize: "12px" }}>Avg: {liveAverages.Methane || 0}ppm</div>
              </div>
              <div
                style={{
                  textAlign: "center",
                  marginTop: "-20px",
                  fontSize: "16px",
                }}
              >
                <div style={{ fontWeight: "bold", marginBottom: "5px" }}>Methane</div>
                <div
                  style={{
                    fontSize: "26px",
                    fontWeight: "bold",
                    marginBottom: "5px",
                  }}
                >
                  {Graphdata?.at(-1)?.Methane ?? "--"}
                  ppm
                </div>
              </div>
            </div>
          ) : (
            <></>
          )}
        </div>

        {/* Version Info */}
        <div style={{ textAlign: "right", fontSize: "12px", color: "#888" }}>v0.0.36</div>
      </div>
    </>
  );
}

export default page;
