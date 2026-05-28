"use client";
import react, { useState, useEffect, memo } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./cyclePopup.module.css";
function CyclePopup(props) {
  const [dateTime, setDateTime] = useState(new Date());
  const [dateTime2, setDateTime2] = useState(new Date());
  const [loading, setLoading] = useState(false);
  const [recordExists, setRecordExists] = useState({});

  const days = Math.round((dateTime2 - dateTime) / (1000 * 60 * 60 * 24));

  const fetchCycleData = async () => {
    try {
      const res = await fetch(`/api/users/cycles?deviceid=${encodeURIComponent(props.deviceid)}`);
      const result = await res.json();
      if (result.data) {
        setRecordExists(result.data);
        setDateTime(new Date(result.data.Startdate));
        setDateTime2(new Date(result.data.enddate));
        console.log(result.data.enddate);
      } else {
        setRecordExists(null);
      }
      if (!res.ok) {
        // throw new Error(result.message || "Failed to fetch data");
        return;
      }

      //   setCycleData(result.data);
    } catch (err) {
      setRecordExists(null);
      return;
    } finally {
    }
  };

  // ================= SAVE =================
  const saveCycleIndb = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/users/cycles", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          deviceid: props.deviceid,
          Startdate: dateTime,
          enddate: dateTime2,
          days,
        }),
      });

      const result = await res.json();
      console.log(result);

      if (res.ok) {
        setRecordExists(true);
        alert("Saved successfully");
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
      props.fetchCycleData(); // call parent function to refresh data
      props.setShowPopup(false);
    }
  };

  // ================= DELETE =================
  const deleteCycle = async () => {
    if (!confirm("Delete this cycle?")) return;
    try {
      setLoading(true);
      const res = await fetch(`/api/users/cycles?deviceid=${encodeURIComponent(props.deviceid)}`, {
        method: "DELETE",
      });
      const result = await res.json();
      console.log(result);
      console.log(res);
      if (res.ok) {
        setRecordExists(false);

      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
      props.fetchCycleData(); // call parent function to refresh data
      props.setShowPopup(false);
    }
  };

  useEffect(() => {
    if (props.showPopup ===true) {
     fetchCycleData();
    }
  }, [props.showPopup, props.deviceid]);

  return (
<>
  {props.showPopup && (
    <div
      style={{
        position: "fixed",
        inset: 0,
        backgroundColor: "rgba(0,0,0,0.5)",
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-start",
        paddingTop: "20px",
        paddingBottom: "20px",
        overflowY: "auto",
        zIndex: 9999,
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "500px",
          margin: "0 15px",
          padding: "20px",
          border: "1px solid #ccc",
          borderRadius: "10px",
          background: "#fff",
          boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
          position: "relative",
          overflow: "visible",
        }}
      >
        {/* CLOSE BUTTON */}
        <button
          onClick={() => props.setShowPopup(false)}
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
          }}
        >
          ×
        </button>

        {!recordExists ? (
          <>
            <h2>New Cycle</h2>

            <p>
              <strong>Device ID:</strong> {props.devicenickname}
            </p>

            {/* START DATE */}
            <label>Start Date</label>
            <br />

         <DatePicker
  selected={dateTime}
  onChange={(date) => setDateTime(date)}
  showTimeInput
  timeFormat="hh:mm aa"
  dateFormat="dd/MM/yyyy hh:mm aa"
  placeholderText="Select Date & Time"
  className="date-input"
  popperPlacement="bottom-start"
  popperProps={{
    strategy: "fixed",
  }}
/>

            <br />
            <br />

            {/* END DATE */}
            <label>End Date</label>
            <br />

            <DatePicker
            selected={dateTime2}
              onChange={(date) => setDateTime2(date)}
              showTimeInput
              timeFormat="hh:mm aa"
              dateFormat="dd/MM/yyyy hh:mm aa"
              placeholderText="Select Date & Time"
              portalId="root-portal"
              popperPlacement="bottom-start"
              className="date-input"
            />

            <br />
            <br />

            <p>
              <strong>Days:</strong> {days + 1}
            </p>

            <div
              style={{
                display: "flex",
                gap: "10px",
                flexWrap: "wrap",
              }}
            >
              <button
                onClick={saveCycleIndb}
                disabled={loading}
                style={{
                  flex: 1,
                  minWidth: "120px",
                  padding: "10px",
                  background: "#1BA94C",
                  color: "white",
                  border: "none",
                  borderRadius: "5px",
                  cursor: "pointer",
                }}
              >
                {loading ? "Saving..." : "Save"}
              </button>
            </div>
          </>
        ) : (
          <>
            <h2>Edit Cycle</h2>

            <p>
              <strong>Device ID:</strong> {props.devicenickname}
            </p>

            {/* START DATE */}
            <label>Start Date</label>
            <br />

            <DatePicker
  selected={dateTime}
  onChange={(date) => setDateTime(date)}
  showTimeInput
  timeFormat="hh:mm aa"
  dateFormat="dd/MM/yyyy hh:mm aa"
  placeholderText="Select Date & Time"
  className="date-input"
  popperPlacement="bottom-start"
  popperProps={{
    strategy: "fixed",
  }}
/>

            <br />
            <br />

            {/* END DATE */}
            <label>End Date</label>
            <br />

            <DatePicker
              selected={dateTime2}
  onChange={(date) => setDateTime2(date)}
  showTimeInput
  timeFormat="hh:mm aa"
  dateFormat="dd/MM/yyyy hh:mm aa"
  placeholderText="Select Date & Time"
  className="date-input"
  popperPlacement="bottom-start"
  popperProps={{
    strategy: "fixed",
  }}
            />

            <br />
            <br />

            <p>
              <strong>Days:</strong> {days + 1}
            </p>

            <div
              style={{
                display: "flex",
                gap: "10px",
                flexWrap: "wrap",
              }}
            >
              <button
                onClick={saveCycleIndb}
                disabled={loading}
                style={{
                  flex: 1,
                  minWidth: "120px",
                  padding: "10px",
                  background: "#1BA94C",
                  color: "white",
                  border: "none",
                  borderRadius: "5px",
                  cursor: "pointer",
                }}
              >
                {loading ? "Updating..." : "Update"}
              </button>

              {recordExists && (
                <button
                  onClick={deleteCycle}
                  disabled={loading}
                  style={{
                    flex: 1,
                    minWidth: "120px",
                    padding: "10px",
                    background: "#DB1D56",
                    color: "white",
                    border: "none",
                    borderRadius: "5px",
                    cursor: "pointer",
                  }}
                >
                  Delete
                </button>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  )}
</>
  );
}
export default memo(CyclePopup);
