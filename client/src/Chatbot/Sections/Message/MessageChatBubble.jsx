import React from "react";
import './messagechatbubble.scss';

function MessageChatBubble() {
  return (
    <div class="chat-bubble">
      <div class="loading">
        <div class="dot one"></div>
        <div class="dot two"></div>
        <div class="dot three"></div>
      </div>
      <div class="tail"></div>
    </div>
  );
}

export default MessageChatBubble;
