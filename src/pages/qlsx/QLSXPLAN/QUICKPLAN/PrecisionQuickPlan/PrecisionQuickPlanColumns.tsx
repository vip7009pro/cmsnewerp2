import React from "react";
import { IconButton } from "@mui/material";
import { AiOutlineCloudUpload } from "react-icons/ai";
import { QLSXPLANDATA } from "../../interfaces/khsxInterface";

interface GetColumnYCSXTableProps {
  onUploadBanVe?: (file: any, gCode: string) => Promise<void>;
}

export const getColumnQuickPlanYCSXTable = ({
  onUploadBanVe,
}: GetColumnYCSXTableProps = {}): any[] => {
  return [
    {
      field: "YCSX_PENDING",
      headerName: "YCSX_PENDING",
      width: 80,
      renderCell: (params: any) => {
        if (params.row.YCSX_PENDING === 1)
          return (
            <span style={{ color: "red" }}>
              <b>PENDING</b>
            </span>
          );
        else
          return (
            <span style={{ color: "green" }}>
              <b>CLOSED</b>
            </span>
          );
      },
    },
    { field: "G_CODE", headerName: "G_CODE", width: 80 },
    {
      field: "G_NAME_KD",
      headerName: "G_NAME_KD",
      width: 100,
      renderCell: (params: any) => {
        if (params.row.PDBV === "P" || params.row.PDBV === null)
          return <span style={{ color: "red" }}>{params.row.G_NAME_KD}</span>;
        return <span style={{ color: "green" }}>{params.row.G_NAME_KD}</span>;
      },
    },
    {
      field: "G_NAME",
      headerName: "G_NAME",
      width: 250,
      renderCell: (params: any) => {
        if (params.row.PDBV === "P" || params.row.PDBV === null)
          return <span style={{ color: "red" }}>{params.row.G_NAME}</span>;
        return <span style={{ color: "green" }}>{params.row.G_NAME}</span>;
      },
    },
    { field: "EMPL_NAME", headerName: "PIC KD", width: 150 },
    { field: "CUST_NAME_KD", headerName: "KHÁCH", width: 120 },
    {
      field: "PROD_REQUEST_NO",
      headerName: "SỐ YCSX",
      width: 80,
      renderCell: (params: any) => {
        if (params.row.DACHITHI === null) {
          return <span style={{ color: "black" }}>{params.row.PROD_REQUEST_NO}</span>;
        } else {
          return (
            <span style={{ color: "green" }}>
              <b>{params.row.PROD_REQUEST_NO}</b>
            </span>
          );
        }
      },
    },
    { field: "PROD_REQUEST_DATE", headerName: "NGÀY YCSX", width: 80 },
    { field: "DELIVERY_DT", headerName: "NGÀY GH", width: 80 },
    {
      field: "PO_BALANCE",
      headerName: "PO_BALANCE",
      width: 110,
      renderCell: (params: any) => {
        return (
          <span style={{ color: "blue" }}>
            <b>{params.row.PO_BALANCE?.toLocaleString("en", "US")}</b>
          </span>
        );
      },
    },
    {
      field: "PROD_REQUEST_QTY",
      type: "number",
      headerName: "SL YCSX",
      width: 80,
      renderCell: (params: any) => {
        return (
          <span style={{ color: "#009933" }}>
            <b>{params.row.PROD_REQUEST_QTY?.toLocaleString("en-US")}</b>
          </span>
        );
      },
    },
    {
      field: "CD1",
      headerName: "CD1",
      width: 60,
      renderCell: (params: any) => {
        return (
          <span style={{ color: "blue" }}>
            <b>{params.row.CD1?.toLocaleString("en", "US")}</b>
          </span>
        );
      },
    },
    {
      field: "CD2",
      headerName: "CD2",
      width: 60,
      renderCell: (params: any) => {
        return (
          <span style={{ color: "blue" }}>
            <b>{params.row.CD2?.toLocaleString("en", "US")}</b>
          </span>
        );
      },
    },
    {
      field: "CD3",
      headerName: "CD3",
      width: 60,
      renderCell: (params: any) => {
        return (
          <span style={{ color: "blue" }}>
            <b>{params.row.CD3?.toLocaleString("en", "US")}</b>
          </span>
        );
      },
    },
    {
      field: "CD4",
      headerName: "CD4",
      width: 60,
      renderCell: (params: any) => {
        return (
          <span style={{ color: "blue" }}>
            <b>{params.row.CD4?.toLocaleString("en", "US")}</b>
          </span>
        );
      },
    },
    {
      field: "LOT_TOTAL_INPUT_QTY_EA",
      type: "number",
      headerName: "NK",
      width: 60,
      renderCell: (params: any) => {
        return (
          <span style={{ color: "#cc0099" }}>
            <b>{params.row.LOT_TOTAL_INPUT_QTY_EA?.toLocaleString("en-US")}</b>
          </span>
        );
      },
    },
    {
      field: "LOT_TOTAL_OUTPUT_QTY_EA",
      type: "number",
      headerName: "XK",
      width: 60,
      renderCell: (params: any) => {
        return (
          <span style={{ color: "#cc0099" }}>
            <b>{params.row.LOT_TOTAL_OUTPUT_QTY_EA?.toLocaleString("en-US")}</b>
          </span>
        );
      },
    },
    {
      field: "TON_CD1",
      headerName: "TCD1",
      width: 60,
      renderCell: (params: any) => {
        return (
          <span style={{ color: "red" }}>
            <b>{params.row.TON_CD1?.toLocaleString("en", "US")}</b>
          </span>
        );
      },
    },
    {
      field: "TON_CD2",
      headerName: "TCD2",
      width: 60,
      renderCell: (params: any) => {
        return (
          <span style={{ color: "red" }}>
            <b>{params.row.TON_CD2?.toLocaleString("en", "US")}</b>
          </span>
        );
      },
    },
    {
      field: "TON_CD3",
      headerName: "TCD3",
      width: 60,
      renderCell: (params: any) => {
        return (
          <span style={{ color: "red" }}>
            <b>{params.row.TON_CD3?.toLocaleString("en", "US")}</b>
          </span>
        );
      },
    },
    {
      field: "TON_CD4",
      headerName: "TCD4",
      width: 60,
      renderCell: (params: any) => {
        return (
          <span style={{ color: "red" }}>
            <b>{params.row.TON_CD4?.toLocaleString("en", "US")}</b>
          </span>
        );
      },
    },
    {
      field: "INSPECT_BALANCE",
      type: "number",
      headerName: "TKIEM",
      width: 60,
      renderCell: (params: any) => {
        return (
          <span style={{ color: "#cc0099" }}>
            <b>{params.row.INSPECT_BALANCE?.toLocaleString("en-US")}</b>
          </span>
        );
      },
    },
    {
      field: "EQ1",
      headerName: "EQ1",
      width: 50,
      renderCell: (params: any) => <span style={{ color: "black" }}>{params.row.EQ1}</span>,
    },
    {
      field: "EQ2",
      headerName: "EQ2",
      width: 50,
      renderCell: (params: any) => <span style={{ color: "black" }}>{params.row.EQ2}</span>,
    },
    {
      field: "EQ3",
      headerName: "EQ3",
      width: 50,
      renderCell: (params: any) => <span style={{ color: "black" }}>{params.row.EQ3}</span>,
    },
    {
      field: "EQ4",
      headerName: "EQ4",
      width: 50,
      renderCell: (params: any) => <span style={{ color: "black" }}>{params.row.EQ4}</span>,
    },
    {
      field: "SHORTAGE_YCSX",
      type: "number",
      headerName: "TỒN YCSX",
      width: 80,
      renderCell: (params: any) => {
        return (
          <span style={{ color: "blue" }}>
            <b>{params.row.SHORTAGE_YCSX?.toLocaleString("en-US")}</b>
          </span>
        );
      },
    },
    {
      field: "PHAN_LOAI",
      headerName: "PHAN_LOAI",
      width: 80,
      renderCell: (params: any) => {
        if (params.row.PHAN_LOAI === "01")
          return <span style={{ color: "black" }}><b>Thông thường</b></span>;
        else if (params.row.PHAN_LOAI === "02")
          return <span style={{ color: "black" }}><b>SDI</b></span>;
        else if (params.row.PHAN_LOAI === "03")
          return <span style={{ color: "black" }}><b>GC</b></span>;
        else if (params.row.PHAN_LOAI === "04")
          return <span style={{ color: "black" }}><b>SAMPLE</b></span>;
        return null;
      },
    },
    { field: "PL_HANG", headerName: "PL_HANG", width: 120 },
    { field: "REMARK", headerName: "REMARK", width: 120 },
    {
      field: "PDUYET",
      headerName: "PDUYET",
      width: 80,
      renderCell: (params: any) => {
        if (params.row.PDUYET === 1)
          return <span style={{ color: "green" }}><b>Đã Duyệt</b></span>;
        else
          return <span style={{ color: "red" }}><b>Không Duyệt</b></span>;
      },
    },
    {
      field: "BANVE",
      headerName: "BANVE",
      width: 260,
      renderCell: (params: any) => {
        let fileUpload: any = null;
        if (params.row.BANVE !== "N") {
          return (
            <span style={{ color: "blue" }}>
              <a
                target="_blank"
                rel="noopener noreferrer"
                href={`/banve/${params.row.G_CODE}.pdf`}
              >
                {params.row.G_CODE}.pdf
              </a>
            </span>
          );
        } else {
          return (
            <div className="flex items-center gap-1">
              <IconButton
                size="small"
                onClick={() => {
                  if (onUploadBanVe && fileUpload) {
                    onUploadBanVe(fileUpload, params.row.G_CODE);
                  }
                }}
              >
                <AiOutlineCloudUpload color="#f59e0b" size={15} />
              </IconButton>
              <input
                accept=".pdf"
                type="file"
                style={{ fontSize: "10px" }}
                onChange={(e: any) => {
                  fileUpload = e.target.files[0];
                }}
              />
            </div>
          );
        }
      },
    },
    {
      field: "PDBV",
      headerName: "PD BANVE",
      width: 80,
      renderCell: (params: any) => {
        if (params.row.PDBV === "P" || params.row.PDBV === null)
          return <span style={{ color: "red" }}><b>PENDING</b></span>;
        return <span style={{ color: "green" }}><b>APPROVED</b></span>;
      },
    },
  ];
};

