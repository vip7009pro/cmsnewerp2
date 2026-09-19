import React, { useMemo, useRef, useState } from "react";
import {
  AiFillSave,
  AiOutlineArrowRight,
  AiOutlineBarcode,
  AiOutlineCheck,
} from "react-icons/ai";
import { BiRefresh, BiReset } from "react-icons/bi";
import { FaWarehouse } from "react-icons/fa";
import { FcDeleteRow } from "react-icons/fc";
import { GiCurvyKnife } from "react-icons/gi";
import Swal from "sweetalert2";
import AGTable from "../../../../../../components/DataTable/AGTable";
import { QLSXCHITHIDATA } from "../../../interfaces/khsxInterface";
import { getColumnPlanMaterialTable } from "./PrecisionPlanColumns";

interface MaterialSectionProps {
  chithidatatable: QLSXCHITHIDATA[];
  onSaveMaterial: () => void;
  onDangKyXuatLieu: () => void;
  onResetChiThi: () => void;
  onDeleteSelectedLine?: (rows: QLSXCHITHIDATA[]) => void;
  onSelectedRowsChange?: (rows: QLSXCHITHIDATA[]) => void;
  onXuatDaoSample: () => void;
  onXuatLieuSample: () => void;
  onOpenKhoAo?: () => void;
  onRefreshChiThi?: () => void;
}

export const PrecisionPlanMaterialSection: React.FC<MaterialSectionProps> = React.memo(
  ({
    chithidatatable,
    onSaveMaterial,
    onDangKyXuatLieu,
    onResetChiThi,
    onDeleteSelectedLine,
    onSelectedRowsChange,
    onXuatDaoSample,
    onXuatLieuSample,
    onOpenKhoAo,
    onRefreshChiThi,
  }) => {
    const columns = useMemo(() => getColumnPlanMaterialTable(), []);
    const gridMaterialRef = useRef<any>(null);
    const [selectedMaterialRows, setSelectedMaterialRows] = useState<QLSXCHITHIDATA[]>([]);
    const selectedMaterialRow = selectedMaterialRows[0] || null;

    // Tự động chọn tất cả dòng vật tư có tồn kho M_STOCK > 0
    const handleSelectMaterialStock = () => {
      const api = gridMaterialRef.current?.api;
      if (!api) return;
      let selectedCount = 0;
      api.forEachNode((node: any) => {
        if (node.data && Number(node.data.M_STOCK || 0) > 0) {
          node.setSelected(true);
          selectedCount++;
        } else {
          node.setSelected(false);
        }
      });
      if (selectedCount === 0) {
        Swal.fire("Thông báo", "Không có dòng nào có tồn kho (M_STOCK > 0)", "info");
      } else {
        Swal.fire("Thông báo", `Đã chọn ${selectedCount} dòng có tồn kho`, "success");
      }
    };

    const handleDelete = () => {
      if (!selectedMaterialRow) {
        Swal.fire("Chú ý", "Vui lòng nhấp chọn một dòng vật liệu trong bảng để xóa", "warning");
        return;
      }
      if (onDeleteSelectedLine) {
        onDeleteSelectedLine(selectedMaterialRows.length > 0 ? selectedMaterialRows : [selectedMaterialRow]);
      }
    };

    return (
      <div className="material-section-box">
        {/* THANH CÔNG CỤ NÚT HÀNH ĐỘNG VẬT LIỆU (STITCH HIGH-DENSITY - 1 DÒNG DUY NHẤT) */}
        <div className="material-actions-toolbar">
          <div className="toolbar-btn-group">
            {/* 1. Nút Select (Chọn dòng có tồn kho > 0) */}
            <button type="button" className="stb-ghost-emerald" onClick={handleSelectMaterialStock} title="Tự động chọn tất cả các dòng vật tư có tồn kho > 0">
              <AiOutlineCheck size={11} />
              <span>Select (Tồn &gt; 0)</span>
            </button>

            {/* 2. Lưu Vật Liệu */}
            <button type="button" className="stb-primary" onClick={onSaveMaterial} title="Lưu chỉ thị cấp phát vật liệu">
              <AiFillSave size={11} />
              <span>Lưu Vật Liệu</span>
            </button>

            {/* 3. Lưu CT + ĐKXK */}
            <button type="button" className="stb-success" onClick={onDangKyXuatLieu} title="Gửi yêu cầu đăng ký xuất liệu tới Kho SX">
              <AiOutlineBarcode size={11} />
              <span>Lưu CT + ĐKXK</span>
            </button>

            <div className="stb-sep" />

            {/* 4. Xóa Liệu */}
            {onDeleteSelectedLine && (
              <button type="button" className="stb-ghost-rose" onClick={handleDelete} title="Xóa dòng vật liệu đang chọn">
                <FcDeleteRow size={12} />
                <span>Xóa Liệu</span>
              </button>
            )}

            {/* 5. RESET Liệu */}
            <button type="button" className="stb-ghost-rose" onClick={onResetChiThi} title="Khôi phục/Reset lại danh sách vật liệu theo định mức gốc">
              <BiReset size={11} />
              <span>RESET Liệu</span>
            </button>

            {/* 6. Kho SX Main */}
            {onOpenKhoAo && (
              <button type="button" className="stb-ghost-blue" onClick={onOpenKhoAo} title="Mở cửa sổ Kho SX Main (Kho Ảo)">
                <FaWarehouse size={10} />
                <span>Kho SX Main</span>
              </button>
            )}

            {/* 7. Refresh chỉ thị */}
            {onRefreshChiThi && (
              <button type="button" className="stb-ghost-amber" onClick={onRefreshChiThi} title="Tải lại danh sách chỉ thị vật tư của kế hoạch">
                <BiRefresh size={12} />
                <span>Refresh CT</span>
              </button>
            )}

            <div className="stb-sep" />

            {/* 8. Xuất dao sample */}
            <button type="button" className="stb-ghost-rose" onClick={onXuatDaoSample} title="Đăng ký xuất dao cho hàng mẫu">
              <GiCurvyKnife size={11} />
              <span>Xuất dao sample</span>
            </button>

            {/* 9. Xuất liệu sample */}
            <button type="button" className="stb-ghost-blue" onClick={onXuatLieuSample} title="Đăng ký xuất nguyên vật liệu cho hàng mẫu">
              <AiOutlineArrowRight size={11} />
              <span>Xuất liệu sample</span>
            </button>
          </div>

          <div className="toolbar-info-group">
            {selectedMaterialRow && (
              <span className="stb-badge stb-badge--blue" title={selectedMaterialRow.M_NAME || selectedMaterialRow.M_CODE}>
                Chọn: {selectedMaterialRow.M_NAME || selectedMaterialRow.M_CODE}
              </span>
            )}
            <span className="stb-badge stb-badge--slate">
              Tổng: <strong>{chithidatatable.length}</strong>
            </span>
          </div>
        </div>

        {/* BẢNG AGTABLE CHỈ THỊ VẬT LIỆU */}
        <div className="material-table-container">
          <AGTable
            ref={gridMaterialRef}
            columns={columns}
            data={chithidatatable}
            onCellClick={(params: any) => {
              if (params?.data) {
                const rows = [params.data];
                setSelectedMaterialRows(rows);
                onSelectedRowsChange?.(rows);
              }
            }}
            onSelectionChange={(params: any) => {
              const rows = params?.api?.getSelectedRows?.();
              if (rows && rows.length > 0) {
                setSelectedMaterialRows(rows);
                onSelectedRowsChange?.(rows);
              }
            }}
          />
        </div>
      </div>
    );
  }
);
