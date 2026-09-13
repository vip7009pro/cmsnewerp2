import React, { useMemo } from "react";
import AGTable from "../../../../components/DataTable/AGTable";
import { MACHINE_LIST, PROD_PROCESS_DATA } from "../../../qlsx/QLSXPLAN/interfaces/khsxInterface";
import { FiPlus, FiTrash2, FiSave } from "react-icons/fi";
import { MdSettingsSuggest } from "react-icons/md";

interface PrecisionBOMProcessGridProps {
  currentProcessList: PROD_PROCESS_DATA[];
  machineList: MACHINE_LIST[];
  tempSelectedMachine: string;
  setTempSelectedMachine: (val: string) => void;
  tempSelectedProcess: React.MutableRefObject<any>;
  onAddProcess: () => void;
  onDeleteProcess: () => void;
  onSaveProcess: () => void;
  enableform: boolean;
}

const PrecisionBOMProcessGrid: React.FC<PrecisionBOMProcessGridProps> = ({
  currentProcessList,
  machineList,
  tempSelectedMachine,
  setTempSelectedMachine,
  tempSelectedProcess,
  onAddProcess,
  onDeleteProcess,
  onSaveProcess,
  enableform,
}) => {
  const columns = useMemo(
    () => [
      {
        field: "PROCESS_NUMBER",
        headerName: "CD",
        width: 75,
        editable: !enableform,
        cellClass: "font-mono font-bold text-center",
      },
      {
        field: "EQ_SERIES",
        headerName: "EQ (Máy)",
        width: 110,
        editable: !enableform,
        cellClass: "font-mono font-semibold text-primary",
      },
    ],
    [enableform]
  );

  return (
    <div className="spec-process-box">
      <div className="spec-process-header">
        <div className="spec-process-title">
          <MdSettingsSuggest size={14} className="text-primary" />
          <span>Công Đoạn & Máy (CD/EQ)</span>
          <span className="spec-process-badge">{currentProcessList.length} CD</span>
        </div>
        <div className="spec-process-actions">
          <select
            disabled={enableform}
            value={tempSelectedMachine}
            onChange={(e) => setTempSelectedMachine(e.target.value)}
            className="spec-process-select"
          >
            {machineList
              .filter((m) => m.EQ_NAME !== "NA" && m.EQ_NAME !== "NO" && m.EQ_NAME !== "ALL")
              .map((m, idx) => (
                <option key={idx} value={m.EQ_NAME}>
                  {m.EQ_NAME}
                </option>
              ))}
          </select>
          <button
            type="button"
            disabled={enableform}
            className="spec-process-btn spec-process-btn--add"
            onClick={onAddProcess}
            title="Thêm công đoạn máy mới"
          >
            <FiPlus size={12} />
            <span>Thêm</span>
          </button>
          <button
            type="button"
            disabled={enableform}
            className="spec-process-btn spec-process-btn--del"
            onClick={onDeleteProcess}
            title="Xóa công đoạn chọn"
          >
            <FiTrash2 size={12} />
            <span>Xóa</span>
          </button>
          <button
            type="button"
            disabled={enableform}
            className="spec-process-btn spec-process-btn--save"
            onClick={onSaveProcess}
            title="Lưu các công đoạn vào hệ thống"
          >
            <FiSave size={12} />
            <span>Lưu</span>
          </button>
        </div>
      </div>
      <div className="spec-process-table">
        <AGTable
          showFilter={false}
          columns={columns}
          data={currentProcessList}
          suppressRowClickSelection={true}
          onRowClick={(params: any) => {
            tempSelectedProcess.current = params.data;
          }}
        />
      </div>
    </div>
  );
};

export default React.memo(PrecisionBOMProcessGrid);
