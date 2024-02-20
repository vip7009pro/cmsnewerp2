import React, { useContext, useRef, useState } from "react";
import "./DrawComponent.scss";
import Pdf, { usePdf } from "@mikecousins/react-pdf";
import moment from "moment";
import { UserContext } from "../../../../api/Context";
import { useSelector } from "react-redux";
import { RootState } from "../../../../redux/store";
import { UserData } from "../../../../api/GlobalInterface";

const DrawComponent = ({
  G_CODE,
  PDBV,
  PDBV_EMPL,
  PDBV_DATE,
  PROD_REQUEST_NO,
}: {
  G_CODE: string;
  PDBV_EMPL?: string;
  PDBV_DATE?: string;
  PDBV?: string;
  PROD_REQUEST_NO?: string;
}) => {
  const userData: UserData | undefined = useSelector(
    (state: RootState) => state.totalSlice.userData,
  );
  const [page, setPage] = useState(1);
  const canvasRef = useRef(null);
  let draw_path = "/banve/";
  console.log(draw_path + G_CODE + ".pdf");
  const { pdfDocument, pdfPage } = usePdf({
    file: draw_path + G_CODE + ".pdf",
    page,
    scale: 3,
    canvasRef,
  });
  
  console.log('PDBV',PDBV);
  return (
    <div className="drawcomponent">
      <canvas className="draw" ref={canvasRef} />
      {PDBV === "Y" && (
        <div className="qcpass">
          <img alt="qcpass" src="/QC PASS20.png" width={220} height={200} />
        </div>
      )}
      <span className="approval_info2">TKIN: {userData?.EMPL_NO}</span>
      {PDBV === "Y" && (
        <span className="approval_info">
          | TTPD: {PDBV_EMPL}_
          {moment.utc(PDBV_DATE).format("YYYY-MM-DD HH:mm:ss")} | YCSX:{" "}
          {PROD_REQUEST_NO}
        </span>
      )}
      {PDBV === "Y" && (
        <div className="qcpass2">
          <img alt="qcpass2" src="/QC PASS20.png" width={220} height={200} />
        </div>
      )}
    </div>
  );
};

export default DrawComponent;
