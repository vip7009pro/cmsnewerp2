import React, { useEffect, useMemo, useState, useCallback } from "react";
import moment from "moment";
import Swal from "sweetalert2";
import { IconButton } from "@mui/material";
import { FiX, FiFolder } from "react-icons/fi";
import AGTable from "../../../components/DataTable/AGTable";
import CustomDialog from "../../../components/Dialog/CustomDialog";
import VLDOC from "./VLDOC";
import { generalQuery, getCompany, getSocket, getUserData, uploadQuery } from "../../../api/Api";
import { f_insert_Notification_Data } from "../../../api/services/notificationService";
import { SaveExcel } from "../../../api/services/excelService";
import { NotificationElement } from "../../../components/NotificationPanel/Notification";
import { FSC_LIST_DATA, MATERIAL_TABLE_DATA } from "../interfaces/muaInterface";
import { CustomerListData } from "../../kinhdoanh/interfaces/kdInterface";

// Precision Google Stitch Subcomponents
import "./PrecisionQLVL/PrecisionQLVL.scss";
import PrecisionQLVLHeader from "./PrecisionQLVL/PrecisionQLVLHeader";
import PrecisionQLVLKpi from "./PrecisionQLVL/PrecisionQLVLKpi";
import PrecisionQLVLToolbar from "./PrecisionQLVL/PrecisionQLVLToolbar";
import { buildQLVLColumns } from "./PrecisionQLVL/PrecisionQLVLColumns";
import PrecisionQLVLAddModal from "./PrecisionQLVL/PrecisionQLVLAddModal";
import PrecisionQLVLPivotModal from "./PrecisionQLVL/PrecisionQLVLPivotModal";
import { createQLVLPivotDataSource } from "./PrecisionQLVL/PrecisionQLVLPivotConfig";

const initialClickedRow: MATERIAL_TABLE_DATA = {
  M_ID: 0,
  M_NAME: "",
  DESCR: "",
  CUST_CD: "0049",
  CUST_NAME_KD: "SSJ",
  SSPRICE: 0,
  CMSPRICE: 0,
  SLITTING_PRICE: 0,
  MASTER_WIDTH: 0,
  ROLL_LENGTH: 0,
  USE_YN: "Y",
  INS_DATE: "",
  INS_EMPL: "",
  UPD_DATE: "",
  UPD_EMPL: "",
  EXP_DATE: "-",
  FSC: "N",
  FSC_CODE: "01",
  FSC_NAME: "NA",
  TDS: "N",
  TDS_VER: 0,
  SGS_VER: 0,
  MSDS_VER: 0,
};

