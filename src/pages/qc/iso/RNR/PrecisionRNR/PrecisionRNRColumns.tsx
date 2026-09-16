import React from "react";

export const getRNRDetailColumns = () => [
  {
    field: "FACTORY",
    headerName: "FACTORY",
    width: 80,
    cellRenderer: (params: any) => {
      const val = params.value || "";
      return <span className="rnr-code-cell">{val}</span>;
    },
  },
  {
    field: "FULL_NAME",
    headerName: "FULL_NAME",
    width: 160,
    cellRenderer: (params: any) => {
      return <strong>{params.value || ""}</strong>;
    },
  },
  { field: "SUBDEPTNAME", headerName: "SUBDEPTNAME", width: 100 },
  {
    field: "TEST_EMPL_NO",
    headerName: "TEST_EMPL_NO",
    width: 120,
    cellRenderer: (params: any) => {
      return <span className="rnr-code-cell">{params.value || ""}</span>;
    },
  },
  {
    field: "TEST_DATE",
    headerName: "TEST_DATE",
    width: 100,
    cellRenderer: (params: any) => {
      return <span className="rnr-code-cell">{params.value || ""}</span>;
    },
  },
  {
    field: "TEST_ID",
    headerName: "TEST_ID",
    width: 80,
    cellRenderer: (params: any) => {
      return <span className="rnr-code-cell">{params.value || ""}</span>;
    },
  },
  { field: "TEST_NO", headerName: "TEST_NO", width: 80 },
  { field: "TEST_TYPE", headerName: "TEST_TYPE", width: 80 },
  {
    field: "TEST_NUMBER",
    headerName: "TEST_NUMBER",
    width: 110,
    cellRenderer: (params: any) => {
      return <span className="rnr-code-cell">{params.value ?? ""}</span>;
    },
  },
  {
    field: "TEST_RESULT1",
    headerName: "TEST_RESULT1",
    width: 100,
    cellRenderer: (params: any) => {
      const isMatch = params.data?.TEST_RESULT1 === params.data?.RESULT_OK_NG;
      return (
        <span className={`rnr-cell-badge ${isMatch ? "rnr-cell-badge--true" : "rnr-cell-badge--false"}`}>
          {isMatch ? "TRUE" : "FALSE"}
        </span>
      );
    },
  },
  {
    field: "TEST_NUMBER2",
    headerName: "TEST_NUMBER2",
    width: 110,
    cellRenderer: (params: any) => {
      return <span className="rnr-code-cell">{params.value ?? ""}</span>;
    },
  },
  {
    field: "TEST_REUST2",
    headerName: "TEST_RESULT2",
    width: 100,
    cellRenderer: (params: any) => {
      if (params.data?.TEST_REUST2 !== null && params.data?.TEST_REUST2 !== undefined) {
        const isMatch = params.data?.TEST_REUST2 === params.data?.RESULT_OK_NG;
        return (
          <span className={`rnr-cell-badge ${isMatch ? "rnr-cell-badge--true" : "rnr-cell-badge--false"}`}>
            {isMatch ? "TRUE" : "FALSE"}
          </span>
        );
      }
      return <span className="rnr-cell-badge rnr-cell-badge--na">NA</span>;
    },
  },
  {
    field: "RESULT_OK_NG",
    headerName: "RESULT_OK_NG",
    width: 150,
    cellRenderer: (params: any) => {
      const val = params.value;
      const isOK = val === 1 || val === "OK" || String(val).toUpperCase().includes("OK");
      return (
        <span style={{ fontWeight: 700, color: isOK ? "#16a34a" : "#dc2626" }}>
          {val ?? ""}
        </span>
      );
    },
  },
  { field: "RESULT_DETAIL", headerName: "RESULT_DETAIL", width: 150 },
  {
    field: "UPD_DATE",
    headerName: "UPD_DATE",
    width: 150,
    cellRenderer: (params: any) => {
      return <span className="rnr-code-cell">{params.value || ""}</span>;
    },
  },
  { field: "UPD_EMPL", headerName: "UPD_EMPL", width: 80 },
];

