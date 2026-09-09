import { useEffect, useMemo, useState } from "react";
import Swal from "sweetalert2";
import "./UserManager.scss";
import "./PrecisionUserManager/PrecisionUserManager.scss";
import { generalQuery, getCompany, getUserData, uploadQuery } from "../../../api/Api";
import { EmployeeTableData } from "../interfaces/nhansuInterface";
import AGTable from "../../../components/DataTable/AGTable";
import {
  f_addEmployee,
  f_getEmployeeList,
  f_loadWorkPositionList,
  f_recognizeFaceID,
  f_updateEmployee,
  f_updateFaceID,
} from "../utils/nhansuUtils";
import { useDispatch } from "react-redux";
import { changeUserData } from "../../../redux/slices/globalSlice";
import moment from "moment";
import { checkBP } from "../../../api/services/permissionService";
import { SaveExcel } from "../../../api/services/excelService";

// Precision Subcomponents
import PrecisionUserHeader from "./PrecisionUserManager/PrecisionUserHeader";
import PrecisionUserToolbar from "./PrecisionUserManager/PrecisionUserToolbar";
import { getColumnsUserManager } from "./PrecisionUserManager/PrecisionUserColumns";
import PrecisionUserProfilePanel from "./PrecisionUserManager/PrecisionUserProfilePanel";
import PrecisionUserModal from "./PrecisionUserManager/PrecisionUserModal";

const initialUserState: EmployeeTableData = {
  id: "",
  EMPL_NO: "",
  CMS_ID: "",
  FIRST_NAME: "",
  MIDLAST_NAME: "",
  FULL_NAME: "",
  DOB: moment().format("YYYY-MM-DD"),
  HOMETOWN: "",
  ADD_PROVINCE: "",
  ADD_DISTRICT: "",
  ADD_COMMUNE: "",
  ADD_VILLAGE: "",
  PHONE_NUMBER: "",
  WORK_START_DATE: moment().format("YYYY-MM-DD"),
  PASSWORD: "",
  EMAIL: "",
  REMARK: "",
  ONLINE_DATETIME: "",
  CTR_CD: "",
  SEX_CODE: 0,
  SEX_NAME: "",
  SEX_NAME_KR: "",
  WORK_STATUS_CODE: 1,
  WORK_STATUS_NAME: "",
  WORK_STATUS_NAME_KR: "",
  FACTORY_CODE: 1,
  FACTORY_NAME: "",
  FACTORY_NAME_KR: "",
  JOB_CODE: 1,
  JOB_NAME: "",
  JOB_NAME_KR: "",
  POSITION_CODE: 3,
  POSITION_NAME: "",
  POSITION_NAME_KR: "",
  WORK_SHIFT_CODE: 0,
  WORK_SHIF_NAME: "",
  WORK_SHIF_NAME_KR: "",
  WORK_POSITION_CODE: 1,
  WORK_POSITION_NAME: "",
  WORK_POSITION_NAME_KR: "",
  ATT_GROUP_CODE: 0,
  SUBDEPTCODE: 0,
  SUBDEPTNAME: "",
  SUBDEPTNAME_KR: "",
  MAINDEPTCODE: 0,
  MAINDEPTNAME: "",
  MAINDEPTNAME_KR: "",
  NV_CCID: 0,
  EMPL_IMAGE: "",
  RESIGN_DATE: moment().format("YYYY-MM-DD"),
};

