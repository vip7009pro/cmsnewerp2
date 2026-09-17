import { useState, useCallback, useMemo, useEffect } from "react";
import moment from "moment";
import Swal from "sweetalert2";
import { SaveExcel } from "../../../../../api/services/excelService";
import { LICHSUINPUTLIEU_DATA } from "../../interfaces/khsxInterface";
import { f_lichsuinputlieu } from "../../utils/khsxUtils";

export const useLichSuInputLieuData = () => {
  const [fromDate, setFromDate] = useState<string>(moment().format("YYYY-MM-DD"));
  const [toDate, setToDate] = useState<string>(moment().format("YYYY-MM-DD"));
  const [allTime, setAllTime] = useState<boolean>(false);
  const [prodRequestNo, setProdRequestNo] = useState<string>("");
  const [planId, setPlanId] = useState<string>("");
  const [codeCMS, setCodeCMS] = useState<string>("");
  const [codeKD, setCodeKD] = useState<string>("");
  const [mName, setMName] = useState<string>("");
  const [mCode, setMCode] = useState<string>("");

  const [inspectiondatatable, setInspectionDataTable] = useState<LICHSUINPUTLIEU_DATA[]>([]);
  const [quickSearchText, setQuickSearchText] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // 1. Tải lịch sử cấp liệu từ API
  const handleLoadLichSu = useCallback(async () => {
    setIsLoading(true);
    try {
      const kq: LICHSUINPUTLIEU_DATA[] = await f_lichsuinputlieu({
        ALLTIME: allTime,
        FROM_DATE: fromDate,
        TO_DATE: toDate,
        PROD_REQUEST_NO: prodRequestNo,
        PLAN_ID: planId,
        M_NAME: mName,
        M_CODE: mCode,
        G_NAME: codeKD,
        G_CODE: codeCMS,
      });

      setInspectionDataTable(kq || []);

      if (kq && kq.length > 0) {
        Swal.fire("Thông báo", `Đã tải ${kq.length} dòng dữ liệu`, "success");
      } else {
        Swal.fire("Thông báo", "Không có dữ liệu phù hợp", "info");
      }
    } catch (error) {
      console.error("Lỗi khi tải lịch sử cấp liệu:", error);
      Swal.fire("Lỗi", "Không thể tải dữ liệu lịch sử cấp liệu", "error");
    } finally {
      setIsLoading(false);
    }
  }, [
    allTime,
    fromDate,
    toDate,
    prodRequestNo,
    planId,
    mName,
    mCode,
    codeKD,
    codeCMS,
  ]);

  // 2. Khôi phục bộ lọc mặc định
  const handleReset = useCallback(() => {
    setFromDate(moment().format("YYYY-MM-DD"));
    setToDate(moment().format("YYYY-MM-DD"));
    setAllTime(false);
    setProdRequestNo("");
    setPlanId("");
    setCodeCMS("");
    setCodeKD("");
    setMName("");
    setMCode("");
    setQuickSearchText("");
  }, []);

  // 3. Xuất Excel dữ liệu đang hiển thị hoặc toàn bộ kết quả
  const handleExportExcel = useCallback(
    (customData?: LICHSUINPUTLIEU_DATA[]) => {
      const exportList = customData || inspectiondatatable;
      if (!exportList || exportList.length === 0) {
        Swal.fire("Thông báo", "Không có dữ liệu để xuất Excel", "warning");
        return;
      }
      SaveExcel(exportList, `LichSuInputLieu_${fromDate}_${toDate}`);
    },
    [inspectiondatatable, fromDate, toDate]
  );

  // 4. Lọc dữ liệu tức thì theo Quick Search
  const filteredDataTable = useMemo(() => {
    if (!quickSearchText.trim()) return inspectiondatatable;
    const term = quickSearchText.toLowerCase();

    return inspectiondatatable.filter((item) => {
      return (
        item.PROD_REQUEST_NO?.toLowerCase().includes(term) ||
        item.PLAN_ID?.toLowerCase().includes(term) ||
        (item as any).G_CODE?.toLowerCase().includes(term) ||
        item.G_NAME_KD?.toLowerCase().includes(term) ||
        item.M_CODE?.toLowerCase().includes(term) ||
        item.M_NAME?.toLowerCase().includes(term) ||
        item.M_LOT_NO?.toLowerCase().includes(term) ||
        item.LOTNCC?.toLowerCase().includes(term) ||
        item.EQUIPMENT_CD?.toLowerCase().includes(term) ||
        item.EMPL_NO?.toLowerCase().includes(term)
      );
    });
  }, [inspectiondatatable, quickSearchText]);

  // Nạp dữ liệu lần đầu
  useEffect(() => {
    handleLoadLichSu();
  }, []);

  return {
    fromDate,
    toDate,
    allTime,
    prodRequestNo,
    planId,
    codeCMS,
    codeKD,
    mName,
    mCode,
    inspectiondatatable,
    filteredDataTable,
    quickSearchText,
    isLoading,
    setFromDate,
    setToDate,
    setAllTime,
    setProdRequestNo,
    setPlanId,
    setCodeCMS,
    setCodeKD,
    setMName,
    setMCode,
    setQuickSearchText,
    handleLoadLichSu,
    handleReset,
    handleExportExcel,
  };
};