export const getRNRSummaryColumns = () => [
  {
    field: "id",
    headerName: "STT",
    width: 60,
    cellRenderer: (params: any) => {
      return <span className="rnr-code-cell">{Number(params.value ?? 0) + 1}</span>;
    },
  },
  {
    field: "FULL_NAME",
    headerName: "FULL_NAME",
    width: 150,
    cellRenderer: (params: any) => {
      return <strong>{params.value || ""}</strong>;
    },
  },
  { field: "SUBDEPTNAME", headerName: "SUBDEPTNAME", width: 90 },
  {
    field: "TEST_ID",
    headerName: "TEST_ID",
    width: 80,
    cellRenderer: (params: any) => {
      return <span className="rnr-code-cell">{params.value || ""}</span>;
    },
  },
  { field: "TEST_TYPE", headerName: "TEST_TYPE", width: 80 },
  { field: "TEST_NO", headerName: "TEST_NO", width: 70 },
  {
    field: "COUNT1",
    headerName: "COUNT1",
    width: 75,
    cellRenderer: (params: any) => {
      return <span className="rnr-code-cell">{params.value ?? ""}</span>;
    },
  },
  {
    field: "COUNT2",
    headerName: "COUNT2",
    width: 75,
    cellRenderer: (params: any) => {
      return <span className="rnr-code-cell">{params.value ?? ""}</span>;
    },
  },
  {
    field: "SO_CAU",
    headerName: "SO_CAU",
    width: 75,
    cellRenderer: (params: any) => {
      return <span className="rnr-code-cell">{params.value ?? ""}</span>;
    },
  },
  {
    field: "SCORE1",
    headerName: "SCORE1",
    width: 80,
    cellRenderer: (params: any) => {
      const val = Number(params.data?.SCORE1 ?? 0);
      return (
        <span className={`rnr-score-cell ${val >= 80 ? "rnr-score-cell--high" : "rnr-score-cell--low"}`}>
          {val.toLocaleString("en-US", { maximumFractionDigits: 0, minimumFractionDigits: 0 })}
        </span>
      );
    },
  },
  {
    field: "SCORE2",
    headerName: "SCORE2",
    width: 80,
    cellRenderer: (params: any) => {
      if (params.data?.SCORE2 === -1 || params.data?.SCORE2 === null || params.data?.SCORE2 === undefined) {
        return <span className="rnr-score-cell rnr-score-cell--na">N/A</span>;
      }
      const val = Number(params.data?.SCORE2);
      return (
        <span className={`rnr-score-cell ${val >= 80 ? "rnr-score-cell--high" : "rnr-score-cell--low"}`}>
          {val.toLocaleString("en-US", { maximumFractionDigits: 0, minimumFractionDigits: 0 })}
        </span>
      );
    },
  },
  {
    field: "JUDGE1",
    headerName: "JUDGE1",
    width: 85,
    cellRenderer: (params: any) => {
      const isPass = params.data?.JUDGE1 === "PASS";
      return (
        <span className={`rnr-cell-badge ${isPass ? "rnr-cell-badge--pass" : "rnr-cell-badge--fail"}`}>
          {isPass ? "PASS" : "FAIL"}
        </span>
      );
    },
  },
  {
    field: "JUDGE2",
    headerName: "JUDGE2",
    width: 85,
    cellRenderer: (params: any) => {
      if (params.data?.JUDGE2 === "PASS") {
        return <span className="rnr-cell-badge rnr-cell-badge--pass">PASS</span>;
      } else if (params.data?.JUDGE2 === "FAIL") {
        return <span className="rnr-cell-badge rnr-cell-badge--fail">FAIL</span>;
      }
      return <span className="rnr-cell-badge rnr-cell-badge--na">N/A</span>;
    },
  },
  {
    field: "BN_RATE1",
    headerName: "BN_RATE1",
    width: 85,
    cellRenderer: (params: any) => {
      const rate = params.data?.BN_RATE1;
      if (rate === undefined || rate === null) return "";
      return (
        <span className="rnr-code-cell">
          {(Number(rate) * 100).toFixed(0)}%
        </span>
      );
    },
  },
  {
    field: "BS_RATE1",
    headerName: "BS_RATE1",
    width: 85,
    cellRenderer: (params: any) => {
      const rate = params.data?.BS_RATE1;
      if (rate === undefined || rate === null) return "";
      return (
        <span className="rnr-code-cell">
          {(Number(rate) * 100).toFixed(0)}%
        </span>
      );
    },
  },
];

