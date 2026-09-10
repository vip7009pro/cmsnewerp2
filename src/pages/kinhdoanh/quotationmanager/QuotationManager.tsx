import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import moment from "moment";
import Swal from "sweetalert2";
import { useSelector } from "react-redux";
import * as XLSX from "xlsx";
import { useReactToPrint } from "react-to-print";

import { RootState } from "../../../redux/store";
import { generalQuery, getAuditMode, getCompany, getSever } from "../../../api/Api";
import { SaveExcel } from "../../../api/services/excelService";
import { checkBP } from "../../../api/services/permissionService";
import { UserData } from "../../../api/GlobalInterface";
import AGTable from "../../../components/DataTable/AGTable";
import {
  BANGGIA_DATA,
  BANGGIA_DATA2,
  CodeListDataUpGia,
  CustomerListData,
} from "../interfaces/kdInterface";
import { f_getcustomerlist } from "../utils/kdUtils";

import PrecisionPriceFilter, { PriceFilterState } from "./PrecisionQuotation/PrecisionPriceFilter";
import PrecisionPriceToolbar from "./PrecisionQuotation/PrecisionPriceToolbar";
import {
  getColumnGiaDoc,
  getColumnGiaNgang,
  getColumnsUploadExcel,
  fields_banggia2,
  createPivotDataSource,
} from "./PrecisionQuotation/PrecisionPriceColumns";
import PrecisionPriceModals from "./PrecisionQuotation/PrecisionPriceModals";

const initialFilterState: PriceFilterState = {
  fromdate: moment().format("YYYY-MM-DD"),
  todate: moment().format("YYYY-MM-DD"),
  codeKD: "",
  codeCMS: "",
  m_name: "",
  cust_name: "",
  alltime: true,
};

