import React, { useMemo } from "react";
import AGTable from "../../../../components/DataTable/AGTable";
import { TEMLOTSX_DATA } from "../../../qlsx/QLSXPLAN/interfaces/khsxInterface";
import { getLichSuTemLotColumns } from "./PrecisionLichSuTemLotSxColumns";
import { FaSearch, FaPrint, FaFileExcel, FaBan, FaBarcode } from "react-icons/fa";

interface PrecisionLichSuTemLotSxGridProps {
  data: TEMLOTSX_DATA[];
  totalCount: number;
  searchKeyword: string;
  onSearchKeywordChange: (kw: string) => void;
  onSelectRow: (row: TEMLOTSX_DATA) => void;
  onOpenPreview: (row?: TEMLOTSX_DATA) => void;
  onCancelLot: () => void;
  onExportExcel: (type: "EX1" | "EX2") => void;
  selectedRow: TEMLOTSX_DATA | null;
}

export const PrecisionLichSuTemLotSxGrid: React.FC<PrecisionLichSuTemLotSxGridProps> = ({
  data,
  totalCount,
  searchKeyword,
  onSearchKeywordChange,
  onSelectRow,
  onOpenPreview,
  onCancelLot,
  onExportExcel,
  selectedRow,
}) => {
  const columns = useMemo(() => {
    return getLichSuTemLotColumns({
      onPreviewRow: (row) => onOpenPreview(row),
    });
  }, [onOpenPreview]);

  // Pinned Bottom Row Data (Tổng số lượng YCSX và TEMP_QTY)
  const pinnedBottomRowData = useMemo(() => {
    let totalYcsxQty = 0;
    let totalTempQty = 0;
    let totalTempMet = 0;

    data.forEach((row) => {
      totalYcsxQty += Number(row.PLAN_QTY) || 0;
      totalTempQty += Number(row.TEMP_QTY) || 0;
      totalTempMet += Number(row.TEMP_MET) || 0;
    });

    return [
      {
        INS_DATE: "TỔNG CỘNG",
        G_CODE: `${data.length} LOTS`,
        G_NAME: `Tổng SL: ${totalTempQty.toLocaleString("en-US")} EA`,
        PROD_REQUEST_QTY: totalYcsxQty,
        TEMP_QTY: totalTempQty,
        TEMP_MET: totalTempMet,
        PROCESS_LOT_NO: `${totalTempMet.toFixed(1)} m`,
      },
    ];
  }, [data]);

  return (
    <div className="precision-lichsutemlotsx__gridContainer">
      {/* Grid Toolbar */}
      <div className="precision-lichsutemlotsx__gridToolbar">
        <div className="precision-lichsutemlotsx__gridToolbarLeft">
          {/* Quick Search */}
          <div className="precision-lichsutemlotsx__searchBox">
            <FaSearch size={11} color="#94a3b8" />
            <input
              type="text"
              placeholder="Lọc nhanh (Lot, Mã hàng, YCSX, NVL...)"
              value={searchKeyword}
              onChange={(e) => onSearchKeywordChange(e.target.value)}
            />
          </div>

          {/* Action Buttons */}
          <div className="precision-lichsutemlotsx__gridActions">
            {/* Nút Xem & In Tem Lót */}
            <button
              type="button"
              className="precision-lichsutemlotsx__gridBtn precision-lichsutemlotsx__gridBtn--preview"
              onClick={() => onOpenPreview()}
              title="Xem trước và In Tem Lót của dòng đang chọn"
            >
              <FaPrint size={11} />
              <span>Xem Tem Lót</span>
              <span className="badge">Preview & Print</span>
            </button>

            {/* Nút Hủy LOT */}
            <button
              type="button"
              className="precision-lichsutemlotsx__gridBtn precision-lichsutemlotsx__gridBtn--cancel"
              onClick={onCancelLot}
              title="Hủy LOT sản xuất chưa chuyển công đoạn (Yêu cầu tài khoản NHU1903)"
            >
              <FaBan size={11} />
              <span>Hủy LOT</span>
              <span className="badge">Cancel</span>
            </button>

            {/* Nút Xuất Excel EX1 */}
            <button
              type="button"
              className="precision-lichsutemlotsx__gridBtn precision-lichsutemlotsx__gridBtn--excel"
              onClick={() => onExportExcel("EX1")}
              title="Xuất dữ liệu đang lọc ra file Excel"
            >
              <FaFileExcel size={11} />
              <span>EX1</span>
              <span className="badge">Đang lọc</span>
            </button>

            {/* Nút Xuất Excel EX2 */}
            <button
              type="button"
              className="precision-lichsutemlotsx__gridBtn precision-lichsutemlotsx__gridBtn--excel"
              onClick={() => onExportExcel("EX2")}
              title="Xuất toàn bộ dữ liệu ra file Excel"
            >
              <FaFileExcel size={11} />
              <span>EX2</span>
              <span className="badge">Tất cả</span>
            </button>
          </div>
        </div>

        {/* Grid Meta */}
        <div className="precision-lichsutemlotsx__gridMeta">
          <span>
            Đang hiển thị: <strong>{data.length.toLocaleString("en-US")}</strong> /{" "}
            {totalCount.toLocaleString("en-US")} dòng
          </span>
          {selectedRow?.PROCESS_LOT_NO && (
            <span style={{ marginLeft: "10px", color: "#6d28d9", fontWeight: 600 }}>
              • Đang chọn: {selectedRow.PROCESS_LOT_NO}
            </span>
          )}
        </div>
      </div>

      {/* Grid Table Body */}
      <div className="precision-lichsutemlotsx__gridBody">
        <AGTable
          suppressRowClickSelection={false}
          showFilter={true}
          columns={columns}
          data={data}
          pinnedBottomRowData={pinnedBottomRowData}
          onCellClick={(params: any) => {
            if (params?.data) {
              onSelectRow(params.data);
            }
          }}
          onRowDoubleClicked={(params: any) => {
            if (params?.data) {
              onOpenPreview(params.data);
            }
          }}
        />
      </div>
    </div>
  );
};

export default PrecisionLichSuTemLotSxGrid;
