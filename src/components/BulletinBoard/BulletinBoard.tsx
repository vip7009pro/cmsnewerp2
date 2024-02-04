import React from "react";
import AccountInfo from "../Navbar/AccountInfo/AccountInfo";
import "./BulletinBoard.scss";
const BulletinBoard = () => {
  return (
    <div className="landingpage">
      <div className="accountinfodiv">
        <AccountInfo />
      </div>
    </div>
  );
};
export default BulletinBoard;
