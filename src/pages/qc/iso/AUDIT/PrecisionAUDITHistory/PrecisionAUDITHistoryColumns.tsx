import React from "react";
import { AiOutlineUpload, AiOutlineCloudUpload } from "react-icons/ai";
import { getCtrCd } from "../../../../../api/Api";
import { DownloadButtonAll } from "../../../../../components/DownloadButton/DownloadButtonAll";
import { AUDIT_HISTORY_DATA } from "../../../interfaces/qcInterface";

interface ColumnOptions {
  onUploadDoc: (auditRow: AUDIT_HISTORY_DATA) => void;
}

export const createAuditHistoryColumns = ({ onUploadDoc }: ColumnOptions) => {
  const protocol = window.location.protocol.startsWith("https") ? "https" : "http";

  return [
    {
      field: "id",
      headerName: "ID",
      width: 60,
      checkboxSelection: true,
      headerCheckboxSelection: true,
    },
    { field: "CUST_CD", headerName: "CUST_CD", width: 100 },
    { field: "CUST_NAME_KD", headerName: "CUST_NAME_KD", width: 100 },
    { field: "AUDIT_ID", headerName: "AUDIT_ID", width: 100 },
    { field: "AUDIT_DATE", headerName: "AUDIT_DATE", width: 100 },
    { field: "AUDIT_NAME", headerName: "AUDIT_NAME", width: 100 },
    {
      field: "AUDIT_MAX_SCORE",
      headerName: "AUDIT_MAX_SCORE",
      width: 100,
      cellRenderer: (params: any) => (
        <span className="pah-score-text">{params.value ?? 0}</span>
      ),
    },
    {
      field: "AUDIT_SCORE",
      headerName: "AUDIT_SCORE",
      width: 100,
      cellRenderer: (params: any) => {
        const isPass = params.data?.AUDIT_RESULT === "PASS";
        return (
          <span className={`pah-score-text ${isPass ? "pass" : "fail"}`}>
            {params.value ?? 0}
          </span>
        );
      },
    },
    {
      field: "AUDIT_PASS_SCORE",
      headerName: "AUDIT_PASS_SCORE",
      width: 100,
      cellRenderer: (params: any) => (
        <span className="pah-score-text">{params.value ?? 0}</span>
      ),
    },
    {
      field: "AUDIT_RESULT",
      headerName: "AUDIT_RESULT",
      width: 100,
      cellRenderer: (params: any) => {
        const isPass = params.value === "PASS";
        return (
          <span className={`pah-status-badge ${isPass ? "pass" : "fail"}`}>
            <span className="badge-dot" />
            {isPass ? "PASS" : "FAIL"}
          </span>
        );
      },
    },
    {
      field: "AUDIT_FILE_EXT",
      headerName: "ATT_FILE",
      width: 100,
      cellRenderer: (params: any) => {
        const fileExt = params.value;
        if (!fileExt || fileExt.trim() === "") {
          return (
            <div className="pah-file-cell">
              <button
                type="button"
                className="btn-upload-file"
                onClick={() => onUploadDoc(params.data)}
                title="Tải lên báo cáo đính kèm"
              >
                <AiOutlineUpload size={12} />
                <span>Upload</span>
              </button>
            </div>
          );
        }

        const fullUrl = `${protocol}://${window.location.host}/audithistory/${getCtrCd()}_${params.data.AUDIT_ID}${params.data.AUDIT_FILE_EXT}`;
        const filename = `${params.data.AUDIT_ID}${params.data.AUDIT_FILE_EXT}`;
        const cleanExt = fileExt.replace(".", "").toUpperCase();

        return (
          <div className="pah-file-cell">
            <div className="file-has-att">
              <span className="file-ext-tag">{cleanExt}</span>
              <DownloadButtonAll fullUrl={fullUrl} filename={filename} />
              <button
                type="button"
                className="btn-replace-file"
                title="Thay thế tệp báo cáo"
                onClick={() => onUploadDoc(params.data)}
              >
                <AiOutlineCloudUpload size={13} />
              </button>
            </div>
          </div>
        );
      },
    },
    { field: "INS_DATE", headerName: "INS_DATE", width: 100 },
    { field: "INS_EMPL", headerName: "INS_EMPL", width: 100 },
    { field: "UPD_DATE", headerName: "UPD_DATE", width: 100 },
    { field: "UPD_EMPL", headerName: "UPD_EMPL", width: 100 },
  ];
};
