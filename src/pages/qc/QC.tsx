import React from "react";
import { Outlet } from "react-router-dom";

const QC = () => {
  return (
    /* `route-outlet-wrapper` = route layout trung gian (pass-through) bọc <Outlet/>.
     * Cần class này để home.scss ép co giãn đúng (xem `.route-outlet-wrapper` trong home.scss). */
    <div className="qc route-outlet-wrapper">
      <Outlet />
    </div>
  );
};

export default QC;
