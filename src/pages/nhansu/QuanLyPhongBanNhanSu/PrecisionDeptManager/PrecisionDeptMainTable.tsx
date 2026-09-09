import React, { useMemo, useState } from "react";
import AGTable from "../../../../components/DataTable/AGTable";
import { MainDeptTableData } from "../../interfaces/nhansuInterface";
import { getColumnsMainDept } from "./PrecisionDeptColumns";
import { MdAdd, MdEdit, MdDelete } from "react-icons/md";
import { BiSync } from "react-icons/bi";

interface PrecisionDeptMainTableProps {
  data: Array<MainDeptTableData>;
  selectedItem: MainDeptTableData;
  onSelectRow: (item: MainDeptTableData) => void;
  onReload: () => void;
  onOpenModal: (actionType: "add" | "edit" | "delete") => void;
}

export const PrecisionDeptMainTable: React.FC<PrecisionDeptMainTableProps> = ({
  data,
  selectedItem,
  onSelectRow,
  onReload,
  onOpenModal,
}) => {
  const [filterText, setFilterText] = useState("");

  const filteredData = useMemo(() => {
    if (!filterText.trim()) return data;
    const kw = filterText.toLowerCase().trim();
    return data.filter(
      (item) =>
        String(item.MAINDEPTCODE).includes(kw) ||
        item.MAINDEPTNAME?.toLowerCase().includes(kw) ||
        item.MAINDEPTNAME_KR?.toLowerCase().includes(kw)
    );
  }, [data, filterText]);

  const columns = useMemo(() => getColumnsMainDept(), []);

  return (
    <div className="precision-deptmanager__panel">
      <div className="precision-deptmanager__panelHeader">
        <div className="precision-deptmanager__panelTitleRow">
          <div className="precision-deptmanager__panelTitle">
            <span className="dot dot--blue" />
            <span>1. BỘ PHẬN CHÍNH</span>
            <span className="badge badge--blue">MASTER</span>
          </div>
          <span className="precision-deptmanager__panelRowCount">
            {filteredData.length} / {data.length} rows
          </span>
        </div>

        <div className="precision-deptmanager__panelControls">
          <div className="precision-deptmanager__btnGroup">
            <button
              className="precision-deptmanager__btnAction precision-deptmanager__btnAction--add"
              onClick={() => onOpenModal("add")}
              type="button"
            >
              <MdAdd size={14} />
              <span>Thêm</span>
            </button>
            <button
              className="precision-deptmanager__btnAction precision-deptmanager__btnAction--edit"
              onClick={() => onOpenModal("edit")}
              disabled={!selectedItem.MAINDEPTCODE}
              type="button"
            >
              <MdEdit size={13} />
              <span>Sửa</span>
            </button>
            <button
              className="precision-deptmanager__btnAction precision-deptmanager__btnAction--delete"
              onClick={() => onOpenModal("delete")}
              disabled={!selectedItem.MAINDEPTCODE}
              type="button"
            >
              <MdDelete size={13} />
              <span>Xóa</span>
            </button>
            <button
              className="precision-deptmanager__btnAction precision-deptmanager__btnAction--sync"
              onClick={onReload}
              title="Tải lại danh sách"
              type="button"
            >
              <BiSync size={14} />
            </button>
          </div>

          <input
            className="precision-deptmanager__filterInput"
            type="text"
            value={filterText}
            onChange={(e) => setFilterText(e.target.value)}
            placeholder="Lọc mã, tên..."
          />
        </div>
      </div>

      <div className="precision-deptmanager__tableWrapper">
        <AGTable
          suppressRowClickSelection={false}
          rowHeight={30}
          headerHeight={30}
          columns={columns}
          data={filteredData}
          onRowClick={(params: any) => onSelectRow(params.data)}
          onSelectionChange={(params: any) => {
            const selectedRows = params?.api?.getSelectedRows();
            if (selectedRows && selectedRows.length > 0) {
              onSelectRow(selectedRows[0]);
            }
          }}
        />
      </div>

      <div className="precision-deptmanager__panelFooter">
        <span>
          Đang chọn: <b>{selectedItem.MAINDEPTNAME || "Chưa chọn"}</b> (Mã:{" "}
          {selectedItem.MAINDEPTCODE || "---"})
        </span>
      </div>
    </div>
  );
};

export default PrecisionDeptMainTable;
