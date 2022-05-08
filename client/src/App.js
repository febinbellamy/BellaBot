import React from "react";
import { Typography } from "antd";
import Chatbot from "./Chatbot/Chatbot";
const { Title } = Typography;

function App() {
  return (
    <div>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginTop: "2rem"
          }}
        >
          <Title level={2} style={{border: "solid #5749e2", backgroundColor: "white", color: "#5749e2", padding: "5px 10px", borderRadius: "10px"}}>BellaBot 🤖</Title>
      </div>
      <div style={{ display: "flex", justifyContent: "center", marginTop: "10px" }}>
        <Chatbot />
      </div>
    </div>
  );
}

export default App;
