import React from "react";
import { ColDef } from "ag-grid-community";
import { CSCONFIRM_DATA } from "../../interfaces/qcInterface";
import { CSOptionType } from "./useCSData";
import EditNoteIcon from "@mui/icons-material/EditNote";
import AttachFileIcon from "@mui/icons-material/AttachFile";

interface ColumnBuilderParams {
  option: CSOptionType;
  onOpenNNDS: (row: CSCONFIRM_DATA) => void;
  onUploadImage: (csId: number, file: any) => void;
  onUploadDoiSach: (csId: number, file: any, lang: "VN" | "KR") => void;
}

export const getCSDataColumns = ({
  option,
  onOpenNNDS,
  onUploadImage,
  onUploadDoiSach,
}: ColumnBuilderParams): ColDef[] => {
  // --------------------------------------------------------------------------
  // 1. CỘT PHÂN HỆ: XÁC NHẬN LỖI (CS CONFIRM)
  // --------------------------------------------------------------------------
  if (option === "dataconfirm") {
    return [
      { field: "YEAR_WEEK", headerName: "YEAR_WEEK", width: 90 },
      { field: "CONFIRM_ID", headerName: "CONFIRM_ID", width: 95 },
      { field: "CONFIRM_DATE", headerName: "CONFIRM_DATE", width: 105 },
      { field: "CONTACT_ID", headerName: "CONTACT_ID", width: 95 },
      { field: "CS_EMPL_NO", headerName: "CS_EMPL_NO", width: 95 },
      { field: "EMPL_NAME", headerName: "EMPL_NAME", width: 120 },
      { field: "G_CODE", headerName: "G_CODE", width: 95 },
      { field: "G_NAME", headerName: "G_NAME", width: 120 },
      { field: "G_NAME_KD", headerName: "G_NAME_KD", width: 120 },
      { field: "PROD_REQUEST_NO", headerName: "PROD_REQUEST_NO", width: 105 },
      { field: "CUST_CD", headerName: "CUST_CD", width: 85 },
      { field: "CUST_NAME_KD", headerName: "CUST_NAME_KD", width: 105 },
      { field: "CONTENT", headerName: "CONTENT", width: 150 },
      {
        field: "INSPECT_QTY",
        headerName: "INSPECT_QTY",
        width: 95,
        cellRenderer: (params: any) => (
          <span className="cs-cell-num blue">
            {params.data?.INSPECT_QTY?.toLocaleString("en-US")}
          </span>
        ),
      },
      {
        field: "NG_QTY",
        headerName: "NG_QTY",
        width: 85,
        cellRenderer: (params: any) => (
          <span className="cs-cell-num red">
            {params.data?.NG_QTY?.toLocaleString("en-US")}
          </span>
        ),
      },
      {
        field: "REPLACE_RATE",
        headerName: "REPLACE_RATE",
        width: 105,
        cellRenderer: (params: any) => (
          <span className="cs-cell-num purple">
            {params.data?.REPLACE_RATE?.toLocaleString("en-US", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
            %
          </span>
        ),
      },
      {
        field: "REDUCE_QTY",
        headerName: "REDUCE_QTY",
        width: 95,
        cellRenderer: (params: any) => (
          <span className="cs-cell-num green">
            {params.data?.REDUCE_QTY?.toLocaleString("en-US")}
          </span>
        ),
      },
      { field: "FACTOR", headerName: "FACTOR", width: 95 },
      { field: "RESULT", headerName: "RESULT", width: 85 },
      { field: "CONFIRM_STATUS", headerName: "CONFIRM_STATUS", width: 110 },
      { field: "REMARK", headerName: "REMARK", width: 120 },
      { field: "INS_DATETIME", headerName: "INS_DATETIME", width: 130 },
      { field: "PHANLOAI", headerName: "PHANLOAI", width: 90 },
      { field: "PROD_TYPE", headerName: "PROD_TYPE", width: 90 },
      { field: "PROD_MODEL", headerName: "PROD_MODEL", width: 95 },
      { field: "PROD_PROJECT", headerName: "PROD_PROJECT", width: 100 },
      {
        field: "PROD_LAST_PRICE",
        headerName: "PROD_LAST_PRICE",
        width: 110,
        cellRenderer: (params: any) => (
          <span className="cs-cell-num blue">
            {params.data?.PROD_LAST_PRICE?.toLocaleString("en-US", {
              minimumFractionDigits: 4,
              maximumFractionDigits: 4,
            })}
          </span>
        ),
      },
      {
        field: "REDUCE_AMOUNT",
        headerName: "REDUCE_AMOUNT",
        width: 115,
        cellRenderer: (params: any) => (
          <span className="cs-cell-num green" style={{ fontWeight: 800 }}>
            ${params.data?.REDUCE_AMOUNT?.toLocaleString("en-US", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </span>
        ),
      },
      // Cột ảnh khuyết tật
      {
        field: "LINK",
        headerName: "DEFECT_IMAGE",
        width: 160,
        cellRenderer: (params: any) => {
          const href = `/cs/CS_${params.data?.CONFIRM_ID}.jpg`;
          let selectedFile: any = null;
          if (params.data?.LINK === "Y") {
            return (
              <a
                className="cs-cell-thumb"
                target="_blank"
                rel="noopener noreferrer"
                href={href}
                title="Bấm để xem ảnh khuyết tật gốc"
              >
                <img src={href} alt="Defect" />
              </a>
            );
          }
          return (
            <div className="cs-cell-upload">
              <input
                accept=".jpg"
                type="file"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    selectedFile = e.target.files[0];
                  }
                }}
              />
              <button
                type="button"
                onClick={() => onUploadImage(params.data?.CONFIRM_ID, selectedFile)}
              >
                Tải Lên Ảnh
              </button>
            </div>
          );
        },
      },
      // Cột nút cập nhật NNDS
      {
        field: "UP_NNDS",
        headerName: "UP_NNDS",
        width: 105,
        cellRenderer: (params: any) => (
          <button
            type="button"
            className="cs-cell-btn-nnds"
            onClick={() => onOpenNNDS(params.data)}
            title="Cập nhật Nguyên Nhân & Đối Sách cho sự cố này"
          >
            <EditNoteIcon style={{ fontSize: "0.95rem" }} />
            <span>Sửa NNDS</span>
          </button>
        ),
      },
      {
        field: "NG_NHAN",
        headerName: "NG_NHAN",
        width: 180,
        cellRenderer: (params: any) => (
          <span style={{ color: "#dc2626", fontWeight: 700 }}>
            {params.data?.NG_NHAN}
          </span>
        ),
      },
      {
        field: "DOI_SACH",
        headerName: "DOI_SACH",
        width: 180,
        cellRenderer: (params: any) => (
          <span style={{ color: "#059669", fontWeight: 700 }}>
            {params.data?.DOI_SACH}
          </span>
        ),
      },
      // Cột đối sách tiếng Việt (PPTX)
      {
        field: "DS_VN",
        headerName: "DS_VN",
        width: 140,
        cellRenderer: (params: any) => {
          const href = `/cs/CS_${params.data?.CONFIRM_ID}_VN.pptx`;
          let selectedFile: any = null;
          if (params.data?.DS_VN === "Y") {
            return (
              <a className="cs-cell-link" href={href} download>
                <AttachFileIcon style={{ fontSize: "0.85rem" }} />
                <span>PPTX VN</span>
              </a>
            );
          }
          return (
            <div className="cs-cell-upload">
              <input
                accept=".pptx"
                type="file"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) selectedFile = e.target.files[0];
                }}
              />
              <button
                type="button"
                onClick={() => onUploadDoiSach(params.data?.CONFIRM_ID, selectedFile, "VN")}
              >
                Up File VN
              </button>
            </div>
          );
        },
      },
      // Cột đối sách tiếng Hàn (PPTX)
      {
        field: "DS_KR",
        headerName: "DS_KR",
        width: 140,
        cellRenderer: (params: any) => {
          const href = `/cs/CS_${params.data?.CONFIRM_ID}_KR.pptx`;
          let selectedFile: any = null;
          if (params.data?.DS_KR === "Y") {
            return (
              <a className="cs-cell-link" href={href} download>
                <AttachFileIcon style={{ fontSize: "0.85rem" }} />
                <span>PPTX KR</span>
              </a>
            );
          }
          return (
            <div className="cs-cell-upload">
              <input
                accept=".pptx"
                type="file"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) selectedFile = e.target.files[0];
                }}
              />
              <button
                type="button"
                onClick={() => onUploadDoiSach(params.data?.CONFIRM_ID, selectedFile, "KR")}
              >
                Up File KR
              </button>
            </div>
          );
        },
      },
      { field: "id", headerName: "id", width: 60 },
    ];
  }

  // --------------------------------------------------------------------------
  // 2. CỘT PHÂN HỆ: LỊCH SỬ RMA
  // --------------------------------------------------------------------------
  if (option === "datarma") {
    return [
      { field: "RMA_ID", headerName: "RMA_ID", width: 90 },
      { field: "CONFIRM_ID", headerName: "CONFIRM_ID", width: 95 },
      { field: "G_NAME_KD", headerName: "G_NAME_KD", width: 120 },
      { field: "RETURN_DATE", headerName: "RETURN_DATE", width: 105 },
      { field: "PROD_REQUEST_NO", headerName: "PROD_REQUEST_NO", width: 105 },
      { field: "G_CODE", headerName: "G_CODE", width: 95 },
      { field: "RMA_TYPE", headerName: "RMA_TYPE", width: 95 },
      { field: "RMA_EMPL_NO", headerName: "RMA_EMPL_NO", width: 95 },
      { field: "INS_DATETIME", headerName: "INS_DATETIME", width: 130 },
      { field: "FACTORY", headerName: "FACTORY", width: 85 },
      {
        field: "RETURN_QTY",
        headerName: "RETURN_QTY",
        width: 105,
        cellRenderer: (p: any) => (
          <span className="cs-cell-num red">{p.data?.RETURN_QTY?.toLocaleString("en-US")}</span>
        ),
      },
      {
        field: "SORTING_OK_QTY",
        headerName: "SORTING_OK_QTY",
        width: 110,
        cellRenderer: (p: any) => (
          <span className="cs-cell-num green">
            {p.data?.SORTING_OK_QTY?.toLocaleString("en-US")}
          </span>
        ),
      },
      {
        field: "SORTING_NG_QTY",
        headerName: "SORTING_NG_QTY",
        width: 110,
        cellRenderer: (p: any) => (
          <span className="cs-cell-num red">
            {p.data?.SORTING_NG_QTY?.toLocaleString("en-US")}
          </span>
        ),
      },
      { field: "RMA_DELIVERY_QTY", headerName: "RMA_DELIVERY_QTY", width: 115 },
      { field: "PROD_LAST_PRICE", headerName: "PROD_LAST_PRICE", width: 100 },
      { field: "RETURN_AMOUNT", headerName: "RETURN_AMOUNT", width: 110 },
      { field: "SORTING_OK_AMOUNT", headerName: "SORTING_OK_AMOUNT", width: 115 },
      { field: "SORTING_NG_AMOUNT", headerName: "SORTING_NG_AMOUNT", width: 115 },
      { field: "G_NAME", headerName: "G_NAME", width: 120 },
      { field: "PROD_TYPE", headerName: "PROD_TYPE", width: 90 },
      { field: "PROD_MODEL", headerName: "PROD_MODEL", width: 95 },
      { field: "CONFIRM_DATE", headerName: "CONFIRM_DATE", width: 105 },
      { field: "CS_EMPL_NO", headerName: "CS_EMPL_NO", width: 95 },
      { field: "CONTENT", headerName: "CONTENT", width: 140 },
      { field: "INSPECT_QTY", headerName: "INSPECT_QTY", width: 95 },
      { field: "NG_QTY", headerName: "NG_QTY", width: 85 },
      { field: "REPLACE_RATE", headerName: "REPLACE_RATE", width: 100 },
      { field: "REDUCE_QTY", headerName: "REDUCE_QTY", width: 95 },
      { field: "FACTOR", headerName: "FACTOR", width: 90 },
      { field: "RESULT", headerName: "RESULT", width: 85 },
      { field: "CONFIRM_STATUS", headerName: "CONFIRM_STATUS", width: 110 },
      { field: "REMARK", headerName: "REMARK", width: 120 },
      { field: "PHANLOAI", headerName: "PHANLOAI", width: 90 },
      { field: "LINK", headerName: "LINK", width: 90 },
      { field: "CUST_NAME_KD", headerName: "CUST_NAME_KD", width: 105 },
      { field: "id", headerName: "id", width: 60 },
    ];
  }

  // --------------------------------------------------------------------------
  // 3. CỘT PHÂN HỆ: XIN CHẤP NHẬN ĐẶC BIỆT (CNDB)
  // --------------------------------------------------------------------------
  if (option === "datacndbkhachhang") {
    return [
      { field: "SA_ID", headerName: "SA_ID", width: 85 },
      { field: "CNDB_DATE", headerName: "CNDB_DATE", width: 105 },
      { field: "CONTACT_ID", headerName: "CONTACT_ID", width: 95 },
      { field: "CS_EMPL_NO", headerName: "CS_EMPL_NO", width: 95 },
      { field: "G_CODE", headerName: "G_CODE", width: 95 },
      { field: "G_NAME", headerName: "G_NAME", width: 120 },
      { field: "CUST_NAME_KD", headerName: "CUST_NAME_KD", width: 110 },
      { field: "PROD_REQUEST_NO", headerName: "PROD_REQUEST_NO", width: 105 },
      { field: "REQUEST_DATETIME", headerName: "REQUEST_DATETIME", width: 130 },
      { field: "CONTENT", headerName: "CONTENT", width: 150 },
      {
        field: "SA_QTY",
        headerName: "SA_QTY",
        width: 100,
        cellRenderer: (p: any) => (
          <span className="cs-cell-num blue">{p.data?.SA_QTY?.toLocaleString("en-US")}</span>
        ),
      },
      { field: "RESULT", headerName: "RESULT", width: 85 },
      { field: "SA_STATUS", headerName: "SA_STATUS", width: 100 },
      { field: "SA_REMARK", headerName: "SA_REMARK", width: 120 },
      { field: "INS_DATETIME", headerName: "INS_DATETIME", width: 130 },
      { field: "SA_CUST_CD", headerName: "SA_CUST_CD", width: 95 },
    ];
  }

  // --------------------------------------------------------------------------
  // 4. CỘT PHÂN HỆ: CHI PHÍ TAXI CS
  // --------------------------------------------------------------------------
  if (option === "datataxi") {
    return [
      { field: "TAXI_ID", headerName: "TAXI_ID", width: 85 },
      { field: "CONFIRM_ID", headerName: "CONFIRM_ID", width: 95 },
      { field: "SA_ID", headerName: "SA_ID", width: 85 },
      { field: "CHIEU", headerName: "CHIEU", width: 85 },
      { field: "CONG_VIEC", headerName: "CONG_VIEC", width: 130 },
      { field: "TAXI_DATE", headerName: "TAXI_DATE", width: 105 },
      { field: "TAXI_SHIFT", headerName: "TAXI_SHIFT", width: 90 },
      { field: "CS_EMPL_NO", headerName: "CS_EMPL_NO", width: 95 },
      { field: "DIEM_DI", headerName: "DIEM_DI", width: 110 },
      { field: "DIEM_DEN", headerName: "DIEM_DEN", width: 110 },
      {
        field: "TAXI_AMOUNT",
        headerName: "TAXI_AMOUNT",
        width: 110,
        cellRenderer: (p: any) => (
          <span className="cs-cell-num green">
            {p.data?.TAXI_AMOUNT?.toLocaleString("en-US")} VND
          </span>
        ),
      },
      { field: "TRANSPORTATION", headerName: "TRANSPORTATION", width: 100 },
      { field: "TAXI_REMARK", headerName: "TAXI_REMARK", width: 120 },
      { field: "INS_DATETIME", headerName: "INS_DATETIME", width: 130 },
    ];
  }

  return [];
};
