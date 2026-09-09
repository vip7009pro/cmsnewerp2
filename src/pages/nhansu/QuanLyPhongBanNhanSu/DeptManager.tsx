import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import "./DeptManager.scss";
import "./PrecisionDeptManager/PrecisionDeptManager.scss";
import { getCompany, getUserData } from "../../../api/Api";
import {
  MainDeptTableData,
  SubDeptTableData,
  WORK_POSITION_DATA,
} from "../interfaces/nhansuInterface";
import {
  f_addMainDept,
  f_addSubDept,
  f_addWorkPosition,
  f_deleteMainDept,
  f_deleteSubDept,
  f_deleteWorkPosition,
  f_loadMainDepList,
  f_loadSubDepList,
  f_loadWorkPositionList,
  f_updateMainDept,
  f_updateSubDept,
  f_updateWorkPosition,
} from "../utils/nhansuUtils";
import { checkBP } from "../../../api/services/permissionService";

// Precision Subcomponents
import PrecisionDeptHeader from "./PrecisionDeptManager/PrecisionDeptHeader";
import PrecisionDeptMainTable from "./PrecisionDeptManager/PrecisionDeptMainTable";
import PrecisionDeptSubTable from "./PrecisionDeptManager/PrecisionDeptSubTable";
import PrecisionDeptPosTable from "./PrecisionDeptManager/PrecisionDeptPosTable";
import PrecisionDeptModal from "./PrecisionDeptManager/PrecisionDeptModal";

const initialMainDept: MainDeptTableData = {
  id: 0,
  CTR_CD: "002",
  MAINDEPTCODE: 0,
  MAINDEPTNAME: "",
  MAINDEPTNAME_KR: "",
};

const initialSubDept: SubDeptTableData = {
  id: 0,
  CTR_CD: "002",
  MAINDEPTCODE: 0,
  SUBDEPTCODE: 0,
  SUBDEPTNAME: "",
  SUBDEPTNAME_KR: "",
};

const initialWorkPos: WORK_POSITION_DATA = {
  SUBDEPTCODE: 0,
  ATT_GROUP_CODE: 0,
  CTR_CD: "002",
  WORK_POSITION_CODE: 0,
  WORK_POSITION_NAME: "",
  WORK_POSITION_NAME_KR: "",
};

