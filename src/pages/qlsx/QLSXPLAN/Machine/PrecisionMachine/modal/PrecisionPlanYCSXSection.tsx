import React, { useMemo, useState } from "react";
import { AiFillFolderAdd, AiOutlinePrinter } from "react-icons/ai";
import { FaArrowRight } from "react-icons/fa";
import { FcSearch } from "react-icons/fc";
import { MdOutlinePendingActions } from "react-icons/md";
import Swal from "sweetalert2";
import AGTable from "../../../../../../components/DataTable/AGTable";
import { YCSXTableData } from "../../../../../kinhdoanh/interfaces/kdInterface";
import { YCSXFilterState } from "../machineTypes";
import { getColumnYcsxTable } from "./PrecisionPlanColumns";

interface YCSXSectionProps {
  ycsxFilter: YCSXFilterState;
  setYCSXFilter: React.Dispatch<React.SetStateAction<YCSXFilterState>>;
  ycsxDataTable: YCSXTableData[];
  onSearchYCSX: () => void;
  onAddPlanFromYCSX: (row: YCSXTableData) => void;
  isAddPlanLoading: boolean;
  addPlanProgress: number;
  addPlanLoadingLabel: string;
  onSetPendingYCSX?: (rows: YCSXTableData[], pending_value: number) => void;
  onPrintYCSX?: (rows: YCSXTableData[]) => void;
  onPrintBanVe?: (rows: YCSXTableData[]) => void;
}

