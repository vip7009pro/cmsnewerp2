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
  const [isMobile, setIsMobile] = useState<boolean>(() =>
    typeof window !== "undefined" ? window.innerWidth <= 768 : false
  );

  const [maindeptTable, setMainDeptTable] = useState<Array<MainDeptTableData>>([]);
  const [subdeptTable, setSubDeptTable] = useState<Array<SubDeptTableData>>([]);
  const [workpositionload, setWorkPositionLoad] = useState<Array<WORK_POSITION_DATA>>([]);

  const [selectedMainDept, setSelectedMainDept] = useState<MainDeptTableData>(initialMainDept);
  const [selectedSubDept, setSelectedSubDept] = useState<SubDeptTableData>(initialSubDept);
  const [selectedWorkPosition, setSelectedWorkPosition] = useState<WORK_POSITION_DATA>(initialWorkPos);

  const handleLoadMainDept = async () => {
    setLoading(true);
    const kq: MainDeptTableData[] = (await f_loadMainDepList()) || [];
    setMainDeptTable(kq);
    setLoading(false);

    if (kq.length === 0) {
      setSelectedMainDept(initialMainDept);
      setSubDeptTable([]);
      setSelectedSubDept(initialSubDept);
      setWorkPositionLoad([]);
      setSelectedWorkPosition(initialWorkPos);
      return;
    }

    // Giữ bộ phận đang chọn nếu vẫn tồn tại; nếu vừa thêm mới thì chọn đúng bản ghi mới,
    // nếu vừa xoá thì tự động rơi về bản ghi đầu tiên.
    const current =
      kq.find((item) => item.MAINDEPTCODE === selectedMainDept.MAINDEPTCODE) ??
      kq[0];
    setSelectedMainDept(current);
    await handleLoadsubDept(current.MAINDEPTCODE);
  };

  const handleLoadsubDept = async (MAINDEPTCODE?: number) => {
    const kq: SubDeptTableData[] = (await f_loadSubDepList(MAINDEPTCODE)) || [];
    setSubDeptTable(kq);

    if (kq.length === 0) {
      setSelectedSubDept(initialSubDept);
      setWorkPositionLoad([]);
      setSelectedWorkPosition(initialWorkPos);
      return;
    }

    const current =
      kq.find((item) => item.SUBDEPTCODE === selectedSubDept.SUBDEPTCODE) ??
      kq[0];
    setSelectedSubDept(current);
    await loadWorkPosition(current.SUBDEPTCODE);
  };

  const loadWorkPosition = async (SUBDEPTCODE?: number) => {
    const kq: WORK_POSITION_DATA[] = (await f_loadWorkPositionList(SUBDEPTCODE)) || [];
    setWorkPositionLoad(kq);

    if (kq.length === 0) {
      setSelectedWorkPosition(initialWorkPos);
      return;
    }

    const current =
      kq.find(
        (item) => item.WORK_POSITION_CODE === selectedWorkPosition.WORK_POSITION_CODE
      ) ?? kq[0];
    setSelectedWorkPosition(current);
  };

  /** Tải lại toàn bộ cây 3 cấp (dùng sau khi thêm / sửa / xoá) */
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

  /** Kiểm tra dữ liệu bắt buộc theo từng cấp trước khi gọi API */
  const validateForm = (): string => {
    if (tableSelection === 1) {
      if (!selectedMainDept.MAINDEPTCODE) return "Vui lòng nhập Mã bộ phận chính (MAINDEPTCODE).";
      if (!selectedMainDept.MAINDEPTNAME?.trim()) return "Vui lòng nhập Tên bộ phận chính.";
    } else if (tableSelection === 2) {
      if (!selectedSubDept.MAINDEPTCODE) return "Vui lòng chọn Bộ phận chính (MAINDEPTCODE).";
      if (!selectedSubDept.SUBDEPTCODE) return "Vui lòng nhập Mã phòng ban con (SUBDEPTCODE).";
      if (!selectedSubDept.SUBDEPTNAME?.trim()) return "Vui lòng nhập Tên phòng ban con.";
    } else if (tableSelection === 3) {
      if (!selectedWorkPosition.SUBDEPTCODE) return "Vui lòng chọn Phòng ban con (SUBDEPTCODE).";
      if (!selectedWorkPosition.WORK_POSITION_CODE) return "Vui lòng nhập Mã vị trí (WORK_POSITION_CODE).";
      if (!selectedWorkPosition.WORK_POSITION_NAME?.trim()) return "Vui lòng nhập Tên vị trí.";
    }
    return "";
  };

  const handleAddInfo = async () => {
    const doAdd = async () => {
      const invalid = validateForm();
      if (invalid) {
        Swal.fire("Thông báo", invalid, "warning");
        return;
      }

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
      const invalid = validateForm();
      if (invalid) {
        Swal.fire("Thông báo", invalid, "warning");
        return;
      }

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
    const targetName =
      tableSelection === 1
        ? selectedMainDept.MAINDEPTNAME
        : tableSelection === 2
        ? selectedSubDept.SUBDEPTNAME
        : selectedWorkPosition.WORK_POSITION_NAME;

    const confirmAndDelete = async () => {
      const confirm = await Swal.fire({
        title: "Xác nhận xoá",
        text: `Bạn có chắc chắn muốn xoá "${targetName || "bản ghi này"}"? Thao tác này không thể hoàn tác.`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Xoá",
        cancelButtonText: "Huỷ",
        confirmButtonColor: "#e11d48",
      });
      if (!confirm.isConfirmed) return;

      let kq = "";
      if (tableSelection === 1) kq = await f_deleteMainDept(selectedMainDept);
      else if (tableSelection === 2) kq = await f_deleteSubDept(selectedSubDept);
      else if (tableSelection === 3) kq = await f_deleteWorkPosition(selectedWorkPosition);

      if (kq === "") {
        Swal.fire("Thông báo", "Xoá thành công!", "success");
        setOpenDialog(false);
        init();
      } else {
        Swal.fire("Thông báo", "Lỗi: " + kq, "error");
      }
    };

    if (getCompany() !== "CMS") {
      checkBP(getUserData(), ["NHANSU"], ["ALL"], ["ALL"], confirmAndDelete);
    } else {
      confirmAndDelete();
    }
  };

  useEffect(() => {
    if (typeof window === "undefined") return;

    const mediaQuery = window.matchMedia("(max-width: 768px)");
    const handleChange = (event: MediaQueryListEvent) => setIsMobile(event.matches);

    setIsMobile(mediaQuery.matches);

    if (typeof mediaQuery.addEventListener === "function") {
      mediaQuery.addEventListener("change", handleChange);
      return () => mediaQuery.removeEventListener("change", handleChange);
    }

    mediaQuery.addListener(handleChange);
    return () => mediaQuery.removeListener(handleChange);
  }, []);

  useEffect(() => {
    init();
  }, []);

  return (
    <div className="precision-deptmanager">
      {!isMobile && (
        <PrecisionDeptHeader
          mainDeptCount={maindeptTable.length}
          subDeptCount={subdeptTable.length}
          workPosCount={workpositionload.length}
        />
      )}

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
