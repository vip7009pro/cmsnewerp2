import React, { useMemo, useState, useCallback } from "react";
import * as XLSX from "xlsx";
import moment from "moment";
import Swal from "sweetalert2";
import { FiX } from "react-icons/fi";
import { getCompany } from "../../../api/Api";
import AGTable from "../../../components/DataTable/AGTable";
import "./PrecisionYCSX/PrecisionYCSX.scss";

// Precision Sub-components
import { useYCSXLogic } from "./PrecisionYCSX/useYCSXLogic";
import PrecisionYCSXHeader from "./PrecisionYCSX/PrecisionYCSXHeader";
import PrecisionYCSXKpi from "./PrecisionYCSX/PrecisionYCSXKpi";
import PrecisionYCSXFilterPanel, { YCSXFilterState } from "./PrecisionYCSX/PrecisionYCSXFilterPanel";
import PrecisionYCSXToolbar from "./PrecisionYCSX/PrecisionYCSXToolbar";
import PrecisionYCSXAddModal from "./PrecisionYCSX/PrecisionYCSXAddModal";
import PrecisionYCSXEditModal from "./PrecisionYCSX/PrecisionYCSXEditModal";
import PrecisionYCSXPrintModals from "./PrecisionYCSX/PrecisionYCSXPrintModals";
import PrecisionAmzAddModal from "./PrecisionYCSX/PrecisionAmzAddModal";
import PrecisionAmzTab from "./PrecisionYCSX/PrecisionAmzTab";
import { getYCSXColumns } from "./PrecisionYCSX/PrecisionYCSXColumns";

