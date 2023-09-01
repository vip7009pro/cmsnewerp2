import React from "react";
import { Outlet } from "react-router-dom";
import "./Nhansu.scss";

const NhanSu = () => {
  return (
    <div>
      <Outlet />
    </div>
  );
};

export default NhanSu;
