import React, { useState } from "react";
import "./EQ_SUMMARY.scss";

interface EQ_STT {
  FACTORY?: string;
  EQ_NAME?: string;
  EQ_ACTIVE?: string;
  REMARK?: string;
  EQ_STATUS?: string;
  CURR_PLAN_ID?: string;
  CURR_G_CODE?: string;
  INS_EMPL?: string;
  INS_DATE?: string;
  UPD_EMPL?: string;
  UPD_DATE?: string;
  EQ_CODE?: string;
  G_NAME_KD?: string;
}

interface EQ_STT_DATA {
  EQ_DATA: EQ_STT[];
}

const EQ_SUMMARY = ({ EQ_DATA }: EQ_STT_DATA) => {
  const totalFR: number = EQ_DATA?.filter(
    (element: EQ_STT, index: number) =>
      element.EQ_NAME?.substring(0, 2) === "FR"
  ).length;
  const totalSR: number = EQ_DATA?.filter(
    (element: EQ_STT, index: number) =>
      element.EQ_NAME?.substring(0, 2) === "SR"
  ).length;
  const totalDC: number = EQ_DATA?.filter(
    (element: EQ_STT, index: number) =>
      element.EQ_NAME?.substring(0, 2) === "DC"
  ).length;
  const totalED: number = EQ_DATA?.filter(
    (element: EQ_STT, index: number) =>
      element.EQ_NAME?.substring(0, 2) === "ED"
  ).length;

  const totalSTOP_FR: number = EQ_DATA?.filter(
    (element: EQ_STT, index: number) =>
      element.EQ_NAME?.substring(0, 2) === "FR" && element.EQ_STATUS === "STOP"
  ).length;
  const totalSTOP_SR: number = EQ_DATA?.filter(
    (element: EQ_STT, index: number) =>
      element.EQ_NAME?.substring(0, 2) === "SR" && element.EQ_STATUS === "STOP"
  ).length;
  const totalSTOP_DC: number = EQ_DATA?.filter(
    (element: EQ_STT, index: number) =>
      element.EQ_NAME?.substring(0, 2) === "DC" && element.EQ_STATUS === "STOP"
  ).length;
  const totalSTOP_ED: number = EQ_DATA?.filter(
    (element: EQ_STT, index: number) =>
      element.EQ_NAME?.substring(0, 2) === "ED" && element.EQ_STATUS === "STOP"
  ).length;

  const totalSETTING_FR: number = EQ_DATA?.filter(
    (element: EQ_STT, index: number) =>
      element.EQ_NAME?.substring(0, 2) === "FR" &&
      element.EQ_STATUS === "SETTING"
  ).length;
  const totalSETTING_SR: number = EQ_DATA?.filter(
    (element: EQ_STT, index: number) =>
      element.EQ_NAME?.substring(0, 2) === "SR" &&
      element.EQ_STATUS === "SETTING"
  ).length;
  const totalSETTING_DC: number = EQ_DATA?.filter(
    (element: EQ_STT, index: number) =>
      element.EQ_NAME?.substring(0, 2) === "DC" &&
      element.EQ_STATUS === "SETTING"
  ).length;
  const totalSETTING_ED: number = EQ_DATA?.filter(
    (element: EQ_STT, index: number) =>
      element.EQ_NAME?.substring(0, 2) === "ED" &&
      element.EQ_STATUS === "SETTING"
  ).length;

  const totalMASS_FR: number = EQ_DATA?.filter(
    (element: EQ_STT, index: number) =>
      element.EQ_NAME?.substring(0, 2) === "FR" && element.EQ_STATUS === "MASS"
  ).length;
  const totalMASS_SR: number = EQ_DATA?.filter(
    (element: EQ_STT, index: number) =>
      element.EQ_NAME?.substring(0, 2) === "SR" && element.EQ_STATUS === "MASS"
  ).length;
  const totalMASS_DC: number = EQ_DATA?.filter(
    (element: EQ_STT, index: number) =>
      element.EQ_NAME?.substring(0, 2) === "DC" && element.EQ_STATUS === "MASS"
  ).length;
  const totalMASS_ED: number = EQ_DATA?.filter(
    (element: EQ_STT, index: number) =>
      element.EQ_NAME?.substring(0, 2) === "ED" && element.EQ_STATUS === "MASS"
  ).length;

  const displayPercent = (percent: number) => `${(percent * 100).toFixed(0)}%`;

  return (
    <div className='eq_summary'>
      <table>
        <thead>
          <tr>
            <td>Machine</td>
            <td>TOTAL</td>
            <td>STOP</td>
            <td>SETTING</td>
            <td>RUNNING</td>
            <td>OPERATION RATE</td>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>FR</td>
            <td>{totalFR}</td>
            <td>{totalSTOP_FR}</td>
            <td>{totalSETTING_FR}</td>
            <td>{totalMASS_FR}</td>
            <td>
              {totalFR !== 0 ? displayPercent(totalMASS_FR / totalFR) : "0%"}
            </td>
          </tr>
          <tr>
            <td>SR</td>
            <td>{totalSR}</td>
            <td>{totalSTOP_SR}</td>
            <td>{totalSETTING_SR}</td>
            <td>{totalMASS_SR}</td>
            <td>
              {totalSR !== 0 ? displayPercent(totalMASS_SR / totalSR) : "0%"}
            </td>
          </tr>
          <tr>
            <td>DC</td>
            <td>{totalDC}</td>
            <td>{totalSTOP_DC}</td>
            <td>{totalSETTING_DC}</td>
            <td>{totalMASS_DC}</td>
            <td>
              {totalDC !== 0 ? displayPercent(totalMASS_DC / totalDC) : "0%"}
            </td>
          </tr>
          <tr>
            <td>ED</td>
            <td>{totalED}</td>
            <td>{totalSTOP_ED}</td>
            <td>{totalSETTING_ED}</td>
            <td>{totalMASS_ED}</td>
            <td>
              {totalED !== 0 ? displayPercent(totalMASS_ED / totalED) : "0%"}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default EQ_SUMMARY;
