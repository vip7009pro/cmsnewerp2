import React, { useContext, useRef, useState } from "react";
import "./DocumentComponent.scss";
import Pdf, { usePdf } from "@mikecousins/react-pdf";
import moment from "moment";
import { useSelector } from "react-redux";
import { UserData } from "../../api/GlobalInterface";
import { RootState } from "../../redux/store";
import { IconButton } from "@mui/material";


const DocumentComponent = ({
  M_ID,
  DOC_TYPE,
  VER,
}: {
  M_ID: number;
  DOC_TYPE?: string;
  VER?: number;
}) => {
  const userData: UserData | undefined = useSelector(
    (state: RootState) => state.totalSlice.userData,
  );
  const [page, setPage] = useState(1);
  const canvasRef = useRef(null);
  let draw_path = "/materialdocs/";
  console.log('filepath',draw_path + M_ID + '_' + DOC_TYPE + '_' + VER + ".pdf");
  const { pdfDocument, pdfPage } = usePdf({
    file: draw_path + M_ID + '_' + DOC_TYPE + '_' + VER + ".pdf",
    //file: 'http://192.168.1.192/materialdocs/706_TDS_1.pdf',
    page,
    scale: 3,
    canvasRef,
  });
  
    
  return (
    <div className="documentcomponent" style={{width: '100%', height: '100%', zIndex: 1000}}>
      <div style={{display: 'flex', flexDirection: 'row', gap: '10px', alignItems: 'center', justifyContent: 'center'}}>
        <IconButton size="small" onClick={() => setPage(page - 1)}>Prev</IconButton>
        <IconButton size="small" onClick={() => setPage(page + 1)}>Next</IconButton>
        <div style={{fontSize: '12px', fontWeight: 'bold'}}>Page: {page}</div>
      </div>
      <canvas className="draw" ref={canvasRef} />
    </div>
  );
};

export default DocumentComponent;
