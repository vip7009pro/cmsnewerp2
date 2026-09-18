import React, { useMemo } from "react";
import { FiSearch, FiDownload, FiPlusCircle, FiCheckSquare, FiTrash2, FiEye } from "react-icons/fi";
import AGTable from "../../../components/DataTable/AGTable";
import { POST_DATA } from "../interfaces/infoInterface";

interface GridProps {
  data: POST_DATA[];
  totalDataCount: number;
  searchKeyword: string;
  onSearchChange: (val: string) => void;
  onSelectionChange: (selectedRows: POST_DATA[]) => void;
  onOpenAddModal: () => void;
  onUpdatePosts: () => void;
  onDeletePosts: () => void;
  onViewPost: (post: POST_DATA) => void;
  onExportEX1: () => void;
  onExportEX2: () => void;
}

const PrecisionPostManagerGrid: React.FC<GridProps> = ({
  data,
  totalDataCount,
  searchKeyword,
  onSearchChange,
  onSelectionChange,
  onOpenAddModal,
  onUpdatePosts,
  onDeletePosts,
  onViewPost,
  onExportEX1,
  onExportEX2,
}) => {
  // Giữ nguyên 100% field, headerName và thiết lập editable của cột gốc
  const columns = useMemo(() => {
    return [
      {
        field: "POST_ID",
        headerName: "POST_ID",
        width: 85,
        headerCheckboxSelection: true,
        checkboxSelection: true,
        editable: false,
        cellRenderer: (params: any) => {
          return <span className="cell-post-id">{params.value}</span>;
        },
      },
      {
        field: "DEPT_CODE",
        headerName: "DEPT_CODE",
        width: 65,
        editable: false,
      },
      {
        field: "MAINDEPT",
        headerName: "MAINDEPT",
        width: 90,
        editable: false,
        cellRenderer: (params: any) => {
          return params.value ? <span className="cell-dept-badge">{params.value}</span> : null;
        },
      },
      {
        field: "SUBDEPT",
        headerName: "SUBDEPT",
        width: 100,
        editable: false,
        cellRenderer: (params: any) => {
          return params.value ? <span className="cell-dept-badge" style={{ color: "#0284c7" }}>{params.value}</span> : null;
        },
      },
      {
        field: "FILE_NAME",
        headerName: "FILE_NAME",
        width: 110,
        editable: false,
        cellRenderer: (params: any) => {
          const fileName = params.value;
          const hasMedia = fileName && fileName.trim().length > 0 && !fileName.endsWith("_undefined");
          if (!hasMedia) {
            return <div className="cell-thumb-preview"><span className="no-img">Không ảnh</span></div>;
          }
          const imgSrc = encodeURI(`/informationboard/${fileName}`);
          return (
            <div className="cell-thumb-preview" onClick={() => onViewPost(params.data)}>
              <img
                src={imgSrc}
                alt="Thumb"
                title="Nhấp để xem bài viết & ảnh lớn"
                onError={(e: any) => {
                  e.target.style.display = "none";
                }}
              />
              <span style={{ fontSize: "10.5px", color: "#64748b" }}>Xem ảnh</span>
            </div>
          );
        },
      },
      {
        field: "TITLE",
        headerName: "TITLE",
        flex: 2,
        minWidth: 220,
        editable: true,
        cellRenderer: (params: any) => {
          const isPinned = params.data?.IS_PINNED === "Y" || params.data?.IS_PINNED === "1";
          return (
            <div className="cell-title">
              {isPinned && <span className="pin-badge">GHIM</span>}
              <span
                style={{ cursor: "pointer" }}
                onClick={() => onViewPost(params.data)}
                title="Nhấp đúp để chỉnh sửa tiêu đề hoặc nhấp để xem bài viết"
              >
                {params.value}
              </span>
            </div>
          );
        },
      },
      {
        field: "CONTENT",
        headerName: "CONTENT",
        flex: 3,
        minWidth: 260,
        editable: true,
        cellRenderer: (params: any) => {
          return (
            <span
              style={{ color: "#475569", cursor: "pointer" }}
              title="Nhấp đúp để chỉnh sửa nội dung"
            >
              {params.value}
            </span>
          );
        },
      },
      {
        field: "IS_PINNED",
        headerName: "IS_PINNED",
        width: 75,
        editable: true,
        cellRenderer: (params: any) => {
          const isPinned = params.value === "Y" || params.value === "1";
          return isPinned ? (
            <span style={{ fontWeight: 800, color: "#d97706" }}>Y (Ghim)</span>
          ) : (
            <span style={{ color: "#94a3b8" }}>N</span>
          );
        },
      },
      { field: "INS_DATE", headerName: "INS_DATE", width: 95, editable: false },
      { field: "INS_EMPL", headerName: "INS_EMPL", width: 80, editable: false },
      { field: "UPD_DATE", headerName: "UPD_DATE", width: 95, editable: false },
      { field: "UPD_EMPL", headerName: "UPD_EMPL", width: 80, editable: false },
    ];
  }, [onViewPost]);

  return (
    <div className="precision-postmanager__gridContainer">
      {/* Grid Toolbar: Search Box & Actions */}
      <div className="precision-postmanager__gridToolbar">
        <div className="precision-postmanager__gridToolbarLeft">
          <div className="precision-postmanager__searchBox">
            <FiSearch size={12} color="#94a3b8" />
            <input
              type="text"
              placeholder="Lọc nhanh theo mã / tiêu đề / phòng ban / tác giả..."
              value={searchKeyword}
              onChange={(e) => onSearchChange(e.target.value)}
            />
          </div>

          <div className="precision-postmanager__gridActions">
            <button
              type="button"
              className="precision-postmanager__gridBtn precision-postmanager__gridBtn--excel"
              onClick={onExportEX1}
              title="Xuất dữ liệu đang lọc ra file Excel"
            >
              <FiDownload size={11} />
              <span>EX1</span>
              <span className="badge">Đang lọc</span>
            </button>

            <button
              type="button"
              className="precision-postmanager__gridBtn precision-postmanager__gridBtn--excel"
              onClick={onExportEX2}
              title="Xuất toàn bộ bài viết ra file Excel"
            >
              <FiDownload size={11} />
              <span>EX2</span>
              <span className="badge">Tất cả</span>
            </button>

            <button
              type="button"
              className="precision-postmanager__gridBtn precision-postmanager__gridBtn--add"
              onClick={onOpenAddModal}
              title="Mở giao diện Đăng tin mới"
            >
              <FiPlusCircle size={11} />
              <span>Đăng Tin</span>
            </button>

            <button
              type="button"
              className="precision-postmanager__gridBtn precision-postmanager__gridBtn--update"
              onClick={onUpdatePosts}
              title="Lưu các thay đổi đã sửa trực tiếp trên bảng"
            >
              <FiCheckSquare size={11} />
              <span>Lưu Cập Nhật</span>
            </button>

            <button
              type="button"
              className="precision-postmanager__gridBtn precision-postmanager__gridBtn--delete"
              onClick={onDeletePosts}
              title="Xóa các bài viết đã chọn"
            >
              <FiTrash2 size={11} />
              <span>Xóa</span>
            </button>
          </div>
        </div>

        <div style={{ fontSize: "11px", color: "#64748b" }}>
          Hiển thị: <strong>{data.length}</strong> / {totalDataCount} dòng
        </div>
      </div>

      {/* Grid Body: AGTable */}
      <div className="precision-postmanager__gridBody">
        <AGTable
          columns={columns}
          suppressRowClickSelection={false}
          data={data}
          onSelectionChange={(e: any) => {
            if (e?.api?.getSelectedRows) {
              onSelectionChange(e.api.getSelectedRows());
            }
          }}
        />
      </div>
    </div>
  );
};

export default React.memo(PrecisionPostManagerGrid);
