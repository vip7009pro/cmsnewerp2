import React, { useEffect, useMemo, useRef, useState, useCallback } from "react";
import Swal from "sweetalert2";
import AGTable from "../../../components/DataTable/AGTable";
import { getSocket, getUserData } from "../../../api/Api";
import { f_insert_Notification_Data } from "../../../api/services/notificationService";
import { NotificationElement } from "../../../components/NotificationPanel/Notification";
import { SaveExcel } from "../../../api/services/excelService";
import { f_loadProdOverData, f_updateProdOverData } from "../utils/kdUtils";
import { PROD_OVER_DATA } from "../interfaces/kdInterface";

import "./PrecisionOverMonitor/PrecisionOverMonitor.scss";
import PrecisionOverHeader from "./PrecisionOverMonitor/PrecisionOverHeader";
import PrecisionOverKpi from "./PrecisionOverMonitor/PrecisionOverKpi";
import PrecisionOverChart from "./PrecisionOverMonitor/PrecisionOverChart";
import PrecisionOverToolbar from "./PrecisionOverMonitor/PrecisionOverToolbar";
import { getPrecisionOverColumns } from "./PrecisionOverMonitor/PrecisionOverColumns";
import PrecisionOverPivotModal from "./PrecisionOverMonitor/PrecisionOverPivotModal";

