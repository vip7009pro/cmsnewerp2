import React from "react";
import {
  MenuItem,
  Select,
  TextField,
  FormControl,
} from "@mui/material";
import {
  AiOutlineSearch,
  AiOutlineClose,
  AiOutlineCloudUpload,
  AiOutlineEdit,
  AiOutlineDownload,
  AiOutlineFilter,
} from "react-icons/ai";
import {
  DOC_CATEGORY1_DATA,
  DOC_CATEGORY2_DATA,
  DOC_LIST_DATA,
  AllDocFilterValues,
} from "./allDocTypes";

interface ToolbarProps {
  filterValues: AllDocFilterValues;
  setFilterValues: React.Dispatch<React.SetStateAction<AllDocFilterValues>>;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  isLoading: boolean;
  selectedCount: number;
  totalCount: number;
  docCategory1Data: DOC_CATEGORY1_DATA[];
  docCategory2Data: DOC_CATEGORY2_DATA[];
  docListData: DOC_LIST_DATA[];
  onSearch: () => void;
  onOpenUploadModal: () => void;
  onOpenUpdateModal: () => void;
  onExportExcel: () => void;
}

export const PrecisionAllDocToolbar: React.FC<ToolbarProps> = ({
  filterValues,
  setFilterValues,
  searchQuery,
  setSearchQuery,
  isLoading,
  selectedCount,
  totalCount,
  docCategory1Data,
  docCategory2Data,
  docListData,
  onSearch,
  onOpenUploadModal,
  onOpenUpdateModal,
  onExportExcel,
}) => {
  return (
    <div className="pad-toolbar">
      {/* Row 1: Cascading Filters */}
      <div className="toolbar-row-1">
        <div className="cascading-filters">
          {/* 1. Category 1 */}
          <FormControl size="small" className="filter-select">
            <Select
              value={filterValues.CAT_ID}
              displayEmpty
              onChange={(e) =>
                setFilterValues((prev) => ({
                  ...prev,
                  CAT_ID: Number(e.target.value),
                }))
              }
            >
              <MenuItem value={0}>Tất cả phân loại (Cat 1)</MenuItem>
              {docCategory1Data.map((item, idx) => (
                <MenuItem key={item.CAT_ID} value={item.CAT_ID}>
                  {idx + 1}. {item.CAT_NAME}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* 2. Document Type (Category 2) */}
          <FormControl size="small" className="filter-select">
            <Select
              value={filterValues.DOC_CAT_ID}
              displayEmpty
              onChange={(e) =>
                setFilterValues((prev) => ({
                  ...prev,
                  DOC_CAT_ID: Number(e.target.value),
                }))
              }
            >
              <MenuItem value={0}>Tất cả loại tài liệu (Cat 2)</MenuItem>
              {docCategory2Data.map((item, idx) => (
                <MenuItem key={item.DOC_CAT_ID} value={item.DOC_CAT_ID}>
                  {idx + 1}. {item.DOC_CAT_NAME}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* 3. Document Name list */}
          <FormControl size="small" className="filter-select" style={{ minWidth: 150 }}>
            <Select
              value={filterValues.DOC_ID}
              displayEmpty
              onChange={(e) =>
                setFilterValues((prev) => ({
                  ...prev,
                  DOC_ID: Number(e.target.value),
                }))
              }
            >
              <MenuItem value={0}>Tất cả tên tài liệu (Danh mục)</MenuItem>
              {docListData
                .filter((item) => {
                  if (filterValues.CAT_ID !== 0 && item.CAT_ID !== filterValues.CAT_ID) {
                    return false;
                  }
                  if (
                    filterValues.DOC_CAT_ID !== 0 &&
                    item.DOC_CAT_ID !== filterValues.DOC_CAT_ID
                  ) {
                    return false;
                  }
                  return true;
                })
                .map((item, idx) => (
                  <MenuItem key={item.DOC_ID} value={item.DOC_ID}>
                    {idx + 1}. {item.DOC_NAME}
                  </MenuItem>
                ))}
            </Select>
          </FormControl>

          {/* 4. Text Input Search */}
          <TextField
            size="small"
            placeholder="Tên tài liệu..."
            className="filter-input"
            value={filterValues.DOC_NAME}
            onChange={(e) =>
              setFilterValues((prev) => ({
                ...prev,
                DOC_NAME: e.target.value,
              }))
            }
            onKeyDown={(e) => {
              if (e.key === "Enter") onSearch();
            }}
          />
        </div>

        <button
          type="button"
          className="btn-search"
          onClick={onSearch}
          disabled={isLoading}
        >
          <AiOutlineFilter />
          <span>{isLoading ? "Đang tìm..." : "Tìm Kiếm"}</span>
        </button>
      </div>

      <div className="toolbar-divider" />

      {/* Row 2: Grid Actions & Quick Search */}
      <div className="toolbar-row-2">
        <div className="quick-search-box">
          <AiOutlineSearch className="search-icon" />
          <input
            type="text"
            placeholder="Lọc nhanh trên bảng (Tên, mã, phân loại...)"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button
              type="button"
              className="btn-clear-search"
              onClick={() => setSearchQuery("")}
            >
              <AiOutlineClose />
            </button>
          )}
        </div>

        <div className="action-buttons">
          <button
            type="button"
            className="btn-action upload"
            onClick={onOpenUploadModal}
            title="Tải lên tài liệu mới (yêu cầu quyền QC)"
          >
            <AiOutlineCloudUpload />
            <span>Upload Tài Liệu</span>
          </button>

          <button
            type="button"
            className="btn-action update"
            onClick={onOpenUpdateModal}
            disabled={selectedCount === 0}
            title="Cập nhật HSD / Hiệu lực cho các tài liệu đã chọn"
          >
            <AiOutlineEdit />
            <span>Cập Nhật ({selectedCount})</span>
          </button>

          <button
            type="button"
            className="btn-action export"
            onClick={onExportExcel}
            title="Xuất bảng tài liệu ra file Excel"
          >
            <AiOutlineDownload />
            <span>Xuất Excel</span>
          </button>

          <div className="selection-indicator">
            Hiển thị: <b>{totalCount}</b> | Đã tick: <b>{selectedCount}</b>
          </div>
        </div>
      </div>
    </div>
  );
};
