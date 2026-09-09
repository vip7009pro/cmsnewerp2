import React, { useCallback, useEffect, useMemo, useState } from "react";
import { generalQuery } from "../../../api/Api";
import "./PrecisionPheDuyetNghi/PrecisionPheDuyetNghi.scss";
import Swal from "sweetalert2";
import moment from "moment";
import AGTable from "../../../components/DataTable/AGTable";
import { SaveExcel } from "../../../api/services/excelService";
import { PheDuyetNghiData } from "../interfaces/nhansuInterface";
import PrecisionPheDuyetHeader from "./PrecisionPheDuyetNghi/PrecisionPheDuyetHeader";
import PrecisionPheDuyetKpi from "./PrecisionPheDuyetNghi/PrecisionPheDuyetKpi";
import PrecisionPheDuyetToolbar from "./PrecisionPheDuyetNghi/PrecisionPheDuyetToolbar";
import {
  PheDuyetActionCell,
  PheDuyetEmployeeCell,
  PheDuyetMonoBadge,
  PheDuyetReasonBadge,
} from "./PrecisionPheDuyetNghi/PrecisionPheDuyetCells";
import PrecisionPheDuyetPivotModal from "./PrecisionPheDuyetNghi/PrecisionPheDuyetPivotModal";

/**
 * PheDuyetNghiCMS - Trung tâm Phê duyệt Nghỉ phép & Quản lý Phép ca kíp (NS2)
 * Redesigned with Google Stitch High-Density Enterprise UI
 * Original implementation preserved in PheDuyetNghiCMS.backup.tsx
 */
