import React from "react";
import { GiArchiveRegister, GiCurvyKnife } from "react-icons/gi";
import { AiFillSetting } from "react-icons/ai";
import { HiLogout, HiOutlineQrcode } from "react-icons/hi";
import { TbPrinter, TbReportAnalytics } from "react-icons/tb";
import "./PLAN_STATUS_COMPONENTS.scss";
import { LinearProgressWithLabel } from "../../../../components/Navbar/AccountInfo/AccountInfo";
import { SX_DATA } from "../../../../api/GlobalInterface";
const PLAN_STATUS_COMPONENTS = ({ DATA }: { DATA: SX_DATA }) => {
  let kq_tem: number =
    DATA.CHOTBC === null
      ? DATA.KQ_SX_TAM === null
        ? 0
        : DATA.KQ_SX_TAM
      : DATA.KETQUASX;
  let phantram_tem: number =
    DATA.PLAN_QTY === 0 ? 0 : (kq_tem / DATA.PLAN_QTY) * 100;
  let backgroundColor: string = "white";
  if (kq_tem > 0) {
    backgroundColor = "#c9f261";
  } else {
    backgroundColor = "white";
  }
  /* if(phantram_tem >=0 && phantram_tem <20) 
{
    backgroundColor ='#ccccff';
}
if(phantram_tem >=20 && phantram_tem <40) 
{
    backgroundColor ='#66ffff';
}
if(phantram_tem >=40 && phantram_tem <60) 
{
    backgroundColor ='#00e6e6';
}
if(phantram_tem >=60 && phantram_tem <80) 
{
    backgroundColor ='#00ffcc';
}
if(phantram_tem >=80 && phantram_tem <=100) 
{
    backgroundColor ='#00ff00';
}
if(phantram_tem >100 && phantram_tem <=110) 
{
    backgroundColor ='#ff6666';
}
if(phantram_tem >110) 
{
    backgroundColor ='#ff3333';
} */
  return (
    <div className="plan_status_component">
      <div
        className="flag"
        style={{
          backgroundColor: "green",
          padding: "10px",
          width: "20px",
          color: "white",
        }}
      >
        {DATA.id + 1}
      </div>
      <div
        className="flag"
        style={{ backgroundColor: "yellow", padding: "10px" }}
      >
        {DATA.PLAN_ID}
      </div>
      <div
        className="flag"
        style={{
          backgroundColor: "#fabd6e",
          padding: "10px",
          color: "black",
          width: "180px",
          overflow: "hidden",
        }}
      >
        <HiOutlineQrcode color="black" size={15} /> {DATA.G_NAME_KD}
      </div>
      <div
        className="flag"
        style={{ backgroundColor: "#6efad7", padding: "10px" }}
      >
        {DATA.PLAN_DATE}
      </div>
      <div
        className="flag"
        style={{ backgroundColor: "#6efad7", padding: "10px" }}
      >
        {DATA.WORK_SHIFT === null
          ? "CHƯA SX"
          : DATA.WORK_SHIFT === "DAY"
            ? "CA_NGÀY"
            : "CA__ĐÊM"}
      </div>
      <div
        className="flag"
        style={{ backgroundColor: "#5230fc", padding: "10px", color: "yellow" }}
      >
        {DATA.PLAN_FACTORY}
      </div>
      <div
        className="flag"
        style={{ backgroundColor: "#5230fc", padding: "10px", color: "yellow" }}
      >
        {DATA.PLAN_EQ}
      </div>
      <div
        className="flag"
        style={{
          backgroundColor: DATA.STEP === 0 ? "yellow" : "#fcba03",
          padding: "10px",
          color: "black",
        }}
      >
        STEP: {DATA.STEP === 0 ? "F" : DATA.STEP}
      </div>
      <div
        className="flag"
        style={{
          backgroundColor: DATA.XUATDAO === null ? "red" : "#6ffa48",
          padding: "10px",
          width: "200px",
          color: DATA.XUATDAO === null ? "white" : "black",
        }}
      >
        <GiCurvyKnife color="black" size={15} />{" "}
        {DATA.XUATDAO === null ? `CHƯA XUẤT DAO` : `ĐÃ XUẤT DAO`}
      </div>
      <div
        className="flag"
        style={{
          backgroundColor: DATA.SETTING_START_TIME === null ? "red" : "#6ffa48",
          padding: "10px",
          width: "200px",
          color: DATA.SETTING_START_TIME === null ? "white" : "black",
        }}
      >
        <AiFillSetting color="black" size={15} />{" "}
        {DATA.SETTING_START_TIME === null ? `CHƯA BĐ SETTING` : `ĐÃ BĐ SETTING`}
      </div>
      <div
        className="flag"
        style={{
          backgroundColor: DATA.MASS_START_TIME === null ? "red" : "#6ffa48",
          padding: "10px",
          width: "200px",
          color: DATA.MASS_START_TIME === null ? "white" : "black",
        }}
      >
        <AiFillSetting color="black" size={15} />{" "}
        {DATA.MASS_START_TIME === null ? `CHƯA KT SETTING` : `ĐÃ KT SETTING`}
      </div>
      <div
        className="flag"
        style={{
          backgroundColor: DATA.DKXL === null ? "red" : "#6ffa48",
          padding: "10px",
          width: "220px",
          color: DATA.DKXL === null ? "white" : "black",
        }}
      >
        <GiArchiveRegister color="black" size={15} />{" "}
        {DATA.DKXL === null ? `CHƯA ĐĂNG KÝ XL` : `ĐÃ ĐĂNG KÝ XL`}
      </div>
      <div
        className="flag"
        style={{
          backgroundColor: DATA.XUATLIEU === null ? "red" : "#6ffa48",
          padding: "10px",
          width: "220px",
          color: DATA.XUATLIEU === null ? "white" : "black",
        }}
      >
        <HiLogout color="black" size={15} />{" "}
        {DATA.XUATLIEU === null ? `CHƯA XUẤT LIỆU CHÍNH` : `ĐÃ XUẤT LIỆU CHÍNH`}
      </div>
      <div
        className="flag"
        style={{
          backgroundColor: DATA.IN_TEM === null ? "red" : "#6ffa48",
          padding: "10px",
          width: "200px",
          color: DATA.IN_TEM === null ? "white" : "black",
        }}
      >
        <TbPrinter color="black" size={15} />{" "}
        {DATA.IN_TEM === null ? `CHƯA IN TEM` : `ĐÃ IN TEM`}
      </div>
      <div
        className="flag"
        style={{
          backgroundColor: DATA.CHOTBC === null ? "red" : "#6ffa48",
          padding: "10px",
          width: "200px",
          color: DATA.CHOTBC === null ? "white" : "black",
        }}
      >
        <TbReportAnalytics color="black" size={15} />{" "}
        {DATA.CHOTBC === null ? `CHƯA CHỐT BC` : `ĐÃ CHỐT BC`}
      </div>
      <div
        className="flag"
        style={{
          backgroundColor: backgroundColor,
          padding: "10px",
          color: "black",
          width: "200px",
          justifySelf: "center",
          fontWeight: "bold",
        }}
      >
        <b>
          {kq_tem?.toLocaleString("en-US")}/{" "}
          {DATA.PLAN_QTY?.toLocaleString("en-US")}{" "}
        </b>
        <LinearProgressWithLabel value={phantram_tem} />
      </div>
    </div>
  );
};
export default PLAN_STATUS_COMPONENTS;
