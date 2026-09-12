import React from "react";
import { IconButton } from "@mui/material";
import { AiOutlineCloudUpload } from "react-icons/ai";
import { BiDownload } from "react-icons/bi";
import { f_downloadFile } from "../../../../api/services/fileService";

interface ColumnOptions {
  company: string;
  onUploadBanVe?: (file: any, rowData: any) => void;
}

export const getYCSXColumns = (options: ColumnOptions): any[] => {
  const { company, onUploadBanVe } = options;

  if (company === "CMS") {
    return [
      {
        field: "G_NAME_KD",
        headerName: "G_NAME_KD",
        width: 150,
        headerCheckboxSelection: true,
        checkboxSelection: true,
        cellRenderer: (params: any) => {
          if (params.data?.SETVL === "N") {
            return <span style={{ color: "gray" }}>{params.data?.G_NAME_KD}</span>;
          } else if (params.data?.PDBV === "P" || params.data?.PDBV === null) {
            return <span style={{ color: "red" }}>{params.data?.G_NAME_KD}</span>;
          } else {
            return <span style={{ color: "green" }}>{params.data?.G_NAME_KD}</span>;
          }
        },
      },
      { field: "G_CODE", headerName: "G_CODE", width: 80 },
      {
        field: "G_NAME",
        headerName: "G_NAME",
        width: 150,
        cellRenderer: (params: any) => {
          if (params.data?.PDBV === "P" || params.data?.PDBV === null)
            return <span style={{ color: "red" }}>{params.data?.G_NAME}</span>;
          return <span style={{ color: "green" }}>{params.data?.G_NAME}</span>;
        },
      },
      { field: "DESCR", headerName: "DESCR", width: 140 },
      { field: "EMPL_NAME", headerName: "PIC KD", width: 110 },
      { field: "CUST_NAME_KD", headerName: "KHÁCH", width: 80 },
      {
        field: "PROD_REQUEST_NO",
        headerName: "SỐ YCSX",
        width: 80,
        cellRenderer: (params: any) => {
          if (params.data?.DACHITHI === null) {
            return (
              <span style={{ color: "black" }}>
                {params.data?.PROD_REQUEST_NO?.toLocaleString("en-US")}
              </span>
            );
          } else {
            return (
              <span style={{ color: "green" }}>
                <b>{params.data?.PROD_REQUEST_NO?.toLocaleString("en-US")}</b>
              </span>
            );
          }
        },
      },
      {
        field: "PROD_REQUEST_DATE",
        headerName: "NGÀY YCSX",
        width: 90,
        cellRenderer: (params: any) => {
          if (params.data?.DAUPAMZ === null) {
            return (
              <span style={{ color: "black" }}>
                <b>{params.data?.PROD_REQUEST_DATE?.toLocaleString("en-US")}</b>
              </span>
            );
          } else {
            return (
              <span style={{ color: "green" }}>
                <b>{params.data?.PROD_REQUEST_DATE?.toLocaleString("en-US")}</b>
              </span>
            );
          }
        },
      },
      { field: "DELIVERY_DT", headerName: "NGÀY GH", width: 90 },
      {
        field: "PROD_REQUEST_QTY",
        cellDataType: "number",
        headerName: "SL YCSX",
        width: 80,
      },
      {
        field: "LOT_TOTAL_INPUT_QTY_EA",
        cellDataType: "number",
        headerName: "NHẬP KIỂM",
        width: 80,
        cellRenderer: (params: any) => (
          <span style={{ color: "#cc0099" }}>
            <b>{params.data?.LOT_TOTAL_INPUT_QTY_EA?.toLocaleString("en-US")}</b>
          </span>
        ),
      },
      {
        field: "LOT_TOTAL_OUTPUT_QTY_EA",
        cellDataType: "number",
        headerName: "XUẤT KIỂM",
        width: 80,
        cellRenderer: (params: any) => (
          <span style={{ color: "#cc0099" }}>
            <b>{params.data?.LOT_TOTAL_OUTPUT_QTY_EA?.toLocaleString("en-US")}</b>
          </span>
        ),
      },
      {
        field: "INSPECT_BALANCE",
        cellDataType: "number",
        headerName: "TỒN KIỂM",
        width: 80,
        cellRenderer: (params: any) => (
          <span style={{ color: "#cc0099" }}>
            <b>{params.data?.INSPECT_BALANCE?.toLocaleString("en-US")}</b>
          </span>
        ),
      },
      {
        field: "SHORTAGE_YCSX",
        cellDataType: "number",
        headerName: "TỒN YCSX",
        width: 80,
        cellRenderer: (params: any) => (
          <span style={{ color: "blue" }}>
            <b>{params.data?.SHORTAGE_YCSX?.toLocaleString("en-US")}</b>
          </span>
        ),
      },
      {
        field: "YCSX_PENDING",
        headerName: "YCSX_PENDING",
        width: 90,
        cellRenderer: (params: any) => {
          if (params.data?.YCSX_PENDING === 1)
            return (
              <span style={{ color: "red" }}>
                <b>PENDING</b>
              </span>
            );
          return (
            <span style={{ color: "green" }}>
              <b>CLOSED</b>
            </span>
          );
        },
      },
      {
        field: "PL_HANG",
        cellDataType: "text",
        headerName: "PL_HANG",
        width: 70,
      },
      {
        field: "PHAN_LOAI",
        headerName: "PHAN_LOAI",
        width: 90,
        cellRenderer: (params: any) => {
          const map: Record<string, string> = {
            "01": "Thông thường",
            "02": "SDI",
            "03": "GC",
            "04": "SAMPLE",
          };
          return (
            <span style={{ color: "black" }}>
              <b>{map[params.data?.PHAN_LOAI] ?? params.data?.PHAN_LOAI}</b>
            </span>
          );
        },
      },
      { field: "REMARK", headerName: "REMARK", width: 120 },
      { field: "PROD_MAIN_MATERIAL", headerName: "VL CHÍNH", width: 90 },
      {
        field: "MATERIAL_YN",
        headerName: "VL_STT",
        width: 80,
        cellRenderer: (params: any) => {
          if (params.data?.MATERIAL_YN === "N") {
            return (
              <span style={{ color: "red" }}>
                <b>NO</b>
              </span>
            );
          } else if (params.data?.MATERIAL_YN === "Y") {
            return (
              <span style={{ color: "green" }}>
                <b>YES</b>
              </span>
            );
          } else {
            return (
              <span style={{ color: "orange" }}>
                <b>PENDING</b>
              </span>
            );
          }
        },
      },
      { field: "PO_NO", headerName: "PO_NO", width: 90 },
      {
        field: "PDUYET",
        headerName: "PDUYET",
        width: 85,
        cellRenderer: (params: any) => {
          if (params.data?.PDUYET === 1)
            return (
              <span style={{ color: "green" }}>
                <b>Đã Duyệt</b>
              </span>
            );
          return (
            <span style={{ color: "red" }}>
              <b>Không Duyệt</b>
            </span>
          );
        },
      },
      {
        field: "BANVE",
        headerName: "BANVE",
        width: 140,
        cellRenderer: (params: any) => {
          const hreftlink = `/banve/${params.data?.G_CODE}.pdf?v=${Date.now()}`;
          if (params.data?.BANVE === "Y") {
            return (
              <div>
                <IconButton
                  size="small"
                  onClick={() => {
                    f_downloadFile(
                      hreftlink,
                      `${params.data?.G_CODE}_${params.data?.G_NAME}.pdf`
                    );
                  }}
                >
                  Download <BiDownload color="green" size={16} />
                </IconButton>
              </div>
            );
          }
          return (
            <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
              <input
                accept=".pdf"
                type="file"
                style={{ fontSize: 10, width: 110 }}
                onChange={(e: any) => {
                  const file = e.target.files?.[0];
                  if (file && onUploadBanVe) {
                    onUploadBanVe(file, params.data);
                  }
                }}
              />
            </div>
          );
        },
      },
      {
        field: "PDBV",
        headerName: "PD BANVE",
        width: 85,
        cellRenderer: (params: any) => {
          if (params.data?.PDBV === "P" || params.data?.PDBV === null)
            return (
              <span style={{ color: "red" }}>
                <b>PENDING</b>
              </span>
            );
          return (
            <span style={{ color: "green" }}>
              <b>APPROVED</b>
            </span>
          );
        },
      },
      {
        field: "IS_TAM_THOI",
        headerName: "YCSX_TAM_THOI",
        width: 90,
        cellRenderer: (params: any) => {
          if (params.data?.IS_TAM_THOI === "Y")
            return (
              <span style={{ color: "red" }}>
                <b>Tạm thời</b>
              </span>
            );
          return (
            <span style={{ color: "green" }}>
              <b>Bình thường</b>
            </span>
          );
        },
      },
      {
        field: "FL_YN",
        headerName: "FL_YN",
        width: 85,
        cellRenderer: (params: any) => {
          if (params.data?.FL_YN === "Y")
            return (
              <span style={{ color: "red" }}>
                <b>FIRST LOT</b>
              </span>
            );
          return (
            <span style={{ color: "green" }}>
              <b>NOT FIRST LOT</b>
            </span>
          );
        },
      },
    ];
  }

  // PVN Company Columns
  return [
    {
      field: "G_NAME_KD",
      headerName: "G_NAME_KD",
      width: 100,
      headerCheckboxSelection: true,
      checkboxSelection: true,
      cellRenderer: (params: any) => {
        if (params.data?.PDBV === "P" || params.data?.PDBV === null)
          return <span style={{ color: "red" }}>{params.data?.G_NAME_KD}</span>;
        return <span style={{ color: "green" }}>{params.data?.G_NAME_KD}</span>;
      },
    },
    { field: "G_CODE", headerName: "G_CODE", width: 50 },
    {
      field: "G_NAME",
      headerName: "G_NAME",
      width: 120,
      cellRenderer: (params: any) => {
        if (params.data?.PDBV === "P" || params.data?.PDBV === null)
          return <span style={{ color: "red" }}>{params.data?.G_NAME}</span>;
        return <span style={{ color: "green" }}>{params.data?.G_NAME}</span>;
      },
    },
    { field: "CUST_NAME_KD", headerName: "KHÁCH", width: 50 },
    { field: "G_WIDTH", headerName: "WIDTH", width: 50 },
    { field: "G_LENGTH", headerName: "LENGTH", width: 50 },
    { field: "G_C", headerName: "CVT_C", width: 50 },
    { field: "G_C_R", headerName: "CVT_R", width: 50 },
    { field: "PROD_PRINT_TIMES", headerName: "SL_IN", width: 50 },
    {
      field: "PROD_REQUEST_NO",
      headerName: "SỐ YCSX",
      width: 60,
      cellRenderer: (params: any) => {
        if (params.data?.DACHITHI === null) {
          return (
            <span style={{ color: "black" }}>
              {params.data?.PROD_REQUEST_NO?.toLocaleString("en-US")}
            </span>
          );
        }
        return (
          <span style={{ color: "green" }}>
            <b>{params.data?.PROD_REQUEST_NO?.toLocaleString("en-US")}</b>
          </span>
        );
      },
    },
    { field: "PROD_REQUEST_DATE", headerName: "NGÀY YCSX", width: 60 },
    { field: "DELIVERY_DT", headerName: "NGÀY GH", width: 60 },
    {
      field: "PROD_REQUEST_QTY",
      cellDataType: "number",
      headerName: "SL YCSX",
      width: 60,
      cellRenderer: (params: any) => (
        <span style={{ color: "#009933" }}>
          <b>{params.data?.PROD_REQUEST_QTY?.toLocaleString("en-US")}</b>
        </span>
      ),
    },
    {
      field: "LOT_TOTAL_INPUT_QTY_EA",
      cellDataType: "number",
      headerName: "NHẬP KIỂM",
      width: 60,
      cellRenderer: (params: any) => (
        <span style={{ color: "#cc0099" }}>
          <b>{params.data?.LOT_TOTAL_INPUT_QTY_EA?.toLocaleString("en-US")}</b>
        </span>
      ),
    },
    {
      field: "LOT_TOTAL_OUTPUT_QTY_EA",
      cellDataType: "number",
      headerName: "XUẤT KIỂM",
      width: 60,
      cellRenderer: (params: any) => (
        <span style={{ color: "#cc0099" }}>
          <b>{params.data?.LOT_TOTAL_OUTPUT_QTY_EA?.toLocaleString("en-US")}</b>
        </span>
      ),
    },
    {
      field: "INPUT_QTY",
      cellDataType: "number",
      headerName: "NHẬP KHO",
      width: 60,
      cellRenderer: (params: any) => (
        <span style={{ color: "#cc0099" }}>
          <b>{params.data?.INPUT_QTY?.toLocaleString("en-US")}</b>
        </span>
      ),
    },
    {
      field: "SORTING_INPUT",
      cellDataType: "number",
      headerName: "SORTING_INPUT",
      width: 80,
      cellRenderer: (params: any) => (
        <span style={{ color: "#cc0099" }}>
          <b>{params.data?.SORTING_INPUT?.toLocaleString("en-US")}</b>
        </span>
      ),
    },
    {
      field: "NORMAL_INPUT",
      cellDataType: "number",
      headerName: "NORMAL_INPUT",
      width: 80,
      cellRenderer: (params: any) => (
        <span style={{ color: "#cc0099" }}>
          <b>{params.data?.NORMAL_INPUT?.toLocaleString("en-US")}</b>
        </span>
      ),
    },
    {
      field: "OUTPUTNB_QTY",
      cellDataType: "number",
      headerName: "XUẤT NB",
      width: 60,
      cellRenderer: (params: any) => (
        <span style={{ color: "#cc0099" }}>
          <b>{params.data?.OUTPUTNB_QTY?.toLocaleString("en-US")}</b>
        </span>
      ),
    },
    {
      field: "OUTPUTKH_QTY",
      cellDataType: "number",
      headerName: "XUẤT KH",
      width: 60,
      cellRenderer: (params: any) => (
        <span style={{ color: "#cc0099" }}>
          <b>{params.data?.OUTPUTKH_QTY?.toLocaleString("en-US")}</b>
        </span>
      ),
    },
    {
      field: "OUTPUT_QTY",
      cellDataType: "number",
      headerName: "XUẤT TOTAL",
      width: 80,
      cellRenderer: (params: any) => (
        <span style={{ color: "#cc0099" }}>
          <b>{params.data?.OUTPUT_QTY?.toLocaleString("en-US")}</b>
        </span>
      ),
    },
    {
      field: "STOCK",
      cellDataType: "number",
      headerName: "TỒN KHO",
      width: 60,
      cellRenderer: (params: any) => (
        <span style={{ color: "#cc0099" }}>
          <b>{params.data?.STOCK?.toLocaleString("en-US")}</b>
        </span>
      ),
    },
    {
      field: "BLOCK_QTY",
      cellDataType: "number",
      headerName: "BLOCK_QTY",
      width: 80,
      cellRenderer: (params: any) => (
        <span style={{ color: "#cc0099" }}>
          <b>{params.data?.BLOCK_QTY?.toLocaleString("en-US")}</b>
        </span>
      ),
    },
    { field: "PROD_MAIN_MATERIAL", headerName: "VL CHÍNH", width: 80 },
    {
      field: "MATERIAL_YN",
      headerName: "VL_STT",
      width: 80,
      cellRenderer: (params: any) => {
        if (params.data?.MATERIAL_YN === "N") {
          return (
            <span style={{ color: "red" }}>
              <b>NO</b>
            </span>
          );
        } else if (params.data?.MATERIAL_YN === "Y") {
          return (
            <span style={{ color: "green" }}>
              <b>YES</b>
            </span>
          );
        } else {
          return (
            <span style={{ color: "orange" }}>
              <b>PENDING</b>
            </span>
          );
        }
      },
    },
    {
      field: "YCSX_PENDING",
      headerName: "YCSX_PENDING",
      width: 80,
      cellRenderer: (params: any) => {
        if (params.data?.YCSX_PENDING === 1)
          return (
            <span style={{ color: "red" }}>
              <b>PENDING</b>
            </span>
          );
        return (
          <span style={{ color: "green" }}>
            <b>CLOSED</b>
          </span>
        );
      },
    },
    {
      field: "PL_HANG",
      cellDataType: "text",
      headerName: "PL_HANG",
      width: 80,
    },
    {
      field: "PHAN_LOAI",
      headerName: "PHAN_LOAI",
      width: 80,
      cellRenderer: (params: any) => {
        const map: Record<string, string> = {
          "01": "Thông thường",
          "02": "SDI",
          "03": "GC",
          "04": "SAMPLE",
        };
        return (
          <span style={{ color: "black" }}>
            <b>{map[params.data?.PHAN_LOAI] ?? params.data?.PHAN_LOAI}</b>
          </span>
        );
      },
    },
    { field: "REMARK", headerName: "REMARK", width: 120 },
    { field: "PO_NO", headerName: "PO_NO", width: 120 },
    { field: "DESCR", headerName: "DESCRIPTION", width: 150 },
    {
      field: "PDUYET",
      headerName: "PDUYET",
      width: 80,
      cellRenderer: (params: any) => {
        if (params.data?.PDUYET === 1)
          return (
            <span style={{ color: "green" }}>
              <b>Đã Duyệt</b>
            </span>
          );
        return (
          <span style={{ color: "red" }}>
            <b>Không Duyệt</b>
          </span>
        );
      },
    },
    {
      field: "G_NAME",
      headerName: "G_NAME",
      width: 250,
      cellRenderer: (params: any) => {
        if (params.data?.PDBV === "P" || params.data?.PDBV === null)
          return <span style={{ color: "red" }}>{params.data?.G_NAME}</span>;
        return <span style={{ color: "green" }}>{params.data?.G_NAME}</span>;
      },
    },
    {
      field: "BANVE",
      headerName: "BANVE",
      width: 140,
      cellRenderer: (params: any) => {
        const hreftlink = `/banve/${params.data?.G_CODE}.pdf`;
        if (params.data?.BANVE === "Y")
          return (
            <span style={{ color: "green" }}>
              <b>
                <a target="_blank" rel="noopener noreferrer" href={hreftlink}>
                  LINK
                </a>
              </b>
            </span>
          );
        return (
          <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
            <input
              accept=".pdf"
              type="file"
              style={{ fontSize: 10, width: 110 }}
              onChange={(e: any) => {
                const file = e.target.files?.[0];
                if (file && onUploadBanVe) {
                  onUploadBanVe(file, params.data);
                }
              }}
            />
          </div>
        );
      },
    },
    {
      field: "PDBV",
      headerName: "PD BANVE",
      width: 80,
      cellRenderer: (params: any) => {
        if (params.data?.PDBV === "P" || params.data?.PDBV === null)
          return (
            <span style={{ color: "red" }}>
              <b>PENDING</b>
            </span>
          );
        return (
          <span style={{ color: "green" }}>
            <b>APPROVED</b>
          </span>
        );
      },
    },
    { field: "EMPL_NAME", headerName: "PIC KD", width: 150 },
  ];
};

