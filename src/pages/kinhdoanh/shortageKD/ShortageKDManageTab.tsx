import { IconButton } from "@mui/material";
import {
  DataGrid,
  GridRowSelectionModel,
  GridToolbarColumnsButton,
  GridToolbarContainer,
  GridToolbarDensitySelector,
  GridToolbarFilterButton,
  GridToolbarQuickFilter,
} from "@mui/x-data-grid";
import moment from "moment";
import { useEffect, useMemo, useState } from "react";
import { FcSearch } from "react-icons/fc";
import { AiFillFileExcel } from "react-icons/ai";
import Swal from "sweetalert2";
import { generalQuery, getAuditMode } from "../../../api/Api";
import { checkBP, SaveExcel } from "../../../api/GlobalFunction";
import { MdOutlineDelete } from "react-icons/md";
import { UserData } from "../../../api/GlobalInterface";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import { ShortageData } from "../interfaces/kdInterface";
import "./ShortageKDManageTab.scss";

const ShortageKDManageTab = () => {
  const theme: any = useSelector((state: RootState) => state.totalSlice.theme);
  const userData: UserData | undefined = useSelector((state: RootState) => state.totalSlice.userData);

  const [isLoading, setisLoading] = useState(false);
  const [fromdate, setFromDate] = useState(moment().format("YYYY-MM-DD"));
  const [todate, setToDate] = useState(moment().format("YYYY-MM-DD"));
  const [codeKD, setCodeKD] = useState("");
  const [codeCMS, setCodeCMS] = useState("");
  const [empl_name, setEmpl_Name] = useState("");
  const [cust_name, setCust_Name] = useState("");
  const [prod_type, setProdType] = useState("");
  const [id, setID] = useState("");
  const [alltime, setAllTime] = useState(true);
  const [po_no, setPo_No] = useState("");
  const [material, setMaterial] = useState("");
  const [over, setOver] = useState("");
  const [invoice_no, setInvoice_No] = useState("");

  const [shortagedatatable, setShortageDataTable] = useState<Array<ShortageData>>([]);
  const [shortagedatatablefilter, setShortageDataTableFilter] = useState<Array<ShortageData>>([]);

  const column_shortage = useMemo(
    () => [
      { field: "ST_ID", headerName: "ST_ID", width: 50 },
      { field: "PLAN_DATE", headerName: "PLAN_DATE", width: 100 },
      { field: "CUST_NAME_KD", headerName: "KHACH", width: 100 },
      { field: "G_CODE", headerName: "G_CODE", width: 80 },
      { field: "G_NAME", headerName: "G_NAME", width: 180 },
      {
        field: "PO_BALANCE",
        headerName: "TON PO",
        width: 80,
        renderCell: (params: any) => {
          return (
            <span style={{ color: "red", fontWeight: "bold" }}>
              {params.row.PO_BALANCE.toLocaleString("en-US")}
            </span>
          );
        },
      },
      {
        field: "TON_TP",
        headerName: "TON_TP",
        width: 80,
        renderCell: (params: any) => {
          return (
            <span style={{ color: "blue", fontWeight: "bold" }}>
              {params.row.TON_TP.toLocaleString("en-US")}
            </span>
          );
        },
      },
      {
        field: "BTP",
        headerName: "BTP",
        width: 80,
        renderCell: (params: any) => {
          return (
            <span style={{ color: "blue", fontWeight: "bold" }}>
              {params.row.BTP.toLocaleString("en-US")}
            </span>
          );
        },
      },
      {
        field: "TONG_TON_KIEM",
        headerName: "T_KIEM",
        width: 80,
        renderCell: (params: any) => {
          return (
            <span style={{ color: "blue", fontWeight: "bold" }}>
              {params.row.TONG_TON_KIEM.toLocaleString("en-US")}
            </span>
          );
        },
      },
      {
        field: "D1_9H",
        headerName: "D1_9H",
        width: 80,
        renderCell: (params: any) => {
          return (
            <span style={{ color: "green", fontWeight: "bold" }}>
              {params.row.D1_9H.toLocaleString("en-US")}
            </span>
          );
        },
      },
      {
        field: "D1_13H",
        headerName: "D1_13H",
        width: 80,
        renderCell: (params: any) => {
          return (
            <span style={{ color: "green", fontWeight: "bold" }}>
              {params.row.D1_9H.toLocaleString("en-US")}
            </span>
          );
        },
      },
      {
        field: "D1_19H",
        headerName: "D1_19H",
        width: 80,
        renderCell: (params: any) => {
          return (
            <span style={{ color: "green", fontWeight: "bold" }}>
              {params.row.D1_9H.toLocaleString("en-US")}
            </span>
          );
        },
      },
      {
        field: "D1_21H",
        headerName: "D1_21H",
        width: 80,
        renderCell: (params: any) => {
          return (
            <span style={{ color: "green", fontWeight: "bold" }}>
              {params.row.D1_9H.toLocaleString("en-US")}
            </span>
          );
        },
      },
      {
        field: "D1_23H",
        headerName: "D1_23H",
        width: 80,
        renderCell: (params: any) => {
          return (
            <span style={{ color: "green", fontWeight: "bold" }}>
              {params.row.D1_9H.toLocaleString("en-US")}
            </span>
          );
        },
      },
      {
        field: "D2_9H",
        headerName: "D2_9H",
        width: 80,
        renderCell: (params: any) => {
          return (
            <span style={{ color: "blue", fontWeight: "bold" }}>
              {params.row.D1_9H.toLocaleString("en-US")}
            </span>
          );
        },
      },
      {
        field: "D2_13H",
        headerName: "D2_13H",
        width: 80,
        renderCell: (params: any) => {
          return (
            <span style={{ color: "blue", fontWeight: "bold" }}>
              {params.row.D1_9H.toLocaleString("en-US")}
            </span>
          );
        },
      },
      {
        field: "D2_21H",
        headerName: "D2_21H",
        width: 80,
        renderCell: (params: any) => {
          return (
            <span style={{ color: "blue", fontWeight: "bold" }}>
              {params.row.D1_9H.toLocaleString("en-US")}
            </span>
          );
        },
      },
      {
        field: "D3_SANG",
        headerName: "D3_SANG",
        width: 80,
        renderCell: (params: any) => {
          return (
            <span style={{ color: "black", fontWeight: "bold" }}>
              {params.row.D1_9H.toLocaleString("en-US")}
            </span>
          );
        },
      },
      {
        field: "D3_CHIEU",
        headerName: "D3_CHIEU",
        width: 80,
        renderCell: (params: any) => {
          return (
            <span style={{ color: "black", fontWeight: "bold" }}>
              {params.row.D1_9H.toLocaleString("en-US")}
            </span>
          );
        },
      },
      {
        field: "D4_SANG",
        headerName: "D4_SANG",
        width: 80,
        renderCell: (params: any) => {
          return (
            <span style={{ color: "black", fontWeight: "bold" }}>
              {params.row.D1_9H.toLocaleString("en-US")}
            </span>
          );
        },
      },
      {
        field: "D4_CHIEU",
        headerName: "D4_CHIEU",
        width: 80,
        renderCell: (params: any) => {
          return (
            <span style={{ color: "black", fontWeight: "bold" }}>
              {params.row.D1_9H.toLocaleString("en-US")}
            </span>
          );
        },
      },
      {
        field: "TODAY_TOTAL",
        headerName: "TODAY_TOTAL",
        width: 120,
        renderCell: (params: any) => {
          return (
            <span style={{ color: "#b63dfc", fontWeight: "bold" }}>
              {params.row.TODAY_TOTAL.toLocaleString("en-US")}
            </span>
          );
        },
      },
      {
        field: "TODAY_THIEU",
        headerName: "TODAY_THIEU",
        width: 120,
        renderCell: (params: any) => {
          return (
            <span style={{ color: "#f21400", fontWeight: "bold" }}>
              {params.row.TODAY_THIEU.toLocaleString("en-US")}
            </span>
          );
        },
      },
      { field: "PRIORITY", headerName: "PRIORITY", width: 100 },
    ],
    [shortagedatatable],
  );

  function CustomToolbarPOTable() {
    return (
      <GridToolbarContainer>
        <GridToolbarColumnsButton />
        <GridToolbarFilterButton />
        <GridToolbarDensitySelector />
        <IconButton
          className="buttonIcon"
          onClick={() => {
            SaveExcel(shortagedatatable, "Shortage Table");
          }}
        >
          <AiFillFileExcel color="green" size={15} />
          SAVE
        </IconButton>
        <IconButton
          className="buttonIcon"
          onClick={() => {
            checkBP(userData, ["KD"], ["ALL"], ["ALL"], handleConfirmDeletePlan);
          }}
        >
          <MdOutlineDelete color="red" size={15} />
          XÓA PLAN
        </IconButton>
        <GridToolbarQuickFilter />
      </GridToolbarContainer>
    );
  }

  const handleShortageSelectionforUpdate = (ids: GridRowSelectionModel) => {
    const selectedID = new Set(ids);
    let datafilter = shortagedatatable.filter((element: any) => selectedID.has(element.ST_ID));
    if (datafilter.length > 0) {
      setShortageDataTableFilter(datafilter);
    } else {
      setShortageDataTableFilter([]);
    }
  };

  const handletraShortage = () => {
    generalQuery("traShortageKD", {
      ALLTIME: alltime,
      FROM_DATE: fromdate,
      TO_DATE: todate,
      CUST_NAME: cust_name,
      G_CODE: codeCMS,
      G_NAME: codeKD,
      PROD_TYPE: prod_type,
      EMPL_NAME: empl_name,
      ST_ID: id,
    })
      .then((response) => {
        if (response.data.tk_status !== "NG") {
          const loadeddata: ShortageData[] = response.data.data.map((element: ShortageData) => {
            return {
              ...element,
              G_NAME:
                getAuditMode() == 0
                  ? element?.G_NAME
                  : element?.G_NAME?.search("CNDB") == -1
                    ? element?.G_NAME
                    : "TEM_NOI_BO",
              PLAN_DATE: moment.utc(element.PLAN_DATE).format("YYYY-MM-DD"),
            };
          });
          setShortageDataTable(loadeddata);
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

  const deletePlan = async () => {
    if (shortagedatatablefilter.length >= 1) {
      let err_code: boolean = false;
      for (let i = 0; i < shortagedatatablefilter.length; i++) {
        await generalQuery("delete_shortage", {
          ST_ID: shortagedatatablefilter[i].ST_ID,
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
      if (!err_code) {
        Swal.fire("Thông báo", "Xóa Plan thành công (chỉ Plan của người đăng nhập)!", "success");
        handletraShortage();
      } else {
        Swal.fire("Thông báo", "Có lỗi SQL!", "error");
      }
    } else {
      Swal.fire("Thông báo", "Chọn ít nhất 1 Plan để xóa !", "error");
    }
  };

  const handleConfirmDeletePlan = () => {
    Swal.fire({
      title: "Chắc chắn muốn xóa Plan đã chọn ?",
      text: "Sẽ chỉ xóa Plan do bạn up lên",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Vẫn Xóa!",
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire("Tiến hành Xóa", "Đang Xóa Plan hàng loạt", "success");
        checkBP(userData, ["KD"], ["ALL"], ["ALL"], deletePlan);
      }
    });
  };

  useEffect(() => {}, []);

  return (
    <div className="tracuuPlan">
      <div className="tracuuPlanform" style={{ backgroundImage: theme.CMS.backgroundImage }}>
        <div className="forminput">
          <div className="forminputcolumn">
            <label>
              <b>Từ ngày:</b>
              <input type="date" value={fromdate.slice(0, 10)} onChange={(e) => setFromDate(e.target.value)}></input>
            </label>
            <label>
              <b>Tới ngày:</b>{" "}
              <input type="date" value={todate.slice(0, 10)} onChange={(e) => setToDate(e.target.value)}></input>
            </label>
          </div>
          <div className="forminputcolumn">
            <label>
              <b>Code KD:</b>{" "}
              <input type="text" placeholder="GH63-xxxxxx" value={codeKD} onChange={(e) => setCodeKD(e.target.value)}></input>
            </label>
            <label>
              <b>Code ERP:</b>{" "}
              <input type="text" placeholder="7C123xxx" value={codeCMS} onChange={(e) => setCodeCMS(e.target.value)}></input>
            </label>
          </div>
          <div className="forminputcolumn">
            <label>
              <b>Tên nhân viên:</b>{" "}
              <input type="text" placeholder="Trang" value={empl_name} onChange={(e) => setEmpl_Name(e.target.value)}></input>
            </label>
            <label>
              <b>Khách:</b>{" "}
              <input type="text" placeholder="SEVT" value={cust_name} onChange={(e) => setCust_Name(e.target.value)}></input>
            </label>
          </div>
          <div className="forminputcolumn">
            <label>
              <b>Loại sản phẩm:</b>{" "}
              <input type="text" placeholder="TSP" value={prod_type} onChange={(e) => setProdType(e.target.value)}></input>
            </label>
            <label>
              <b>ID:</b>{" "}
              <input type="text" placeholder="12345" value={id} onChange={(e) => setID(e.target.value)}></input>
            </label>
          </div>
          <div className="forminputcolumn">
            <label>
              <b>PO NO:</b>{" "}
              <input type="text" placeholder="123abc" value={po_no} onChange={(e) => setPo_No(e.target.value)}></input>
            </label>
            <label>
              <b>Vật liệu:</b>{" "}
              <input type="text" placeholder="SJ-203020HC" value={material} onChange={(e) => setMaterial(e.target.value)}></input>
            </label>
          </div>
          <div className="forminputcolumn">
            <label>
              <b>Over/OK:</b>{" "}
              <input type="text" placeholder="OVER" value={over} onChange={(e) => setOver(e.target.value)}></input>
            </label>
            <label>
              <b>Invoice No:</b>{" "}
              <input type="text" placeholder="số invoice" value={invoice_no} onChange={(e) => setInvoice_No(e.target.value)}></input>
            </label>
          </div>
        </div>
        <div className="formbutton">
          <label>
            <b>All Time:</b>
            <input type="checkbox" name="alltimecheckbox" defaultChecked={alltime} onChange={() => setAllTime(!alltime)}></input>
          </label>
          <IconButton
            className="buttonIcon"
            onClick={() => {
              handletraShortage();
            }}
          >
            <FcSearch color="green" size={30} />
            Search
          </IconButton>
        </div>
      </div>
      <div className="tracuuPlanTable" style={{ backgroundImage: theme.CMS.backgroundImage }}>
        <DataGrid
          slots={{
            toolbar: CustomToolbarPOTable,
          }}
          sx={{ fontSize: "0.7rem" }}
          loading={isLoading}
          rowHeight={30}
          rows={shortagedatatable}
          columns={column_shortage}
          pageSizeOptions={[5, 10, 50, 100, 500, 1000, 5000, 10000, 100000]}
          editMode="row"
          getRowId={(row) => row.ST_ID}
          checkboxSelection
          disableRowSelectionOnClick
          onRowSelectionModelChange={(ids) => {
            handleShortageSelectionforUpdate(ids);
          }}
        />
      </div>
    </div>
  );
};

export default ShortageKDManageTab;
