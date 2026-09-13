import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import moment from "moment";
import Swal from "sweetalert2";
import { generalQuery, getAuditMode, getCompany } from "../../../api/Api";
import AGTable from "../../../components/DataTable/AGTable";
import { MaterialPOData, MaterialPOSumData, MRPDATA } from "../interfaces/muaInterface";
import { f_loadMRPPlan } from "../utils/muaUtils";
import { SaveExcel } from "../../../api/services/excelService";

import "./PrecisionTinhLieu/PrecisionTinhLieu.scss";
import PrecisionTinhLieuHeader from "./PrecisionTinhLieu/PrecisionTinhLieuHeader";
import PrecisionTinhLieuKpi from "./PrecisionTinhLieu/PrecisionTinhLieuKpi";
import PrecisionTinhLieuToolbar from "./PrecisionTinhLieu/PrecisionTinhLieuToolbar";
import {
  buildMRPTableCMS,
  buildMRPTablePVN,
  buildMRPTableSummary,
  buildMRPTablePlan,
} from "./PrecisionTinhLieu/PrecisionTinhLieuColumns";

const TINHLIEU = () => {
  const company = getCompany();

  // 1. Quản lý trạng thái dữ liệu & chế độ tra cứu
  const [currentTable, setCurrentTable] = useState<Array<any>>([]);
  const [currentMode, setCurrentMode] = useState<"DETAIL" | "SUMMARY" | "PLAN">("DETAIL");
  const [selectedYCSX, setSelectedYCSX] = useState<Array<any>>([]);
  const ycsxdatatablefilter = useRef<Array<any>>([]);

  // 2. Bộ lọc Form Data
  const [formdata, setFormData] = useState({
    CUST_NAME_KD: "",
    M_NAME: "",
    SHORTAGE_ONLY: false,
    NEWPO: false,
    FROM_DATE: moment().format("YYYY-MM-DD"),
    TO_DATE: moment().format("YYYY-MM-DD"),
    ALLTIME: false,
  });

  const [searchKeyword, setSearchKeyword] = useState("");

  const setFormInfo = useCallback((keyname: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [keyname]: value,
    }));
  }, []);

  // 3. Khóa & Mở Liệu YCSX hàng loạt
  const setLockMaterial = async (material_value: string) => {
    const selectedRows = ycsxdatatablefilter.current;
    if (selectedRows.length >= 1) {
      let err_code = false;
      for (let i = 0; i < selectedRows.length; i++) {
        try {
          const response = await generalQuery("setMaterial_YN", {
            PROD_REQUEST_NO: selectedRows[i].PROD_REQUEST_NO,
            MATERIAL_YN: material_value,
          });
          if (response.data.tk_status === "NG") {
            err_code = true;
          }
        } catch (error) {
          console.error(error);
          err_code = true;
        }
      }

      if (!err_code) {
        Swal.fire("Thành Công", `Đã cập nhật trạng thái liệu cho ${selectedRows.length} YCSX thành công!`, "success");
        // Tải lại bảng hiện tại
        load_material_table("DETAIL");
      } else {
        Swal.fire("Thông Báo", "Có lỗi SQL trong quá trình cập nhật trạng thái liệu!", "error");
      }
    } else {
      Swal.fire("Chưa Chọn YCSX", "Vui lòng chọn ít nhất 1 YCSX trên bảng để thực hiện thao tác!", "warning");
    }
  };

  const handleConfirmLockMaterial = useCallback(() => {
    if (ycsxdatatablefilter.current.length === 0) {
      Swal.fire("Chưa Chọn YCSX", "Vui lòng chọn ít nhất 1 YCSX trên bảng để KHÓA LIỆU!", "warning");
      return;
    }
    Swal.fire({
      title: "Khóa Liệu YCSX Hàng Loạt?",
      text: `Bạn có chắc chắn muốn KHÓA LIỆU cho ${ycsxdatatablefilter.current.length} YCSX đã chọn?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#e11d48",
      cancelButtonColor: "#64748b",
      confirmButtonText: "Khóa Liệu!",
      cancelButtonText: "Hủy",
    }).then((result) => {
      if (result.isConfirmed) {
        setLockMaterial("N");
      }
    });
  }, []);

  const handleConfirmUnLockMaterial = useCallback(() => {
    if (ycsxdatatablefilter.current.length === 0) {
      Swal.fire("Chưa Chọn YCSX", "Vui lòng chọn ít nhất 1 YCSX trên bảng để MỞ LIỆU!", "warning");
      return;
    }
    Swal.fire({
      title: "Mở Liệu YCSX Hàng Loạt?",
      text: `Bạn có chắc chắn muốn MỞ LIỆU cho ${ycsxdatatablefilter.current.length} YCSX đã chọn?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#059669",
      cancelButtonColor: "#64748b",
      confirmButtonText: "Mở Liệu!",
      cancelButtonText: "Hủy",
    }).then((result) => {
      if (result.isConfirmed) {
        setLockMaterial("Y");
      }
    });
  }, []);

  // 4. API Nạp Dữ Liệu MRP
  const load_material_table = useCallback(
    (option: "DETAIL" | "SUMMARY" | "PLAN") => {
      setCurrentMode(option);
      setSelectedYCSX([]);
      ycsxdatatablefilter.current = [];

      if (option === "DETAIL") {
        const queryName = company === "CMS" ? "loadMaterialByPO" : "loadMaterialByYCSX";
        generalQuery(queryName, formdata)
          .then((response) => {
            if (response.data.tk_status !== "NG") {
              const loadeddata = response.data.data.map((element: MaterialPOData, index: number) => ({
                ...element,
                G_NAME_KD:
                  getAuditMode() === 0
                    ? element.G_NAME_KD
                    : element.G_NAME_KD?.search("CNDB") === -1
                    ? element.G_NAME_KD
                    : "TEM_NOI_BO",
                NEED_M_QTY: Number(element.NEED_M_QTY) || 0,
                id: index,
              }));
              setCurrentTable(loadeddata);
              Swal.fire("Nạp Thành Công", `Đã tải ${loadeddata.length} dòng dữ liệu MRP Chi Tiết`, "success");
            } else {
              setCurrentTable([]);
              Swal.fire("Thông Báo", response.data.message || "Không có dữ liệu phù hợp", "info");
            }
          })
          .catch((error) => {
            console.error(error);
            Swal.fire("Lỗi Máy Chủ", "Không thể nạp dữ liệu MRP Chi Tiết", "error");
          });
      } else if (option === "SUMMARY") {
        const queryName = company === "CMS" ? "loadMaterialMRPALL" : "loadMaterialByYCSX_ALL";
        generalQuery(queryName, formdata)
          .then((response) => {
            if (response.data.tk_status !== "NG") {
              const loadeddata = response.data.data.map((element: MaterialPOSumData, index: number) => ({
                ...element,
                NEED_M_QTY: Number(element.NEED_M_QTY) || 0,
                M_SHORTAGE: Number(element.M_SHORTAGE) || 0,
                id: index,
              }));
              setCurrentTable(loadeddata);
              Swal.fire("Nạp Thành Công", `Đã tải ${loadeddata.length} mã vật liệu MRP Tổng Hợp`, "success");
            } else {
              setCurrentTable([]);
              Swal.fire("Thông Báo", response.data.message || "Không có dữ liệu phù hợp", "info");
            }
          })
          .catch((error) => {
            console.error(error);
            Swal.fire("Lỗi Máy Chủ", "Không thể nạp dữ liệu MRP Tổng Hợp", "error");
          });
      } else if (option === "PLAN") {
        f_loadMRPPlan(formdata.FROM_DATE)
          .then((kq: MRPDATA[]) => {
            if (kq.length > 0) {
              setCurrentTable(kq);
              Swal.fire("Nạp Thành Công", `Đã nạp ${kq.length} dòng kế hoạch MRP 15 Ngày`, "success");
            } else {
              setCurrentTable([]);
              Swal.fire(
                "Thông Báo Kế Hoạch",
                `Chưa chốt kế hoạch ngày ${formdata.FROM_DATE}, vui lòng chọn ngày khác hoặc tra cứu sau 14h!`,
                "warning"
              );
            }
          })
          .catch((error) => {
            console.error(error);
            Swal.fire("Lỗi Kế Hoạch", "Không thể nạp kế hoạch MRP 15 Ngày", "error");
          });
      }
    },
    [company, formdata]
  );

  // 5. Cấu hình Cột Bảng AGTable động theo chế độ
  const columns = useMemo(() => {
    switch (currentMode) {
      case "DETAIL":
        return company === "CMS" ? buildMRPTableCMS() : buildMRPTablePVN();
      case "SUMMARY":
        return buildMRPTableSummary();
      case "PLAN":
        return buildMRPTablePlan();
      default:
        return buildMRPTableCMS();
    }
  }, [currentMode, company]);

  // 6. Lọc Dữ Liệu Tức Thời Theo Từ Khóa
  const filteredData = useMemo(() => {
    if (!searchKeyword.trim()) return currentTable;
    const kw = searchKeyword.toLowerCase().trim();
    return currentTable.filter(
      (item) =>
        item.M_NAME?.toLowerCase().includes(kw) ||
        item.M_CODE?.toLowerCase().includes(kw) ||
        item.CUST_NAME_KD?.toLowerCase().includes(kw) ||
        item.CUST_CD?.toLowerCase().includes(kw) ||
        item.PROD_REQUEST_NO?.toLowerCase().includes(kw) ||
        item.PO_NO?.toLowerCase().includes(kw) ||
        item.G_NAME_KD?.toLowerCase().includes(kw) ||
        item.G_CODE?.toLowerCase().includes(kw)
    );
  }, [currentTable, searchKeyword]);

  // Nạp dữ liệu ban đầu
  useEffect(() => {
    load_material_table("DETAIL");
  }, []);

  return (
    <div className="precision-tinhlieu">
      {/* 1. Sub-Header Phân Hệ & Telemetry */}
      <PrecisionTinhLieuHeader currentMode={currentMode} totalCount={currentTable.length} />

      {/* 2. Micro-cards KPI Realtime */}
      <PrecisionTinhLieuKpi data={filteredData} currentMode={currentMode} />

      {/* 3. Action & Filter Toolbar SaaS */}
      <PrecisionTinhLieuToolbar
        formData={formdata}
        onFormChange={setFormInfo}
        currentMode={currentMode}
        onLoadMRP={load_material_table}
        onLockMaterial={handleConfirmLockMaterial}
        onUnLockMaterial={handleConfirmUnLockMaterial}
        selectedYCSXCount={selectedYCSX.length}
        company={company}
        searchKeyword={searchKeyword}
        onSearchChange={setSearchKeyword}
        onExportEX1={() => SaveExcel(filteredData, `MRP_${currentMode}_DangLoc`)}
        onExportEX2={() => SaveExcel(currentTable, `MRP_${currentMode}_ToanBo`)}
        totalCount={currentTable.length}
        filteredCount={filteredData.length}
      />

      {/* 4. Khung Bảng AGTable Chiếm Trọn Chiều Cao (Full-Height) */}
      <div className="precision-tinhlieu__gridContainer">
        <div className="precision-tinhlieu__gridBody">
          <AGTable
            rowHeight={30}
            columns={columns}
            data={filteredData}
            suppressRowClickSelection={false}
            showFilter={true}
            onSelectionChange={(params: any) => {
              const rows = params?.api?.getSelectedRows() || [];
              ycsxdatatablefilter.current = rows;
              setSelectedYCSX(rows);
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default TINHLIEU;
