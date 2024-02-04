import React from "react";
import { Outlet } from "react-router-dom";

const MUAHANG = () => {
  return (
    <div className="muahang">
      <Outlet />
    </div>
  );
};

export default MUAHANG;
