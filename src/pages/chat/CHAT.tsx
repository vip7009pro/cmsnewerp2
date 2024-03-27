import React, { useState, useEffect, useCallback, useRef } from "react";
import "./CHAT.scss";
import { getCompany, getSocket } from "../../api/Api";
import { io as SKIO } from "socket.io-client";
import { UserData } from "../../api/GlobalInterface";
const CHAT = () => {
  const [showChat, setShowChat] = useState(true);
  const [onlineList, setOnlineList] = useState<UserData[]>([]);
  const updateOLLIST = (a: UserData[]) => {
    setOnlineList(a);
  }
  useEffect(() => {
    if (!getSocket().hasListeners('online_list')) {
      getSocket().on("online_list", (data: any) => {
        //console.log('data', data);
        //updateOLLIST(data);
        updateOLLIST(data.filter((ele: UserData, index: number) => ele.EMPL_NO !== 'none' && typeof ele === 'object'));
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
          setShowChat(!showChat);
         /*  if (!getSocket().hasListeners('online_list')) {
            getSocket().on("online_list", (data: any) => {
              console.log(data);
            });
          } */
        }}
      >
        Chat
      </button>
      {(
        <div className="chat-popup" id="myForm"  style={{display:`${showChat? 'flex' :'none'}`}}>
          <div className="chat_sidebar">
            <span> Online List</span>
            <div className="chatlist">
              {
                onlineList.map((ele: UserData, index: number) => {
                  return (
                    <span  style={{fontSize:'0.8rem'}} key={index}>{index + 1}: {ele.MAINDEPTNAME}/{ele.SUBDEPTNAME}: {`${ele.MIDLAST_NAME} ${ele.FIRST_NAME}`} </span>
                  )
                })
              }
            </div>
          </div>
          <div className="message_window">
            <form action="" className="form-container">
              <h3>Chat toàn công ty</h3>
              <div className="messagebox">
              </div>
              <textarea
                placeholder="Type message.."
                rows={1}
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
        </div>
      )}
    </div>
  );
};
export default CHAT;
