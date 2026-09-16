import React from "react";
import { AiFillCloseCircle } from "react-icons/ai";
import { IconButton } from "@mui/material";
import PivotTable from "../../../../components/PivotChart/PivotChart";

interface PivotModalProps {
  isOpen: boolean;
  onClose: () => void;
  dataSource: any;
}

export const PrecisionProductBarcodePivotModal: React.FC<PivotModalProps> = React.memo(
  ({ isOpen, onClose, dataSource }) => {
    if (!isOpen) return null;

    return (
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: "rgba(15, 23, 42, 0.6)",
          backdropFilter: "blur(4px)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 9999,
          padding: "20px",
        }}
        onClick={onClose}
      >
        <div
          style={{
            position: "relative",
            width: "95vw",
            height: "90vh",
            backgroundColor: "#ffffff",
            borderRadius: "10px",
            boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.2), 0 10px 10px -5px rgba(0, 0, 0, 0.1)",
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* MODAL HEADER */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "10px 16px",
              borderBottom: "1px solid #e2e8f0",
              backgroundColor: "#f8fafc",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <span style={{ fontSize: "13px", fontWeight: 700, color: "#0f172a" }}>
                PHÂN TÍCH ĐA CHIỀU DỮ LIỆU SẢN XUẤT & MÃ VẠCH (PIVOT GRID)
              </span>
            </div>
            <IconButton onClick={onClose} size="small" style={{ color: "#ef4444" }}>
              <AiFillCloseCircle size={22} />
            </IconButton>
          </div>

          {/* MODAL BODY */}
          <div style={{ flex: 1, minHeight: 0, overflow: "auto", padding: "10px" }}>
            <PivotTable datasource={dataSource} tableID="product_barcode_pivot" />
          </div>
        </div>
      </div>
    );
  }
);

PrecisionProductBarcodePivotModal.displayName = "PrecisionProductBarcodePivotModal";