/* ── Columns for Excel Bulk Upload Preview ── */
export const getExcelUploadColumns = (isCMS?: boolean): any[] => [
  { field: "id", headerName: "id", width: 80, checkboxSelection: true },
  { field: "PROD_REQUEST_DATE", headerName: "NGAY YC", width: 90 },
  { field: "CODE_50", headerName: "CODE_50", width: 80 },
  { field: "CODE_55", headerName: "CODE_55", width: 80 },
  { field: "G_CODE", headerName: "G_CODE", width: 80 },
  { field: "RIV_NO", headerName: "RIV_NO", width: 80 },
  {
    field: "PROD_REQUEST_QTY",
    headerName: "SL YCSX",
    width: 90,
    cellRenderer: (params: any) => (
      <span style={{ color: "blue" }}>
        <b>{params.data?.PROD_REQUEST_QTY?.toLocaleString("en-US")}</b>
      </span>
    ),
  },
  { field: "CUST_CD", headerName: "CUST_CD", width: 80 },
  { field: "EMPL_NO", headerName: "EMPL_NO", width: 90 },
  { field: "REMK", headerName: "REMK", width: 120 },
  { field: "DELIVERY_DT", headerName: "NGAY GH", width: 90 },
  { field: "PO_NO", headerName: "PO_NO", width: 100 },
  { field: "PHANLOAI", headerName: "PHANLOAI", width: 80 },
  { field: "FL_YN", headerName: "YCSX_TAM_THOI", width: 80 },
  {
    field: "CHECKSTATUS",
    headerName: "CHECKSTATUS",
    width: 140,
    cellRenderer: (params: any) => {
      const status = params.data?.CHECKSTATUS ?? "";
      if (status.slice(0, 2) === "OK") {
        return (
          <span style={{ color: "green" }}>
            <b>{status}</b>
          </span>
        );
      } else if (status.slice(0, 2) === "NG") {
        return (
          <span style={{ color: "red" }}>
            <b>{status}</b>
          </span>
        );
      }
      return (
        <span style={{ color: "blue" }}>
          <b>{status}</b>
        </span>
      );
    },
  },
];

/* ── Columns for Amazon Bulk Upload Preview ── */
export const getAmazonUploadColumns = (): any[] => [
  { field: "id", headerName: "ID", width: 60 },
  { field: "DATA", headerName: "DATA (QR / Barcode)", width: 320 },
  {
    field: "CHECKSTATUS",
    headerName: "CHECKSTATUS",
    width: 130,
    cellRenderer: (params: any) => {
      const status = params.data?.CHECKSTATUS ?? "";
      if (status.slice(0, 2) === "OK") {
        return (
          <span style={{ color: "green" }}>
            <b>{status}</b>
          </span>
        );
      } else if (status.slice(0, 2) === "NG") {
        return (
          <span style={{ color: "red" }}>
            <b>{status}</b>
          </span>
        );
      }
      return <span style={{ color: "orange" }}>{status}</span>;
    },
  },
];
