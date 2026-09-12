import { useEffect, useRef, useState } from "react";
import moment from "moment";
import Swal from "sweetalert2";
import * as XLSX from "xlsx";
import { useSelector } from "react-redux";
import { RootState } from "../../../../redux/store";
import { generalQuery, getCompany, getSocket, getUserData, uploadQuery } from "../../../../api/Api";
import { UserData } from "../../../../api/GlobalInterface";
import { NotificationElement } from "../../../../components/NotificationPanel/Notification";
import {
  CodeListData,
  CustomerListData,
  FCSTTDYCSX,
  POBALANCETDYCSX,
  PONOLIST,
  TONKHOTDYCSX,
  UploadAmazonData,
  YCSXTableData,
} from "../../interfaces/kdInterface";
import {
  f_batchDeleteYCSX,
  f_check_G_NAME_2Ver_active,
  f_checkDuplicateAMZ,
  f_checkFCST_G_CODE,
  f_checkG_CODE_ACTIVE,
  f_checkG_CODE_EXISTS_AND_APPROVED_SAMPLE_MONITOR,
  f_checkG_CODE_PO_BALANCE,
  f_checkStock_G_CODE,
  f_checkYCSX_EXIST,
  f_generateNextProdRequestNo,
  f_getcodelist,
  f_getcustomerlist,
  f_getNextP500_IN_NO,
  f_handleAmazonData,
  f_insertDMYCSX,
  f_insertDMYCSX_New,
  f_insertP500,
  f_insertP501,
  f_insertYCSX,
  f_isBOM_M_CODE_MATCHING,
  f_isBOMGIA_HAS_MAIN,
  f_isIDCongViecExist,
  f_loadPONOList,
  f_process_lot_no_generate,
  f_traYCSX,
  f_updateDMSX_LOSS_KT,
  f_updateYCSX,
} from "../../utils/kdUtils";
import { f_getCodeInfo } from "../../../qlsx/QLSXPLAN/utils/khsxUtils";
import { f_AddMonitoringSample } from "../../../rnd/utils/rndUtils";
import { f_insert_Notification_Data } from "../../../../api/services/notificationService";

