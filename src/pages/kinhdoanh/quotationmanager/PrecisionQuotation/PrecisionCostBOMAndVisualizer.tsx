import React, { memo, useMemo } from "react";
import { FiExternalLink, FiEye, FiLayers, FiRefreshCw } from "react-icons/fi";
import AGTable from "../../../../components/DataTable/AGTable";
import { SaveExcel } from "../../../../api/services/excelService";
import { BOM_GIA } from "../../../rnd/interfaces/rndInterface";
import { CODEDATA } from "../../interfaces/kdInterface";
import CodeVisualLize from "../CodeVisualize/CodeVisualLize";

interface Props {
  listVL: BOM_GIA[];
  selectedCode: CODEDATA;
  onUpdateGiaNVL: () => void;
  onOpenPivot?: () => void;
  onOpenVisualizer?: () => void;
}

const columns_listbomvl = [
  {
    field: "G_CODE",
    headerName: "G_CODE",
    width: 75,
    cellRenderer: (params: any) => (
      <span style={{ fontFamily: "'JetBrains Mono', monospace", fontWeight: 700, color: "#1d4ed8" }}>
        {params.value}
      </span>
    ),
  },
  { field: "G_SEQ", headerName: "STT", width: 45, cellStyle: { textAlign: "center" } },
  { field: "M_CODE", headerName: "M_CODE", width: 85, cellStyle: { fontFamily: "'JetBrains Mono', monospace" } },
  { field: "M_NAME", headerName: "M_NAME", width: 140 },
  { field: "MAT_CUTWIDTH", headerName: "SIZE", width: 55, cellStyle: { textAlign: "right" } },
  {
    field: "M_CMS_PRICE",
    headerName: "GIÁ NỘI BỘ",
    width: 80,
    editable: true,
    cellStyle: { textAlign: "right", fontWeight: 700, color: "#1d4ed8" },
    cellRenderer: (params: any) => params.value?.toLocaleString("en-US", { maximumFractionDigits: 2 }),
  },
  {
    field: "M_SS_PRICE",
    headerName: "GIÁ OPEN",
    width: 80,
    editable: true,
    cellStyle: { textAlign: "right", fontWeight: 700, color: "#059669" },
    cellRenderer: (params: any) => params.value?.toLocaleString("en-US", { maximumFractionDigits: 2 }),
  },
  { field: "USAGE", headerName: "VAI TRÒ", width: 70 },
  { field: "MAT_MASTER_WIDTH", headerName: "KHỔ CÂY", width: 65, cellStyle: { textAlign: "right" } },
  { field: "M_QTY", headerName: "SỐ LỚP", width: 60, cellStyle: { textAlign: "center" } },
];

