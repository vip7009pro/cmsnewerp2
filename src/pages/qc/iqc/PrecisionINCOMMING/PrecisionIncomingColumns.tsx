// PrecisionIncomingColumns.tsx - High-Density Column Configurations with text truncation and tooltips
import React from "react";
import { IQC_INCOMMING_DATA, DTC_DATA } from "../../interfaces/qcInterface";
import { AiOutlineCloudUpload } from "react-icons/ai";
import { MdUpdate } from "react-icons/md";

interface ColumnOptions {
  isWorker: boolean;
  onUpdateRow: (row: IQC_INCOMMING_DATA) => void;
  onUploadChecksheet: (file: File, iqc1Id: number) => void;
  onToggleField: (row: IQC_INCOMMING_DATA, field: keyof IQC_INCOMMING_DATA, checked: boolean) => void;
  sampleKeys?: string[];
}

const renderTruncated = (val: any) => (
  <span className="cell-truncate" title={val ?? ""}>
    {val ?? ""}
  </span>
);

const renderDefectLink = (p: any) =>
  p.data.NCR_DEFECT_IMAGE === "Y" && p.data.NCR_ID ? (
    <a className="row-action-btn row-action-btn--link" href={`/ncrimage/NCR_${p.data.NCR_ID}.png`} target="_blank" rel="noreferrer">
      LINK
    </a>
  ) : null;

const renderCountermeasureLink = (p: any) =>
  p.data.NCR_COUNTERMEASURE === "Y" && p.data.NCR_ID ? (
    <a className="row-action-btn row-action-btn--link" href={`/ncrimage/NCR_${p.data.NCR_ID}.${p.data.NCR_COUNTERMEASURE_EXT || "pdf"}`} target="_blank" rel="noreferrer">
      LINK
    </a>
  ) : null;