export const getRNRDeptColumns = () => [
  {
    field: "id",
    headerName: "STT",
    width: 60,
    cellRenderer: (params: any) => {
      return <span className="rnr-code-cell">{Number(params.value ?? 0) + 1}</span>;
    },
  },
  {
    field: "SUBDEPTNAME",
    headerName: "BỘ PHẬN",
    width: 150,
    cellRenderer: (params: any) => {
      return <strong>{params.value || "Không xác định"}</strong>;
    },
  },
  {
    field: "TOTAL_EMPL",
    headerName: "SỐ THÍ SINH",
    width: 100,
    cellRenderer: (params: any) => {
      return <span className="rnr-code-cell">{params.value ?? 0}</span>;
    },
  },
  {
    field: "AVG_SCORE1",
    headerName: "ĐIỂM TB (L1)",
    width: 110,
    cellRenderer: (params: any) => {
      const val = Number(params.value ?? 0);
      return (
        <span className={`rnr-score-cell ${val >= 80 ? "rnr-score-cell--high" : "rnr-score-cell--low"}`}>
          {val.toFixed(1)}
        </span>
      );
    },
  },
  {
    field: "PASS_COUNT1",
    headerName: "SỐ PASS (L1)",
    width: 110,
    cellRenderer: (params: any) => {
      return <span className="rnr-code-cell">{params.value ?? 0}</span>;
    },
  },
  {
    field: "PASS_RATE1",
    headerName: "TỶ LỆ PASS (L1)",
    width: 130,
    cellRenderer: (params: any) => {
      const rate = Number(params.value ?? 0);
      return (
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <span style={{ fontWeight: 700, color: rate >= 80 ? "#047857" : "#be123c", minWidth: 38 }}>
            {rate.toFixed(1)}%
          </span>
          <div style={{ flex: 1, height: 4, background: "#e2e8f0", borderRadius: 999, overflow: "hidden" }}>
            <div
              style={{
                width: `${Math.min(100, rate)}%`,
                height: "100%",
                background: rate >= 80 ? "#10b981" : "#f43f5e",
                borderRadius: 999,
              }}
            />
          </div>
        </div>
      );
    },
  },
  {
    field: "AVG_SCORE2",
    headerName: "ĐIỂM TB (L2)",
    width: 110,
    cellRenderer: (params: any) => {
      if (params.value === -1 || params.value === null || params.value === undefined) {
        return <span className="rnr-score-cell rnr-score-cell--na">N/A</span>;
      }
      const val = Number(params.value);
      return (
        <span className={`rnr-score-cell ${val >= 80 ? "rnr-score-cell--high" : "rnr-score-cell--low"}`}>
          {val.toFixed(1)}
        </span>
      );
    },
  },
  {
    field: "PASS_COUNT2",
    headerName: "SỐ PASS (L2)",
    width: 110,
    cellRenderer: (params: any) => {
      return <span className="rnr-code-cell">{params.value ?? 0}</span>;
    },
  },
  {
    field: "PASS_RATE2",
    headerName: "TỶ LỆ PASS (L2)",
    width: 130,
    cellRenderer: (params: any) => {
      if (params.value === -1 || params.value === null || params.value === undefined) {
        return <span className="rnr-score-cell rnr-score-cell--na">N/A</span>;
      }
      const rate = Number(params.value);
      return (
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <span style={{ fontWeight: 700, color: rate >= 80 ? "#047857" : "#be123c", minWidth: 38 }}>
            {rate.toFixed(1)}%
          </span>
          <div style={{ flex: 1, height: 4, background: "#e2e8f0", borderRadius: 999, overflow: "hidden" }}>
            <div
              style={{
                width: `${Math.min(100, rate)}%`,
                height: "100%",
                background: rate >= 80 ? "#10b981" : "#f43f5e",
                borderRadius: 999,
              }}
            />
          </div>
        </div>
      );
    },
  },
];
