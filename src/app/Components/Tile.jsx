import { useState } from "react";

const options = [
  "Wet Waste (Mixed Organic Waste)",
 // "Food Waste",
 // "Garden Waste",
];

const Tile = () => {
  const [selectedOption, setSelectedOption] = useState(
    "Wet Waste (Mixed Organic Waste)"
  );
  const [input2, setInput2] = useState("10");
  const [op, setOp] = useState(2);
  const [open, setOpen] = useState(false);

  const factors = {
    "Wet Waste (Mixed Organic Waste)": 0.2,
   "Food Waste": 8.8,
    "Garden Waste": 1,
  };

  // 🔹 Input handler
  const handleInput2Change = (e) => {
    const raw = e.target.value;

    if (!/^\d*\.?\d*$/.test(raw)) return;

    setInput2(raw);
    const value = Number(raw || 0);

    setOp(value * factors[selectedOption]);
  };

  // 🔹 Option select handler
  const handleOptionClick = (option) => {
    setSelectedOption(option);
    setOpen(false);

    const value = Number(input2 || 0);
    setOp(value * factors[option]);
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
          <div
            style={{
              position: "absolute",
              top: "40px",
              width: "100%",
              background: "#fff",
              border: "1px solid #ccc",
              borderRadius: "8px",
              boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
              zIndex: 10,
              overflow: "hidden",
            }}
          >
            {options.map((item, index) => (
              <div
                key={index}
                onClick={() => handleOptionClick(item)}
                style={{
                  padding: "10px",
                  cursor: "pointer",
                  borderBottom:
                    index !== options.length - 1
                      ? "1px solid #eee"
                      : "none",
                }}
                onMouseEnter={(e) =>
                  (e.target.style.background = "#f5f5f5")
                }
                onMouseLeave={(e) =>
                  (e.target.style.background = "#fff")
                }
              >
                {item}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Input */}
      <input
        type="text"
        value={input2}
        onChange={handleInput2Change}
        style={{
          width: "80%",
          height: "35px",
          padding: "8px",
          marginTop: "10px",
          marginBottom: "10px",
          borderRadius: "8px",
          border: "1px solid #ccc",
          marginLeft: "14px",
        }}
      />

      {/* Output */}
      <div style={{ marginLeft: "14px" }}>
        <p>Total Reduction in Emissions due to</p>
        <p>
          {input2} Kg {selectedOption} is
        </p>
        <p style={{ fontWeight: "bold", fontSize: "20px" }}>
          {op.toFixed(1)} KG CO<sub>2</sub>e
        </p>
      </div>
    </div>
  );
};

export default Tile;