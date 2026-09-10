import React, { memo, useMemo } from "react";
import { FiPlus, FiSave, FiTrash2 } from "react-icons/fi";
import AGTable from "../../../../components/DataTable/AGTable";
import { SaveExcel } from "../../../../api/services/excelService";
import { BANGGIA_DATA_CALC } from "../../interfaces/kdInterface";

interface Props {
  tempQTY: number;
  onChangeQTY: (qty: number) => void;
  profit: number;
  onChangeProfit: (profit: number) => void;
  salePriceNB: number;
  onChangeSalePriceNB: (price: number) => void;
  salePriceOP: number;
  onChangeSalePriceOP: (price: number) => void;
  onAddToList: () => void;
  onSaveMaster: () => void;
  banggia: BANGGIA_DATA_CALC[];
  onDeleteRow: (id: any) => void;
  onOpenPivot?: () => void;
}

const PrecisionCostPricingAndHistory: React.FC<Props> = ({
  tempQTY,
  onChangeQTY,
  profit,
  onChangeProfit,
  salePriceNB,
  onChangeSalePriceNB,
  salePriceOP,
  onChangeSalePriceOP,
  onAddToList,
  onSaveMaster,
  banggia,
  onDeleteRow,
  onOpenPivot,
}) => {
  const unitPrice1EA = tempQTY > 0 ? (salePriceOP / tempQTY).toFixed(0) : "0";

  const columns_banggia = useMemo(
    () => [
      { field: "CUST_CD", headerName: "MÃ KH", width: 70, cellStyle: { fontWeight: 700 } },
      {
        field: "G_CODE",
        headerName: "G_CODE",
        width: 80,
        cellRenderer: (params: any) => (
          <span style={{ fontFamily: "'JetBrains Mono', monospace", fontWeight: 700, color: "#1d4ed8" }}>
            {params.value}
          </span>
        ),
      },
      { field: "PRICE_DATE", headerName: "PRICE_DATE", width: 90, cellStyle: { textAlign: "center" } },
      {
        field: "MOQ",
        headerName: "MOQ",
        width: 70,
        cellStyle: { textAlign: "right", fontFamily: "'JetBrains Mono', monospace" },
        cellRenderer: (params: any) => params.value?.toLocaleString(),
      },
      {
        field: "PROD_PRICE",
        headerName: "PROD_PRICE",
        width: 90,
        cellStyle: { textAlign: "right", fontWeight: 700, color: "#1d4ed8", fontFamily: "'JetBrains Mono', monospace" },
        cellRenderer: (params: any) => params.value?.toLocaleString(),
      },
      {
        field: "BEP",
        headerName: "BEP",
        width: 80,
        cellStyle: { textAlign: "right", color: "#64748b", fontFamily: "'JetBrains Mono', monospace" },
        cellRenderer: (params: any) => params.value?.toLocaleString(),
      },
      {
        field: "FINAL",
        headerName: "APPROVAL",
        width: 80,
        cellRenderer: (params: any) => {
          if (params.data?.FINAL === "Y") {
            return (
              <span
                style={{
                  background: "#dcfce7",
                  color: "#15803d",
                  fontWeight: 800,
                  fontSize: 10,
                  padding: "1px 6px",
                  borderRadius: 3,
                }}
              >
                Y
              </span>
            );
          }
          return (
            <span
              style={{
                background: "#ffe4e6",
                color: "#e11d48",
                fontWeight: 700,
                fontSize: 10,
                padding: "1px 4px",
                borderRadius: 3,
              }}
            >
              Not Approved
            </span>
          );
        },
      },
      {
        field: "DELETE",
        headerName: "DELETE",
        width: 65,
        cellRenderer: (params: any) => (
          <button
            style={{
              background: "#fee2e2",
              border: "1px solid #fca5a5",
              color: "#dc2626",
              cursor: "pointer",
              borderRadius: 3,
              padding: "1px 5px",
              fontSize: 10,
              fontWeight: 700,
            }}
            onClick={() => onDeleteRow(params.data?.id)}
            title="Xóa mốc giá này"
          >
            Xóa
          </button>
        ),
      },
    ],
    [onDeleteRow]
  );

  const agTableHistory = useMemo(() => {
    return (
      <AGTable
        showFilter={true}
        columns={columns_banggia}
        data={banggia}
      />
    );
  }, [columns_banggia, banggia]);

  return (
    <div className="stitch-calc__pricing-box">
      {/* Khung nhập giá & MOQ */}
      <div className="pricing-inputs-card">
        {/* Row 1: MOQ & Lợi nhuận */}
        <div className="two-col-grid">
          <div>
            <label>MOQ (EA):</label>
            <div className="input-wrap">
              <input
                type="number"
                value={tempQTY}
                onChange={(e) => onChangeQTY(Number(e.target.value))}
              />
            </div>
          </div>
          <div>
            <label>Lợi nhuận mong muốn (%):</label>
            <div className="input-wrap">
              <input
                type="number"
                style={{ color: "#047857" }}
                value={profit}
                onChange={(e) => onChangeProfit(Number(e.target.value))}
              />
            </div>
          </div>
        </div>

        {/* Row 2: Giá bán Nội Bộ & Giá bán Open */}
        <div className="two-col-grid">
          <div>
            <label>Giá bán Nội Bộ (MOA Nội Bộ):</label>
            <div className="input-wrap">
              <input
                type="number"
                readOnly
                style={{ background: "#f1f5f9" }}
                value={Number(salePriceNB.toFixed(0))}
                onChange={(e) => onChangeSalePriceNB(Number(e.target.value))}
              />
              <span className="suffix-tag">VND</span>
            </div>
          </div>
          <div>
            <label>Giá bán Open (MOA Open):</label>
            <div className="input-wrap">
              <input
                type="number"
                readOnly
                style={{ background: "#f1f5f9" }}
                value={Number(salePriceOP.toFixed(0))}
                onChange={(e) => onChangeSalePriceOP(Number(e.target.value))}
              />
              <span className="suffix-tag">VND</span>
            </div>
          </div>
        </div>

        {/* Box GIÁ BÁN 1EA */}
        <div className="unit-price-box">
          <span className="label">Giá bán 1EA:</span>
          <div className="price">
            <span className="number">{Number(unitPrice1EA).toLocaleString()}</span>
            <span className="unit">VND</span>
          </div>
        </div>

        {/* Cụm 2 nút hành động lớn */}
        <div className="actions-row">
          <button className="btn-add" onClick={onAddToList} title="Thêm vào danh sách">
            <FiPlus size={14} />
            <span>Add to List</span>
          </button>
          <button className="btn-save" onClick={onSaveMaster} title="Lưu giá vào DB">
            <FiSave size={14} />
            <span>💾 Lưu Giá</span>
          </button>
        </div>
      </div>

      {/* Bảng Lịch Sử & Danh Sách Đã Tính Giá */}
      <div className="history-card">
        <div className="stitch-calc__header-bar">
          <span className="title">Lịch Sử &amp; Danh Sách Đã Tính Giá</span>
          <div className="tools">
            <button
              onClick={() => SaveExcel(banggia, "Lich_Su_Bao_Gia")}
              title="Xuất file Excel (EX1)"
            >
              EX1
            </button>
            <button
              onClick={() => SaveExcel(banggia, "Lich_Su_Bao_Gia_Full")}
              title="Xuất file Excel đầy đủ (EX2)"
            >
              EX2
            </button>
            {onOpenPivot && (
              <button onClick={onOpenPivot} title="Phân tích Pivot">
                PIVOT
              </button>
            )}
          </div>
        </div>

        <div className="grid-container">
          {agTableHistory}
        </div>

        <div className="stitch-calc__footer-bar">
          <span></span>
          <span>
            Total: <strong>{banggia.length} rows</strong>
          </span>
        </div>
      </div>
    </div>
  );
};

export default memo(PrecisionCostPricingAndHistory);