const OVER_MONITOR: React.FC = () => {
  const [only_pending, setOnly_Pending] = useState<boolean>(true);
  const [showhidePivotTable, setShowHidePivotTable] = useState<boolean>(false);
  const [showChart, setShowChart] = useState<boolean>(true);
  const [tableData, setTableData] = useState<Array<PROD_OVER_DATA>>([]);
  const [chartData, setChartData] = useState<Array<PROD_OVER_DATA>>([]);
  const [searchText, setSearchText] = useState<string>("");
  const [selectedCount, setSelectedCount] = useState<number>(0);

  const sltRows = useRef<PROD_OVER_DATA[]>([]);

  // Tải bảng dữ liệu chính theo trạng thái Pending
  const loadTableData = useCallback(async () => {
    Swal.fire({
      title: "Tra data",
      text: "Đang tra data sản xuất dư...",
      icon: "info",
      showCancelButton: false,
      allowOutsideClick: false,
      confirmButtonText: "OK",
      showConfirmButton: false,
    });
    try {
      const data = await f_loadProdOverData(only_pending);
      setTableData(data || []);
      sltRows.current = [];
      setSelectedCount(0);
    } catch (error) {
      console.error("Lỗi nạp dữ liệu sản xuất dư:", error);
    } finally {
      Swal.close();
    }
  }, [only_pending]);

  // Tải dữ liệu toàn bộ cho biểu đồ xu hướng tuần
  const loadChartData = useCallback(async () => {
    try {
      const allData = await f_loadProdOverData(false);
      setChartData(allData || []);
    } catch (error) {
      console.error("Lỗi nạp dữ liệu biểu đồ:", error);
    }
  }, []);

  // Tải đồng bộ cả bảng và biểu đồ
  const loadAllData = useCallback(async () => {
    await loadTableData();
    await loadChartData();
  }, [loadTableData, loadChartData]);

  // Cập nhật trạng thái từng dòng (Bảo lưu nguyên vẹn 100% nghiệp vụ)
  const updateData = useCallback(
    async (prod_over_data: PROD_OVER_DATA, updateValue: string) => {
      Swal.fire({
        title: "Chắc chắn muốn update Data ?",
        text: "Suy nghĩ kỹ trước khi hành động",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Vẫn update!",
        cancelButtonText: "Hủy bỏ",
      }).then(async (result) => {
        if (result.isConfirmed) {
          switch (getUserData()?.MAINDEPTNAME) {
            case "KD": {
              await f_updateProdOverData(prod_over_data, updateValue);
              const newNotification: NotificationElement = {
                CTR_CD: "002",
                NOTI_ID: -1,
                NOTI_TYPE: "success",
                TITLE: "Xác nhận hàng sản xuất dư",
                CONTENT: `${getUserData()?.EMPL_NO} (${getUserData()?.MIDLAST_NAME} ${
                  getUserData()?.FIRST_NAME
                }), nhân viên ${getUserData()?.WORK_POSITION_NAME} đã xác nhận ${
                  updateValue === "Y" ? "NHẬP" : "HỦY"
                } hàng sản xuất dư code ${prod_over_data.G_NAME_KD}, số YCSX: (${
                  prod_over_data.PROD_REQUEST_NO
                }, số lượng dư là: ${prod_over_data.OVER_QTY} EA).`,
                SUBDEPTNAME: "KD,INSPECTION",
                MAINDEPTNAME: "KD,INSPECTION",
                INS_EMPL: "NHU1903",
                INS_DATE: "2024-12-30",
                UPD_EMPL: "NHU1903",
                UPD_DATE: "2024-12-30",
              };
              if (await f_insert_Notification_Data(newNotification)) {
                getSocket().emit("notification_panel", newNotification);
              }
              await loadAllData();
              break;
            }
            default:
              Swal.fire("Thông báo", "Bạn không thuộc bộ phận kinh doanh", "success");
          }
        }
      });
    },
    [loadAllData]
  );

  // Xử lý xác nhận Nhập / Hủy hàng loạt
  const handleNhapHuyHangLoat = useCallback(
    (updatevalue: string) => {
      const selectedRows = sltRows.current;
      if (!selectedRows || selectedRows.length === 0) {
        Swal.fire("Thông báo", "Vui lòng chọn ít nhất một dòng dữ liệu cần thao tác", "warning");
        return;
      }

      Swal.fire({
        title: "Chắc chắn muốn update Data ?",
        text: `Bạn đang chọn ${selectedRows.length} dòng để ${
          updatevalue === "Y" ? "NHẬP" : "HỦY"
        } hàng loạt`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Vẫn update!",
        cancelButtonText: "Hủy bỏ",
      }).then(async (result) => {
        if (result.isConfirmed) {
          switch (getUserData()?.MAINDEPTNAME) {
            case "KD": {
              for (let i = 0; i < selectedRows.length; i++) {
                if (selectedRows[i].HANDLE_STATUS !== "C") {
                  await f_updateProdOverData(selectedRows[i], updatevalue);
                }
              }
              const newNotification: NotificationElement = {
                CTR_CD: "002",
                NOTI_ID: -1,
                NOTI_TYPE: "success",
                TITLE: "Xác nhận hàng sản xuất dư",
                CONTENT: `${getUserData()?.EMPL_NO} (${getUserData()?.MIDLAST_NAME} ${
                  getUserData()?.FIRST_NAME
                }), nhân viên ${getUserData()?.WORK_POSITION_NAME} đã xác nhận hàng sản xuất dư hàng loạt (${
                  updatevalue === "Y" ? "NHẬP" : "HỦY"
                })`,
                SUBDEPTNAME: "KD,INSPECTION",
                MAINDEPTNAME: "KD,INSPECTION",
                INS_EMPL: "NHU1903",
                INS_DATE: "2024-12-30",
                UPD_EMPL: "NHU1903",
                UPD_DATE: "2024-12-30",
              };
              if (await f_insert_Notification_Data(newNotification)) {
                getSocket().emit("notification_panel", newNotification);
              }
              break;
            }
            default:
              Swal.fire("Thông báo", "Bạn không thuộc bộ phận kinh doanh", "success");
          }
          await loadAllData();
          sltRows.current = [];
          setSelectedCount(0);
        }
      });
    },
    [loadAllData]
  );

  // Cấu hình cột Datagrid (bảo lưu 100% tương tác cell)
  const columns = useMemo(() => {
    return getPrecisionOverColumns({ onUpdateData: updateData });
  }, [updateData]);

  // Bộ lọc dữ liệu bảng theo ô tìm kiếm nhanh
  const filteredTableData = useMemo(() => {
    if (!searchText.trim()) return tableData;
    const term = searchText.toLowerCase();
    return tableData.filter((row) => {
      return (
        String(row.AUTO_ID || "").toLowerCase().includes(term) ||
        String(row.CUST_NAME_KD || "").toLowerCase().includes(term) ||
        String(row.G_CODE || "").toLowerCase().includes(term) ||
        String(row.G_NAME || "").toLowerCase().includes(term) ||
        String(row.G_NAME_KD || "").toLowerCase().includes(term) ||
        String(row.PROD_REQUEST_NO || "").toLowerCase().includes(term) ||
        String(row.PLAN_ID || "").toLowerCase().includes(term) ||
        String(row.EMPL_NO || "").toLowerCase().includes(term) ||
        String(row.KD_REMARK || "").toLowerCase().includes(term)
      );
    });
  }, [tableData, searchText]);

  // Khởi tạo ban đầu và tải lại khi only_pending thay đổi
  useEffect(() => {
    loadAllData();
  }, [only_pending]);

  return (
    <div className="precision-over-monitor">
      {/* 1. Sub-Header công nghiệp */}
      <PrecisionOverHeader
        onReload={loadAllData}
        showChart={showChart}
        onToggleChart={() => setShowChart((prev) => !prev)}
      />

      <div className="precision-over-body">
        {/* 2. 4 Widget KPI Summary Realtime */}
        <PrecisionOverKpi data={tableData} />

        {/* 3. Biểu đồ xu hướng tuần Recharts (cho phép ẩn/hiện) */}
        {showChart && <PrecisionOverChart data={chartData.length > 0 ? chartData : tableData} />}

        {/* 4. Thẻ Grid Table và Thanh Toolbar Điều Hành */}
        <div className="precision-over-grid-card">
          <PrecisionOverToolbar
            onlyPending={only_pending}
            onToggleOnlyPending={(checked) => setOnly_Pending(checked)}
            onReload={loadTableData}
            onNhapHangLoat={() => handleNhapHuyHangLoat("Y")}
            onHuyHangLoat={() => handleNhapHuyHangLoat("N")}
            searchText={searchText}
            onSearchChange={setSearchText}
            onExportEX1={() => SaveExcel(filteredTableData, "PRODUCTION_OVER_MONITOR_EX1")}
            onExportEX2={() => SaveExcel(tableData, "PRODUCTION_OVER_MONITOR_EX2_FULL")}
            onOpenPivot={() => setShowHidePivotTable(true)}
            selectedCount={selectedCount}
          />

          <div className="precision-over-table-wrapper">
            <AGTable
              showFilter={true}
              toolbar={<div />}
              columns={columns}
              data={filteredTableData}
              onCellEditingStopped={(params: any) => {
                console.log("Cell edit stopped:", params.data);
              }}
              onSelectionChange={(params: any) => {
                const selected = params?.api?.getSelectedRows() || [];
                sltRows.current = selected;
                setSelectedCount(selected.length);
              }}
            />
          </div>
        </div>
      </div>

      {/* 5. Modal Phân Tích Đa Chiều Pivot Grid */}
      <PrecisionOverPivotModal
        isOpen={showhidePivotTable}
        onClose={() => setShowHidePivotTable(false)}
        data={tableData}
      />
    </div>
  );
};

export default OVER_MONITOR;