export const PrecisionPlanYCSXSection: React.FC<YCSXSectionProps> = React.memo(
  ({
    ycsxFilter,
    setYCSXFilter,
    ycsxDataTable,
    onSearchYCSX,
    onAddPlanFromYCSX,
    isAddPlanLoading,
    addPlanProgress,
    addPlanLoadingLabel,
    onSetPendingYCSX,
    onPrintYCSX,
    onPrintBanVe,
  }) => {
    const columns = useMemo(() => getColumnYcsxTable(), []);
    const [selectedYCSXRows, setSelectedYCSXRows] = useState<YCSXTableData[]>([]);

    const handleChange = (field: keyof YCSXFilterState, val: any) => {
      setYCSXFilter((prev) => ({ ...prev, [field]: val }));
    };

    return (
      <div className={`panel-box ycsx-section-box${isAddPlanLoading ? " is-add-plan-loading" : ""}`} style={{ height: "100%" }}>
        {isAddPlanLoading && (
          <div className="ycsx-add-plan-loading" role="status" aria-live="polite">
            <span className="ycsx-add-plan-spinner" />
            <div className="ycsx-add-plan-loading-copy">
              <strong>{addPlanProgress}%</strong>
              <span>{addPlanLoadingLabel}</span>
              <div className="ycsx-add-plan-progress-track">
                <div className="ycsx-add-plan-progress-value" style={{ width: `${addPlanProgress}%` }} />
              </div>
            </div>
          </div>
        )}
        {/* HEADER 1 DÒNG DUY NHẤT COMPACT */}
        <div className="panel-box__header flex items-center justify-between gap-1 py-1 px-2 border-b border-slate-200 bg-slate-50 text-[11px] font-bold whitespace-nowrap overflow-hidden">
          <div className="flex items-center gap-1.5 overflow-hidden text-ellipsis">
            <span className="text-slate-800 font-extrabold text-[11px] whitespace-nowrap">
              TRA CỨU & CHỌN YCSX VÀO MÁY
            </span>
            <span className="text-[10px] text-emerald-700 bg-emerald-50 border border-emerald-200 px-1 py-0.2 rounded font-mono shrink-0">
              {ycsxDataTable.length} đơn hàng
            </span>
          </div>
          <span className="text-[10px] text-blue-600 font-medium shrink-0">
            (Nhấp đúp dòng để nạp vào máy)
          </span>
        </div>

        <div className="panel-box__content flex flex-col gap-1 h-[calc(100%-28px)] p-1.5 overflow-hidden">
          {/* Form Tra Cứu YCSX 3 Cột Compact */}
          <div className="ycsx-form-3col">
            <div className="form-field">
              <label>Từ ngày:</label>
              <input
                type="date"
                value={ycsxFilter.fromdate}
                onChange={(e) => handleChange("fromdate", e.target.value)}
              />
            </div>

            <div className="form-field">
              <label>Đến ngày:</label>
              <input
                type="date"
                value={ycsxFilter.todate}
                onChange={(e) => handleChange("todate", e.target.value)}
              />
            </div>

            <div className="form-field">
              <label>Phân loại:</label>
              <select
                value={ycsxFilter.phanloai}
                onChange={(e) => handleChange("phanloai", e.target.value)}
              >
                <option value="00">ALL</option>
                <option value="01">Thông thường</option>
                <option value="02">SDI</option>
                <option value="03">GC</option>
                <option value="04">SAMPLE</option>
                <option value="22">NOT SAMPLE</option>
              </select>
            </div>

            <div className="form-field">
              <label>Code KD:</label>
              <input
                type="text"
                placeholder="GH63-..."
                value={ycsxFilter.codeKD}
                onChange={(e) => handleChange("codeKD", e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && onSearchYCSX()}
              />
            </div>

            <div className="form-field">
              <label>Code ERP:</label>
              <input
                type="text"
                placeholder="7C123..."
                value={ycsxFilter.codeCMS}
                onChange={(e) => handleChange("codeCMS", e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && onSearchYCSX()}
              />
            </div>

            <div className="form-field">
              <label>Số YCSX:</label>
              <input
                type="text"
                placeholder="12345"
                value={ycsxFilter.prodrequestno}
                onChange={(e) => handleChange("prodrequestno", e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && onSearchYCSX()}
              />
            </div>

            <div className="form-field">
              <label>Khách hàng:</label>
              <input
                type="text"
                placeholder="SEVT..."
                value={ycsxFilter.cust_name}
                onChange={(e) => handleChange("cust_name", e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && onSearchYCSX()}
              />
            </div>

            <div className="form-field">
              <label>Vật liệu:</label>
              <input
                type="text"
                placeholder="SJ-..."
                value={ycsxFilter.material}
                onChange={(e) => handleChange("material", e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && onSearchYCSX()}
              />
            </div>

            <div className="form-field form-field--action flex items-end">
              <button
                type="button"
                className="btn-search-compact w-full"
                onClick={onSearchYCSX}
                title="Bắt đầu tra cứu danh sách YCSX"
              >
                <FcSearch size={13} />
                <span>Tra Cứu</span>
              </button>
            </div>
          </div>

          {/* Dải Checkbox Compact */}
          <div className="ycsx-checkboxes-bar">
            <label className="chk-item">
              <input
                type="checkbox"
                checked={ycsxFilter.ycsxpendingcheck}
                onChange={(e) => handleChange("ycsxpendingcheck", e.target.checked)}
              />
              <span>Pending</span>
            </label>

            <label className="chk-item">
              <input
                type="checkbox"
                checked={ycsxFilter.materialYES}
                onChange={(e) => handleChange("materialYES", e.target.checked)}
              />
              <span>Material YES</span>
            </label>

            <label className="chk-item">
              <input
                type="checkbox"
                checked={ycsxFilter.alltime}
                onChange={(e) => handleChange("alltime", e.target.checked)}
              />
              <span>All Time</span>
            </label>

            <label className="chk-item">
              <input
                type="checkbox"
                checked={ycsxFilter.tempDM}
                onChange={(e) => handleChange("tempDM", e.target.checked)}
              />
              <span>ĐM Tạm</span>
            </label>
          </div>

          {/* Thanh Toolbar Bảng YCSX - Stitch High-Density (1 Dòng Duy Nhất) */}
          <div className="ycsx-table-toolbar">
            <div className="toolbar-btn-group">
              <button
                type="button"
                className="stb-ghost-emerald"
                onClick={() => onSetPendingYCSX?.(selectedYCSXRows, 0)}
                title="SET CLOSED YCSX đã chọn"
              >
                <FaArrowRight size={10} />
                <span>SET CLOSED</span>
              </button>

              <button
                type="button"
                className="stb-ghost-rose"
                onClick={() => onSetPendingYCSX?.(selectedYCSXRows, 1)}
                title="SET PENDING YCSX đã chọn"
              >
                <MdOutlinePendingActions size={11} />
                <span>SET PENDING</span>
              </button>

              <div className="stb-sep" />

              <button
                type="button"
                className="stb-ghost-blue"
                onClick={() => onPrintYCSX?.(selectedYCSXRows)}
                title="In phiếu YCSX đã chọn"
              >
                <AiOutlinePrinter size={11} />
                <span>Print YCSX</span>
              </button>

              <button
                type="button"
                className="stb-ghost-amber"
                onClick={() => onPrintBanVe?.(selectedYCSXRows)}
                title="In Bản Vẽ kỹ thuật YCSX đã chọn"
              >
                <AiOutlinePrinter size={11} />
                <span>Print Bản Vẽ</span>
              </button>

              <div className="stb-sep" />

              <button
                type="button"
                className="stb-success"
                disabled={isAddPlanLoading}
                onClick={() => {
                  if (selectedYCSXRows.length > 0) {
                    onAddPlanFromYCSX(selectedYCSXRows[0]);
                  } else {
                    Swal.fire("Thông báo", "Chọn ít nhất 1 YCSX để thêm PLAN", "warning");
                  }
                }}
                title="Thêm YCSX đã chọn vào máy"
              >
                <AiFillFolderAdd size={11} />
                <span>{isAddPlanLoading ? `${addPlanProgress}% Đang thêm...` : "Add to PLAN"}</span>
              </button>
            </div>
          </div>

          {/* Bảng Danh Sách YCSX */}
          <div className="ycsx-table-container flex-1 min-h-0 border border-t-0 border-slate-300 rounded-b overflow-hidden">
            <AGTable
              columns={columns}
              data={ycsxDataTable}
              onSelectionChange={(params: any) => {
                const rows = params?.api?.getSelectedRows?.() || [];
                setSelectedYCSXRows(rows);
              }}
              onCellClick={(params: any) => {
                if (params?.data) {
                  setSelectedYCSXRows([params.data]);
                }
              }}
              onRowDoubleClick={(params: any) => {
                if (params?.data) {
                  onAddPlanFromYCSX(params.data);
                }
              }}
            />
          </div>
        </div>
      </div>
    );
  }
);
