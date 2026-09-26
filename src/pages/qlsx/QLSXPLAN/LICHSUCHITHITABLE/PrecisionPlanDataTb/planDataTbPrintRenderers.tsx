import React, { ReactElement } from "react";
import DrawComponent from "../../../../kinhdoanh/ycsxmanager/DrawComponent/DrawComponent";
import { QLSXPLANDATA } from "../../interfaces/khsxInterface";

export const renderBanVe2 = (ycsxlist: QLSXPLANDATA[]): ReactElement[] => {
  return ycsxlist.map((element, index) => (
    <DrawComponent
      key={`${element.G_CODE}_${element.PLAN_ID || index}_${index}`}
      G_CODE={element.G_CODE}
      PDBV={element.PDBV}
      PROD_REQUEST_NO={element.PROD_REQUEST_NO}
      PDBV_EMPL={element.PDBV_EMPL}
      PDBV_DATE={element.PDBV_DATE}
    />
  ));
};
