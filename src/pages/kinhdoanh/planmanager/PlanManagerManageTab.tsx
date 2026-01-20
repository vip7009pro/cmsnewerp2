import { IconButton } from "@mui/material";
import moment from "moment";
import React, { useMemo, useRef, useState } from "react";
import { FcSearch } from "react-icons/fc";
import { MdOutlineDelete, MdOutlinePivotTableChart } from "react-icons/md";
import Swal from "sweetalert2";
import { generalQuery, getAuditMode, getCompany, getSocket, getUserData } from "../../../api/Api";
import { checkBP, f_insert_Notification_Data } from "../../../api/GlobalFunction";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import { UserData } from "../../../api/GlobalInterface";
import AGTable from "../../../components/DataTable/AGTable";
import { NotificationElement } from "../../../components/NotificationPanel/Notification";
import { PlanTableData } from "../interfaces/kdInterface";
import "./PlanManagerManageTab.scss";

const PlanManagerManageTab: React.FC = () => {
  const theme: any = useSelector((state: RootState) => state.totalSlice.theme);
  const userData: UserData | undefined = useSelector((state: RootState) => state.totalSlice.userData);

  const podatatablefilter = useRef<Array<PlanTableData>>([]);

  const [fromdate, setFromDate] = useState(moment().format("YYYY-MM-DD"));
  const [todate, setToDate] = useState(moment().format("YYYY-MM-DD"));
  const [codeKD, setCodeKD] = useState("");
  const [codeCMS, setCodeCMS] = useState("");
  const [empl_name, setEmpl_Name] = useState("");
  const [cust_name, setCust_Name] = useState("");
  const [prod_type, setProdType] = useState("");
  const [id, setID] = useState("");
  const [alltime, setAllTime] = useState(false);
  const [justpobalance, setJustPOBalance] = useState(true);
  const [po_no, setPo_No] = useState("");
  const [material, setMaterial] = useState("");
  const [over, setOver] = useState("");
  const [invoice_no, setInvoice_No] = useState("");

  const [plandatatable, setPlanDataTable] = useState<Array<PlanTableData>>([]);
  const [showhidePivotTable, setShowHidePivotTable] = useState(false);

  const column_plantable: any = [
    { field: "PLAN_ID", headerName: "PLAN_ID", width: 100, checkboxSelection: true, headerCheckboxSelection: true },
    { field: "EMPL_NAME", headerName: "EMPL_NAME", width: 100 },
    { field: "CUST_NAME_KD", headerName: "CUST_NAME_KD", width: 100 },
    { field: "G_CODE", headerName: "G_CODE", width: 70 },
    { field: "G_NAME_KD", headerName: "G_NAME_KD", width: 100 },
    {
      field: "G_NAME",
      headerName: "G_NAME",
      width: 120,
      cellRenderer: (params: any) => {
        return (
          <span style={{ color: "red" }}>
            <b>{params.data.G_NAME}</b>
          </span>
        );
      },
    },
    { field: "PROD_TYPE", headerName: "PROD_TYPE", width: 60 },
    { field: "PROD_MAIN_MATERIAL", headerName: "PROD_MAIN_MATERIAL", width: 120 },
    { field: "PLAN_DATE", headerName: "PLAN_DATE", width: 50 },
    { field: "D1", type: "number", headerName: "D1", width: 50 },
    { field: "D2", type: "number", headerName: "D2", width: 50 },
    { field: "D3", type: "number", headerName: "D3", width: 50 },
    { field: "D4", type: "number", headerName: "D4", width: 50 },
    { field: "D5", type: "number", headerName: "D5", width: 50 },
    { field: "D6", type: "number", headerName: "D6", width: 50 },
    { field: "D7", type: "number", headerName: "D7", width: 50 },
    { field: "D8", type: "number", headerName: "D8", width: 50 },
    { field: "D9", type: "number", headerName: "D9", width: 50 },
    { field: "D10", type: "number", headerName: "D10", width: 50 },
    { field: "D11", type: "number", headerName: "D11", width: 50 },
    { field: "D12", type: "number", headerName: "D12", width: 50 },
    { field: "D13", type: "number", headerName: "D13", width: 50 },
    { field: "D14", type: "number", headerName: "D14", width: 50 },
    { field: "D15", type: "number", headerName: "D15", width: 50 },
    { field: "REMARK", headerName: "REMARK", width: 120 },
    { field: "STATUS", headerName: "STATUS", width: 70 },
  ];

  const [planColums, setPlanColums] = useState<Array<any>>(column_plantable);

  const handletraPlan = () => {
    generalQuery("traPlanDataFull", {
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
          const loadeddata: PlanTableData[] = response.data.data.map((element: PlanTableData, index: number) => {
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
              PLAN_DATE: element.PLAN_DATE.slice(0, 10),
              D1: element.D1 === null ? 0 : element.D1,
              D2: element.D2 === null ? 0 : element.D2,
              D3: element.D3 === null ? 0 : element.D3,
              D4: element.D4 === null ? 0 : element.D4,
              D5: element.D5 === null ? 0 : element.D5,
              D6: element.D6 === null ? 0 : element.D6,
              D7: element.D7 === null ? 0 : element.D7,
              D8: element.D8 === null ? 0 : element.D8,
              D9: element.D9 === null ? 0 : element.D9,
              D10: element.D10 === null ? 0 : element.D10,
              D11: element.D11 === null ? 0 : element.D11,
              D12: element.D12 === null ? 0 : element.D12,
              D13: element.D13 === null ? 0 : element.D13,
              D14: element.D14 === null ? 0 : element.D14,
              D15: element.D15 === null ? 0 : element.D15,
              id: index,
            };
          });
          setPlanDataTable(loadeddata);

          if (fromdate === todate) {
            setPlanColums((prev) =>
              prev.map((ele: any) => {
                if (
                  ele.field === "D1" ||
                  ele.field === "D2" ||
                  ele.field === "D3" ||
                  ele.field === "D4" ||
                  ele.field === "D5" ||
                  ele.field === "D6" ||
                  ele.field === "D7" ||
                  ele.field === "D8" ||
                  ele.field === "D9" ||
                  ele.field === "D10" ||
                  ele.field === "D11" ||
                  ele.field === "D12" ||
                  ele.field === "D13" ||
                  ele.field === "D14" ||
                  ele.field === "D15"
                ) {
                  return {
                    ...ele,
                    headerName: moment(fromdate)
                      .add(parseInt(ele.field.slice(1)) - 1, "days")
                      .format("DD/MM"),
                  };
                }
                return ele;
              })
            );
          } else {
            setPlanColums((prev) =>
              prev.map((ele: any) => {
                if (
                  ele.field === "D1" ||
                  ele.field === "D2" ||
                  ele.field === "D3" ||
                  ele.field === "D4" ||
                  ele.field === "D5" ||
                  ele.field === "D6" ||
                  ele.field === "D7" ||
                  ele.field === "D8" ||
                  ele.field === "D9" ||
                  ele.field === "D10" ||
                  ele.field === "D11" ||
                  ele.field === "D12" ||
                  ele.field === "D13" ||
                  ele.field === "D14" ||
                  ele.field === "D15"
                ) {
                  return {
                    ...ele,
                    headerName: ele.field,
                  };
                }
                return ele;
              })
            );
          }

          Swal.fire("Thông báo", "Đã load " + response.data.data.length + " dòng", "success");
        } else {
          Swal.fire("Thông báo", "Nội dung: " + response.data.message, "error");
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const deletePlan = async () => {
    if (podatatablefilter.current.length >= 1) {
      let err_code: boolean = false;
      for (let i = 0; i < podatatablefilter.current.length; i++) {
        if (podatatablefilter.current[i].EMPL_NO === userData?.EMPL_NO) {
          await generalQuery("delete_plan", {
            PLAN_ID: podatatablefilter.current[i].PLAN_ID,
          })
            .then((response) => {
              if (response.data.tk_status === "NG") {
                err_code = true;
              }
            })
            .catch((error) => {
              console.log(error);
            });
        }
      }
      if (!err_code) {
        let newNotification: NotificationElement = {
          CTR_CD: "002",
          NOTI_ID: -1,
          NOTI_TYPE: "warning",
          TITLE: "Xóa Kế hoạch giao hàng",
          CONTENT: `${getUserData()?.EMPL_NO} (${getUserData()?.MIDLAST_NAME} ${getUserData()?.FIRST_NAME}), nhân viên ${getUserData()?.WORK_POSITION_NAME} đã xóa kế hoạch giao hàng`,
          SUBDEPTNAME: "KD",
          MAINDEPTNAME: "KD",
          INS_EMPL: "NHU1903",
          INS_DATE: "2024-12-30",
          UPD_EMPL: "NHU1903",
          UPD_DATE: "2024-12-30",
        };
        if (await f_insert_Notification_Data(newNotification)) {
          getSocket().emit("notification_panel", newNotification);
        }
        Swal.fire("Thông báo", "Xóa Plan thành công (chỉ Plan của người đăng nhập)!", "success");
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

  const planDataAGTable = useMemo(
    () => (
      <AGTable
        suppressRowClickSelection={false}
        showFilter={true}
        toolbar={
          <>
            <IconButton
              className="buttonIcon"
              onClick={() => {
                checkBP(userData, ["KD"], ["ALL"], ["ALL"], handleConfirmDeletePlan);
              }}
            >
              <MdOutlineDelete color="red" size={15} />
              XÓA PLAN
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
        columns={planColums}
        data={plandatatable}
        onCellEditingStopped={(params: any) => {}}
        onRowClick={(params: any) => {}}
        onSelectionChange={(params: any) => {
          podatatablefilter.current = params!.api.getSelectedRows();
        }}
      />
    ),
    [plandatatable, planColums, showhidePivotTable, userData]
  );

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
            <span style={{ fontSize: "0.7rem" }}>All Time:</span>
            <input type="checkbox" name="alltimecheckbox" defaultChecked={alltime} onChange={() => setAllTime(!alltime)}></input>
          </label>
          <IconButton className="buttonIcon" onClick={handletraPlan}>
            <FcSearch color="green" size={30} />
            Search
          </IconButton>
        </div>
      </div>
      <div className="tracuuPlanTable">{planDataAGTable}</div>
    </div>
  );
};

export default PlanManagerManageTab;
