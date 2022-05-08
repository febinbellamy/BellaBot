import React from "react";
import "./messages.css";
import moment from "moment";

export default function Messages(props) {
  return (
    <div className={props.who === "chatbot" ? "message chatbot" : "message"}>
      <div className="messageTop">
        <img
          className="messageImg"
          src={
            props.who === "chatbot"
              ? "https://images.unsplash.com/photo-1531747118685-ca8fa6e08806?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1645&q=80"
              : "https://images.unsplash.com/photo-1623666996666-6a71ec53ff42?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=780&q=80"
          }
          alt={
            props.who === "chatbot"
              ? "an image of a robot"
              : "an image of a student"
          }
        />
        <p className="messageText">{props.text}</p>
      </div>
      <div className="messageBottom">
          {props.timestamp}
      </div>
    </div>
  );
}
