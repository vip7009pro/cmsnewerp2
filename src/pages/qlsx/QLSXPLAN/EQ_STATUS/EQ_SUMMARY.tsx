import React, { useState } from "react";
import "./EQ_SUMMARY.scss";
import { EQ_STT } from "../../../../api/GlobalInterface";

interface EQ_STT_DATA {
  EQ_DATA: EQ_STT[];
}

const EQ_SUMMARY = ({ EQ_DATA }: EQ_STT_DATA) => {
  const eq_series = EQ_DATA.map((e: EQ_STT, index: number) => {
    return e.EQ_SERIES;
  });
  const eq_series_unique: any = [...new Set(eq_series)];

  const totalFR: number = EQ_DATA?.filter(
    (element: EQ_STT, index: number) =>
      element.EQ_NAME?.substring(0, 2) === "FR",
  ).length;
  const totalSR: number = EQ_DATA?.filter(
    (element: EQ_STT, index: number) =>
      element.EQ_NAME?.substring(0, 2) === "SR",
  ).length;
  const totalDC: number = EQ_DATA?.filter(
    (element: EQ_STT, index: number) =>
      element.EQ_NAME?.substring(0, 2) === "DC",
  ).length;
  const totalED: number = EQ_DATA?.filter(
    (element: EQ_STT, index: number) =>
      element.EQ_NAME?.substring(0, 2) === "ED",
  ).length;

  const totalSTOP_FR: number = EQ_DATA?.filter(
    (element: EQ_STT, index: number) =>
      element.EQ_NAME?.substring(0, 2) === "FR" && element.EQ_STATUS === "STOP",
  ).length;
  const totalSTOP_SR: number = EQ_DATA?.filter(
    (element: EQ_STT, index: number) =>
      element.EQ_NAME?.substring(0, 2) === "SR" && element.EQ_STATUS === "STOP",
  ).length;
  const totalSTOP_DC: number = EQ_DATA?.filter(
    (element: EQ_STT, index: number) =>
      element.EQ_NAME?.substring(0, 2) === "DC" && element.EQ_STATUS === "STOP",
  ).length;
  const totalSTOP_ED: number = EQ_DATA?.filter(
    (element: EQ_STT, index: number) =>
      element.EQ_NAME?.substring(0, 2) === "ED" && element.EQ_STATUS === "STOP",
  ).length;

  const totalSETTING_FR: number = EQ_DATA?.filter(
    (element: EQ_STT, index: number) =>
      element.EQ_NAME?.substring(0, 2) === "FR" &&
      element.EQ_STATUS === "SETTING",
  ).length;
  const totalSETTING_SR: number = EQ_DATA?.filter(
    (element: EQ_STT, index: number) =>
      element.EQ_NAME?.substring(0, 2) === "SR" &&
      element.EQ_STATUS === "SETTING",
  ).length;
  const totalSETTING_DC: number = EQ_DATA?.filter(
    (element: EQ_STT, index: number) =>
      element.EQ_NAME?.substring(0, 2) === "DC" &&
      element.EQ_STATUS === "SETTING",
  ).length;
  const totalSETTING_ED: number = EQ_DATA?.filter(
    (element: EQ_STT, index: number) =>
      element.EQ_NAME?.substring(0, 2) === "ED" &&
      element.EQ_STATUS === "SETTING",
  ).length;

  const totalMASS_FR: number = EQ_DATA?.filter(
    (element: EQ_STT, index: number) =>
      element.EQ_NAME?.substring(0, 2) === "FR" && element.EQ_STATUS === "MASS",
  ).length;
  const totalMASS_SR: number = EQ_DATA?.filter(
    (element: EQ_STT, index: number) =>
      element.EQ_NAME?.substring(0, 2) === "SR" && element.EQ_STATUS === "MASS",
  ).length;
  const totalMASS_DC: number = EQ_DATA?.filter(
    (element: EQ_STT, index: number) =>
      element.EQ_NAME?.substring(0, 2) === "DC" && element.EQ_STATUS === "MASS",
  ).length;
  const totalMASS_ED: number = EQ_DATA?.filter(
    (element: EQ_STT, index: number) =>
      element.EQ_NAME?.substring(0, 2) === "ED" && element.EQ_STATUS === "MASS",
  ).length;

  const displayPercent = (percent: number) => `${(percent * 100).toFixed(0)}%`;

  return (
    <div className="eq_summary">
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
          {eq_series_unique.map((e: string, index: number) => {
            return (
              <tr key={index + "A"}>
                <td>{e}</td>
                <td>
                  {
                    EQ_DATA?.filter(
                      (element: EQ_STT, index: number) =>
                        element.EQ_NAME?.substring(0, 2) === e,
                    ).length
                  }
                </td>
                <td>
                  {
                    EQ_DATA?.filter(
                      (element: EQ_STT, index: number) =>
                        element.EQ_NAME?.substring(0, 2) === e &&
                        element.EQ_STATUS === "STOP",
                    ).length
                  }
                </td>
                <td>
                  {
                    EQ_DATA?.filter(
                      (element: EQ_STT, index: number) =>
                        element.EQ_NAME?.substring(0, 2) === e &&
                        element.EQ_STATUS === "SETTING",
                    ).length
                  }
                </td>
                <td>
                  {
                    EQ_DATA?.filter(
                      (element: EQ_STT, index: number) =>
                        element.EQ_NAME?.substring(0, 2) === e &&
                        element.EQ_STATUS === "MASS",
                    ).length
                  }
                </td>
                <td>
                  { displayPercent(
                        (EQ_DATA?.filter(
                          (element: EQ_STT, index: number) =>
                            element.EQ_NAME?.substring(0, 2) === e &&
                            element.EQ_STATUS === "MASS",
                        ).length +
                          EQ_DATA?.filter(
                            (element: EQ_STT, index: number) =>
                              element.EQ_NAME?.substring(0, 2) === e &&
                              element.EQ_STATUS === "SETTING",
                          ).length) /
                          EQ_DATA?.filter(
                            (element: EQ_STT, index: number) =>
                              element.EQ_NAME?.substring(0, 2) === e,
                          ).length,
                      )
                    }
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default EQ_SUMMARY;
