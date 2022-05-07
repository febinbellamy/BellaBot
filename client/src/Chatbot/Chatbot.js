import Axios from "axios";
import React, { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { saveMessage } from "../_actions/message_actions";
import Messages from "./Sections/Message/Messages";
import Card from "./Sections/Card";

function Chatbot() {
  const dispatch = useDispatch();

  const messageEl = useRef(null);
  useEffect(() => {
    if (messageEl) {
      messageEl.current.addEventListener("DOMNodeInserted", (event) => {
        const { currentTarget: target } = event;
        target.scroll({ top: target.scrollHeight, behavior: "smooth" });
      });
    }
  }, []);

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

      for (let content of response.data.fulfillmentMessages) {
        conversation = {
          who: "chatbot",
          content: content,
        };

        dispatch(saveMessage(conversation));
      }

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

      for (let content of response.data.fulfillmentMessages) {
        let conversation = {
          who: "chatbot",
          content: content,
        };

        dispatch(saveMessage(conversation));
      }
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

  const renderCards = (cards) => {
    return cards.map((card, i) => <Card key={i} cardInfo={card.structValue} />);
  };

  const renderOneMessage = (message, i) => {
    console.log(message, "message");

    if (message.content && message.content.text && message.content.text.text) {
      return (
        <Messages key={i} who={message.who} text={message.content.text.text} />
      );
    } else if (message.content && message.content.payload.fields.card) {
      return (
        <div
          className={message.who === "chatbot" ? "message chatbot" : "message"}
        >
          <div className="messageTop">
            <img
              className="messageImg"
              src={
                message.who === "chatbot"
                  ? "https://images.unsplash.com/photo-1531747118685-ca8fa6e08806?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1645&q=80"
                  : "https://images.unsplash.com/photo-1568880893176-fb2bdab44e41?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1774&q=80"
              }
              alt={
                message.who === "chatbot"
                  ? "an image of a robot"
                  : "an image of a student"
              }
            />
            <p className="messageText">
              {renderCards(
                message.content.payload.fields.card.listValue.values
              )}
            </p>
          </div>
        </div>
      );
    }
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
        height: 950,
        width: 1800,
        border: "3px solid black",
        borderRadius: "7px",
        scrollBehavior: "smooth",
      }}
    >
      <div
        ref={messageEl}
        style={{ height: 644, width: "100%", overflow: "auto" }}
      >
        {renderMessage(messagesFromRedux)}
      </div>
      <input
        style={{
          margin: 0,
          width: "100%",
          marginTop: "200px",
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
