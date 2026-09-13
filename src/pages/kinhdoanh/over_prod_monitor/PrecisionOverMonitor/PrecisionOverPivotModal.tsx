import React, { useMemo } from "react";
import { FiX } from "react-icons/fi";
import PivotGridDataSource from "devextreme/ui/pivot_grid/data_source";
import PivotTable from "../../../../components/PivotChart/PivotChart";
import { PROD_OVER_DATA } from "../../interfaces/kdInterface";

interface PrecisionOverPivotModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: PROD_OVER_DATA[];
}

const PrecisionOverPivotModal: React.FC<PrecisionOverPivotModalProps> = ({
  isOpen,
  onClose,
  data,
}) => {
  const dataSource = useMemo(() => {
    return new PivotGridDataSource({
      fields: [
        {
          caption: "CUSTOMER",
          width: 140,
          dataField: "CUST_NAME_KD",
          area: "row",
        },
        {
          caption: "G_NAME_KD",
          width: 160,
          dataField: "G_NAME_KD",
          area: "row",
        },
        {
          caption: "KD_CFM",
          dataField: "KD_CFM",
          width: 90,
          area: "column",
        },
        {
          caption: "HANDLE_STATUS",
          dataField: "HANDLE_STATUS",
          width: 100,
          area: "column",
        },
        {
          caption: "OVER_QTY (SL Dư)",
          dataField: "OVER_QTY",
          dataType: "number",
          summaryType: "sum",
          format: "fixedPoint",
          area: "data",
        },
        {
          caption: "AMOUNT (Thành Tiền USD)",
          dataField: "AMOUNT",
          dataType: "number",
          summaryType: "sum",
          format: { type: "currency", currency: "USD" },
          area: "data",
        },
      ],
      store: data,
    });
  }, [data]);

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
          maxWidth: "1500px",
          height: "90vh",
          borderRadius: "8px",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
          border: "1px solid #cbd5e1",
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
          <span style={{ fontWeight: 800, fontSize: "12.5px", letterSpacing: "0.02em" }}>
            PHÂN TÍCH SẢN XUẤT DƯ ĐA CHIỀU (PIVOT GRID MASTER)
          </span>
          <button
            type="button"
            onClick={onClose}
            style={{
              background: "transparent",
              border: "none",
              color: "#94a3b8",
              cursor: "pointer",
              padding: "4px",
              display: "flex",
              alignItems: "center",
              borderRadius: "4px",
            }}
            title="Đóng"
          >
            <FiX size={18} />
          </button>
        </div>

        <div style={{ flex: 1, padding: "8px", overflow: "hidden" }}>
          <PivotTable datasource={dataSource} tableID="BÁO CÁO PHÂN TÍCH HÀNG SẢN XUẤT DƯ" />
        </div>
      </div>
    </div>
  );
};

export default React.memo(PrecisionOverPivotModal);