const PrecisionCostBOMAndVisualizer: React.FC<Props> = ({
  listVL,
  selectedCode,
  onUpdateGiaNVL,
  onOpenPivot,
}) => {
  const agTableBOM = useMemo(() => {
    return (
      <AGTable
        showFilter={true}
        columns={columns_listbomvl}
        data={listVL}
      />
    );
  }, [listVL]);

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "minmax(0, 1.45fr) minmax(0, 1fr)",
        gap: 6,
        height: 270,
        minHeight: 270,
        maxHeight: 270,
        width: "100%",
        flexShrink: 0,
      }}
    >
      {/* ── CỘT BÊN TRÁI: BẢNG CHI TIẾT NGUYÊN VẬT LIỆU (BOM) ── */}
      <div
        style={{
          background: "#ffffff",
          border: "1px solid #cbd5e1",
          borderRadius: 4,
          boxShadow: "0 1px 2px rgba(0, 0, 0, 0.04)",
          display: "flex",
          flexDirection: "column",
          height: 270,
          overflow: "hidden",
        }}
      >
        {/* Header Bar xanh ngọc */}
        <div className="stitch-calc__header-bar">
          <div className="title">
            <FiLayers />
            <span>Bảng Chi Tiết Nguyên Vật Liệu Cấu Thành (BOM Materials)</span>
          </div>
          <div className="tools">
            <button onClick={onUpdateGiaNVL} title="Cập nhật đơn giá nguyên vật liệu">
              🔄 Update Giá Liệu
            </button>
            <button
              onClick={() => SaveExcel(listVL, "BOM_Nguyen_Vat_Lieu")}
              title="Xuất file Excel BOM (EX1)"
            >
              📥 EX1
            </button>
            <button
              onClick={() => SaveExcel(listVL, "BOM_Nguyen_Vat_Lieu_Full")}
              title="Xuất file Excel BOM đầy đủ (EX2)"
            >
              📥 EX2
            </button>
            {onOpenPivot && (
              <button onClick={onOpenPivot} title="Phân tích dữ liệu Pivot">
                📊 PIVOT
              </button>
            )}
          </div>
        </div>

        {/* Vùng AGTable: chiều cao = 270 - 28 (header) = 242px */}
        <div
          style={{
            height: 242,
            width: "100%",
            overflow: "hidden",
          }}
        >
          {agTableBOM}
        </div>
      </div>

      {/* ── CỘT BÊN PHẢI: MÔ PHỎNG LAYOUT DAO CẮT & BẢN VẼ KỸ THUẬT ── */}
      <div
        style={{
          background: "#ffffff",
          border: "1px solid #cbd5e1",
          borderRadius: 4,
          boxShadow: "0 1px 2px rgba(0, 0, 0, 0.04)",
          display: "flex",
          flexDirection: "column",
          height: 270,
          overflow: "hidden",
        }}
      >
        {/* Header Bar xanh ngọc đậm hơn */}
        <div className="stitch-calc__header-bar" style={{ background: "#047857" }}>
          <div className="title">
            <FiEye />
            <span>Mô Phỏng Layout Dao Cắt &amp; Bản Vẽ Kỹ Thuật</span>
          </div>
          <div className="tools">
            {selectedCode.G_CODE && (
              <a
                target="_blank"
                rel="noopener noreferrer"
                href={`/banve/${selectedCode.G_CODE}.pdf`}
                style={{
                  padding: "2px 8px",
                  background: "#1d4ed8",
                  color: "#ffffff",
                  borderRadius: 3,
                  fontSize: 10.5,
                  fontWeight: 700,
                  textDecoration: "none",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 4,
                }}
                title="Mở file PDF bản vẽ kỹ thuật trong tab mới"
              >
                <span>Xem Bản Vẽ PDF</span>
                <FiExternalLink size={11} />
              </a>
            )}
          </div>
        </div>

        {/* Vùng hiển thị trực quan bản vẽ mô phỏng - căn góc trên-trái */}
        <div
          style={{
            flex: "1 1 0px",
            minHeight: 0,
            background: "#747576",
            overflow: "auto",
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "flex-start",
            padding: 6,
          }}
        >
          {selectedCode.G_CODE ? (
            <CodeVisualLize DATA={selectedCode} />
          ) : (
            <div style={{ color: "#e2e8f0", fontSize: 11, fontStyle: "italic", textAlign: "center", width: "100%" }}>
              Chọn 1 mã sản phẩm để xem mô phỏng dao cắt
            </div>
          )}
        </div>

        {/* Footer thông số layout dao cắt */}
        <div
          className="stitch-calc__footer-bar"
          style={{
            background: "#f8fafc",
            fontSize: 10.5,
            padding: "3px 8px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          {selectedCode.G_CODE ? (
            <>
              <span>
                K/thước: <strong>{selectedCode.G_WIDTH}x{selectedCode.G_LENGTH}</strong> mm
              </span>
              <span>
                Bố trí: <strong>{selectedCode.G_C} cột x {selectedCode.G_C_R} hàng</strong>
              </span>
              <span>
                K/C: <strong>{selectedCode.G_CG}x{selectedCode.G_LG}</strong> mm
              </span>
            </>
          ) : (
            <span>Chưa chọn mã sản phẩm</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default memo(PrecisionCostBOMAndVisualizer);
