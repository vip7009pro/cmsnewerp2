import React from "react";
import { GiArchiveRegister, GiCurvyKnife } from "react-icons/gi";
import { AiFillSetting } from "react-icons/ai";
import { HiLogout, HiOutlineQrcode } from "react-icons/hi";
import { TbReportAnalytics } from "react-icons/tb";

import "./NGBYTYPE.scss";
interface SX_DATA {
  id: number;
  PLAN_ID?: string;
  PLAN_DATE?: string;
  PLAN_EQ?: string;
  G_NAME?: string;
  G_NAME_KD?: string;
  XUATDAO?: string;
  SETTING_START_TIME?: string;
  MASS_START_TIME?: string;
  MASS_END_TIME?: string;
  DKXL?: string;
  XUATLIEU?: string;
  CHOTBC?: number;
}

const NGBYTYPE = ({
  id,
  PLAN_ID,
  PLAN_DATE,
  PLAN_EQ,
  G_NAME,
  G_NAME_KD,
  XUATDAO,
  SETTING_START_TIME,
  MASS_START_TIME,
  MASS_END_TIME,
  DKXL,
  XUATLIEU,
  CHOTBC,
}: SX_DATA) => {
  return (
    <div className="ngbytype">
      <div
        className="flag"
        style={{
          backgroundColor: "green",
          padding: "10px",
          width: "20px",
          color: "white",
        }}
      >
        {id + 1}
      </div>
      <div
        className="flag"
        style={{ backgroundColor: "yellow", padding: "10px" }}
      >
        {PLAN_ID}
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
        <HiOutlineQrcode color="black" size={15} /> {G_NAME_KD}
      </div>
      <div
        className="flag"
        style={{ backgroundColor: "#6efad7", padding: "10px" }}
      >
        {PLAN_DATE}
      </div>
      <div
        className="flag"
        style={{ backgroundColor: "#5230fc", padding: "10px", color: "yellow" }}
      >
        {PLAN_EQ}
      </div>
      <div
        className="flag"
        style={{
          backgroundColor: XUATDAO === null ? "red" : "#6ffa48",
          padding: "10px",
          width: "200px",
          color: XUATDAO === null ? "white" : "black",
        }}
      >
        <GiCurvyKnife color="black" size={15} />{" "}
        {XUATDAO === null ? `CHƯA XUẤT DAO` : `ĐÃ XUẤT DAO`}
      </div>
      <div
        className="flag"
        style={{
          backgroundColor: SETTING_START_TIME === null ? "red" : "#6ffa48",
          padding: "10px",
          width: "200px",
          color: SETTING_START_TIME === null ? "white" : "black",
        }}
      >
        <AiFillSetting color="black" size={15} />{" "}
        {SETTING_START_TIME === null ? `CHƯA BĐ SETTING` : `ĐÃ BĐ SETTING`}
      </div>
      <div
        className="flag"
        style={{
          backgroundColor: MASS_START_TIME === null ? "red" : "#6ffa48",
          padding: "10px",
          width: "200px",
          color: MASS_START_TIME === null ? "white" : "black",
        }}
      >
        <AiFillSetting color="black" size={15} />{" "}
        {MASS_END_TIME === null ? `CHƯA KT SETTING` : `ĐÃ KT SETTING`}
      </div>
      <div
        className="flag"
        style={{
          backgroundColor: DKXL === null ? "red" : "#6ffa48",
          padding: "10px",
          width: "220px",
          color: DKXL === null ? "white" : "black",
        }}
      >
        <GiArchiveRegister color="black" size={15} />{" "}
        {DKXL === null ? `CHƯA ĐĂNG KÝ XL` : `ĐÃ ĐĂNG KÝ XL`}
      </div>
      <div
        className="flag"
        style={{
          backgroundColor: XUATLIEU === null ? "red" : "#6ffa48",
          padding: "10px",
          width: "220px",
          color: XUATLIEU === null ? "white" : "black",
        }}
      >
        <HiLogout color="black" size={15} />{" "}
        {XUATLIEU === null ? `CHƯA XUẤT LIỆU CHÍNH` : `ĐÃ XUẤT LIỆU CHÍNH`}
      </div>
      <div
        className="flag"
        style={{
          backgroundColor: CHOTBC === null ? "red" : "#6ffa48",
          padding: "10px",
          width: "200px",
          color: CHOTBC === null ? "white" : "black",
        }}
      >
        <TbReportAnalytics color="black" size={15} />{" "}
        {CHOTBC === null ? `CHƯA CHỐT BC` : `ĐÃ CHỐT BC`}
      </div>
    </div>
  );
};

export default NGBYTYPE;