const QuotationManager: React.FC = () => {
  const userData: UserData | undefined = useSelector(
    (state: RootState) => state.totalSlice.userData
  );

  /* ── State Filters & Layout ── */
  const [filters, setFilters] = useState<PriceFilterState>(initialFilterState);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  /* ── Data States ── */
  const [banggia, setBangGia] = useState<BANGGIA_DATA[]>([]);
  const [banggia2, setBangGia2] = useState<BANGGIA_DATA2[]>([]);
  const [rows, setRows] = useState<any[]>([]);
  const [columns, setColumns] = useState<any[]>(getColumnGiaDoc());
  const selectedBangGiaDocRow = useRef<BANGGIA_DATA2[]>([]);

  /* ── Up Price & Customers ── */
  const [customerList, setCustomerList] = useState<CustomerListData[]>([]);
  const [codelist, setCodeList] = useState<CodeListDataUpGia[]>([]);
  const [selectedCust_CD, setSelectedCust_CD] = useState<CustomerListData | null>(null);
  const [selectedCode, setSelectedCode] = useState<CodeListDataUpGia | null>(null);
  const [moq, setMOQ] = useState(1);
  const [newprice, setNewPrice] = useState("");
  const [newbep, setNewBep] = useState("");
  const [newpricedate, setNewPriceDate] = useState(moment.utc().format("YYYY-MM-DD"));
  const [uploadExcelJson, setUploadExcelJson] = useState<any[]>([]);

  /* ── Modals ── */
  const [showPivot, setShowPivot] = useState(false);
  const [showUpPrice, setShowUpPrice] = useState(false);
  const [showPrint, setShowPrint] = useState(false);
  const [selectedDataSource, setSelectedDataSource] = useState<any>(createPivotDataSource([]));

  const quotationprintref = useRef<HTMLDivElement>(null);
  const handlePrint = useReactToPrint({ content: () => quotationprintref.current });

  /* ── Filter handler ── */
  const handleFilterChange = useCallback((key: keyof PriceFilterState, value: any) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  }, []);

  /* ── Customer & Code list ── */
  const fetchCustomerList = useCallback(async () => {
    const list = await f_getcustomerlist();
    setCustomerList(list);
    if (list?.length > 0 && !selectedCust_CD) setSelectedCust_CD(list[0]);
  }, [selectedCust_CD]);

  const loadCodeList = useCallback(async () => {
    try {
      const response = await generalQuery("loadM100UpGia", {});
      if (response.data.tk_status !== "NG") {
        const loaded: CodeListDataUpGia[] = response.data.data.map((el: any, idx: number) => ({
          ...el,
          id: idx,
        }));
        setCodeList(loaded);
        if (loaded?.length > 0 && !selectedCode) setSelectedCode(loaded[0]);
      }
    } catch (err) {
      console.error(err);
    }
  }, [selectedCode]);

  /* ── Queries: Giá Ngang, Giá Dọc, Last Price ── */
  const loadBangGia = useCallback(async () => {
    try {
      const response = await generalQuery("loadbanggia", {
        ALLTIME: filters.alltime,
        FROM_DATE: filters.fromdate,
        TO_DATE: filters.todate,
        M_NAME: filters.m_name,
        G_CODE: filters.codeCMS,
        G_NAME: filters.codeKD,
        CUST_NAME_KD: filters.cust_name,
      });
      if (response.data.tk_status !== "NG") {
        const loaded: BANGGIA_DATA[] = response.data.data.map((el: BANGGIA_DATA, idx: number) => ({
          ...el,
          G_NAME: getAuditMode() === 0 ? el?.G_NAME : el?.G_NAME?.search("CNDB") === -1 ? el?.G_NAME : "TEM_NOI_BO",
          G_NAME_KD: getAuditMode() === 0 ? el?.G_NAME_KD : el?.G_NAME_KD?.search("CNDB") === -1 ? el?.G_NAME_KD : "TEM_NOI_BO",
          id: idx,
        }));
        setBangGia(loaded);
        setRows(loaded);
        setColumns(getColumnGiaNgang());
        setSelectedDataSource(createPivotDataSource(loaded));
      } else {
        Swal.fire("Thông báo", "Lỗi: " + response.data.message, "error");
      }
    } catch (err) {
      Swal.fire("Thông báo", "Lỗi: " + err, "error");
    }
    selectedBangGiaDocRow.current = [];
  }, [filters]);

  const loadBangGia2 = useCallback(async () => {
    try {
      const response = await generalQuery("loadbanggia2", {
        ALLTIME: filters.alltime,
        FROM_DATE: filters.fromdate,
        TO_DATE: filters.todate,
        M_NAME: filters.m_name,
        G_CODE: filters.codeCMS,
        G_NAME: filters.codeKD,
        CUST_NAME_KD: filters.cust_name,
      });
      if (response.data.tk_status !== "NG") {
        const loaded: BANGGIA_DATA2[] = response.data.data.map((el: BANGGIA_DATA2, idx: number) => ({
          ...el,
          G_NAME: getAuditMode() === 0 ? el?.G_NAME : el?.G_NAME?.search("CNDB") === -1 ? el?.G_NAME : "TEM_NOI_BO",
          G_NAME_KD: getAuditMode() === 0 ? el?.G_NAME_KD : el?.G_NAME_KD?.search("CNDB") === -1 ? el?.G_NAME_KD : "TEM_NOI_BO",
          PRICE_DATE: el.PRICE_DATE ? moment.utc(el.PRICE_DATE).format("YYYY-MM-DD") : "",
          INS_DATE: moment.utc(el.INS_DATE).format("YYYY-MM-DD HH:mm:ss"),
          UPD_DATE: moment.utc(el.UPD_DATE).format("YYYY-MM-DD HH:mm:ss"),
          id: idx,
        }));
        setBangGia2(loaded);
        setRows(loaded);
        setColumns(getColumnGiaDoc());
        setSelectedDataSource(createPivotDataSource(loaded, fields_banggia2));
      } else {
        Swal.fire("Thông báo", "Lỗi: " + response.data.message, "error");
      }
    } catch (err) {
      Swal.fire("Thông báo", "Lỗi: " + err, "error");
    }
  }, [filters]);

  const loadBangGiaMoiNhat = useCallback(async () => {
    try {
      const response = await generalQuery("loadbanggiamoinhat", {
        ALLTIME: filters.alltime,
        FROM_DATE: filters.fromdate,
        TO_DATE: filters.todate,
        M_NAME: filters.m_name,
        G_CODE: filters.codeCMS,
        G_NAME: filters.codeKD,
        CUST_NAME_KD: filters.cust_name,
      });
      if (response.data.tk_status !== "NG") {
        const loaded: BANGGIA_DATA2[] = response.data.data.map((el: BANGGIA_DATA2, idx: number) => ({
          ...el,
          G_NAME: getAuditMode() === 0 ? el?.G_NAME : el?.G_NAME?.search("CNDB") === -1 ? el?.G_NAME : "TEM_NOI_BO",
          G_NAME_KD: getAuditMode() === 0 ? el?.G_NAME_KD : el?.G_NAME_KD?.search("CNDB") === -1 ? el?.G_NAME_KD : "TEM_NOI_BO",
          PRICE_DATE: el.PRICE_DATE ? moment.utc(el.PRICE_DATE).format("YYYY-MM-DD") : "",
          INS_DATE: moment.utc(el.INS_DATE).format("YYYY-MM-DD HH:mm:ss"),
          UPD_DATE: moment.utc(el.UPD_DATE).format("YYYY-MM-DD HH:mm:ss"),
          id: idx,
        }));
        setBangGia2(loaded);
        setRows(loaded);
        setColumns(getColumnGiaDoc());
        setSelectedDataSource(createPivotDataSource(loaded, fields_banggia2));
      } else {
        Swal.fire("Thông báo", "Lỗi: " + response.data.message, "error");
      }
    } catch (err) {
      Swal.fire("Thông báo", "Lỗi: " + err, "error");
    }
  }, [filters]);

  /* ── Actions: Phê duyệt, Cập nhật, Xóa ── */
  const pheduyetgia = useCallback(async () => {
    if (!selectedBangGiaDocRow.current.length) {
      Swal.fire("Thông báo", "Chọn ít nhất 1 dòng để phê duyệt", "error");
      return;
    }
    let err_code = "";
    for (const row of selectedBangGiaDocRow.current) {
      try {
        const res = await generalQuery("pheduyetgia", { ...row, FINAL: row.FINAL === "Y" ? "N" : "Y" });
        if (res.data.tk_status === "NG") err_code += `Lỗi: ${res.data.message} | `;
      } catch (err) {
        err_code += `Lỗi: ${err} | `;
      }
    }
    if (!err_code) {
      Swal.fire("Thông báo", "Phê duyệt giá thành công", "success");
      checkBP(userData, ["KD"], ["ALL"], ["ALL"], loadBangGia2);
    } else {
      Swal.fire("Thông báo", err_code, "error");
    }
  }, [userData, loadBangGia2]);

  const updategia = useCallback(async () => {
    if (!selectedBangGiaDocRow.current.length) {
      Swal.fire("Thông báo", "Chọn ít nhất 1 dòng để update (Bảng giá dọc)", "error");
      return;
    }
    let err_code = "";
    for (const row of selectedBangGiaDocRow.current) {
      try {
        const res = await generalQuery("updategia", { ...row });
        if (res.data.tk_status === "NG") err_code += `Lỗi: ${res.data.message} | `;
      } catch (err) {
        err_code += `Lỗi: ${err} | `;
      }
    }
    if (!err_code) {
      Swal.fire("Thông báo", "Cập nhật thông tin giá thành công", "success");
      checkBP(userData, ["KD"], ["ALL"], ["ALL"], loadBangGia2);
    } else {
      Swal.fire("Thông báo", err_code, "error");
    }
  }, [userData, loadBangGia2]);

  const deletegia = useCallback(async () => {
    if (!selectedBangGiaDocRow.current.length) {
      Swal.fire("Thông báo", "Chọn ít nhất 1 dòng để xóa (Bảng giá dọc)", "error");
      return;
    }
    let err_code = "";
    for (const row of selectedBangGiaDocRow.current) {
      try {
        const res = await generalQuery("deletegia", { ...row });
        if (res.data.tk_status === "NG") err_code += `Lỗi: ${res.data.message} | `;
      } catch (err) {
        err_code += `Lỗi: ${err} | `;
      }
    }
    if (!err_code) {
      Swal.fire("Thông báo", "Xóa thành công", "success");
      checkBP(userData, ["KD"], ["ALL"], ["ALL"], loadBangGia2);
    } else {
      Swal.fire("Thông báo", err_code, "error");
    }
  }, [userData, loadBangGia2]);

  /* ── Upload Excel ── */
  const readUploadFile = useCallback((e: any) => {
    e.preventDefault();
    if (!e.target.files) return;
    const reader = new FileReader();
    reader.onload = (evt: any) => {
      const workbook = XLSX.read(evt.target.result, { type: "array" });
      const json: any[] = XLSX.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]]);
      setUploadExcelJson(
        json.map((element: any, index: number) => {
          const temp_fil = codelist.find((c) => c.G_CODE === element.G_CODE);
          const temp_cust = customerList.find((cu) => cu.CUST_CD === element.CUST_CD);
          return {
            ...element,
            id: index,
            CUST_NAME_KD: temp_cust ? temp_cust.CUST_NAME_KD : "NA",
            G_NAME: temp_fil ? temp_fil.G_NAME : "NA",
            G_NAME_KD: temp_fil ? temp_fil.G_NAME_KD : "NA",
            PROD_MAIN_MATERIAL: temp_fil ? temp_fil.PROD_MAIN_MATERIAL : "NA",
            CHECKSTATUS: temp_fil && temp_cust ? "READY" : "NG",
            PRICE_DATE: element.PRICE_DATE || moment.utc().format("YYYY-MM-DD"),
          };
        })
      );
    };
    reader.readAsArrayBuffer(e.target.files[0]);
  }, [codelist, customerList]);

  const uploadgia = useCallback(async () => {
    if (!uploadExcelJson.length) {
      Swal.fire("Thông báo", "Thêm dòng hoặc import file Excel để up giá", "error");
      return;
    }
    let err_code = "";
    for (const item of uploadExcelJson) {
      try {
        const res = await generalQuery("upgiasp", item);
        if (res.data.tk_status === "NG") err_code += `Lỗi: ${res.data.message} | `;
      } catch (err) {
        err_code += `Lỗi: ${err} | `;
      }
    }
    if (!err_code) {
      Swal.fire("Thông báo", "Up giá thành công", "success");
      setShowUpPrice(false);
      loadBangGia2();
    } else {
      Swal.fire("Thông báo", err_code, "error");
    }
  }, [uploadExcelJson, loadBangGia2]);

  const handleAddSinglePrice = useCallback(() => {
    const temp_row: BANGGIA_DATA2 = {
      PROD_ID: uploadExcelJson.length + 1,
      id: uploadExcelJson.length + 1,
      CUST_CD: selectedCust_CD?.CUST_CD,
      CUST_NAME_KD: selectedCust_CD?.CUST_NAME_KD,
      FINAL: "",
      G_CODE: selectedCode?.G_CODE,
      G_NAME: selectedCode?.G_NAME,
      G_NAME_KD: selectedCode?.G_NAME_KD,
      INS_EMPL: "",
      INS_DATE: "",
      MOQ: moq,
      PRICE_DATE: newpricedate,
      BEP: Number(newbep),
      PROD_PRICE: Number(newprice),
      PROD_MAIN_MATERIAL: selectedCode?.PROD_MAIN_MATERIAL,
      REMARK: "",
      UPD_EMPL: "",
      UPD_DATE: "",
      G_WIDTH: 0,
      G_LENGTH: 0,
      G_NAME_KT: "",
      EQ1: "",
      EQ2: "",
      EQ3: "",
      EQ4: "",
      DUPLICATE: 1,
    };
    setUploadExcelJson((prev) => [...prev, temp_row]);
  }, [uploadExcelJson, selectedCust_CD, selectedCode, moq, newprice, newbep, newpricedate]);

  /* ── Init ── */
  useEffect(() => {
    fetchCustomerList();
    loadCodeList();
    if (getCompany() === "CMS" && getSever() !== "http://222.252.1.63:3007") {
      generalQuery("dongbogiasptupo", {}).catch(console.error);
    }
  }, [fetchCustomerList, loadCodeList]);

  /* ── Upload preview table memo ── */
  const uploadTableColumns = useMemo(
    () =>
      getColumnsUploadExcel((prodId) => {
        setUploadExcelJson((prev) => prev.filter((item) => item.PROD_ID !== prodId));
      }),
    []
  );

  return (
    <div className="precision-quotation__workspace">
      {/* ── Left Filter Panel ── */}
      <PrecisionPriceFilter
        filters={filters}
        onFilterChange={handleFilterChange}
        onLastPrice={() => checkBP(userData, ["KD"], ["ALL"], ["ALL"], loadBangGiaMoiNhat)}
        onApprove={() => checkBP(userData, ["KD"], ["Leader"], ["ALL"], pheduyetgia)}
        onGiaNgang={() => checkBP(userData, ["KD"], ["ALL"], ["ALL"], loadBangGia)}
        onUpdate={() =>
          Swal.fire({
            title: "Chắc chắn muốn update giá hàng loạt?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Vẫn update!",
          }).then((res) => res.isConfirmed && checkBP(userData, ["KD"], ["ALL"], ["ALL"], updategia))
        }
        onGiaDoc={() => checkBP(userData, ["KD"], ["ALL"], ["ALL"], loadBangGia2)}
        onDelete={() =>
          Swal.fire({
            title: "Chắc chắn muốn xóa giá hàng loạt?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Vẫn xóa!",
          }).then((res) => res.isConfirmed && checkBP(userData, ["KD"], ["ALL"], ["ALL"], deletegia))
        }
        isCollapsed={sidebarCollapsed}
      />

      {/* ── Right Content & AGTable Surface ── */}
      <div className="precision-quotation__content">
        <PrecisionPriceToolbar
          onToggleSidebar={() => setSidebarCollapsed(!sidebarCollapsed)}
          onSaveExcel={() => SaveExcel(rows, "PriceTable")}
          onTogglePivot={() => setShowPivot(!showPivot)}
          onOpenUpGia={() => {
            checkBP(userData, ["KD"], ["ALL"], ["ALL"], loadBangGia2);
            loadCodeList();
            fetchCustomerList();
            setShowUpPrice(true);
          }}
          onOpenPrint={() => setShowPrint(true)}
          onExportEX1={() => SaveExcel(selectedBangGiaDocRow.current.length ? selectedBangGiaDocRow.current : rows, "EX1_PriceData")}
          onExportEX2={() => SaveExcel(rows, "EX2_PriceData_Full")}
        />

        <div className="precision-quotation__grid-body">
          <AGTable
            showFilter={true}
            toolbar={<div />}
            columns={columns}
            data={rows}
            onSelectionChange={(params: any) => {
              selectedBangGiaDocRow.current = params.api.getSelectedRows();
            }}
          />
        </div>
      </div>

      {/* ── Modals (Up Giá, Pivot Grid, Print) ── */}
      <PrecisionPriceModals
        showPivot={showPivot}
        onClosePivot={() => setShowPivot(false)}
        selectedDataSource={selectedDataSource}
        showUpPrice={showUpPrice}
        onCloseUpPrice={() => setShowUpPrice(false)}
        customerList={customerList}
        codelist={codelist}
        selectedCust_CD={selectedCust_CD}
        setSelectedCust_CD={setSelectedCust_CD}
        selectedCode={selectedCode}
        setSelectedCode={setSelectedCode}
        moq={moq}
        setMOQ={setMOQ}
        newprice={newprice}
        setNewPrice={setNewPrice}
        newbep={newbep}
        setNewBep={setNewBep}
        newpricedate={newpricedate}
        setNewPriceDate={setNewPriceDate}
        onAddSinglePrice={handleAddSinglePrice}
        onReadFileExcel={readUploadFile}
        onUploadDatabase={() => checkBP(userData, ["KD"], ["ALL"], ["ALL"], uploadgia)}
        uploadTableElement={
          <AGTable
            showFilter={true}
            toolbar={<div />}
            columns={uploadTableColumns}
            data={uploadExcelJson}
            onSelectionChange={() => {}}
          />
        }
        showPrint={showPrint}
        onClosePrint={() => setShowPrint(false)}
        printData={selectedBangGiaDocRow.current}
        printRef={quotationprintref}
        onTriggerPrint={handlePrint}
      />
    </div>
  );
};

export default QuotationManager;