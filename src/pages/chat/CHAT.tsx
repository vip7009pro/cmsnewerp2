import React, { useState } from "react";
import "./CHAT.scss";

const CHAT = () => {
  const [showChat, setShowChat] = useState(true);

  return (
    <div className="chatwindow">
      <button
        className="open-button"
        onClick={() => {
          setShowChat(!showChat);
        }}
      >
        Chat
      </button>
      {showChat && (
        <div className="chat-popup" id="myForm">
          <form action="" className="form-container">
            <h1>Chat Nội Bộ</h1>
            <label>
              <b>Message</b>
            </label>
            <textarea
              placeholder="Type message.."
              name="msg"
              required
              className="messageBox"
            ></textarea>

            <button
              type="submit"
              className="btn"
              onClick={(e) => {
                e.preventDefault();
              }}
            >
              Send
            </button>
            <button
              type="button"
              className="btn cancel"
              onClick={(e) => {
                e.preventDefault();
                setShowChat(false);
              }}
            >
              Close
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default CHAT;
