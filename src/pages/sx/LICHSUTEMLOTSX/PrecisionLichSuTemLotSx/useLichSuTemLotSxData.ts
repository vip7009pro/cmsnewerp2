import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import moment from "moment";
import { useReactToPrint } from "react-to-print";
import Swal from "sweetalert2";
import { getUserData } from "../../../../api/Api";
import { SaveExcel } from "../../../../api/services/excelService";
import { TEMLOTSX_DATA } from "../../../qlsx/QLSXPLAN/interfaces/khsxInterface";
import { f_cancelProductionLot, f_LichSuTemLot } from "../../../qlsx/QLSXPLAN/utils/khsxUtils";
import { COMPONENT_DATA } from "../../../rnd/interfaces/rndInterface";
import { f_handleGETBOMAMAZON } from "../../../rnd/utils/rndUtils";
import { TemLotFilterData } from "./PrecisionLichSuTemLotSxToolbar";
import { ViewMode } from "./PrecisionLichSuTemLotSxHeader";
import { DEFAULT_COMPONENT_LIST } from "./temLotConstants";

export const useLichSuTemLotSxData = () => {
  const [lichsutemlotdata, setlichsutemlotdata] = useState<TEMLOTSX_DATA[]>([]);
  const [filterData, setFilterData] = useState<TemLotFilterData>({
    FROM_DATE: moment().format("YYYY-MM-DD"),
    TO_DATE: moment().format("YYYY-MM-DD"),
    PROCESS_LOT_NO: "",
    CUST_NAME_KD: "",
    G_CODE: "",
    G_NAME: "",
    PROD_REQUEST_NO: "",
  });

  const [selectedRow, setSelectedRow] = useState<TEMLOTSX_DATA | null>(null);
  const selectedRowRef = useRef<TEMLOTSX_DATA | null>(null);

  const [componentList, setComponentList] = useState<COMPONENT_DATA[]>(DEFAULT_COMPONENT_LIST);
  const [showhideTemLot, setShowHideTemLot] = useState<boolean>(false);
  const [searchKeyword, setSearchKeyword] = useState<string>("");
  const [viewMode, setViewMode] = useState<ViewMode>("ALL");
  const [isChartCollapsed, setIsChartCollapsed] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const labelprintref = useRef<HTMLDivElement>(null);

  const handlePrint = useReactToPrint({
    content: () => labelprintref.current,
  });

  // Tải danh mục đối tượng thiết kế tem mẫu Amazon
  const loadLabelDesign = useCallback(async () => {
    try {
      const design = await f_handleGETBOMAMAZON("6E00002A");
      if (design && design.length > 0) {
        setComponentList(design);
      }
    } catch (error) {
      console.error("Lỗi nạp thiết kế tem mẫu:", error);
    }
  }, []);

  useEffect(() => {
    loadLabelDesign();
  }, [loadLabelDesign]);

  // Cập nhật bộ lọc
  const setFilterFormInfo = useCallback((keyname: keyof TemLotFilterData, value: string) => {
    setFilterData((prev) => ({
      ...prev,
      [keyname]: value,
    }));
  }, []);

  // Tra cứu dữ liệu
  const load_lichsutemlot_data = useCallback(async () => {
    setIsLoading(true);
    try {
      const kq = await f_LichSuTemLot(filterData);
      setlichsutemlotdata(kq || []);
    } catch (error) {
      console.error("Lỗi tải lịch sử tem lot:", error);
    } finally {
      setIsLoading(false);
    }
  }, [filterData]);

  // Ánh xạ dữ liệu dòng được chọn vào componentList để preview và in
  const mapRowToComponentList = useCallback((rowData: TEMLOTSX_DATA) => {
    setComponentList((prevList) =>
      prevList.map((e: COMPONENT_DATA) => {
        let value: string = e.GIATRI;
        if (e.DOITUONG_NAME === "G_NAME") {
          value = rowData.G_NAME?.substring(0, 34) ?? "";
        } else if (e.DOITUONG_NAME === "LOTSX_BARCODE") {
          value = rowData.PROCESS_LOT_NO ?? "";
        } else if (e.DOITUONG_NAME === "LOTSX_TEXT") {
          value = rowData.PROCESS_LOT_NO ?? "";
        } else if (e.DOITUONG_NAME === "LOT_QTY") {
          value =
            (rowData.TEMP_QTY?.toLocaleString("en-US") ?? "") +
            "(" +
            (rowData.TEMP_MET?.toLocaleString("en-US", { maximumFractionDigits: 2 }) ?? "") +
            "m)";
        } else if (e.DOITUONG_NAME === "LOT_NVL") {
          value = "Lot NVL: " + (rowData.M_LOT_NO ?? "");
        } else if (e.DOITUONG_NAME === "SETTING") {
          value =
            "SET " +
            (rowData.SETTING_MET?.toString() ?? "") +
            "m | NG CĐ " +
            (rowData.PR_NG?.toString() ?? "") +
            "m";
        } else if (e.DOITUONG_NAME === "NM_CD_CT") {
          value =
            (rowData.FACTORY ?? "") +
            "/" +
            (rowData.EQUIPMENT_CD ?? "") +
            "/CĐ:" +
            (rowData.PR_NB ?? "") +
            "/" +
            (rowData.PLAN_ID ?? "");
        } else if (e.DOITUONG_NAME === "PLAN_QTY") {
          value = "SL Chỉ thị: " + (rowData.PLAN_QTY?.toLocaleString("en-US") ?? "") + "EA";
        } else if (e.DOITUONG_NAME === "NVL") {
          value = "NVL: " + (rowData.M_NAME ?? "") + "| " + (rowData.WIDTH_CD ?? "") + " mm";
        } else if (e.DOITUONG_NAME === "NHANVIEN") {
          value = "NV: " + (rowData.INS_EMPL ?? "") + "_Time: " + (rowData.INS_DATE ?? "");
        } else if (e.DOITUONG_NAME === "LOTSX_BARCODE2") {
          value = rowData.PROCESS_LOT_NO ?? "";
        }
        return {
          ...e,
          GIATRI: value,
        };
      })
    );
  }, []);

  // Xử lý khi user chọn một dòng
  const handleSelectRow = useCallback(
    (rowData: TEMLOTSX_DATA) => {
      setSelectedRow(rowData);
      selectedRowRef.current = rowData;
      mapRowToComponentList(rowData);
    },
    [mapRowToComponentList]
  );

  // Mở modal Preview tem lót
  const handleOpenPreview = useCallback(
    (row?: TEMLOTSX_DATA) => {
      const targetRow = row || selectedRowRef.current || selectedRow;
      if (!targetRow) {
        Swal.fire("Thông báo", "Vui lòng chọn một dòng tem trong bảng để xem trước và in", "info");
        return;
      }
      handleSelectRow(targetRow);
      setShowHideTemLot(true);
    },
    [handleSelectRow, selectedRow]
  );

  // Hủy LOT sản xuất
  const handleCancelLot = useCallback(async () => {
    const row = selectedRowRef.current || selectedRow;
    if (!row || !row.PROCESS_LOT_NO) {
      Swal.fire("Thông báo", "Vui lòng chọn dòng LOT cần hủy", "warning");
      return;
    }

    if (getUserData()?.EMPL_NO !== "NHU1903") {
      Swal.fire("Thông báo", "Bạn không có quyền hủy lot", "error");
      return;
    }

    if (row.LOT_STATUS !== null && row.LOT_STATUS !== undefined && row.LOT_STATUS !== "") {
      Swal.fire("Thông báo", "Lot đã chuyển công đoạn, không hủy được", "error");
      return;
    }

    Swal.fire({
      title: "Hủy LOT Sản Xuất",
      text: `Chắc chắn muốn Hủy LOT: ${row.PROCESS_LOT_NO}?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Vẫn hủy!",
      cancelButtonText: "Hủy bỏ",
    }).then(async (result) => {
      if (result.isConfirmed) {
        await f_cancelProductionLot({
          PROCESS_LOT_NO: row.PROCESS_LOT_NO,
        });
        Swal.fire("Thông báo", "Hủy LOT thành công", "success");
        load_lichsutemlot_data();
      }
    });
  }, [load_lichsutemlot_data, selectedRow]);

  // Lọc dữ liệu theo Quick Search (convert sang String để tránh lỗi khi field là number)
  const filteredData = useMemo(() => {
    if (!searchKeyword.trim()) return lichsutemlotdata;
    const kw = searchKeyword.trim().toLowerCase();
    const safeIncludes = (val: any): boolean => {
      if (val == null) return false;
      return String(val).toLowerCase().includes(kw);
    };
    return lichsutemlotdata.filter((item) => {
      return (
        safeIncludes(item.PROCESS_LOT_NO) ||
        safeIncludes(item.G_CODE) ||
        safeIncludes(item.G_NAME) ||
        safeIncludes(item.M_LOT_NO) ||
        safeIncludes(item.LOTNCC) ||
        safeIncludes(item.PROD_REQUEST_NO) ||
        safeIncludes(item.M_NAME) ||
        safeIncludes(item.EMPL_NAME) ||
        safeIncludes(item.PLAN_ID) ||
        safeIncludes(item.EQUIPMENT_CD) ||
        safeIncludes(item.FACTORY)
      );
    });
  }, [lichsutemlotdata, searchKeyword]);

  // Xuất file Excel (EX1: Đang lọc, EX2: Toàn bộ)
  const handleExportExcel = useCallback(
    (type: "EX1" | "EX2") => {
      const exportList = type === "EX1" ? filteredData : lichsutemlotdata;
      if (exportList.length === 0) {
        Swal.fire("Thông báo", "Không có dữ liệu để xuất Excel", "warning");
        return;
      }

      const formatted = exportList.map((row) => ({
        INS_DATE: row.INS_DATE,
        G_CODE: row.G_CODE,
        G_NAME: row.G_NAME,
        DESCR: (row as any).DESCR ?? "",
        M_LOT_NO: row.M_LOT_NO,
        LOTNCC: row.LOTNCC,
        YCSX: row.PROD_REQUEST_NO,
        YCSX_QTY: row.PLAN_QTY ?? 0,
        PROCESS_LOT_NO: row.PROCESS_LOT_NO,
        M_NAME: row.M_NAME,
        WIDTH_CD: row.WIDTH_CD,
        EMPL_NAME: row.EMPL_NAME,
        PLAN_ID: row.PLAN_ID,
        TEMP_QTY: row.TEMP_QTY ?? 0,
        TEMP_MET: row.TEMP_MET ?? 0,
        PROCESS_NUMBER: row.PROCESS_NUMBER ?? "",
        LOT_STATUS: row.LOT_STATUS ?? "Chờ chuyển CĐ",
        EQUIPMENT_CD: row.EQUIPMENT_CD ?? "",
        FACTORY: row.FACTORY ?? "",
        SETTING_MET: row.SETTING_MET ?? 0,
        PR_NG: row.PR_NG ?? 0,
      }));

      const filename = `LICHSU_TEMLOT_${type === "EX1" ? "DANGLOC" : "TOANBO"}_${moment().format("YYYYMMDD_HHmmss")}`;
      SaveExcel(formatted, filename);
    },
    [filteredData, lichsutemlotdata]
  );

  return {
    lichsutemlotdata,
    filteredData,
    filterData,
    selectedRow,
    componentList,
    showhideTemLot,
    searchKeyword,
    viewMode,
    isChartCollapsed,
    isLoading,
    labelprintref,
    setShowHideTemLot,
    setSearchKeyword,
    setViewMode,
    setIsChartCollapsed,
    setFilterFormInfo,
    load_lichsutemlot_data,
    handleSelectRow,
    handleOpenPreview,
    handlePrint,
    handleCancelLot,
    handleExportExcel,
  };
};

export default useLichSuTemLotSxData;