const PheDuyetNghiCMS: React.FC<{ option?: string }> = ({ option = "pheduyetnghi" }) => {
  const [fromdate, setFromDate] = useState<string>(moment().format("YYYY-MM-01"));
  const [todate, setToDate] = useState<string>(
    moment().endOf("month").add(1, "months").format("YYYY-MM-DD")
  );
  const [onlyPending, setOnlyPending] = useState<boolean>(true);
  const [diemdanhnhomtable, setDiemDanhNhomTable] = useState<PheDuyetNghiData[]>([]);
  const [searchKeyword, setSearchKeyword] = useState<string>("");
  const [filterReason, setFilterReason] = useState<string>("all");
  const [isPivotOpen, setIsPivotOpen] = useState<boolean>(false);

  // Thao tác duyệt, từ chối, reset, xóa
  const handleApprove = useCallback((offId: number, applyDate: string, onOff: number, reasonName: string) => {
    if (onOff === 0 || onOff === null || reasonName === "Nửa phép") {
      generalQuery("setpheduyetnhom", {
        off_id: offId,
        pheduyetvalue: 1,
      })
        .then((response) => {
          if (response.data.tk_status === "OK") {
            setDiemDanhNhomTable((prev) =>
              prev.map((p) => (p.OFF_ID === offId ? { ...p, APPROVAL_STATUS: 1 } : p))
            );
          } else {
            Swal.fire("Có lỗi", "Nội dung: " + response.data.message, "error");
          }
        })
        .catch((error) => {
          console.error(error);
        });
    } else {
      Swal.fire("Thông báo", "Đã điểm danh đi làm, không phê duyệt nghỉ được!", "warning");
    }
  }, []);

  const handleReject = useCallback((offId: number) => {
    generalQuery("setpheduyetnhom", {
      off_id: offId,
      pheduyetvalue: 0,
    })
      .then((response) => {
        if (response.data.tk_status === "OK") {
          setDiemDanhNhomTable((prev) =>
            prev.map((p) => (p.OFF_ID === offId ? { ...p, APPROVAL_STATUS: 0 } : p))
          );
        } else {
          Swal.fire("Có lỗi", "Nội dung: " + response.data.message, "error");
        }
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  const handleReset = useCallback((offId: number) => {
    setDiemDanhNhomTable((prev) =>
      prev.map((p) => (p.OFF_ID === offId ? { ...p, APPROVAL_STATUS: 2 } : p))
    );
  }, []);

  const handleDelete = useCallback((offId: number) => {
    Swal.fire({
      title: "Chắc chắn muốn xóa đăng ký nghỉ đã chọn?",
      text: "Đơn đăng ký nghỉ này sẽ bị xóa khỏi hệ thống!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Vẫn Xóa!",
      cancelButtonText: "Hủy",
    }).then((result) => {
      if (result.isConfirmed) {
        generalQuery("setpheduyetnhom", {
          off_id: offId,
          pheduyetvalue: 3,
        })
          .then((response) => {
            if (response.data.tk_status === "OK") {
              setDiemDanhNhomTable((prev) =>
                prev.map((p) => (p.OFF_ID === offId ? { ...p, APPROVAL_STATUS: 3 } : p))
              );
              Swal.fire("Đã Xóa", "Đã xóa đăng ký nghỉ thành công!", "success");
            } else {
              Swal.fire("Có lỗi", "Nội dung: " + response.data.message, "error");
            }
          })
          .catch((error) => {
            console.error(error);
          });
      }
    });
  }, []);

  // Tải dữ liệu từ API
  const loadPheDuyetNghi = useCallback(() => {
    generalQuery(option, {
      FROM_DATE: fromdate,
      TO_DATE: todate,
      ONLY_PENDING: onlyPending,
    })
      .then((response) => {
        if (response.data.tk_status !== "NG" && Array.isArray(response.data.data)) {
          const loaded_data = response.data.data.map((e: any) => {
            return {
              ...e,
              REQUEST_DATE: e.REQUEST_DATE ? moment.utc(e.REQUEST_DATE).format("YYYY-MM-DD") : "",
              APPLY_DATE: e.APPLY_DATE ? moment.utc(e.APPLY_DATE).format("YYYY-MM-DD") : "",
              DOB: e.DOB ? moment.utc(e.DOB).format("YYYY-MM-DD") : "",
              FULL_NAME: `${e.MIDLAST_NAME || ""} ${e.FIRST_NAME || ""}`.trim(),
              id: e.OFF_ID,
            };
          });
          setDiemDanhNhomTable(loaded_data);
        } else {
          setDiemDanhNhomTable([]);
          Swal.fire("Thông báo", "Nội dung: " + (response.data.message || "Không có dữ liệu"), "info");
        }
      })
      .catch((error) => {
        console.error(error);
      });
  }, [option, fromdate, todate, onlyPending]);

  useEffect(() => {
    loadPheDuyetNghi();
  }, [loadPheDuyetNghi]);

  // Thống kê 4 KPI
  const stats = useMemo(() => {
    const total = diemdanhnhomtable.length;
    let pending = 0;
    let approved = 0;
    let rejected = 0;

    diemdanhnhomtable.forEach((item) => {
      if (item.APPROVAL_STATUS === 1) approved++;
      else if (item.APPROVAL_STATUS === 0 || item.APPROVAL_STATUS === 2) pending++;
      else if (item.APPROVAL_STATUS === 3) rejected++;
    });

    return { total, pending, approved, rejected };
  }, [diemdanhnhomtable]);

  // Dữ liệu lọc theo từ khóa và kiểu nghỉ
  const filteredData = useMemo(() => {
    let list = [...diemdanhnhomtable];

    if (filterReason !== "all") {
      list = list.filter(
        (item) => item.REASON_NAME && item.REASON_NAME.toLowerCase().includes(filterReason.toLowerCase())
      );
    }

    if (searchKeyword.trim()) {
      const q = searchKeyword.toLowerCase();
      list = list.filter((item) => {
        return (
          (item.FULL_NAME && item.FULL_NAME.toLowerCase().includes(q)) ||
          (item.EMPL_NO && item.EMPL_NO.toLowerCase().includes(q)) ||
          (item.CMS_ID && String(item.CMS_ID).toLowerCase().includes(q)) ||
          (item.REASON_NAME && item.REASON_NAME.toLowerCase().includes(q)) ||
          (item.REMARK && item.REMARK.toLowerCase().includes(q)) ||
          (item.MAINDEPTNAME && item.MAINDEPTNAME.toLowerCase().includes(q)) ||
          (item.SUBDEPTNAME && item.SUBDEPTNAME.toLowerCase().includes(q))
        );
      });
    }

    return list;
  }, [diemdanhnhomtable, filterReason, searchKeyword]);

  // Xuất Excel EX1 & EX2
  const handleExportEX1 = () => {
    if (filteredData.length === 0) return;
    SaveExcel(filteredData, `NS2_PheDuyetNghi_DangLoc_${moment().format("YYYYMMDD_HHmmss")}`);
  };

  const handleExportEX2 = () => {
    if (diemdanhnhomtable.length === 0) return;
    SaveExcel(diemdanhnhomtable, `NS2_PheDuyetNghi_TatCa_${moment().format("YYYYMMDD_HHmmss")}`);
  };

  // Cấu hình các cột AGTable High-Density
  const columns = useMemo(
    () => [
      { field: "id", headerName: "ID", width: 45, cellStyle: { textAlign: "center", color: "#64748b", fontWeight: 700 } },
      {
        field: "PHE_DUYET",
        headerName: "THAO TÁC DUYỆT",
        width: 155,
        cellRenderer: (params: any) => (
          <PheDuyetActionCell
            data={params.data}
            onApprove={handleApprove}
            onReject={handleReject}
            onReset={handleReset}
            onDelete={handleDelete}
          />
        ),
      },
      { field: "EMPL_NO", headerName: "MÃ NV", width: 80, cellRenderer: PheDuyetMonoBadge },
      { field: "CMS_ID", headerName: "NS_ID", width: 68, cellRenderer: PheDuyetMonoBadge },
      { field: "FULL_NAME", headerName: "HỌ VÀ TÊN", width: 155, cellRenderer: PheDuyetEmployeeCell },
      { field: "REQUEST_DATE", headerName: "NGÀY LÀM ĐƠN", width: 95, cellStyle: { fontFamily: "JetBrains Mono, monospace", fontSize: "11px" } },
      { field: "APPLY_DATE", headerName: "NGÀY NGHỈ", width: 95, cellStyle: { fontFamily: "JetBrains Mono, monospace", fontSize: "11px", fontWeight: 700, color: "#1e293b" } },
      { field: "REASON_NAME", headerName: "KIỂU NGHỈ", width: 115, cellRenderer: PheDuyetReasonBadge },
      { field: "CA_NGHI", headerName: "CA NGHỈ", width: 65, cellStyle: { textAlign: "center", fontWeight: 700 } },
      { field: "REMARK", headerName: "LÝ DO / GHI CHÚ", minWidth: 140, flex: 1 },
      { field: "ON_OFF", headerName: "ĐIỂM DANH", width: 75, cellStyle: { textAlign: "center" } },
      { field: "DOB", headerName: "NGÀY SINH", width: 85, cellStyle: { fontFamily: "JetBrains Mono, monospace", fontSize: "11px" } },
      { field: "POSITION_NAME", headerName: "CHỨC DANH", width: 90 },
      { field: "FACTORY_NAME", headerName: "NHÀ MÁY", width: 90 },
      { field: "WORK_SHIF_NAME", headerName: "CA KÍP", width: 90 },
      { field: "JOB_NAME", headerName: "CÔNG VIỆC", width: 90 },
      { field: "MAINDEPTNAME", headerName: "PHÒNG BAN", width: 90 },
      { field: "SUBDEPTNAME", headerName: "BỘ PHẬN", width: 90 },
      { field: "WORK_POSITION_NAME", headerName: "VỊ TRÍ", width: 110 },
    ],
    [handleApprove, handleReject, handleReset, handleDelete]
  );

  return (
    <div className="precision-pheduyet">
      {/* 1. HEADER BANNER & TELEMETRY */}
      <PrecisionPheDuyetHeader />

      {/* 2. 4 THẺ KPI REALTIME */}
      <PrecisionPheDuyetKpi
        totalCount={stats.total}
        pendingCount={stats.pending}
        approvedCount={stats.approved}
        rejectedCount={stats.rejected}
      />

      {/* 3. TOOLBAR LỌC & HÀNH ĐỘNG */}
      <PrecisionPheDuyetToolbar
        fromDate={fromdate}
        toDate={todate}
        onlyPending={onlyPending}
        onFromDateChange={setFromDate}
        onToDateChange={setToDate}
        onOnlyPendingChange={setOnlyPending}
        onSearch={loadPheDuyetNghi}
        onExportEX1={handleExportEX1}
        onExportEX2={handleExportEX2}
        onOpenPivot={() => setIsPivotOpen(true)}
      />

      {/* 4. AG-GRID CONTAINER (CHỐNG CO BẸP MULTI-TAB) */}
      <div className="precision-pheduyet__gridContainer">
        <div className="precision-pheduyet__gridToolbar">
          <div className="toolbar-left">
            <div className="search-box">
              <span className="material-symbols-outlined">search</span>
              <input
                type="text"
                placeholder="Lọc nhanh nhân viên, mã, lý do..."
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
              />
            </div>

            <select
              className="reason-select"
              value={filterReason}
              onChange={(e) => setFilterReason(e.target.value)}
            >
              <option value="all">Tất cả kiểu nghỉ</option>
              <option value="Phép năm">Phép năm</option>
              <option value="Nửa phép">Nửa phép</option>
              <option value="Việc riêng">Việc riêng</option>
              <option value="ốm">Nghỉ ốm (BHXH)</option>
              <option value="Chế độ">Chế độ</option>
            </select>
          </div>

          <div className="toolbar-right">
            <span>
              Đang hiển thị: <strong>{filteredData.length} / {diemdanhnhomtable.length}</strong> đơn
            </span>
          </div>
        </div>

        <div className="precision-pheduyet__gridBody">
          <AGTable
            rowHeight={38}
            columns={columns}
            data={filteredData}
            suppressRowClickSelection={false}
            // KHÔNG truyền prop toolbar để tránh render toolbar xanh lá cũ
          />
        </div>
      </div>

      {/* 5. MODAL PIVOT PHÂN TÍCH ĐA CHIỀU */}
      <PrecisionPheDuyetPivotModal
        isOpen={isPivotOpen}
        onClose={() => setIsPivotOpen(false)}
        data={diemdanhnhomtable}
      />
    </div>
  );
};

export default PheDuyetNghiCMS;
