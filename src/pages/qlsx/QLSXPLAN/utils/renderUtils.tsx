import React from "react";
import CHITHI_COMPONENT from "../CHITHI/CHITHI_COMPONENT";
import CHITHI_COMPONENT2 from "../CHITHI/CHITHI_COMPONENT2";
import YCSXComponent from "../../../kinhdoanh/ycsxmanager/YCSXComponent/YCSXComponent";
import DrawComponent from "../../../kinhdoanh/ycsxmanager/DrawComponent/DrawComponent";
import { getCompany } from "../../../../api/Api";
import { QLSXPLANDATA } from "../interfaces/khsxInterface";
import { YCSXTableData } from "../../../kinhdoanh/interfaces/kdInterface";

/**
 * Render CHITHI components from a list of plans.
 * @param planlist - Array of QLSXPLANDATA to render
 * @param ref - React ref for CHITHI_COMPONENT
 * @returns JSX elements for each plan
 */
export const renderChiThi = (planlist: QLSXPLANDATA[], ref: any) => {
  const company = getCompany();
  return planlist.map((element, index) => (
    <CHITHI_COMPONENT ref={ref} key={index} DATA={element} />
  ));
};

/**
 * Render CHITHI2 component from a list of plans.
 * @param planlist - Array of QLSXPLANDATA to render
 * @param ref - React ref for CHITHI_COMPONENT2
 * @returns JSX element for plan list
 */
export const renderChiThi2 = (planlist: QLSXPLANDATA[], ref: any) => {
  const company = getCompany();
  return <CHITHI_COMPONENT2 ref={ref} PLAN_LIST={planlist} />;
};

/**
 * Render YCSX components from a list of YCSX data.
 * @param ycsxlist - Array of YCSXTableData to render
 * @returns JSX elements for each YCSX
 */
export const renderYCSX = (ycsxlist: YCSXTableData[]) => {
  return ycsxlist.map((element, index) => (
    <YCSXComponent key={index} DATA={element} />
  ));
};

/**
 * Render BanVe (drawing) components from a list of YCSX data.
 * Shows DrawComponent if BANVE=Y, otherwise shows placeholder message.
 * @param ycsxlist - Array of YCSXTableData to render
 * @returns JSX elements for each drawing or placeholder
 */
export const renderBanVe = (ycsxlist: YCSXTableData[]) => {
  return ycsxlist.map((element, index) =>
    element.BANVE === "Y" ? (
      <DrawComponent
        key={index}
        G_CODE={element.G_CODE}
        PDBV={element.PDBV}
        PROD_REQUEST_NO={element.PROD_REQUEST_NO}
        PDBV_EMPL={element.PDBV_EMPL}
        PDBV_DATE={element.PDBV_DATE}
      />
    ) : (
      <div>Code: {element.G_NAME} : Không có bản vẽ</div>
    )
  );
};
