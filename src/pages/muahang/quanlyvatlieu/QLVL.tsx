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
import { getDisplayedGridRows } from "../../../components/DataTable/gridExportUtils";
import { NotificationElement } from "../../../components/NotificationPanel/Notification";
import { FSC_LIST_DATA, MATERIAL_TABLE_DATA } from "../interfaces/muaInterface";
import { CustomerListData } from "../../kinhdoanh/interfaces/kdInterface";
import useIsMobile from "../../../components/Navbar/AccountInfo/useIsMobile";

// Precision Google Stitch Subcomponents
import "./PrecisionQLVL/PrecisionQLVL.scss";
import PrecisionQLVLHeader from "./PrecisionQLVL/PrecisionQLVLHeader";
import PrecisionQLVLKpi from "./PrecisionQLVL/PrecisionQLVLKpi";
import PrecisionQLVLToolbar from "./PrecisionQLVL/PrecisionQLVLToolbar";
import { buildQLVLColumns } from "./PrecisionQLVL/PrecisionQLVLColumns";
import PrecisionQLVLAddModal from "./PrecisionQLVL/PrecisionQLVLAddModal";
import { lazyOpenable } from "../../../components/PivotChart/lazyOpenable";

// Mobile Subcomponents
import PrecisionQLVLMobileHeader from "./PrecisionQLVL/PrecisionQLVLMobileHeader";
import PrecisionQLVLMobileKpi from "./PrecisionQLVL/PrecisionQLVLMobileKpi";
import PrecisionQLVLMobileToolbar from "./PrecisionQLVL/PrecisionQLVLMobileToolbar";
import PrecisionQLVLMobileFilterDrawer from "./PrecisionQLVL/PrecisionQLVLMobileFilterDrawer";

