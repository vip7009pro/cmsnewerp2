import React from "react";
import { MainDeptData } from "../../interfaces/nhansuInterface";
import { AiOutlineSearch, AiOutlineReload } from "react-icons/ai";
import { RiFileExcel2Line } from "react-icons/ri";
import { MdOutlinePivotTableChart } from "react-icons/md";

interface PrecisionBaoCaoToolbarProps {
  maindeptcode: number;
  setmaindeptcode: (code: number) => void;
  nhamay: number;
  setNhaMay: (factory: number) => void;
  ca: number;
  setCa: (shift: number) => void;
  fromdate: string;
  setFromDate: (date: string) => void;
  todate: string;
  setToDate: (date: string) => void;
  maindepttable: Array<MainDeptData>;
  onSearch: () => void;
  onExportEX1?: () => void;
  onExportEX2?: () => void;
  onOpenPivot?: () => void;
  isLoading?: boolean;
}

export const PrecisionBaoCaoToolbar: React.FC<PrecisionBaoCaoToolbarProps> = ({
  maindeptcode,
  setmaindeptcode,
  nhamay,
  setNhaMay,
  ca,
  setCa,
  fromdate,
  setFromDate,
  todate,
  setToDate,
  maindepttable,
  onSearch,
  onExportEX1,
  onExportEX2,
  onOpenPivot,
  isLoading,
}) => {
  return (
    <section className="precision-baocao__toolbar">
      <div className="precision-baocao__filters">
        <div className="precision-baocao__filterItem">
          <label>Bộ phận:</label>
          <select
            value={maindeptcode}
            onChange={(e) => setmaindeptcode(Number(e.target.value))}
          >
            <option value={0}>Tất cả</option>
            {maindepttable.map((element, index) => (
              <option key={index} value={element.MAINDEPTCODE}>
                {element.MAINDEPTNAME}
              </option>
            ))}
          </select>
        </div>

        <div className="precision-baocao__filterItem">
          <label>Nhà máy:</label>
          <select
            value={nhamay}
            onChange={(e) => setNhaMay(Number(e.target.value))}
          >
            <option value={0}>Tất cả</option>
            <option value={1}>Nhà máy 1</option>
            <option value={2}>Nhà máy 2</option>
          </select>
        </div>

        <div className="precision-baocao__filterItem">
          <label>Ca làm việc:</label>
          <select value={ca} onChange={(e) => setCa(Number(e.target.value))}>
            <option value={6}>Tất cả</option>
            <option value={1}>Ca 1 (Team 1)</option>
            <option value={2}>Ca 2 (Team 2)</option>
            <option value={3}>Hành chính (HC)</option>
            <option value={4}>Ca 1 + Hành Chính</option>
            <option value={5}>Ca 2 + Hành Chính</option>
          </select>
        </div>

        <div className="precision-baocao__filterItem">
          <label>From:</label>
          <input
            type="date"
            value={fromdate.slice(0, 10)}
            onChange={(e) => setFromDate(e.target.value)}
          />
        </div>

        <div className="precision-baocao__filterItem">
          <label>To:</label>
          <input
            type="date"
            value={todate.slice(0, 10)}
            onChange={(e) => setToDate(e.target.value)}
          />
        </div>

        <button
          type="button"
          className="precision-baocao__btn precision-baocao__btn--search"
          onClick={onSearch}
          disabled={isLoading}
        >
          <AiOutlineSearch size={15} />
          <span>{isLoading ? "Đang tải..." : "Search"}</span>
        </button>
      </div>

      <div className="precision-baocao__toolbarActions">
        <button
          type="button"
          className="precision-baocao__btn precision-baocao__btn--load"
          onClick={onSearch}
          title="Tải lại toàn bộ dữ liệu mới nhất"
        >
          <AiOutlineReload size={14} />
          <span>Load Data</span>
        </button>

        {onExportEX1 && (
          <button
            type="button"
            className="precision-baocao__btn precision-baocao__btn--excel"
            onClick={onExportEX1}
            title="Xuất bảng chi tiết quẹt thẻ ra Excel (Đang lọc)"
          >
            <RiFileExcel2Line size={14} />
            <span>EX1</span>
            <span className="badge">Đang lọc</span>
          </button>
        )}

        {onExportEX2 && (
          <button
            type="button"
            className="precision-baocao__btn precision-baocao__btn--excel"
            onClick={onExportEX2}
            title="Xuất toàn bộ bảng chi tiết ra Excel"
          >
            <RiFileExcel2Line size={14} />
            <span>EX2</span>
            <span className="badge">Tất cả</span>
          </button>
        )}

        {onOpenPivot && (
          <button
            type="button"
            className="precision-baocao__btn precision-baocao__btn--pivot"
            onClick={onOpenPivot}
            title="Mở ma trận phân tích dữ liệu Pivot"
          >
            <MdOutlinePivotTableChart size={15} />
            <span>PIVOT</span>
          </button>
        )}
      </div>
    </section>
  );
};

export default PrecisionBaoCaoToolbar;
