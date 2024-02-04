import React from "react";
import { Outlet } from "react-router-dom";

const QLSX = () => {
  return (
    <div className="qlsx">
      <Outlet />
    </div>
  );
};

export default QLSX;
