import React, { memo, useMemo } from "react";
import PivotGridDataSource from "devextreme/ui/pivot_grid/data_source";
import PivotTable from "../../../../components/PivotChart/PivotChart";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  data: any[];
  title?: string;
  tableID: string;
}

/**
 * Modal Pivot dùng chung cho module Plan (tab Quản lý Plan & tab Plan Status).
 * Tạo datasource tổng hợp mọi cột của dữ liệu giống pivot nội bộ AGTable.
 */
const PrecisionPlanPivotModal: React.FC<Props> = ({
  isOpen,
  onClose,
  data,
  title = "PHÂN TÍCH PIVOT — KẾ HOẠCH GIAO HÀNG",
  tableID,
}) => {
  const dataSource = useMemo(() => {
    const keys = data && data.length > 0 ? Object.keys(data[0]) : [];
    const fields = keys
      .filter((key) => key !== "id")
      .map((key) => ({
        caption: key,
        width: 80,
        dataField: key,
        allowSorting: true,
        allowFiltering: true,
        summaryType: "sum",
        format: "fixedPoint",
        headerFilter: { allowSearch: true, height: 400, width: 280 },
      }));
    return new PivotGridDataSource({ fields, store: data });
  }, [data]);

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(15, 23, 42, 0.55)",
        zIndex: 100000,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 24,
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: "#ffffff",
          borderRadius: 10,
          width: "min(1200px, 96vw)",
          height: "min(80vh, 820px)",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          boxShadow: "0 25px 50px -12px rgba(15, 23, 42, 0.35)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "8px 14px",
            borderBottom: "1px solid #e2e8f0",
            fontWeight: 700,
            fontSize: 12,
            color: "#0f172a",
          }}
        >
          <span>{title}</span>
          <button
            type="button"
            onClick={onClose}
            style={{
              border: "1px solid #cbd5e1",
              borderRadius: 4,
              background: "#ffffff",
              padding: "3px 10px",
              cursor: "pointer",
              fontSize: 11,
              fontWeight: 600,
              color: "#334155",
            }}
          >
            Đóng
          </button>
        </div>
        <div style={{ flex: 1, minHeight: 0, overflow: "auto" }}>
          {data.length > 0 ? (
            <PivotTable datasource={dataSource} tableID={tableID} />
          ) : (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                height: "100%",
                color: "#94a3b8",
                fontSize: 12,
                fontStyle: "italic",
              }}
            >
              Chưa có dữ liệu để phân tích. Hãy tra cứu dữ liệu trước.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default memo(PrecisionPlanPivotModal);
