import React from "react";
import CHITHI_COMPONENT from "../../CHITHI/CHITHI_COMPONENT";
import YCKT from "../../YCKT/YCKT";
import YCSXComponent from "../../../../kinhdoanh/ycsxmanager/YCSXComponent/YCSXComponent";
import DrawComponent from "../../../../kinhdoanh/ycsxmanager/DrawComponent/DrawComponent";
import { YCSXTableData } from "../../../../kinhdoanh/interfaces/kdInterface";
import { QLSXPLANDATA } from "../../interfaces/khsxInterface";

export const renderYCKT = (planlist: QLSXPLANDATA[]) => {
  return planlist.map((element, index) => <YCKT key={index} DATA={element} />);
};

export const renderChiThi = (planlist: QLSXPLANDATA[]) => {
  return planlist.map((element, index) => (
    <CHITHI_COMPONENT key={index} DATA={element} />
  ));
};

export const renderYCSX = (ycsxlist: YCSXTableData[]) => {
  return ycsxlist.map((element, index) => (
    <YCSXComponent key={index} DATA={element} />
  ));
};

export const renderBanVe = (ycsxlist: YCSXTableData[]) => {
  return ycsxlist.map((element, index) =>
    element.BANVE === "Y" ? (
      <DrawComponent
        key={`${element.G_CODE}_${element.PROD_REQUEST_NO || index}_${index}`}
        G_CODE={element.G_CODE}
        PDBV={element.PDBV}
        PROD_REQUEST_NO={element.PROD_REQUEST_NO}
        PDBV_EMPL={element.PDBV_EMPL}
        PDBV_DATE={element.PDBV_DATE}
      />
    ) : (
      <div key={index} style={{ padding: 10, color: "red" }}>
        Code: {element.G_NAME} : Không có bản vẽ
      </div>
    )
  );
};
