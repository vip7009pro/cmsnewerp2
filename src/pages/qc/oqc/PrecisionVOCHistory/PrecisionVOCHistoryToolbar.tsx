import React, { RefObject } from "react";
import { Checkbox, FormControlLabel, Button, Tooltip } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from "@mui/icons-material/Close";
import DocumentScannerIcon from "@mui/icons-material/DocumentScanner";
import RefreshIcon from "@mui/icons-material/Refresh";
import FullscreenIcon from "@mui/icons-material/Fullscreen";
import FullscreenExitIcon from "@mui/icons-material/FullscreenExit";
import FilterAltIcon from "@mui/icons-material/FilterAlt";

interface Props {
  searchInputRef: RefObject<HTMLInputElement>;
  searchInputValue: string;
  setSearchInputValue: (val: string) => void;
  appliedSearchValue: string;
  useMachineScan: boolean;
  setUseMachineScan: (val: boolean) => void;
  showAll: boolean;
  setShowAll: (val: boolean) => void;
  isTvMode: boolean;
  toggleFullscreen: () => void;
  isLoading: boolean;
  onCommitSearch: () => void;
  onClearSearch: () => void;
  visibleCount: number;
  totalCount: number;
  onReload: () => void;
  focusSearchInput: () => void;
}

export const PrecisionVOCHistoryToolbar: React.FC<Props> = ({
  searchInputRef,
  searchInputValue,
  setSearchInputValue,
  appliedSearchValue,
  useMachineScan,
  setUseMachineScan,
  showAll,
  setShowAll,
  isTvMode,
  toggleFullscreen,
  isLoading,
  onCommitSearch,
  onClearSearch,
  visibleCount,
  totalCount,
  onReload,
  focusSearchInput,
}) => {
  return (
    <div className="pvoc-toolbar">
      {/* Left: Laser Scanner Barcode Search Box */}
      <div className="pvoc-toolbar__left">
        <div
          className={`pvoc-toolbar__scanner-box ${
            useMachineScan ? "pvoc-toolbar__scanner-box--focused" : ""
          }`}
          onClick={focusSearchInput}
        >
          <DocumentScannerIcon className="pvoc-toolbar__scanner-box-icon" />
          <input
            ref={searchInputRef}
            type="text"
            placeholder={
              useMachineScan
                ? "Bắn mã vạch Lot SX (Tự động phân giải & lọc)..."
                : "Nhập mã hàng, tên hàng, mã số QTR..."
            }
            value={searchInputValue}
            onChange={(e) => setSearchInputValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                onCommitSearch();
              }
            }}
          />
          {searchInputValue && (
            <button
              type="button"
              className="pvoc-toolbar__scanner-box-clear"
              onClick={(e) => {
                e.stopPropagation();
                setSearchInputValue("");
                focusSearchInput();
              }}
              title="Xóa chuỗi"
            >
              <CloseIcon style={{ fontSize: 16 }} />
            </button>
          )}
        </div>

        <Button
          variant="contained"
          size="small"
          onClick={onCommitSearch}
          disabled={isLoading}
          startIcon={<SearchIcon />}
          style={{
            minWidth: 76,
            textTransform: "none",
            fontWeight: 700,
            fontSize: "0.78rem",
            backgroundColor: "#2563eb",
          }}
        >
          Tìm
        </Button>

        {appliedSearchValue && (
          <Button
            variant="outlined"
            size="small"
            color="secondary"
            onClick={onClearSearch}
            startIcon={<CloseIcon />}
            style={{
              textTransform: "none",
              fontWeight: 600,
              fontSize: "0.74rem",
            }}
          >
            Bỏ lọc
          </Button>
        )}
      </div>

      {/* Right: Checkboxes & Fullscreen TV Mode */}
      <div className="pvoc-toolbar__right">
        <div className="pvoc-toolbar__control-group">
          {/* Scanner toggle */}
          <FormControlLabel
            className="pvoc-toolbar__label-control"
            control={
              <Checkbox
                size="small"
                checked={useMachineScan}
                onChange={(e) => {
                  setUseMachineScan(e.target.checked);
                  focusSearchInput();
                }}
                style={{ color: "#06b6d4" }}
              />
            }
            label="Dùng máy scan"
          />

          {/* Show all toggle */}
          <FormControlLabel
            className="pvoc-toolbar__label-control"
            control={
              <Checkbox
                size="small"
                checked={showAll}
                onChange={(e) => {
                  setShowAll(e.target.checked);
                  focusSearchInput();
                }}
                style={{ color: "#3b82f6" }}
              />
            }
            label="Show All"
          />

          {/* Reload Button */}
          <Tooltip title="Tải lại dữ liệu">
            <Button
              variant="outlined"
              size="small"
              onClick={() => {
                onReload();
                focusSearchInput();
              }}
              disabled={isLoading}
              startIcon={<RefreshIcon className={isLoading ? "animate-spin" : ""} />}
              style={{
                textTransform: "none",
                fontWeight: 600,
                fontSize: "0.74rem",
                borderColor: "#cbd5e1",
                color: "#475569",
              }}
            >
              {isLoading ? "Đang tải..." : "Reload"}
            </Button>
          </Tooltip>

          {/* Native Fullscreen TV Mode (Equivalent to F11) */}
          <Tooltip title={isTvMode ? "Thoát toàn màn hình (F11)" : "Bật TV Mode toàn màn hình vô cực (F11)"}>
            <Button
              variant="contained"
              size="small"
              onClick={() => {
                toggleFullscreen();
                focusSearchInput();
              }}
              startIcon={isTvMode ? <FullscreenExitIcon /> : <FullscreenIcon />}
              style={{
                backgroundColor: isTvMode ? "#059669" : "#7c3aed",
                color: "#ffffff",
                textTransform: "none",
                fontWeight: 700,
                fontSize: "0.76rem",
              }}
            >
              {isTvMode ? "Thoát TV (F11)" : "TV Mode (F11)"}
            </Button>
          </Tooltip>
        </div>

        {/* Counter Badge */}
        <div className="flex items-center gap-1 text-xs font-semibold px-2 py-1 bg-slate-100 rounded border border-slate-200 text-slate-600">
          <FilterAltIcon style={{ fontSize: 13 }} />
          <span>
            {appliedSearchValue ? "Khớp: " : "Đang hiện: "}
            <strong className="text-blue-600 font-mono">{visibleCount}</strong>
            {" / "}
            <span className="font-mono text-slate-500">{totalCount}</span>
          </span>
        </div>
      </div>
    </div>
  );
};
