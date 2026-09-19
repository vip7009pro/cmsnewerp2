import { useCallback, useEffect, useRef, useState } from "react";
import Swal from "sweetalert2";
import { generalQuery, getCompany } from "../../../../api/Api";
import { CustomerListData, DEFAULT_DM } from "../../../kinhdoanh/interfaces/kdInterface";
import { FSC_LIST_DATA } from "../../../muahang/interfaces/muaInterface";
import { MaterialListData } from "../../../qc/interfaces/qcInterface";
import { MACHINE_LIST, PROD_PROCESS_DATA } from "../../../qlsx/QLSXPLAN/interfaces/khsxInterface";
import { f_getMachineListData, f_loadProdProcessData } from "../../../qlsx/QLSXPLAN/utils/khsxUtils";
import {
  BOM_GIA,
  BOM_SX,
  CODE_FULL_INFO,
  CODE_INFO,
  MASTER_MATERIAL_HSD,
} from "../../interfaces/rndInterface";

export const initialCodeFullInfo: CODE_FULL_INFO = {
  G_CODE: "",
  G_NAME: "",
  G_NAME_KD: "",
  PROD_PROJECT: "",
  PROD_MODEL: "",
  CODE_12: "7",
  PROD_TYPE: "TSP",
  DESCR: "",
  PROD_MAIN_MATERIAL: "",
  G_LENGTH: 0,
  G_WIDTH: 0,
  PD: 0,
  G_C: 1,
  G_C_R: 1,
  G_CG: 0,
  G_LG: 0,
  G_SG_L: 0,
  G_SG_R: 0,
  PACK_DRT: "1",
  KNIFE_TYPE: 0,
  KNIFE_LIFECYCLE: 70000,
  KNIFE_PRICE: 0,
  CODE_33: "03",
  PROD_DVT: "01",
  ROLE_EA_QTY: 0,
  RPM: 0,
  PIN_DISTANCE: 0,
  PROCESS_TYPE: "1",
  EQ1: "NA",
  EQ2: "NA",
  EQ3: "NA",
  EQ4: "NA",
  PROD_DIECUT_STEP: 1,
  PROD_PRINT_TIMES: 0,
  PO_TYPE: "E1",
  FSC: "N",
  FSC_CODE: "01",
  APPROVED_YN: "N",
  USE_YN: "Y",
  CUST_CD: "0000",
  REV_NO: "A",
  INS_EMPL: "",
  INS_DATE: "",
  UPD_EMPL: "",
  UPD_DATE: "",
};

