import React from "react";
import { Button } from "@mui/material";
import { Search, Close } from "@mui/icons-material";
import { MACHINE_LIST } from "../../interfaces/khsxInterface";

interface PrecisionPlanStatusToolbarProps {
  fromdate: string;
  setFromDate: (val: string) => void;
  todate: string;
  setToDate: (val: string) => void;
  codeKD: string;
  setCodeKD: (val: string) => void;
  codeCMS: string;
  setCodeCMS: (val: string) => void;
  prodrequestno: string;
  setProdRequestNo: (val: string) => void;
  plan_id: string;
  setPlanID: (val: string) => void;
  factory: string;
  setFactory: (val: string) => void;
  machine: string;
  setMachine: (val: string) => void;
  alltime: boolean;
  setAllTime: (val: boolean) => void;
  machineList: MACHINE_LIST[];
  quickSearch: string;
  setQuickSearch: (val: string) => void;
  onSearch: () => void;
  loading: boolean;
}

export const PrecisionPlanStatusToolbar: React.FC<PrecisionPlanStatusToolbarProps> = React.memo(({
  fromdate,
  setFromDate,
  todate,
  setToDate,
  codeKD,
  setCodeKD,
  codeCMS,
  setCodeCMS,
  prodrequestno,
  setProdRequestNo,
  plan_id,
  setPlanID,
  factory,
  setFactory,
  machine,
  setMachine,
  alltime,
  setAllTime,
  machineList,
  quickSearch,
  setQuickSearch,
  onSearch,
  loading,
}) => {
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      onSearch();
    }
  };

  return (
    <div className="precision-plan-status-toolbar">
      {/* Hàng 1: Inputs tìm kiếm chính */}
      <div className="toolbar-input-grid">
        <div className="input-group date-group">
          <label className="input-label">Từ ngày</label>
          <input
            type="date"
            className="toolbar-input"
            value={fromdate.slice(0, 10)}
            onChange={(e) => setFromDate(e.target.value)}
          />
        </div>

        <div className="input-group date-group">
          <label className="input-label">Tới ngày</label>
          <input
            type="date"
            className="toolbar-input"
            value={todate.slice(0, 10)}
            onChange={(e) => setToDate(e.target.value)}
          />
        </div>

        <div className="input-group">
          <label className="input-label">Code KD</label>
          <input
            type="text"
            className="toolbar-input"
            placeholder="GH63-xxxxxx"
            value={codeKD}
            onChange={(e) => setCodeKD(e.target.value)}
            onKeyDown={handleKeyDown}
          />
        </div>

        <div className="input-group">
          <label className="input-label">Code ERP</label>
          <input
            type="text"
            className="toolbar-input"
            placeholder="7C123xxx"
            value={codeCMS}
            onChange={(e) => setCodeCMS(e.target.value)}
            onKeyDown={handleKeyDown}
          />
        </div>

        <div className="input-group">
          <label className="input-label">Số YCSX</label>
          <input
            type="text"
            className="toolbar-input"
            placeholder="1F80008"
            value={prodrequestno}
            onChange={(e) => setProdRequestNo(e.target.value)}
            onKeyDown={handleKeyDown}
          />
        </div>

        <div className="input-group">
          <label className="input-label">Số chỉ thị</label>
          <input
            type="text"
            className="toolbar-input"
            placeholder="A123456"
            value={plan_id}
            onChange={(e) => setPlanID(e.target.value)}
            onKeyDown={handleKeyDown}
          />
        </div>

        <div className="input-group select-group">
          <label className="input-label">Factory</label>
          <select
            className="toolbar-select"
            value={factory}
            onChange={(e) => setFactory(e.target.value)}
          >
            <option value="ALL">Tất cả</option>
            <option value="NM1">NM1</option>
            <option value="NM2">NM2</option>
          </select>
        </div>

        <div className="input-group select-group">
          <label className="input-label">Machine</label>
          <select
            className="toolbar-select"
            value={machine}
            onChange={(e) => setMachine(e.target.value)}
          >
            <option value="ALL">Tất cả máy</option>
            {machineList
              .slice()
              .sort((a, b) => a.EQ_NAME.localeCompare(b.EQ_NAME))
              .map((ele: MACHINE_LIST, index: number) => (
                <option key={index} value={ele.EQ_NAME}>
                  {ele.EQ_NAME}
                </option>
              ))}
          </select>
        </div>
      </div>

      {/* Hàng 2: Checkbox, Quick Search & Action buttons */}
      <div className="toolbar-action-row">
        <div className="action-left">
          <label className="custom-checkbox-label">
            <input
              type="checkbox"
              checked={alltime}
              onChange={(e) => setAllTime(e.target.checked)}
            />
            <span>All Time</span>
          </label>

          <div className="search-box">
            <Search className="search-icon" />
            <input
              type="text"
              placeholder="Lọc nhanh theo mã hàng, chỉ thị, máy..."
              value={quickSearch}
              onChange={(e) => setQuickSearch(e.target.value)}
            />
            {quickSearch && (
              <button
                className="clear-btn"
                onClick={() => setQuickSearch("")}
                title="Xóa tìm kiếm"
              >
                <Close style={{ fontSize: 13 }} />
              </button>
            )}
          </div>
        </div>

        <div className="action-buttons">
          <Button
            variant="contained"
            color="primary"
            size="small"
            startIcon={<Search />}
            disabled={loading}
            onClick={onSearch}
            className="btn-query"
          >
            TRA LỊCH SỬ
          </Button>
        </div>
      </div>
    </div>
  );
});
