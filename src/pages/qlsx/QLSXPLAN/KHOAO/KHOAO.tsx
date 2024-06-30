import moment from "moment";
import { useEffect, useRef, useState } from "react";
import Swal from "sweetalert2";
import { generalQuery } from "../../../../api/Api";
import { checkBP } from "../../../../api/GlobalFunction";
import "./KHOAO.scss";
import { useSelector } from "react-redux";
import { RootState } from "../../../../redux/store";
import {
  LICHSUNHAPKHOAO,
  LICHSUXUATKHOAO,
  QLSXPLANDATA,
  TONLIEUXUONG,
  UserData,
} from "../../../../api/GlobalInterface";
import AGTable from "../../../../components/DataTable/AGTable";
const KHOAO = ({ NEXT_PLAN }: { NEXT_PLAN?: string }) => {
  const [nextPermission, setNextPermission] = useState(true);
  const [selectionModel_INPUTSX, setSelectionModel_INPUTSX] = useState<any>([]);
  const [readyRender, setReadyRender] = useState(false);
  const userData: UserData | undefined = useSelector(
    (state: RootState) => state.totalSlice.userData,
  );
  const [isLoading, setisLoading] = useState(false);
  const [fromdate, setFromDate] = useState(moment().format("YYYY-MM-DD"));
  const [todate, setToDate] = useState(moment().format("YYYY-MM-DD"));
  const [factory, setFactory] = useState("ALL");
  const [machine, setMachine] = useState("ALL");
  const [plandatatable, setPlanDataTable] = useState<QLSXPLANDATA[]>([]);
  const [datatable, setDataTable] = useState<any[]>([]);
  const [current_Column, setCurrent_Column] = useState<any[]>([]);
  const [qlsxplandatafilter, setQlsxPlanDataFilter] = useState<
    Array<QLSXPLANDATA>
  >([]);
  const tonkhoaodatafilter = useRef<Array<TONLIEUXUONG>>([]);
  const [nextPlan, setNextPlan] = useState(
    NEXT_PLAN === undefined ? "" : NEXT_PLAN,
  );
  const [tonkhoaotable, setTonKhoAoTable] = useState<Array<TONLIEUXUONG>>([]);
  const [lichsunhapkhoao, setLichSuNhapKhoAo] = useState<
    Array<LICHSUNHAPKHOAO>
  >([]);
  const [lichsuxuatkhoao, setLichSuXuatKhoAo] = useState<
    Array<LICHSUXUATKHOAO>
  >([]);
  const [tableTitle, setTableTitle] = useState("");
  const column_nhapkhoaotable = [
    { field: "IN_KHO_ID", headerName: "IN_KHO_ID", width: 100 },
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
  ];
  const column_xuatkhoaotable = [
    { field: "OUT_KHO_ID", headerName: "OUT_KHO_ID", width: 100 },
    { field: "FACTORY", headerName: "FACTORY", width: 80 },
    { field: "PHANLOAI", headerName: "PHANLOAI", width: 80 },
    { field: "M_CODE", headerName: "M_CODE", width: 80 },
    { field: "M_NAME", headerName: "M_NAME", width: 150 },
    { field: "WIDTH_CD", headerName: "WIDTH_CD", width: 80 },
    { field: "M_LOT_NO", headerName: "M_LOT_NO", width: 120 },
    { field: "PLAN_ID_INPUT", headerName: "PLAN_ID_INPUT", width: 120 },
    { field: "PLAN_ID_OUTPUT", headerName: "PLAN_ID_OUTPUT", width: 120 },
    { field: "ROLL_QTY", headerName: "ROLL_QTY", width: 80 },
    { field: "OUT_QTY", headerName: "OUT_QTY", width: 80 },
    { field: "TOTAL_OUT_QTY", headerName: "TOTAL_OUT_QTY", width: 80 },
    { field: "INS_DATE", headerName: "INS_DATE", width: 150 },
  ];
  const column_tonkhoaotable = [
    { field: "IN_KHO_ID", headerName: "IN_KHO_ID", width: 100, headerCheckboxSelection: true, 
    checkboxSelection: true, },
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
    { field: "M_LOT_NO", headerName: "M_LOT_NO", width: 90, editable: false },
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
  ];
  const load_nhapkhoao = () => {
    generalQuery("lichsunhapkhoao", {
      FROM_DATE: fromdate,
      TO_DATE: todate,
      FACTORY: factory,
    })
      .then((response) => {
        //console.log(response.data.data);
        if (response.data.tk_status !== "NG") {
          let loadeddata = response.data.data.map(
            (element: LICHSUNHAPKHOAO, index: number) => {
              return {
                ...element,
                INS_DATE: moment
                  .utc(element.INS_DATE)
                  .format("YYYY-MM-DD HH:mm:ss"),
                id: index,
              };
            },
          );
          //console.log(loadeddata);
          setDataTable(loadeddata);
          setCurrent_Column(column_nhapkhoaotable);
          setReadyRender(true);
          setisLoading(false);
          setTableTitle("LỊCH SỬ NHẬP KHO ẢO");
          Swal.fire(
            "Thông báo",
            "Đã load: " + response.data.data.length + " dòng",
            "success",
          );
        } else {
          setDataTable([]);
          Swal.fire("Thông báo", "Nội dung: " + response.data.message, "error");
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const load_xuatkhoao = () => {
    generalQuery("lichsuxuatkhoao", {
      FROM_DATE: fromdate,
      TO_DATE: todate,
      FACTORY: factory,
    })
      .then((response) => {
        //console.log(response.data.data);
        if (response.data.tk_status !== "NG") {
          let loadeddata = response.data.data.map(
            (element: LICHSUXUATKHOAO, index: number) => {
              return {
                ...element,
                INS_DATE: moment
                  .utc(element.INS_DATE)
                  .format("YYYY-MM-DD HH:mm:ss"),
                id: index,
              };
            },
          );
          //console.log(loadeddata);
          setDataTable(loadeddata);
          setReadyRender(true);
          setisLoading(false);
          setTableTitle("LỊCH SỬ XUẤT KHO ẢO");
          Swal.fire(
            "Thông báo",
            "Đã load: " + response.data.data.length + " dòng",
            "success",
          );
        } else {
          setDataTable([]);
          Swal.fire("Thông báo", "Nội dung: " + response.data.message, "error");
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const handle_loadKhoAo = (shownotification: boolean) => {
    generalQuery("checktonlieutrongxuong", {
      FACTORY: factory,
    })
      .then((response) => {
        //console.log(response.data.data);
        if (response.data.tk_status !== "NG") {
          const loadeddata: TONLIEUXUONG[] = response.data.data.map(
            (element: TONLIEUXUONG, index: number) => {
              return {
                ...element,
                id: index,
              };
            },
          );
          setDataTable(loadeddata);
          setCurrent_Column(column_tonkhoaotable);
          setReadyRender(true);
          setisLoading(false);
          setTableTitle("TỒN KHO ẢO");
          if (shownotification)
            Swal.fire(
              "Thông báo",
              "Đã load: " + response.data.data.length + " dòng",
              "success",
            );
        } else {
          setDataTable([]);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const checktontaiMlotPlanIdSuDung = async (NEXT_PLAN: string, M_LOT_NO: string) => {
    let checkTonTai: boolean = false;
    await generalQuery("checkTonTaiXuatKhoAo", {
      PLAN_ID: NEXT_PLAN,
      M_LOT_NO: M_LOT_NO
    })
      .then((response) => {
        console.log(response.data.data);
        if (response.data.tk_status !== "NG") {
          checkTonTai = false;
        } else {
          checkTonTai = true;
        }
      })
      .catch((error) => {
        console.log(error);
      });
    return checkTonTai;
  }
  const checkNextPlanFSC = async (NEXT_PLAN: string) => {
    let checkFSC: string = "N", checkFSC_CODE='01';
    await generalQuery("checkFSC_PLAN_ID", {
      PLAN_ID: NEXT_PLAN,
    })
      .then((response) => {
        console.log(response.data.data);
        if (response.data.tk_status !== "NG") {
          checkFSC = response.data.data[0].FSC;
          checkFSC_CODE = response.data.data[0].FSC_CODE;
        } else {
        }
      })
      .catch((error) => {
        console.log(error);
      });
    return {FSC: checkFSC, FSC_CODE: checkFSC_CODE};
  };
  const checkNhapKhoTPDuHayChua = async (NEXT_PLAN: string) => {
    let checkNhapKho: string = "N";
    await generalQuery("checkYcsxStatus", {
      PLAN_ID: NEXT_PLAN,
    })
      .then((response) => {
        console.log(response.data.data);
        if (response.data.tk_status !== "NG") {
          checkNhapKho = response.data.data[0].USE_YN;
        } else {
        }
      })
      .catch((error) => {
        console.log(error);
      });
    return checkNhapKho;
  }
  const handle_xuatKhoAo = async () => {
    //console.log(nextPlan);
    if (nextPlan !== "" && nextPlan !== undefined) {
      if (tonkhoaodatafilter.current.length > 0) {
        let err_code: string = "0";
        for (let i = 0; i < tonkhoaodatafilter.current.length; i++) {
          let checkYCSX_USE_YN: string = await checkNhapKhoTPDuHayChua(nextPlan);
          let checktontaikhoao: boolean = await checktontaiMlotPlanIdSuDung(nextPlan, tonkhoaodatafilter.current[i].M_LOT_NO);
          let checklieuchithi: boolean = true;
          await generalQuery("checkM_CODE_CHITHI", {
            PLAN_ID_OUTPUT: nextPlan,
            M_CODE: tonkhoaodatafilter.current[i].M_CODE,
          })
            .then((response) => {
              console.log(response.data.data);
              if (response.data.tk_status !== "NG") {
                checklieuchithi = true;
              } else {
                checklieuchithi = false;
              }
            })
            .catch((error) => {
              console.log(error);
            });
          let checkFSC: string = (await checkNextPlanFSC(nextPlan)).FSC;
          let checkFSC_CODE: string = (await checkNextPlanFSC(nextPlan)).FSC_CODE;
          if (
            checklieuchithi === true &&
            nextPlan !== tonkhoaodatafilter.current[i].PLAN_ID_INPUT &&
            checkFSC === tonkhoaodatafilter.current[i].FSC &&
            checktontaikhoao &&
            checkYCSX_USE_YN === 'Y'
          ) {
            await generalQuery("xuatkhoao", {
              FACTORY: tonkhoaodatafilter.current[i].FACTORY,
              PHANLOAI: "N",
              PLAN_ID_INPUT: tonkhoaodatafilter.current[i].PLAN_ID_INPUT,
              PLAN_ID_OUTPUT: nextPlan,
              M_CODE: tonkhoaodatafilter.current[i].M_CODE,
              M_LOT_NO: tonkhoaodatafilter.current[i].M_LOT_NO,
              ROLL_QTY: tonkhoaodatafilter.current[i].ROLL_QTY,
              OUT_QTY: tonkhoaodatafilter.current[i].IN_QTY,
              TOTAL_OUT_QTY: tonkhoaodatafilter.current[i].TOTAL_IN_QTY,
              USE_YN: "O",
            })
              .then((response) => {
                console.log(response.data.tk_status);
                if (response.data.tk_status !== "NG") {
                  generalQuery("setUSE_YN_KHO_AO_INPUT", {
                    FACTORY: tonkhoaodatafilter.current[i].FACTORY,
                    PHANLOAI: tonkhoaodatafilter.current[i].PHANLOAI,
                    PLAN_ID_INPUT: tonkhoaodatafilter.current[i].PLAN_ID_INPUT,
                    PLAN_ID_SUDUNG: nextPlan,
                    M_CODE: tonkhoaodatafilter.current[i].M_CODE,
                    M_LOT_NO: tonkhoaodatafilter.current[i].M_LOT_NO,
                    TOTAL_IN_QTY: tonkhoaodatafilter.current[i].TOTAL_IN_QTY,
                    USE_YN: "O",
                    IN_KHO_ID: tonkhoaodatafilter.current[i].IN_KHO_ID,
                  })
                    .then((response) => {
                      console.log(response.data);
                      if (response.data.tk_status !== "NG") {
                      } else {
                      }
                    })
                    .catch((error) => {
                      console.log(error);
                    });
                } else {
                  err_code += "| " + response.data.message;
                }
              })
              .catch((error) => {
                console.log(error);
              });
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
        let check_2_m_code_in_kho_ao: boolean = false;
        let check_m_lot_exist_p500: boolean = false;
        await generalQuery("check_2_m_code_in_kho_ao", {
          PLAN_ID_INPUT: tonkhoaodatafilter.current[i].PLAN_ID_INPUT,
        })
          .then((response) => {
            //console.log(response.data.data);
            if (response.data.tk_status !== "NG") {
              if (response.data.data[0].COUNT_M_CODE > 1) {
                check_2_m_code_in_kho_ao = true;
              } else {
              }
            } else {
            }
          })
          .catch((error) => {
            console.log(error);
          });
        await generalQuery("check_m_lot_exist_p500", {
          PLAN_ID_INPUT: tonkhoaodatafilter.current[i].PLAN_ID_INPUT,
          M_LOT_NO: tonkhoaodatafilter.current[i].M_LOT_NO,
        })
          .then((response) => {
            //console.log(response.data.data);
            if (response.data.tk_status !== "NG") {
              if (response.data.data.length > 0) {
                check_m_lot_exist_p500 = true;
              } else {
              }
            } else {
            }
          })
          .catch((error) => {
            console.log(error);
          });
        if (check_2_m_code_in_kho_ao && !check_m_lot_exist_p500) {
          console.log("check_2_m_code_in_kho_ao", check_2_m_code_in_kho_ao);
          console.log("check_m_lot_exist_p500", check_m_lot_exist_p500);
          Swal.fire("Thông báo", "Xóa kho ảo thành công", "success");
          await generalQuery("delete_in_kho_ao", {
            IN_KHO_ID: tonkhoaodatafilter.current[i].IN_KHO_ID,
          })
            .then((response) => {
              //console.log(response.data.data);
              if (response.data.tk_status !== "NG") {
                if (response.data.data.length > 0) {
                  check_m_lot_exist_p500 = true;
                }
              } else {
              }
            })
            .catch((error) => {
              console.log(error);
            });
          await generalQuery("delete_out_kho_ao", {
            PLAN_ID_INPUT: tonkhoaodatafilter.current[i].PLAN_ID_INPUT,
            M_LOT_NO: tonkhoaodatafilter.current[i].M_LOT_NO,
          })
            .then((response) => {
              //console.log(response.data.data);
              if (response.data.tk_status !== "NG") {
                if (response.data.data.length > 0) {
                  check_m_lot_exist_p500 = true;
                }
              } else {
              }
            })
            .catch((error) => {
              console.log(error);
            });
        } else {
          //console.log('check_2_m_code_in_kho_ao',check_2_m_code_in_kho_ao);
          //console.log('check_m_lot_exist_p500',check_m_lot_exist_p500);
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
    if (tonkhoaodatafilter.current.length > 0) {
      let err_code: string = "0";
      for (let i = 0; i < tonkhoaodatafilter.current.length; i++) {
        await generalQuery("an_lieu_kho_ao", {
          IN_KHO_ID: tonkhoaodatafilter.current[i].IN_KHO_ID,
        })
          .then((response) => {
            //console.log(response.data.data);
            if (response.data.tk_status !== "NG") {
            } else {
            }
          })
          .catch((error) => {
            console.log(error);
          });
      }
      if (err_code !== "0") {
        Swal.fire("Thông báo", "Có lỗi: " + err_code, "error");
      }
      //handle_loadKhoAo();
    } else {
      Swal.fire("Thông báo", "Chọn ít nhất 1 liệu để ẩn", "error");
    }
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
                TỒN KHO ẢO
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
                      handle_xuatKhoAo
                    ); */
                    checkBP(
                      userData,
                      ["QLSX"],
                      ["ALL"],
                      ["ALL"],
                      handle_xuatKhoAo,
                    );
                  } else {
                    Swal.fire(
                      "Thông báo",
                      "Đang không ở tab tồn kho ảo",
                      "error",
                    );
                  }
                  //handle_xuatKhoAo();
                }}
              >
                XUẤT NEXT
              </button>
              <button
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
              </button>
            </div>
            <div className="forminputcolumn">
              <button
                className="xoakhoao"
                onClick={() => {
                  handle_nhappassword_xoarac();
                  //handle_xuatKhoAo();
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
            </div>
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
export default KHOAO;
