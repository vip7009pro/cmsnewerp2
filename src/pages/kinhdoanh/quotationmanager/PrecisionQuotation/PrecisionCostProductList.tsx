import React, { memo, useMemo } from "react";
import { FiEye, FiGrid, FiList, FiTrendingUp } from "react-icons/fi";
import AGTable from "../../../../components/DataTable/AGTable";
import { SaveExcel } from "../../../../api/services/excelService";
import { CODEDATA } from "../../interfaces/kdInterface";

interface Props {
  listcode: CODEDATA[];
  selectedCode: CODEDATA;
  onSelectProduct: (code: CODEDATA) => void;
  onToggleShowHide?: () => void;
  onOpenPivot?: () => void;
}

const columns_listcode = [
  { field: "CUST_NAME_KD", headerName: "KHÁCH", width: 65, pinned: "left" },
  {
    field: "G_CODE",
    headerName: "G_CODE",
    width: 75,
    pinned: "left",
    cellRenderer: (params: any) => (
      <span style={{ fontFamily: "'JetBrains Mono', monospace", fontWeight: 700, color: "#1d4ed8" }}>
        {params.value}
      </span>
    ),
  },
  { field: "G_NAME_KD", headerName: "G_NAME_KD", width: 95 },
  { field: "G_NAME", headerName: "G_NAME", width: 120 },
  {
    field: "G_WIDTH",
    headerName: "RỘNG",
    width: 45,
    cellStyle: { textAlign: "right", fontFamily: "'JetBrains Mono', monospace" },
  },
  {
    field: "G_LENGTH",
    headerName: "DÀI",
    width: 45,
    cellStyle: { textAlign: "right", fontFamily: "'JetBrains Mono', monospace" },
  },
  { field: "G_C", headerName: "CỘT", width: 38, cellStyle: { textAlign: "center" } },
  { field: "G_C_R", headerName: "HÀNG", width: 38, cellStyle: { textAlign: "center" } },
  { field: "G_LG", headerName: "K/C HÀNG", width: 55, cellStyle: { textAlign: "center" } },
  { field: "G_CG", headerName: "K/C CỘT", width: 55, cellStyle: { textAlign: "center" } },
  { field: "G_SG_L", headerName: "MÉP T", width: 45, cellStyle: { textAlign: "center" } },
  { field: "G_SG_R", headerName: "MÉP P", width: 45, cellStyle: { textAlign: "center" } },
  { field: "PROD_PRINT_TIMES", headerName: "SỐ MÀU", width: 50, cellStyle: { textAlign: "center" } },
];

const PrecisionCostProductList: React.FC<Props> = ({
  listcode,
  selectedCode,
  onSelectProduct,
  onOpenPivot,
}) => {
  const agTableComponent = useMemo(() => {
    return (
      <AGTable
        showFilter={true}
        columns={columns_listcode}
        data={listcode}
        onRowClick={(params: any) => {
          if (params?.data) {
            onSelectProduct(params.data);
          }
        }}
      />
    );
  }, [listcode, onSelectProduct]);

  return (
    <div className="stitch-calc__left-col">
      {/* Header Bar xanh ngọc chuẩn Stitch */}
      <div className="stitch-calc__header-bar">
        <div className="title">
          <FiList />
          <span>Danh Sách Sản Phẩm (Model Master)</span>
        </div>
        <div className="tools">
          <button
            onClick={() => SaveExcel(listcode, "Danh_Muc_SP_BaoGia")}
            title="Xuất file Excel danh mục sản phẩm (EX1)"
          >
            📊 EX1
          </button>
          <button
            onClick={() => SaveExcel(listcode, "Danh_Muc_SP_ChiTiet")}
            title="Xuất file Excel đầy đủ (EX2)"
          >
            📊 EX2
          </button>
          {onOpenPivot && (
            <button onClick={onOpenPivot} title="Phân tích dữ liệu đa chiều Pivot">
              Pivot
            </button>
          )}
        </div>
      </div>

      {/* AGTable Grid */}
      <div style={{ flex: 1, minHeight: 0, width: "100%" }}>
        {agTableComponent}
      </div>

      {/* Footer Bar */}
      <div className="stitch-calc__footer-bar">
        <span>
          Tổng: <strong>{listcode.length}</strong> mẫu sản phẩm
        </span>
        {selectedCode.G_CODE && (
          <span>
            Đang chọn: <strong className="active-code">{selectedCode.G_CODE}</strong>{" "}
            ({selectedCode.G_NAME_KD || selectedCode.G_NAME || ""})
          </span>
        )}
      </div>
    </div>
  );
};

export default memo(PrecisionCostProductList);
