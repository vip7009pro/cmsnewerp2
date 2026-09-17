import React from "react";
import {
  DataGrid,
  GridRowSelectionModel,
  GridToolbarContainer,
  GridToolbarQuickFilter,
} from "@mui/x-data-grid";
import {
  AiFillFileExcel,
  AiFillFolderAdd,
  AiOutlinePrinter,
  AiOutlineSearch,
} from "react-icons/ai";
import { MdOutlinePendingActions } from "react-icons/md";
import { FaArrowRight } from "react-icons/fa";
import { BiShow } from "react-icons/bi";
import Swal from "sweetalert2";
import { YCSXTableData } from "../../../../kinhdoanh/interfaces/kdInterface";
import { SaveExcel } from "../../../../../api/services/excelService";
import { getColumnQuickPlanYCSXTable } from "./PrecisionQuickPlanColumns";

interface PrecisionQuickPlanYCSXSectionProps {
  isLoading: boolean;
  fromdate: string;
  setFromDate: (val: string) => void;
  todate: string;
  setToDate: (val: string) => void;
  codeKD: string;
  setCodeKD: (val: string) => void;
  codeCMS: string;
  setCodeCMS: (val: string) => void;
  empl_name: string;
  setEmpl_Name: (val: string) => void;
  cust_name: string;
  setCust_Name: (val: string) => void;
  prod_type: string;
  setProdType: (val: string) => void;
  prodrequestno: string;
  setProdRequestNo: (val: string) => void;
  material: string;
  setMaterial: (val: string) => void;
  phanloai: string;
  setPhanLoai: (val: string) => void;
  alltime: boolean;
  setAllTime: (val: boolean) => void;
  materialYES: boolean;
  setMaterialYES: (val: boolean) => void;
  ycsxpendingcheck: boolean;
  setYCSXPendingCheck: (val: boolean) => void;
  inspectInputcheck: boolean;
  setInspectInputCheck: (val: boolean) => void;
  handletraYCSX: () => void;
  handleSearchCodeKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  // Toolbar Props
  showhideycsxtable: number;
  setShowHideYCSXTable: (mode: number) => void;
  ycsxdatatable: YCSXTableData[];
  ycsxdatatablefilter: YCSXTableData[];
  handleConfirmSetClosedYCSX: () => void;
  handleConfirmSetPendingYCSX: () => void;
  handle_AddPlan: () => void;
  selection: any;
  setSelection: (val: any) => void;
  setYCSXListRender: (val: any) => void;
  renderYCSX: (ycsxlist: YCSXTableData[]) => any;
  renderBanVe: (ycsxlist: YCSXTableData[]) => any;
  handleYCSXSelectionforUpdate: (ids: GridRowSelectionModel) => void;
  handleUploadBanVe: (file: any, gCode: string) => Promise<void>;
}