const QLVL: React.FC = () => {
  const company = getCompany();

  // State dữ liệu & bộ lọc
  const [data, setData] = useState<MATERIAL_TABLE_DATA[]>([]);
  const [searchKeyword, setSearchKeyword] = useState<string>("");
  const [customerList, setCustomerList] = useState<CustomerListData[]>([]);
  const [fscList, setFSCList] = useState<FSC_LIST_DATA[]>([]);

  // State tương tác dòng & Modals
  const [clickedRows, setClickedRows] = useState<MATERIAL_TABLE_DATA>(initialClickedRow);
  const [showdialog, setShowDialog] = useState<boolean>(false);
  const [openDocDialog, setOpenDocDialog] = useState<boolean>(false);
  const [selected_M_ID, setSelected_M_ID] = useState<number>(0);
  const [selected_M_NAME, setSelected_M_NAME] = useState<string>("");
  const [showPivotModal, setShowPivotModal] = useState<boolean>(false);

  // 1. Tải danh mục vật liệu
  const load_material_table = useCallback(() => {
    generalQuery("get_material_table", { M_NAME: "" })
      .then((response) => {
        if (response.data.tk_status !== "NG") {
          const loadeddata: MATERIAL_TABLE_DATA[] = (response.data.data || []).map(
            (element: MATERIAL_TABLE_DATA, index: number) => ({
              ...element,
              DESCR: element.DESCR ?? "",
              SSPRICE: element.SSPRICE ?? 0,
              CMSPRICE: element.CMSPRICE ?? 0,
              SLITTING_PRICE: element.SLITTING_PRICE ?? 0,
              MASTER_WIDTH: element.MASTER_WIDTH ?? 0,
              ROLL_LENGTH: element.ROLL_LENGTH ?? 0,
              INS_DATE: moment.utc(element.INS_DATE).format("YYYY-MM-DD HH:mm:ss"),
              UPD_DATE: moment.utc(element.UPD_DATE).format("YYYY-MM-DD HH:mm:ss"),
              EXP_DATE: element.EXP_DATE ?? "-",
              FSC: element.FSC ?? "N",
              FSC_CODE: element.FSC_CODE ?? "01",
              FSC_NAME: element.FSC_NAME ?? "NO_FSC",
              id: index,
            })
          );
          setData(loadeddata);
          Swal.fire("Thông báo", `Đã tải ${loadeddata.length} mã vật liệu thành công`, "success");
        } else {
          setData([]);
          Swal.fire("Thông báo", "Lỗi nạp dữ liệu: " + response.data.message, "error");
        }
      })
      .catch((error) => {
        console.error(error);
        Swal.fire("Lỗi kết nối", "Không thể tải danh sách vật liệu", "error");
      });
  }, []);

  // 2. Tải danh sách nhà cung cấp
  const getcustomerlist = useCallback(() => {
    generalQuery("selectVendorList", {})
      .then((response) => {
        if (response.data.tk_status !== "NG") {
          setCustomerList(response.data.data || []);
        }
      })
      .catch((error) => console.error(error));
  }, []);

  // 3. Tải danh mục FSC
  const getFSCList = useCallback(() => {
    generalQuery("getFSCList", {})
      .then((response) => {
        if (response.data.tk_status !== "NG") {
          setFSCList(response.data.data || []);
        }
      })
      .catch((error) => console.error(error));
  }, []);

  // 4. Thay đổi thông tin vật liệu trên form
  const seMaterialInfo = useCallback((keyname: string, value: any) => {
    setClickedRows((prev) => ({
      ...prev,
      [keyname]: value,
    }));
  }, []);

  // 5. Thêm mới vật liệu
  const addMaterial = useCallback(async () => {
    try {
      const checkRes = await generalQuery("checkMaterialExist", { M_NAME: clickedRows.M_NAME });
      if (checkRes.data.tk_status !== "NG") {
        Swal.fire("Thông báo", `Mã vật liệu ${clickedRows.M_NAME} đã tồn tại trong hệ thống`, "error");
        return;
      }

      const addRes = await generalQuery("addMaterial", clickedRows);
      if (addRes.data.tk_status !== "NG") {
        const userData = getUserData();
        const newNotification: NotificationElement = {
          CTR_CD: "002",
          NOTI_ID: -1,
          NOTI_TYPE: "success",
          TITLE: "Thêm vật liệu mới",
          CONTENT: `${userData?.EMPL_NO} (${userData?.MIDLAST_NAME} ${userData?.FIRST_NAME}), nhân viên ${userData?.WORK_POSITION_NAME} đã thêm vật liệu mới ${clickedRows.M_NAME}.`,
          SUBDEPTNAME: "KD,RND,IQC,ĐỘ TIN CẬY,QC",
          MAINDEPTNAME: "KD,RND,KHO,QC",
          INS_EMPL: userData?.EMPL_NO || "SYSTEM",
          INS_DATE: moment().format("YYYY-MM-DD"),
          UPD_EMPL: userData?.EMPL_NO || "SYSTEM",
          UPD_DATE: moment().format("YYYY-MM-DD"),
        };
        if (await f_insert_Notification_Data(newNotification)) {
          getSocket().emit("notification_panel", newNotification);
        }
        Swal.fire("Thông báo", "Thêm vật liệu thành công", "success");
        setShowDialog(false);
        load_material_table();
      } else {
        Swal.fire("Lỗi thêm mới", addRes.data.message, "error");
      }
    } catch (error) {
      console.error(error);
      Swal.fire("Lỗi", "Không thể thêm vật liệu", "error");
    }
  }, [clickedRows, load_material_table]);

  // 6. Cập nhật vật liệu
  const updateMaterial = useCallback(async () => {
    try {
      const updRes = await generalQuery("updateMaterial", clickedRows);
      if (updRes.data.tk_status !== "NG") {
        await generalQuery("updateM090FSC", clickedRows);
        const userData = getUserData();
        const newNotification: NotificationElement = {
          CTR_CD: "002",
          NOTI_ID: -1,
          NOTI_TYPE: "info",
          TITLE: "Update thông tin vật liệu",
          CONTENT: `${userData?.EMPL_NO} (${userData?.MIDLAST_NAME} ${userData?.FIRST_NAME}), nhân viên ${userData?.WORK_POSITION_NAME} đã cập nhật vật liệu ${clickedRows.M_NAME}.`,
          SUBDEPTNAME: "KD,RND,IQC,ĐỘ TIN CẬY,QC",
          MAINDEPTNAME: "KD,RND,KHO,QC",
          INS_EMPL: userData?.EMPL_NO || "SYSTEM",
          INS_DATE: moment().format("YYYY-MM-DD"),
          UPD_EMPL: userData?.EMPL_NO || "SYSTEM",
          UPD_DATE: moment().format("YYYY-MM-DD"),
        };
        if (await f_insert_Notification_Data(newNotification)) {
          getSocket().emit("notification_panel", newNotification);
        }
        Swal.fire("Thông báo", "Cập nhật thông tin vật liệu thành công", "success");
        setShowDialog(false);
        load_material_table();
      } else {
        Swal.fire("Lỗi cập nhật", updRes.data.message, "error");
      }
    } catch (error) {
      console.error(error);
      Swal.fire("Lỗi", "Không thể cập nhật vật liệu", "error");
    }
  }, [clickedRows, load_material_table]);

  // 7. Upload file TDS PDF (Dành cho PVN)
  const uploadTDS = useCallback((M_ID: number, up_file: any) => {
    if (!up_file) {
      Swal.fire("Thông báo", "Vui lòng chọn file PDF để upload", "warning");
      return;
    }
    uploadQuery(up_file, `NVL_${M_ID}.pdf`, "tds2")
      .then((response) => {
        if (response.data.tk_status !== "NG") {
          generalQuery("updateTDSStatus", { M_ID }).then((statusRes) => {
            if (statusRes.data.tk_status !== "NG") {
              Swal.fire("Thông báo", "Upload file TDS thành công", "success");
              load_material_table();
            }
          });
        } else {
          Swal.fire("Thông báo", "Upload file thất bại: " + response.data.message, "error");
        }
      })
      .catch((error) => {
        console.error(error);
        Swal.fire("Lỗi", "Upload file thất bại", "error");
      });
  }, [load_material_table]);

  // 8. Mở modal tài liệu kỹ thuật VLDOC
  const handleOpenDocDialog = useCallback((m_id: number, m_name: string) => {
    setSelected_M_ID(m_id);
    setSelected_M_NAME(m_name);
    setOpenDocDialog(true);
  }, []);

  // 9. Mở modal cập nhật vật liệu
  const handleOpenUpdateModal = useCallback(() => {
    if (!clickedRows || !clickedRows.M_ID) {
      Swal.fire({
        title: "Chưa Chọn Vật Liệu",
        text: "Vui lòng click chọn 1 dòng vật liệu trên bảng trước khi bấm Cập Nhật (Update)!",
        icon: "warning",
      });
      return;
    }
    setShowDialog(true);
  }, [clickedRows]);

  const handleEditMaterial = useCallback((row: MATERIAL_TABLE_DATA) => {
    setClickedRows(row);
    setShowDialog(true);
  }, []);

  // Lọc dữ liệu nhanh theo searchKeyword
  const filteredData = useMemo(() => {
    if (!searchKeyword.trim()) return data;
    const kw = searchKeyword.toLowerCase().trim();
    return data.filter(
      (item) =>
        item.M_NAME?.toLowerCase().includes(kw) ||
        item.DESCR?.toLowerCase().includes(kw) ||
        item.CUST_CD?.toLowerCase().includes(kw) ||
        item.CUST_NAME_KD?.toLowerCase().includes(kw) ||
        item.FSC_NAME?.toLowerCase().includes(kw) ||
        item.FSC_CODE?.toLowerCase().includes(kw)
    );
  }, [data, searchKeyword]);

  // DataSource cho Pivot Table
  const pivotDataSource = useMemo(() => {
    return createQLVLPivotDataSource(data);
  }, [data]);

  // Cấu hình cột bảng AGTable
  const columns = useMemo(() => {
    return buildQLVLColumns({
      company,
      onOpenDocDialog: handleOpenDocDialog,
      onUploadTDS: uploadTDS,
      onEditMaterial: handleEditMaterial,
    });
  }, [company, handleOpenDocDialog, uploadTDS, handleEditMaterial]);

  useEffect(() => {
    load_material_table();
    getcustomerlist();
    getFSCList();
  }, [load_material_table, getcustomerlist, getFSCList]);

  return (
    <div className="precision-qlvl">
      {/* 1. Sub-Header */}
      <PrecisionQLVLHeader totalCount={data.length} />

      {/* 2. Realtime KPI Cards (Theo Thực Tế Dữ Liệu) */}
      <PrecisionQLVLKpi data={data} />

      {/* 3. Action Toolbar (Bao gồm Thêm Mới, Cập Nhật, EX1, EX2, PIVOT, Tìm kiếm) */}
      <PrecisionQLVLToolbar
        onAddMaterial={() => {
          setClickedRows(initialClickedRow);
          setShowDialog(true);
        }}
        onUpdateMaterial={handleOpenUpdateModal}
        selectedMName={clickedRows?.M_NAME}
        onReload={load_material_table}
        onOpenDocs={() => {
          setSelected_M_ID(clickedRows?.M_ID || 0);
          setSelected_M_NAME(clickedRows?.M_NAME || "");
          setOpenDocDialog(true);
        }}
        onExportEX1={() => SaveExcel(filteredData, "DS_VatLieu_DangLoc")}
        onExportEX2={() => SaveExcel(data, "DS_VatLieu_ToanBo")}
        onOpenPivot={() => setShowPivotModal(true)}
        searchKeyword={searchKeyword}
        onSearchChange={setSearchKeyword}
        totalCount={data.length}
        filteredCount={filteredData.length}
      />

      {/* 4. Khung Bảng AGTable (Đạt Full Height & Full Width, Hỗ Trợ Double Click Cập Nhật) */}
      <div className="precision-qlvl__gridContainer">
        <div className="precision-qlvl__gridBody">
          <AGTable
            rowHeight={32}
            columns={columns}
            data={filteredData}
            onCellClick={(params: any) => {
              if (params.data) setClickedRows(params.data);
            }}
            onRowDoubleClicked={(params: any) => {
              if (params.data) {
                setClickedRows(params.data);
                setShowDialog(true);
              }
            }}
            suppressRowClickSelection={false}
            showFilter={true}
          />
        </div>
      </div>

      {/* 5. Modal Thêm Mới / Cập Nhật Vật Liệu */}
      <PrecisionQLVLAddModal
        isOpen={showdialog}
        onClose={() => setShowDialog(false)}
        materialInfo={clickedRows}
        onChangeInfo={seMaterialInfo}
        customerList={customerList}
        fscList={fscList}
        onAdd={addMaterial}
        onUpdate={updateMaterial}
        company={company}
      />

      {/* 6. Modal Tra Cứu Tài Liệu Kỹ Thuật (VLDOC) */}
      <CustomDialog
        isOpen={openDocDialog}
        onClose={() => setOpenDocDialog(false)}
        dialogClassName="precision-qlvl-doc-dialog"
        title={
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <FiFolder size={16} style={{ color: "#38bdf8" }} />
              <span>Hồ Sơ Kỹ Thuật Vật Liệu (TDS / SGS / MSDS) • {selected_M_NAME || "Tất Cả"}</span>
            </div>
            <IconButton
              size="small"
              onClick={() => setOpenDocDialog(false)}
              sx={{ color: "#ffffff", padding: "2px", "&:hover": { backgroundColor: "rgba(255, 255, 255, 0.2)" } }}
              title="Đóng cửa sổ hồ sơ"
            >
              <FiX size={16} />
            </IconButton>
          </div>
        }
        content={<VLDOC M_ID={selected_M_ID} M_NAME={selected_M_NAME} />}
        actions={<></>}
      />

      {/* 7. Modal Báo Cáo Phân Tích Pivot */}
      <PrecisionQLVLPivotModal
        isOpen={showPivotModal}
        onClose={() => setShowPivotModal(false)}
        dataSource={pivotDataSource}
      />
    </div>
  );
};

export default React.memo(QLVL);
