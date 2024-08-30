import moment from "moment";
import { useEffect, useRef, useState } from "react";
import Swal from "sweetalert2";
import {
  checkBP,
  datediff,
  f_anrackhoao,
  f_checkMlotTonKhoSub,
  f_checkNextPlanFSC,
  f_checkNhapKhoTPDuHayChua,
  f_checktontaiMlotPlanIdSuDung,
  f_delete_IN_KHO_AO,
  f_delete_OUT_KHO_AO,
  f_is2MCODE_IN_KHO_AO,
  f_isM_CODE_CHITHI,
  f_isM_LOT_NO_in_P500,
  f_isNextPlanClosed,
  f_load_nhapkhosub,
  f_load_tonkhosub,
  f_set_YN_KHO_SUB_INPUT,
} from "../../../../api/GlobalFunction";
import "./KHOAO.scss";
import { useSelector } from "react-redux";
import { RootState } from "../../../../redux/store";
import { LICHSUNHAPKHOAO, TONLIEUXUONG, UserData } from "../../../../api/GlobalInterface";
import AGTable from "../../../../components/DataTable/AGTable";
const KHOSUB = ({ NEXT_PLAN }: { NEXT_PLAN?: string }) => {
  const [nextPermission, setNextPermission] = useState(true);
  const [readyRender, setReadyRender] = useState(false);
  const userData: UserData | undefined = useSelector(
    (state: RootState) => state.totalSlice.userData,
  );
  const [isLoading, setisLoading] = useState(false);
  const [fromdate, setFromDate] = useState(moment().format("YYYY-MM-DD"));
  const [todate, setToDate] = useState(moment().format("YYYY-MM-DD"));
  const [factory, setFactory] = useState("ALL");
  const [datatable, setDataTable] = useState<any[]>([]);
  const [current_Column, setCurrent_Column] = useState<any[]>([]);
  const tonkhoaodatafilter = useRef<Array<TONLIEUXUONG>>([]);
  const [nextPlan, setNextPlan] = useState(
    NEXT_PLAN === undefined ? "" : NEXT_PLAN,
  );
  const [tableTitle, setTableTitle] = useState("");
  const column_nhapkhoaotable = [
    {
      field: "IN_KHO_ID", headerName: "IN_KHO_ID", width: 100, headerCheckboxSelection: true,
      checkboxSelection: true,
    },
    { field: "FACTORY", headerName: "FACTORY", width: 100 },
    { field: "PHANLOAI", headerName: "PHANLOAI", width: 80 },
    { field: "M_CODE", headerName: "M_CODE", width: 80 },
    { field: "M_NAME", headerName: "M_NAME", width: 150 },
    { field: "WIDTH_CD", headerName: "WIDTH_CD", width: 80 },
    { field: "M_LOT_NO", headerName: "M_LOT_NO", width: 120 },
    { field: "PLAN_ID_INPUT", headerName: "PLAN_ID_INPUT", width: 120 },
    { field: "ROLL_QTY", headerName: "ROLL_QTY", width: 80 },
    { field: "IN_QTY", headerName: "IN_QTY", width: 80 },
    { field: "TOTAL_IN_QTY", headerName: "TOTAL_IN_QTY", width: 120 },
    { field: "PLAN_ID_SUDUNG", headerName: "PLAN_ID_SUDUNG", width: 120 },
    { field: "USE_YN", headerName: "USE_YN", width: 90 },
    { field: "REMARK", headerName: "REMARK", width: 90 },
    { field: "INS_DATE", headerName: "INS_DATE", width: 150 },
    { field: "KHO_CFM_DATE", headerName: "KHO_CFM_DATE", width: 100 },
    { field: "RETURN_STATUS", headerName: "RETURN_STATUS", width: 100 },
  ];
  const column_tonkhoaotable = [
    {
      field: "IN_KHO_ID", headerName: "IN_KHO_ID", width: 100, headerCheckboxSelection: true,
      checkboxSelection: true,
    },
    { field: "FACTORY", headerName: "NM", width: 60, editable: false },
    {
      field: "PLAN_ID_INPUT",
      headerName: "PLAN_ID",
      width: 80,
      editable: false,
    },
    { field: "PHANLOAI", headerName: "PL", width: 40, editable: false },
    { field: "M_CODE", headerName: "M_CODE", width: 80, editable: false },
    {
      field: "M_NAME",
      headerName: "M_NAME",
      width: 120,
      editable: false,
      cellRenderer: (params: any) => {
        if (params.data.LIEUQL_SX === 1) {
          return (
            <span style={{ color: "red", fontWeight: "bold" }}>
              {params.data.M_NAME}
            </span>
          );
        } else {
          return <span style={{ color: "black" }}>{params.data.M_NAME}</span>;
        }
      },
    },
    { field: "WIDTH_CD", headerName: "SIZE", width: 50, editable: false },
    {
      field: "M_LOT_NO", headerName: "M_LOT_NO", width: 90, editable: false, cellRenderer: (params: any) => {
        const date1 = moment.utc().format('YYYY-MM-DD');
        const date2 = params.data.INS_DATE;
        var diff: number = datediff(date1, date2);
        let ins_weekday = moment.utc(date2).weekday();
        if (ins_weekday >= 5) diff = diff - 2;
        if (diff > 1) {
          return (
            <span style={{ color: "red", fontWeight: "bold" }}>
              {params.data.M_LOT_NO}
            </span>
          );
        } else {
          return <span style={{ color: "green" }}>{params.data.M_LOT_NO}</span>;
        }
      },
    },
    {
      field: "ROLL_QTY",
      headerName: "ROLL_QTY",
      width: 70,
      editable: false,
      cellRenderer: (params: any) => {
        if (params.data.PHANLOAI !== "F") {
          return (
            <span style={{ color: "blue" }}>
              {params.data.ROLL_QTY?.toLocaleString("en", "US")}
            </span>
          );
        } else {
          return (
            <span style={{ color: "red", fontWeight: "bold" }}>
              {params.data.ROLL_QTY?.toLocaleString("en", "US")}
            </span>
          );
        }
      },
    },
    {
      field: "IN_QTY",
      headerName: "IN_QTY",
      width: 70,
      editable: false,
      cellRenderer: (params: any) => {
        if (params.data.PHANLOAI !== "F") {
          return (
            <span style={{ color: "blue" }}>
              {params.data.IN_QTY?.toLocaleString("en", "US")}
            </span>
          );
        } else {
          return (
            <span style={{ color: "red", fontWeight: "bold" }}>
              {params.data.IN_QTY?.toLocaleString("en", "US")}
            </span>
          );
        }
      },
    },
    {
      field: "TOTAL_IN_QTY",
      headerName: "TOTAL_IN_QTY",
      width: 120,
      editable: false,
      cellRenderer: (params: any) => {
        if (params.data.PHANLOAI !== "F") {
          return (
            <span style={{ color: "green", fontWeight: "bold" }}>
              {params.data.TOTAL_IN_QTY?.toLocaleString("en", "US")}
            </span>
          );
        } else {
          return (
            <span style={{ color: "red", fontWeight: "bold" }}>
              {params.data.TOTAL_IN_QTY?.toLocaleString("en", "US")}
            </span>
          );
        }
      },
    },
    {
      field: "FSC",
      headerName: "FSC",
      width: 120,
      editable: false,
      cellRenderer: (params: any) => {
        if (params.data.PHANLOAI === "Y") {
          return (
            <span style={{ color: "green", fontWeight: "bold" }}>YES</span>
          );
        } else {
          return <span style={{ color: "red", fontWeight: "bold" }}>NO</span>;
        }
      },
    },
    { field: "PLAN_EQ", headerName: "MACHINE", width: 70, editable: false },
    { field: "INS_DATE", headerName: "INS_DATE", width: 100, editable: false },
  ];
  const load_nhapkhoao = async () => {
    let lsnhapkhoao: LICHSUNHAPKHOAO[] = await f_load_nhapkhosub({
      FROM_DATE: fromdate,
      TO_DATE: todate,
      FACTORY: factory,
    });
    setDataTable(lsnhapkhoao);
    setCurrent_Column(column_nhapkhoaotable);
    setReadyRender(true);
    setisLoading(false);
    setTableTitle("LỊCH SỬ NHẬP Kho SX SUB");
    if (lsnhapkhoao.length > 0) {
      Swal.fire(
        "Thông báo",
        "Đã load: " + lsnhapkhoao.length + " dòng",
        "success",
      );
    }
    else {
      Swal.fire("Thông báo", "Không có dòng nào", "error");
    }
  };
  const handle_loadKhoAo = async (shownotification: boolean) => {
    let tonkhoao: TONLIEUXUONG[] = await f_load_tonkhosub({
      FACTORY: factory,
    });
    setDataTable(tonkhoao);
    setCurrent_Column(column_tonkhoaotable);
    setReadyRender(true);
    setisLoading(false);
    setTableTitle("TỒN Kho SX SUB");
    if (tonkhoao.length > 0) {
      if (shownotification)
        Swal.fire(
          "Thông báo",
          "Đã load: " + tonkhoao.length + " dòng",
          "success",
        );
    }
    else {
      Swal.fire("Thông báo", "Không có dòng nào", "error");
    }
  };
  const handle_xuatKhoSub = async () => {
    //console.log(nextPlan);
    if (nextPlan !== "" && nextPlan !== undefined) {
      if (tonkhoaodatafilter.current.length > 0) {
        let err_code: string = "0";
        for (let i = 0; i < tonkhoaodatafilter.current.length; i++) {
          let checkYCSX_USE_YN: string = await f_checkNhapKhoTPDuHayChua(nextPlan);
          let checktontaikhoao: boolean = await f_checktontaiMlotPlanIdSuDung(nextPlan, tonkhoaodatafilter.current[i].M_LOT_NO);
          let checklieuchithi: boolean = await f_isM_CODE_CHITHI(nextPlan, tonkhoaodatafilter.current[i].M_CODE);
          let isTonKhoAoMLOTNO: boolean = await f_checkMlotTonKhoSub(tonkhoaodatafilter.current[i].M_LOT_NO)
          let checkNextPlanClosed = await f_isNextPlanClosed(nextPlan);
          let checkFSC: string = (await f_checkNextPlanFSC(nextPlan)).FSC;
          var date1 = moment.utc().format('YYYY-MM-DD');
          var date2 = tonkhoaodatafilter.current[i].INS_DATE;
          var diff: number = datediff(date1, date2);
          let ins_weekday = moment.utc(date2).weekday();
          if (ins_weekday >= 5) diff = diff - 2;
          let isExpired: boolean = diff > 1;
          let checkFSC_CODE: string = (await f_checkNextPlanFSC(nextPlan)).FSC_CODE;
          if (
            checklieuchithi === true &&
            nextPlan !== tonkhoaodatafilter.current[i].PLAN_ID_INPUT &&
            checkFSC === tonkhoaodatafilter.current[i].FSC &&
            checktontaikhoao &&
            checkYCSX_USE_YN === 'Y' &&
            !checkNextPlanClosed &&
            isTonKhoAoMLOTNO &&
            !isExpired
          ) {

            if (!(await f_set_YN_KHO_SUB_INPUT({
              FACTORY: tonkhoaodatafilter.current[i].FACTORY,
              PHANLOAI: tonkhoaodatafilter.current[i].PHANLOAI,
              PLAN_ID_INPUT: tonkhoaodatafilter.current[i].PLAN_ID_INPUT,
              PLAN_ID_SUDUNG: nextPlan,
              M_CODE: tonkhoaodatafilter.current[i].M_CODE,
              M_LOT_NO: tonkhoaodatafilter.current[i].M_LOT_NO,
              TOTAL_IN_QTY: tonkhoaodatafilter.current[i].TOTAL_IN_QTY,
              USE_YN: "X",
              IN_KHO_ID: tonkhoaodatafilter.current[i].IN_KHO_ID,
            }))) {
              err_code += "| Có lỗi trong quá trình set YN IN KHO SUB";
            }

          } else {
            if (!checklieuchithi) {
              err_code += `| Liệu:  ${tonkhoaodatafilter.current[i].M_NAME} chưa được đăng ký xuất liệu`;
            }
            else if (nextPlan === tonkhoaodatafilter.current[i].PLAN_ID_INPUT) {
              err_code += `| Liệu:  ${tonkhoaodatafilter.current[i].M_NAME} không thể xuất lại vào chỉ thị đã từng dùng nó`;
            }
            else if (checkFSC !== tonkhoaodatafilter.current[i].FSC) {
              err_code += `| Liệu:  ${tonkhoaodatafilter.current[i].M_NAME} không cùng trạng thái liệu FSC với code được chỉ thị vào`;
            }
            else if (!checktontaikhoao) {
              err_code += `| Liệu:  ${tonkhoaodatafilter.current[i].M_NAME} liệu này đã được xuát vào chỉ thị  ${nextPlan} rồi, không xuất lại được nữa`;
            }
            else if (checkYCSX_USE_YN !== 'Y') {
              err_code += `| YCSX đã nhập kho đủ, không thể input liệu để chạy nữa, chạy nữa là dư !`;
            }
            else if (checkNextPlanClosed === true) {
              err_code += `| Chỉ thị next đã chốt báo cáo, không thể input liệu!`;
            }
            else if (!isTonKhoAoMLOTNO) {
              err_code += `| Cuộn liệu đã được sử dụng!`;
            }
            else if (isExpired) {
              err_code += `| Cuộn liệu tồn quá lâu, hãy trả Kho NVL rồi sử dụng!`;
            }
          }
        }
        if (err_code !== "0") {
          Swal.fire("Thông báo", "Có lỗi: " + err_code, "error");
          handle_loadKhoAo(false);
        } else {
          handle_loadKhoAo(true);
          tonkhoaodatafilter.current = []
        }
      } else {
        Swal.fire("Thông báo", "Chọn ít nhất 1 liệu để xuất kho", "error");
      }
    } else {
      Swal.fire("Thông báo", "Chưa nhập next PLAN", "error");
    }
  };
  const handle_nhappassword_xoarac = async () => {
    const { value: pass1 } = await Swal.fire({
      title: "Xác nhận xóa rác",
      input: "password",
      inputLabel: "Nhập mật mã",
      inputValue: "",
      inputPlaceholder: "Mật mã",
      showCancelButton: true,
    });
    if (
      pass1 === "quantrisanxuat2023" &&
      (userData?.EMPL_NO === "DTL1906" ||
        userData?.EMPL_NO === "THU1402" ||
        userData?.EMPL_NO === "NHU1903")
    ) {
      handleConfirmXoaRac();
    } else {
      Swal.fire(
        "Thông báo",
        "Đã nhập sai mật mã hoặc tài khoản ko đủ quyền hạn!",
        "error",
      );
    }
  };
  const handle_nhappassword_anrac = async () => {
    const { value: pass1 } = await Swal.fire({
      title: "Xác nhận ẩn rác",
      input: "password",
      inputLabel: "Nhập mật mã",
      inputValue: "",
      inputPlaceholder: "Mật mã",
      showCancelButton: true,
    });
    if (
      pass1 === "quantrisanxuat2023" &&
      (userData?.EMPL_NO === "DTL1906" ||
        userData?.EMPL_NO === "THU1402" ||
        userData?.EMPL_NO === "NHU1903")
    ) {
      handleConfirmAnRac();
    } else {
      Swal.fire(
        "Thông báo",
        "Đã nhập sai mật mã hoặc tài khoản ko đủ quyền hạn!",
        "error",
      );
    }
  };
  const handleConfirmXoaRac = () => {
    Swal.fire({
      title: "Chắc chắn muốn Xóa liệu đã chọn ?",
      text: "Sẽ bắt đầu Xóa liệu đã chọn",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Vẫn Xóa!",
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire("Tiến hành Xóa", "Đang xóa hàng loạt", "success");
        checkBP(userData, ["SX"], ["ALL"], ["ALL"], handle_xoa_rac);
      }
    });
  };
  const handleConfirmAnRac = () => {
    Swal.fire({
      title: "Chắc chắn muốn Ẩn liệu đã chọn ?",
      text: "Sẽ bắt đầu Ẩn liệu đã chọn",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Vẫn Ẩn!",
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire("Tiến hành Ẩn", "Đang Ẩn hàng loạt", "success");
        checkBP(userData, ["SX"], ["ALL"], ["ALL"], handle_an_rac);
      }
    });
  };
  const handle_xoa_rac = async () => {
    if (tonkhoaodatafilter.current.length > 0) {
      let err_code: string = "0";
      for (let i = 0; i < tonkhoaodatafilter.current.length; i++) {
        let check_2_m_code_in_kho_ao: boolean = await f_is2MCODE_IN_KHO_AO(tonkhoaodatafilter.current[i].PLAN_ID_INPUT);
        let check_m_lot_exist_p500: boolean = await f_isM_LOT_NO_in_P500(tonkhoaodatafilter.current[i].PLAN_ID_INPUT, tonkhoaodatafilter.current[i].M_LOT_NO);
        if (check_2_m_code_in_kho_ao && !check_m_lot_exist_p500) {
          await f_delete_IN_KHO_AO(tonkhoaodatafilter.current[i].IN_KHO_ID);
          await f_delete_OUT_KHO_AO(tonkhoaodatafilter.current[i].PLAN_ID_INPUT, tonkhoaodatafilter.current[i].M_LOT_NO);
          Swal.fire("Thông báo", "Xóa Kho SX Main thành công", "success");
        } else {
          if (!check_2_m_code_in_kho_ao) {
            err_code += ` | ${tonkhoaodatafilter.current[i].M_LOT_NO}: Liệu chỉ có 1 liệu chính ko xóa được`;
          } else if (check_m_lot_exist_p500) {
            err_code += ` | ${tonkhoaodatafilter.current[i].M_LOT_NO}: Liệu đã input sx ko xóa được`;
          }
        }
      }
      if (err_code !== "0") {
        Swal.fire("Thông báo", "Có lỗi: " + err_code, "error");
      }
      //handle_loadKhoAo();
    } else {
      Swal.fire("Thông báo", "Chọn ít nhất 1 liệu để xóa", "error");
    }
  };
  const handle_an_rac = async () => {
    f_anrackhoao(tonkhoaodatafilter.current);
  };
  useEffect(() => {
    if (NEXT_PLAN === undefined) setNextPlan("");
    setisLoading(true);
    setReadyRender(false);
    setCurrent_Column(column_tonkhoaotable);
    handle_loadKhoAo(true);
    //setColumnDefinition(column_inspect_output);
  }, []);
  return (
    <div className="khoao">
      <div className="tracuuDataInspection">
        <div className="tracuuDataInspectionform">
          <div className="forminput">
            <div className="forminputcolumn">
              <label>
                <b>FROM DATE</b>
                <input
                  type="date"
                  value={fromdate.slice(0, 10)}
                  onChange={(e) => setFromDate(e.target.value)}
                ></input>
              </label>
              <label>
                <b>TO DATE</b>
                <input
                  type="date"
                  value={todate.slice(0, 10)}
                  onChange={(e) => setToDate(e.target.value)}
                ></input>
              </label>
            </div>
            <div className="forminputcolumn">
              <label>
                <b>FACTORY:</b>
                <select
                  name="phanloai"
                  value={factory}
                  onChange={(e) => {
                    setFactory(e.target.value);
                  }}
                >
                  <option value="ALL">ALL</option>
                  <option value="NM1">NM1</option>
                  <option value="NM2">NM2</option>
                </select>
              </label>
              <label>
                <b>NEXT PLAN</b>
                <input
                  type="text"
                  value={nextPlan}
                  onChange={(e) => setNextPlan(e.target.value)}
                ></input>
              </label>
            </div>
            <div className="forminputcolumn">
              <button
                className="tranhatky"
                onClick={() => {
                  setisLoading(true);
                  setReadyRender(false);
                  setCurrent_Column(column_tonkhoaotable);
                  setNextPermission(true);
                  handle_loadKhoAo(true);
                }}
              >
                TỒN KHO SUB
              </button>
              <button
                className="tranhatky"
                onClick={() => {
                  setisLoading(true);
                  setReadyRender(false);
                  setCurrent_Column(column_nhapkhoaotable);
                  setNextPermission(false);
                  load_nhapkhoao();
                }}
              >
                LS IN
              </button>
            </div>
            <div className="forminputcolumn">
              <button
                className="xuatnext"
                onClick={() => {
                  if (nextPermission) {
                    /*  checkBP(
                      userData?.EMPL_NO,
                      userData?.MAINDEPTNAME,
                      ["QLSX"],
                      handle_xuatKhoSub
                    ); */
                    checkBP(
                      userData,
                      ["QLSX"],
                      ["ALL"],
                      ["ALL"],
                      handle_xuatKhoSub,
                    );
                  } else {
                    Swal.fire(
                      "Thông báo",
                      "Đang không ở tab tồn Kho SX SUB",
                      "error",
                    );
                  }
                  //handle_xuatKhoSub();
                }}
              >
                XUẤT NEXT
              </button>
              {/* <button
                className="tranhatky"
                onClick={() => {
                  setisLoading(true);
                  setReadyRender(false);
                  setCurrent_Column(column_xuatkhoaotable);
                  setNextPermission(false);
                  load_xuatkhoao();
                }}
              >
                LS OUT
              </button> */}
            </div>
            {/* <div className="forminputcolumn">
              <button
                className="xoakhoao"
                onClick={() => {
                  handle_nhappassword_xoarac();
                  //handle_xuatKhoSub();
                }}
              >
                Xóa rác
              </button>
              <button
                className="xoakhoao"
                onClick={() => {
                  handle_nhappassword_anrac();
                }}
              >
                Ẩn rác
              </button>
            </div> */}
          </div>
          <div className="formbutton"></div>
        </div>
        <div className="tracuuYCSXTable">
          <AGTable
            toolbar={
              <div>
                <span className="div" style={{ fontSize: "1rem", fontWeight: "bold" }}>
                  {tableTitle}
                </span>
                <span className="div" style={{ fontSize: "1rem", fontWeight: "bold" }}>
                  _|_Liệu xuất next sẽ vào chỉ thị: {nextPlan}
                </span>
              </div>
            }
            showFilter={true}
            columns={current_Column}
            data={datatable}
            onCellEditingStopped={(params: any) => {
            }} onRowClick={(params: any) => {
              //console.log(e.data)
            }} onSelectionChange={(params: any) => {
              console.log(params)
              tonkhoaodatafilter.current = params!.api.getSelectedRows();
            }} />
        </div>
      </div>
    </div>
  );
};
export default KHOSUB;