const UserManager = () => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [resigned_check, setResignedCheck] = useState(true);
  const [empl_info, setEmplInfo] = useState<Array<EmployeeTableData>>([]);
  const [workpositionload, setWorkPositionLoad] = useState<Array<any>>([]);
  const [selectedRows, setSelectedRows] = useState<EmployeeTableData>(initialUserState);
  const [quickFilterText, setQuickFilterText] = useState("");

  const loadWorkPosition = async () => {
    let kq: any[] = await f_loadWorkPositionList();
    setWorkPositionLoad(kq || []);
  };

  const loadEmplInfo = async () => {
    setLoading(true);
    let kq: EmployeeTableData[] = await f_getEmployeeList();
    setEmplInfo(kq || []);
    setLoading(false);
    if (kq && kq.length > 0) {
      if (!selectedRows.EMPL_NO) {
        setSelectedRows(kq[0]);
      }
      Swal.fire("Thông báo", `Đã tải ${kq.length} nhân viên`, "success");
    } else {
      Swal.fire("Thông báo", "Không có nhân viên nào", "error");
    }
  };

  const setCustInfo = (keyname: string, value: any) => {
    setSelectedRows((prev) => ({ ...prev, [keyname]: value }));
  };

  const createNewUser = () => {
    setSelectedRows({ ...initialUserState, DOB: "", WORK_START_DATE: "", RESIGN_DATE: "" });
  };

  const uploadFile2 = async (fileToUpload: File) => {
    if (!fileToUpload) {
      Swal.fire("Thông báo", "Chọn file trước", "error");
      return;
    }
    if (!selectedRows.EMPL_NO) {
      Swal.fire("Thông báo", "Chọn nhân viên trước", "error");
      return;
    }
    const empl_no = selectedRows.EMPL_NO;
    checkBP(getUserData(), ["NHANSU"], ["ALL"], ["ALL"], async () => {
      uploadQuery(fileToUpload, "NS_" + empl_no + ".jpg", "Picture_NS")
        .then((response) => {
          if (response.data.tk_status !== "NG") {
            generalQuery("update_empl_image", { EMPL_NO: empl_no, EMPL_IMAGE: "Y" })
              .then((res) => {
                if (res.data.tk_status !== "NG") {
                  dispatch(changeUserData({ ...getUserData(), EMPL_IMAGE: "Y" }));
                  setSelectedRows((prev) => ({ ...prev, EMPL_IMAGE: "Y" }));
                  setEmplInfo((prev) =>
                    prev.map((e) => (e.EMPL_NO === empl_no ? { ...e, EMPL_IMAGE: "Y" } : e))
                  );
                  Swal.fire("Thông báo", "Upload avatar thành công", "success");
                } else {
                  Swal.fire("Thông báo", "Upload avatar thất bại", "error");
                }
              });
          } else {
            Swal.fire("Thông báo", "Upload file thất bại: " + response.data.message, "error");
          }
        })
        .catch((err) => console.log(err));
    });
  };

  const handleAddEmployee = async () => {
    const doAdd = async () => {
      await f_addEmployee(selectedRows);
      loadEmplInfo();
      setOpenDialog(false);
    };
    if (getCompany() !== "CMS") {
      checkBP(getUserData(), ["NHANSU"], ["ALL"], ["ALL"], doAdd);
    } else {
      doAdd();
    }
  };

  const handleUpdateEmployee = async () => {
    const doUpdate = async () => {
      await f_updateEmployee(selectedRows);
      loadEmplInfo();
      setOpenDialog(false);
    };
    if (getCompany() !== "CMS") {
      checkBP(getUserData(), ["NHANSU"], ["ALL"], ["ALL"], doUpdate);
    } else {
      doUpdate();
    }
  };

  // Face API Handlers
  const extractEmbedding = async (imageUrl: string) => {
    if (!imageUrl) {
      Swal.fire("Thông báo", "Vui lòng nhập URL ảnh!", "error");
      return;
    }
    setLoading(true);
    try {
      const faceapi = await import("face-api.js");
      const img = await faceapi.fetchImage(imageUrl);
      const detections = await faceapi.detectSingleFace(img).withFaceLandmarks().withFaceDescriptor();
      if (!detections) {
        Swal.fire("Thông báo", "Không tìm thấy khuôn mặt trong ảnh!", "error");
        setLoading(false);
        return;
      }
      const embedding = Array.from(detections.descriptor);
      const buffer = new ArrayBuffer(embedding.length * 4);
      const floatArray = new Float32Array(buffer);
      embedding.forEach((val, i) => (floatArray[i] = val));
      const byteArray = new Uint8Array(buffer);
      let kq: boolean = await f_updateFaceID({ EMPL_NO: selectedRows.EMPL_NO, FACE_ID: byteArray });
      if (kq) {
        Swal.fire("Thông báo", "Lưu embedding khuôn mặt thành công!", "success");
      } else {
        Swal.fire("Thông báo", "Lưu embedding thất bại!", "error");
      }
    } catch (error) {
      console.error(error);
      Swal.fire("Thông báo", "Lỗi khi trích xuất embedding!", "error");
    } finally {
      setLoading(false);
    }
  };

  const checkEmbedding = async (imageUrl: string) => {
    if (!imageUrl) {
      Swal.fire("Thông báo", "Vui lòng nhập URL ảnh!", "error");
      return;
    }
    setLoading(true);
    try {
      const faceapi = await import("face-api.js");
      const img = await faceapi.fetchImage(imageUrl);
      const detections = await faceapi.detectSingleFace(img).withFaceLandmarks().withFaceDescriptor();
      if (!detections) {
        Swal.fire("Thông báo", "Không tìm thấy khuôn mặt trong ảnh!", "error");
        setLoading(false);
        return;
      }
      const embedding = Array.from(detections.descriptor);
      let kq: any = await f_recognizeFaceID({ FACE_ID: embedding });
      if (kq.tk_status !== "NG") {
        Swal.fire("Thông báo", "Xin chào " + kq.data.EMPL_NO, "success");
      } else {
        Swal.fire("Thông báo", kq.message, "error");
      }
    } catch (error) {
      console.error(error);
      Swal.fire("Thông báo", "Lỗi khi nhận diện khuôn mặt!", "error");
    } finally {
      setLoading(false);
    }
  };

  // Data Filtering
  const filteredData = useMemo(() => {
    let data = resigned_check
      ? empl_info.filter((e) => e.WORK_STATUS_CODE === 1)
      : empl_info;

    if (quickFilterText.trim()) {
      const kw = quickFilterText.toLowerCase().trim();
      data = data.filter(
        (item) =>
          item.EMPL_NO?.toLowerCase().includes(kw) ||
          item.FULL_NAME?.toLowerCase().includes(kw) ||
          item.CMS_ID?.toLowerCase().includes(kw) ||
          item.PHONE_NUMBER?.toLowerCase().includes(kw) ||
          item.SUBDEPTNAME?.toLowerCase().includes(kw)
      );
    }
    return data;
  }, [empl_info, resigned_check, quickFilterText]);

  // Excel export
  const handleExportEX1 = () => SaveExcel(filteredData, "DS_NhanVien_Filtered");
  const handleExportEX2 = () => SaveExcel(empl_info, "DS_NhanVien_Full");

  useEffect(() => {
    loadEmplInfo();
    loadWorkPosition();
  }, []);

  const columns = useMemo(() => getColumnsUserManager(), []);

  return (
    <div className="precision-usermanager">
      <PrecisionUserHeader
        totalCount={empl_info.length}
        filteredCount={filteredData.length}
      />

      <div className="precision-usermanager__dualGrid">
        {/* LEFT: Data Grid Panel */}
        <div className="precision-usermanager__leftPanel">
          <PrecisionUserToolbar
            resignedCheck={resigned_check}
            setResignedCheck={setResignedCheck}
            onLoadData={loadEmplInfo}
            onOpenAddModal={() => setOpenDialog(true)}
            onExportEX1={handleExportEX1}
            onExportEX2={handleExportEX2}
            onOpenPivot={() => SaveExcel(filteredData, "DiemDanh_Pivot_Raw")}
            quickFilterText={quickFilterText}
            setQuickFilterText={setQuickFilterText}
            isLoading={loading}
          />

          <div className="precision-usermanager__gridContainer">
            <AGTable
              suppressRowClickSelection={false}
              rowHeight={34}
              headerHeight={32}
              columns={columns}
              data={filteredData}
              onRowClick={(params: any) => setSelectedRows(params.data)}
              onSelectionChange={(params: any) => {
                const rows = params?.api?.getSelectedRows();
                if (rows && rows.length > 0) {
                  setSelectedRows(rows[0]);
                }
              }}
              onRowDoubleClick={() => setOpenDialog(true)}
            />
          </div>
        </div>

        {/* RIGHT: Profile Detail Panel */}
        <div className="precision-usermanager__rightPanel">
          <PrecisionUserProfilePanel
            selectedUser={selectedRows}
            onUploadAvatar={uploadFile2}
            onTrainFace={() =>
              extractEmbedding("/Picture_NS/NS_" + selectedRows.EMPL_NO + ".jpg")
            }
            onCheckFace={() =>
              checkEmbedding("/Picture_NS/NS_" + selectedRows.EMPL_NO + ".jpg")
            }
            isLoadingFace={loading}
          />
        </div>
      </div>

      {/* Modal Add / Update */}
      <PrecisionUserModal
        isOpen={openDialog}
        onClose={() => setOpenDialog(false)}
        selectedUser={selectedRows}
        setCustInfo={setCustInfo}
        workpositionload={workpositionload}
        onClear={createNewUser}
        onAdd={handleAddEmployee}
        onUpdate={handleUpdateEmployee}
        onTrainFace={() =>
          extractEmbedding("/Picture_NS/NS_" + selectedRows.EMPL_NO + ".jpg")
        }
        onCheckFace={() =>
          checkEmbedding("/Picture_NS/NS_" + selectedRows.EMPL_NO + ".jpg")
        }
        onUploadAvatar={uploadFile2}
        isLoading={loading}
      />
    </div>
  );
};

export default UserManager;
