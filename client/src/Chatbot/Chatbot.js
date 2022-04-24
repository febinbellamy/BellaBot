import Axios from "axios";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { saveMessage } from "../_actions/message_actions";

function Chatbot() {
  const dispatch = useDispatch();

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
    console.log("text I sent the chatbot", conversation);

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
  return (
    <div
      style={{
        height: 700,
        width: 700,
        border: "3px solid black",
        borderRadius: "7px",
      }}
    >
      <div style={{ height: 644, width: "100%", overflow: "auto" }}></div>

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