// Pivot modal chỉ nạp ĐỘNG khi mở (module kéo theo DevExtreme) — xem lazyOpenable.tsx.
const PrecisionQLVLPivotModal = lazyOpenable(() =>
  import("./PrecisionQLVL/PrecisionQLVLPivotModal").then((m) => m.default),
);
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
  const isMobile = useIsMobile();

  // State dữ liệu & danh mục
  const [data, setData] = useState<MATERIAL_TABLE_DATA[]>([]);
  const [customerList, setCustomerList] = useState<CustomerListData[]>([]);
  const [fscList, setFSCList] = useState<FSC_LIST_DATA[]>([]);

  // State bộ lọc đa chiều
  const [searchKeyword, setSearchKeyword] = useState<string>("");
  const [filterUseYn, setFilterUseYn] = useState<"ALL" | "Y" | "N">("ALL");
  const [filterFsc, setFilterFsc] = useState<"ALL" | "Y" | "N">("ALL");
  const [filterFscCode, setFilterFscCode] = useState<string>("");
  const [filterDocs, setFilterDocs] = useState<"ALL" | "HAS_DOCS" | "NO_DOCS">("ALL");
  const [filterVendor, setFilterVendor] = useState<string>("");

  // State giao diện Mobile
  const [showMobileKpi, setShowMobileKpi] = useState<boolean>(false);
  const [showMobileFilter, setShowMobileFilter] = useState<boolean>(false);

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
      if (!clickedRows.M_NAME || !clickedRows.M_NAME.trim()) {
        Swal.fire("Cảnh báo", "Vui lòng nhập Mã Vật Liệu trước khi lưu!", "warning");
        return;
      }

      const checkRes = await generalQuery("checkMaterialExist", { M_NAME: clickedRows.M_NAME.trim() });
      if (checkRes.data.tk_status !== "NG") {
        Swal.fire("Thông báo", `Mã vật liệu ${clickedRows.M_NAME} đã tồn tại trong hệ thống`, "error");
        return;
      }

      const payload: MATERIAL_TABLE_DATA = {
        ...clickedRows,
        M_NAME: clickedRows.M_NAME.trim(),
        SSPRICE: Number(clickedRows.SSPRICE) || 0,
        CMSPRICE: Number(clickedRows.CMSPRICE) || 0,
        SLITTING_PRICE: Number(clickedRows.SLITTING_PRICE) || 0,
        MASTER_WIDTH: Number(clickedRows.MASTER_WIDTH) || 0,
        ROLL_LENGTH: Number(clickedRows.ROLL_LENGTH) || 0,
      };

      const addRes = await generalQuery("addMaterial", payload);
      if (addRes.data.tk_status !== "NG") {
        const userData = getUserData();
        const newNotification: NotificationElement = {
          CTR_CD: "002",
          NOTI_ID: -1,
          NOTI_TYPE: "success",
          TITLE: "Thêm vật liệu mới",
          CONTENT: `${userData?.EMPL_NO} (${userData?.MIDLAST_NAME} ${userData?.FIRST_NAME}), nhân viên ${userData?.WORK_POSITION_NAME} đã thêm vật liệu mới ${payload.M_NAME}.`,
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
      if (!clickedRows.M_NAME || !clickedRows.M_NAME.trim()) {
        Swal.fire("Cảnh báo", "Vui lòng nhập Mã Vật Liệu trước khi lưu!", "warning");
        return;
      }

      const payload: MATERIAL_TABLE_DATA = {
        ...clickedRows,
        M_NAME: clickedRows.M_NAME.trim(),
        SSPRICE: Number(clickedRows.SSPRICE) || 0,
        CMSPRICE: Number(clickedRows.CMSPRICE) || 0,
        SLITTING_PRICE: Number(clickedRows.SLITTING_PRICE) || 0,
        MASTER_WIDTH: Number(clickedRows.MASTER_WIDTH) || 0,
        ROLL_LENGTH: Number(clickedRows.ROLL_LENGTH) || 0,
      };

      const updRes = await generalQuery("updateMaterial", payload);
      if (updRes.data.tk_status !== "NG") {
        try {
          await generalQuery("updateM090FSC", payload);
        } catch (fscErr) {
          console.error("updateM090FSC failed:", fscErr);
        }
        const userData = getUserData();
        const newNotification: NotificationElement = {
          CTR_CD: "002",
          NOTI_ID: -1,
          NOTI_TYPE: "info",
          TITLE: "Update thông tin vật liệu",
          CONTENT: `${userData?.EMPL_NO} (${userData?.MIDLAST_NAME} ${userData?.FIRST_NAME}), nhân viên ${userData?.WORK_POSITION_NAME} đã cập nhật vật liệu ${payload.M_NAME}.`,
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

  // Đếm số điều kiện lọc nâng cao đang kích hoạt
  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (filterUseYn !== "ALL") count++;
    if (filterFsc !== "ALL") count++;
    if (filterFscCode !== "") count++;
    if (filterDocs !== "ALL") count++;
    if (filterVendor !== "") count++;
    return count;
  }, [filterUseYn, filterFsc, filterFscCode, filterDocs, filterVendor]);

  // Đặt lại toàn bộ bộ lọc
  const handleResetFilters = useCallback(() => {
    setSearchKeyword("");
    setFilterUseYn("ALL");
    setFilterFsc("ALL");
    setFilterFscCode("");
    setFilterDocs("ALL");
    setFilterVendor("");
  }, []);

  // Lọc dữ liệu đa chiều thông minh
  const filteredData = useMemo(() => {
    let result = data;

    // Lọc theo từ khóa tìm kiếm
    if (searchKeyword.trim()) {
      const kw = searchKeyword.toLowerCase().trim();
      result = result.filter(
        (item) =>
          item.M_NAME?.toLowerCase().includes(kw) ||
          item.DESCR?.toLowerCase().includes(kw) ||
          item.CUST_CD?.toLowerCase().includes(kw) ||
          item.CUST_NAME_KD?.toLowerCase().includes(kw) ||
          item.FSC_NAME?.toLowerCase().includes(kw) ||
          item.FSC_CODE?.toLowerCase().includes(kw)
      );
    }

    // Lọc theo USE_YN
    if (filterUseYn !== "ALL") {
      result = result.filter((item) => item.USE_YN === filterUseYn);
    }

    // Lọc theo FSC
    if (filterFsc !== "ALL") {
      result = result.filter((item) => item.FSC === filterFsc);
    }

    // Lọc theo FSC_CODE
    if (filterFscCode !== "") {
      result = result.filter((item) => item.FSC_CODE === filterFscCode);
    }

    // Lọc theo Hồ Sơ Kỹ Thuật (MSDS / TDS / SGS)
    if (filterDocs !== "ALL") {
      result = result.filter((item) => {
        const hasDoc =
          (item.TDS_VER && item.TDS_VER > 0) ||
          (item.SGS_VER && item.SGS_VER > 0) ||
          (item.MSDS_VER && item.MSDS_VER > 0) ||
          item.TDS === "Y";
        return filterDocs === "HAS_DOCS" ? hasDoc : !hasDoc;
      });
    }

    // Lọc theo Nhà Cung Cấp
    if (filterVendor !== "") {
      result = result.filter((item) => item.CUST_CD === filterVendor);
    }

    return result;
  }, [data, searchKeyword, filterUseYn, filterFsc, filterFscCode, filterDocs, filterVendor]);

  // DataSource cho Pivot Table
  // DevExtreme chỉ được nạp khi user mở pivot (xem components/PivotChart/lazyPivot.ts).
  const [pivotDataSource, setPivotDataSource] = useState<any>(null);
  useEffect(() => {
    if (!showPivotModal) return;
    let cancelled = false;
    void createQLVLPivotDataSource(data).then((ds) => {
      if (!cancelled) setPivotDataSource(ds);
    });
    return () => {
      cancelled = true;
    };
  }, [showPivotModal, data]);

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
    <div className={`precision-qlvl ${isMobile ? "is-mobile" : ""}`}>
      {/* 1. Header: Phân biệt Desktop vs Mobile */}
      {!isMobile ? (
        <PrecisionQLVLHeader totalCount={data.length} />
      ) : (
        <PrecisionQLVLMobileHeader
          totalCount={data.length}
          filteredCount={filteredData.length}
          showKpi={showMobileKpi}
          onToggleKpi={() => setShowMobileKpi((prev) => !prev)}
          onOpenFilterDrawer={() => setShowMobileFilter(true)}
          onReload={load_material_table}
          activeFilterCount={activeFilterCount}
        />
      )}

      {/* 2. Realtime KPI Cards: Desktop luôn hiện, Mobile hiện khi bật showMobileKpi */}
      {!isMobile && <PrecisionQLVLKpi data={data} />}
      {isMobile && showMobileKpi && <PrecisionQLVLMobileKpi data={data} />}

      {/* 3. Action Toolbar: Desktop đầy đủ vs Mobile tinh gọn 3 hàng công thái học */}
      {!isMobile ? (
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
          onExportEX1={() =>
            SaveExcel(getDisplayedGridRows(undefined, filteredData), "DS_VatLieu_DangLoc")
          }
          onExportEX2={() => SaveExcel(data, "DS_VatLieu_ToanBo")}
          onOpenPivot={() => setShowPivotModal(true)}
          searchKeyword={searchKeyword}
          onSearchChange={setSearchKeyword}
          totalCount={data.length}
          filteredCount={filteredData.length}
        />
      ) : (
        <PrecisionQLVLMobileToolbar
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
          onExportEX1={() =>
            SaveExcel(getDisplayedGridRows(undefined, filteredData), "DS_VatLieu_DangLoc")
          }
          onExportEX2={() => SaveExcel(data, "DS_VatLieu_ToanBo")}
          onOpenPivot={() => setShowPivotModal(true)}
          searchKeyword={searchKeyword}
          onSearchChange={setSearchKeyword}
          activeFilterCount={activeFilterCount}
          onOpenFilterDrawer={() => setShowMobileFilter(true)}
          filterUseYn={filterUseYn}
          onFilterUseYnChange={setFilterUseYn}
          filterFsc={filterFsc}
          onFilterFscChange={setFilterFsc}
          filterDocs={filterDocs}
          onFilterDocsChange={setFilterDocs}
        />
      )}

      {/* 4. Khung Bảng AGTable (Đạt Full Height & Full Width, Tối Ưu Cho Cả Desktop & Mobile) */}
      <div className="precision-qlvl__gridContainer">
        <div className="precision-qlvl__gridBody">
          <AGTable
            rowHeight={isMobile ? 34 : 32}
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
            showFilter={!isMobile}
          />
        </div>
      </div>

      {/* 5. Mobile Filter Drawer (Chỉ mở trên Mobile khi chạm nút Lọc) */}
      {isMobile && (
        <PrecisionQLVLMobileFilterDrawer
          isOpen={showMobileFilter}
          onClose={() => setShowMobileFilter(false)}
          searchKeyword={searchKeyword}
          filterUseYn={filterUseYn}
          filterFsc={filterFsc}
          filterFscCode={filterFscCode}
          filterDocs={filterDocs}
          filterVendor={filterVendor}
          customerList={customerList}
          fscList={fscList}
          onApply={(filters) => {
            setSearchKeyword(filters.searchKeyword);
            setFilterUseYn(filters.filterUseYn);
            setFilterFsc(filters.filterFsc);
            setFilterFscCode(filters.filterFscCode);
            setFilterDocs(filters.filterDocs);
            setFilterVendor(filters.filterVendor);
          }}
          onReset={handleResetFilters}
        />
      )}

      {/* 6. Modal Thêm Mới / Cập Nhật Vật Liệu */}
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

      {/* 7. Modal Tra Cứu Tài Liệu Kỹ Thuật (VLDOC) */}
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

      {/* 8. Modal Báo Cáo Phân Tích Pivot */}
      <PrecisionQLVLPivotModal
        isOpen={showPivotModal}
        onClose={() => setShowPivotModal(false)}
        dataSource={pivotDataSource}
      />
    </div>
  );
};

export default React.memo(QLVL);
