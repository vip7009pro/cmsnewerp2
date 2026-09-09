import React, { useMemo, useState } from "react";
import AGTable from "../../../../components/DataTable/AGTable";
import { WORK_POSITION_DATA } from "../../interfaces/nhansuInterface";
import { getColumnsWorkPosition } from "./PrecisionDeptColumns";
import { MdAdd, MdEdit, MdDelete } from "react-icons/md";
import { BiSync } from "react-icons/bi";

interface PrecisionDeptPosTableProps {
  data: Array<WORK_POSITION_DATA>;
  selectedItem: WORK_POSITION_DATA;
  onSelectRow: (item: WORK_POSITION_DATA) => void;
  onReload: () => void;
  onOpenModal: (actionType: "add" | "edit" | "delete") => void;
  parentSubDeptName?: string;
}

export const PrecisionDeptPosTable: React.FC<PrecisionDeptPosTableProps> = ({
  data,
  selectedItem,
  onSelectRow,
  onReload,
  onOpenModal,
  parentSubDeptName,
}) => {
  const [filterText, setFilterText] = useState("");

  const filteredData = useMemo(() => {
    if (!filterText.trim()) return data;
    const kw = filterText.toLowerCase().trim();
    return data.filter(
      (item) =>
        String(item.WORK_POSITION_CODE).includes(kw) ||
        String(item.SUBDEPTCODE).includes(kw) ||
        item.WORK_POSITION_NAME?.toLowerCase().includes(kw) ||
        item.WORK_POSITION_NAME_KR?.toLowerCase().includes(kw) ||
        String(item.ATT_GROUP_CODE).includes(kw)
    );
  }, [data, filterText]);

  const columns = useMemo(() => getColumnsWorkPosition(), []);

  return (
    <div className="precision-deptmanager__panel">
      <div className="precision-deptmanager__panelHeader">
        <div className="precision-deptmanager__panelTitleRow">
          <div className="precision-deptmanager__panelTitle">
            <span className="dot dot--emerald" />
            <span>3. VỊ TRÍ CÔNG ĐOẠN & CA KÍP</span>
            <span className="badge badge--emerald">WORK POS</span>
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
              disabled={!selectedItem.WORK_POSITION_CODE}
              type="button"
            >
              <MdEdit size={13} />
              <span>Sửa</span>
            </button>
            <button
              className="precision-deptmanager__btnAction precision-deptmanager__btnAction--delete"
              onClick={() => onOpenModal("delete")}
              disabled={!selectedItem.WORK_POSITION_CODE}
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
            placeholder="Lọc vị trí, att..."
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
          Đang chọn: <b>{selectedItem.WORK_POSITION_NAME || "Chưa chọn"}</b> (Mã:{" "}
          {selectedItem.WORK_POSITION_CODE || "---"})
        </span>
        {parentSubDeptName && <span>Thuộc: {parentSubDeptName}</span>}
      </div>
    </div>
  );
};

export default PrecisionDeptPosTable;
