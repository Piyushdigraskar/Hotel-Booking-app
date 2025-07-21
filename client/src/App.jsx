import React from "react";
import Navbar from "./components/Navbar";
import { useLocation } from "react-router-dom";

const App = () => {
  const isOwnerPath = useLocation().pathname.includes("owner");

  return (
    <div>
      {!isOwnerPath && <Navbar />}

      <div
        style={{ height: "2000px", background: "#f5f5f5", paddingTop: "120px" }}
      >
        <h1 style={{ textAlign: "center" }}>Scroll down to test navbar</h1>
      </div>
    </div>
  );
};

export default App;
