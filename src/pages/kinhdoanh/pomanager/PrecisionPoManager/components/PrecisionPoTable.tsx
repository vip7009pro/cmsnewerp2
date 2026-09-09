import React, { useMemo } from "react";
import AGTable from "../../../../../components/DataTable/AGTable";
import { POTableData } from "../../../interfaces/kdInterface";
import "../PrecisionPoManager.scss";

interface PrecisionPoTableProps {
  data: POTableData[];
  currency: string;
  isCMS: boolean;
  onRowClick: (params: any) => void;
  onSelectionChange: (params: any) => void;
  tableRef?: any;
}

const PrecisionPoTable: React.FC<PrecisionPoTableProps> = ({
  data,
  currency,
  isCMS,
  onRowClick,
  onSelectionChange,
  tableRef,
}) => {
  const columns = useMemo(() => {
    const cols: any[] = [
      {
        field: "PO_ID",
        headerName: "PO_ID",
        width: 85,
        headerCheckboxSelection: true,
        checkboxSelection: true,
        cellClass: "font-mono-num font-semibold text-blue-600",
      },
      {
        field: "CUST_NAME_KD",
        headerName: "Khách Hàng",
        width: 120,
        cellClass: "font-medium",
      },
      {
        field: "PO_NO",
        headerName: "Số PO",
        width: 110,
        cellClass: "font-mono-num text-slate-600",
      },
      {
        field: "G_NAME",
        headerName: "Tên Sản Phẩm",
        width: 170,
        cellRenderer: (params: any) => (
          <span title={params.value} style={{ fontWeight: 500, overflow: "hidden", textOverflow: "ellipsis" }}>
            {params.value}
          </span>
        ),
      },
      {
        field: "G_NAME_KD",
        headerName: "Mã KD",
        width: 110,
        cellClass: "font-mono-num font-medium",
      },
      {
        field: "G_CODE",
        headerName: "Mã ERP",
        width: 85,
        cellClass: "font-mono-num font-semibold text-slate-800",
      },
      {
        field: "PO_DATE",
        headerName: "Ngày Đặt",
        width: 85,
        cellClass: "font-mono-num text-slate-500",
      },
      {
        field: "RD_DATE",
        headerName: "Hạn Giao",
        width: 85,
        cellRenderer: (params: any) => {
          const isUrgent = params.data.PO_BALANCE > 0 && params.value <= new Date().toISOString().slice(0, 10);
          return (
            <span
              className="font-mono-num"
              style={{
                color: isUrgent ? "#e11d48" : "#475569",
                fontWeight: isUrgent ? 700 : 400,
              }}
            >
              {params.value}
            </span>
          );
        },
      },
    ];

    if (!isCMS) {
      cols.push({
        field: "BEP",
        headerName: "BEP ($)",
        width: 80,
        cellClass: "font-mono-num text-right",
        cellRenderer: (params: any) => (
          <span style={{ color: "#0284c7", fontWeight: 600 }}>
            {params.data.BEP?.toLocaleString("en-US", { maximumFractionDigits: 4 })}
          </span>
        ),
      });
    }

    cols.push(
      {
        field: "PROD_PRICE",
        headerName: "Đơn Giá ($)",
        width: 85,
        cellClass: "font-mono-num text-right",
        cellRenderer: (params: any) => (
          <span style={{ color: "#475569", fontWeight: 600 }}>
            {params.data.PROD_PRICE?.toLocaleString("en-US", { maximumFractionDigits: 6 })}
          </span>
        ),
      },
      {
        field: "PO_QTY",
        headerName: "PO QTY",
        width: 95,
        cellClass: "font-mono-num text-right",
        cellRenderer: (params: any) => (
          <span style={{ color: "#1d4ed8", fontWeight: 700 }}>
            {params.data.PO_QTY?.toLocaleString("en-US")}
          </span>
        ),
      },
      {
        field: "TOTAL_DELIVERED",
        headerName: "ĐÃ GIAO",
        width: 95,
        cellClass: "font-mono-num text-right",
        cellRenderer: (params: any) => (
          <span style={{ color: "#059669", fontWeight: 600 }}>
            {params.data.TOTAL_DELIVERED?.toLocaleString("en-US")}
          </span>
        ),
      },
      {
        field: "PO_BALANCE",
        headerName: "PO TỒN",
        width: 95,
        cellClass: "font-mono-num text-right",
        cellRenderer: (params: any) => {
          const bal = params.data.PO_BALANCE;
          return (
            <span style={{ color: bal > 0 ? "#b45309" : "#64748b", fontWeight: 700 }}>
              {bal?.toLocaleString("en-US")}
            </span>
          );
        },
      },
      {
        field: "PO_AMOUNT",
        headerName: "PO AMT ($)",
        width: 95,
        cellClass: "font-mono-num text-right",
        cellRenderer: (params: any) => (
          <span style={{ color: "#0f172a", fontWeight: 600 }}>
            {params.data.PO_AMOUNT?.toLocaleString("en-US", {
              style: "currency",
              currency: currency,
            })}
          </span>
        ),
      },
      {
        field: "DELIVERED_AMOUNT",
        headerName: "GIAO AMT ($)",
        width: 95,
        cellClass: "font-mono-num text-right",
        cellRenderer: (params: any) => (
          <span style={{ color: "#0284c7" }}>
            {params.data.DELIVERED_AMOUNT?.toLocaleString("en-US", {
              style: "currency",
              currency: currency,
            })}
          </span>
        ),
      },
      {
        field: "BALANCE_AMOUNT",
        headerName: "TỒN AMT ($)",
        width: 95,
        cellClass: "font-mono-num text-right",
        cellRenderer: (params: any) => (
          <span style={{ color: "#be123c", fontWeight: 600 }}>
            {params.data.BALANCE_AMOUNT?.toLocaleString("en-US", {
              style: "currency",
              currency: currency,
            })}
          </span>
        ),
      },
      {
        field: "EMPL_NAME",
        headerName: "Nhân Viên KD",
        width: 120,
      },
      {
        field: "PROD_TYPE",
        headerName: "Phân Loại",
        width: 80,
        cellRenderer: (params: any) => (
          <span
            style={{
              padding: "1px 6px",
              borderRadius: 4,
              fontSize: 10,
              fontWeight: 600,
              background: "#f1f5f9",
              color: "#334155",
              border: "1px solid #e2e8f0",
            }}
          >
            {params.value}
          </span>
        ),
      },
      {
        field: "M_NAME_FULLBOM",
        headerName: "Tên BOM",
        width: 110,
      },
      {
        field: "PROD_MAIN_MATERIAL",
        headerName: "Vật Liệu Chính",
        width: 110,
      },
      {
        field: "DESCR",
        headerName: "Mô tả",
        width: 90,
      },
      {
        field: "OVERDUE",
        headerName: "Trạng Thái",
        width: 95,
        cellRenderer: (params: any) => {
          const bal = params.data.PO_BALANCE;
          const isCompleted = bal <= 0;
          const isUrgent = bal > 0 && params.data.RD_DATE <= new Date().toISOString().slice(0, 10);
          if (isCompleted) {
            return (
              <span
                style={{
                  padding: "1px 6px",
                  borderRadius: 9999,
                  fontSize: 9.5,
                  fontWeight: 700,
                  background: "#ecfdf5",
                  color: "#059669",
                  border: "1px solid #a7f3d0",
                }}
              >
                HOÀN TẤT
              </span>
            );
          }
          if (isUrgent) {
            return (
              <span
                style={{
                  padding: "1px 6px",
                  borderRadius: 9999,
                  fontSize: 9.5,
                  fontWeight: 700,
                  background: "#fff1f2",
                  color: "#e11d48",
                  border: "1px solid #fecdd3",
                }}
              >
                GIAO GẤP
              </span>
            );
          }
          return (
            <span
              style={{
                padding: "1px 6px",
                borderRadius: 9999,
                fontSize: 9.5,
                fontWeight: 600,
                background: "#eff6ff",
                color: "#1d4ed8",
                border: "1px solid #bfdbfe",
              }}
            >
              ĐANG XỬ LÝ
            </span>
          );
        },
      },
      {
        field: "REMARK",
        headerName: "Ghi chú",
        width: 120,
      }
    );

    return cols;
  }, [isCMS, currency]);

  return (
    <div className="po-grid-body">
      <AGTable
        ref={tableRef}
        suppressRowClickSelection={false}
        showFilter={true}
        columns={columns}
        data={data}
        onRowClick={onRowClick}
        onSelectionChange={onSelectionChange}
      />
    </div>
  );
};

export default React.memo(PrecisionPoTable);
