import React from "react";
import { CustomCellRendererProps } from "ag-grid-react";
import { ColDef, ColGroupDef } from "ag-grid-community";
import { FaFilePdf } from "react-icons/fa";
import { ExtendedSampleData } from "./sampleMonitorTypes";

interface ColumnOptions {
  onCheckboxChange: (row: ExtendedSampleData, key: string, checked: boolean) => void;
  onRadioChange: (row: ExtendedSampleData, key: string, value: string) => void;
}

export const getSampleMonitorColumns = ({
  onCheckboxChange,
  onRadioChange,
}: ColumnOptions): (ColDef | ColGroupDef)[] => {
  return [
    {
      field: "SAMPLE_ID",
      headerName: "ID",
      headerCheckboxSelection: true,
      checkboxSelection: true,
      width: 75,
      resizable: true,
      pinned: "left",
      floatingFilter: true,
      cellRenderer: (params: CustomCellRendererProps) => {
        return (
          <span style={{ fontFamily: "JetBrains Mono, monospace", fontWeight: 700, color: "#2563eb" }}>
            #{params.value}
          </span>
        );
      },
    },
    {
      headerName: "SAMPLE INFO",
      headerClass: "precision-sample-monitor__groupHeader",
      children: [
        {
          field: "PROD_REQUEST_NO",
          headerName: "YCSX",
          width: 85,
          resizable: true,
          floatingFilter: true,
          filter: true,
          editable: false,
          cellRenderer: (params: CustomCellRendererProps) => (
            <span style={{ fontFamily: "JetBrains Mono, monospace", fontWeight: 700, color: "#0f172a" }}>
              {params.value}
            </span>
          ),
        },
        {
          field: "CUST_NAME_KD",
          headerName: "CUSTOMER",
          width: 110,
          resizable: true,
          floatingFilter: true,
          filter: true,
          editable: false,
        },
        {
          field: "G_CODE",
          headerName: "G_CODE",
          width: 85,
          resizable: true,
          floatingFilter: true,
          filter: true,
          editable: false,
          cellRenderer: (params: CustomCellRendererProps) => (
            <span style={{ fontFamily: "JetBrains Mono, monospace", fontWeight: 600, color: "#1d4ed8" }}>
              {params.value}
            </span>
          ),
        },
        {
          field: "G_NAME_KD",
          headerName: "G_NAME_KD",
          width: 120,
          resizable: true,
          floatingFilter: true,
          filter: true,
          editable: false,
        },
        {
          field: "G_NAME",
          headerName: "G_NAME",
          width: 130,
          resizable: true,
          floatingFilter: true,
          filter: true,
          editable: false,
        },
        {
          field: "G_WIDTH",
          headerName: "G_WIDTH",
          width: 80,
          resizable: true,
          floatingFilter: true,
          filter: true,
          editable: false,
        },
        {
          field: "G_LENGTH",
          headerName: "G_LENGTH",
          width: 80,
          resizable: true,
          floatingFilter: true,
          filter: true,
          editable: false,
        },
        {
          field: "DELIVERY_DT",
          headerName: "DELIVERY_DT",
          width: 95,
          resizable: true,
          floatingFilter: true,
          filter: true,
          editable: false,
          cellRenderer: (params: CustomCellRendererProps) => (
            <span style={{ fontFamily: "JetBrains Mono, monospace" }}>{params.value}</span>
          ),
        },
        {
          field: "PROD_REQUEST_QTY",
          headerName: "SAMPLE_QTY",
          width: 90,
          resizable: true,
          floatingFilter: true,
          filter: true,
          editable: false,
          cellRenderer: (params: CustomCellRendererProps) => (
            <span style={{ fontFamily: "JetBrains Mono, monospace", fontWeight: 700, color: "#059669" }}>
              {params.data?.PROD_REQUEST_QTY?.toLocaleString("en-US")}
            </span>
          ),
        },
        {
          field: "BANVE",
          headerName: "BANVE",
          width: 80,
          resizable: true,
          floatingFilter: true,
          filter: true,
          editable: false,
          cellRenderer: (params: CustomCellRendererProps) => {
            const hrefLink = `/banve/${params.data?.G_CODE}.pdf`;
            return (
              <a
                target="_blank"
                rel="noopener noreferrer"
                href={hrefLink}
                className="precision-sample-monitor__pdfLink"
                title={`Mở bản vẽ ${params.data?.G_CODE}.pdf`}
              >
                <FaFilePdf size={12} />
                <span>Bản Vẽ</span>
              </a>
            );
          },
        },
      ],
    },

    // R&D GROUP
    {
      headerName: "RND",
      headerClass: "precision-sample-monitor__groupHeader",
      children: [
        {
          field: "FILE_MAKET",
          headerName: "FILE_MAKET",
          width: 110,
          resizable: true,
          floatingFilter: true,
          filter: true,
          editable: false,
          cellRenderer: (params: CustomCellRendererProps) => {
            const checked = params.data?.FILE_MAKET === "Y";
            return (
              <label
                className={`precision-sample-monitor__statusPill ${
                  checked
                    ? "precision-sample-monitor__statusPill--completed"
                    : "precision-sample-monitor__statusPill--pending"
                }`}
              >
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={(e) => onCheckboxChange(params.data, "FILE_MAKET", e.target.checked)}
                />
                <span>{checked ? "COMPLETED" : "PENDING"}</span>
              </label>
            );
          },
        },
        {
          field: "FILM_FILE",
          headerName: "FILM_FILE",
          width: 110,
          resizable: true,
          floatingFilter: true,
          filter: true,
          editable: false,
          cellRenderer: (params: CustomCellRendererProps) => {
            const checked = params.data?.FILM_FILE === "Y";
            return (
              <label
                className={`precision-sample-monitor__statusPill ${
                  checked
                    ? "precision-sample-monitor__statusPill--completed"
                    : "precision-sample-monitor__statusPill--pending"
                }`}
              >
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={(e) => onCheckboxChange(params.data, "FILM_FILE", e.target.checked)}
                />
                <span>{checked ? "COMPLETED" : "PENDING"}</span>
              </label>
            );
          },
        },
        {
          field: "KNIFE_STATUS",
          headerName: "KNIFE_STATUS",
          width: 110,
          resizable: true,
          floatingFilter: true,
          filter: true,
          editable: false,
          cellRenderer: (params: CustomCellRendererProps) => {
            const checked = params.data?.KNIFE_STATUS === "Y";
            return (
              <label
                className={`precision-sample-monitor__statusPill ${
                  checked
                    ? "precision-sample-monitor__statusPill--completed"
                    : "precision-sample-monitor__statusPill--pending"
                }`}
              >
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={(e) => onCheckboxChange(params.data, "KNIFE_STATUS", e.target.checked)}
                />
                <span>{checked ? "COMPLETED" : "PENDING"}</span>
              </label>
            );
          },
        },
        {
          field: "KNIFE_CODE",
          headerName: "KNIFE_CODE",
          width: 105,
          resizable: true,
          floatingFilter: true,
          filter: true,
          editable: true,
          cellStyle: (params: any) => {
            if (params.data?.KNIFE_CODE) {
              return { backgroundColor: "#ecfdf5", color: "#047857", fontWeight: 700 };
            }
            return { backgroundColor: "#fffbeb", color: "#b45309" };
          },
        },
        {
          field: "FILM",
          headerName: "FILM",
          width: 110,
          resizable: true,
          floatingFilter: true,
          filter: true,
          editable: false,
          cellRenderer: (params: CustomCellRendererProps) => {
            const checked = params.data?.FILM === "Y";
            return (
              <label
                className={`precision-sample-monitor__statusPill ${
                  checked
                    ? "precision-sample-monitor__statusPill--completed"
                    : "precision-sample-monitor__statusPill--pending"
                }`}
              >
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={(e) => onCheckboxChange(params.data, "FILM", e.target.checked)}
                />
                <span>{checked ? "COMPLETED" : "PENDING"}</span>
              </label>
            );
          },
        },
      ],
    },

    // MATERIAL GROUP
    {
      headerName: "MATERIAL",
      headerClass: "precision-sample-monitor__groupHeader",
      children: [
        {
          field: "MATERIAL_STATUS",
          headerName: "MATERIAL_STATUS",
          width: 115,
          resizable: true,
          floatingFilter: true,
          filter: true,
          editable: false,
          cellRenderer: (params: CustomCellRendererProps) => {
            const checked = params.data?.MATERIAL_STATUS === "Y";
            return (
              <label
                className={`precision-sample-monitor__statusPill ${
                  checked
                    ? "precision-sample-monitor__statusPill--completed"
                    : "precision-sample-monitor__statusPill--pending"
                }`}
              >
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={(e) => onCheckboxChange(params.data, "MATERIAL_STATUS", e.target.checked)}
                />
                <span>{checked ? "COMPLETED" : "PENDING"}</span>
              </label>
            );
          },
        },
      ],
    },

    // PRODUCTION GROUP
    {
      headerName: "PRODUCTION",
      headerClass: "precision-sample-monitor__groupHeader",
      children: [
        {
          field: "PRINT_STATUS",
          headerName: "PRINT_STATUS",
          width: 110,
          resizable: true,
          floatingFilter: true,
          filter: true,
          editable: false,
          cellRenderer: (params: CustomCellRendererProps) => {
            const checked = params.data?.PRINT_STATUS === "Y";
            return (
              <label
                className={`precision-sample-monitor__statusPill ${
                  checked
                    ? "precision-sample-monitor__statusPill--completed"
                    : "precision-sample-monitor__statusPill--pending"
                }`}
              >
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={(e) => onCheckboxChange(params.data, "PRINT_STATUS", e.target.checked)}
                />
                <span>{checked ? "COMPLETED" : "PENDING"}</span>
              </label>
            );
          },
        },
        {
          field: "DIECUT_STATUS",
          headerName: "DIECUT_STATUS",
          width: 110,
          resizable: true,
          floatingFilter: true,
          filter: true,
          editable: false,
          cellRenderer: (params: CustomCellRendererProps) => {
            const checked = params.data?.DIECUT_STATUS === "Y";
            return (
              <label
                className={`precision-sample-monitor__statusPill ${
                  checked
                    ? "precision-sample-monitor__statusPill--completed"
                    : "precision-sample-monitor__statusPill--pending"
                }`}
              >
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={(e) => onCheckboxChange(params.data, "DIECUT_STATUS", e.target.checked)}
                />
                <span>{checked ? "COMPLETED" : "PENDING"}</span>
              </label>
            );
          },
        },
      ],
    },

    // QC GROUP
    {
      headerName: "QC",
      headerClass: "precision-sample-monitor__groupHeader",
      children: [
        {
          field: "QC_STATUS",
          headerName: "QC_STATUS",
          width: 110,
          resizable: true,
          floatingFilter: true,
          filter: true,
          editable: false,
          cellRenderer: (params: CustomCellRendererProps) => {
            const val = params.data?.QC_STATUS;
            return (
              <div className="precision-sample-monitor__radioSegmentCell">
                <label className={val === "Y" ? "is-ok" : ""}>
                  <input
                    type="radio"
                    name={`qc_${params.data?.SAMPLE_ID}`}
                    value="Y"
                    checked={val === "Y"}
                    onChange={(e) => onRadioChange(params.data, "QC_STATUS", e.target.value)}
                  />
                  <span>OK</span>
                </label>
                <label className={val === "N" ? "is-ng" : ""}>
                  <input
                    type="radio"
                    name={`qc_${params.data?.SAMPLE_ID}`}
                    value="N"
                    checked={val === "N"}
                    onChange={(e) => onRadioChange(params.data, "QC_STATUS", e.target.value)}
                  />
                  <span>NG</span>
                </label>
              </div>
            );
          },
        },
        {
          field: "TOTAL_STATUS",
          headerName: "TOTAL_STATUS",
          width: 120,
          resizable: true,
          floatingFilter: true,
          filter: true,
          editable: false,
          cellRenderer: (params: CustomCellRendererProps) => {
            const isCompleted = params.value === "COMPLETED";
            return (
              <span
                className={`precision-sample-monitor__totalBadge ${
                  isCompleted
                    ? "precision-sample-monitor__totalBadge--completed"
                    : "precision-sample-monitor__totalBadge--pending"
                }`}
              >
                {isCompleted ? "COMPLETED" : "NOT COMPLETED"}
              </span>
            );
          },
          valueGetter: (params: any) => {
            const d = params.data;
            if (!d) return "N";
            const ok =
              d.FILE_MAKET === "Y" &&
              d.FILM_FILE === "Y" &&
              d.KNIFE_STATUS === "Y" &&
              Boolean(d.KNIFE_CODE) &&
              d.FILM === "Y" &&
              d.PRINT_STATUS === "Y" &&
              d.DIECUT_STATUS === "Y" &&
              d.QC_STATUS === "Y" &&
              d.MATERIAL_STATUS === "Y";
            return ok ? "Y" : "N";
          },
        },
      ],
    },

    // CUSTOMER GROUP
    {
      headerName: "CUSTOMER",
      headerClass: "precision-sample-monitor__groupHeader",
      children: [
        {
          field: "APPROVE_STATUS",
          headerName: "APPROVE_STATUS",
          width: 155,
          resizable: true,
          floatingFilter: true,
          filter: true,
          editable: false,
          cellRenderer: (params: CustomCellRendererProps) => {
            const val = params.data?.APPROVE_STATUS;
            return (
              <div className="precision-sample-monitor__radioSegmentCell">
                <label className={val === "Y" ? "is-ok" : ""}>
                  <input
                    type="radio"
                    name={`app_${params.data?.SAMPLE_ID}`}
                    value="Y"
                    checked={val === "Y"}
                    onChange={(e) => onRadioChange(params.data, "APPROVE_STATUS", e.target.value)}
                  />
                  <span>APPROVED</span>
                </label>
                <label className={val === "N" ? "is-ng" : ""}>
                  <input
                    type="radio"
                    name={`app_${params.data?.SAMPLE_ID}`}
                    value="N"
                    checked={val === "N"}
                    onChange={(e) => onRadioChange(params.data, "APPROVE_STATUS", e.target.value)}
                  />
                  <span>REJECTED</span>
                </label>
              </div>
            );
          },
        },
        {
          field: "APPROVE_DATE",
          headerName: "APPROVE_DATE",
          width: 95,
          resizable: true,
          floatingFilter: true,
          filter: true,
          editable: false,
          cellRenderer: (params: CustomCellRendererProps) => (
            <span style={{ fontFamily: "JetBrains Mono, monospace" }}>{params.value}</span>
          ),
        },
        {
          field: "REMARK",
          headerName: "REMARK",
          width: 125,
          resizable: true,
          floatingFilter: true,
          filter: true,
          editable: true,
        },
        {
          field: "USE_YN",
          headerName: "USE_YN",
          width: 80,
          resizable: true,
          floatingFilter: true,
          filter: true,
          editable: false,
          cellRenderer: (params: CustomCellRendererProps) => {
            const isOpen = params.data?.USE_YN === "Y";
            return (
              <span
                className={`precision-sample-monitor__lockChip ${
                  isOpen
                    ? "precision-sample-monitor__lockChip--open"
                    : "precision-sample-monitor__lockChip--locked"
                }`}
              >
                {isOpen ? "MỞ" : "KHÓA"}
              </span>
            );
          },
        },
        {
          field: "INS_DATE",
          headerName: "INS_DATE",
          width: 95,
          resizable: true,
          floatingFilter: true,
          filter: true,
          editable: false,
          cellRenderer: (params: CustomCellRendererProps) => (
            <span style={{ fontFamily: "JetBrains Mono, monospace" }}>{params.value}</span>
          ),
        },
        {
          field: "INS_EMPL",
          headerName: "PIC_KD",
          width: 100,
          resizable: true,
          floatingFilter: true,
          filter: true,
          editable: false,
        },
      ],
    },
  ];
};