interface GetColumnDataTableProps {
  editplan?: boolean;
  onToggleIsSetting?: (row: QLSXPLANDATA) => void;
}

export const getColumnQuickPlanDataTable = ({
  editplan = true,
  onToggleIsSetting,
}: GetColumnDataTableProps = {}) => {
  return [
    {
      field: "PLAN_ID",
      headerName: "PLAN_ID",
      width: 90,
      headerCheckboxSelection: true,
      checkboxSelection: true,
      pinned: "left",
      editable: false,
      resizable: true,
    },
    {
      field: "PROD_REQUEST_NO",
      headerName: "YCSX_NO",
      width: 100,
      editable: true,
      pinned: "left",
    },
    { field: "G_CODE", headerName: "G_CODE", width: 80, editable: false },
    { field: "G_NAME", headerName: "G_NAME", width: 130, editable: false },
    {
      field: "G_NAME_KD",
      headerName: "G_NAME_KD",
      width: 100,
      editable: false,
      cellRenderer: (params: any) => {
        if (
          params.data.FACTORY === null ||
          params.data.EQ1 === null ||
          params.data.EQ2 === null ||
          params.data.Setting1 === null ||
          params.data.Setting2 === null ||
          params.data.UPH1 === null ||
          params.data.UPH2 === null ||
          params.data.Step1 === null ||
          params.data.LOSS_SX1 === null ||
          params.data.LOSS_SX2 === null ||
          params.data.LOSS_SETTING1 === null ||
          params.data.LOSS_SETTING2 === null
        )
          return <span style={{ color: "red" }}>{params.data.G_NAME_KD}</span>;
        return <span style={{ color: "green" }}>{params.data.G_NAME_KD}</span>;
      },
    },
    {
      field: "PROD_REQUEST_QTY",
      headerName: "YCSX_QTY",
      width: 80,
      editable: false,
      cellRenderer: (params: any) => {
        return (
          <span style={{ color: "blue" }}>
            {params.data.PROD_REQUEST_QTY?.toLocaleString("en", "US")}
          </span>
        );
      },
    },
    {
      field: "CD1",
      headerName: "CD1",
      width: 60,
      editable: false,
      cellRenderer: (params: any) => {
        return (
          <span style={{ color: "blue" }}>
            {params.data.CD1?.toLocaleString("en", "US")}
          </span>
        );
      },
    },
    {
      field: "CD2",
      headerName: "CD2",
      width: 60,
      editable: false,
      cellRenderer: (params: any) => {
        return (
          <span style={{ color: "blue" }}>
            {params.data.CD2?.toLocaleString("en", "US")}
          </span>
        );
      },
    },
    {
      field: "CD3",
      headerName: "CD3",
      width: 60,
      editable: false,
      cellRenderer: (params: any) => {
        return (
          <span style={{ color: "blue" }}>
            {params.data.CD3?.toLocaleString("en", "US")}
          </span>
        );
      },
    },
    {
      field: "CD4",
      headerName: "CD4",
      width: 60,
      editable: false,
      cellRenderer: (params: any) => {
        return (
          <span style={{ color: "blue" }}>
            {params.data.CD4?.toLocaleString("en", "US")}
          </span>
        );
      },
    },
    {
      field: "TON_CD1",
      headerName: "TCD1",
      width: 70,
      editable: false,
      cellRenderer: (params: any) => {
        return (
          <span style={{ color: "blue" }}>
            {params.data.TON_CD1?.toLocaleString("en", "US")}
          </span>
        );
      },
    },
    {
      field: "TON_CD2",
      headerName: "TCD2",
      width: 70,
      editable: false,
      cellRenderer: (params: any) => {
        return (
          <span style={{ color: "blue" }}>
            {params.data.TON_CD2?.toLocaleString("en", "US")}
          </span>
        );
      },
    },
    {
      field: "TON_CD3",
      headerName: "TCD3",
      width: 70,
      editable: false,
      cellRenderer: (params: any) => {
        return (
          <span style={{ color: "blue" }}>
            {params.data.TON_CD3?.toLocaleString("en", "US")}
          </span>
        );
      },
    },
    {
      field: "TON_CD4",
      headerName: "TCD4",
      width: 70,
      editable: false,
      cellRenderer: (params: any) => {
        return (
          <span style={{ color: "blue" }}>
            {params.data.TON_CD4?.toLocaleString("en", "US")}
          </span>
        );
      },
    },
    {
      field: "PLAN_QTY",
      headerName: "PLAN_QTY",
      width: 80,
      editable: editplan,
      cellRenderer: (params: any) => {
        if (params.data.PLAN_QTY === 0) {
          return <span style={{ color: "red" }}>NG</span>;
        } else {
          return (
            <span style={{ color: "green" }}>
              {params.data.PLAN_QTY?.toLocaleString("en", "US")}
            </span>
          );
        }
      },
    },
    {
      field: "PROCESS_NUMBER",
      headerName: "PROC_NUM",
      width: 80,
      editable: editplan,
      cellRenderer: (params: any) => {
        if (
          params.data.PROCESS_NUMBER === null ||
          params.data.PROCESS_NUMBER === 0
        ) {
          return <span style={{ color: "red" }}>NG</span>;
        } else {
          return <span style={{ color: "green" }}>{params.data.PROCESS_NUMBER}</span>;
        }
      },
    },
    {
      field: "PLAN_EQ",
      headerName: "PLAN_EQ",
      width: 80,
      editable: editplan,
      cellRenderer: (params: any) => {
        if (params.data.PLAN_EQ === null || params.data.PLAN_EQ === "") {
          return <span style={{ color: "red" }}>NG</span>;
        } else {
          return <span style={{ color: "green" }}>{params.data.PLAN_EQ}</span>;
        }
      },
    },
    { field: "STEP", headerName: "STEP", width: 50, editable: editplan },
    {
      field: "IS_SETTING",
      headerName: "IS_SETTING",
      width: 100,
      cellRenderer: (params: any) => {
        return (
          <input
            type="checkbox"
            name="isSettingCheckbox"
            checked={params.data.IS_SETTING === "Y"}
            onChange={() => {
              if (onToggleIsSetting) {
                onToggleIsSetting(params.data);
              }
            }}
          />
        );
      },
      editable: false,
    },
    {
      field: "PLAN_ORDER",
      headerName: "ORDER",
      width: 60,
      editable: editplan,
    },
    {
      field: "SLC_CD1",
      headerName: "SLC_CD1",
      width: 70,
      editable: false,
      cellRenderer: (params: any) => {
        return (
          <span style={{ color: "green" }}>
            {params.data?.SLC_CD1?.toLocaleString("en", "US")}
          </span>
        );
      },
    },
    {
      field: "SLC_CD2",
      headerName: "SLC_CD2",
      width: 70,
      editable: false,
      cellRenderer: (params: any) => {
        return (
          <span style={{ color: "green" }}>
            {params.data?.SLC_CD2?.toLocaleString("en", "US")}
          </span>
        );
      },
    },
    {
      field: "SLC_CD3",
      headerName: "SLC_CD3",
      width: 70,
      editable: false,
      cellRenderer: (params: any) => {
        return (
          <span style={{ color: "green" }}>
            {params.data?.SLC_CD3?.toLocaleString("en", "US")}
          </span>
        );
      },
    },
    {
      field: "SLC_CD4",
      headerName: "SLC_CD4",
      width: 70,
      editable: false,
      cellRenderer: (params: any) => {
        return (
          <span style={{ color: "green" }}>
            {params.data?.SLC_CD4?.toLocaleString("en", "US")}
          </span>
        );
      },
    },
    { field: "EQ1", headerName: "EQ1", width: 50, editable: editplan },
    { field: "EQ2", headerName: "EQ2", width: 50, editable: editplan },
    { field: "EQ3", headerName: "EQ3", width: 50, editable: editplan },
    { field: "EQ4", headerName: "EQ4", width: 50, editable: editplan },
    {
      field: "PLAN_FACTORY",
      headerName: "NM",
      width: 50,
      editable: false,
    },
    {
      field: "PLAN_DATE",
      headerName: "PLAN_DATE",
      width: 110,
      editable: false,
    },
    {
      field: "NEXT_PLAN_ID",
      headerName: "NEXT_PLAN_ID",
      width: 120,
      editable: true,
    },
  ];
};
