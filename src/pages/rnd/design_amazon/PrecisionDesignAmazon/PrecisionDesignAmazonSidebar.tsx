import React, { useMemo } from "react";
import { AiFillFileExcel } from "react-icons/ai";
import { MdOutlineSearch, MdClose } from "react-icons/md";
import { Tooltip, IconButton } from "@mui/material";
import { SaveExcel } from "../../../../api/services/excelService";
import AGTable from "../../../../components/DataTable/AGTable";
import { CODE_INFO } from "../../interfaces/rndInterface";

interface PrecisionDesignAmazonSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  codeCMS: string;
  setCodeCMS: (val: string) => void;
  onSearch: () => void;
  onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  rows: CODE_INFO[];
  onSelectCode: (selected: CODE_INFO[]) => void;
  isLoading: boolean;
}

export const PrecisionDesignAmazonSidebar: React.FC<PrecisionDesignAmazonSidebarProps> = ({
  isOpen,
  onClose,
  codeCMS,
  setCodeCMS,
  onSearch,
  onKeyDown,
  rows,
  onSelectCode,
  isLoading,
}) => {
  const codeInfoColumns = useMemo(
    () => [
      { field: "id", headerName: "ID", width: 50 },
      { field: "G_CODE", headerName: "G_CODE", width: 90, cellClass: "font-mono font-bold" },
      { field: "G_NAME", headerName: "G_NAME", width: 220, flex: 1 },
      { field: "G_NAME_KD", headerName: "G_NAME_KD", width: 140 },
    ],
    []
  );

  if (!isOpen) return null;

  return (
    <aside className="precision-amz-design__sidebar">
      <div className="precision-amz-design__sidebarHeader">
        <div className="precision-amz-design__sidebarTitle">
          <span>TRA CỨU MÃ HÀNG</span>
          <span className="precision-amz-design__badge">{rows.length} mã</span>
        </div>
        <Tooltip title="Đóng panel tra cứu">
          <IconButton size="small" onClick={onClose} className="precision-amz-design__iconBtn">
            <MdClose size={16} />
          </IconButton>
        </Tooltip>
      </div>

      <div className="precision-amz-design__sidebarSearch">
        <div className="precision-amz-design__searchBox">
          <MdOutlineSearch size={18} className="precision-amz-design__searchIcon" />
          <input
            type="text"
            placeholder="Nhập mã sản phẩm (Enter)..."
            value={codeCMS}
            onChange={(e) => setCodeCMS(e.target.value)}
            onKeyDown={onKeyDown}
          />
        </div>
        <button
          type="button"
          className="precision-amz-design__searchBtn"
          onClick={onSearch}
          disabled={isLoading}
        >
          {isLoading ? "Đang tải..." : "Tìm Mã"}
        </button>
      </div>

      <div className="precision-amz-design__sidebarGridContainer">
        <div className="precision-amz-design__sidebarGridActions">
          <button
            type="button"
            className="precision-amz-design__gridBtn precision-amz-design__gridBtn--excel"
            onClick={() => SaveExcel(rows, "Danh Sach Ma Amazon")}
            title="Xuất Excel danh sách mã hàng"
          >
            <AiFillFileExcel size={14} color="#059669" />
            <span>Xuất Excel</span>
          </button>
        </div>
        <div className="precision-amz-design__sidebarGridBody">
          <AGTable
            suppressRowClickSelection={false}
            showFilter={false}
            rowHeight={26}
            columns={codeInfoColumns}
            data={rows}
            onRowClick={(params: any) => {
              if (params?.data) onSelectCode([params.data]);
            }}
            onSelectionChange={(params: any) => {
              const sel = params?.api?.getSelectedRows?.() ?? [];
              if (sel.length > 0) onSelectCode(sel);
            }}
          />
        </div>
      </div>
    </aside>
  );
};
