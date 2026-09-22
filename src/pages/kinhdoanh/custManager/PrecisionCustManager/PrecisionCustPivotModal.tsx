import React from "react";
import { FiX } from "react-icons/fi";
import type PivotGridDataSource from "devextreme/ui/pivot_grid/data_source";
import PivotTable from "../../../../components/PivotChart/PivotChart";

interface PrecisionCustPivotModalProps {
  isOpen: boolean;
  onClose: () => void;
  dataSource: PivotGridDataSource;
}

const PrecisionCustPivotModal: React.FC<PrecisionCustPivotModalProps> = ({
  isOpen,
  onClose,
  dataSource,
}) => {
  if (!isOpen) return null;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 125000,
        background: "rgba(15, 23, 42, 0.6)",
        backdropFilter: "blur(4px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "16px",
      }}
    >
      <div
        style={{
          background: "#ffffff",
          width: "95%",
          height: "90vh",
          borderRadius: "10px",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
        }}
      >
        <div
          style={{
            padding: "8px 16px",
            background: "#0f172a",
            color: "#ffffff",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderBottom: "1px solid #334155",
          }}
        >
          <span style={{ fontWeight: 700, fontSize: "13px" }}>
            Phân Tích Báo Cáo Đối Tác Đa Chiều (Pivot Grid Master)
          </span>
          <button
            type="button"
            style={{
              background: "rgba(255, 255, 255, 0.15)",
              border: "none",
              color: "#ffffff",
              width: "26px",
              height: "26px",
              borderRadius: "50%",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
            onClick={onClose}
            title="Đóng modal"
          >
            <FiX size={15} />
          </button>
        </div>
        <div style={{ padding: "12px", height: "calc(100% - 50px)", overflow: "auto" }}>
          <PivotTable datasource={dataSource} tableID="CustPivotMaster" />
        </div>
      </div>
    </div>
  );
};

export default React.memo(PrecisionCustPivotModal);
