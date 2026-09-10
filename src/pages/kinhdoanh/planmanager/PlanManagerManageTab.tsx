import React, { useMemo, useRef, useState } from "react";
import moment from "moment";
import Swal from "sweetalert2";
import { useSelector } from "react-redux";
import { FiSearch, FiTrash2, FiRefreshCw } from "react-icons/fi";

import { RootState } from "../../../redux/store";
import { UserData } from "../../../api/GlobalInterface";
import { generalQuery, getAuditMode, getSocket, getUserData } from "../../../api/Api";
import { checkBP } from "../../../api/services/permissionService";
import { f_insert_Notification_Data } from "../../../api/services/notificationService";
import { NotificationElement } from "../../../components/NotificationPanel/Notification";
import AGTable from "../../../components/DataTable/AGTable";
import { SaveExcel } from "../../../api/services/excelService";
import { PlanTableData } from "../interfaces/kdInterface";
import { getManageColumns } from "./PrecisionPlan/PrecisionPlanColumns";

const PlanManagerManageTab: React.FC = () => {
  const userData: UserData | undefined = useSelector((state: RootState) => state.totalSlice.userData);
  const podatatablefilter = useRef<Array<PlanTableData>>([]);

  /* ── Filter States ── */
  const [fromdate, setFromDate] = useState(moment().format("YYYY-MM-DD"));
  const [todate, setToDate] = useState(moment().format("YYYY-MM-DD"));
  const [codeKD, setCodeKD] = useState("");
  const [codeCMS, setCodeCMS] = useState("");
  const [empl_name, setEmpl_Name] = useState("");
  const [cust_name, setCust_Name] = useState("");
  const [prod_type, setProdType] = useState("");
  const [id, setID] = useState("");
  const [alltime, setAllTime] = useState(false);
  const [po_no, setPo_No] = useState("");
  const [material, setMaterial] = useState("");
  const [over, setOver] = useState("");
  const [invoice_no, setInvoice_No] = useState("");

  /* ── Data States ── */
  const [plandatatable, setPlanDataTable] = useState<Array<PlanTableData>>([]);
  const [planColums, setPlanColums] = useState<Array<any>>(getManageColumns());

  /* ── Core: Tra cứu Plan ── */
  const handletraPlan = () => {
    generalQuery("traPlanDataFull", {
      alltime, justPoBalance: true,
      start_date: fromdate, end_date: todate,
      cust_name, codeCMS, codeKD, prod_type, empl_name,
      po_no, over, id, material,
    })
      .then((response) => {
        if (response.data.tk_status !== "NG") {
          const loadeddata: PlanTableData[] = response.data.data.map((element: PlanTableData, index: number) => ({
            ...element,
            G_NAME: getAuditMode() == 0 ? element?.G_NAME : element?.G_NAME?.search("CNDB") == -1 ? element?.G_NAME : "TEM_NOI_BO",
            G_NAME_KD: getAuditMode() == 0 ? element?.G_NAME_KD : element?.G_NAME?.search("CNDB") == -1 ? element?.G_NAME_KD : "TEM_NOI_BO",
            PLAN_DATE: element.PLAN_DATE.slice(0, 10),
            ...Object.fromEntries(Array.from({ length: 15 }, (_, i) => [`D${i + 1}`, element[`D${i + 1}` as keyof PlanTableData] ?? 0])),
            id: index,
          }));
          setPlanDataTable(loadeddata);

          // Update column headers with dates if single-day query
          if (fromdate === todate) {
            setPlanColums((prev) =>
              prev.map((ele: any) => {
                if (/^D\d{1,2}$/.test(ele.field)) {
                  return { ...ele, headerName: moment(fromdate).add(parseInt(ele.field.slice(1)) - 1, "days").format("DD/MM") };
                }
                return ele;
              })
            );
          } else {
            setPlanColums((prev) =>
              prev.map((ele: any) => {
                if (/^D\d{1,2}$/.test(ele.field)) return { ...ele, headerName: ele.field };
                return ele;
              })
            );
          }
          Swal.fire("Thông báo", "Đã load " + response.data.data.length + " dòng", "success");
        } else {
          Swal.fire("Thông báo", "Nội dung: " + response.data.message, "error");
        }
      })
      .catch((error) => console.log(error));
  };

  /* ── Core: Xóa Plan ── */
  const deletePlan = async () => {
    if (podatatablefilter.current.length >= 1) {
      let err_code: boolean = false;
      for (let i = 0; i < podatatablefilter.current.length; i++) {
        if (podatatablefilter.current[i].EMPL_NO === userData?.EMPL_NO) {
          await generalQuery("delete_plan", { PLAN_ID: podatatablefilter.current[i].PLAN_ID })
            .then((response) => { if (response.data.tk_status === "NG") err_code = true; })
            .catch((error) => console.log(error));
        }
      }
      if (!err_code) {
        const newNotification: NotificationElement = {
          CTR_CD: "002", NOTI_ID: -1, NOTI_TYPE: "warning",
          TITLE: "Xóa Kế hoạch giao hàng",
          CONTENT: `${getUserData()?.EMPL_NO} (${getUserData()?.MIDLAST_NAME} ${getUserData()?.FIRST_NAME}), nhân viên ${getUserData()?.WORK_POSITION_NAME} đã xóa kế hoạch giao hàng`,
          SUBDEPTNAME: "KD", MAINDEPTNAME: "KD",
          INS_EMPL: "NHU1903", INS_DATE: "2024-12-30",
          UPD_EMPL: "NHU1903", UPD_DATE: "2024-12-30",
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
      icon: "warning", showCancelButton: true,
      confirmButtonColor: "#3085d6", cancelButtonColor: "#d33",
      confirmButtonText: "Vẫn Xóa!",
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire("Tiến hành Xóa", "Đang Xóa Plan hàng loạt", "success");
        checkBP(userData, ["KD"], ["ALL"], ["ALL"], deletePlan);
      }
    });
  };

  /* ── AG-Grid Table ── */
  const planDataAGTable = useMemo(
    () => (
      <AGTable
        suppressRowClickSelection={false}
        showFilter={true}
        columns={planColums}
        data={plandatatable}
        onSelectionChange={(params: any) => {
          podatatablefilter.current = params!.api.getSelectedRows();
        }}
      />
    ),
    [plandatatable, planColums, userData]
  );

  return (
    <>
      {/* Filter Toolbar */}
      <div className="precision-plan__toolbar">
        <div className="precision-plan__filterGroup">
          <span className="precision-plan__filterLabel">Từ ngày:</span>
          <input type="date" className="precision-plan__filterInput precision-plan__filterInput--date" value={fromdate} onChange={(e) => setFromDate(e.target.value)} />
        </div>
        <div className="precision-plan__filterGroup">
          <span className="precision-plan__filterLabel">Tới ngày:</span>
          <input type="date" className="precision-plan__filterInput precision-plan__filterInput--date" value={todate} onChange={(e) => setToDate(e.target.value)} />
        </div>
        <div className="precision-plan__filterSep" />
        <div className="precision-plan__filterGroup">
          <span className="precision-plan__filterLabel">Code KD:</span>
          <input type="text" className="precision-plan__filterInput precision-plan__filterInput--text" placeholder="GH63-xxx" value={codeKD} onChange={(e) => setCodeKD(e.target.value)} />
        </div>
        <div className="precision-plan__filterGroup">
          <span className="precision-plan__filterLabel">Code ERP:</span>
          <input type="text" className="precision-plan__filterInput precision-plan__filterInput--text" placeholder="7C123xxx" value={codeCMS} onChange={(e) => setCodeCMS(e.target.value)} />
        </div>
        <div className="precision-plan__filterGroup">
          <span className="precision-plan__filterLabel">NV:</span>
          <input type="text" className="precision-plan__filterInput precision-plan__filterInput--text" placeholder="Trang" value={empl_name} onChange={(e) => setEmpl_Name(e.target.value)} />
        </div>
        <div className="precision-plan__filterGroup">
          <span className="precision-plan__filterLabel">Khách:</span>
          <input type="text" className="precision-plan__filterInput precision-plan__filterInput--text" placeholder="SEVT" value={cust_name} onChange={(e) => setCust_Name(e.target.value)} />
        </div>
        <div className="precision-plan__filterGroup">
          <span className="precision-plan__filterLabel">Loại SP:</span>
          <input type="text" className="precision-plan__filterInput precision-plan__filterInput--text" placeholder="TSP" value={prod_type} onChange={(e) => setProdType(e.target.value)} />
        </div>
        <div className="precision-plan__filterGroup">
          <span className="precision-plan__filterLabel">PO:</span>
          <input type="text" className="precision-plan__filterInput precision-plan__filterInput--text" placeholder="PO No" value={po_no} onChange={(e) => setPo_No(e.target.value)} />
        </div>
        <div className="precision-plan__filterGroup">
          <span className="precision-plan__filterLabel">VL:</span>
          <input type="text" className="precision-plan__filterInput precision-plan__filterInput--text" placeholder="Vật liệu" value={material} onChange={(e) => setMaterial(e.target.value)} />
        </div>
        <div className="precision-plan__filterSep" />
        <label className="precision-plan__filterCheck">
          <input type="checkbox" checked={alltime} onChange={() => setAllTime(!alltime)} />
          All Time
        </label>
        <button type="button" className="precision-plan__filterBtn precision-plan__filterBtn--primary" onClick={handletraPlan}>
          <FiSearch size={12} />
          Tra Cứu Dữ Liệu
        </button>
      </div>

      {/* Grid Container */}
      <div className="precision-plan__gridContainer">
        <div className="precision-plan__gridToolbar">
          <div className="precision-plan__gridToolbarLeft">
            <div className="precision-plan__gridActions">
              <button type="button" className="precision-plan__gridBtn precision-plan__gridBtn--excel" onClick={() => SaveExcel(plandatatable, "Plan_Data")} title="Xuất Excel toàn bộ">
                📥 EX1
              </button>
              <button type="button" className="precision-plan__gridBtn precision-plan__gridBtn--excel" onClick={() => SaveExcel(plandatatable, "Plan_Data_Full")} title="Xuất Excel đầy đủ">
                📥 EX2
              </button>
              <button type="button" className="precision-plan__gridBtn precision-plan__gridBtn--pivot" title="Phân tích Pivot">
                📊 PIVOT
              </button>
              <button type="button" className="precision-plan__gridBtn precision-plan__gridBtn--danger" onClick={() => checkBP(userData, ["KD"], ["ALL"], ["ALL"], handleConfirmDeletePlan)} title="Xóa Plan đã chọn">
                <FiTrash2 size={11} />
                XÓA PLAN
              </button>
            </div>
          </div>
          <div className="precision-plan__gridMeta">
            Hiển thị: <strong>{plandatatable.length}</strong> dòng
          </div>
        </div>
        <div className="precision-plan__gridBody">
          {planDataAGTable}
        </div>
      </div>
    </>
  );
};

export default PlanManagerManageTab;
