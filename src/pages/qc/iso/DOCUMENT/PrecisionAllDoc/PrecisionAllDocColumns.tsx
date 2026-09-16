import React from "react";
import moment from "moment";
import { getCtrCd } from "../../../../../api/Api";
import { DownloadButtonAll } from "../../../../../components/DownloadButton/DownloadButtonAll";
import {
  FaFile,
  FaFileExcel,
  FaFileImage,
  FaFilePdf,
  FaFilePowerpoint,
  FaFileWord,
} from "react-icons/fa";
import { FaFileZipper } from "react-icons/fa6";

export const createAllDocColumns = () => {
  const protocol = window.location.protocol.startsWith("https") ? "https" : "http";

  return [
    {
      field: "FILE_ID",
      headerName: "FILE_ID",
      width: 80,
      headerCheckboxSelection: true,
      checkboxSelection: true,
    },
    {
      field: "CAT_NAME",
      headerName: "PHAN_LOAI",
      width: 60,
      cellRenderer: (params: any) => (
        <span className="pad-cat-tag" title={params.value}>
          {params.value || ""}
        </span>
      ),
    },
    {
      field: "DOC_CAT_NAME",
      headerName: "LOAI_TAI_LIEU",
      width: 100,
      cellRenderer: (params: any) => (
        <span className="pad-doc-cat-tag" title={params.value}>
          {params.value || ""}
        </span>
      ),
    },
    {
      field: "DOC_NAME",
      headerName: "DOC_NAME",
      width: 250,
      cellRenderer: (params: any) => (
        <span
          style={{
            fontWeight: 600,
            color: "#1e40af",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            display: "block",
          }}
          title={params.value}
        >
          {params.value || ""}
        </span>
      ),
    },
    {
      field: "FORMAT_X",
      headerName: "FORMAT",
      width: 50,
      cellRenderer: (params: any) => {
        const val = params.value || "";
        const fileExt = val.split(".").pop().toLowerCase();
        if (["doc", "docx", "txt", "rtf"].includes(fileExt))
          return (
            <div className="pad-format-icon" title={val}>
              <FaFileWord color="#2563eb" size={18} />
            </div>
          );
        if (["pdf"].includes(fileExt))
          return (
            <div className="pad-format-icon" title={val}>
              <FaFilePdf color="#ef4444" size={18} />
            </div>
          );
        if (["ppt", "pptx"].includes(fileExt))
          return (
            <div className="pad-format-icon" title={val}>
              <FaFilePowerpoint color="#f97316" size={18} />
            </div>
          );
        if (["xls", "xlsx", "csv"].includes(fileExt))
          return (
            <div className="pad-format-icon" title={val}>
              <FaFileExcel color="#10b981" size={18} />
            </div>
          );
        if (["jpg", "jpeg", "png", "gif", "bmp"].includes(fileExt))
          return (
            <div className="pad-format-icon" title={val}>
              <FaFileImage color="#06b6d4" size={18} />
            </div>
          );
        if (["zip", "rar", "7z", "tar"].includes(fileExt))
          return (
            <div className="pad-format-icon" title={val}>
              <FaFileZipper color="#d97706" size={18} />
            </div>
          );
        return (
          <div className="pad-format-icon" title={val}>
            <FaFile color="#94a3b8" size={18} />
          </div>
        );
      },
    },
    {
      field: "DOC_NAME",
      headerName: "DOWNLOAD",
      width: 100,
      cellRenderer: (params: any) => {
        if (!params.data) return null;
        const fullUrl = `${protocol}://${window.location.host}/alldocs/${params.data.FILE_ID}_${params.data.DOC_ID}_${params.data.DOC_CAT_ID}_${params.data.CAT_ID}${params.data.FORMAT_X}`;
        const filename = `${getCtrCd()}_${params.data.FILE_ID}_${params.data.DOC_ID}_${params.data.DOC_CAT_ID}_${params.data.CAT_ID}${params.data.FORMAT_X}`;
        return <DownloadButtonAll fullUrl={fullUrl} filename={filename} />;
      },
    },
    { field: "REG_DATE", headerName: "REG_DATE", width: 60 },
    { field: "EXP_DATE", headerName: "EXP_DATE", width: 60 },
    { field: "REMAIN_DAYS", headerName: "REMAIN_DAYS", width: 60 },
    { field: "DOC_ID", headerName: "DOC_ID", width: 40 },
    { field: "CAT_ID", headerName: "CAT_ID", width: 40 },
    { field: "DOC_CAT_ID", headerName: "DOC_CAT_ID", width: 60 },
    {
      field: "HSD_YN",
      headerName: "HSD_YN",
      width: 60,
      cellRenderer: (params: any) => {
        if (params.data?.HSD_YN === "N") {
          return <span className="pad-hsd-chip no-exp">Vô hạn</span>;
        }
        if (!params.data?.EXP_DATE) {
          return <span className="pad-hsd-chip valid">Có HSD</span>;
        }

        const exp = moment(params.data.EXP_DATE).startOf("day");
        const today = moment().startOf("day");
        const diffDays = exp.diff(today, "days");

        if (diffDays < 0) {
          return <span className="pad-hsd-chip expired">Quá hạn</span>;
        }
        if (diffDays <= 30) {
          return <span className="pad-hsd-chip expiring">{diffDays}d</span>;
        }
        return <span className="pad-hsd-chip valid">Còn hạn</span>;
      },
    },
    {
      field: "USE_YN",
      headerName: "USE_YN",
      width: 60,
      cellRenderer: (params: any) => {
        const val = params.value;
        if (val === "Y") {
          return <span className="pad-use-chip yes">Dùng</span>;
        }
        return <span className="pad-use-chip no">Ngừng</span>;
      },
    },
    { field: "INS_DATE", headerName: "INS_DATE", width: 60 },
    { field: "INS_EMPL", headerName: "INS_EMPL", width: 60 },
    { field: "UPD_DATE", headerName: "UPD_DATE", width: 60 },
    { field: "UPD_EMPL", headerName: "UPD_EMPL", width: 60 },
  ];
};
