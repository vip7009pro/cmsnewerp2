import { useState, useRef, useCallback, useEffect } from "react";
import moment from "moment";
import Swal from "sweetalert2";
import { useSelector } from "react-redux";
import { RootState } from "../../../../redux/store";
import { UserData } from "../../../../api/GlobalInterface";
import { generalQuery, uploadQuery } from "../../../../api/Api";
import { SX_DATA } from "../../../qlsx/QLSXPLAN/interfaces/khsxInterface";

export const useLineQcData = () => {
  const userData: UserData | undefined = useSelector(
    (state: RootState) => state.totalSlice.userData
  );

  const [factory, setFactory] = useState<string>(
    userData?.FACTORY_CODE === 1 ? "NM1" : "NM2"
  );
  const [planId, setPlanId] = useState<string>("");
  const [gName, setGName] = useState<string>("");
  const [gCode, setGCode] = useState<string>("");
  const [prodRequestNo, setProdRequestNo] = useState<string>("");
  const [prodReqDate, setProdReqDate] = useState<string>("");
  const [processLotNo, setProcessLotNo] = useState<string>("");
  const [inputNo, setInputNo] = useState<string>("");
  const [mName, setMName] = useState<string>("");
  const [mCode, setMCode] = useState<string>("");
  const [widthCd, setWidthCd] = useState<number>(0);
  const [inCfmQty, setInCfmQty] = useState<number>(0);
  const [rollQty, setRollQty] = useState<number>(0);
  const [lieuQlSx, setLieuQlSx] = useState<any>(0);
  const [outDate, setOutDate] = useState<string>("");
  const [ktdtc, setKtdtc] = useState<string>("CKT");
  const [sxData, setSxData] = useState<SX_DATA[]>([]);

  const [lineqcEmpl, setLineqcEmpl] = useState<string>(userData?.EMPL_NO ?? "");
  const [emplName, setEmplName] = useState<string>("");
  const [remark, setRemark] = useState<string>("");

  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isLoadingPlan, setIsLoadingPlan] = useState<boolean>(false);
  const [showScanner, setShowScanner] = useState<boolean>(false);

  const planInputRef = useRef<HTMLInputElement | null>(null);
  const emplInputRef = useRef<HTMLInputElement | null>(null);

  // 1. Kiểm tra trạng thái DTC
  const checkKTDTC = useCallback(async (lotNo: string) => {
    if (!lotNo) {
      setKtdtc("CKT");
      return;
    }
    try {
      const res = await generalQuery("checkktdtc", { PROCESS_LOT_NO: lotNo });
      if (res.data.tk_status !== "NG" && res.data.data?.length > 0) {
        setKtdtc(res.data.data[0].TRANGTHAI !== null ? "DKT" : "CKT");
      } else {
        setKtdtc("CKT");
      }
    } catch (error) {
      console.error("Lỗi kiểm tra DTC:", error);
      setKtdtc("CKT");
    }
  }, []);

  // 2. Tra cứu thông tin Lot NVL
  const checkLotNVL = useCallback(async (lot: string) => {
    if (!lot) {
      setMName("");
      setMCode("");
      setWidthCd(0);
      setRollQty(0);
      setInCfmQty(0);
      setLieuQlSx(0);
      setOutDate("");
      return;
    }
    try {
      const res = await generalQuery("checkMNAMEfromLotLineQC", { M_LOT_NO: lot });
      if (res.data.tk_status !== "NG" && res.data.data?.length > 0) {
        const item = res.data.data[0];
        setMName(`${item.M_NAME || ""}`);
        setMCode(item.M_CODE || "");
        setWidthCd(item.WIDTH_CD || 0);
        setInCfmQty(item.IN_CFM_QTY || 0);
        setRollQty(item.ROLL_QTY || 0);
        setLieuQlSx(item.LIEUQL_SX === null ? "0" : item.LIEUQL_SX);
        setOutDate(item.OUT_DATE || "");
      } else {
        setMName("");
        setMCode("");
        setWidthCd(0);
        setRollQty(0);
        setInCfmQty(0);
        setLieuQlSx(0);
        setOutDate("");
      }
    } catch (error) {
      console.error("Lỗi tra cứu Lot NVL:", error);
    }
  }, []);

  // 3. Tra cứu thông tin Plan ID P501
  const checkPlanIDP501 = useCallback(async (sxArr: SX_DATA[]) => {
    if (!sxArr || sxArr.length === 0) return;
    const targetPlan = sxArr[0].PLAN_ID;
    try {
      const res = await generalQuery("checkPlanIdP501", { PLAN_ID: targetPlan });
      if (res.data.tk_status !== "NG" && res.data.data?.length > 0) {
        const row = res.data.data[0];
        setInputNo(row.M_LOT_NO || "");
        await checkLotNVL(row.M_LOT_NO || "");
        setProcessLotNo(row.PROCESS_LOT_NO || "");
        //await checkKTDTC(row.PROCESS_LOT_NO || "");
      } else {
        if (sxArr[0].PROCESS_NUMBER === 0) {
          setInputNo("");
          setProcessLotNo("");
          setKtdtc("CKT");
        } else {
          const res2 = await generalQuery("checkProcessLotNo_Prod_Req_No", {
            PROD_REQUEST_NO: sxArr[0].PROD_REQUEST_NO,
          });
          if (res2.data.tk_status !== "NG" && res2.data.data?.length > 0) {
            const row2 = res2.data.data[0];
            setInputNo(row2.M_LOT_NO || "");
            await checkLotNVL(row2.M_LOT_NO || "");
            setProcessLotNo(row2.PROCESS_LOT_NO || "");
            //await checkKTDTC(row2.PROCESS_LOT_NO || "");
          } else {
            setInputNo("");
            setProcessLotNo("");
            setKtdtc("CKT");
          }
        }
      }
    } catch (error) {
      console.error("Lỗi checkPlanIDP501:", error);
    }
  }, [checkLotNVL, checkKTDTC]);

  // 4. Tra cứu thông tin sản xuất Data SX
  const checkDataSX = useCallback(async (id: string) => {
    if (!id || id.trim().length < 8) return;
    try {
      const response = await generalQuery("loaddatasxlineqc", {
        ALLTIME: true,
        FROM_DATE: "",
        TO_DATE: "",
        PROD_REQUEST_NO: "",
        PLAN_ID: id.trim(),
        M_NAME: "",
        M_CODE: "",
        G_NAME: "",
        G_CODE: "",
        FACTORY: "ALL",
        PLAN_EQ: "ALL",
      });
      if (response.data.tk_status !== "NG" && response.data.data?.length > 0) {
        const loaded: SX_DATA[] = response.data.data.map((ele: SX_DATA, idx: number) => ({
          ...ele,
          PLAN_DATE: moment.utc(ele.PLAN_DATE).format("YYYY-MM-DD"),
          SETTING_START_TIME: ele.SETTING_START_TIME ? moment.utc(ele.SETTING_START_TIME).format("YYYY-MM-DD HH:mm:ss") : "",
          MASS_START_TIME: ele.MASS_START_TIME ? moment.utc(ele.MASS_START_TIME).format("YYYY-MM-DD HH:mm:ss") : "",
          MASS_END_TIME: ele.MASS_END_TIME ? moment.utc(ele.MASS_END_TIME).format("YYYY-MM-DD HH:mm:ss") : "",
          SX_DATE: ele.SX_DATE ? moment.utc(ele.SX_DATE).format("YYYY-MM-DD") : "",
          id: idx,
        }));
        setSxData(loaded);
        await checkPlanIDP501(loaded);
      } else {
        setSxData([]);
      }
    } catch (error) {
      console.error("Lỗi checkDataSX:", error);
      setSxData([]);
    }
  }, [checkPlanIDP501]);

  // 5. Tra cứu thông tin chỉ thị cơ bản
  const checkPlanID = useCallback(async (id: string) => {
    if (!id || id.trim().length < 8) return;
    try {
      const response = await generalQuery("checkPlanIdLineQC", { PLAN_ID: id.trim() });
      if (response.data.tk_status !== "NG" && response.data.data?.length > 0) {
        const row = response.data.data[0];
        setGName(row.G_NAME || "");
        setProdRequestNo(row.PROD_REQUEST_NO || "");
        setProdReqDate(row.PROD_REQUEST_DATE || "");
        setGCode(row.G_CODE || "");
      } else {
        setGName("");
        setProdRequestNo("");
        setProdReqDate("");
        setGCode("");
      }
    } catch (error) {
      console.error("Lỗi checkPlanID:", error);
      setGName("");
      setGCode("");
    }
  }, []);

  // 6. Tra cứu tên nhân viên
  const checkEmplName = useCallback(async (emplNo: string) => {
    if (!emplNo || emplNo.trim().length < 5) {
      setEmplName("");
      return;
    }
    try {
      const response = await generalQuery("checkEMPL_NO_mobile", { EMPL_NO: emplNo.trim() });
      if (response.data.tk_status !== "NG" && response.data.data?.length > 0) {
        setEmplName(
          `${response.data.data[0].MIDLAST_NAME || ""} ${response.data.data[0].FIRST_NAME || ""}`.trim()
        );
      } else {
        setEmplName("");
      }
    } catch (error) {
      console.error("Lỗi checkEmplName:", error);
      setEmplName("");
    }
  }, []);

  // Tra cứu toàn diện thông tin chỉ thị kèm Loading Indicator phủ màn hình
  const loadFullPlanData = useCallback(async (targetPlan: string) => {
    setIsLoadingPlan(true);
    try {
      await Promise.all([
        checkPlanID(targetPlan),
        checkDataSX(targetPlan)
      ]);
    } catch (err) {
      console.error("Lỗi khi tải thông tin chỉ thị:", err);
    } finally {
      setIsLoadingPlan(false);
    }
  }, [checkPlanID, checkDataSX]);

  // Tự động xử lý khi người dùng nhập số chỉ thị PLAN_ID
  const handlePlanIdChange = useCallback((value: string) => {
    const val = value.toUpperCase();
    setPlanId(val);
    if (val.length >= 8) {
      loadFullPlanData(val);
    } else {
      setGName("");
      setGCode("");
      setProdRequestNo("");
      setProdReqDate("");
      setSxData([]);
      setInputNo("");
      setProcessLotNo("");
      setMName("");
      setMCode("");
      setWidthCd(0);
      setInCfmQty(0);
      setKtdtc("CKT");
    }
  }, [loadFullPlanData]);

  // Tự động xử lý khi người dùng nhập mã nhân viên Line QC
  const handleLineqcEmplChange = useCallback((value: string) => {
    const val = value.toUpperCase();
    setLineqcEmpl(val);
    if (val.length >= 7) {
      checkEmplName(val);
    } else {
      setEmplName("");
    }
  }, [checkEmplName]);

  // Tự động load tên nhân viên hiện tại
  useEffect(() => {
    if (userData?.EMPL_NO) {
      checkEmplName(userData.EMPL_NO);
    }
  }, [userData?.EMPL_NO, checkEmplName]);

  // 7. Quản lý file checksheet & Live preview
  const handleFileChange = useCallback((f: File | null) => {
    setFile(f);
    if (f) {
      const url = URL.createObjectURL(f);
      setPreview(url);
    } else {
      setPreview(null);
    }
  }, []);

  // 8. Tra cứu STT ảnh checksheet hiện tại (1, 2, 3, 4)
  const checkPlanIdChecksheet = async (id: string): Promise<number> => {
    let stt = 1;
    try {
      const response = await generalQuery("checkPlanIdChecksheet", { PLAN_ID: id });
      if (response.data.tk_status !== "NG" && response.data.data?.length > 0) {
        const row = response.data.data[0];
        if (row.IMG_3 === "Y") stt = 4;
        else if (row.IMG_2 === "Y") stt = 3;
        else if (row.IMG_1 === "Y") stt = 2;
        else stt = 1;
      }
    } catch (error) {
      console.error("Lỗi checkPlanIdChecksheet:", error);
    }
    return stt;
  };

  // 9. Upload file checksheet
  const uploadFileChecksheet = async (targetPlan: string, stt: number) => {
    if (!file) return;
    try {
      const res = await uploadQuery(file, `${targetPlan}_${stt}.jpg`, "lineqc");
      if (res.data.tk_status === "NG") {
        Swal.fire("Cảnh báo", `Upload file thất bại: ${res.data.message || ""}`, "error");
      }
    } catch (error) {
      console.error("Lỗi uploadFileChecksheet:", error);
    }
  };

  // 10. Cập nhật trạng thái ảnh checksheet
  const updateIMGPQC1 = async (targetPlan: string) => {
    const stt = await checkPlanIdChecksheet(targetPlan);
    if (stt < 4) {
      try {
        const response = await generalQuery("update_checksheet_image_status", {
          PLAN_ID: targetPlan.toUpperCase(),
          STT: stt,
        });
        if (response.data.tk_status !== "NG") {
          await uploadFileChecksheet(targetPlan.toUpperCase(), stt);
          Swal.fire({
            title: "Thành công!",
            text: `Đã lưu dữ liệu và tải ảnh checksheet (Lần ${stt}) cho chỉ thị ${targetPlan}`,
            icon: "success",
            timer: 2000,
            showConfirmButton: false,
          });
          resetForm();
          planInputRef.current?.focus();
        } else {
          Swal.fire("Lỗi", `Có lỗi khi cập nhật: ${response.data.message || ""}`, "error");
        }
      } catch (error) {
        console.error("Lỗi updateIMGPQC1:", error);
      }
    } else {
      Swal.fire("Cảnh báo", "Chỉ thị này đã upload đủ 3 lần checksheet (Đầu, Giữa, Cuối)", "warning");
    }
  };

  // 11. Kiểm tra đầu vào form
  const validateInput = (): boolean => {
    if (!planId || planId.trim() === "") {
      Swal.fire("Cảnh báo", "Vui lòng nhập hoặc quét Số Chỉ Thị (PLAN_ID)", "warning");
      planInputRef.current?.focus();
      return false;
    }
    if (!lineqcEmpl || lineqcEmpl.trim() === "") {
      Swal.fire("Cảnh báo", "Vui lòng nhập Mã nhân viên Line QC", "warning");
      emplInputRef.current?.focus();
      return false;
    }
    if (!sxData || sxData.length === 0) {
      Swal.fire("Cảnh báo", "Chưa tải được dữ liệu kế hoạch sản xuất của chỉ thị này", "warning");
      planInputRef.current?.focus();
      return false;
    }
    if (!sxData[0].MASS_START_TIME) {
      Swal.fire("Cảnh báo", "Chỉ thị này chưa được bắn Setting/Bắt đầu dập Mass!", "warning");
      return false;
    }
    if (!file) {
      Swal.fire("Cảnh báo", "Vui lòng chụp hoặc chọn ảnh checksheet Line QC", "warning");
      return false;
    }
    return true;
  };

  // Reset form
  const resetForm = useCallback(() => {
    setPlanId("");
    setGName("");
    setGCode("");
    setProdRequestNo("");
    setProcessLotNo("");
    setInputNo("");
    setMName("");
    setMCode("");
    setWidthCd(0);
    setRollQty(0);
    setInCfmQty(0);
    setLieuQlSx(0);
    setOutDate("");
    setSxData([]);
    setRemark("");
    setFile(null);
    setPreview(null);
    setIsLoadingPlan(false);
  }, []);

  // 12. Gửi dữ liệu PQC1
  const submitLineQcData = async () => {
    if (!validateInput()) return;

    setIsSubmitting(true);
    const targetPlan = planId.trim().toUpperCase();

    try {
      const checkplid = await checkPlanIdChecksheet(targetPlan);
      if (!sxData[0].EQ_NAME_TT) {
        Swal.fire("Thông báo", "Chỉ thị đã được bắn setting hay chưa? (Thiếu mã máy thực tế)", "warning");
        setIsSubmitting(false);
        return;
      }

      if (checkplid === 1) {
        const response = await generalQuery("insert_pqc1", {
          PROCESS_LOT_NO: processLotNo ? processLotNo.toUpperCase() : "",
          LINEQC_PIC: lineqcEmpl ? lineqcEmpl.toUpperCase() : "",
          PROD_PIC: sxData[0].INS_EMPL ? sxData[0].INS_EMPL.toUpperCase() : "",
          PROD_LEADER: "",
          STEPS: sxData[0].STEP,
          CAVITY: sxData[0].CAVITY,
          SETTING_OK_TIME: sxData[0].MASS_START_TIME,
          FACTORY: sxData[0].PLAN_FACTORY,
          REMARK: ktdtc,
          PROD_REQUEST_NO: sxData[0].PROD_REQUEST_NO ? sxData[0].PROD_REQUEST_NO.toUpperCase() : "",
          G_CODE: sxData[0].G_CODE,
          PLAN_ID: sxData[0].PLAN_ID ? sxData[0].PLAN_ID.toUpperCase() : "",
          PROCESS_NUMBER: sxData[0].PROCESS_NUMBER,
          LINE_NO: sxData[0].EQ_NAME_TT,
          REMARK2: remark,
        });

        if (response.data.tk_status !== "NG") {
          await updateIMGPQC1(targetPlan);
        } else {
          await updateIMGPQC1(targetPlan);
          console.error("Lỗi insert_pqc1:", response.data.message);
        }
      } else {
        await updateIMGPQC1(targetPlan);
      }
    } catch (error) {
      console.error("Lỗi khi gửi dữ liệu Line QC:", error);
      Swal.fire("Lỗi", "Không thể kết nối đến máy chủ", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Quét QR thành công
  const handleScanSuccess = useCallback((code: string) => {
    const cleanCode = code.trim().toUpperCase();
    handlePlanIdChange(cleanCode);
  }, [handlePlanIdChange]);

  return {
    factory,
    setFactory,
    planId,
    setPlanId,
    handlePlanIdChange,
    handleLineqcEmplChange,
    gName,
    gCode,
    prodRequestNo,
    prodReqDate,
    processLotNo,
    inputNo,
    mName,
    mCode,
    widthCd,
    inCfmQty,
    rollQty,
    lieuQlSx,
    outDate,
    ktdtc,
    sxData,
    lineqcEmpl,
    setLineqcEmpl,
    emplName,
    remark,
    setRemark,
    file,
    preview,
    isSubmitting,
    isLoadingPlan,
    showScanner,
    setShowScanner,
    userData,
    planInputRef,
    emplInputRef,
    checkPlanID,
    checkDataSX,
    checkEmplName,
    handleFileChange,
    submitLineQcData,
    handleScanSuccess,
    resetForm,
  };
};
