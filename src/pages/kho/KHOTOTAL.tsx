import React, { useContext, useRef } from "react";
import { Outlet } from "react-router-dom";
import { UserContext } from "../../api/Context";
const KHOTOTAL = () => {
  return (
    <div className="kinhdoanh">
      <Outlet />
    </div>
  );
};
export default KHOTOTAL;
