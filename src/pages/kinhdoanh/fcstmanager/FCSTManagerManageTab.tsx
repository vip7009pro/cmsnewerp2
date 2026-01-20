import { IconButton } from "@mui/material";
import moment from "moment";
import { useEffect, useMemo, useRef, useState } from "react";
import { FcSearch } from "react-icons/fc";
import Swal from "sweetalert2";
import { generalQuery, getAuditMode, getGlobalSetting } from "../../../api/Api";
import { checkBP } from "../../../api/GlobalFunction";
import { MdOutlineDelete, MdOutlinePivotTableChart } from "react-icons/md";
import { UserData, WEB_SETTING_DATA } from "../../../api/GlobalInterface";
import { RootState } from "../../../redux/store";
import { useSelector } from "react-redux";
import AGTable from "../../../components/DataTable/AGTable";
import { FCSTTableData } from "../interfaces/kdInterface";
import "./FCSTManagerManageTab.scss";

const FCSTManagerManageTab = () => {
  const theme: any = useSelector((state: RootState) => state.totalSlice.theme);
  const userData: UserData | undefined = useSelector((state: RootState) => state.totalSlice.userData);

  const [showhidesearchdiv] = useState(true);
  const [isLoading, setisLoading] = useState(false);
  const [fromdate, setFromDate] = useState(moment().format("YYYY-MM-DD"));
  const [todate, setToDate] = useState(moment().format("YYYY-MM-DD"));
  const [codeKD, setCodeKD] = useState("");
  const [codeCMS, setCodeCMS] = useState("");
  const [empl_name, setEmpl_Name] = useState("");
  const [cust_name, setCust_Name] = useState("");
  const [prod_type, setProdType] = useState("");
  const [id, setID] = useState("");
  const [alltime, setAllTime] = useState(false);
  const [justpobalance] = useState(true);
  const [po_no, setPo_No] = useState("");
  const [material, setMaterial] = useState("");
  const [over, setOver] = useState("");
  const [invoice_no, setInvoice_No] = useState("");

  const [fcstdatatable, setFCSTDataTable] = useState<Array<FCSTTableData>>([]);
  const fcstdatatablefilter = useRef<Array<FCSTTableData>>([]);
  const [showhidePivotTable, setShowHidePivotTable] = useState(false);

  const column_fcsttable: any = [
    { field: "FCST_ID", headerName: "FCST_ID", width: 80, headerCheckboxSelection: true, checkboxSelection: true },
    { field: "FCSTYEAR", headerName: "FCSTYEAR", width: 80 },
    { field: "FCSTWEEKNO", headerName: "FCSTWEEKNO", width: 80 },
    { field: "G_CODE", headerName: "G_CODE", width: 80 },
    { field: "G_NAME_KD", headerName: "G_NAME_KD", width: 120 },
    {
      field: "G_NAME",
      headerName: "G_NAME",
      width: 250,
      cellRenderer: (params: any) => {
        return (
          <span style={{ color: "red" }}>
            <b>{params.data.G_NAME}</b>
          </span>
        );
      },
    },
    { field: "DESCR", headerName: "DESCR", width: 120 },
    { field: "EMPL_NAME", headerName: "EMPL_NAME", width: 150 },
    { field: "CUST_NAME_KD", headerName: "CUST_NAME_KD", width: 80 },
    { field: "PROD_PROJECT", headerName: "PROD_PROJECT", width: 80 },
    { field: "PROD_MODEL", headerName: "PROD_MODEL", width: 80 },
    { field: "PROD_MAIN_MATERIAL", headerName: "PROD_MAIN_MATERIAL", width: 80 },
    { field: "PROD_PRICE", type: "number", headerName: "PROD_PRICE", width: 80 },
    {
      field: "W1",
      type: "number",
      headerName: "W1",
      width: 80,
      cellRenderer: (params: any) => (
        <span style={{ color: "blue" }}>
          <b>{params.data.W1?.toLocaleString("en-US")}</b>
        </span>
      ),
    },
    {
      field: "W2",
      type: "number",
      headerName: "W2",
      width: 80,
      cellRenderer: (params: any) => (
        <span style={{ color: "blue" }}>
          <b>{params.data.W2?.toLocaleString("en-US")}</b>
        </span>
      ),
    },
    {
      field: "W3",
      type: "number",
      headerName: "W3",
      width: 80,
      cellRenderer: (params: any) => (
        <span style={{ color: "blue" }}>
          <b>{params.data.W3?.toLocaleString("en-US")}</b>
        </span>
      ),
    },
    {
      field: "W4",
      type: "number",
      headerName: "W4",
      width: 80,
      cellRenderer: (params: any) => (
        <span style={{ color: "blue" }}>
          <b>{params.data.W4?.toLocaleString("en-US")}</b>
        </span>
      ),
    },
    {
      field: "W5",
      type: "number",
      headerName: "W5",
      width: 80,
      cellRenderer: (params: any) => (
        <span style={{ color: "blue" }}>
          <b>{params.data.W5?.toLocaleString("en-US")}</b>
        </span>
      ),
    },
    {
      field: "W6",
      type: "number",
      headerName: "W6",
      width: 80,
      cellRenderer: (params: any) => (
        <span style={{ color: "blue" }}>
          <b>{params.data.W6?.toLocaleString("en-US")}</b>
        </span>
      ),
    },
    {
      field: "W7",
      type: "number",
      headerName: "W7",
      width: 80,
      cellRenderer: (params: any) => (
        <span style={{ color: "blue" }}>
          <b>{params.data.W7?.toLocaleString("en-US")}</b>
        </span>
      ),
    },
    {
      field: "W8",
      type: "number",
      headerName: "W8",
      width: 80,
      cellRenderer: (params: any) => (
        <span style={{ color: "blue" }}>
          <b>{params.data.W8?.toLocaleString("en-US")}</b>
        </span>
      ),
    },
    {
      field: "W9",
      type: "number",
      headerName: "W9",
      width: 80,
      cellRenderer: (params: any) => (
        <span style={{ color: "blue" }}>
          <b>{params.data.W9?.toLocaleString("en-US")}</b>
        </span>
      ),
    },
    {
      field: "W10",
      type: "number",
      headerName: "W10",
      width: 80,
      cellRenderer: (params: any) => (
        <span style={{ color: "blue" }}>
          <b>{params.data.W10?.toLocaleString("en-US")}</b>
        </span>
      ),
    },
    {
      field: "W11",
      type: "number",
      headerName: "W11",
      width: 80,
      cellRenderer: (params: any) => (
        <span style={{ color: "blue" }}>
          <b>{params.data.W11?.toLocaleString("en-US")}</b>
        </span>
      ),
    },
    {
      field: "W12",
      type: "number",
      headerName: "W12",
      width: 80,
      cellRenderer: (params: any) => (
        <span style={{ color: "blue" }}>
          <b>{params.data.W12?.toLocaleString("en-US")}</b>
        </span>
      ),
    },
    {
      field: "W13",
      type: "number",
      headerName: "W13",
      width: 80,
      cellRenderer: (params: any) => (
        <span style={{ color: "blue" }}>
          <b>{params.data.W13?.toLocaleString("en-US")}</b>
        </span>
      ),
    },
    {
      field: "W14",
      type: "number",
      headerName: "W14",
      width: 80,
      cellRenderer: (params: any) => (
        <span style={{ color: "blue" }}>
          <b>{params.data.W14?.toLocaleString("en-US")}</b>
        </span>
      ),
    },
    {
      field: "W15",
      type: "number",
      headerName: "W15",
      width: 80,
      cellRenderer: (params: any) => (
        <span style={{ color: "blue" }}>
          <b>{params.data.W15?.toLocaleString("en-US")}</b>
        </span>
      ),
    },
    {
      field: "W16",
      type: "number",
      headerName: "W16",
      width: 80,
      cellRenderer: (params: any) => (
        <span style={{ color: "blue" }}>
          <b>{params.data.W16?.toLocaleString("en-US")}</b>
        </span>
      ),
    },
    {
      field: "W17",
      type: "number",
      headerName: "W17",
      width: 80,
      cellRenderer: (params: any) => (
        <span style={{ color: "blue" }}>
          <b>{params.data.W17?.toLocaleString("en-US")}</b>
        </span>
      ),
    },
    {
      field: "W18",
      type: "number",
      headerName: "W18",
      width: 80,
      cellRenderer: (params: any) => (
        <span style={{ color: "blue" }}>
          <b>{params.data.W18?.toLocaleString("en-US")}</b>
        </span>
      ),
    },
    {
      field: "W19",
      type: "number",
      headerName: "W19",
      width: 80,
      cellRenderer: (params: any) => (
        <span style={{ color: "blue" }}>
          <b>{params.data.W19?.toLocaleString("en-US")}</b>
        </span>
      ),
    },
    {
      field: "W20",
      type: "number",
      headerName: "W20",
      width: 80,
      cellRenderer: (params: any) => (
        <span style={{ color: "blue" }}>
          <b>{params.data.W20?.toLocaleString("en-US")}</b>
        </span>
      ),
    },
    {
      field: "W21",
      type: "number",
      headerName: "W21",
      width: 80,
      cellRenderer: (params: any) => (
        <span style={{ color: "blue" }}>
          <b>{params.data.W21?.toLocaleString("en-US")}</b>
        </span>
      ),
    },
    {
      field: "W22",
      type: "number",
      headerName: "W22",
      width: 80,
      cellRenderer: (params: any) => (
        <span style={{ color: "blue" }}>
          <b>{params.data.W22?.toLocaleString("en-US")}</b>
        </span>
      ),
    },
    {
      field: "W1A",
      type: "number",
      headerName: "W1A",
      width: 80,
      cellRenderer: (params: any) => (
        <span style={{ color: "green" }}>
          <b>
            {params.data.W1A?.toLocaleString("en-US", {
              style: "currency",
              currency:
                getGlobalSetting()?.filter((ele: WEB_SETTING_DATA) => ele.ITEM_NAME === "CURRENCY")[0]?.CURRENT_VALUE ??
                "USD",
            })}
          </b>
        </span>
      ),
    },
    {
      field: "W2A",
      type: "number",
      headerName: "W2A",
      width: 80,
      cellRenderer: (params: any) => (
        <span style={{ color: "green" }}>
          <b>
            {params.data.W2A?.toLocaleString("en-US", {
              style: "currency",
              currency:
                getGlobalSetting()?.filter((ele: WEB_SETTING_DATA) => ele.ITEM_NAME === "CURRENCY")[0]?.CURRENT_VALUE ??
                "USD",
            })}
          </b>
        </span>
      ),
    },
    {
      field: "W3A",
      type: "number",
      headerName: "W3A",
      width: 80,
      cellRenderer: (params: any) => (
        <span style={{ color: "green" }}>
          <b>
            {params.data.W3A?.toLocaleString("en-US", {
              style: "currency",
              currency:
                getGlobalSetting()?.filter((ele: WEB_SETTING_DATA) => ele.ITEM_NAME === "CURRENCY")[0]?.CURRENT_VALUE ??
                "USD",
            })}
          </b>
        </span>
      ),
    },
    {
      field: "W4A",
      type: "number",
      headerName: "W4A",
      width: 80,
      cellRenderer: (params: any) => (
        <span style={{ color: "green" }}>
          <b>
            {params.data.W4A?.toLocaleString("en-US", {
              style: "currency",
              currency:
                getGlobalSetting()?.filter((ele: WEB_SETTING_DATA) => ele.ITEM_NAME === "CURRENCY")[0]?.CURRENT_VALUE ??
                "USD",
            })}
          </b>
        </span>
      ),
    },
    {
      field: "W5A",
      type: "number",
      headerName: "W5A",
      width: 80,
      cellRenderer: (params: any) => (
        <span style={{ color: "green" }}>
          <b>
            {params.data.W5A?.toLocaleString("en-US", {
              style: "currency",
              currency:
                getGlobalSetting()?.filter((ele: WEB_SETTING_DATA) => ele.ITEM_NAME === "CURRENCY")[0]?.CURRENT_VALUE ??
                "USD",
            })}
          </b>
        </span>
      ),
    },
    {
      field: "W6A",
      type: "number",
      headerName: "W6A",
      width: 80,
      cellRenderer: (params: any) => (
        <span style={{ color: "green" }}>
          <b>
            {params.data.W6A?.toLocaleString("en-US", {
              style: "currency",
              currency:
                getGlobalSetting()?.filter((ele: WEB_SETTING_DATA) => ele.ITEM_NAME === "CURRENCY")[0]?.CURRENT_VALUE ??
                "USD",
            })}
          </b>
        </span>
      ),
    },
    {
      field: "W7A",
      type: "number",
      headerName: "W7A",
      width: 80,
      cellRenderer: (params: any) => (
        <span style={{ color: "green" }}>
          <b>
            {params.data.W7A?.toLocaleString("en-US", {
              style: "currency",
              currency:
                getGlobalSetting()?.filter((ele: WEB_SETTING_DATA) => ele.ITEM_NAME === "CURRENCY")[0]?.CURRENT_VALUE ??
                "USD",
            })}
          </b>
        </span>
      ),
    },
    {
      field: "W8A",
      type: "number",
      headerName: "W8A",
      width: 80,
      cellRenderer: (params: any) => (
        <span style={{ color: "green" }}>
          <b>
            {params.data.W8A?.toLocaleString("en-US", {
              style: "currency",
              currency:
                getGlobalSetting()?.filter((ele: WEB_SETTING_DATA) => ele.ITEM_NAME === "CURRENCY")[0]?.CURRENT_VALUE ??
                "USD",
            })}
          </b>
        </span>
      ),
    },
    {
      field: "W9A",
      type: "number",
      headerName: "W9A",
      width: 80,
      cellRenderer: (params: any) => (
        <span style={{ color: "green" }}>
          <b>
            {params.data.W9A?.toLocaleString("en-US", {
              style: "currency",
              currency:
                getGlobalSetting()?.filter((ele: WEB_SETTING_DATA) => ele.ITEM_NAME === "CURRENCY")[0]?.CURRENT_VALUE ??
                "USD",
            })}
          </b>
        </span>
      ),
    },
    {
      field: "W10A",
      type: "number",
      headerName: "W10A",
      width: 80,
      cellRenderer: (params: any) => (
        <span style={{ color: "green" }}>
          <b>
            {params.data.W10A?.toLocaleString("en-US", {
              style: "currency",
              currency:
                getGlobalSetting()?.filter((ele: WEB_SETTING_DATA) => ele.ITEM_NAME === "CURRENCY")[0]?.CURRENT_VALUE ??
                "USD",
            })}
          </b>
        </span>
      ),
    },
    {
      field: "W11A",
      type: "number",
      headerName: "W11A",
      width: 80,
      cellRenderer: (params: any) => (
        <span style={{ color: "green" }}>
          <b>
            {params.data.W11A?.toLocaleString("en-US", {
              style: "currency",
              currency:
                getGlobalSetting()?.filter((ele: WEB_SETTING_DATA) => ele.ITEM_NAME === "CURRENCY")[0]?.CURRENT_VALUE ??
                "USD",
            })}
          </b>
        </span>
      ),
    },
    {
      field: "W12A",
      type: "number",
      headerName: "W12A",
      width: 80,
      cellRenderer: (params: any) => (
        <span style={{ color: "green" }}>
          <b>
            {params.data.W12A?.toLocaleString("en-US", {
              style: "currency",
              currency:
                getGlobalSetting()?.filter((ele: WEB_SETTING_DATA) => ele.ITEM_NAME === "CURRENCY")[0]?.CURRENT_VALUE ??
                "USD",
            })}
          </b>
        </span>
      ),
    },
    {
      field: "W13A",
      type: "number",
      headerName: "W13A",
      width: 80,
      cellRenderer: (params: any) => (
        <span style={{ color: "green" }}>
          <b>
            {params.data.W13A?.toLocaleString("en-US", {
              style: "currency",
              currency:
                getGlobalSetting()?.filter((ele: WEB_SETTING_DATA) => ele.ITEM_NAME === "CURRENCY")[0]?.CURRENT_VALUE ??
                "USD",
            })}
          </b>
        </span>
      ),
    },
    {
      field: "W14A",
      type: "number",
      headerName: "W14A",
      width: 80,
      cellRenderer: (params: any) => (
        <span style={{ color: "green" }}>
          <b>
            {params.data.W14A?.toLocaleString("en-US", {
              style: "currency",
              currency:
                getGlobalSetting()?.filter((ele: WEB_SETTING_DATA) => ele.ITEM_NAME === "CURRENCY")[0]?.CURRENT_VALUE ??
                "USD",
            })}
          </b>
        </span>
      ),
    },
    {
      field: "W15A",
      type: "number",
      headerName: "W15A",
      width: 80,
      cellRenderer: (params: any) => (
        <span style={{ color: "green" }}>
          <b>
            {params.data.W15A?.toLocaleString("en-US", {
              style: "currency",
              currency:
                getGlobalSetting()?.filter((ele: WEB_SETTING_DATA) => ele.ITEM_NAME === "CURRENCY")[0]?.CURRENT_VALUE ??
                "USD",
            })}
          </b>
        </span>
      ),
    },
    {
      field: "W16A",
      type: "number",
      headerName: "W16A",
      width: 80,
      cellRenderer: (params: any) => (
        <span style={{ color: "green" }}>
          <b>
            {params.data.W16A?.toLocaleString("en-US", {
              style: "currency",
              currency:
                getGlobalSetting()?.filter((ele: WEB_SETTING_DATA) => ele.ITEM_NAME === "CURRENCY")[0]?.CURRENT_VALUE ??
                "USD",
            })}
          </b>
        </span>
      ),
    },
    {
      field: "W17A",
      type: "number",
      headerName: "W17A",
      width: 80,
      cellRenderer: (params: any) => (
        <span style={{ color: "green" }}>
          <b>
            {params.data.W17A?.toLocaleString("en-US", {
              style: "currency",
              currency:
                getGlobalSetting()?.filter((ele: WEB_SETTING_DATA) => ele.ITEM_NAME === "CURRENCY")[0]?.CURRENT_VALUE ??
                "USD",
            })}
          </b>
        </span>
      ),
    },
    {
      field: "W18A",
      type: "number",
      headerName: "W18A",
      width: 80,
      cellRenderer: (params: any) => (
        <span style={{ color: "green" }}>
          <b>
            {params.data.W18A?.toLocaleString("en-US", {
              style: "currency",
              currency:
                getGlobalSetting()?.filter((ele: WEB_SETTING_DATA) => ele.ITEM_NAME === "CURRENCY")[0]?.CURRENT_VALUE ??
                "USD",
            })}
          </b>
        </span>
      ),
    },
    {
      field: "W19A",
      type: "number",
      headerName: "W19A",
      width: 80,
      cellRenderer: (params: any) => (
        <span style={{ color: "green" }}>
          <b>
            {params.data.W19A?.toLocaleString("en-US", {
              style: "currency",
              currency:
                getGlobalSetting()?.filter((ele: WEB_SETTING_DATA) => ele.ITEM_NAME === "CURRENCY")[0]?.CURRENT_VALUE ??
                "USD",
            })}
          </b>
        </span>
      ),
    },
    {
      field: "W20A",
      type: "number",
      headerName: "W20A",
      width: 80,
      cellRenderer: (params: any) => (
        <span style={{ color: "green" }}>
          <b>
            {params.data.W20A?.toLocaleString("en-US", {
              style: "currency",
              currency:
                getGlobalSetting()?.filter((ele: WEB_SETTING_DATA) => ele.ITEM_NAME === "CURRENCY")[0]?.CURRENT_VALUE ??
                "USD",
            })}
          </b>
        </span>
      ),
    },
    {
      field: "W21A",
      type: "number",
      headerName: "W21A",
      width: 80,
      cellRenderer: (params: any) => (
        <span style={{ color: "green" }}>
          <b>
            {params.data.W21A?.toLocaleString("en-US", {
              style: "currency",
              currency:
                getGlobalSetting()?.filter((ele: WEB_SETTING_DATA) => ele.ITEM_NAME === "CURRENCY")[0]?.CURRENT_VALUE ??
                "USD",
            })}
          </b>
        </span>
      ),
    },
    {
      field: "W22A",
      type: "number",
      headerName: "W22A",
      width: 80,
      cellRenderer: (params: any) => (
        <span style={{ color: "green" }}>
          <b>
            {params.data.W22A?.toLocaleString("en-US", {
              style: "currency",
              currency:
                getGlobalSetting()?.filter((ele: WEB_SETTING_DATA) => ele.ITEM_NAME === "CURRENCY")[0]?.CURRENT_VALUE ??
                "USD",
            })}
          </b>
        </span>
      ),
    },
  ];

  const handleSearchCodeKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handletraFcst();
    }
  };

  const handletraFcst = () => {
    setisLoading(true);
    generalQuery("traFcstDataFull", {
      alltime: alltime,
      justPoBalance: justpobalance,
      start_date: fromdate,
      end_date: todate,
      cust_name: cust_name,
      codeCMS: codeCMS,
      codeKD: codeKD,
      prod_type: prod_type,
      empl_name: empl_name,
      po_no: po_no,
      over: over,
      id: id,
      material: material,
    })
      .then((response) => {
        if (response.data.tk_status !== "NG") {
          const loadeddata: FCSTTableData[] = response.data.data.map((element: FCSTTableData, index: number) => {
            return {
              ...element,
              G_NAME:
                getAuditMode() == 0
                  ? element?.G_NAME
                  : element?.G_NAME?.search("CNDB") == -1
                    ? element?.G_NAME
                    : "TEM_NOI_BO",
              G_NAME_KD:
                getAuditMode() == 0
                  ? element?.G_NAME_KD
                  : element?.G_NAME?.search("CNDB") == -1
                    ? element?.G_NAME_KD
                    : "TEM_NOI_BO",
              id: index,
            };
          });
          setFCSTDataTable(loadeddata);
          setisLoading(false);
          Swal.fire("Thông báo", "Đã load " + response.data.data.length + " dòng", "success");
        } else {
          Swal.fire("Thông báo", "Nội dung: " + response.data.message, "error");
          setisLoading(false);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const deleteFcst = async () => {
    if (fcstdatatablefilter.current.length >= 1) {
      let err_code: boolean = false;
      for (let i = 0; i < fcstdatatablefilter.current.length; i++) {
        if (fcstdatatablefilter.current[i].EMPL_NO === userData?.EMPL_NO) {
          await generalQuery("delete_fcst", {
            FCST_ID: fcstdatatablefilter.current[i].FCST_ID,
          })
            .then((response) => {
              if (response.data.tk_status !== "NG") {
              } else {
                err_code = true;
              }
            })
            .catch((error) => {
              console.log(error);
            });
        }
      }
      if (!err_code) {
        Swal.fire("Thông báo", "Xóa FCST thành công (chỉ FCST của người đăng nhập)!", "success");
      } else {
        Swal.fire("Thông báo", "Có lỗi SQL!", "error");
      }
    } else {
      Swal.fire("Thông báo", "Chọn ít nhất 1 FCST để xóa !", "error");
    }
  };

  const handleConfirmDeleteFcst = () => {
    Swal.fire({
      title: "Chắc chắn muốn xóa FCST đã chọn ?",
      text: "Sẽ chỉ xóa FCST do bạn up lên",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Vẫn Xóa!",
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire("Tiến hành Xóa", "Đang Xóa FCST hàng loạt", "success");
        checkBP(userData, ["KD"], ["ALL"], ["ALL"], deleteFcst);
      }
    });
  };

  const fcstDataAGTable = useMemo(
    () => (
      <AGTable
        suppressRowClickSelection={false}
        showFilter={true}
        toolbar={
          <>
            <IconButton
              className="buttonIcon"
              onClick={() => {
                checkBP(userData, ["KD"], ["ALL"], ["ALL"], handleConfirmDeleteFcst);
              }}
            >
              <MdOutlineDelete color="red" size={15} />
              XÓA FCST
            </IconButton>
            <IconButton
              className="buttonIcon"
              onClick={() => {
                setShowHidePivotTable(!showhidePivotTable);
              }}
            >
              <MdOutlinePivotTableChart color="#ff33bb" size={15} />
              Pivot
            </IconButton>
          </>
        }
        columns={column_fcsttable}
        data={fcstdatatable}
        onCellEditingStopped={(params: any) => {}}
        onRowClick={(params: any) => {}
        }
        onSelectionChange={(params: any) => {
          fcstdatatablefilter.current = params!.api.getSelectedRows();
        }}
      />
    ),
    [fcstdatatable, showhidePivotTable],
  );

  useEffect(() => {}, []);

  return (
    <div className="tracuuFcst">
      {showhidesearchdiv && (
        <div className="tracuuFcstform" style={{ backgroundImage: theme.CMS.backgroundImage }}>
          <div className="forminput">
            <div className="forminputcolumn">
              <label>
                <b>Từ ngày:</b>
                <input
                  onKeyDown={(e) => {
                    handleSearchCodeKeyDown(e);
                  }}
                  type="date"
                  value={fromdate.slice(0, 10)}
                  onChange={(e) => setFromDate(e.target.value)}
                ></input>
              </label>
              <label>
                <b>Tới ngày:</b>{" "}
                <input
                  onKeyDown={(e) => {
                    handleSearchCodeKeyDown(e);
                  }}
                  type="date"
                  value={todate.slice(0, 10)}
                  onChange={(e) => setToDate(e.target.value)}
                ></input>
              </label>
            </div>
            <div className="forminputcolumn">
              <label>
                <b>Code KD:</b>{" "}
                <input
                  onKeyDown={(e) => {
                    handleSearchCodeKeyDown(e);
                  }}
                  type="text"
                  placeholder="GH63-xxxxxx"
                  value={codeKD}
                  onChange={(e) => setCodeKD(e.target.value)}
                ></input>
              </label>
              <label>
                <b>Code ERP:</b>{" "}
                <input
                  onKeyDown={(e) => {
                    handleSearchCodeKeyDown(e);
                  }}
                  type="text"
                  placeholder="7C123xxx"
                  value={codeCMS}
                  onChange={(e) => setCodeCMS(e.target.value)}
                ></input>
              </label>
            </div>
            <div className="forminputcolumn">
              <label>
                <b>Tên nhân viên:</b>{" "}
                <input
                  onKeyDown={(e) => {
                    handleSearchCodeKeyDown(e);
                  }}
                  type="text"
                  placeholder="Trang"
                  value={empl_name}
                  onChange={(e) => setEmpl_Name(e.target.value)}
                ></input>
              </label>
              <label>
                <b>Khách:</b>{" "}
                <input
                  onKeyDown={(e) => {
                    handleSearchCodeKeyDown(e);
                  }}
                  type="text"
                  placeholder="SEVT"
                  value={cust_name}
                  onChange={(e) => setCust_Name(e.target.value)}
                ></input>
              </label>
            </div>
            <div className="forminputcolumn">
              <label>
                <b>Loại sản phẩm:</b>{" "}
                <input
                  onKeyDown={(e) => {
                    handleSearchCodeKeyDown(e);
                  }}
                  type="text"
                  placeholder="TSP"
                  value={prod_type}
                  onChange={(e) => setProdType(e.target.value)}
                ></input>
              </label>
              <label>
                <b>ID:</b>{" "}
                <input
                  onKeyDown={(e) => {
                    handleSearchCodeKeyDown(e);
                  }}
                  type="text"
                  placeholder="12345"
                  value={id}
                  onChange={(e) => setID(e.target.value)}
                ></input>
              </label>
            </div>
            <div className="forminputcolumn">
              <label>
                <b>PO NO:</b>{" "}
                <input
                  onKeyDown={(e) => {
                    handleSearchCodeKeyDown(e);
                  }}
                  type="text"
                  placeholder="123abc"
                  value={po_no}
                  onChange={(e) => setPo_No(e.target.value)}
                ></input>
              </label>
              <label>
                <b>Vật liệu:</b>{" "}
                <input
                  onKeyDown={(e) => {
                    handleSearchCodeKeyDown(e);
                  }}
                  type="text"
                  placeholder="SJ-203020HC"
                  value={material}
                  onChange={(e) => setMaterial(e.target.value)}
                ></input>
              </label>
            </div>
            <div className="forminputcolumn">
              <label>
                <b>Over/OK:</b>{" "}
                <input
                  onKeyDown={(e) => {
                    handleSearchCodeKeyDown(e);
                  }}
                  type="text"
                  placeholder="OVER"
                  value={over}
                  onChange={(e) => setOver(e.target.value)}
                ></input>
              </label>
              <label>
                <b>Invoice No:</b>{" "}
                <input
                  onKeyDown={(e) => {
                    handleSearchCodeKeyDown(e);
                  }}
                  type="text"
                  placeholder="số invoice"
                  value={invoice_no}
                  onChange={(e) => setInvoice_No(e.target.value)}
                ></input>
              </label>
            </div>
          </div>
          <div className="formbutton">
            <label>
              <b style={{ fontSize: "0.6rem" }}>All Time:</b>
              <input
                onKeyDown={(e) => {
                  handleSearchCodeKeyDown(e);
                }}
                type="checkbox"
                name="alltimecheckbox"
                defaultChecked={alltime}
                onChange={() => setAllTime(!alltime)}
              ></input>
            </label>
            <IconButton
              className="buttonIcon"
              onClick={() => {
                handletraFcst();
              }}
            >
              <FcSearch color="green" size={30} />
              Search
            </IconButton>
          </div>
        </div>
      )}
      <div className="tracuuFcstTable" style={{ backgroundImage: theme.CMS.backgroundImage }}>
        {fcstDataAGTable}
      </div>
    </div>
  );
};

export default FCSTManagerManageTab;
