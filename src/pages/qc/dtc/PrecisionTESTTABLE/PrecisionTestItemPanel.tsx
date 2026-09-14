import React, { useMemo } from "react";
import {
  IoFlaskOutline,
  IoSearchOutline,
  IoCloseOutline,
  IoAddCircleOutline,
  IoDownloadOutline,
  IoRefreshOutline,
} from "react-icons/io5";
import AGTable from "../../../../components/DataTable/AGTable";
import { TestListTable } from "../../interfaces/qcInterface";
import { getTestItemColumns } from "./PrecisionTestTableColumns";

interface PrecisionTestItemPanelProps {
  data: TestListTable[];
  totalCount: number;
  selectedItem: TestListTable | null;
  searchTerm: string;
  setSearchTerm: (val: string) => void;
  onSelectItem: (item: TestListTable) => void;
  onOpenAddModal: () => void;
  onExport: () => void;
  onRefresh: () => void;
}

const PrecisionTestItemPanel: React.FC<PrecisionTestItemPanelProps> = ({
  data,
  totalCount,
  selectedItem,
  searchTerm,
  setSearchTerm,
  onSelectItem,
  onOpenAddModal,
  onExport,
  onRefresh,
}) => {
  const columns = useMemo(() => getTestItemColumns(), []);

  const handleRowClick = (params: any) => {
    if (params.data) {
      onSelectItem(params.data);
    }
  };

  return (
    <div className="precision-testtable__panel--left">
      {/* Panel Header */}
      <div className="precision-testtable__panelHeader">
        <div className="precision-testtable__panelTitleRow">
          <div className="precision-testtable__panelTitleGroup">
            <div className="precision-testtable__panelIcon">
              <IoFlaskOutline />
            </div>
            <h3 className="precision-testtable__panelTitle">HẠNG MỤC TEST (MASTER)</h3>
            <span className="precision-testtable__panelBadge">
              {data.length}/{totalCount}
            </span>
          </div>

          <button
            type="button"
            className="precision-testtable__btnAction precision-testtable__btnAction--primary-emerald"
            onClick={onOpenAddModal}
            title="Thêm mới một hạng mục kiểm tra ĐTC"
          >
            <IoAddCircleOutline size={15} />
            <span>+ Thêm Hạng Mục</span>
          </button>
        </div>

        {/* SaaS Grid Toolbar */}
        <div className="precision-testtable__gridToolbar">
          <div className="precision-testtable__searchBox">
            <IoSearchOutline className="search-icon" />
            <input
              type="text"
              placeholder="Lọc mã hoặc tên hạng mục..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {searchTerm && (
              <button
                type="button"
                className="clear-search"
                onClick={() => setSearchTerm("")}
                title="Xóa bộ lọc"
              >
                <IoCloseOutline size={14} />
              </button>
            )}
          </div>

          <div className="precision-testtable__gridActions">
            <button
              type="button"
              className="precision-testtable__btnAction precision-testtable__btnAction--secondary"
              onClick={onExport}
              title="Xuất danh sách hạng mục ra file Excel"
            >
              <IoDownloadOutline size={14} />
              <span>Excel</span>
            </button>
            <button
              type="button"
              className="precision-testtable__btnAction precision-testtable__btnAction--secondary"
              onClick={onRefresh}
              title="Nạp lại danh sách hạng mục"
            >
              <IoRefreshOutline size={14} />
              <span>Tải lại</span>
            </button>
          </div>
        </div>
      </div>

      {/* AGTable Grid Container */}
      <div className="precision-testtable__tableContainer">
        <AGTable
          data={data}
          columns={columns}
          onRowClick={handleRowClick}
          onSelectionChange={() => {}}
        />
      </div>

      {/* Status Bar */}
      <div className="precision-testtable__statusBar">
        <span>
          Đang chọn: <strong>{selectedItem ? `[${selectedItem.TEST_CODE}] ${selectedItem.TEST_NAME}` : "Chưa chọn"}</strong>
        </span>
        <span>MSSQL • DTC_TEST_LIST</span>
      </div>
    </div>
  );
};

export default React.memo(PrecisionTestItemPanel);