export const PrecisionQuickPlanYCSXSection: React.FC<PrecisionQuickPlanYCSXSectionProps> = ({
  isLoading,
  fromdate,
  setFromDate,
  todate,
  setToDate,
  codeKD,
  setCodeKD,
  codeCMS,
  setCodeCMS,
  empl_name,
  setEmpl_Name,
  cust_name,
  setCust_Name,
  prod_type,
  setProdType,
  prodrequestno,
  setProdRequestNo,
  material,
  setMaterial,
  phanloai,
  setPhanLoai,
  alltime,
  setAllTime,
  materialYES,
  setMaterialYES,
  ycsxpendingcheck,
  setYCSXPendingCheck,
  inspectInputcheck,
  setInspectInputCheck,
  handletraYCSX,
  handleSearchCodeKeyDown,
  showhideycsxtable,
  setShowHideYCSXTable,
  ycsxdatatable,
  ycsxdatatablefilter,
  handleConfirmSetClosedYCSX,
  handleConfirmSetPendingYCSX,
  handle_AddPlan,
  selection,
  setSelection,
  setYCSXListRender,
  renderYCSX,
  renderBanVe,
  handleYCSXSelectionforUpdate,
  handleUploadBanVe,
}) => {
  const columns = React.useMemo(() => {
    return getColumnQuickPlanYCSXTable({
      onUploadBanVe: handleUploadBanVe,
    });
  }, [handleUploadBanVe]);

  const CustomToolbarPOTable = () => {
    return (
      <GridToolbarContainer className="quickplan-toolbar">
        <div className="toolbar-left">
          {/* Nút 1: Switch Tab */}
          <button
            type="button"
            className="stb-ghost-blue"
            onClick={() => {
              setShowHideYCSXTable(showhideycsxtable === 3 ? 1 : showhideycsxtable + 1);
            }}
            title="Chuyển chế độ hiển thị"
          >
            <BiShow size={13} />
            <span>Switch Tab</span>
          </button>

          {/* Nút 2: Save Excel */}
          <button
            type="button"
            className="stb-success"
            onClick={() => SaveExcel(ycsxdatatable, "YCSX Table")}
            title="Xuất bảng YCSX ra Excel"
          >
            <AiFillFileExcel size={13} />
            <span>SAVE Excel</span>
          </button>

          <span className="stb-sep" />

          {/* Nút 3: Quick Filter */}
          <GridToolbarQuickFilter
            placeholder="Lọc nhanh..."
            sx={{
              fontSize: 11,
              "& input": { height: 20, padding: "0 4px", fontSize: 11 },
            }}
          />
        </div>

        <div className="toolbar-right">
          {/* Nút 4: Set Closed */}
          <button
            type="button"
            className="stb-ghost-blue"
            onClick={handleConfirmSetClosedYCSX}
            title="SET CLOSED YCSX đã chọn"
          >
            <FaArrowRight size={11} />
            <span>SET CLOSED</span>
          </button>

          {/* Nút 5: Set Pending */}
          <button
            type="button"
            className="stb-ghost-rose"
            onClick={handleConfirmSetPendingYCSX}
            title="SET PENDING YCSX đã chọn"
          >
            <MdOutlinePendingActions size={13} />
            <span>SET PENDING</span>
          </button>

          <span className="stb-sep" />

          {/* Nút 6: Print YCSX */}
          <button
            type="button"
            className="stb-ghost-blue"
            onClick={() => {
              if (ycsxdatatablefilter.length > 0) {
                setSelection({
                  ...selection,
                  tabycsx: true,
                });
                setYCSXListRender(renderYCSX(ycsxdatatablefilter));
              } else {
                Swal.fire("Thông báo", "Chọn ít nhất 1 YCSX để in", "error");
              }
            }}
            title="In phiếu YCSX đã chọn"
          >
            <AiOutlinePrinter size={13} />
            <span>Print YCSX</span>
          </button>

          {/* Nút 7: Print Bản Vẽ */}
          <button
            type="button"
            className="stb-ghost-amber"
            onClick={() => {
              if (ycsxdatatablefilter.length > 0) {
                setSelection({
                  ...selection,
                  tabbanve: true,
                });
                setYCSXListRender(renderBanVe(ycsxdatatablefilter));
              } else {
                Swal.fire("Thông báo", "Chọn ít nhất 1 YCSX để in", "error");
              }
            }}
            title="In bản vẽ kỹ thuật"
          >
            <AiOutlinePrinter size={13} />
            <span>Print Bản Vẽ</span>
          </button>

          {/* Nút 8: Add to PLAN */}
          <button
            type="button"
            className="stb-primary"
            onClick={() => {
              if (ycsxdatatablefilter.length > 0) {
                handle_AddPlan();
              } else {
                Swal.fire("Thông báo", "Chọn ít nhất 1 YCSX để thêm PLAN", "error");
              }
            }}
            title="Thêm YCSX đã chọn vào Plan nháp"
          >
            <AiFillFolderAdd size={14} />
            <span>Add to PLAN</span>
          </button>
        </div>
      </GridToolbarContainer>
    );
  };

  return (
    <div className="quickplan-ycsx-pane">
      {/* Search Form Filter 3 Cột Compact */}
      <div className="ycsx-filter-form">
        {/* Hàng 1 */}
        <div className="filter-field">
          <label>Từ ngày:</label>
          <input
            type="date"
            value={fromdate.slice(0, 10)}
            onChange={(e) => setFromDate(e.target.value)}
            onKeyDown={handleSearchCodeKeyDown}
          />
        </div>
        <div className="filter-field">
          <label>Tới ngày:</label>
          <input
            type="date"
            value={todate.slice(0, 10)}
            onChange={(e) => setToDate(e.target.value)}
            onKeyDown={handleSearchCodeKeyDown}
          />
        </div>
        <div className="filter-field">
          <label>Code KD:</label>
          <input
            type="text"
            placeholder="GH63-xxxxxx"
            value={codeKD}
            onChange={(e) => setCodeKD(e.target.value)}
            onKeyDown={handleSearchCodeKeyDown}
          />
        </div>

        {/* Hàng 2 */}
        <div className="filter-field">
          <label>Code ERP:</label>
          <input
            type="text"
            placeholder="7C123xxx"
            value={codeCMS}
            onChange={(e) => setCodeCMS(e.target.value)}
            onKeyDown={handleSearchCodeKeyDown}
          />
        </div>
        <div className="filter-field">
          <label>Nhân viên:</label>
          <input
            type="text"
            placeholder="Tên PIC KD..."
            value={empl_name}
            onChange={(e) => setEmpl_Name(e.target.value)}
            onKeyDown={handleSearchCodeKeyDown}
          />
        </div>
        <div className="filter-field">
          <label>Khách hàng:</label>
          <input
            type="text"
            placeholder="SEVT, SDV..."
            value={cust_name}
            onChange={(e) => setCust_Name(e.target.value)}
            onKeyDown={handleSearchCodeKeyDown}
          />
        </div>

        {/* Hàng 3 */}
        <div className="filter-field">
          <label>Loại SP:</label>
          <input
            type="text"
            placeholder="TSP, LABEL..."
            value={prod_type}
            onChange={(e) => setProdType(e.target.value)}
            onKeyDown={handleSearchCodeKeyDown}
          />
        </div>
        <div className="filter-field">
          <label>Số YCSX:</label>
          <input
            type="text"
            placeholder="Số YCSX..."
            value={prodrequestno}
            onChange={(e) => setProdRequestNo(e.target.value)}
            onKeyDown={handleSearchCodeKeyDown}
          />
        </div>
        <div className="filter-field">
          <label>Vật liệu:</label>
          <input
            type="text"
            placeholder="SJ-203020HC..."
            value={material}
            onChange={(e) => setMaterial(e.target.value)}
            onKeyDown={handleSearchCodeKeyDown}
          />
        </div>

        {/* Hàng actions & checkboxes */}
        <div className="filter-actions-row">
          <div className="chk-group">
            <label>
              <input
                type="checkbox"
                checked={ycsxpendingcheck}
                onChange={(e) => setYCSXPendingCheck(e.target.checked)}
              />
              Pending
            </label>
            <label>
              <input
                type="checkbox"
                checked={inspectInputcheck}
                onChange={(e) => setInspectInputCheck(e.target.checked)}
              />
              Vào kiểm
            </label>
            <label>
              <input
                type="checkbox"
                checked={materialYES}
                onChange={(e) => setMaterialYES(e.target.checked)}
              />
              Mat YES
            </label>
            <label>
              <input
                type="checkbox"
                checked={alltime}
                onChange={(e) => setAllTime(e.target.checked)}
              />
              All Time
            </label>
            <select
              value={phanloai}
              onChange={(e) => setPhanLoai(e.target.value)}
              style={{ height: 21, fontSize: 10 }}
            >
              <option value="00">Tất cả</option>
              <option value="01">Thông thường</option>
              <option value="02">SX gấp</option>
            </select>
          </div>

          <button
            type="button"
            className="btn-search-ycsx"
            onClick={handletraYCSX}
            disabled={isLoading}
          >
            <AiOutlineSearch size={14} />
            <span>{isLoading ? "Đang tải..." : "Tìm YCSX"}</span>
          </button>
        </div>
      </div>

      {/* Bảng Dữ Liệu YCSX DataGrid */}
      <div className="ycsx-grid-container">
        <DataGrid
          sx={{
            fontSize: 11,
            height: "100%",
            width: "100%",
          }}
          slots={{
            toolbar: CustomToolbarPOTable,
          }}
          loading={isLoading}
          rowHeight={28}
          rows={ycsxdatatable}
          columns={columns as any}
          pageSizeOptions={[10, 50, 100, 500, 1000]}
          editMode="row"
          getRowId={(row) => row.PROD_REQUEST_NO}
          onRowSelectionModelChange={(ids: any) => {
            handleYCSXSelectionforUpdate(ids);
          }}
        />
      </div>
    </div>
  );
};

export default React.memo(PrecisionQuickPlanYCSXSection);