export const useYCSXLogic = () => {
  const userData: UserData | undefined = useSelector(
    (state: RootState) => state.totalSlice.userData
  );

  // Sub-tabs: "ycsx" | "amazon"
  const [activeTab, setActiveTab] = useState<"ycsx" | "amazon">("ycsx");

  // Modals
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [openYCSXPrint, setOpenYCSXPrint] = useState(false);
  const [openBanVePrint, setOpenBanVePrint] = useState(false);
  const [isAmzAddModalOpen, setIsAmzAddModalOpen] = useState(false);
  const [showPivot, setShowPivot] = useState(false);

  // Filter States
  const [fromdate, setFromDate] = useState(moment().format("YYYY-MM-DD"));
  const [todate, setToDate] = useState(moment().format("YYYY-MM-DD"));
  const [codeKD, setCodeKD] = useState("");
  const [codeCMS, setCodeCMS] = useState("");
  const [empl_name, setEmpl_Name] = useState("");
  const [cust_name, setCust_Name] = useState("");
  const [prod_type, setProdType] = useState("");
  const [prodrequestno, setProdRequestNo] = useState("");
  const [alltime, setAllTime] = useState(false);
  const [materialYES, setMaterialYES] = useState(false);
  const [phanloai, setPhanLoai] = useState("00");
  const [phanloaihang, setPhanLoaiHang] = useState("ALL");
  const [material, setMaterial] = useState("");
  const [ycsxpendingcheck, setYCSXPendingCheck] = useState(false);
  const [inspectInputcheck, setInspectInputCheck] = useState(false);

  // Lists & Selected States
  const [customerList, setCustomerList] = useState<CustomerListData[]>([]);
  const [codeList, setCodeList] = useState<CodeListData[]>([]);
  const [ponolist, setPONOLIST] = useState<Array<PONOLIST>>([]);
  const [selectedCode, setSelectedCode] = useState<CodeListData | null>({
    G_CODE: "6A00001B",
    G_NAME: "GT-I9500_SJ68-01284A",
    G_NAME_KD: "GT-I9500_SJ68-01284A",
    PROD_LAST_PRICE: 0,
    USE_YN: "N",
  });
  const [selectedCust_CD, setSelectedCust_CD] = useState<CustomerListData | null>({
    CUST_CD: "0000",
    CUST_NAME_KD: "SEOJIN",
  });
  const [selectedPoNo, setSelectedPoNo] = useState<PONOLIST | null>({
    CUST_CD: "",
    G_CODE: "",
    PO_NO: "",
    PO_DATE: "",
    RD_DATE: "",
    PO_QTY: 0,
  });

  // Entry Form States
  const [deliverydate, setNewDeliveryDate] = useState(moment().format("YYYY-MM-DD"));
  const [newycsxqty, setNewYcsxQty] = useState(0);
  const [newycsxremark, setNewYcsxRemark] = useState("");
  const [newphanloai, setNewPhanLoai] = useState("TT");
  const [loaisx, setLoaiSX] = useState("01");
  const [loaixh, setLoaiXH] = useState("02");
  const [isFirstLOT, setIsFirstLot] = useState(false);
  const [is_tam_thoi, setIs_Tam_Thoi] = useState("N");
  const [selectedID, setSelectedID] = useState<string | null>("");

  // Table Data & Selected Rows
  const [ycsxDataTable, setYcsxDataTable] = useState<Array<YCSXTableData>>([]);
  const ycsxdatatablefilter = useRef<YCSXTableData[]>([]);
  const ycsxdatatablefilterexcel = useRef<Array<any>>([]);
  const [clickedRows, setClickedRows] = useState<YCSXTableData | null>(null);

  // Excel & Batch States
  const [uploadExcelJson, setUploadExcelJSon] = useState<Array<any>>([]);
  const [column_excel, setColumn_Excel] = useState<Array<any>>([]);
  const [isLoading, setisLoading] = useState(false);

  // Amazon Upload States
  const [id_congviec, setID_CongViec] = useState("");
  const [cavityAmazon, setCavityAmazon] = useState(0);
  const [prod_model, setProd_Model] = useState("");
  const [amz_PL_HANG, setAMZ_PL_HANG] = useState("TT");
  const [progressvalue, setProgressValue] = useState(0);

  // Initial Data Fetch
  useEffect(() => {
    const fetchInit = async () => {
      setCustomerList(await f_getcustomerlist());
      setCodeList(await f_getcodelist(""));
    };
    fetchInit();
  }, []);

  const loadPONO = async (G_CODE?: string, CUST_CD?: string) => {
    setPONOLIST(await f_loadPONOList(G_CODE, CUST_CD));
  };

  const isG_CODE_FL = async (G_CODE: string) => {
    let isNewCode: boolean = false;
    await generalQuery("checkMassG_CODE", { G_CODE })
      .then((response) => {
        if (response.data.tk_status !== "NG") {
          isNewCode = response.data.data.length <= 0;
        } else {
          isNewCode = true;
        }
      })
      .catch(() => {});
    return isNewCode;
  };

  // Tra cứu YCSX
  const handletraYCSX = async () => {
    Swal.fire({
      title: "Tra YCSX",
      text: "Đang tải dữ liệu, hãy chờ chút",
      icon: "info",
      showCancelButton: false,
      allowOutsideClick: false,
      confirmButtonText: "OK",
      showConfirmButton: false,
    });
    const data = await f_traYCSX({
      alltime: alltime,
      start_date: fromdate,
      end_date: todate,
      cust_name: cust_name,
      codeCMS: codeCMS,
      codeKD: codeKD,
      prod_type: prod_type,
      empl_name: empl_name,
      phanloai: phanloai,
      ycsx_pending: ycsxpendingcheck,
      inspect_inputcheck: inspectInputcheck,
      prod_request_no: prodrequestno,
      material: material,
      phanloaihang: phanloaihang,
      material_yes: materialYES,
    });
    setYcsxDataTable(data);
    Swal.close();
  };

  const handleSearchCodeKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handletraYCSX();
    }
  };

  // Clear Form
  const clearYCSXform = () => {
    setNewDeliveryDate(moment().format("YYYY-MM-DD"));
    setNewYcsxQty(0);
    setNewYcsxRemark("");
    setNewPhanLoai("TT");
    setLoaiSX("01");
    setLoaiXH("02");
    setIsFirstLot(false);
    setIs_Tam_Thoi("N");
    setSelectedID("");
  };

  // Fill Sửa Form & Open Edit Modal
  const handle_fillsuaform = () => {
    if (ycsxdatatablefilter.current.length === 1) {
      const selectedRow = ycsxdatatablefilter.current[0];
      const selectedCodeFilter: CodeListData = {
        G_CODE: selectedRow.G_CODE,
        G_NAME: selectedRow.G_NAME,
        G_NAME_KD: selectedRow.G_NAME_KD || selectedRow.G_NAME,
        PROD_LAST_PRICE: 0,
        USE_YN: "Y",
      };
      const selectedCustomerFilter: CustomerListData = {
        CUST_CD: selectedRow.CUST_CD,
        CUST_NAME_KD: selectedRow.CUST_NAME_KD,
      };
      setSelectedCode(selectedCodeFilter);
      setSelectedCust_CD(selectedCustomerFilter);
      setNewYcsxQty(selectedRow.PROD_REQUEST_QTY);
      setNewYcsxRemark(selectedRow.REMARK || "");
      setSelectedID(selectedRow.PROD_REQUEST_NO);
      setNewPhanLoai(selectedRow.PL_HANG ?? "TT");
      setLoaiSX(selectedRow.PHAN_LOAI);
      setLoaiXH(selectedRow.LOAIXH);
      setNewDeliveryDate(selectedRow.DELIVERY_DT || moment().format("YYYY-MM-DD"));
      setIsEditModalOpen(true);
    } else if (ycsxdatatablefilter.current.length === 0) {
      clearYCSXform();
      Swal.fire("Thông báo", "Lỗi: Chọn ít nhất 1 YCSX để sửa", "error");
    } else {
      Swal.fire("Thông báo", "Lỗi: Chỉ tích chọn 1 dòng để sửa thôi", "error");
    }
  };

  // Update YCSX
  const updateYCSX = async () => {
    if (
      userData?.EMPL_NO?.toUpperCase() === "LVT1906" ||
      userData?.EMPL_NO?.toUpperCase() === "NHU1903"
    ) {
      let err_code: number = 0;
      err_code = (await f_checkYCSX_EXIST(selectedID ?? "")) ? 0 : 1;
      if (
        selectedCode?.G_CODE === "" ||
        selectedCust_CD?.CUST_CD === "" ||
        newycsxqty === 0
      ) {
        err_code = 4;
      }
      if (err_code === 0) {
        await f_updateYCSX({
          G_CODE: selectedCode?.G_CODE,
          CUST_CD: selectedCust_CD?.CUST_CD,
          PROD_REQUEST_NO: selectedID,
          REMK: newycsxremark,
          CODE_50: loaixh,
          CODE_55: loaisx,
          PROD_REQUEST_QTY: newycsxqty,
          EMPL_NO: userData?.EMPL_NO,
          DELIVERY_DT: moment(deliverydate).format("YYYYMMDD"),
        });
        setIsEditModalOpen(false);
        handletraYCSX();
      } else if (err_code === 1) {
        Swal.fire("Thông báo", "NG: Không tồn tại YCSX", "error");
      } else if (err_code === 4) {
        Swal.fire("Thông báo", "NG: Không để trống thông tin bắt buộc", "error");
      }
    } else {
      Swal.fire("Thông báo", "Không đủ quyền hạn để sửa !", "error");
    }
  };

  // Delete YCSX
  const deleteYCSX = async () => {
    await f_batchDeleteYCSX(ycsxdatatablefilter.current);
    handletraYCSX();
  };

  const handleConfirmDeleteYCSX = () => {
    if (ycsxdatatablefilter.current.length === 0) {
      Swal.fire("Thông báo", "Vui lòng chọn ít nhất 1 YCSX để xóa", "warning");
      return;
    }
    Swal.fire({
      title: "Chắc chắn muốn xóa YCSX đã chọn ?",
      text: "Sẽ bắt đầu xóa YCSX đã chọn",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Vẫn Xóa!",
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire("Tiến hành Xóa", "Đang Xóa YCSX hàng loạt", "success");
        deleteYCSX();
      }
    });
  };

  // Approve / PDuyet
  const setPDuyetYCSX = async (pduyet_value: number) => {
    if (userData?.EMPL_NO?.toUpperCase() === "LVT1906" || empl_name === "pd") {
      if (ycsxdatatablefilter.current.length >= 1) {
        let err_code: boolean = false;
        for (let i = 0; i < ycsxdatatablefilter.current.length; i++) {
          await generalQuery("pheduyet_ycsx", {
            PROD_REQUEST_NO: ycsxdatatablefilter.current[i].PROD_REQUEST_NO,
            PDUYET: pduyet_value,
          })
            .then((response) => {
              if (response.data.tk_status === "NG") {
                err_code = true;
              }
            })
            .catch(() => {
              err_code = true;
            });
        }
        if (!err_code) {
          Swal.fire("Thông báo", "SET PDuyet YCSX thành công !", "success");
          handletraYCSX();
        } else {
          Swal.fire("Thông báo", "Có lỗi SQL khi phê duyệt", "error");
        }
      } else {
        Swal.fire("Thông báo", "Chọn ít nhất 1 YCSX để PDuyet !", "error");
      }
    } else {
      Swal.fire("Thông báo", "Không đủ quyền hạn phê duyệt !", "error");
    }
  };

  const handleConfirmPDuyetYCSX = () => {
    if (ycsxdatatablefilter.current.length === 0) {
      Swal.fire("Thông báo", "Chọn ít nhất 1 YCSX để Phê duyệt !", "warning");
      return;
    }
    Swal.fire({
      title: "Chắc chắn muốn SET Phê duyệt YCSX đã chọn ?",
      text: "Sẽ bắt đầu SET Phê duyệt YCSX đã chọn",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Phê duyệt!",
    }).then((result) => {
      if (result.isConfirmed) {
        setPDuyetYCSX(1);
      }
    });
  };

  // Pending YCSX
  const setPendingYCSX = async (pending_value: number) => {
    if (ycsxdatatablefilter.current.length >= 1) {
      let err_code: boolean = false;
      for (let i = 0; i < ycsxdatatablefilter.current.length; i++) {
        await generalQuery("setpending_ycsx", {
          PROD_REQUEST_NO: ycsxdatatablefilter.current[i].PROD_REQUEST_NO,
          YCSX_PENDING: pending_value,
        })
          .then((response) => {
            if (response.data.tk_status === "NG") {
              err_code = true;
            }
          })
          .catch(() => {
            err_code = true;
          });
      }
      if (!err_code) {
        Swal.fire("Thông báo", "SET YCSX thành công", "success");
        handletraYCSX();
      } else {
        Swal.fire("Thông báo", "Có lỗi SQL", "error");
      }
    } else {
      Swal.fire("Thông báo", "Chọn ít nhất 1 YCSX để SET !", "error");
    }
  };

  const handleConfirmSetPendingYCSX = () => {
    if (ycsxdatatablefilter.current.length === 0) {
      Swal.fire("Thông báo", "Chọn ít nhất 1 YCSX để SET PENDING !", "warning");
      return;
    }
    Swal.fire({
      title: "Chắc chắn muốn SET PENDING YCSX đã chọn ?",
      text: "Sẽ bắt đầu SET PENDING YCSX đã chọn",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Vẫn Set!",
    }).then((result) => {
      if (result.isConfirmed) {
        setPendingYCSX(1);
      }
    });
  };

  const handleConfirmSetClosedYCSX = () => {
    if (ycsxdatatablefilter.current.length === 0) {
      Swal.fire("Thông báo", "Chọn ít nhất 1 YCSX để SET CLOSED !", "warning");
      return;
    }
    Swal.fire({
      title: "Chắc chắn muốn SET CLOSED YCSX đã chọn ?",
      text: "Sẽ bắt đầu SET CLOSED YCSX đã chọn",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Vẫn Set!",
    }).then((result) => {
      if (result.isConfirmed) {
        setPendingYCSX(0);
      }
    });
  };

  // Lock / Unlock Material
  const setLockMaterial = async (material_value: string) => {
    if (ycsxdatatablefilter.current.length >= 1) {
      let err_code: boolean = false;
      for (let i = 0; i < ycsxdatatablefilter.current.length; i++) {
        await generalQuery("setMaterial_YN", {
          PROD_REQUEST_NO: ycsxdatatablefilter.current[i].PROD_REQUEST_NO,
          MATERIAL_YN: material_value,
        })
          .then((response) => {
            if (response.data.tk_status === "NG") {
              err_code = true;
            }
          })
          .catch(() => {
            err_code = true;
          });
      }
      if (!err_code) {
        Swal.fire("Thông báo", "SET Liệu YCSX thành công", "success");
        handletraYCSX();
      } else {
        Swal.fire("Thông báo", "Có lỗi SQL", "error");
      }
    } else {
      Swal.fire("Thông báo", "Chọn ít nhất 1 YCSX để SET !", "error");
    }
  };

  const handleConfirmLockMaterial = () => {
    if (ycsxdatatablefilter.current.length === 0) {
      Swal.fire("Thông báo", "Chọn ít nhất 1 YCSX để Khóa Liệu !", "warning");
      return;
    }
    Swal.fire({
      title: "Chắc chắn muốn khóa Liệu cho YCSX được chọn?",
      text: "Sẽ bắt đầu khóa liệu cho YCSX đã chọn",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Khóa!",
    }).then((result) => {
      if (result.isConfirmed) {
        setLockMaterial("N");
      }
    });
  };

  const handleConfirmUnLockMaterial = () => {
    if (ycsxdatatablefilter.current.length === 0) {
      Swal.fire("Thông báo", "Chọn ít nhất 1 YCSX để Mở Liệu !", "warning");
      return;
    }
    Swal.fire({
      title: "Chắc chắn muốn mở Liệu cho YCSX được chọn?",
      text: "Sẽ bắt đầu mở liệu cho YCSX đã chọn",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Mở!",
    }).then((result) => {
      if (result.isConfirmed) {
        setLockMaterial("Y");
      }
    });
  };

  // Open / Close YCSX (USE_YN)
  const setOpenYCSX = async (openValue: string) => {
    if (ycsxdatatablefilter.current.length >= 1) {
      let err_code: boolean = false;
      for (let i = 0; i < ycsxdatatablefilter.current.length; i++) {
        await generalQuery("setopen_ycsx", {
          PROD_REQUEST_NO: ycsxdatatablefilter.current[i].PROD_REQUEST_NO,
          USE_YN: openValue,
        })
          .then((response) => {
            if (response.data.tk_status === "NG") {
              err_code = true;
            }
          })
          .catch(() => {
            err_code = true;
          });
      }
      if (!err_code) {
        Swal.fire("Thông báo", "SET YCSX thành công", "success");
        handletraYCSX();
      } else {
        Swal.fire("Thông báo", "Có lỗi SQL", "error");
      }
    } else {
      Swal.fire("Thông báo", "Chọn ít nhất 1 YCSX để SET !", "error");
    }
  };

  const handleConfirmOpenYCSX = () => {
    if (ycsxdatatablefilter.current.length === 0) {
      Swal.fire("Thông báo", "Chọn ít nhất 1 YCSX để Mở !", "warning");
      return;
    }
    Swal.fire({
      title: "Chắc chắn muốn mở YCSX đã chọn ?",
      text: "Sẽ bắt đầu mở YCSX đã chọn",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Mở!",
    }).then((result) => {
      if (result.isConfirmed) {
        setOpenYCSX("Y");
      }
    });
  };

  const handleConfirmLockYCSX = () => {
    if (ycsxdatatablefilter.current.length === 0) {
      Swal.fire("Thông báo", "Chọn ít nhất 1 YCSX để Khóa !", "warning");
      return;
    }
    Swal.fire({
      title: "Chắc chắn muốn khóa YCSX đã chọn ?",
      text: "Sẽ bắt đầu khóa YCSX đã chọn",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Khóa!",
    }).then((result) => {
      if (result.isConfirmed) {
        setOpenYCSX("N");
      }
    });
  };

  // Add 1 Single YCSX
  const handle_add_1YCSX = async () => {
    let err_code: number = 0;
    let next_prod_request_no: string = await f_generateNextProdRequestNo();
    let pobalance_tdycsx: POBALANCETDYCSX = await f_checkG_CODE_PO_BALANCE(
      selectedCode?.G_CODE ?? ""
    );
    let tonkho_tdycsx: TONKHOTDYCSX = await f_checkStock_G_CODE(
      selectedCode?.G_CODE ?? ""
    );
    let fcst_tdycsx: FCSTTDYCSX = await f_checkFCST_G_CODE(
      selectedCode?.G_CODE ?? ""
    );
    let isBOMGiaHasMain: boolean =
      (await f_isBOMGIA_HAS_MAIN(selectedCode?.G_CODE ?? "")) ||
      getCompany() !== "CMS";
    let checkBOM_Matching: string = await f_isBOM_M_CODE_MATCHING(
      selectedCode?.G_CODE ?? ""
    );
    let isBOMMatching: boolean =
      checkBOM_Matching === "OK" || getCompany() !== "CMS";
    let isTwoVersionExist: boolean = await f_check_G_NAME_2Ver_active(
      selectedCode?.G_CODE ?? ""
    );
    let isApprovedSampleMonitor: boolean =
      getCompany() === "PVN" && loaisx !== "04"
        ? await f_checkG_CODE_EXISTS_AND_APPROVED_SAMPLE_MONITOR(
            selectedCode?.G_CODE ?? ""
          )
        : true;

    let checkCodInfo = await f_getCodeInfo({
      G_NAME: selectedCode?.G_CODE,
      CNDB: true,
      ACTIVE_ONLY: true,
    });
    let g_name_kd = checkCodInfo[0]?.G_NAME_KD;

    if (selectedCode?.USE_YN === "N") {
      err_code = 3;
    }
    if (
      selectedCode?.G_CODE === "" ||
      selectedCust_CD?.CUST_CD === "" ||
      newycsxqty === 0 ||
      userData?.EMPL_NO === ""
    ) {
      err_code = 4;
    }
    if (!isBOMGiaHasMain) err_code = 10;
    if (!isBOMMatching) err_code = 11;
    if (isTwoVersionExist && loaisx !== "04") err_code = 12;
    if (!isApprovedSampleMonitor) err_code = 13;

    if (moment(deliverydate).isBefore(moment(), "day")) {
      err_code = 14;
    }

    if (err_code === 0) {
      if (newphanloai === "TT" || newphanloai === "AM") {
        await f_insertDMYCSX({
          PROD_REQUEST_NO: next_prod_request_no,
          G_CODE: selectedCode?.G_CODE,
        });
        await f_insertDMYCSX_New({
          PROD_REQUEST_NO: next_prod_request_no,
          G_CODE: selectedCode?.G_CODE,
        });
        let isFL: boolean = await isG_CODE_FL(selectedCode?.G_CODE ?? "");
        let kq: string = await f_insertYCSX({
          PHANLOAI: newphanloai,
          G_CODE: selectedCode?.G_CODE,
          CUST_CD: selectedCust_CD?.CUST_CD,
          REMK: newycsxremark,
          PROD_REQUEST_DATE: moment().format("YYYYMMDD"),
          PROD_REQUEST_NO: next_prod_request_no,
          CODE_50: loaixh,
          CODE_03: "01",
          CODE_55: loaisx,
          RIV_NO: "A",
          PROD_REQUEST_QTY: newycsxqty,
          EMPL_NO: userData?.EMPL_NO,
          USE_YN: "Y",
          DELIVERY_DT: moment(deliverydate).format("YYYYMMDD"),
          PO_NO: selectedPoNo?.PO_NO ?? "",
          INS_EMPL: userData?.EMPL_NO,
          UPD_EMPL: userData?.EMPL_NO,
          YCSX_PENDING: 1,
          G_CODE2: selectedCode?.G_CODE,
          PO_TDYCSX: pobalance_tdycsx.PO_BALANCE,
          TKHO_TDYCSX: tonkho_tdycsx.TON_TP,
          FCST_TDYCSX:
            fcst_tdycsx.W1 +
            fcst_tdycsx.W2 +
            fcst_tdycsx.W3 +
            fcst_tdycsx.W4 +
            fcst_tdycsx.W5 +
            fcst_tdycsx.W6 +
            fcst_tdycsx.W7 +
            fcst_tdycsx.W8,
          W1: fcst_tdycsx.W1,
          W2: fcst_tdycsx.W2,
          W3: fcst_tdycsx.W3,
          W4: fcst_tdycsx.W4,
          W5: fcst_tdycsx.W5,
          W6: fcst_tdycsx.W6,
          W7: fcst_tdycsx.W7,
          W8: fcst_tdycsx.W8,
          BTP_TDYCSX: tonkho_tdycsx.BTP,
          CK_TDYCSX: tonkho_tdycsx.TONG_TON_KIEM,
          PDUYET: pobalance_tdycsx.PO_BALANCE > 0 || loaisx === "04" ? 1 : 0,
          BLOCK_TDYCSX: tonkho_tdycsx.BLOCK_QTY,
          MATERIAL_YN: "N",
          IS_TAM_THOI: is_tam_thoi,
          FL_YN: isFirstLOT ? "Y" : "N",
        });
        if (kq === "OK") {
          await f_updateDMSX_LOSS_KT();
          let newNotification: NotificationElement = {
            CTR_CD: "002",
            NOTI_ID: -1,
            NOTI_TYPE: "success",
            TITLE: "Thêm YCSX mới",
            CONTENT: `${getUserData()?.EMPL_NO} (${getUserData()?.MIDLAST_NAME} ${getUserData()?.FIRST_NAME}), nhân viên ${getUserData()?.WORK_POSITION_NAME} đã thêm YCSX mới: ${next_prod_request_no}, CODE: ${selectedCode?.G_CODE}, CUST_CD: ${selectedCust_CD?.CUST_CD}, QTY: ${newycsxqty}, DELIVERY DATE: ${deliverydate?.toString()}.`,
            SUBDEPTNAME: "KD,QLSX",
            MAINDEPTNAME: "KD,QLSX",
            INS_EMPL: "NHU1903",
            INS_DATE: "2024-12-30",
            UPD_EMPL: "NHU1903",
            UPD_DATE: "2024-12-30",
          };
          if (await f_insert_Notification_Data(newNotification)) {
            getSocket().emit("notification_panel", newNotification);
          }
          if (getCompany() === "PVN" && loaisx === "04") {
            await f_AddMonitoringSample({
              PROD_REQUEST_NO: next_prod_request_no,
              G_CODE: selectedCode?.G_CODE,
              G_NAME_KD: g_name_kd,
              REQ_ID: 0,
            });
          }
          Swal.fire("Thông báo", "Thêm YCSX mới thành công", "success");
          clearYCSXform();
          setIsAddModalOpen(false);
          handletraYCSX();
        } else {
          Swal.fire("Thông báo", "Thêm YCSX mới thất bại: " + kq, "error");
        }
      } else {
        let next_process_lot_no_p501: string = await f_process_lot_no_generate(
          newphanloai
        );
        let isFL: boolean = await isG_CODE_FL(selectedCode?.G_CODE ?? "");
        let kq: string = await f_insertYCSX({
          PHANLOAI: newphanloai === "GD" ? "TT" : newphanloai,
          G_CODE: selectedCode?.G_CODE,
          CUST_CD: selectedCust_CD?.CUST_CD,
          REMK:
            newphanloai !== "GD"
              ? next_process_lot_no_p501 + " REMARK: " + newycsxremark
              : "GD: " + newycsxremark,
          PROD_REQUEST_DATE: moment().format("YYYYMMDD"),
          PROD_REQUEST_NO: next_prod_request_no,
          CODE_50: loaixh,
          CODE_03: newphanloai === "GD" ? "09" : "01",
          CODE_55: loaisx,
          RIV_NO: "A",
          PROD_REQUEST_QTY: newycsxqty,
          EMPL_NO: userData?.EMPL_NO,
          USE_YN: "Y",
          DELIVERY_DT: moment(deliverydate).format("YYYYMMDD"),
          PO_NO: selectedPoNo?.PO_NO === undefined ? "" : selectedPoNo?.PO_NO,
          INS_EMPL: userData?.EMPL_NO,
          UPD_EMPL: userData?.EMPL_NO,
          YCSX_PENDING: 1,
          G_CODE2: selectedCode?.G_CODE,
          PO_TDYCSX: pobalance_tdycsx.PO_BALANCE,
          TKHO_TDYCSX: tonkho_tdycsx.TON_TP,
          FCST_TDYCSX:
            fcst_tdycsx.W1 +
            fcst_tdycsx.W2 +
            fcst_tdycsx.W3 +
            fcst_tdycsx.W4 +
            fcst_tdycsx.W5 +
            fcst_tdycsx.W6 +
            fcst_tdycsx.W7 +
            fcst_tdycsx.W8,
          W1: fcst_tdycsx.W1,
          W2: fcst_tdycsx.W2,
          W3: fcst_tdycsx.W3,
          W4: fcst_tdycsx.W4,
          W5: fcst_tdycsx.W5,
          W6: fcst_tdycsx.W6,
          W7: fcst_tdycsx.W7,
          W8: fcst_tdycsx.W8,
          BTP_TDYCSX: tonkho_tdycsx.BTP,
          CK_TDYCSX: tonkho_tdycsx.TONG_TON_KIEM,
          PDUYET: pobalance_tdycsx.PO_BALANCE > 0 || loaisx === "04" ? 1 : 0,
          BLOCK_TDYCSX: tonkho_tdycsx.BLOCK_QTY,
          MATERIAL_YN: "Y",
          IS_TAM_THOI: is_tam_thoi,
          FL_YN: isFirstLOT ? "Y" : "N",
        });
        if (kq === "OK") {
          let newNotification: NotificationElement = {
            CTR_CD: "002",
            NOTI_ID: -1,
            NOTI_TYPE: "success",
            TITLE: "Thêm YCSX mới",
            CONTENT: `${getUserData()?.EMPL_NO} (${getUserData()?.MIDLAST_NAME} ${getUserData()?.FIRST_NAME}), nhân viên ${getUserData()?.WORK_POSITION_NAME} đã thêm YCSX mới: ${next_prod_request_no}, CODE: ${selectedCode?.G_CODE}, CUST_CD: ${selectedCust_CD?.CUST_CD}, QTY: ${newycsxqty}, DELIVERY DATE: ${deliverydate?.toString()}.`,
            SUBDEPTNAME: "KD,QLSX",
            MAINDEPTNAME: "KD,QLSX",
            INS_EMPL: "NHU1903",
            INS_DATE: "2024-12-30",
            UPD_EMPL: "NHU1903",
            UPD_DATE: "2024-12-30",
          };
          if (await f_insert_Notification_Data(newNotification)) {
            getSocket().emit("notification_panel", newNotification);
          }
          Swal.fire("Thông báo", "Thêm YCSX mới thành công", "success");
          clearYCSXform();
          setIsAddModalOpen(false);
          handletraYCSX();
        } else {
          Swal.fire("Thông báo", "Thêm YCSX mới thất bại: " + kq, "error");
        }
        let next_p500_in_no: string = await f_getNextP500_IN_NO();
        if (newphanloai !== "GD") {
          await f_insertP500({
            in_date: moment().format("YYYYMMDD"),
            next_process_in_no: next_p500_in_no,
            PROD_REQUEST_DATE: moment().format("YYYYMMDD"),
            PROD_REQUEST_NO: next_prod_request_no,
            G_CODE: selectedCode?.G_CODE,
            EMPL_NO: userData?.EMPL_NO,
            phanloai: newphanloai,
            PLAN_ID: next_prod_request_no + "A",
            PR_NB: 0,
          });
          await f_insertP501({
            in_date: moment().format("YYYYMMDD"),
            next_process_in_no: next_p500_in_no,
            EMPL_NO: userData?.EMPL_NO,
            next_process_lot_no: next_process_lot_no_p501,
            next_process_prt_seq: next_process_lot_no_p501.substring(5, 8),
            PROD_REQUEST_DATE: moment().format("YYYYMMDD"),
            PROD_REQUEST_NO: next_prod_request_no,
            PLAN_ID: next_prod_request_no + "A",
            PROCESS_NUMBER: 0,
            TEMP_QTY: newycsxqty,
            USE_YN: "X",
          });
        }
      }
    } else if (err_code === 2) {
      Swal.fire("Thông báo", "NG: Ngày PO không được trước ngày hôm nay", "error");
    } else if (err_code === 3) {
      Swal.fire("Thông báo", "NG: Ver này đã bị khóa", "error");
    } else if (err_code === 4) {
      Swal.fire("Thông báo", "NG: Không để trống thông tin bắt buộc", "error");
    } else if (err_code === 11) {
      Swal.fire("Thông báo", "NG: " + checkBOM_Matching, "error");
    } else if (err_code === 10) {
      Swal.fire("Thông báo", "NG: BOM Giá của code này chưa có liệu main: Cần USAGE=main, MAIN_M=1", "error");
    } else if (err_code === 12) {
      Swal.fire("Thông báo", "NG: Cùng G_NAME_KD hiện tại đang có hai ver được mở khóa", "error");
    } else if (err_code === 13) {
      Swal.fire("Thông báo", "NG: Code này chưa được duyệt sample monitor", "error");
    } else if (err_code === 14) {
      Swal.fire("Thông báo", "NG: Ngày giao hàng dự kiến không được trước ngày hôm nay", "error");
    }
  };

  // Excel Bulk Upload Logic
  const readUploadFile = (e: any) => {
    e.preventDefault();
    if (e.target.files) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        const data = e.target.result;
        const workbook = XLSX.read(data, { type: "array" });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const json: any = XLSX.utils.sheet_to_json(worksheet);
        const keys = Object.keys(json[0]);
        let uploadexcelcolumn = keys.map((element) => {
          return {
            field: element,
            headerName: element,
            width: 150,
          };
        });
        uploadexcelcolumn.push({
          field: "CHECKSTATUS",
          headerName: "CHECKSTATUS",
          width: 350,
        });
        setColumn_Excel(uploadexcelcolumn);
        setUploadExcelJSon(
          json.map((element: any, index: number) => {
            return {
              ...element,
              id: index,
              CHECKSTATUS: "Waiting",
              PHANLOAI: element.PHANLOAI ?? "TT",
              PROD_REQUEST_DATE:
                getCompany() === "CMS"
                  ? element.PROD_REQUEST_DATE
                  : moment(element.PROD_REQUEST_DATE).format("YYYYMMDD"),
            };
          })
        );
      };
      reader.readAsArrayBuffer(e.target.files[0]);
    }
  };

  const handle_checkYCSXHangLoat = async () => {
    setisLoading(true);
    let tempjson = [...uploadExcelJson];
    for (let i = 0; i < uploadExcelJson.length; i++) {
      let err_code: number = 0;
      err_code = await f_checkG_CODE_ACTIVE(uploadExcelJson[i].G_CODE);
      let isBOMGiaHasMain: boolean =
        (await f_isBOMGIA_HAS_MAIN(uploadExcelJson[i].G_CODE)) ||
        getCompany() !== "CMS";
      let checkBOM_Matching: string = await f_isBOM_M_CODE_MATCHING(
        uploadExcelJson[i].G_CODE
      );
      let isBOMMatching: boolean =
        checkBOM_Matching === "OK" || getCompany() !== "CMS";
      let isTwoVersionExist: boolean = await f_check_G_NAME_2Ver_active(
        uploadExcelJson[i]?.G_CODE ?? ""
      );
      let isApprovedSampleMonitor: boolean =
        getCompany() === "PVN" && uploadExcelJson[i].CODE_55 !== "04"
          ? await f_checkG_CODE_EXISTS_AND_APPROVED_SAMPLE_MONITOR(
              uploadExcelJson[i].G_CODE ?? ""
            )
          : true;
      if (!isBOMGiaHasMain) err_code = 10;
      if (!isBOMMatching) err_code = 11;
      if (uploadExcelJson[i].CODE_50 === undefined) err_code = 5;
      if (uploadExcelJson[i].CODE_55 === undefined) err_code = 6;
      if (
        customerList.filter(
          (ele: CustomerListData) => ele.CUST_CD === uploadExcelJson[i].CUST_CD
        ).length === 0
      )
        err_code = 7;
      if (
        codeList.filter(
          (ele: CodeListData) => ele.G_CODE === uploadExcelJson[i].G_CODE
        ).length === 0
      )
        err_code = 8;
      if (uploadExcelJson[i].PHANLOAI === undefined) err_code = 9;
      if (isTwoVersionExist && uploadExcelJson[i].CODE_55 !== "04") err_code = 12;
      if (!isApprovedSampleMonitor) err_code = 13;
      if (
        moment(uploadExcelJson[i].DELIVERY_DT, "YYYYMMDD").isBefore(
          moment(),
          "day"
        )
      ) {
        err_code = 14;
      }
      if (err_code === 0) {
        tempjson[i].CHECKSTATUS = "OK";
      } else if (err_code === 1) {
        tempjson[i].CHECKSTATUS = "NG: Đã tồn tại PO";
      } else if (err_code === 2) {
        tempjson[i].CHECKSTATUS =
          "NG: Ngày giao hàng dự kiến không được trước ngày hôm nay";
      } else if (err_code === 3) {
        tempjson[i].CHECKSTATUS = "NG: Ver này đã bị khóa";
      } else if (err_code === 4) {
        tempjson[i].CHECKSTATUS = "NG: Không có Code ERP này";
      } else if (err_code === 5) {
        tempjson[i].CHECKSTATUS = "NG: Chưa nhập phân loại xuất hàng";
      } else if (err_code === 6) {
        tempjson[i].CHECKSTATUS = "NG: Chưa nhập phân loại sản xuất";
      } else if (err_code === 7) {
        tempjson[i].CHECKSTATUS = "NG: Mã khách hàng không tồn tại";
      } else if (err_code === 8) {
        tempjson[i].CHECKSTATUS = "NG: Mã sản phẩm G_CODE không tồn tại";
      } else if (err_code === 9) {
        tempjson[i].CHECKSTATUS = "NG: Chưa nhập phân loại sản phẩm";
      } else if (err_code === 11) {
        tempjson[i].CHECKSTATUS = "NG: " + checkBOM_Matching;
      } else if (err_code === 10) {
        tempjson[i].CHECKSTATUS =
          "NG: BOM Giá của code này chưa có liệu main: Cần USAGE=main, MAIN_M=1";
      } else if (err_code === 12) {
        tempjson[i].CHECKSTATUS =
          "NG: Cùng G_NAME_KD hiện tại đang có hai ver được mở khóa";
      } else if (err_code === 13) {
        tempjson[i].CHECKSTATUS =
          "NG: Code này chưa được duyệt sample monitor";
      } else if (err_code === 14) {
        tempjson[i].CHECKSTATUS =
          "NG: Ngày giao hàng dự kiến không được trước ngày hôm nay";
      }
    }
    setisLoading(false);
    Swal.fire("Thông báo", "Đã hoàn thành check YCSX hàng loạt", "success");
    setUploadExcelJSon(tempjson);
  };

  const handle_upYCSXHangLoat = async () => {
    setisLoading(true);
    let tempjson = [...uploadExcelJson];
    for (let i = 0; i < uploadExcelJson.length; i++) {
      let err_code: number = 0;
      err_code = await f_checkG_CODE_ACTIVE(uploadExcelJson[i].G_CODE);
      let isBOMGiaHasMain: boolean =
        (await f_isBOMGIA_HAS_MAIN(uploadExcelJson[i].G_CODE)) ||
        getCompany() !== "CMS";
      let checkBOM_Matching: string = await f_isBOM_M_CODE_MATCHING(
        uploadExcelJson[i].G_CODE
      );
      let isBOMMatching: boolean =
        checkBOM_Matching === "OK" || getCompany() !== "CMS";
      let isTwoVersionExist: boolean = await f_check_G_NAME_2Ver_active(
        uploadExcelJson[i]?.G_CODE ?? ""
      );
      let isApprovedSampleMonitor: boolean =
        getCompany() === "PVN" && uploadExcelJson[i].CODE_55 !== "04"
          ? await f_checkG_CODE_EXISTS_AND_APPROVED_SAMPLE_MONITOR(
              uploadExcelJson[i].G_CODE ?? ""
            )
          : true;
      if (!isBOMGiaHasMain) err_code = 10;
      if (!isBOMMatching) err_code = 11;
      if (uploadExcelJson[i].CODE_50 === undefined) err_code = 5;
      if (uploadExcelJson[i].CODE_55 === undefined) err_code = 6;
      if (
        customerList.filter(
          (ele: CustomerListData) => ele.CUST_CD === uploadExcelJson[i].CUST_CD
        ).length === 0
      )
        err_code = 7;
      if (
        codeList.filter(
          (ele: CodeListData) => ele.G_CODE === uploadExcelJson[i].G_CODE
        ).length === 0
      )
        err_code = 8;
      if (uploadExcelJson[i].PHANLOAI === undefined) err_code = 9;
      if (isTwoVersionExist && uploadExcelJson[i].CODE_55 !== "04") err_code = 12;
      if (!isApprovedSampleMonitor) err_code = 13;
      if (
        moment(uploadExcelJson[i].DELIVERY_DT, "YYYYMMDD").isBefore(
          moment(),
          "day"
        )
      ) {
        err_code = 14;
      }
      if (err_code === 0) {
        let next_prod_request_no: string = await f_generateNextProdRequestNo();
        let pobalance_tdycsx: POBALANCETDYCSX = await f_checkG_CODE_PO_BALANCE(
          uploadExcelJson[i].G_CODE
        );
        let tonkho_tdycsx: TONKHOTDYCSX = await f_checkStock_G_CODE(
          uploadExcelJson[i].G_CODE
        );
        let fcst_tdycsx: FCSTTDYCSX = await f_checkFCST_G_CODE(
          uploadExcelJson[i].G_CODE
        );
        let isFL: boolean = await isG_CODE_FL(uploadExcelJson[i].G_CODE);
        if (
          uploadExcelJson[i].PHANLOAI === "TT" ||
          uploadExcelJson[i].PHANLOAI === "AM"
        ) {
          await f_insertDMYCSX({
            PROD_REQUEST_NO: next_prod_request_no,
            G_CODE: uploadExcelJson[i].G_CODE,
          });
          await f_insertDMYCSX_New({
            PROD_REQUEST_NO: next_prod_request_no,
            G_CODE: uploadExcelJson[i].G_CODE,
          });
          await f_insertYCSX({
            PHANLOAI: uploadExcelJson[i].PHANLOAI,
            G_CODE: uploadExcelJson[i].G_CODE,
            CUST_CD: uploadExcelJson[i].CUST_CD,
            REMK: uploadExcelJson[i].REMK ?? "",
            PROD_REQUEST_DATE:
              getCompany() === "CMS"
                ? moment().format("YYYYMMDD")
                : uploadExcelJson[i].PROD_REQUEST_DATE,
            PROD_REQUEST_NO: next_prod_request_no,
            CODE_50: uploadExcelJson[i].CODE_50,
            CODE_03: "01",
            CODE_55: uploadExcelJson[i].CODE_55,
            RIV_NO: "A",
            PROD_REQUEST_QTY: uploadExcelJson[i].PROD_REQUEST_QTY,
            EMPL_NO: userData?.EMPL_NO,
            USE_YN: "Y",
            DELIVERY_DT: moment(
              uploadExcelJson[i].DELIVERY_DT,
              "YYYYMMDD"
            ).format("YYYYMMDD"),
            PO_NO:
              uploadExcelJson[i].PO_NO === undefined
                ? ""
                : uploadExcelJson[i].PO_NO,
            INS_EMPL: userData?.EMPL_NO,
            UPD_EMPL: userData?.EMPL_NO,
            YCSX_PENDING: 1,
            G_CODE2: uploadExcelJson[i].G_CODE,
            PO_TDYCSX: pobalance_tdycsx.PO_BALANCE,
            TKHO_TDYCSX: tonkho_tdycsx.TON_TP,
            FCST_TDYCSX:
              fcst_tdycsx.W1 +
              fcst_tdycsx.W2 +
              fcst_tdycsx.W3 +
              fcst_tdycsx.W4 +
              fcst_tdycsx.W5 +
              fcst_tdycsx.W6 +
              fcst_tdycsx.W7 +
              fcst_tdycsx.W8,
            W1: fcst_tdycsx.W1,
            W2: fcst_tdycsx.W2,
            W3: fcst_tdycsx.W3,
            W4: fcst_tdycsx.W4,
            W5: fcst_tdycsx.W5,
            W6: fcst_tdycsx.W6,
            W7: fcst_tdycsx.W7,
            W8: fcst_tdycsx.W8,
            BTP_TDYCSX: tonkho_tdycsx.BTP,
            CK_TDYCSX: tonkho_tdycsx.TONG_TON_KIEM,
            PDUYET:
              pobalance_tdycsx.PO_BALANCE > 0 ||
              uploadExcelJson[i].CODE_55 === "04"
                ? 1
                : 0,
            BLOCK_TDYCSX: tonkho_tdycsx.BLOCK_QTY,
            MATERIAL_YN: "N",
            IS_TAM_THOI: uploadExcelJson[i].IS_TAM_THOI ?? "N",
            FL_YN: isFL ? "Y" : "N",
          });
          if (
            getCompany() === "PVN" &&
            uploadExcelJson[i].CODE_55 === "04"
          ) {
            let checkCodInfo = await f_getCodeInfo({
              G_NAME: uploadExcelJson[i].G_CODE,
              CNDB: true,
              ACTIVE_ONLY: true,
            });
            let g_name_kd = checkCodInfo[0]?.G_NAME_KD;
            await f_AddMonitoringSample({
              PROD_REQUEST_NO: next_prod_request_no,
              G_CODE: uploadExcelJson[i].G_CODE,
              G_NAME_KD: g_name_kd,
              REQ_ID: 0,
            });
          }
          tempjson[i].CHECKSTATUS = "OK";
        } else {
          let next_process_lot_no_p501: string =
            await f_process_lot_no_generate(uploadExcelJson[i].PHANLOAI);
          await f_insertYCSX({
            PHANLOAI: uploadExcelJson[i].PHANLOAI,
            G_CODE: uploadExcelJson[i].G_CODE,
            CUST_CD: uploadExcelJson[i].CUST_CD,
            REMK:
              uploadExcelJson[i].PHANLOAI !== "GD"
                ? next_process_lot_no_p501 +
                  " REMARK: " +
                  (uploadExcelJson[i].REMK ?? "")
                : "GD: " + (uploadExcelJson[i].REMK ?? ""),
            PROD_REQUEST_DATE:
              getCompany() === "CMS"
                ? moment().format("YYYYMMDD")
                : uploadExcelJson[i].PROD_REQUEST_DATE,
            PROD_REQUEST_NO: next_prod_request_no,
            CODE_50: uploadExcelJson[i].CODE_50,
            CODE_03: uploadExcelJson[i].PHANLOAI === "GD" ? "09" : "01",
            CODE_55: uploadExcelJson[i].CODE_55,
            RIV_NO: "A",
            PROD_REQUEST_QTY: uploadExcelJson[i].PROD_REQUEST_QTY,
            EMPL_NO: userData?.EMPL_NO,
            USE_YN: "Y",
            DELIVERY_DT: moment(
              uploadExcelJson[i].DELIVERY_DT,
              "YYYYMMDD"
            ).format("YYYYMMDD"),
            PO_NO:
              uploadExcelJson[i].PO_NO === undefined
                ? ""
                : uploadExcelJson[i].PO_NO,
            INS_EMPL: userData?.EMPL_NO,
            UPD_EMPL: userData?.EMPL_NO,
            YCSX_PENDING: 1,
            G_CODE2: uploadExcelJson[i].G_CODE,
            PO_TDYCSX: pobalance_tdycsx.PO_BALANCE,
            TKHO_TDYCSX: tonkho_tdycsx.TON_TP,
            FCST_TDYCSX:
              fcst_tdycsx.W1 +
              fcst_tdycsx.W2 +
              fcst_tdycsx.W3 +
              fcst_tdycsx.W4 +
              fcst_tdycsx.W5 +
              fcst_tdycsx.W6 +
              fcst_tdycsx.W7 +
              fcst_tdycsx.W8,
            W1: fcst_tdycsx.W1,
            W2: fcst_tdycsx.W2,
            W3: fcst_tdycsx.W3,
            W4: fcst_tdycsx.W4,
            W5: fcst_tdycsx.W5,
            W6: fcst_tdycsx.W6,
            W7: fcst_tdycsx.W7,
            W8: fcst_tdycsx.W8,
            BTP_TDYCSX: tonkho_tdycsx.BTP,
            CK_TDYCSX: tonkho_tdycsx.TONG_TON_KIEM,
            PDUYET:
              pobalance_tdycsx.PO_BALANCE > 0 ||
              uploadExcelJson[i].CODE_55 === "04"
                ? 1
                : 0,
            BLOCK_TDYCSX: tonkho_tdycsx.BLOCK_QTY,
            MATERIAL_YN: "Y",
            IS_TAM_THOI: uploadExcelJson[i].IS_TAM_THOI ?? "N",
            FL_YN: isFL ? "Y" : "N",
          });
          let next_p500_in_no: string = await f_getNextP500_IN_NO();
          if (uploadExcelJson[i].PHANLOAI !== "GD") {
            await f_insertP500({
              in_date: moment().format("YYYYMMDD"),
              next_process_in_no: next_p500_in_no,
              PROD_REQUEST_DATE:
                getCompany() === "CMS"
                  ? moment().format("YYYYMMDD")
                  : uploadExcelJson[i].PROD_REQUEST_DATE,
              PROD_REQUEST_NO: next_prod_request_no,
              G_CODE: uploadExcelJson[i].G_CODE,
              EMPL_NO: userData?.EMPL_NO,
              phanloai: uploadExcelJson[i].PHANLOAI,
              PLAN_ID: next_prod_request_no + "A",
              PR_NB: 0,
            });
            await f_insertP501({
              in_date: moment().format("YYYYMMDD"),
              next_process_in_no: next_p500_in_no,
              EMPL_NO: userData?.EMPL_NO,
              next_process_lot_no: next_process_lot_no_p501,
              next_process_prt_seq: next_process_lot_no_p501.substring(5, 8),
              PROD_REQUEST_DATE:
                getCompany() === "CMS"
                  ? moment().format("YYYYMMDD")
                  : uploadExcelJson[i].PROD_REQUEST_DATE,
              PROD_REQUEST_NO: next_prod_request_no,
              PLAN_ID: next_prod_request_no + "A",
              PROCESS_NUMBER: 0,
              TEMP_QTY: uploadExcelJson[i].PROD_REQUEST_QTY,
              USE_YN: "X",
            });
          }
          tempjson[i].CHECKSTATUS = "OK";
        }
      } else {
        tempjson[i].CHECKSTATUS = "NG: Lỗi kiểm tra mã " + err_code;
      }
    }
    setisLoading(false);
    let newNotification: NotificationElement = {
      CTR_CD: "002",
      NOTI_ID: -1,
      NOTI_TYPE: "success",
      TITLE: "Thêm YCSX mới hàng loạt",
      CONTENT: `${getUserData()?.EMPL_NO} (${getUserData()?.MIDLAST_NAME} ${getUserData()?.FIRST_NAME}), nhân viên ${getUserData()?.WORK_POSITION_NAME} đã thêm ${uploadExcelJson.length} YCSX mới`,
      SUBDEPTNAME: "KD,QLSX",
      MAINDEPTNAME: "KD,QLSX",
      INS_EMPL: "NHU1903",
      INS_DATE: "2024-12-30",
      UPD_EMPL: "NHU1903",
      UPD_DATE: "2024-12-30",
    };
    if (await f_insert_Notification_Data(newNotification)) {
      getSocket().emit("notification_panel", newNotification);
    }
    Swal.fire("Thông báo", "Đã hoàn thành Up YCSX hàng loạt", "success");
    await f_updateDMSX_LOSS_KT();
    setUploadExcelJSon(tempjson);
    handletraYCSX();
  };

  const confirmUpYcsxHangLoat = () => {
    Swal.fire({
      title: "Chắc chắn muốn thêm YCSX hàng loạt ?",
      text: "Thêm rồi mà sai, sửa là hơi vất đấy",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Vẫn thêm!",
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire("Tiến hành thêm", "Đang thêm YCSX hàng loạt", "info");
        handle_upYCSXHangLoat();
      }
    });
  };

  const confirmCheckYcsxHangLoat = () => {
    Swal.fire({
      title: "Chắc chắn muốn check YCSX hàng loạt ?",
      text: "Sẽ bắt đầu check ycsx hàng loạt",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Vẫn check!",
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire("Tiến hành check", "Đang check YCSX hàng loạt", "info");
        handle_checkYCSXHangLoat();
      }
    });
  };

  const handle_InsertYCSXTable = () => {
    let newycsx_row = {
      PROD_REQUEST_DATE: moment().format("YYYYMMDD"),
      CODE_50: loaixh,
      CODE_55: loaisx,
      PHANLOAI: newphanloai,
      RIV_NO: "A",
      PROD_REQUEST_QTY: newycsxqty,
      G_CODE: selectedCode?.G_CODE,
      CUST_CD: selectedCust_CD?.CUST_CD,
      EMPL_NO: userData?.EMPL_NO,
      REMK: newycsxremark || "",
      DELIVERY_DT: moment(deliverydate).format("YYYYMMDD"),
      PO_NO: selectedPoNo?.PO_NO || "",
      CHECKSTATUS: "Waiting",
      IS_TAM_THOI: is_tam_thoi,
      FL_YN: isFirstLOT ? "Y" : "N",
      id: moment().format("YYYY-MM-DD HH:mm:ss.SSS"),
    };
    if (!newycsx_row.G_CODE || !newycsx_row.CUST_CD || newycsx_row.PROD_REQUEST_QTY === 0) {
      Swal.fire("Thông báo", "Vui lòng chọn Khách hàng, Mã code và Số lượng > 0", "error");
    } else {
      setUploadExcelJSon([...uploadExcelJson, newycsx_row]);
    }
  };

  const handle_DeleteYCSX_Excel = () => {
    if (ycsxdatatablefilterexcel.current.length > 0) {
      let datafilter = [...uploadExcelJson];
      for (let i = 0; i < ycsxdatatablefilterexcel.current.length; i++) {
        for (let j = 0; j < datafilter.length; j++) {
          if (ycsxdatatablefilterexcel.current[i].id === datafilter[j].id) {
            datafilter.splice(j, 1);
          }
        }
      }
      setUploadExcelJSon(datafilter);
    } else {
      Swal.fire("Thông báo", "Chọn ít nhất 1 dòng để xóa", "error");
    }
  };

  // Amazon Upload Logic
  const handle_findAmazonCodeInfo = async (prod_request_no: string) => {
    await generalQuery("get_ycsxInfo2", { ycsxno: prod_request_no })
      .then((response) => {
        if (response.data.tk_status !== "NG") {
          setCodeKD(response.data.data[0].G_NAME);
          setCodeCMS(response.data.data[0].G_CODE);
          setProd_Model(response.data.data[0].PROD_MODEL);
          setAMZ_PL_HANG(response.data.data[0].PL_HANG);
          generalQuery("get_cavityAmazon", {
            g_code: response.data.data[0].G_CODE,
          })
            .then((response) => {
              if (response.data.tk_status !== "NG") {
                setCavityAmazon(response.data.data[0].CAVITY_PRINT);
              } else {
                setCavityAmazon(0);
              }
            })
            .catch(() => {});
        } else {
          setCodeKD("");
          setCodeCMS("");
          setProd_Model("");
          setAMZ_PL_HANG("TT");
        }
      })
      .catch(() => {});
  };

  const readUploadFileAmazon = (e: any) => {
    e.preventDefault();
    if (e.target.files) {
      let filename: string = e.target.files[0].name;
      let checkmodel: boolean =
        filename.search(prod_model) === -1 ? false : true;
      let checkIDCV: boolean =
        filename.search(id_congviec) === -1 ? false : true;
      if (!checkmodel) {
        Swal.fire("Thông báo", "Nghi vấn sai model", "error");
        setUploadExcelJSon([]);
      } else if (!checkIDCV) {
        Swal.fire("Thông báo", "Không đúng ID công việc đã nhập", "error");
        setUploadExcelJSon([]);
      } else {
        const reader = new FileReader();
        reader.onload = (e: any) => {
          const data = e.target.result;
          const workbook = XLSX.read(data, { type: "array" });
          const sheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[sheetName];
          let json: any = XLSX.utils.sheet_to_json(worksheet, {
            header: ["DATA"],
            defval: "",
          });
          let valueArray = json.slice(1).map((element: any) => element.DATA);
          var isDuplicate = valueArray.some(function (item: any, idx: number) {
            return valueArray.indexOf(item) !== idx;
          });
          if (isDuplicate) {
            Swal.fire("Thông báo", "Có giá trị trùng lặp !", "error");
            setUploadExcelJSon([]);
          } else {
            let newjson = json.map((element: any, index: number) => {
              return { ...element, id: index, CHECKSTATUS: "Waiting" };
            });
            setUploadExcelJSon(newjson);
          }
        };
        reader.readAsArrayBuffer(e.target.files[0]);
      }
    }
  };

  const upAmazonDataSuperFast = async () => {
    let isDuplicated: boolean = false;
    if (amz_PL_HANG === "AM" || amz_PL_HANG === "TT") {
      isDuplicated = await f_checkDuplicateAMZ();
      Swal.fire({
        title: "Checking",
        text: "Đang upload data, hãy chờ chút",
        icon: "info",
        showCancelButton: false,
        allowOutsideClick: false,
        confirmButtonText: "OK",
        showConfirmButton: false,
      });
      if (!isDuplicated) {
        let uploadAmazonData = await f_handleAmazonData(
          uploadExcelJson,
          cavityAmazon,
          codeCMS,
          prodrequestno,
          id_congviec
        );
        let checkIDcongViecTonTai: boolean = await f_isIDCongViecExist(
          id_congviec,
          prodrequestno
        );
        if (!checkIDcongViecTonTai) {
          let songuyen: number = Math.trunc(uploadAmazonData.length / 1000);
          for (let i = 1; i <= songuyen; i++) {
            await generalQuery("insertData_Amazon_SuperFast", {
              AMZDATA: uploadAmazonData.filter(
                (e: UploadAmazonData) => {
                  let rowno: number = e.ROW_NO === undefined ? 0 : e.ROW_NO;
                  return rowno >= i * 1000 - 1000 && rowno <= i * 1000 - 1;
                }
              ),
            })
              .then((response) => {
                if (response.data.tk_status !== "NG") {
                  setProgressValue(i * 2 * 1000);
                }
              })
              .catch(() => {});
          }
          await generalQuery("insertData_Amazon_SuperFast", {
            AMZDATA: uploadAmazonData.filter(
              (e: UploadAmazonData) => {
                let rowno: number = e.ROW_NO === undefined ? 0 : e.ROW_NO;
                return (
                  rowno >= songuyen * 1000 && rowno <= uploadAmazonData.length
                );
              }
            ),
          })
            .then((response) => {
              if (response.data.tk_status !== "NG") {
                setProgressValue(uploadAmazonData.length * 2);
              }
            })
            .catch(() => {});
          setUploadExcelJSon([]);
          f_checkDuplicateAMZ();
          Swal.fire("Thông báo", "Upload dữ liệu Amazon thành công", "success");
        } else {
          Swal.fire(
            "Thông báo",
            "ID công việc hoặc số yêu cầu đã tồn tại",
            "error"
          );
        }
      } else {
        Swal.fire("Thông báo", "Dữ liệu trùng, vui lòng kiểm tra lại", "error");
      }
    } else {
      Swal.fire("Thông báo", "Đây không phải là yêu cầu sản xuất AMZ", "error");
    }
  };

  // Upload Bản vẽ PDF
  const handleUploadBanVe = async (file: any, rowData: any) => {
    if (userData?.MAINDEPTNAME === "KD") {
      uploadQuery(file, rowData.G_CODE + ".pdf", "banve")
        .then((response) => {
          if (response.data.tk_status !== "NG") {
            generalQuery("update_banve_value", {
              G_CODE: rowData.G_CODE,
              banvevalue: "Y",
            }).then((res2) => {
              if (res2.data.tk_status !== "NG") {
                setYcsxDataTable((prev) =>
                  prev.map((el) =>
                    el.PROD_REQUEST_NO === rowData.PROD_REQUEST_NO
                      ? { ...el, BANVE: "Y" }
                      : el
                  )
                );
                Swal.fire("Thông báo", "Upload bản vẽ thành công", "success");
              } else {
                Swal.fire("Thông báo", "Cập nhật bản vẽ thất bại", "error");
              }
            });
          } else {
            Swal.fire("Thông báo", "Upload bản vẽ thất bại", "error");
          }
        })
        .catch(() => {
          Swal.fire("Thông báo", "Lỗi đường truyền khi upload bản vẽ", "error");
        });
    } else {
      Swal.fire("Thông báo", "Chỉ bộ phận KD mới được upload bản vẽ", "error");
    }
  };

  // Print triggers
  const handlePrintYCSX = () => {
    if (ycsxdatatablefilter.current.length === 0) {
      Swal.fire("Thông báo", "Vui lòng chọn ít nhất 1 YCSX để in", "warning");
      return;
    }
    setOpenYCSXPrint(true);
  };

  const handlePrintBanVe = () => {
    if (ycsxdatatablefilter.current.length === 0) {
      Swal.fire("Thông báo", "Vui lòng chọn ít nhất 1 YCSX để in bản vẽ", "warning");
      return;
    }
    setOpenBanVePrint(true);
  };

  // Go to Amazon sub-tab with selected row
  const handleGoToAmazon = () => {
    if (ycsxdatatablefilter.current.length === 1) {
      const selected = ycsxdatatablefilter.current[0];
      setProdRequestNo(selected.PROD_REQUEST_NO);
      handle_findAmazonCodeInfo(selected.PROD_REQUEST_NO);
      setActiveTab("amazon");
      setIsAmzAddModalOpen(true);
    } else if (ycsxdatatablefilter.current.length > 1) {
      Swal.fire("Thông báo", "Chỉ chọn 1 YCSX để qua Amazon", "error");
    } else {
      Swal.fire("Thông báo", "Chọn ít nhất 1 YCSX để qua Amazon", "error");
    }
  };

  return {
    userData,
    activeTab,
    setActiveTab,
    // Modals
    isAddModalOpen,
    setIsAddModalOpen,
    isEditModalOpen,
    setIsEditModalOpen,
    openYCSXPrint,
    setOpenYCSXPrint,
    openBanVePrint,
    setOpenBanVePrint,
    isAmzAddModalOpen,
    setIsAmzAddModalOpen,
    showPivot,
    setShowPivot,
    // Filter
    fromdate,
    setFromDate,
    todate,
    setToDate,
    codeKD,
    setCodeKD,
    codeCMS,
    setCodeCMS,
    empl_name,
    setEmpl_Name,
    cust_name,
    setCust_Name,
    prod_type,
    setProdType,
    prodrequestno,
    setProdRequestNo,
    alltime,
    setAllTime,
    materialYES,
    setMaterialYES,
    phanloai,
    setPhanLoai,
    phanloaihang,
    setPhanLoaiHang,
    material,
    setMaterial,
    ycsxpendingcheck,
    setYCSXPendingCheck,
    inspectInputcheck,
    setInspectInputCheck,
    handletraYCSX,
    handleSearchCodeKeyDown,
    // Form & Lists
    customerList,
    codeList,
    ponolist,
    selectedCust_CD,
    setSelectedCust_CD,
    selectedCode,
    setSelectedCode,
    selectedPoNo,
    setSelectedPoNo,
    loadPONO,
    deliverydate,
    setNewDeliveryDate,
    newycsxqty,
    setNewYcsxQty,
    newycsxremark,
    setNewYcsxRemark,
    newphanloai,
    setNewPhanLoai,
    loaisx,
    setLoaiSX,
    loaixh,
    setLoaiXH,
    isFirstLOT,
    setIsFirstLot,
    is_tam_thoi,
    setIs_Tam_Thoi,
    selectedID,
    clearYCSXform,
    // Table
    ycsxDataTable,
    setYcsxDataTable,
    ycsxdatatablefilter,
    ycsxdatatablefilterexcel,
    clickedRows,
    setClickedRows,
    handle_fillsuaform,
    updateYCSX,
    handleConfirmDeleteYCSX,
    handleConfirmPDuyetYCSX,
    handleConfirmSetPendingYCSX,
    handleConfirmSetClosedYCSX,
    handleConfirmLockMaterial,
    handleConfirmUnLockMaterial,
    handleConfirmOpenYCSX,
    handleConfirmLockYCSX,
    handle_add_1YCSX,
    handleUploadBanVe,
    handlePrintYCSX,
    handlePrintBanVe,
    handleGoToAmazon,
    // Excel
    uploadExcelJson,
    setUploadExcelJSon,
    readUploadFile,
    confirmCheckYcsxHangLoat,
    confirmUpYcsxHangLoat,
    handle_InsertYCSXTable,
    handle_DeleteYCSX_Excel,
    isLoading,
    // Amazon
    id_congviec,
    setID_CongViec,
    cavityAmazon,
    prod_model,
    amz_PL_HANG,
    progressvalue,
    handle_findAmazonCodeInfo,
    readUploadFileAmazon,
    upAmazonDataSuperFast,
    f_checkDuplicateAMZ,
  };
};
