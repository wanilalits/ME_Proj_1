import React, { useState, useEffect } from 'react';
import Logo from "../../../public/Image/Logo.png";
const HeaderBanner = () => {
  const [width, setWidth] = useState(0); // no window here

    useEffect(() => {
    const handleResize = () => {
      setWidth(window.innerWidth);
    };

    handleResize(); // set initial width
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

const GreyaHeader = () => {
  return (
    <div
  style={{
    background: "linear-gradient(90deg,  #66BB6A, #2E7D32 )",
    color: "white",
    padding: "0px",
    borderRadius: "16px",
    width: "100%",
    margin: "0 auto",
    boxSizing: "border-box",
    fontFamily: "sans-serif",
    position: "relative", // IMPORTANT
  }}
>
  {/* LOGO - LEFT SIDE */}
  <img
    src={Logo.src || Logo}
    alt="logo"
    style={{
      position: "absolute",
      left: "10px",
      top: "35%",
      transform: "translateY(-50%)",
      height: "clamp(77px, 10vw, 90px)",
      width: "auto",
    }}
  />

  {/* CENTER TEXT */}
  <div style={{ textAlign: "center" }}>
    <h1
      style={{
        fontSize: "clamp(1.5rem, 4vw, 2.8rem)",
        fontWeight: "800",
        margin: 0,
        lineHeight: "1.2",
      }}
    >
      Greya Smart<br/>Composter
    </h1>

    <p
      style={{
        fontSize: "clamp(1rem, 2.5vw, 1.1rem)",
        fontWeight: "500",
        marginTop: "35px",
        padding:"0 5px 5px 5px ",
         lineHeight: "1.2",
      }}
    >
      A Smart IoT-Enabled Device for On-Site Wet Waste Processing
    </p>
  </div>
</div>
  );
};



let content;

  if (width < 300) {
    content = <>    <div
          style={{
            background: "linear-gradient(90deg,  #66BB6A, #2E7D32 )",
            color: "white",
            padding: "1.5rem 1rem",
            textAlign: "center",
            borderRadius: "16px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
            position: "relative", // 🔥 important
            marginBottom: "30px",
          }}
        >
          {/* Logo */}
        
        
          {/* Center text (unchanged) */}
          <h1
            style={{
              fontSize: "clamp(3rem, 6vw, 4rem)",
              fontWeight: "800",
              letterSpacing: "1px",
              margin: 0,
             
            }}
          >
            Greya Smart Composter
          </h1>
        
          <p
            style={{
              marginTop: "1rem",
              fontSize: "clamp(1.2rem, 3vw, 1.5rem)",
              fontWeight: "500",
            }}
          >
            A Smart IoT-Enabled Device for On-Site Wet Waste Processing
          </p>
        </div></>;


  } else if (width <= 650) {
    content = <>{GreyaHeader()}</>;
  } else {
    content = <>  <div
  style={{
    background: "linear-gradient(90deg, #66BB6A, #2E7D32)",
    color: "white",
    padding: "1.5rem 1rem",
    borderRadius: "16px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
    marginBottom: "30px",

    display: "grid",
    gridTemplateColumns: "1fr 2fr 1fr", // ✅ equal balance
    alignItems: "center",
  }}
>
  {/* LEFT: LOGO */}
  <div style={{ display: "flex", justifyContent: "flex-start" }}>
    <img
      src={Logo.src}
      alt="logo"
      style={{
        height: "clamp(70px, 10vw, 130px)",
         height:"130px"
      }}
    />
  </div>

  {/* CENTER: TEXT */}
  <div style={{ textAlign: "center" }}>
    <h1
      style={{
        fontSize: "clamp(2rem, 5vw, 4rem)",
        fontWeight: "800",
        margin: 0,
         whiteSpace: "nowrap", // 🔥 IMPORTANT
      }}
    >
      Greya Smart Composter
    </h1>

    <p
      style={{
        marginTop: "0.8rem",
        fontSize: "clamp(1rem, 2vw + 0.5rem, 1.6rem)",
      }}
    >
      A Smart IoT-Enabled Device for On-Site Wet Waste Processing
    </p>
  </div>

  {/* RIGHT: EMPTY (same width as left) */}
  <div />
</div></>;
  }



    return (
        <>
         
  


            <h1>Screen width: {width}px</h1>

 {content}
        </>
    );
};

export default HeaderBanner;