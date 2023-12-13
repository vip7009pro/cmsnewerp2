import React, { useState } from "react";
import "./INS_SUMMARY.scss";
import { EQ_STT, INS_STATUS } from "../../../../api/GlobalInterface";

interface EQ_STT_DATA {
  EQ_DATA: EQ_STT[];
}
interface INS_STT_DATA {
  INS_DATA: INS_STATUS[];
}

const INS_SUMMARY2 = ({ INS_DATA }: INS_STT_DATA) => {
  let totalSheetA: number = 0;
  let totalRollB: number = 0;
  let totalNormal: number = 0;
  let totalOLED: number = 0;
  let totalUV: number = 0;
  for (let i = 0; i < INS_DATA.length; i++) {
    totalSheetA += INS_DATA[i].KHUVUC === "A" ? INS_DATA[i].EMPL_COUNT : 0;
    totalRollB += INS_DATA[i].KHUVUC === "B" ? INS_DATA[i].EMPL_COUNT : 0;
    totalNormal += INS_DATA[i].KHUVUC === "N" ? INS_DATA[i].EMPL_COUNT : 0;
    totalOLED += INS_DATA[i].KHUVUC === "O" ? INS_DATA[i].EMPL_COUNT : 0;
    totalUV += INS_DATA[i].KHUVUC === "U" ? INS_DATA[i].EMPL_COUNT : 0;
  }

  return (
    <div className="INS_SUMMARY">
      <table>
        <thead>
          <tr>
            <td>Xưởng</td>
            <td>Khu Vực</td>
            <td>Người</td>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>NM2</td>
            <td>NORMAL</td>
            <td>{totalNormal}</td>
          </tr>
          <tr>
            <td>NM2</td>
            <td>OLED</td>
            <td>{totalOLED}</td>
          </tr>
          <tr>
            <td>NM2</td>
            <td>UV</td>
            <td>{totalUV}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default INS_SUMMARY2;
