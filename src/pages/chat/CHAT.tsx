import React, { useState, useEffect, useCallback } from "react";
import "./CHAT.scss";
import { getCompany, getSocket } from "../../api/Api";
import { io as SKIO } from "socket.io-client";
const CHAT = () => {
  const [showChat, setShowChat] = useState(true);
  useEffect(() => {
    if (!getSocket().hasListeners('online_list')) {
      getSocket().on("online_list", (data: any) => {
        console.log(data);
      });
    }
      return () => {
        getSocket().off("online_list", (data: any) => {
        });
      }
    
  }, []);
  return (
    <div className="chatwindow">
      <button
        className="open-button"
        onClick={() => {
          setShowChat(true);
          if (!getSocket().hasListeners('online_list')) {
            getSocket().on("online_list", (data: any) => {
              console.log(data);
            });
          }
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
                getSocket().emit("online_list", 'nguyen van hung');
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
                getSocket().off("online_list", (data: any) => {
                  console.log('Đã off event online_list')
                });
                //getSocket().disconnect();
              }
              }
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
