import React, { useEffect, useMemo, useRef, useState } from "react";
import Swal from "sweetalert2";
import moment from "moment";
import { FiRefreshCw } from "react-icons/fi";

import { INSPECT_STATUS_DATA } from "../../qc/interfaces/qcInterface";
import { f_loadInspect_status_G_CODE } from "../../qc/utils/qcUtils";
import { f_updateBTP_M100, f_updateTONKIEM_M100, f_update_Stock_M100_CMS } from "../../../api/services/inventoryService";
import AGTable from "../../../components/DataTable/AGTable";
import { SaveExcel } from "../../../api/services/excelService";
import { getStatusColumns } from "./PrecisionPlan/PrecisionPlanColumns";
import { exportFilteredRowsToExcel } from "./PrecisionPlan/planGridUtils";
import { lazyOpenable } from "../../../components/PivotChart/lazyOpenable";
// Pivot modal chỉ nạp ĐỘNG khi mở (module kéo theo DevExtreme) — xem lazyOpenable.tsx.
const PrecisionPlanPivotModal = lazyOpenable(() =>
  import("./PrecisionPlan/PrecisionPlanPivotModal").then((m) => m.default),
);

interface Props {
  /** Đẩy số dòng OK/NG lên header của PlanManager */
  onCountsChange?: (ok: number, ng: number) => void;
}

const PlanManagerStatusTab: React.FC<Props> = ({ onCountsChange }) => {
  const [fromdate, setFromDate] = useState(moment().format("YYYY-MM-DD"));
  const [planStatus, setPlanStatus] = useState<Array<INSPECT_STATUS_DATA>>([]);
  const [showPivot, setShowPivot] = useState(false);
  const gridRef = useRef<any>(null);

  const column_planstatus = useMemo(() => getStatusColumns(), []);

  /* ── Core: Load Plan Status ── */
  const handleloadPlanStatus = async () => {
    Swal.fire({
      title: "Load Plan",
      text: "Đang load Plan, hãy chờ một chút",
      icon: "info",
      showCancelButton: false,
      allowOutsideClick: false,
      confirmButtonText: "OK",
      showConfirmButton: false,
    });
    await f_update_Stock_M100_CMS({});
    await f_updateBTP_M100();
    await f_updateTONKIEM_M100();

    let kq: INSPECT_STATUS_DATA[] = [];
    kq = await f_loadInspect_status_G_CODE(fromdate);
    if (kq.length > 0) {
      Swal.fire("Thông báo", "Đã load " + kq.length + " dòng", "success");
      setPlanStatus(kq);
    } else {
      Swal.fire(
        "Thông báo",
        "Chưa chốt kế hoạch ngày " + fromdate + ", chọn ngày khác hoặc tra lại sau 14h " + fromdate,
        "success"
      );
      setPlanStatus([]);
    }
  };

  // Count OK / NG from COVER_D1
  const okCount = planStatus.filter((r) => r.COVER_D1 === "OK").length;
  const ngCount = planStatus.filter((r) => r.COVER_D1 !== "OK" && r.COVER_D1 !== null && r.COVER_D1 !== undefined).length;

  // Đẩy số dòng OK/NG lên header PlanManager để badge hiển thị số thật
  useEffect(() => {
    onCountsChange?.(okCount, ngCount);
  }, [okCount, ngCount, onCountsChange]);

  /* ── AG-Grid Table ── */
  const planStatusDataAGTable = useMemo(
    () => (
      <AGTable
        ref={gridRef}
        suppressRowClickSelection={false}
        showFilter={true}
        columns={column_planstatus}
        data={planStatus}
        onSelectionChange={() => {}}
      />
    ),
    [planStatus, column_planstatus]
  );

  return (
    <>
      {/* Status Filter Bar */}
      <div className="precision-plan__statusBar">
        <div className="precision-plan__filterGroup">
          <span className="precision-plan__filterLabel">Ngày kiểm tra:</span>
          <input
            type="date"
            className="precision-plan__filterInput precision-plan__filterInput--date"
            value={fromdate}
            onChange={(e) => setFromDate(e.target.value)}
          />
        </div>
        <button
          type="button"
          className="precision-plan__filterBtn precision-plan__filterBtn--primary"
          onClick={handleloadPlanStatus}
        >
          <FiRefreshCw size={12} />
          CHECK PLAN
        </button>

        {planStatus.length > 0 && (
          <>
            <div className="precision-plan__filterSep" />
            <span className="precision-plan__kpiBadge precision-plan__kpiBadge--ok">
              Dòng OK: <strong>{okCount}</strong>
            </span>
            <span className="precision-plan__kpiBadge precision-plan__kpiBadge--ng">
              Dòng NG: <strong>{ngCount}</strong>
            </span>
          </>
        )}
      </div>

      {/* Grid Container */}
      <div className="precision-plan__gridContainer">
        <div className="precision-plan__gridToolbar">
          <div className="precision-plan__gridToolbarLeft">
            <div className="precision-plan__gridActions">
              <button
                type="button"
                className="precision-plan__gridBtn precision-plan__gridBtn--excel"
                onClick={() => exportFilteredRowsToExcel(gridRef.current?.api, planStatus, "Plan_Status")}
                title="Xuất Excel các dòng đang hiển thị (sau khi lọc)"
              >
                📥 EX1
              </button>
              <button
                type="button"
                className="precision-plan__gridBtn precision-plan__gridBtn--excel"
                onClick={() => SaveExcel(planStatus, "Plan_Status_Full")}
                title="Xuất Excel toàn bộ dữ liệu"
              >
                📥 EX2
              </button>
              <button
                type="button"
                className="precision-plan__gridBtn precision-plan__gridBtn--pivot"
                onClick={() => setShowPivot(true)}
                title="Phân tích Pivot"
              >
                📊 PIVOT
              </button>
            </div>
          </div>
          <div className="precision-plan__gridMeta">
            Hiển thị: <strong>{planStatus.length}</strong> dòng
          </div>
        </div>
        <div className="precision-plan__gridBody">
          {planStatusDataAGTable}
        </div>
      </div>

      {/* Pivot Overlay */}
      <PrecisionPlanPivotModal
        isOpen={showPivot}
        onClose={() => setShowPivot(false)}
        data={planStatus as any[]}
        title="PHÂN TÍCH PIVOT — TRẠNG THÁI KIỂM TRA PLAN"
        tableID="planStatusPivot"
      />
    </>
  );
};

export default PlanManagerStatusTab;
