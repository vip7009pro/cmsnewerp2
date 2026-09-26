import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import moment from "moment";
import Swal from "sweetalert2";
import { createPivotDataSource } from "../../../../../components/PivotChart/lazyPivot";
import {
  DAILY_YCSX_RESULT,
  LICHSUINPUTLIEU_DATA,
  LICHSUNHAPKHOAO,
  LOSS_TABLE_DATA,
  MACHINE_LIST,
  SX_DATA,
  YCSX_SX_DATA,
} from "../../interfaces/khsxInterface";
import {
  f_getMachineListData,
  f_lichsuinputlieu,
  f_load_nhapkhoao,
  f_loadDataSX_YCSX,
  f_loadDataSXChiThi,
  f_YCSXDailyChiThiData,
} from "../../utils/khsxUtils";
import { f_update_btp_p400, f_update_tonkiem_p400 } from "../../../../../api/services/inventoryService";
import { fields_datasx_chithi, fields_datasx_ycsx } from "./PrecisionDataSxPivotFields";

export const initialLossTable: LOSS_TABLE_DATA = {
  XUATKHO_MET: 0,
  XUATKHO_EA: 0,
  SCANNED_MET: 0,
  SCANNED_EA: 0,
  PROCESS1_RESULT: 0,
  PROCESS2_RESULT: 0,
  PROCESS3_RESULT: 0,
  PROCESS4_RESULT: 0,
  SX_RESULT: 0,
  INSPECTION_INPUT: 0,
  INSPECT_LOSS_QTY: 0,
  INSPECT_MATERIAL_NG: 0,
  INSPECT_OK_QTY: 0,
  INSPECT_PROCESS_NG: 0,
  INSPECT_TOTAL_NG: 0,
  INSPECT_TOTAL_QTY: 0,
  LOSS_THEM_TUI: 0,
  SX_MARKING_QTY: 0,
  INSPECTION_OUTPUT: 0,
  LOSS_INS_OUT_VS_SCANNED_EA: 0,
  LOSS_INS_OUT_VS_XUATKHO_EA: 0,
  NG1: 0,
  NG2: 0,
  NG3: 0,
  NG4: 0,
  SETTING1: 0,
  SETTING2: 0,
  SETTING3: 0,
  SETTING4: 0,
  SCANNED_EA2: 0,
  SCANNED_EA3: 0,
  SCANNED_EA4: 0,
  SCANNED_MET2: 0,
  SCANNED_MET3: 0,
  SCANNED_MET4: 0,
};

export const initialYcsxDetail: YCSX_SX_DATA = {
  YCSX_PENDING: "",
  PHAN_LOAI: "",
  PROD_REQUEST_NO: "",
  G_NAME: "",
  G_NAME_KD: "",
  FACTORY: "",
  EQ1: "",
  EQ2: "",
  EQ3: "",
  EQ4: "",
  PROD_REQUEST_DATE: "",
  PROD_REQUEST_QTY: 0,
  M_NAME: "",
  M_OUTPUT: 0,
  NOT_SCANNED_QTY: 0,
  SCANNED_QTY: 0,
  REMAIN_QTY: 0,
  USED_QTY: 0,
  PD: 0,
  CAVITY: 0,
  WAREHOUSE_ESTIMATED_QTY: 0,
  ESTIMATED_QTY: 0,
  CD1: 0,
  CD2: 0,
  CD3: 0,
  CD4: 0,
  ST1: 0,
  ST2: 0,
  ST3: 0,
  ST4: 0,
  NG1: 0,
  NG2: 0,
  NG3: 0,
  NG4: 0,
  INS_INPUT: 0,
  INSPECT_TOTAL_QTY: 0,
  INSPECT_OK_QTY: 0,
  INSPECT_LOSS_QTY: 0,
  INSPECT_TOTAL_NG: 0,
  INSPECT_MATERIAL_NG: 0,
  INSPECT_PROCESS_NG: 0,
  INS_OUTPUT: 0,
  IQC_IN: 0,
  RETURN_IQC: 0,
  LOSS_SX1: 0,
  LOSS_SX2: 0,
  LOSS_SX3: 0,
  LOSS_SX4: 0,
  LOSS_INSPECT: 0,
  TOTAL_LOSS: 0,
  TOTAL_LOSS2: 0,
  LOSS_THEM_TUI: 0,
  SX_MARKING_QTY: 0,
  NEXT_IN_QTY: 0,
  NOT_BEEP_QTY: 0,
  LOCK_QTY: 0,
  BEEP_QTY: 0,
  TON_KHO_AO: 0,
  NEXT_OUT_QTY: 0,
  RETURN_QTY: 0,
  Setting1: 0,
  Setting2: 0,
  Setting3: 0,
  Setting4: 0,
  UPH1: 0,
  UPH2: 0,
  UPH3: 0,
  UPH4: 0,
  Step1: 0,
  Step2: 0,
  Step3: 0,
  Step4: 0,
  LOSS_SETTING1: 0,
  LOSS_SETTING2: 0,
  LOSS_SETTING3: 0,
  LOSS_SETTING4: 0,
  LOSS_KT: 0,
  LOSS_OVER: "OK",
  LOSS_LT: 0,
};

