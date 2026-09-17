import React from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

interface PrecisionEqStatusToolbarProps {
  factory: string;
  setFactory: (val: string) => void;
  machine: string;
  setMachine: (val: string) => void;
  eqSeries: string[];
  machineNumber: number;
  setMachineNumber: (val: number) => void;
  showTime: number;
  setShowTime: (val: number) => void;
  onlyRunning: boolean;
  setOnlyRunning: (val: boolean) => void;
  searchString: string;
  setSearchString: (val: string) => void;
  onPrevPage: () => void;
  onNextPage: () => void;
  currentPage: number;
  totalPages: number;
}

export const PrecisionEqStatusToolbar: React.FC<PrecisionEqStatusToolbarProps> = React.memo(({
  factory,
  setFactory,
  machine,
  setMachine,
  eqSeries,
  machineNumber,
  setMachineNumber,
  showTime,
  setShowTime,
  onlyRunning,
  setOnlyRunning,
  searchString,
  setSearchString,
  onPrevPage,
  onNextPage,
  currentPage,
  totalPages,
}) => {
  return (
    <div className="precision-eq-toolbar">
      {/* 1. Bộ điều khiển lọc bên trái */}
      <div className="toolbar-left">
        <div className="control-group">
          <label className="control-label">XƯỞNG:</label>
          <select
            className="control-select select-factory"
            value={factory}
            onChange={(e) => setFactory(e.target.value)}
          >
            <option value="NM1">NM1</option>
            <option value="NM2">NM2</option>
          </select>
        </div>

        <div className="control-group">
          <label className="control-label">LOẠI MÁY:</label>
          <select
            className="control-select select-machine"
            value={machine}
            onChange={(e) => setMachine(e.target.value)}
          >
            {eqSeries.map((ele: string, index: number) => (
              <option key={index} value={ele}>
                {ele}
              </option>
            ))}
          </select>
        </div>

        <div className="control-group">
          <label className="control-label">MÁY / TRANG:</label>
          <select
            className="control-select input-num"
            value={machineNumber}
            onChange={(e) => setMachineNumber(Number(e.target.value))}
          >
            <option value={6}>6 máy</option>
            <option value={8}>8 máy</option>
            <option value={12}>12 máy</option>
            <option value={16}>16 máy</option>
            <option value={20}>20 máy</option>
          </select>
        </div>

        <div className="control-group">
          <label className="control-label">THỜI GIAN (S):</label>
          <input
            type="number"
            min={3}
            max={120}
            className="control-input input-time"
            value={showTime}
            onChange={(e) => {
              const val = Math.max(3, Number(e.target.value) || 10);
              setShowTime(val);
              localStorage.setItem("showtimeout", val.toString());
            }}
          />
        </div>

        <label className="checkbox-toggle-label">
          <input
            type="checkbox"
            checked={onlyRunning}
            onChange={(e) => setOnlyRunning(e.target.checked)}
          />
          <span>Chỉ máy đang chạy</span>
        </label>

        <div className="control-group">
          <input
            type="text"
            className="control-input input-search"
            placeholder="Lọc mã hàng, chỉ thị..."
            value={searchString}
            onChange={(e) => setSearchString(e.target.value)}
          />
        </div>
      </div>

      {/* 2. Điều hướng trang thủ công */}
      <div className="toolbar-right">
        <button
          className="btn-tool"
          onClick={onPrevPage}
          disabled={currentPage <= 1}
          title="Trang trước"
        >
          <FaChevronLeft />
          <span>Trước</span>
        </button>
        <span style={{ fontSize: 11, fontWeight: 700 }}>
          {currentPage} / {totalPages || 1}
        </span>
        <button
          className="btn-tool"
          onClick={onNextPage}
          disabled={currentPage >= totalPages}
          title="Trang kế tiếp"
        >
          <span>Sau</span>
          <FaChevronRight />
        </button>
      </div>
    </div>
  );
});