const YCSXManager: React.FC = () => {
  const ycsx = useYCSXLogic();
  const [isFilterHidden, setIsFilterHidden] = useState(false);
  const isCMS = getCompany() === "CMS";

  // Grid Columns Configuration
  const columns = useMemo(() => {
    return getYCSXColumns({
      company: getCompany(),
      onUploadBanVe: ycsx.handleUploadBanVe,
    });
  }, [ycsx.handleUploadBanVe]);

  // Row Styling
  const getRowStyle = useCallback((params: any) => {
    if (params.data?.USE_YN === "N") {
      return { backgroundColor: "#fff9db", fontSize: "0.72rem" };
    }
    return { backgroundColor: "#ffffff", fontSize: "0.72rem" };
  }, []);

  // Filter Object Memo
  const filterValues: YCSXFilterState = useMemo(
    () => ({
      fromdate: ycsx.fromdate,
      todate: ycsx.todate,
      codeKD: ycsx.codeKD,
      codeCMS: ycsx.codeCMS,
      empl_name: ycsx.empl_name,
      cust_name: ycsx.cust_name,
      prod_type: ycsx.prod_type,
      prodrequestno: ycsx.prodrequestno,
      phanloai: ycsx.phanloai,
      phanloaihang: ycsx.phanloaihang,
      material: ycsx.material,
      is_tam_thoi: ycsx.is_tam_thoi,
      alltime: ycsx.alltime,
      materialYES: ycsx.materialYES,
      ycsxpendingcheck: ycsx.ycsxpendingcheck,
      inspectInputcheck: ycsx.inspectInputcheck,
    }),
    [
      ycsx.fromdate,
      ycsx.todate,
      ycsx.codeKD,
      ycsx.codeCMS,
      ycsx.empl_name,
      ycsx.cust_name,
      ycsx.prod_type,
      ycsx.prodrequestno,
      ycsx.phanloai,
      ycsx.phanloaihang,
      ycsx.material,
      ycsx.is_tam_thoi,
      ycsx.alltime,
      ycsx.materialYES,
      ycsx.ycsxpendingcheck,
      ycsx.inspectInputcheck,
    ]
  );

  // Filter Change Dispatcher
  const handleFilterChange = useCallback(
    (field: keyof YCSXFilterState, value: string | boolean) => {
      switch (field) {
        case "fromdate":
          ycsx.setFromDate(value as string);
          break;
        case "todate":
          ycsx.setToDate(value as string);
          break;
        case "codeKD":
          ycsx.setCodeKD(value as string);
          break;
        case "codeCMS":
          ycsx.setCodeCMS(value as string);
          break;
        case "empl_name":
          ycsx.setEmpl_Name(value as string);
          break;
        case "cust_name":
          ycsx.setCust_Name(value as string);
          break;
        case "prod_type":
          ycsx.setProdType(value as string);
          break;
        case "prodrequestno":
          ycsx.setProdRequestNo(value as string);
          break;
        case "phanloai":
          ycsx.setPhanLoai(value as string);
          break;
        case "phanloaihang":
          ycsx.setPhanLoaiHang(value as string);
          break;
        case "material":
          ycsx.setMaterial(value as string);
          break;
        case "is_tam_thoi":
          ycsx.setIs_Tam_Thoi(value as string);
          break;
        case "alltime":
          ycsx.setAllTime(value as boolean);
          break;
        case "materialYES":
          ycsx.setMaterialYES(value as boolean);
          break;
        case "ycsxpendingcheck":
          ycsx.setYCSXPendingCheck(value as boolean);
          break;
        case "inspectInputcheck":
          ycsx.setInspectInputCheck(value as boolean);
          break;
        default:
          break;
      }
    },
    [ycsx]
  );

  // Excel Exports
  const exportToExcel = (data: any[], fileName: string) => {
    if (!data || data.length === 0) {
      Swal.fire("Thông báo", "Không có dữ liệu để xuất Excel", "warning");
      return;
    }
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "YCSX");
    XLSX.writeFile(wb, `${fileName}_${moment().format("YYYYMMDD_HHmmss")}.xlsx`);
  };

  const handleExportEX1 = useCallback(() => {
    exportToExcel(ycsx.ycsxDataTable, "YCSX_ToanBo");
  }, [ycsx.ycsxDataTable]);

  const handleExportEX2 = useCallback(() => {
    const selected =
      ycsx.ycsxdatatablefilter.current.length > 0
        ? ycsx.ycsxdatatablefilter.current
        : ycsx.ycsxDataTable;
    exportToExcel(selected, "YCSX_LuaChon");
  }, [ycsx.ycsxDataTable]);

  // KPI Calculations
  const kpiData = useMemo(() => {
    const total = ycsx.ycsxDataTable.length;
    const approved = ycsx.ycsxDataTable.filter(
      (r) => r.PDUYET === 1 || String(r.PDUYET) === "1"
    ).length;
    const pending = ycsx.ycsxDataTable.filter(
      (r) => r.YCSX_PENDING === 1 || String(r.YCSX_PENDING) === "1"
    ).length;
    const materialShortage = ycsx.ycsxDataTable.filter(
      (r) => r.MATERIAL_YN === "N"
    ).length;
    return {
      totalCount: total,
      approvedCount: approved,
      pendingCount: pending,
      materialShortageCount: materialShortage,
    };
  }, [ycsx.ycsxDataTable]);

  return (
    <div
      className="precision-ycsx"
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        width: "100%",
        flex: "1 1 0px",
        minHeight: 0,
        overflow: "hidden",
      }}
    >
      {/* 1. Header (Tabs & Main Actions) */}
      <PrecisionYCSXHeader
        activeTab={ycsx.activeTab === "ycsx" ? 0 : 1}
        onSelectTab={(idx) => ycsx.setActiveTab(idx === 0 ? "ycsx" : "amazon")}
        ycsxCount={ycsx.ycsxDataTable.length}
        amzCount={0}
        onOpenAddYcsxModal={() => {
          ycsx.clearYCSXform();
          ycsx.setIsAddModalOpen(true);
        }}
        onOpenAddAmzModal={() => ycsx.setIsAmzAddModalOpen(true)}
        isCMS={isCMS}
      />

      {/* 2. Sub-Tab 1: Quản lý YCSX */}
      {ycsx.activeTab === "ycsx" && (
        <div
          className="precision-ycsx__tabContent"
          style={{
            display: "flex",
            flexDirection: "column",
            flex: "1 1 0px",
            height: "100%",
            width: "100%",
            minHeight: 0,
            overflow: "hidden",
          }}
        >
          {/* KPI Dashboard */}
          <PrecisionYCSXKpi
            mode="ycsx"
            totalCount={kpiData.totalCount}
            approvedCount={kpiData.approvedCount}
            pendingCount={kpiData.pendingCount}
            materialShortageCount={kpiData.materialShortageCount}
          />

          {/* Main 2-column Content Body */}
          <div
            className="precision-ycsx__mainBody"
            style={{
              display: "flex",
              flex: "1 1 0px",
              height: "100%",
              width: "100%",
              minHeight: 0,
              overflow: "hidden",
            }}
          >
            {/* Left 250px Filter Sidebar */}
            <PrecisionYCSXFilterPanel
              filters={filterValues}
              onFilterChange={handleFilterChange}
              onSearch={ycsx.handletraYCSX}
              onReset={ycsx.clearYCSXform}
              isHidden={isFilterHidden}
              isCMS={isCMS}
            />

            {/* Right Container: Toolbar + AG Grid Table */}
            <main
              className="precision-ycsx__content"
              style={{
                display: "flex",
                flexDirection: "column",
                flex: "1 1 0px",
                height: "100%",
                width: "100%",
                minWidth: 0,
                minHeight: 0,
                overflow: "hidden",
              }}
            >
              {/* Action Toolbar */}
              <PrecisionYCSXToolbar
                onToggleFilter={() => setIsFilterHidden((prev) => !prev)}
                isFilterHidden={isFilterHidden}
                onOpenAddModal={() => {
                  ycsx.clearYCSXform();
                  ycsx.setIsAddModalOpen(true);
                }}
                onOpenEditModal={ycsx.handle_fillsuaform}
                onDeleteYcsx={ycsx.handleConfirmDeleteYCSX}
                onSetClosed={ycsx.handleConfirmSetClosedYCSX}
                onSetPending={ycsx.handleConfirmSetPendingYCSX}
                onPrintYcsx={ycsx.handlePrintYCSX}
                onCheckBanVe={ycsx.handlePrintBanVe}
                onApproveYcsx={ycsx.handleConfirmPDuyetYCSX}
                onLockYcsx={ycsx.handleConfirmLockYCSX}
                onUnlockYcsx={ycsx.handleConfirmOpenYCSX}
                onLockMaterial={ycsx.handleConfirmLockMaterial}
                onExportEX1={handleExportEX1}
                onExportEX2={handleExportEX2}
                onTogglePivot={() => ycsx.setShowPivot((prev) => !prev)}
              />

              {/* Data Table Container with Fail-safe Full Height */}
              <div
                className="precision-ycsx__tableContainer"
                style={{
                  display: "flex",
                  flexDirection: "column",
                  flex: "1 1 0px",
                  height: "100%",
                  width: "100%",
                  minHeight: 250,
                  overflow: "hidden",
                }}
              >
                <AGTable
                  data={ycsx.ycsxDataTable}
                  columns={columns}
                  showFilter={false}
                  toolbar={null}
                  getRowStyle={getRowStyle}
                  suppressRowClickSelection={false}
                  onRowClick={(params: any) => ycsx.setClickedRows(params.data)}
                  onSelectionChange={(params: any) => {
                    ycsx.ycsxdatatablefilter.current =
                      params?.api?.getSelectedRows() || [];
                  }}
                />
              </div>
            </main>
          </div>
        </div>
      )}

      {/* 3. Sub-Tab 2: Quản lý Amazon */}
      {ycsx.activeTab === "amazon" && (
        <div
          className="precision-ycsx__tabContent"
          style={{
            display: "flex",
            flexDirection: "column",
            flex: "1 1 0px",
            height: "100%",
            width: "100%",
            minHeight: 0,
            overflow: "hidden",
          }}
        >
          <PrecisionAmzTab
            onOpenAmzAddModal={() => ycsx.setIsAmzAddModalOpen(true)}
          />
        </div>
      )}

      {/* 4. Modals */}
      {/* Modal Thêm YCSX Mới (Thủ công + Excel) */}
      <PrecisionYCSXAddModal
        open={ycsx.isAddModalOpen}
        onClose={() => ycsx.setIsAddModalOpen(false)}
        customerList={ycsx.customerList}
        selectedCust_CD={ycsx.selectedCust_CD}
        onSelectCustomer={(cust) => {
          ycsx.setSelectedCust_CD(cust);
          ycsx.loadPONO(ycsx.selectedCode?.G_CODE, cust?.CUST_CD);
        }}
        codeList={ycsx.codeList}
        selectedCode={ycsx.selectedCode}
        onSelectCode={(code) => {
          ycsx.setSelectedCode(code);
          ycsx.loadPONO(code?.G_CODE, ycsx.selectedCust_CD?.CUST_CD);
        }}
        newphanloai={ycsx.newphanloai}
        setNewPhanLoai={ycsx.setNewPhanLoai}
        loaisx={ycsx.loaisx}
        setLoaiSX={ycsx.setLoaiSX}
        loaixh={ycsx.loaixh}
        setLoaiXH={ycsx.setLoaiXH}
        isFirstLOT={ycsx.isFirstLOT}
        setIsFirstLot={ycsx.setIsFirstLot}
        is_tam_thoi={ycsx.is_tam_thoi}
        setIs_Tam_Thoi={ycsx.setIs_Tam_Thoi}
        deliverydate={ycsx.deliverydate}
        setNewDeliveryDate={ycsx.setNewDeliveryDate}
        selectedPoNo={ycsx.selectedPoNo}
        ponolist={ycsx.ponolist}
        onSelectPoNo={(po) => ycsx.setSelectedPoNo(po)}
        newycsxqty={ycsx.newycsxqty}
        setNewYcsxQty={ycsx.setNewYcsxQty}
        newycsxremark={ycsx.newycsxremark}
        setNewYcsxRemark={ycsx.setNewYcsxRemark}
        onSaveManual={ycsx.handle_add_1YCSX}
        onClearManual={ycsx.clearYCSXform}
        uploadExcelJson={ycsx.uploadExcelJson}
        onUploadFile={ycsx.readUploadFile}
        onCheckExcel={ycsx.confirmCheckYcsxHangLoat}
        onUpExcel={ycsx.confirmUpYcsxHangLoat}
        onInsertRow={ycsx.handle_InsertYCSXTable}
        onClearExcel={ycsx.handle_DeleteYCSX_Excel}
        isCMS={isCMS}
      />

      {/* Modal Cập Nhật (Sửa) YCSX */}
      <PrecisionYCSXEditModal
        open={ycsx.isEditModalOpen}
        onClose={() => ycsx.setIsEditModalOpen(false)}
        selectedID={ycsx.selectedID || ""}
        customerList={ycsx.customerList}
        selectedCust_CD={ycsx.selectedCust_CD}
        onSelectCustomer={(cust) => {
          ycsx.setSelectedCust_CD(cust);
          ycsx.loadPONO(ycsx.selectedCode?.G_CODE, cust?.CUST_CD);
        }}
        codeList={ycsx.codeList}
        selectedCode={ycsx.selectedCode}
        onSelectCode={(code) => {
          ycsx.setSelectedCode(code);
          ycsx.loadPONO(code?.G_CODE, ycsx.selectedCust_CD?.CUST_CD);
        }}
        newphanloai={ycsx.newphanloai}
        setNewPhanLoai={ycsx.setNewPhanLoai}
        loaisx={ycsx.loaisx}
        setLoaiSX={ycsx.setLoaiSX}
        loaixh={ycsx.loaixh}
        setLoaiXH={ycsx.setLoaiXH}
        deliverydate={ycsx.deliverydate}
        setNewDeliveryDate={ycsx.setNewDeliveryDate}
        newycsxqty={ycsx.newycsxqty}
        setNewYcsxQty={ycsx.setNewYcsxQty}
        newycsxremark={ycsx.newycsxremark}
        setNewYcsxRemark={ycsx.setNewYcsxRemark}
        onUpdate={ycsx.updateYCSX}
        onClear={ycsx.clearYCSXform}
        isCMS={isCMS}
      />

      {/* Modal In YCSX & In Bản Vẽ */}
      <PrecisionYCSXPrintModals
        openYCSXPrint={ycsx.openYCSXPrint}
        openBanVePrint={ycsx.openBanVePrint}
        onClose={() => {
          ycsx.setOpenYCSXPrint(false);
          ycsx.setOpenBanVePrint(false);
        }}
        selectedRows={ycsx.ycsxdatatablefilter.current}
      />

      {/* Modal Upload Amazon Hàng Loạt */}
      <PrecisionAmzAddModal
        open={ycsx.isAmzAddModalOpen}
        onClose={() => ycsx.setIsAmzAddModalOpen(false)}
        prodrequestno={ycsx.prodrequestno}
        setProdRequestNo={ycsx.setProdRequestNo}
        id_congviec={ycsx.id_congviec}
        setID_CongViec={ycsx.setID_CongViec}
        codeKD={ycsx.codeKD}
        codeCMS={ycsx.codeCMS}
        cavityAmazon={ycsx.cavityAmazon}
        prod_model={ycsx.prod_model}
        amz_PL_HANG={ycsx.amz_PL_HANG}
        onFindAmazonCodeInfo={ycsx.handle_findAmazonCodeInfo}
        uploadExcelJson={ycsx.uploadExcelJson}
        onUploadFileAmazon={ycsx.readUploadFileAmazon}
        onUpAmazonData={ycsx.upAmazonDataSuperFast}
        onCheckDuplicateAMZ={ycsx.f_checkDuplicateAMZ}
        onClearExcel={() => ycsx.setUploadExcelJSon([])}
        progressValue={ycsx.progressvalue}
      />

      {/* Modal Pivot Summary */}
      {ycsx.showPivot && (
        <div
          className="precision-ycsx-modal-backdrop"
          onClick={() => ycsx.setShowPivot(false)}
        >
          <div
            className="precision-ycsx-modal-container"
            style={{ maxWidth: 850 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header">
              <div className="title-group">
                <h3>PHÂN TÍCH TỔNG HỢP YCSX (PIVOT DASHBOARD)</h3>
              </div>
              <button
                className="btn-close"
                onClick={() => ycsx.setShowPivot(false)}
              >
                <FiX />
              </button>
            </div>
            <div className="modal-body" style={{ padding: 16 }}>
              <table
                style={{
                  width: "100%",
                  borderCollapse: "collapse",
                  fontSize: 12,
                }}
              >
                <thead>
                  <tr style={{ background: "var(--bg-card)", textAlign: "left" }}>
                    <th style={{ padding: "8px 12px", border: "1px solid var(--border-color)" }}>
                      Khách hàng
                    </th>
                    <th style={{ padding: "8px 12px", border: "1px solid var(--border-color)" }}>
                      Số lệnh YCSX
                    </th>
                    <th style={{ padding: "8px 12px", border: "1px solid var(--border-color)" }}>
                      Tổng số lượng (EA)
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(
                    ycsx.ycsxDataTable.reduce((acc: any, row: any) => {
                      const cust = row.CUST_NAME_KD || "Khác";
                      if (!acc[cust]) acc[cust] = { count: 0, qty: 0 };
                      acc[cust].count += 1;
                      acc[cust].qty += Number(row.PROD_REQUEST_QTY || 0);
                      return acc;
                    }, {})
                  ).map(([cust, data]: [string, any]) => (
                    <tr key={cust}>
                      <td style={{ padding: "6px 12px", border: "1px solid var(--border-color)", fontWeight: 600 }}>
                        {cust}
                      </td>
                      <td style={{ padding: "6px 12px", border: "1px solid var(--border-color)" }}>
                        {data.count.toLocaleString()}
                      </td>
                      <td style={{ padding: "6px 12px", border: "1px solid var(--border-color)", color: "var(--brand-primary)", fontWeight: 700 }}>
                        {data.qty.toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="modal-footer">
              <button
                className="btn-secondary"
                onClick={() => ycsx.setShowPivot(false)}
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default YCSXManager;
