// XUATLIEU.tsx - Master Controller Xuất Liệu (Google Stitch High-Density Enterprise)

import React, { useEffect, useRef, useState, useMemo, useCallback } from "react";
import moment from "moment";
import Swal from "sweetalert2";
import { createFilterOptions } from "@mui/material";
import { FiCheckCircle } from "react-icons/fi";
import { generalQuery, getCompany, getUserData } from "../../../../api/Api";
import { checkBP } from "../../../../api/services/permissionService";
import { f_updateStockM090 } from "../../../../api/services/inventoryService";
import { CustomerListData } from "../../../kinhdoanh/interfaces/kdInterface";
import { f_insertO302, f_updateO301_OUT_CFM_QTY } from "../../../qlsx/QLSXPLAN/utils/khsxUtils";
import { WH_M_OUTPUT_DATA } from "../../interfaces/khoInterface";
import { DKXL_DATA } from "../../../qlsx/QLSXPLAN/interfaces/khsxInterface";
import XuatLieuScannerPanel from "./XuatLieuScannerPanel";
import XuatLieuTables from "./XuatLieuTables";
import "./XUATLIEU.scss";

const XUATLIEU: React.FC = () => {
  // Employee states
  const [giao_empl, setGiao_Empl] = useState("");
  const [nhan_empl, setNhan_Empl] = useState("");
  const [giao_empl_name, setGiao_Empl_Name] = useState("");
  const [nhan_empl_name, setNhan_Empl_Name] = useState("");

  // Plan states
  const [planId, setPlanId] = useState("");
  const [fsc_GCODE, setFSC_GCODE] = useState("01");
  const [g_name, setGName] = useState("");
  const [FSC_M100, setFSC_M100] = useState("N");
  const [solanout, setSoLanOut] = useState(1);

  // Material & Barcode states
  const [m_lot_no, setM_LOT_NO] = useState("");
  const [m_name, setM_Name] = useState("");

  // Tables state
  const [dangkyxuatlieutable, setDangKyXuatLieuTable] = useState<DKXL_DATA[]>([]);
  const [prepareOutData, setPrepareOutData] = useState<WH_M_OUTPUT_DATA[]>([]);
  const selectedData = useRef<Array<WH_M_OUTPUT_DATA>>([]);
  const [selectedCount, setSelectedCount] = useState(0);

  // Common controls
  const [selectedFactory, setSelectedFactory] = useState("NM1");
  const [fromdate, setFromDate] = useState(moment().format("YYYY-MM-DD"));
  const [customerList, setCustomerList] = useState<CustomerListData[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<CustomerListData | null>({
    CUST_CD: getCompany() === "CMS" ? "6969" : "KH000",
    CUST_NAME: getCompany() === "CMS" ? "CMSVINA" : "PVN",
    CUST_NAME_KD: getCompany() === "CMS" ? "CMSVINA" : "PVN",
  });

  const filterOptions = useMemo(
    () =>
      createFilterOptions({
        matchFrom: "any",
        limit: 100,
      }),
    []
  );

  // Load Vendor/Customer List
  useEffect(() => {
    generalQuery("selectCustomerAndVendorList", {})
      .then((response) => {
        if (response.data.tk_status !== "NG") {
          setCustomerList(response.data.data);
        }
      })
      .catch((error) => console.log(error));
  }, []);

  // Check Employee Name
  const checkEMPL_NAME = useCallback((selection: number, EMPL_NO: string) => {
    generalQuery("checkEMPL_NO_mobile", { EMPL_NO: EMPL_NO.trim() })
      .then((response) => {
        if (response.data.tk_status !== "NG") {
          const fullName = `${response.data.data[0].MIDLAST_NAME} ${response.data.data[0].FIRST_NAME}`;
          if (selection === 1) {
            setGiao_Empl_Name(fullName);
          } else {
            setNhan_Empl_Name(fullName);
          }
        } else {
          if (selection === 1) setGiao_Empl_Name("");
          else setNhan_Empl_Name("");
        }
      })
      .catch((error) => console.log(error));
  }, []);

  // Load Bảng Đăng Ký Xuất Liệu (DKXL)
  const loadDKXLTB = useCallback(async (targetPlanId: string) => {
    await generalQuery("checkPLANID_O301", { PLAN_ID: targetPlanId })
      .then((response) => {
        if (response.data.tk_status !== "NG") {
          setDangKyXuatLieuTable(response.data.data);
        } else {
          setDangKyXuatLieuTable([]);
        }
      })
      .catch((error) => console.log(error));
  }, []);

  // Check số lần xuất
  const checkSoLanOutO302 = useCallback(async (targetPlanId: string) => {
    await generalQuery("checksolanout_O302", { PLAN_ID: targetPlanId })
      .then((response) => {
        if (response.data.tk_status !== "NG") {
          const current_solanout: number =
            response.data.data[0].SOLANOUT !== "" && response.data.data[0].SOLANOUT !== null
              ? parseInt(response.data.data[0].SOLANOUT)
              : 0;
          setSoLanOut(current_solanout + 1);
        } else {
          setSoLanOut(1);
        }
      })
      .catch((error) => console.log(error));
  }, []);

  // Check PLAN_ID
  const checkPlanID = useCallback(
    (targetPlanId: string) => {
      generalQuery("checkPLAN_ID", { PLAN_ID: targetPlanId.trim() })
        .then((response) => {
          if (response.data.tk_status !== "NG") {
            setPlanId(targetPlanId.trim());
            setGName(response.data.data[0].G_NAME);
            setFSC_GCODE(response.data.data[0].FSC_CODE ?? "01");
            setFSC_M100(response.data.data[0].FSC ?? "N");
          } else {
            setGName("");
            setFSC_GCODE("01");
            setFSC_M100("N");
          }
        })
        .catch((error) => console.log(error));
    },
    []
  );

  // Bắn Barcode M_LOT_NO
  const checkLotNVL = useCallback(
    async (scannedLot: string, targetPlanId: string) => {
      await generalQuery("checkMNAMEfromLotI222XuatKho", {
        M_LOT_NO: scannedLot.trim(),
        PLAN_ID: targetPlanId.trim(),
      })
        .then((response) => {
          if (response.data.tk_status !== "NG") {
            const firstRow = response.data.data[0];
            setM_Name(`${firstRow.M_NAME} | ${firstRow.WIDTH_CD}`);
            const IN_DATE: string = firstRow.IN_DATE;
            const USE_YN: string = firstRow.USE_YN;
            const M_CODE: string = firstRow.M_CODE;
            const M_NAME: string = firstRow.M_NAME;
            const WIDTH_CD: number = firstRow.WIDTH_CD;
            const IN_CFM_QTY: number =
              USE_YN !== "R" ? firstRow.IN_CFM_QTY : firstRow.RETURN_QTY;
            const ROLL_QTY: number = firstRow.ROLL_QTY;
            const LIEUQL_SX: number = firstRow.LIEUQL_SX;
            const WAHS_CD: string = firstRow.WAHS_CD;
            const LOC_CD: string = firstRow.LOC_CD;
            const FSC_O302: string = firstRow.FSC ?? "N";

            const lot_info: DKXL_DATA =
              dangkyxuatlieutable.find((ele: DKXL_DATA) => ele.M_CODE === M_CODE) ?? ({} as any);

            const OUT_DATE: string = lot_info.OUT_DATE ?? "NG";
            const OUT_NO: string = lot_info.OUT_NO ?? "NG";
            const OUT_SEQ: string = lot_info.OUT_SEQ ?? "NG";
            const FSC_MCODE: string = firstRow.FSC_CODE ?? "01";

            const temp_row: WH_M_OUTPUT_DATA = {
              id: moment().format("YYYYMMDD_HHmmssSSS") + "_" + prepareOutData.length,
              M_CODE,
              M_NAME,
              WIDTH_CD,
              M_LOT_NO: scannedLot.trim(),
              ROLL_QTY,
              UNIT_QTY: IN_CFM_QTY,
              TOTAL_QTY: ROLL_QTY * IN_CFM_QTY,
              WAHS_CD,
              LOC_CD,
              LIEUQL_SX,
              OUT_DATE,
              OUT_NO,
              OUT_SEQ,
              IN_DATE,
              USE_YN,
              FSC_O302,
              FSC_MCODE,
              FSC_GCODE: fsc_GCODE,
            };

            const checkExist_lot: boolean = prepareOutData.some(
              (ele: WH_M_OUTPUT_DATA) => ele.M_LOT_NO === scannedLot.trim()
            );

            if (!checkExist_lot && OUT_DATE !== "NG" && USE_YN !== "X") {
              setPrepareOutData((prev) => [...prev, temp_row]);
            } else if (OUT_DATE === "NG") {
              Swal.fire("Thông báo", "Lot này là Liệu chưa đăng ký xuất kho", "warning");
            } else if (USE_YN === "X") {
              Swal.fire("Thông báo", "Lot này đã sử dụng rồi", "warning");
            } else {
              Swal.fire("Thông báo", "Lot này đã bắn rồi", "warning");
            }
            setM_LOT_NO("");
          } else {
            setM_Name("");
            Swal.fire("Thông báo", "Không tìm thấy thông tin của Lot này", "warning");
          }
        })
        .catch((error) => console.log(error));
    },
    [dangkyxuatlieutable, prepareOutData, fsc_GCODE]
  );

  // Nghiệp vụ Xuất Kho
  const xuatkho = useCallback(async () => {
    if (prepareOutData.length === 0) {
      Swal.fire("Thông báo", "Chưa có cuộn liệu nào trong danh sách xuất", "error");
      return;
    }

    Swal.fire({
      title: "Đang xuất kho...",
      allowOutsideClick: false,
      didOpen: () => Swal.showLoading(),
    });

    let err_code: string = "";
    for (let i = 0; i < prepareOutData.length; i++) {
      if (
        (prepareOutData[i].FSC_O302 === "N" && FSC_M100 === "N") ||
        (prepareOutData[i].FSC_O302 === "Y" && FSC_M100 === "Y") ||
        (prepareOutData[i].FSC_O302 === "Y" && FSC_M100 === "N")
      ) {
        const temp_err_code: string = await f_insertO302({
          OUT_DATE: prepareOutData[i].OUT_DATE,
          OUT_NO: prepareOutData[i].OUT_NO,
          OUT_SEQ: prepareOutData[i].OUT_SEQ,
          M_LOT_NO: prepareOutData[i].M_LOT_NO,
          LOC_CD: prepareOutData[i].LOC_CD,
          M_CODE: prepareOutData[i].M_CODE,
          OUT_CFM_QTY: prepareOutData[i].TOTAL_QTY,
          WAHS_CD: prepareOutData[i].WAHS_CD,
          REMARK: "",
          USE_YN: "Y",
          INS_EMPL: giao_empl,
          FACTORY: selectedFactory,
          CUST_CD: selectedCustomer?.CUST_CD,
          ROLL_QTY: prepareOutData[i].ROLL_QTY,
          OUT_DATE_THUCTE: moment.utc().format("YYYYMMDD"),
          IN_DATE_O302: prepareOutData[i].IN_DATE,
          PLAN_ID: planId,
          SOLANOUT: solanout,
          LIEUQL_SX: prepareOutData[i].LIEUQL_SX,
          INS_RECEPTION: nhan_empl,
          FSC_O302: prepareOutData[i].FSC_O302,
          FSC_GCODE: fsc_GCODE,
          FSC_MCODE: prepareOutData[i].FSC_MCODE,
        });
        if (temp_err_code !== "") {
          err_code += temp_err_code + " | ";
        }
      } else {
        err_code += "Lỗi: Sản phẩm mã FSC thì bắt buộc dùng liệu FSC | ";
      }
    }

    if (err_code !== "") {
      Swal.fire("Thông báo", "Xuất kho vật liệu thất bại: " + err_code, "error");
    } else {
      setPrepareOutData([]);
      setPlanId("");
      setGName("");
      setFSC_GCODE("N");
      setM_Name("");
      f_updateO301_OUT_CFM_QTY(planId);
      Swal.fire("Thông báo", "Xuất kho vật liệu thành công!", "success");
    }
    f_updateStockM090();
  }, [prepareOutData, FSC_M100, giao_empl, selectedFactory, selectedCustomer, planId, solanout, nhan_empl, fsc_GCODE]);

  // Xác nhận xuất kho
  const handleConfirmXuatKho = useCallback(() => {
    Swal.fire({
      title: "Xác nhận xuất liệu",
      text: `Chắc chắn muốn xuất kho ${prepareOutData.length} cuộn liệu đã quét?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#2563eb",
      cancelButtonColor: "#64748b",
      confirmButtonText: "Xác Nhận Xuất Kho",
      cancelButtonText: "Hủy",
    }).then((result) => {
      if (result.isConfirmed) {
        checkBP(getUserData(), ["KHO"], ["ALL"], ["ALL"], async () => {
          xuatkho();
        });
      }
    });
  }, [prepareOutData.length, xuatkho]);

  // Xóa cuộn đã chọn khỏi bảng xuất
  const handleDeleteSelectedScanned = useCallback(() => {
    if (selectedData.current.length === 0) {
      Swal.fire("Thông báo", "Vui lòng tích chọn cuộn cần xóa", "info");
      return;
    }
    setPrepareOutData((prev) =>
      prev.filter((item) => !selectedData.current.some((sel) => sel.id === item.id))
    );
    selectedData.current = [];
    setSelectedCount(0);
  }, []);

  return (
    <div className="xuatlieu">
      {/* 1. TOP TELEMETRY STATUS BAR */}
      <div className="xuatlieu__telemetryBar">
        <div className="telemetry-left">
          <div className="badge-indicator">
            <FiCheckCircle />
            <span>KHO VẬT LIỆU • XUẤT KHO SẢN XUẤT</span>
          </div>
          <span className="telemetry-hint">
            Nhập PLAN_ID để đối chiếu đăng ký và quét barcode M_LOT_NO cuộn xuất
          </span>
        </div>

        <div className="telemetry-metrics">
          <div className="metric-pill metric-pill--indigo">
            <span>Yêu Cầu ĐKXL:</span>
            <strong>{dangkyxuatlieutable.length} mã</strong>
          </div>
          <div className="metric-pill metric-pill--blue">
            <span>Cuộn Đã Bắn:</span>
            <strong>{prepareOutData.length} cuộn</strong>
          </div>
        </div>
      </div>

      {/* 2. MAIN WORKSPACE CONTAINER */}
      <div className="xuatlieu__workspace">
        {/* Scanner & Control Panel */}
        <XuatLieuScannerPanel
          selectedCustomer={selectedCustomer}
          setSelectedCustomer={setSelectedCustomer}
          customerList={customerList}
          filterOptions={filterOptions}
          selectedFactory={selectedFactory}
          setSelectedFactory={setSelectedFactory}
          fromdate={fromdate}
          setFromDate={setFromDate}
          giao_empl={giao_empl}
          giao_empl_name={giao_empl_name}
          onGiaoEmplChange={(val) => {
            setGiao_Empl(val);
            if (val.trim().length >= 7) checkEMPL_NAME(1, val);
            else setGiao_Empl_Name("");
          }}
          nhan_empl={nhan_empl}
          nhan_empl_name={nhan_empl_name}
          onNhanEmplChange={(val) => {
            setNhan_Empl(val);
            if (val.trim().length >= 7) checkEMPL_NAME(2, val);
            else setNhan_Empl_Name("");
          }}
          planId={planId}
          g_name={g_name}
          fsc_GCODE={fsc_GCODE}
          solanout={solanout}
          onPlanIdChange={(val) => {
            setPlanId(val);
            if (val.trim().length >= 7) {
              checkPlanID(val);
              checkSoLanOutO302(val);
              loadDKXLTB(val);
            } else {
              setGName("");
              setM_Name("");
              setDangKyXuatLieuTable([]);
            }
          }}
          m_lot_no={m_lot_no}
          m_name={m_name}
          onLotNoChange={(val) => {
            setM_LOT_NO(val);
            if (val.trim().length >= 10) {
              if (planId.trim().length >= 7 && g_name && giao_empl_name && nhan_empl_name) {
                checkLotNVL(val, planId);
              } else {
                setM_LOT_NO("");
                Swal.fire("Lỗi", "Vui lòng nhập đầy đủ: NV Giao, NV Nhận và Số Chỉ Thị (PLAN_ID)", "warning");
              }
            }
          }}
          onXuatKho={handleConfirmXuatKho}
          prepareOutCount={prepareOutData.length}
        />

        {/* Dual Table Workspace */}
        <XuatLieuTables
          dangkyxuatlieutable={dangkyxuatlieutable}
          prepareOutData={prepareOutData}
          onSelectionScannedChange={(rows) => {
            selectedData.current = rows;
            setSelectedCount(rows.length);
          }}
          onDeleteSelectedScanned={handleDeleteSelectedScanned}
          selectedScannedCount={selectedCount}
        />
      </div>
    </div>
  );
};

export default XUATLIEU;