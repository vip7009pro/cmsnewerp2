import React, { useMemo } from "react";
import {
  IoLocateOutline,
  IoSearchOutline,
  IoCloseOutline,
  IoAddCircleOutline,
  IoDownloadOutline,
  IoRefreshOutline,
  IoInformationCircleOutline,
} from "react-icons/io5";
import AGTable from "../../../../components/DataTable/AGTable";
import { DTC_TEST_POINT, TestListTable } from "../../interfaces/qcInterface";
import { getTestPointColumns } from "./PrecisionTestTableColumns";

interface PrecisionTestPointPanelProps {
  data: DTC_TEST_POINT[];
  totalCount: number;
  selectedItem: TestListTable | null;
  searchTerm: string;
  setSearchTerm: (val: string) => void;
  onOpenAddModal: () => void;
  onExport: () => void;
  onRefresh: () => void;
}

const PrecisionTestPointPanel: React.FC<PrecisionTestPointPanelProps> = ({
  data,
  totalCount,
  selectedItem,
  searchTerm,
  setSearchTerm,
  onOpenAddModal,
  onExport,
  onRefresh,
}) => {
  const columns = useMemo(() => getTestPointColumns(), []);

  return (
    <div className="precision-testtable__panel--right">
      {/* Panel Header */}
      <div className="precision-testtable__panelHeader">
        <div className="precision-testtable__panelTitleRow">
          <div className="precision-testtable__panelTitleGroup">
            <div className="precision-testtable__panelIcon precision-testtable__panelIcon--indigo">
              <IoLocateOutline />
            </div>
            <h3 className="precision-testtable__panelTitle">ĐIỂM ĐO TEST (DETAIL)</h3>
            <span className="precision-testtable__panelBadge">
              {data.length}/{totalCount}
            </span>
          </div>

          <button
            type="button"
            className="precision-testtable__btnAction precision-testtable__btnAction--primary-indigo"
            onClick={onOpenAddModal}
            disabled={!selectedItem}
            title={
              selectedItem
                ? `Thêm điểm đo mới cho hạng mục [${selectedItem.TEST_CODE}]`
                : "Vui lòng chọn một hạng mục test trước"
            }
          >
            <IoAddCircleOutline size={15} />
            <span>+ Thêm Điểm Đo</span>
          </button>
        </div>

        {/* Active Context Banner */}
        <div className="precision-testtable__contextBanner">
          <div className="precision-testtable__contextInfo">
            <span className="precision-testtable__contextLabel">Hạng mục liên kết:</span>
            {selectedItem ? (
              <span className="precision-testtable__contextPill">
                [{selectedItem.TEST_CODE}] {selectedItem.TEST_NAME}
              </span>
            ) : (
              <span style={{ color: "#94a3b8", fontStyle: "italic" }}>
                Chưa chọn hạng mục nào
              </span>
            )}
          </div>
          {selectedItem?.TEST_TIME && (
            <span style={{ color: "#64748b", fontSize: "0.7rem" }}>
              Thời gian test: <strong>{selectedItem.TEST_TIME}</strong>
            </span>
          )}
        </div>

        {/* SaaS Grid Toolbar */}
        <div className="precision-testtable__gridToolbar">
          <div className="precision-testtable__searchBox">
            <IoSearchOutline className="search-icon" />
            <input
              type="text"
              placeholder="Lọc mã hoặc tên điểm đo..."
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
              disabled={data.length === 0}
              title="Xuất danh sách điểm đo ra file Excel"
            >
              <IoDownloadOutline size={14} />
              <span>Excel</span>
            </button>
            <button
              type="button"
              className="precision-testtable__btnAction precision-testtable__btnAction--secondary"
              onClick={onRefresh}
              disabled={!selectedItem}
              title="Nạp lại danh sách điểm đo"
            >
              <IoRefreshOutline size={14} />
              <span>Tải lại</span>
            </button>
          </div>
        </div>
      </div>

      {/* AGTable Grid Container */}
      <div className="precision-testtable__tableContainer">
        {selectedItem ? (
          <AGTable
            data={data}
            columns={columns}
            onRowClick={() => {}}
            onSelectionChange={() => {}}
          />
        ) : (
          <div className="precision-testtable__emptyState">
            <IoInformationCircleOutline className="icon" />
            <div className="title">Chưa chọn Hạng Mục Test</div>
            <div className="desc">
              Vui lòng nhấp vào một dòng trong bảng Hạng Mục Test bên trái để hiển thị và quản lý danh sách các điểm đo.
            </div>
          </div>
        )}
      </div>

      {/* Status Bar */}
      <div className="precision-testtable__statusBar">
        <span>
          Tổng số điểm đo: <strong>{data.length}</strong>
        </span>
        <span>MSSQL • DTC_TEST_POINT_LIST</span>
      </div>
    </div>
  );
};

export default React.memo(PrecisionTestPointPanel);