export const initialDailyYcsxSummary: DAILY_YCSX_RESULT = {
  PLAN_DATE: "",
  TARGET1: 0,
  INPUT1: 0,
  RESULT1: 0,
  LOSS1: 0,
  TARGET2: 0,
  INPUT2: 0,
  RESULT2: 0,
  LOSS2: 0,
  TARGET3: 0,
  INPUT3: 0,
  RESULT3: 0,
  LOSS3: 0,
  TARGET4: 0,
  INPUT4: 0,
  RESULT4: 0,
  LOSS4: 0,
  INSP_QTY: 0,
  INSP_LOSS: 0,
  INSP_NG: 0,
  INSP_OK: 0,
  LOSS_KT: 0,
};

export const useDataSxData = () => {
  const { register, handleSubmit, watch, formState: { errors }, reset, setValue } = useForm({
    defaultValues: {
      fromdate: moment().format("YYYY-MM-DD"),
      todate: moment().format("YYYY-MM-DD"),
      prodrequestno: "",
      plan_id: "",
      m_name: "",
      m_code: "",
      codeKD: "",
      codeCMS: "",
      factory: "ALL",
      machine: "ALL",
      truSample: true,
      onlyClose: false,
      fullSummary: false,
      alltime: false,
    },
  });

  const [machine_list, setMachine_List] = useState<MACHINE_LIST[]>([]);
  const [showhidePivotTable, setShowHidePivotTable] = useState(false);
  const [showhideDailyYCSX, setShowHideDailyYCSX] = useState(false);
  const [inputlieudatatable, setInputLieuDataTable] = useState<LICHSUINPUTLIEU_DATA[]>([]);
  const [khoaodata, setKhoAoData] = useState<LICHSUNHAPKHOAO[]>([]);
  const [losstableinfo, setLossTableInfo] = useState<LOSS_TABLE_DATA>(initialLossTable);
  const [selectbutton, setSelectButton] = useState(true); // true = Chỉ thị, false = YCSX
  const [datasxtable, setDataSXTable] = useState<Array<any>>([]);
  const [dailyycsx, setDailyYCSX] = useState<DAILY_YCSX_RESULT[]>([]);
  const [totalDailyYCSX, setTotalDailyYCSX] = useState<DAILY_YCSX_RESULT>(initialDailyYcsxSummary);
  const [loading, setLoading] = useState(false);

  const selectedYCSX = useRef<YCSX_SX_DATA>(initialYcsxDetail);

  // ⚠️ DevExtreme chỉ được nạp khi user mở pivot (xem components/PivotChart/lazyPivot.ts):
  // `pivotConfig` chỉ là object cấu hình, DataSource thật được dựng khi bấm PIVOT.
  const [selectedDataSource, setSelectedDataSource] = useState<any>(null);
  const [pivotConfig, setPivotConfig] = useState<any>({
    fields: fields_datasx_chithi,
    store: [],
  });
  useEffect(() => {
    if (!showhidePivotTable) return; // chưa mở pivot -> không tải DevExtreme
    let cancelled = false;
    void (async () => {
      const ds = await createPivotDataSource(pivotConfig);
      if (!cancelled) setSelectedDataSource(ds);
    })();
    return () => {
      cancelled = true;
    };
  }, [showhidePivotTable, pivotConfig]);

  const getMachineList = useCallback(async () => {
    try {
      const list = await f_getMachineListData();
      setMachine_List(list || []);
      setValue("machine", "ALL");
    } catch (err) {
      console.error("Error fetching machine list:", err);
    }
  }, [setValue]);

  const load_nhapkhoao = useCallback(async (M_LOT_NO: string) => {
    try {
      const data = await f_load_nhapkhoao({
        FROM_DATE: "2022-01-01",
        TO_DATE: moment().format("YYYY-MM-DD"),
        FACTORY: "ALL",
        M_LOT_NO: M_LOT_NO,
      });
      setKhoAoData(data || []);
    } catch (err) {
      console.error("Error loading kho ao:", err);
    }
  }, []);

  const handle_loadlichsuinputlieu = useCallback(async (PLAN_ID: string) => {
    try {
      const data = await f_lichsuinputlieu({
        ALLTIME: true,
        FROM_DATE: watch("fromdate"),
        TO_DATE: watch("todate"),
        PROD_REQUEST_NO: "",
        PLAN_ID: PLAN_ID,
        M_NAME: "",
        M_CODE: "",
        G_NAME: "",
        G_CODE: "",
      });
      setInputLieuDataTable(data || []);
    } catch (err) {
      console.error("Error loading lich su input lieu:", err);
    }
  }, [watch]);

  const handle_loaddatasx = useCallback(async () => {
    setLoading(true);
    Swal.fire({
      title: "Tra data chỉ thị",
      text: "Đang tải dữ liệu, hãy chờ chút",
      icon: "info",
      showCancelButton: false,
      allowOutsideClick: false,
      confirmButtonText: "OK",
      showConfirmButton: false,
    });

    try {
      const kq = await f_loadDataSXChiThi({
        ALLTIME: watch("alltime"),
        FROM_DATE: watch("fromdate"),
        TO_DATE: watch("todate"),
        PROD_REQUEST_NO: watch("prodrequestno"),
        PLAN_ID: watch("plan_id"),
        M_NAME: watch("m_name"),
        M_CODE: watch("m_code"),
        G_NAME: watch("codeKD"),
        G_CODE: watch("codeCMS"),
        FACTORY: watch("factory"),
        PLAN_EQ: watch("machine"),
        TRUSAMPLE: watch("truSample"),
      });

      setLossTableInfo(kq?.summary || initialLossTable);
      setDataSXTable(kq?.datasx || []);
      // Chỉ lưu cấu hình — DevExtreme được dựng khi user mở pivot (xem lazyPivot.ts).
      setPivotConfig({
        fields: fields_datasx_chithi,
        store: kq?.datasx || [],
      });
      setSelectButton(true);

      if (kq?.datasx && kq.datasx.length > 0) {
        Swal.fire("Thông báo", "Đã tải: " + kq.datasx.length + " dòng", "success");
      } else {
        Swal.fire("Thông báo", "Không có dữ liệu phù hợp", "info");
      }
    } catch (err) {
      console.error("Error loading data sx chi thi:", err);
      Swal.fire("Lỗi", "Không thể tải dữ liệu", "error");
    } finally {
      setLoading(false);
    }
  }, [watch]);

  const handle_loaddatasxYCSX = useCallback(async () => {
    setLoading(true);
    Swal.fire({
      title: "Tra data theo YCSX",
      text: "Đang tải dữ liệu, hãy chờ chút",
      icon: "info",
      showCancelButton: false,
      allowOutsideClick: false,
      confirmButtonText: "OK",
      showConfirmButton: false,
    });

    try {
      await f_update_btp_p400();
      await f_update_tonkiem_p400();

      const kq = await f_loadDataSX_YCSX({
        ALLTIME: watch("alltime"),
        FROM_DATE: watch("fromdate"),
        TO_DATE: watch("todate"),
        PROD_REQUEST_NO: watch("prodrequestno"),
        PLAN_ID: watch("plan_id"),
        M_NAME: watch("m_name"),
        M_CODE: watch("m_code"),
        G_NAME: watch("codeKD"),
        G_CODE: watch("codeCMS"),
        FACTORY: watch("factory"),
        PLAN_EQ: watch("machine"),
        TRUSAMPLE: watch("truSample"),
        ONLYCLOSE: watch("onlyClose"),
      });

      setLossTableInfo(kq?.summary || initialLossTable);
      setDataSXTable(kq?.datasx || []);
      // Chỉ lưu cấu hình — DevExtreme được dựng khi user mở pivot (xem lazyPivot.ts).
      setPivotConfig({
        fields: fields_datasx_ycsx,
        store: kq?.datasx || [],
      });
      setSelectButton(false);

      if (kq?.datasx && kq.datasx.length > 0) {
        Swal.fire("Thông báo", "Đã tải: " + kq.datasx.length + " dòng", "success");
      } else {
        Swal.fire("Thông báo", "Không có dữ liệu phù hợp", "info");
      }
    } catch (err) {
      console.error("Error loading data sx YCSX:", err);
      Swal.fire("Lỗi", "Không thể tải dữ liệu YCSX", "error");
    } finally {
      setLoading(false);
    }
  }, [watch]);

  const handle_loaddailyYCSX = useCallback(async (PROD_REQUEST_NO: string) => {
    try {
      const kq = await f_YCSXDailyChiThiData(PROD_REQUEST_NO);
      setTotalDailyYCSX(kq?.summary || initialDailyYcsxSummary);
      setDailyYCSX(kq?.datasx || []);
    } catch (err) {
      console.error("Error loading daily YCSX:", err);
    }
  }, []);

  const handleRowClickChiThi = useCallback(
    (e: any) => {
      if (e?.data?.PLAN_ID !== undefined) {
        handle_loadlichsuinputlieu(e.data.PLAN_ID);
      }
    },
    [handle_loadlichsuinputlieu]
  );

  const handleRowClickXuatLieu = useCallback(
    (e: any) => {
      if (e?.data?.M_LOT_NO) {
        load_nhapkhoao(e.data.M_LOT_NO);
      }
    },
    [load_nhapkhoao]
  );

  const handleRowClickYcsx = useCallback(
    (e: any) => {
      if (e?.data) {
        selectedYCSX.current = e.data;
        if (e.data.PROD_REQUEST_NO) {
          handle_loaddailyYCSX(e.data.PROD_REQUEST_NO);
        }
      }
    },
    [handle_loaddailyYCSX]
  );

  useEffect(() => {
    getMachineList();
  }, [getMachineList]);

  return {
    register,
    watch,
    loading,
    machine_list,
    showhidePivotTable,
    setShowHidePivotTable,
    showhideDailyYCSX,
    setShowHideDailyYCSX,
    inputlieudatatable,
    khoaodata,
    losstableinfo,
    selectbutton,
    datasxtable,
    dailyycsx,
    totalDailyYCSX,
    selectedYCSX,
    selectedDataSource,
    setValue,
    reset,
    handle_loaddatasx,
    handle_loaddatasxYCSX,
    handleRowClickChiThi,
    handleRowClickXuatLieu,
    handleRowClickYcsx,
  };
};