export const useBOMManagerData = () => {
  const [codeCMS, setCodeCMS] = useState("");
  const [cndb, setCNDB] = useState(false);
  const [activeOnly, setActiveOnly] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [isCodeDetailLoading, setIsCodeDetailLoading] = useState(false);
  const codeDetailRequestRef = useRef(0);

  const [codeInfoDataTable, setCodeInfoDataTable] = useState<CODE_INFO[]>([]);
  const [codefullinfo, setCodeFullInfo] = useState<CODE_FULL_INFO>(initialCodeFullInfo);
  const [bomsxtable, setBOMSXTable] = useState<BOM_SX[]>([]);
  const [bomgiatable, setBOMGIATable] = useState<BOM_GIA[]>([]);

  const [customerList, setCustomerList] = useState<CustomerListData[]>([]);
  const [machineList, setMachineList] = useState<MACHINE_LIST[]>([]);
  const [materialList, setMaterialList] = useState<MaterialListData[]>([]);
  const [masterMaterialList, setMasterMaterialList] = useState<MASTER_MATERIAL_HSD[]>([]);
  const [selectedMaterial, setSelectedMaterial] = useState<MaterialListData | null>(null);
  const [selectedMasterMaterial, setSelectedMasterMaterial] = useState<any>(null);
  const [currentProcessList, setCurrentProcessList] = useState<PROD_PROCESS_DATA[]>([]);
  const [tempSelectedMachine, setTempSelectedMachine] = useState<string>("NA");
  const tempSelectedProcess = useRef<any>(null);

  const [fscList, setFSCList] = useState<FSC_LIST_DATA[]>([]);
  const [defaultDM, setDefaultDM] = useState<DEFAULT_DM>({
    id: 0,
    WIDTH_OFFSET: 0,
    LENGTH_OFFSET: 0,
    KNIFE_UNIT: 0,
    FILM_UNIT: 0,
    INK_UNIT: 0,
    LABOR_UNIT: 0,
    DELIVERY_UNIT: 0,
    DEPRECATION_UNIT: 0,
    GMANAGEMENT_UNIT: 0,
    M_LOSS_UNIT: 0,
  });

  const [enableEdit, setEnableEdit] = useState(false);
  const [pinBOM, setPinBOM] = useState(false);
  const bomsxSelectedRows = useRef<any[]>([]);
  const bomgiaSelectedRows = useRef<any[]>([]);

  const handleSetCodeInfo = (field: string, val: any) => {
    setCodeFullInfo((prev) => ({ ...prev, [field]: val }));
  };

  const handleClearInfo = () => {
    setCodeFullInfo({
      ...initialCodeFullInfo,
      PROD_TYPE: getCompany() === "CMS" ? "TSP" : "LABEL",
    });
    setBOMSXTable([]);
    setBOMGIATable([]);
    setCurrentProcessList([]);
    Swal.fire("Thông báo", "Đã làm sạch form nhập liệu", "success");
  };

  const handleGETBOMSX = useCallback(async (G_CODE: string) => {
    try {
      const res = await generalQuery("getbomsx", { G_CODE });
      if (res.data.tk_status !== "NG") {
        const data = res.data.data.map((item: any, index: number) => ({
          ...item,
          id: String(index),
        }));
        setBOMSXTable(data);
      } else {
        setBOMSXTable([]);
      }
    } catch (err) {
      console.error(err);
    }
  }, []);

  const handleGETBOMGIA = useCallback(async (G_CODE: string) => {
    try {
      const res = await generalQuery("getbomgia", { G_CODE });
      if (res.data.tk_status !== "NG") {
        const data = res.data.data.map((item: any, index: number) => ({
          ...item,
          id: String(index),
        }));
        setBOMGIATable(data);
      } else {
        setBOMGIATable([]);
      }
    } catch (err) {
      console.error(err);
    }
  }, []);

  const loadProcessList = useCallback(async (G_CODE: string) => {
    if (!G_CODE || G_CODE === "-------") {
      setCurrentProcessList([]);
      return;
    }
    try {
      const loadeddata = await f_loadProdProcessData(G_CODE);
      setCurrentProcessList(loadeddata || []);
    } catch (err) {
      console.error(err);
      setCurrentProcessList([]);
    }
  }, []);

  const handlecodefullinfo = useCallback(async (G_CODE: string) => {
    try {
      const res = await generalQuery("getcodefullinfo", { G_CODE });
      if (res.data.tk_status !== "NG" && res.data.data.length > 0) {
        const row = res.data.data[0];
        setCodeFullInfo(row);
        setSelectedMasterMaterial({
          M_NAME: row?.PROD_MAIN_MATERIAL ?? "",
          EXP_DATE: row?.EXP_DATE ?? 0,
        });
      }
    } catch (err) {
      console.error(err);
    }
  }, []);

  const handleSelectCode = useCallback((g_code: string) => {
    const requestId = ++codeDetailRequestRef.current;
    setIsCodeDetailLoading(false);

    const detailRequests = [handlecodefullinfo(g_code), loadProcessList(g_code)];
    if (!pinBOM) {
      detailRequests.push(handleGETBOMSX(g_code), handleGETBOMGIA(g_code));
    }

    Promise.all(detailRequests).finally(() => {
      if (requestId === codeDetailRequestRef.current) {
        setIsCodeDetailLoading(false);
      }
    });
  }, [handleGETBOMGIA, handleGETBOMSX, handlecodefullinfo, loadProcessList, pinBOM]);

  const handleCODEINFO = async () => {
    setIsLoading(true);
    try {
      const res = await generalQuery("codeinforRnD", {
        G_NAME: codeCMS,
        CNDB: cndb,
        ACTIVE_ONLY: activeOnly,
      });
      if (res.data.tk_status !== "NG") {
        const loadedData = res.data.data.map((item: any, index: number) => ({
          ...item,
          id: index,
        }));
        setCodeInfoDataTable(loadedData);
        if (loadedData.length > 0 && !codefullinfo.G_CODE) {
          handleSelectCode(loadedData[0].G_CODE);
        }
      } else {
        setCodeInfoDataTable([]);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const loadInitialData = async () => {
    try {
      const [cusRes, matRes, machData, dmRes, fscRes, masterRes] = await Promise.all([
        generalQuery("selectcustomerList", {}),
        generalQuery("getMaterialList", {}),
        f_getMachineListData(),
        generalQuery("loadDefaultDM", {}),
        generalQuery("loadFSC_CODE", {}),
        generalQuery("getMasterMaterialList", {}),
      ]);

      if (cusRes?.data?.tk_status !== "NG") setCustomerList(cusRes.data.data);
      if (matRes?.data?.tk_status !== "NG") {
        setMaterialList(matRes.data.data);
        if (matRes.data.data.length > 0) {
          setSelectedMaterial(matRes.data.data[0]);
        }
      }
      if (machData) {
        setMachineList(machData);
        if (machData.length > 0) {
          setTempSelectedMachine(machData[0].EQ_NAME);
        }
      }
      if (dmRes?.data?.tk_status !== "NG") setDefaultDM(dmRes.data.data[0]);
      if (fscRes?.data?.tk_status !== "NG") setFSCList(fscRes.data.data);
      if (masterRes?.data?.tk_status !== "NG") setMasterMaterialList(masterRes.data.data);
    } catch (err) {
      console.error("Lỗi khi tải dữ liệu khởi tạo:", err);
    }
  };

  useEffect(() => {
    loadInitialData();
    handleCODEINFO();
  }, []);

  return {
    codeCMS,
    setCodeCMS,
    cndb,
    setCNDB,
    activeOnly,
    setActiveOnly,
    isLoading,
    isCodeDetailLoading,
    codeInfoDataTable,
    codefullinfo,
    setCodeFullInfo,
    bomsxtable,
    setBOMSXTable,
    bomgiatable,
    setBOMGIATable,
    customerList,
    machineList,
    materialList,
    masterMaterialList,
    selectedMaterial,
    setSelectedMaterial,
    selectedMasterMaterial,
    setSelectedMasterMaterial,
    currentProcessList,
    setCurrentProcessList,
    tempSelectedMachine,
    setTempSelectedMachine,
    tempSelectedProcess,
    loadProcessList,
    fscList,
    defaultDM,
    enableEdit,
    setEnableEdit,
    pinBOM,
    setPinBOM,
    bomsxSelectedRows,
    bomgiaSelectedRows,
    handleSetCodeInfo,
    handleClearInfo,
    handleCODEINFO,
    handleGETBOMSX,
    handleGETBOMGIA,
    handlecodefullinfo,
    handleSelectCode,
  };
};