const DeptManager = () => {
  const [tableSelection, setTableSelection] = useState(1);
  const [openDialog, setOpenDialog] = useState(false);
  const [loading, setLoading] = useState(false);

  const [maindeptTable, setMainDeptTable] = useState<Array<MainDeptTableData>>([]);
  const [subdeptTable, setSubDeptTable] = useState<Array<SubDeptTableData>>([]);
  const [workpositionload, setWorkPositionLoad] = useState<Array<WORK_POSITION_DATA>>([]);

  const [selectedMainDept, setSelectedMainDept] = useState<MainDeptTableData>(initialMainDept);
  const [selectedSubDept, setSelectedSubDept] = useState<SubDeptTableData>(initialSubDept);
  const [selectedWorkPosition, setSelectedWorkPosition] = useState<WORK_POSITION_DATA>(initialWorkPos);

  const handleLoadMainDept = async () => {
    setLoading(true);
    let kq: MainDeptTableData[] = await f_loadMainDepList();
    setMainDeptTable(kq || []);
    setLoading(false);
    if (kq && kq.length > 0 && !selectedMainDept.MAINDEPTCODE) {
      setSelectedMainDept(kq[0]);
      handleLoadsubDept(kq[0].MAINDEPTCODE);
    }
  };

  const handleLoadsubDept = async (MAINDEPTCODE?: number) => {
    let kq: SubDeptTableData[] = await f_loadSubDepList(MAINDEPTCODE);
    setSubDeptTable(kq || []);
    if (kq && kq.length > 0) {
      setSelectedSubDept(kq[0]);
      loadWorkPosition(kq[0].SUBDEPTCODE);
    } else {
      setSelectedSubDept(initialSubDept);
      setWorkPositionLoad([]);
    }
  };

  const loadWorkPosition = async (SUBDEPTCODE?: number) => {
    let kq: any[] = await f_loadWorkPositionList(SUBDEPTCODE);
    setWorkPositionLoad(kq || []);
    if (kq && kq.length > 0) {
      setSelectedWorkPosition(kq[0]);
    } else {
      setSelectedWorkPosition(initialWorkPos);
    }
  };

  const init = () => {
    handleLoadMainDept();
  };

  const setMainDeptInfo = (keyname: string, value: any) => {
    setSelectedMainDept((prev) => ({ ...prev, [keyname]: value }));
  };

  const setSubDeptInfo = (keyname: string, value: any) => {
    setSelectedSubDept((prev) => ({ ...prev, [keyname]: value }));
  };

  const setWorkPositionInfo = (keyname: string, value: any) => {
    setSelectedWorkPosition((prev) => ({ ...prev, [keyname]: value }));
  };

  const handleClearForm = () => {
    if (tableSelection === 1) setSelectedMainDept(initialMainDept);
    else if (tableSelection === 2)
      setSelectedSubDept({ ...initialSubDept, MAINDEPTCODE: selectedMainDept.MAINDEPTCODE });
    else
      setSelectedWorkPosition({ ...initialWorkPos, SUBDEPTCODE: selectedSubDept.SUBDEPTCODE });
  };

  const handleOpenAction = (level: number, actionType: "add" | "edit" | "delete") => {
    setTableSelection(level);
    if (actionType === "add") {
      if (level === 1) setSelectedMainDept(initialMainDept);
      else if (level === 2)
        setSelectedSubDept({ ...initialSubDept, MAINDEPTCODE: selectedMainDept.MAINDEPTCODE });
      else
        setSelectedWorkPosition({ ...initialWorkPos, SUBDEPTCODE: selectedSubDept.SUBDEPTCODE });
    }
    setOpenDialog(true);
  };

  const handleAddInfo = async () => {
    const doAdd = async () => {
      let kq = "";
      if (tableSelection === 1) kq = await f_addMainDept(selectedMainDept);
      else if (tableSelection === 2) kq = await f_addSubDept(selectedSubDept);
      else if (tableSelection === 3) kq = await f_addWorkPosition(selectedWorkPosition);

      if (kq === "") {
        Swal.fire("Thông báo", "Thêm mới thành công!", "success");
        setOpenDialog(false);
        init();
      } else {
        Swal.fire("Thông báo", "Lỗi: " + kq, "error");
      }
    };

    if (getCompany() !== "CMS") {
      checkBP(getUserData(), ["NHANSU"], ["ALL"], ["ALL"], doAdd);
    } else {
      doAdd();
    }
  };

  const handleUpdateInfo = async () => {
    const doUpdate = async () => {
      let kq = "";
      if (tableSelection === 1) kq = await f_updateMainDept(selectedMainDept);
      else if (tableSelection === 2) kq = await f_updateSubDept(selectedSubDept);
      else if (tableSelection === 3) kq = await f_updateWorkPosition(selectedWorkPosition);

      if (kq === "") {
        Swal.fire("Thông báo", "Cập nhật thành công!", "success");
        setOpenDialog(false);
        init();
      } else {
        Swal.fire("Thông báo", "Lỗi: " + kq, "error");
      }
    };

    if (getCompany() !== "CMS") {
      checkBP(getUserData(), ["NHANSU"], ["ALL"], ["ALL"], doUpdate);
    } else {
      doUpdate();
    }
  };

  const handleDeleteInfo = async () => {
    const doDelete = async () => {
      let kq = "";
      if (tableSelection === 1) kq = await f_deleteMainDept(selectedMainDept);
      else if (tableSelection === 2) kq = await f_deleteSubDept(selectedSubDept);
      else if (tableSelection === 3) kq = await f_deleteWorkPosition(selectedWorkPosition);

      if (kq === "") {
        Swal.fire("Thông báo", "Xóa thành công!", "success");
        setOpenDialog(false);
        init();
      } else {
        Swal.fire("Thông báo", "Lỗi: " + kq, "error");
      }
    };

    if (getCompany() !== "CMS") {
      checkBP(getUserData(), ["NHANSU"], ["ALL"], ["ALL"], doDelete);
    } else {
      doDelete();
    }
  };

  useEffect(() => {
    init();
  }, []);

  return (
    <div className="precision-deptmanager">
      <PrecisionDeptHeader
        mainDeptCount={maindeptTable.length}
        subDeptCount={subdeptTable.length}
        workPosCount={workpositionload.length}
      />

      {/* Tri-Panel Grid (3 cấp liên hoàn) */}
      <div className="precision-deptmanager__triGrid">
        {/* PANEL 1: MAIN DEPT */}
        <PrecisionDeptMainTable
          data={maindeptTable}
          selectedItem={selectedMainDept}
          onSelectRow={(item) => {
            setSelectedMainDept(item);
            handleLoadsubDept(item.MAINDEPTCODE);
          }}
          onReload={handleLoadMainDept}
          onOpenModal={(action) => handleOpenAction(1, action)}
        />

        {/* PANEL 2: SUB DEPT */}
        <PrecisionDeptSubTable
          data={subdeptTable}
          selectedItem={selectedSubDept}
          onSelectRow={(item) => {
            setSelectedSubDept(item);
            loadWorkPosition(item.SUBDEPTCODE);
          }}
          onReload={() => handleLoadsubDept(selectedMainDept.MAINDEPTCODE)}
          onOpenModal={(action) => handleOpenAction(2, action)}
          parentDeptName={selectedMainDept.MAINDEPTNAME}
        />

        {/* PANEL 3: WORK POSITION */}
        <PrecisionDeptPosTable
          data={workpositionload}
          selectedItem={selectedWorkPosition}
          onSelectRow={(item) => setSelectedWorkPosition(item)}
          onReload={() => loadWorkPosition(selectedSubDept.SUBDEPTCODE)}
          onOpenModal={(action) => handleOpenAction(3, action)}
          parentSubDeptName={selectedSubDept.SUBDEPTNAME}
        />
      </div>

      {/* Dynamic Modal Add / Update / Delete */}
      <PrecisionDeptModal
        isOpen={openDialog}
        onClose={() => setOpenDialog(false)}
        tableSelection={tableSelection}
        selectedMainDept={selectedMainDept}
        setMainDeptInfo={setMainDeptInfo}
        selectedSubDept={selectedSubDept}
        setSubDeptInfo={setSubDeptInfo}
        selectedWorkPosition={selectedWorkPosition}
        setWorkPositionInfo={setWorkPositionInfo}
        mainDeptList={maindeptTable}
        subDeptList={subdeptTable}
        onAdd={handleAddInfo}
        onUpdate={handleUpdateInfo}
        onDelete={handleDeleteInfo}
        onClear={handleClearForm}
        isLoading={loading}
      />
    </div>
  );
};

export default DeptManager;
