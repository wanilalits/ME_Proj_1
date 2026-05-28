"use client";

import { useEffect, useState } from "react";
import { getDateAnalysis } from "../lib/api/dateAnalysis";

const DataAnilizerPopUp = (props) => {
  const [data, setData] = useState({});

  const handleClick = async () => {
    const res = await getDateAnalysis(props.deviceid);
    console.log(res);
    setData(res);
  };

  useEffect(() => {
    handleClick();
  }, []);

  return (
    <>
      {props.showDataAnilizerPopup && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            backgroundColor: "rgba(0,0,0,0.75)",
            alignItems: "flex-start",
            paddingTop: "20px",
            paddingBottom: "20px",
            overflowY: "auto",
            zIndex: 9999,
          }}
        >
          <div>
            {/* CLOSE BUTTON */}
            <button
              onClick={() => props.setShowDataAnilizerPopup(false)}
              style={{
                position: "absolute",
                top: "10px",
                right: "10px",
                background: "transparent",
                border: "none",
                fontSize: "24px",
                cursor: "pointer",
                color: "#333",
                zIndex: 10,
                backgroundColor: "white",
                height: "30px",
                width: "30px",
                borderRadius: "100%",
              }}
            >
              X
            </button>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center", // center horizontally
                justifyContent: "center",
                gap: "10px",
              }}
            >
              <div
                style={{
                  backgroundColor: "#fff",
                  padding: "16px",
                  borderRadius: "12px",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                  overflowX: "auto",
                }}
              >
                <div
                  style={{
                    marginBottom: "12px",
                    color: "#000",
                    fontSize: "14px",
                    fontWeight: "500",
                  }}
                >
                  Do not forget to click on{" "}
                  <button
                    onClick={handleClick}
                    style={{
                      margin: "0 4px",
                      padding: "4px 8px",
                      backgroundColor: "white",
                      border: "none",
                      color: "#fff",
                      cursor: "pointer",
                      fontSize: "14px",
                    }}
                  >
                    🔄️
                  </button>
                  to analyze fresh data.
                </div>
                <table
                  style={{
                    width: "100%",
                    borderCollapse: "collapse",
                    color: "#000",
                    fontSize: "14px",
                  }}
                >
                  <thead>
                    <tr
                      style={{
                        backgroundColor: "#1BA94C",
                        color: "#fff",
                      }}
                    >
                      <th style={{ padding: "10px", border: "1px solid #ddd" }}>Type</th>

                      <th style={{ padding: "10px", border: "1px solid #ddd" }}>Date</th>

                      <th style={{ padding: "10px", border: "1px solid #ddd" }}>Records</th>
                    </tr>
                  </thead>

                  <tbody>
                    <tr>
                      <td style={{ padding: "10px", border: "1px solid #ddd" }}>Previous Data Before Cycle End When Records Found</td>

                      <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                        {new Date(data.previousDate).toLocaleDateString("en-IN", {
                          timeZone: "Asia/Kolkata",
                          day: "2-digit",
                          month: "2-digit",
                          year: "numeric",
                        })}
                      </td>

                      <td style={{ padding: "10px", border: "1px solid #ddd" }}>{data.previousDateCount} Records Found</td>


                      <td style={{ padding: "2px", textAlign: "center" }}>
                        {(() => {
                         

                          const today = new Date();
                          const previousDate = new Date(data.previousDate);

                          // Remove time part
                          today.setHours(0, 0, 0, 0);
                          previousDate.setHours(0, 0, 0, 0);

                          if (previousDate.getTime() === today.getTime()) {
                            return "⏳"; // Today
                          } else if (previousDate < today) {
                            return "✅"; // Past date
                          } else {
                            return "◌"; // Future date
                          }
                        })()}
                      </td>
 <td style={{ padding: "2px", textAlign: "center" }}>{data.previousDateCount===0 &&  "🚫" }</td>

                    </tr>

                    <tr>
                      <td style={{ padding: "10px", border: "1px solid #ddd" }}>Cycle End Date</td>

                      <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                        {new Date(data.selectedDate).toLocaleDateString("en-IN", {
                          timeZone: "Asia/Kolkata",
                          day: "2-digit",
                          month: "2-digit",
                          year: "numeric",
                        })}
                      </td>

                      <td style={{ padding: "10px", border: "1px solid #ddd" }}>{data.selectedDateCount} Records Found</td>



                      <td style={{ padding: "10px", textAlign: "center" }}>
                        {(() => {
                          
                          

                          const today = new Date();
                          const selected = new Date(data.selectedDate);

                          // Remove time part for accurate date comparison
                          today.setHours(0, 0, 0, 0);
                          selected.setHours(0, 0, 0, 0);

                          if (selected.getTime() === today.getTime()) {
                            return "⏳"; // Today
                          } else if (selected < today) {
                            return "✅"; // Past date
                          } else {
                            return "◌"; // Future date
                          }
                        })()}
                      </td>
                       <td style={{ padding: "2px", textAlign: "center" }}>{data.selectedDateCount===0 &&  "🚫" }</td>
                    </tr>

                    <tr>
                      <td style={{ padding: "10px", border: "1px solid #ddd" }}>Next Data After Cycle End When Records Found</td>

                      <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                        {/* {new Date(data.nextDate).toLocaleDateString("en-IN", {
            timeZone: "Asia/Kolkata",
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
          })} */}
                        {data.nextDate ? `${new Date(data.nextDate).toLocaleDateString("en-IN")}` : "No Data Found"}
                      </td>

                      <td style={{ padding: "10px", border: "1px solid #ddd" }}>{data.nextDateCount} Records Found</td>



                      <td style={{ padding: "2px", textAlign: "center" }}>
                        {(() => {
                          

                          const today = new Date();
                          const nextDate = new Date(data.nextDate);
                          const cycledate= new Date (data.selectedDate)
    
                          // Remove time part
                          today.setHours(0, 0, 0, 0);
                          nextDate.setHours(0, 0, 0, 0);
if (data.nextDate===null)
  return "◌"; // Future date
                          else if (nextDate.getTime() === today.getTime()) {
                            return "⏳"; // Today
                          } else if (nextDate < today) {
                            return "✅ "; // Past date
                          } else 
                          
                            return "◌"; // Future date
                          
                        })()}
                      </td>
                      <td style={{ padding: "2px", textAlign: "center" }}>{data.nextDateCount===0 &&  "🚫" }</td>
                    </tr>

                    <tr>
                      <td style={{ padding: "10px", border: "1px solid #ddd" }}>Today Date</td>

                      <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                        {new Date(data.today).toLocaleDateString("en-IN", {
                          timeZone: "Asia/Kolkata",
                          day: "2-digit",
                          month: "2-digit",
                          year: "numeric",
                        })}
                      </td>

                      <td style={{ padding: "10px", border: "1px solid #ddd" }}>{data.todayCount} Records Found</td>


                      <td style={{ padding: "2px" }}>⏳</td>
                      <td style={{ padding: "2px", textAlign: "center" }}>{data.todayCount===0 &&  "🚫" }</td>
                    </tr>
                  </tbody>
                </table>

                <br></br>

                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "5px",
                    backgroundColor: "#fff",

                    width: "fit-content",
                    fontSize: "12px",
                    color: "#000",
                    lineHeight: "1.1",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "1px" }}>
                    <span style={{ fontSize: "18px" }}>✅</span>
                    <span> : Process Completed,</span>
                    &nbsp;&nbsp;&nbsp;
                    <span style={{ fontSize: "18px" }}>◌</span>
                    <span> : Upcoming Process ,</span>
                    &nbsp;&nbsp;&nbsp;
                    <span style={{ fontSize: "18px" }}>⏳</span>
                    <span> : Cycle Completing Today</span>
                    &nbsp;&nbsp;&nbsp;
                    <span style={{ fontSize: "18px" }}>🚫</span>
                    <span> : No Data Found,</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default DataAnilizerPopUp;
