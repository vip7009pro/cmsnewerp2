import React, { useContext, useRef } from "react";
import { Outlet } from "react-router-dom";
import { UserContext } from "../../api/Context";
const Info = () => {
  return (
    <div className="info">
      <Outlet />
    </div>
  );
};
export default Info;
