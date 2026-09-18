import { useState, useRef, useCallback, useEffect } from "react";
import Swal from "sweetalert2";
import { useSelector } from "react-redux";
import { RootState } from "../../../../redux/store";
import { UserData } from "../../../../api/GlobalInterface";
import { generalQuery, uploadQuery } from "../../../../api/Api";

export const useDataSampleSxData = () => {
  const userData: UserData | undefined = useSelector(
    (state: RootState) => state.totalSlice.userData
  );

  const [planId, setPlanId] = useState<string>("");
  const [gName, setGName] = useState<string>("");
  const [gCode, setGCode] = useState<string>("");
  const [lineqcEmpl, setLineqcEmpl] = useState<string>(userData?.EMPL_NO ?? "");
  const [emplName, setEmplName] = useState<string>("");

  const [file1, setFile1] = useState<File | null>(null);
  const [file2, setFile2] = useState<File | null>(null);
  const [preview1, setPreview1] = useState<string | null>(null);
  const [preview2, setPreview2] = useState<string | null>(null);

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [showScanner, setShowScanner] = useState<boolean>(false);

  // References cho việc điều hướng Enter
  const planInputRef = useRef<HTMLInputElement | null>(null);
  const emplInputRef = useRef<HTMLInputElement | null>(null);

  // Tra cứu thông tin số chỉ thị
  const checkPlanID = useCallback(async (id: string) => {
    if (!id || id.trim().length < 6) return;
    try {
      const response = await generalQuery("checkPLAN_ID", { PLAN_ID: id.trim() });
      if (response.data.tk_status !== "NG" && response.data.data?.length > 0) {
        setGName(response.data.data[0].G_NAME || "");
        setGCode(response.data.data[0].G_CODE || "");
      } else {
        setGName("");
        setGCode("");
      }
    } catch (error) {
      console.error("Lỗi khi kiểm tra chỉ thị:", error);
      setGName("");
      setGCode("");
    }
  }, []);

  // Tra cứu thông tin tên nhân viên
  const checkEmplName = useCallback(async (emplNo: string) => {
    if (!emplNo || emplNo.trim().length < 5) return;
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
      console.error("Lỗi khi kiểm tra nhân viên:", error);
      setEmplName("");
    }
  }, []);

  // Tự động load tên nhân viên hiện tại nếu có mã
  useEffect(() => {
    if (userData?.EMPL_NO) {
      checkEmplName(userData.EMPL_NO);
    }
  }, [userData?.EMPL_NO, checkEmplName]);

  // Xử lý khi chọn file 1 (Bản vẽ sample)
  const handleFile1Change = useCallback((f: File | null) => {
    setFile1(f);
    if (f) {
      const url = URL.createObjectURL(f);
      setPreview1(url);
    } else {
      setPreview1(null);
    }
  }, []);

  // Xử lý khi chọn file 2 (Checksheet ĐK SX)
  const handleFile2Change = useCallback((f: File | null) => {
    setFile2(f);
    if (f) {
      const url = URL.createObjectURL(f);
      setPreview2(url);
    } else {
      setPreview2(null);
    }
  }, []);

  // Cập nhật cờ bản vẽ sample
  const updateBanVeSampleData = async (SX_SP_ID: number) => {
    try {
      await generalQuery("updatebanvesampledata", {
        SX_SP_ID: SX_SP_ID,
        BANVE: "Y",
        BANVE_EXT: "jpg",
      });
    } catch (error) {
      console.error("Lỗi cập nhật cờ bản vẽ:", error);
    }
  };

  // Cập nhật cờ checksheet điều kiện SX
  const updateAnhDKSXSampleData = async (SX_SP_ID: number) => {
    try {
      await generalQuery("updateAnhDKSXSampleData", {
        SX_SP_ID: SX_SP_ID,
        DKSX: "Y",
        DKSX_EXT: "jpg",
      });
    } catch (error) {
      console.error("Lỗi cập nhật cờ checksheet:", error);
    }
  };

  // Upload file 1
  const uploadFile1 = async (SX_SP_ID: number, targetPlanId: string) => {
    if (!file1) return;
    try {
      const res = await uploadQuery(
        file1,
        `${SX_SP_ID}_${targetPlanId}PIC1.jpg`,
        "SX_QL_SAMPLE"
      );
      if (res.data.tk_status !== "NG") {
        await updateBanVeSampleData(SX_SP_ID);
      }
    } catch (error) {
      console.error("Lỗi upload ảnh 1:", error);
    }
  };

  // Upload file 2
  const uploadFile2 = async (SX_SP_ID: number, targetPlanId: string) => {
    if (!file2) return;
    try {
      const res = await uploadQuery(
        file2,
        `${SX_SP_ID}_${targetPlanId}PIC2.jpg`,
        "SX_QL_SAMPLE"
      );
      if (res.data.tk_status !== "NG") {
        await updateAnhDKSXSampleData(SX_SP_ID);
      }
    } catch (error) {
      console.error("Lỗi upload ảnh 2:", error);
    }
  };

  // Kiểm tra đầu vào trước khi submit
  const validateInput = (): boolean => {
    if (!planId || planId.trim() === "") {
      Swal.fire("Cảnh báo", "Vui lòng nhập hoặc quét Số Chỉ Thị (PLAN_ID)", "warning");
      planInputRef.current?.focus();
      return false;
    }
    if (!gName) {
      Swal.fire("Cảnh báo", "Số chỉ thị không hợp lệ hoặc chưa có thông tin sản phẩm", "warning");
      planInputRef.current?.focus();
      return false;
    }
    if (!lineqcEmpl || lineqcEmpl.trim() === "") {
      Swal.fire("Cảnh báo", "Vui lòng nhập Mã nhân viên thực hiện", "warning");
      emplInputRef.current?.focus();
      return false;
    }
    if (!file1 && !file2) {
      Swal.fire("Cảnh báo", "Vui lòng chọn ít nhất 1 ảnh (Bản vẽ sample hoặc Checksheet ĐK SX)", "warning");
      return false;
    }
    return true;
  };

  // Reset form sau khi gửi thành công
  const resetForm = useCallback(() => {
    setPlanId("");
    setGName("");
    setGCode("");
    setFile1(null);
    setFile2(null);
    setPreview1(null);
    setPreview2(null);
  }, []);

  // Đăng ký dữ liệu sample và upload hình ảnh
  const submitDataSampleSX = async () => {
    if (!validateInput()) return;

    setIsSubmitting(true);
    const targetPlan = planId.trim().toUpperCase();

    try {
      const response = await generalQuery("insert_sampledatasx", {
        G_CODE: gCode,
        PLAN_ID: targetPlan,
        G_NAME_HT: gName,
        BANVE: "N",
        DKSX: "N",
      });

      if (response.data.tk_status !== "NG" && response.data.data?.length > 0) {
        const sxSpId = response.data.data[0].SX_SP_ID;
        // Tiến hành upload 2 file song song
        await Promise.all([
          uploadFile1(sxSpId, targetPlan),
          uploadFile2(sxSpId, targetPlan),
        ]);

        Swal.fire({
          title: "Thành công!",
          text: `Đã lưu thông tin mẫu và tải ảnh cho chỉ thị ${targetPlan}`,
          icon: "success",
          timer: 2000,
          showConfirmButton: false,
        });

        resetForm();
        planInputRef.current?.focus();
      } else {
        Swal.fire("Lỗi", `Đăng ký thất bại: ${response.data.message || ""}`, "error");
      }
    } catch (error: any) {
      console.error("Lỗi khi lưu dữ liệu sample:", error);
      Swal.fire("Lỗi", "Không thể gửi dữ liệu lên máy chủ", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Quét QR Code thành công
  const handleScanSuccess = useCallback((code: string) => {
    const cleanCode = code.trim().toUpperCase();
    setPlanId(cleanCode);
    checkPlanID(cleanCode);
  }, [checkPlanID]);

  return {
    planId,
    setPlanId,
    gName,
    gCode,
    lineqcEmpl,
    setLineqcEmpl,
    emplName,
    file1,
    file2,
    preview1,
    preview2,
    isSubmitting,
    showScanner,
    setShowScanner,
    userData,
    planInputRef,
    emplInputRef,
    checkPlanID,
    checkEmplName,
    handleFile1Change,
    handleFile2Change,
    submitDataSampleSX,
    handleScanSuccess,
    resetForm,
  };
};