export const getIncomingColumns = (options: ColumnOptions) => {
  const { isWorker, onUpdateRow, onUploadChecksheet, onToggleField, sampleKeys = [] } = options;

  const renderStatusChip = (value: string | undefined) => {
    const val = (value || "PD").toUpperCase();
    if (val === "OK") return <span className="chip-status chip-status--ok">OK</span>;
    if (val === "NG") return <span className="chip-status chip-status--ng">NG</span>;
    return <span className="chip-status chip-status--pd">PD</span>;
  };

  const renderCheckboxStatus = (row: any, field: keyof IQC_INCOMMING_DATA) => (
    <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
      <input
        type="checkbox"
        checked={row[field] === "OK"}
        onChange={(e) => onToggleField(row, field, e.target.checked)}
      />
      {renderStatusChip(row[field] as string)}
    </div>
  );

  const renderOkNgCell = (data: any, key: string) => {
    const val = data[key];
    if (val === 1) return <span className="chip-status chip-status--ok">OK</span>;
    if (val === 0) return <span className="chip-status chip-status--ng">NG</span>;
    if (val === 2) return <span className="chip-status chip-status--pd">PENDING</span>;
    return <span className="chip-status chip-status--na">N/A</span>;
  };

  const renderUploadCell = (data: IQC_INCOMMING_DATA) => {
    if (data.CHECKSHEET === "Y") {
      const ext = data.IQC1_ID ? "pdf" : "jpg";
      return (
        <a
          className="row-action-btn row-action-btn--link"
          href={`/iqcincoming/${data.IQC1_ID}.${ext}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          LINK
        </a>
      );
    }
    return (
      <label className="row-action-btn row-action-btn--upload" style={{ cursor: "pointer" }}>
        <AiOutlineCloudUpload size={13} />
        <span>Upload</span>
        <input
          type="file"
          accept=".pdf,.jpg,.png"
          style={{ display: "none" }}
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) {
              onUploadChecksheet(file, data.IQC1_ID);
              e.target.value = "";
            }
          }}
        />
      </label>
    );
  };

  if (isWorker) {
    return [
      { field: "IQC1_ID", headerName: "ID", width: 50, headerCheckboxSelection: true, checkboxSelection: true },
      { field: "NCR_ID", headerName: "NCR_ID", width: 80, tooltipField: "NCR_ID" },
      { field: "NCR_DEFECT_IMAGE", headerName: "DEFECT_IMG", width: 90, cellRenderer: renderDefectLink },
      { field: "NCR_COUNTERMEASURE", headerName: "COUNTERMEASURE", width: 120, cellRenderer: renderCountermeasureLink },
      {
        field: "M_NAME",
        headerName: "M_NAME",
        width: 120,
        tooltipField: "M_NAME",
        cellRenderer: (p: any) => (
          <span className="cell-truncate cell-m-name" title={p.data?.M_NAME}>
            {p.data?.M_NAME}
          </span>
        ),
      },
      { field: "WIDTH_CD", headerName: "SIZE", width: 45 },
      {
        field: "M_LOT_NO",
        headerName: "M_LOT_NO",
        width: 95,
        tooltipField: "M_LOT_NO",
        cellRenderer: (p: any) => (
          <div className="lot-highlight cell-truncate" title={p.data?.M_LOT_NO}>
            {p.data?.M_LOT_NO}
          </div>
        ),
      },
      {
        field: "UDPATE",
        headerName: "ACTION",
        width: 75,
        cellRenderer: (p: any) => (
          <button className="row-action-btn row-action-btn--update" onClick={() => onUpdateRow(p.data)}>
            <MdUpdate size={12} />
            <span>Update</span>
          </button>
        ),
      },
      { field: "NQ_CHECK_ROLL", headerName: "NQ", width: 45 },
      { field: "TOTAL_RESULT", headerName: "TT_RESULT", width: 85, cellRenderer: (p: any) => renderCheckboxStatus(p.data, "TOTAL_RESULT") },
      { field: "IQC_TEST_RESULT", headerName: "IQC_CHECK", width: 85, cellRenderer: (p: any) => renderCheckboxStatus(p.data, "IQC_TEST_RESULT") },
      { field: "DTC_RESULT", headerName: "DTC_CHECK", width: 85, cellRenderer: (p: any) => renderCheckboxStatus(p.data, "DTC_RESULT") },
      { field: "REMARK", headerName: "REMARK", width: 90, tooltipField: "REMARK", cellRenderer: (p: any) => renderTruncated(p.data?.REMARK) },
      { field: "CHECKSHEET", headerName: "OUTGOING", width: 85, cellRenderer: (p: any) => renderUploadCell(p.data) },
    ];
  }

  const baseColumns: any[] = [
    { field: "IQC1_ID", headerName: "IQC1_ID", width: 75, headerCheckboxSelection: true, checkboxSelection: true },
    { field: "INS_DATE", headerName: "REG_DATE", width: 80, tooltipField: "INS_DATE" },
    { field: "M_CODE", headerName: "M_CODE", width: 75, tooltipField: "M_CODE" },
    {
      field: "M_NAME",
      headerName: "M_NAME",
      width: 140,
      tooltipField: "M_NAME",
      cellRenderer: (p: any) => (
        <span className="cell-truncate cell-m-name" title={p.data?.M_NAME}>
          {p.data?.M_NAME}
        </span>
      ),
    },
    { field: "WIDTH_CD", headerName: "SIZE", width: 45 },
    {
      field: "M_LOT_NO",
      headerName: "M_LOT_NO",
      width: 100,
      tooltipField: "M_LOT_NO",
      cellRenderer: (p: any) => {
        const res = p.data?.TOTAL_RESULT;
        const cls = res === "OK" ? "lot-highlight--ok" : res === "NG" ? "lot-highlight--ng" : "lot-highlight--pd";
        return (
          <div className={`lot-highlight ${cls} cell-truncate`} title={p.data?.M_LOT_NO}>
            {p.data?.M_LOT_NO}
          </div>
        );
      },
    },
    { field: "LOT_CMS", headerName: "LOT_CMS", width: 80, tooltipField: "LOT_CMS", cellRenderer: (p: any) => renderTruncated(p.data?.LOT_CMS) },
    { field: "LOTNCC", headerName: "LOT_VENDOR", width: 90, tooltipField: "LOTNCC", cellRenderer: (p: any) => renderTruncated(p.data?.LOTNCC) },
    { field: "LOT_VENDOR_IQC", headerName: "LOT_VENDOR_IQC", width: 95, tooltipField: "LOT_VENDOR_IQC", cellRenderer: (p: any) => renderTruncated(p.data?.LOT_VENDOR_IQC) },
    { field: "CUST_CD", headerName: "CUST_CD", width: 65, tooltipField: "CUST_CD" },
    { field: "CUST_NAME_KD", headerName: "CUST_NAME", width: 90, tooltipField: "CUST_NAME_KD", cellRenderer: (p: any) => renderTruncated(p.data?.CUST_NAME_KD) },
    { field: "EXP_DATE", headerName: "EXP_DATE", width: 80, tooltipField: "EXP_DATE" },
    { field: "INPUT_LENGTH", headerName: "LENGTH", width: 70 },
    { field: "TOTAL_ROLL", headerName: "ROLLS", width: 50 },
    { field: "NQ_AQL", headerName: "NQ_AQL", width: 50 },
    { field: "NQ_CHECK_ROLL", headerName: "NQ_ROLL", width: 50 },
    {
      field: "UDPATE",
      headerName: "ACTION",
      width: 75,
      cellRenderer: (p: any) => (
        <button className="row-action-btn row-action-btn--update" onClick={() => onUpdateRow(p.data)}>
          <MdUpdate size={12} />
          <span>Update</span>
        </button>
      ),
    },
    { field: "CHECKSHEET", headerName: "OUTGOING", width: 85, cellRenderer: (p: any) => renderUploadCell(p.data) },
    { field: "DTC_ID", headerName: "DTC_ID", width: 65 },
    { field: "TEST_EMPL", headerName: "NV TEST", width: 75, tooltipField: "TEST_EMPL" },
    { field: "TOTAL_RESULT", headerName: "TT_RESULT", width: 85, cellRenderer: (p: any) => renderCheckboxStatus(p.data, "TOTAL_RESULT") },
    { field: "IQC_TEST_RESULT", headerName: "IQC_CHECK", width: 85, cellRenderer: (p: any) => renderCheckboxStatus(p.data, "IQC_TEST_RESULT") },
    { field: "DTC_RESULT", headerName: "DTC_RESULT", width: 85, cellRenderer: (p: any) => renderCheckboxStatus(p.data, "DTC_RESULT") },
    { field: "REMARK", headerName: "REMARK", width: 100, tooltipField: "REMARK", cellRenderer: (p: any) => renderTruncated(p.data?.REMARK) },
    { field: "AUTO_JUDGEMENT", headerName: "AUTO_JUDGE", width: 85, cellRenderer: (p: any) => renderStatusChip(p.data.AUTO_JUDGEMENT) },
    { field: "DTC_AUTO", headerName: "DTC_AUTO", width: 75, cellRenderer: (p: any) => renderStatusChip(p.data.DTC_AUTO) },
    { field: "NCR_ID", headerName: "NCR_ID", width: 75, tooltipField: "NCR_ID" },
    { field: "NCR_DEFECT_IMAGE", headerName: "DEFECT_IMG", width: 85, cellRenderer: renderDefectLink },
    { field: "NCR_COUNTERMEASURE", headerName: "COUNTERMEASURE", width: 110, cellRenderer: renderCountermeasureLink },
  ];

  const dynamicKqCols = sampleKeys.map((key) => ({
    field: key,
    headerName: key,
    width: 65,
    cellRenderer: (p: any) => renderOkNgCell(p.data, key),
  }));

  const tailCols = [
    { field: "INS_DATE", headerName: "INS_DATE", width: 75, tooltipField: "INS_DATE" },
    { field: "INS_EMPL", headerName: "INS_EMPL", width: 70, tooltipField: "INS_EMPL" },
    { field: "UPD_DATE", headerName: "UPD_DATE", width: 75, tooltipField: "UPD_DATE" },
    { field: "UPD_EMPL", headerName: "UPD_EMPL", width: 70, tooltipField: "UPD_EMPL" },
  ];

  return [...baseColumns, ...dynamicKqCols, ...tailCols];
};

export const getDtcColumns = (): any[] => [
  { field: "TEST_NAME", headerName: "TEST_NAME", width: 85, tooltipField: "TEST_NAME", cellRenderer: (p: any) => renderTruncated(p.value) },
  { field: "POINT_NAME", headerName: "NO", width: 45, cellRenderer: (p: any) => <b style={{ color: "#334155" }}>{p.value}</b> },
  { field: "CENTER_VALUE", headerName: "CENTER", width: 55, cellRenderer: (p: any) => <b>{p.value}</b> },
  { field: "UPPER_TOR", headerName: "UPPER", width: 50 },
  { field: "LOWER_TOR", headerName: "LOWER", width: 50 },
  { field: "RESULT", headerName: "RESULT", width: 55, cellRenderer: (p: any) => <b style={{ color: "#1d4ed8" }}>{p.value}</b> },
  {
    field: "DANHGIA",
    headerName: "KQ",
    width: 45,
    cellRenderer: (p: any) => {
      const { RESULT, CENTER_VALUE, LOWER_TOR, UPPER_TOR } = p.data;
      const isOk = RESULT >= CENTER_VALUE - LOWER_TOR && RESULT <= CENTER_VALUE + UPPER_TOR;
      return <span className={`chip-status ${isOk ? "chip-status--ok" : "chip-status--ng"}`}>{isOk ? "OK" : "NG"}</span>;
    },
  },
  { field: "DTC_ID", headerName: "DTC_ID", width: 65 },
  { field: "PROD_REQUEST_NO", headerName: "YCSX", width: 75, tooltipField: "PROD_REQUEST_NO", cellRenderer: (p: any) => renderTruncated(p.value) },
  { field: "G_CODE", headerName: "G_CODE", width: 75 },
  { field: "G_NAME", headerName: "G_NAME", width: 140, tooltipField: "G_NAME", cellRenderer: (p: any) => renderTruncated(p.value) },
  { field: "M_CODE", headerName: "M_CODE", width: 75 },
  { field: "M_NAME", headerName: "M_NAME", width: 130, tooltipField: "M_NAME", cellRenderer: (p: any) => renderTruncated(p.value) },
  { field: "TEST_FINISH_TIME", headerName: "TEST_TIME", width: 110 },
  { field: "TEST_EMPL_NO", headerName: "NV TEST", width: 75 },
  { field: "TEST_TYPE_NAME", headerName: "TEST_TYPE", width: 85 },
  { field: "SAMPLE_NO", headerName: "SAMPLE", width: 60 },
];
