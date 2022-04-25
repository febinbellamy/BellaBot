import Axios from "axios";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { saveMessage } from "../_actions/message_actions";
import Message from "./Sections/Message";

function Chatbot() {
  const dispatch = useDispatch();
  const messagesFromRedux = useSelector((state) => state.message.messages);

  useEffect(() => {
    eventQuery("welcomeToMyWebsite");
  }, []);

  const textQuery = async (text) => {

    let conversation = {
      who: "user",
      content: {
        text: {
          text: text,
        },
      },
    };

    dispatch(saveMessage(conversation));
    
    const textQueryVariables = {
      text,
    };


    try {
      const response = await Axios.post(
        "/api/dialogflow/textQuery",
        textQueryVariables
      );

      const content = response.data.fulfillmentMessages[0];
      
      conversation = {
        who: "chatbot",
        content: content,
      };

      dispatch(saveMessage(conversation));

      console.log(conversation);
    } catch (error) {
      conversation = {
        who: "chatbot",
        content: {
          text: {
            text: "An error has occured!",
          },
        },
      };
    }
  };

  const eventQuery = async (event) => {

    const eventQueryVariables = {
      event,
    };

    try {
      const response = await Axios.post(
        "/api/dialogflow/eventQuery",
        eventQueryVariables
      );
      const content = response.data.fulfillmentMessages[0];

      let conversation = {
        who: "chatbot",
        content: content,
      };

      dispatch(saveMessage(conversation));
    } catch (error) {
      let conversation = {
        who: "chatbot",
        content: {
          text: {
            text: "An error has occured!",
          },
        },
      };
      dispatch(saveMessage(conversation));
    }
  };

  const keyPressHandler = (e) => {
    if (e.key === "Enter") {
      if (!e.target.value) {
        return alert("You need to type something first!");
      }

      textQuery(e.target.value);
      e.target.value = "";
    }
  };

  const renderOneMessage = (message, i) => {
    console.log(message, "message");
    return (
      <Message key={i} who={message.who} text={message.content.text.text} />
    );
  };

  const renderMessage = (returnedMessages) => {
    if (returnedMessages) {
      return returnedMessages.map((message, i) => {
        return renderOneMessage(message, i);
      });
    } else {
      return null;
    }
  };

  return (
    <div
      style={{
        height: 700,
        width: 700,
        border: "3px solid black",
        borderRadius: "7px",
      }}
    >
      <div style={{ height: 644, width: "100%", overflow: "auto" }}>
        {renderMessage(messagesFromRedux)}
      </div>
      <input
        style={{
          margin: 0,
          width: "100%",
          height: 50,
          borderRadius: "4px",
          padding: "5px",
          fontSize: "1rem",
        }}
        placeholder="Send a message..."
        onKeyPress={keyPressHandler}
        type="text"
      />
    </div>
  );
}

export default Chatbot;
