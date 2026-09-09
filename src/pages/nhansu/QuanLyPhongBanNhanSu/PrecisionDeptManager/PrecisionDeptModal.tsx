import React from "react";
import CustomDialog from "../../../../components/Dialog/CustomDialog";
import {
  MainDeptTableData,
  SubDeptTableData,
  WORK_POSITION_DATA,
} from "../../interfaces/nhansuInterface";
import { Button } from "@mui/material";

interface PrecisionDeptModalProps {
  isOpen: boolean;
  onClose: () => void;
  tableSelection: number; // 1: MainDept, 2: SubDept, 3: WorkPosition
  selectedMainDept: MainDeptTableData;
  setMainDeptInfo: (keyname: string, value: any) => void;
  selectedSubDept: SubDeptTableData;
  setSubDeptInfo: (keyname: string, value: any) => void;
  selectedWorkPosition: WORK_POSITION_DATA;
  setWorkPositionInfo: (keyname: string, value: any) => void;
  onAdd: () => void;
  onUpdate: () => void;
  onDelete: () => void;
  onClear: () => void;
  isLoading?: boolean;
}

export const PrecisionDeptModal: React.FC<PrecisionDeptModalProps> = ({
  isOpen,
  onClose,
  tableSelection,
  selectedMainDept,
  setMainDeptInfo,
  selectedSubDept,
  setSubDeptInfo,
  selectedWorkPosition,
  setWorkPositionInfo,
  onAdd,
  onUpdate,
  onDelete,
  onClear,
  isLoading,
}) => {
  const getModalTitle = () => {
    if (tableSelection === 1) {
      return `Thao Tác Bộ Phận Chính (${selectedMainDept.MAINDEPTNAME || "Mới"})`;
    } else if (tableSelection === 2) {
      return `Thao Tác Phòng Ban Trực Thuộc (${selectedSubDept.SUBDEPTNAME || "Mới"})`;
    }
    return `Thao Tác Vị Trí Công Đoạn (${selectedWorkPosition.WORK_POSITION_NAME || "Mới"})`;
  };

  return (
    <CustomDialog
      isOpen={isOpen}
      onClose={onClose}
      title={getModalTitle()}
      content={
        <div className="precision-deptmanager__modalForm">
          {/* LEVEL 1: MAIN DEPT FORM */}
          {tableSelection === 1 && (
            <>
              <div className="precision-deptmanager__formGroup">
                <label>Mã Bộ Phận (MAINDEPTCODE):</label>
                <input
                  type="number"
                  value={selectedMainDept.MAINDEPTCODE || ""}
                  onChange={(e) =>
                    setMainDeptInfo("MAINDEPTCODE", Number(e.target.value))
                  }
                />
              </div>
              <div className="precision-deptmanager__formGroup">
                <label>Tên Bộ Phận (MAINDEPTNAME):</label>
                <input
                  type="text"
                  value={selectedMainDept.MAINDEPTNAME || ""}
                  onChange={(e) =>
                    setMainDeptInfo("MAINDEPTNAME", e.target.value)
                  }
                />
              </div>
              <div className="precision-deptmanager__formGroup">
                <label>Tên Tiếng Hàn (MAINDEPTNAME_KR):</label>
                <input
                  type="text"
                  value={selectedMainDept.MAINDEPTNAME_KR || ""}
                  onChange={(e) =>
                    setMainDeptInfo("MAINDEPTNAME_KR", e.target.value)
                  }
                />
              </div>
            </>
          )}

          {/* LEVEL 2: SUB DEPT FORM */}
          {tableSelection === 2 && (
            <>
              <div className="precision-deptmanager__formGroup">
                <label>Mã Bộ Phận Cha (MAINDEPTCODE):</label>
                <input
                  type="number"
                  value={selectedSubDept.MAINDEPTCODE || ""}
                  onChange={(e) =>
                    setSubDeptInfo("MAINDEPTCODE", Number(e.target.value))
                  }
                />
              </div>
              <div className="precision-deptmanager__formGroup">
                <label>Mã Phòng Ban Con (SUBDEPTCODE):</label>
                <input
                  type="number"
                  value={selectedSubDept.SUBDEPTCODE || ""}
                  onChange={(e) =>
                    setSubDeptInfo("SUBDEPTCODE", Number(e.target.value))
                  }
                />
              </div>
              <div className="precision-deptmanager__formGroup">
                <label>Tên Phòng Ban (SUBDEPTNAME):</label>
                <input
                  type="text"
                  value={selectedSubDept.SUBDEPTNAME || ""}
                  onChange={(e) =>
                    setSubDeptInfo("SUBDEPTNAME", e.target.value)
                  }
                />
              </div>
              <div className="precision-deptmanager__formGroup">
                <label>Tên Tiếng Hàn (SUBDEPTNAME_KR):</label>
                <input
                  type="text"
                  value={selectedSubDept.SUBDEPTNAME_KR || ""}
                  onChange={(e) =>
                    setSubDeptInfo("SUBDEPTNAME_KR", e.target.value)
                  }
                />
              </div>
            </>
          )}

          {/* LEVEL 3: WORK POSITION FORM */}
          {tableSelection === 3 && (
            <>
              <div className="precision-deptmanager__formGroup">
                <label>Mã Phòng Ban Cha (SUBDEPTCODE):</label>
                <input
                  type="number"
                  value={selectedWorkPosition.SUBDEPTCODE || ""}
                  onChange={(e) =>
                    setWorkPositionInfo("SUBDEPTCODE", Number(e.target.value))
                  }
                />
              </div>
              <div className="precision-deptmanager__formGroup">
                <label>Mã Vị Trí (WORK_POSITION_CODE):</label>
                <input
                  type="number"
                  value={selectedWorkPosition.WORK_POSITION_CODE || ""}
                  onChange={(e) =>
                    setWorkPositionInfo("WORK_POSITION_CODE", Number(e.target.value))
                  }
                />
              </div>
              <div className="precision-deptmanager__formGroup">
                <label>Nhóm Chấm Công (ATT_GROUP_CODE):</label>
                <input
                  type="number"
                  value={selectedWorkPosition.ATT_GROUP_CODE || ""}
                  onChange={(e) =>
                    setWorkPositionInfo("ATT_GROUP_CODE", Number(e.target.value))
                  }
                />
              </div>
              <div className="precision-deptmanager__formGroup">
                <label>Tên Vị Trí (WORK_POSITION_NAME):</label>
                <input
                  type="text"
                  value={selectedWorkPosition.WORK_POSITION_NAME || ""}
                  onChange={(e) =>
                    setWorkPositionInfo("WORK_POSITION_NAME", e.target.value)
                  }
                />
              </div>
              <div className="precision-deptmanager__formGroup">
                <label>Tên Tiếng Hàn (WORK_POSITION_NAME_KR):</label>
                <input
                  type="text"
                  value={selectedWorkPosition.WORK_POSITION_NAME_KR || ""}
                  onChange={(e) =>
                    setWorkPositionInfo("WORK_POSITION_NAME_KR", e.target.value)
                  }
                />
              </div>
            </>
          )}
        </div>
      }
      actions={
        <div className="precision-deptmanager__modalActions">
          <Button
            variant="outlined"
            size="small"
            sx={{ fontSize: "11px", borderColor: "#cbd5e1", color: "#475569" }}
            onClick={onClear}
          >
            Clear Form
          </Button>

          <Button
            variant="contained"
            size="small"
            sx={{ fontSize: "11px", backgroundColor: "#10b981" }}
            onClick={onAdd}
            disabled={isLoading}
          >
            + Thêm Mới
          </Button>

          <Button
            variant="contained"
            size="small"
            sx={{ fontSize: "11px", backgroundColor: "#2563eb" }}
            onClick={onUpdate}
            disabled={isLoading}
          >
            Cập Nhật
          </Button>

          <Button
            variant="contained"
            size="small"
            sx={{ fontSize: "11px", backgroundColor: "#ef4444" }}
            onClick={onDelete}
            disabled={isLoading}
          >
            Xóa
          </Button>
        </div>
      }
    />
  );
};

export default PrecisionDeptModal;
