import React from "react";
import { Outlet } from "react-router-dom";

const QC = () => {
  return (
    <div className="qc">
      <Outlet />
    </div>
  );
};

export default QC;
