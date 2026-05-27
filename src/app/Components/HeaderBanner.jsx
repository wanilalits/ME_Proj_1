import React, { useState, useEffect } from "react";
import Logo from "../../../public/Image/Logo.png";
import Logout from "./Logout";
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

 
 

  let content;
 /*very small Less than 300 pixel*/
  if (width <= 350) {
    content = (
        <div
          style={{
            background: "linear-gradient(90deg,  #66BB6A, #2E7D32 )",
            color: "white",
          padding: "0.8rem 1rem 1rem 1.5rem",
            textAlign: "center",
            borderRadius: "16px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
            position: "relative", // 🔥 important
            marginBottom: "15px",
          }}
        >
         
          {/* no Logo */}

          {/* Center text (unchanged) */}
          <h1
            style={{
              fontSize: "clamp(2rem, 2vw, 3rem)",
              fontWeight: "800",
              letterSpacing: "0px",
              margin: 0,
                  lineHeight: "0.95",
            }}
          >
            Greya Smart Composter
          </h1>
          <p
            style={{
              marginTop: "1rem",
              fontSize: "clamp(0.8rem, 2vw, 1rem)",
              fontWeight: "400",
          
            }}
          >
            A Smart IoT-Enabled Device for On-Site Wet Waste Processing
          </p>

    {/* Logout Button*/}
       <div
  style={{
    position: "absolute",
    right: "-4px",
    bottom: "-5px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  }}
>
  <Logout />
</div>
        </div>
    
    );
  } 
  
/*mobile very 650 pixel*/
  else if (width <= 650) {
    content = <><div
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
 {/* Logout Button*/}
       <div
  style={{
    position: "absolute",
    right: "0px",
    top: "0%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  }}
>
  <Logout />
</div>


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
              fontSize: "clamp(1.6rem, 4vw, 2.8rem)",
              fontWeight: "800",
              margin: 0,
              lineHeight: "1.2",
              transform: "translateY(30%)",
            }}
          >
            Greya Smart
            <br />
            Composter
          </h1>

          <p
            style={{
              fontSize: "clamp(1rem, 2.5vw, 1.1rem)",
              fontWeight: "500",
              marginTop: "35px",
              padding: "0 5px 5px 5px ",
              lineHeight: "1.2",
              transform: "translateY(-10%)",
            }}
          >
            A Smart IoT-Enabled Device for On-Site Wet Waste Processing
          </p>
        </div>
        <div />

</div></>;
} 
  
 else if (width <= 950) {
    content = (

        <div
          style={{
             position: "relative",
            background: "linear-gradient(90deg, #66BB6A, #2E7D32)",
            color: "white",
            padding: "0.8rem 1rem",
            borderRadius: "16px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
            marginBottom: "15px",
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
                height: "130px",
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
         
            <div />
    
          </div>
   {/* Logout Button*/}
  <div
    style={{
    position: "absolute",
    right:"5px",
    bottom: "5px",
    display: "flex",
    justifyContent: "flex-end",
    minWidth:"120px",
    padding:"0px"
  }}
  >
    <Logout /> </div>
          {/* RIGHT: EMPTY (same width as left) */}
        </div>
  
  
    );
  }

/*Laptop Desk view more than 950 pixel*/
  else  {
    content = (
        <div
          style={{
            background: "linear-gradient(90deg, #66BB6A, #2E7D32)",
            color: "white",
            padding: "0.8rem 1rem",
            borderRadius: "16px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
            marginBottom: "15px",
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
                height: "130px",
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
            {/* Logout Button*/}
            <div />
    
          </div>  
  {/* RIGHT - Logout */}
  <div
    style={{
      position: "relative",
    top: "-65px",
    left:"10px",
    display: "flex",
    justifyContent: "flex-end",
     minWidth:"120px"
  }}
  >
    <Logout /> </div>
          {/* RIGHT: EMPTY (same width as left) */}
        </div>
    
    );
  }



  return <>{content}</>;
};

export default HeaderBanner;
