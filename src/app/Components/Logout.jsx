import React, { useState } from 'react';
 import { useRouter, useParams } from "next/navigation";


const Logout = () => {
    const router = useRouter();
 const [loading, setLoading] = useState(false);
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

  
    return (

 <div
            style={{
            
            

             
              padding: "10px",
            
            }}
          >
            <button
              style={{
                backgroundColor: "rgba(27, 169, 76, 0.2)",
                color: "white",
                border: "none",
                padding: "8px 20px",
                borderRadius: "6px",
                fontWeight: "bold",
                cursor: "pointer",
  transition: "0.3s",
}}
onMouseEnter={(e) => {
  e.currentTarget.style.backgroundColor = "rgba(27, 169, 76, 0.9)";
}}
onMouseLeave={(e) => {
  e.currentTarget.style.backgroundColor = "rgba(27, 169, 76, 0.2)";
}}
              onClick={onLogoff}
              disabled={loading}
            >
              {loading ? "loging Out..." : "Log Out"}
            </button>
          </div>




  );
};

export default Logout;
