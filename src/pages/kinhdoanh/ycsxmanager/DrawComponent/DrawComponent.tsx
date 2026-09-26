import { memo, useMemo, useRef, useState } from "react";
import "./DrawComponent.scss";
import { usePdf } from "@mikecousins/react-pdf";
import moment from "moment";
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
  const [page] = useState(1);
  const canvasRef = useRef(null);
  const draw_path = "/banve/";

  // Cache-busting: Sinh URL ngẫu nhiên theo từng G_CODE và phiên render
  // useMemo giữ URL ổn định trong suốt vòng đời render canvas của G_CODE đó,
  // tránh trigger re-fetch vô tận trong usePdf, đồng thời đảm bảo mỗi khi G_CODE đổi
  // hoặc mở lại modal sẽ luôn fetch file mới nhất từ server.
  const fileUrl = useMemo(() => {
    if (!G_CODE) return "";
    const timestamp = Date.now();
    const randomSalt = Math.random().toString(36).substring(2, 7);
    return `${draw_path}${encodeURIComponent(G_CODE)}.pdf?v=${timestamp}_${randomSalt}`;
  }, [G_CODE]);

  const { pdfDocument, pdfPage } = usePdf({
    file: fileUrl,
    page,
    scale: 3,
    canvasRef,
  });

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

export default memo(DrawComponent);
