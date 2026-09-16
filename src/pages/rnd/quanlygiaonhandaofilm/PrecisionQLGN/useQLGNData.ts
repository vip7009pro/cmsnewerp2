import { useState, useEffect, useTransition, useMemo, useCallback, useRef } from "react";
import moment from "moment";
import Swal from "sweetalert2";
import { generalQuery, getAuditMode, getUserData } from "../../../../api/Api";
import { HANDOVER_DATA } from "../../interfaces/rndInterface";
import { CodeListData, CustomerListData } from "../../../kinhdoanh/interfaces/kdInterface";
import { SaveExcel } from "../../../../api/services/excelService";

export const useQLGNData = () => {
  const [customerList, setCustomerList] = useState<CustomerListData[]>([
    { CUST_CD: "6969", CUST_NAME_KD: "CMSV", CUST_NAME: "CMSV" },
  ]);
  const [selectedCust_CD, setSelectedCust_CD] = useState<CustomerListData | null>({
    CUST_CD: "6969",
    CUST_NAME_KD: "CMSV",
    CUST_NAME: "CMSV",
  });
  const [codeList, setCodeList] = useState<CodeListData[]>([]);
  const [selectedCode, setSelectedCode] = useState<CodeListData | null>({
    G_CODE: "6A00001B",
    G_NAME: "GT-I9500_SJ68-01284A",
    PROD_LAST_PRICE: 0,
    USE_YN: "N",
  });

  const [handoverdatatable, setHandoverDataTable] = useState<Array<HANDOVER_DATA>>([]);
  const [loading, setLoading] = useState(false);
  const [quickFilterText, setQuickFilterText] = useState("");
  const [showInputForm, setShowInputForm] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Form Fields
  const [fromdate, setFromDate] = useState(moment.utc().format("YYYY-MM-DD"));
  const [daofimltotalqty, setDaoFilmTotalQty] = useState(0);
  const [ohpfilmqty, setOHPFilmQTy] = useState(0);
  const [madaofilm, setMaDaoFilm] = useState("");
  const [vitritailieu, setViTriTaiLieu] = useState("");
  const [g_width, setG_Width] = useState(0);
  const [g_length, setG_Length] = useState(0);
  const [remark, setRemark] = useState("");
  const [plph, setPLPH] = useState("PH");
  const [pltl, setPLTL] = useState("D");
  const [pldao, setPLDao] = useState("PVC");
  const [plfilm, setPLFilm] = useState("CTF");
  const [ldph, setLDPH] = useState("New Code");
  const [rndEmpl, setRNDEMPL] = useState("");
  const [qcEmpl, setQCEMPL] = useState("");
  const [sxEmpl, setSXEMPL] = useState("");

  const [selectedRows, setSelectedRows] = useState<HANDOVER_DATA>({
    KNIFE_FILM_ID: "",
    FACTORY_NAME: "",
    NGAYBANGIAO: "",
    G_CODE: "",
    G_NAME: "",
    PROD_TYPE: "",
    CUST_NAME_KD: "",
    LOAIBANGIAO_PDP: "",
    LOAIPHATHANH: "",
    SOLUONG: 0,
    SOLUONGOHP: 0,
    LYDOBANGIAO: "",
    PQC_EMPL_NO: "",
    RND_EMPL_NO: "",
    SX_EMPL_NO: "",
    REMARK: "",
    CFM_GIAONHAN: "",
    CFM_INS_EMPL: "",
    CFM_DATE: "",
    KNIFE_FILM_STATUS: "",
    MA_DAO: "",
    TOTAL_PRESS: 0,
    CUST_CD: "",
    KNIFE_TYPE: "",
  });

  const gridRef = useRef<any>(null);
  const [, startTransition] = useTransition();

  const getcustomerlist = useCallback(() => {
    generalQuery("selectCustomerAndVendorList", {})
      .then((response: any) => {
        if (response.data.tk_status !== "NG") {
          setCustomerList(response.data.data);
        }
      })
      .catch((error: any) => console.log(error));
  }, []);

  const getcodelist = useCallback((G_NAME: string) => {
    generalQuery("selectcodeList", { G_NAME })
      .then((response: any) => {
        if (response.data.tk_status !== "NG") {
          startTransition(() => {
            setCodeList(response.data.data);
          });
        }
      })
      .catch((error: any) => console.log(error));
  }, []);

  const load_handoverdata_table = useCallback(() => {
    setLoading(true);
    generalQuery("loadquanlygiaonhan", {})
      .then((response: any) => {
        setLoading(false);
        if (response.data.tk_status !== "NG") {
          const loadeddata = response.data.data.map(
            (element: HANDOVER_DATA, index: number) => ({
              ...element,
              G_NAME: getAuditMode() === 0 ? element?.G_NAME : element?.G_NAME?.search("CNDB") === -1 ? element?.G_NAME : "TEM_NOI_BO",
              NGAYBANGIAO: moment.utc(element.NGAYBANGIAO).format("YYYY-MM-DD"),
              CFM_DATE: element.CFM_DATE === null ? "" : moment.utc(element.CFM_DATE).format("YYYY-MM-DD"),
              id: index,
            })
          );
          setHandoverDataTable(loadeddata);
          Swal.fire("Thông báo", "Đã load: " + response.data.data.length + " dòng", "success");
        } else {
          setHandoverDataTable([]);
          Swal.fire("Thông báo", "Nội dung: " + response.data.message, "error");
        }
      })
      .catch((error: any) => {
        setLoading(false);
        console.log(error);
      });
  }, []);

  const setBarCodeInfo = (keyname: string, value: any) => {
    setSelectedRows((prev: any) => ({ ...prev, [keyname]: value }));
  };

  const checkBanGiaoData = () => {
    if (rndEmpl.trim().length < 7 || qcEmpl.trim().length < 7) {
      return "NG: Mã nhân viên RND và QC phải từ 7 ký tự trở lên";
    }
    if (daofimltotalqty <= 0) {
      return "NG: Tổng số lượng dao/film/tài liệu phải lớn hơn 0";
    }
    return "";
  };

  const addBanGiao = () => {
    const err_code = checkBanGiaoData();
    if (err_code === "") {
      generalQuery("addbangiaodaofilmtailieu", {
        FACTORY: getUserData()?.FACTORY_CODE === 1 ? "NM1" : "NM2",
        NGAYBANGIAO: moment(fromdate).format("YYYY-MM-DD"),
        G_CODE: selectedCode?.G_CODE,
        LOAIBANGIAO_PDP: pltl,
        LOAIPHATHANH: plph,
        SOLUONG: daofimltotalqty,
        SOLUONGOHP: ohpfilmqty,
        LYDOBANGIAO: ldph,
        PQC_EMPL_NO: qcEmpl.trim(),
        RND_EMPL_NO: rndEmpl.trim(),
        SX_EMPL_NO: sxEmpl.trim(),
        REMARK: remark,
        MA_DAO: madaofilm,
        CUST_CD: selectedCust_CD?.CUST_CD,
        G_WIDTH: g_width,
        G_LENGTH: g_length,
        KNIFE_TYPE: pldao,
      })
        .then((response: any) => {
          if (response.data.tk_status !== "NG") {
            Swal.fire("Thông báo", "Thêm giao nhận thành công", "success");
            load_handoverdata_table();
          } else {
            Swal.fire("Thông báo", "Thất bại: " + response.data.message, "error");
          }
        })
        .catch((error: any) => console.log(error));
    } else {
      Swal.fire("Thông báo", err_code, "error");
    }
  };

  const confirmAddBanGiao = () => {
    Swal.fire({
      title: "Xác nhận Giao Nhận",
      text: "Bạn có chắc chắn muốn lưu thông tin bàn giao dao/film/tài liệu này?",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#2563eb",
      cancelButtonColor: "#dc2626",
      confirmButtonText: "Đồng Ý",
      cancelButtonText: "Hủy",
    }).then((result) => {
      if (result.isConfirmed) {
        addBanGiao();
      }
    });
  };

  const resetForm = () => {
    setDaoFilmTotalQty(0);
    setOHPFilmQTy(0);
    setMaDaoFilm("");
    setViTriTaiLieu("");
    setG_Width(0);
    setG_Length(0);
    setRemark("");
    setRNDEMPL("");
    setQCEMPL("");
    setSXEMPL("");
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
        setIsFullscreen(false);
      }
    }
  };

  // Quick filter on AG Grid
  useEffect(() => {
    if (gridRef.current?.api) {
      if (typeof gridRef.current.api.setGridOption === "function") {
        gridRef.current.api.setGridOption("quickFilterText", quickFilterText);
      } else if (typeof gridRef.current.api.setQuickFilter === "function") {
        gridRef.current.api.setQuickFilter(quickFilterText);
      }
    }
  }, [quickFilterText]);

  const exportExcelFiltered = () => {
    const api = gridRef.current?.api;
    if (!api) {
      SaveExcel(handoverdatatable, `QLGN_ALL_${moment().format("YYYYMMDD_HHmmss")}`);
      return;
    }
    const filteredData: any[] = [];
    api.forEachNodeAfterFilterAndSort((node: any) => {
      if (node.data) filteredData.push(node.data);
    });
    SaveExcel(filteredData.length > 0 ? filteredData : handoverdatatable, `QLGN_FILTERED_${moment().format("YYYYMMDD_HHmmss")}`);
  };

  const exportExcelAll = () => {
    SaveExcel(handoverdatatable, `QLGN_ALL_${moment().format("YYYYMMDD_HHmmss")}`);
  };

  // KPIs
  const kpis = useMemo(() => {
    const total = handoverdatatable.length;
    let phCount = 0;
    let thCount = 0;
    let pendingCfm = 0;
    for (let i = 0; i < total; i++) {
      const item = handoverdatatable[i];
      if (item.LOAIPHATHANH === "PH") phCount++;
      if (item.LOAIPHATHANH === "TH") thCount++;
      if (item.CFM_GIAONHAN !== "Y" && item.CFM_GIAONHAN !== "OK") pendingCfm++;
    }
    return {
      total,
      phCount,
      thCount,
      pendingCfm,
    };
  }, [handoverdatatable]);

  // Initial load - CHỈ CHẠY 1 LẦN KHI MOUNT
  useEffect(() => {
    getcodelist("");
    getcustomerlist();
    load_handoverdata_table();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    customerList,
    selectedCust_CD,
    setSelectedCust_CD,
    codeList,
    selectedCode,
    setSelectedCode,
    handoverdatatable,
    loading,
    quickFilterText,
    setQuickFilterText,
    showInputForm,
    setShowInputForm,
    isFullscreen,
    toggleFullscreen,
    fromdate,
    setFromDate,
    daofimltotalqty,
    setDaoFilmTotalQty,
    ohpfilmqty,
    setOHPFilmQTy,
    madaofilm,
    setMaDaoFilm,
    vitritailieu,
    setViTriTaiLieu,
    g_width,
    setG_Width,
    g_length,
    setG_Length,
    remark,
    setRemark,
    plph,
    setPLPH,
    pltl,
    setPLTL,
    pldao,
    setPLDao,
    plfilm,
    setPLFilm,
    ldph,
    setLDPH,
    rndEmpl,
    setRNDEMPL,
    qcEmpl,
    setQCEMPL,
    sxEmpl,
    setSXEMPL,
    selectedRows,
    setSelectedRows,
    setBarCodeInfo,
    gridRef,
    load_handoverdata_table,
    confirmAddBanGiao,
    resetForm,
    exportExcelFiltered,
    exportExcelAll,
    kpis,
  };
};
