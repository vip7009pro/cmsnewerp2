import React from "react";
import { Outlet } from "react-router-dom";
import "./SANXUAT.scss";
const SANXUAT = () => {
  return (
    <div className="sx">
      <Outlet />
    </div>
  );
};
export default SANXUAT;
