import React, { useEffect, useRef, useState, useMemo, useCallback } from "react";
import { Autocomplete, TextField, createFilterOptions, Typography } from "@mui/material";
import moment from "moment";
import Swal from "sweetalert2";
import { FiPlus, FiCheckCircle } from "react-icons/fi";
import { MdInput, MdDelete } from "react-icons/md";
import { generalQuery, getCompany, getUserData } from "../../../../api/Api";
import { checkBP } from "../../../../api/services/permissionService";
import {
  f_getI221NextIN_NO,
  f_getI222Next_M_LOT_NO,
  f_Insert_I221,
  f_Insert_I222,
  f_updateStockM090,
} from "../../../../api/services/inventoryService";
import { zeroPad } from "../../../../api/services/utilService";
import AGTable from "../../../../components/DataTable/AGTable";
import { WH_M_INPUT_DATA } from "../../interfaces/khoInterface";
import { MaterialListData } from "../../../qc/interfaces/qcInterface";
import { CustomerListData } from "../../../kinhdoanh/interfaces/kdInterface";
import "./NHAPLIEU.scss";

const NHAPLIEU: React.FC = () => {
  // Table Data State
  const [material_table_data, set_material_table_data] = useState<Array<WH_M_INPUT_DATA>>([]);
  const selectedData = useRef<Array<WH_M_INPUT_DATA>>([]);

  // Form Field States
  const [invoice_no, setInvoiceNo] = useState("");
  const [loaink, setloaiNK] = useState("03");
  const [selectedFactory, setSelectedFactory] = useState("NM1");
  const [fromdate, setFromDate] = useState(moment().format("YYYY-MM-DD"));
  const [todate, setToDate] = useState(moment().add(1, "year").format("YYYY-MM-DD"));

  // Quick Spec Inputs
  const [lot_qty, setLotQty] = useState<number | string>(1);
  const [roll_per_lot, setRollPerLot] = useState<number | string>(1);
  const [met_per_roll, setMetPerRoll] = useState<number | string>(100);
  const [prod_request_no, setProdRequestNo] = useState("");
  const [remark, setRemark] = useState("");

  // Autocomplete Options
  const [materialList, setMaterialList] = useState<MaterialListData[]>([
    {
      M_CODE: "A0000001",
      M_NAME: "#200",
      WIDTH_CD: 1200,
    },
  ]);
  const [selectedMaterial, setSelectedMaterial] = useState<MaterialListData | null>({
    M_CODE: "A0000001",
    M_NAME: "#200",
    WIDTH_CD: 1200,
  });

  const [customerList, setCustomerList] = useState<CustomerListData[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<CustomerListData | null>({
    CUST_CD: getCompany() === "CMS" ? "0049" : "KH000",
    CUST_NAME: getCompany() === "CMS" ? "SSJ CO., LTD" : "PVN",
    CUST_NAME_KD: getCompany() === "CMS" ? "SSJ" : "PVN",
  });

  const filterOptions = useMemo(
    () =>
      createFilterOptions({
        matchFrom: "any",
        limit: 100,
      }),
    []
  );

  // Load Danh Mục Vendor
  const getcustomerlist = useCallback(() => {
    generalQuery("selectVendorList", {})
      .then((response) => {
        if (response.data.tk_status !== "NG") {
          setCustomerList(response.data.data);
        }
      })
      .catch((error) => console.log(error));
  }, []);

  // Load Danh Mục Vật Liệu
  const getmateriallist = useCallback(() => {
    generalQuery("getMaterialList", {})
      .then((response) => {
        if (response.data.tk_status !== "NG") {
          setMaterialList(response.data.data);
        }
      })
      .catch((error) => console.log(error));
  }, []);

  useEffect(() => {
    getcustomerlist();
    getmateriallist();
  }, [getcustomerlist, getmateriallist]);

  // Thêm dòng vật liệu vào bảng tạm
  const addMaterial = useCallback(() => {
    if (!selectedCustomer?.CUST_CD || !selectedMaterial?.M_CODE || !invoice_no.trim() || !todate) {
      Swal.fire("Thông báo", "Vui lòng điền đủ: Vendor, Vật liệu, Invoice No và Hạn sử dụng", "warning");
      return;
    }

    const numLotQty = Number(lot_qty) || 1;
    const numRollPerLot = Number(roll_per_lot) || 1;
    const numMetPerRoll = Number(met_per_roll) || 0;

    const temp_m_invoice: WH_M_INPUT_DATA = {
      id: moment().format("YYYYMMDD_HHmmssSSS") + "_" + material_table_data.length,
      CUST_CD: selectedCustomer.CUST_CD,
      CUST_NAME_KD: selectedCustomer.CUST_NAME_KD ?? "",
      M_NAME: selectedMaterial.M_NAME ?? "",
      M_CODE: selectedMaterial.M_CODE ?? "",
      WIDTH_CD: selectedMaterial.WIDTH_CD ?? 0,
      INVOICE_NO: invoice_no.trim(),
      EXP_DATE: todate,
      PROD_REQUEST_NO: prod_request_no.trim(),
      REMARK: remark.trim(),
      MET_PER_ROLL: numMetPerRoll,
      LOT_QTY: numLotQty,
      ROLL_PER_LOT: numRollPerLot,
    };

    set_material_table_data((prev) => [...prev, temp_m_invoice]);
  }, [
    selectedCustomer,
    selectedMaterial,
    invoice_no,
    todate,
    lot_qty,
    roll_per_lot,
    met_per_roll,
    prod_request_no,
    remark,
    material_table_data.length,
  ]);

  // Nghiệp vụ Nhập Kho Vật Liệu
  const nhapkho = useCallback(async () => {
    if (material_table_data.length === 0) {
      Swal.fire("Thông báo", "Không có dữ liệu để nhập kho", "error");
      return;
    }

    let checkmet: boolean = true;
    for (let i = 0; i < material_table_data.length; i++) {
      const ttmet =
        Number(material_table_data[i].LOT_QTY) *
        Number(material_table_data[i].ROLL_PER_LOT) *
        Number(material_table_data[i].MET_PER_ROLL);
      if (ttmet === 0) checkmet = false;
    }

    if (!checkmet) {
      Swal.fire("Thông báo", "Lỗi: Có dòng có tổng mét = 0, vui lòng kiểm tra lại", "error");
      return;
    }

    Swal.fire({
      title: "Đang nhập kho...",
      allowOutsideClick: false,
      didOpen: () => Swal.showLoading(),
    });

    try {
      const next_in_no: string = await f_getI221NextIN_NO();
      let err_code: string = "";

      for (let i = 0; i < material_table_data.length; i++) {
        const next_in_seq: string = zeroPad(i + 1, 3);
        const kq: string = await f_Insert_I221({
          IN_NO: next_in_no,
          IN_SEQ: next_in_seq,
          M_CODE: material_table_data[i].M_CODE,
          IN_CFM_QTY:
            Number(material_table_data[i].LOT_QTY) *
            Number(material_table_data[i].ROLL_PER_LOT) *
            Number(material_table_data[i].MET_PER_ROLL),
          REMARK: material_table_data[i].REMARK,
          FACTORY: selectedFactory,
          CODE_50: loaink,
          INVOICE_NO: invoice_no.trim(),
          CUST_CD: selectedCustomer?.CUST_CD,
          ROLL_QTY: Number(material_table_data[i].LOT_QTY) * Number(material_table_data[i].ROLL_PER_LOT),
          EXP_DATE: material_table_data[i].EXP_DATE,
        });

        if (kq !== "") {
          err_code += `Lỗi: ${kq} | `;
        } else {
          for (let j = 0; j < Number(material_table_data[i].LOT_QTY); j++) {
            const next_m_lot_no: string = await f_getI222Next_M_LOT_NO();
            const subKq: string = await f_Insert_I222({
              IN_NO: next_in_no,
              IN_SEQ: next_in_seq,
              M_LOT_NO: next_m_lot_no,
              LOC_CD: selectedFactory === "NM1" ? "BE010" : "HD001",
              WAHS_CD: selectedFactory === "NM1" ? "B" : "H",
              M_CODE: material_table_data[i].M_CODE,
              IN_CFM_QTY:
                Number(material_table_data[i].ROLL_PER_LOT) * Number(material_table_data[i].MET_PER_ROLL),
              FACTORY: selectedFactory,
              CUST_CD: selectedCustomer?.CUST_CD,
              ROLL_QTY: Number(material_table_data[i].ROLL_PER_LOT),
              PROD_REQUEST_NO: material_table_data[i].PROD_REQUEST_NO,
            });
            if (subKq !== "") {
              err_code += `Lỗi: ${subKq} | `;
            }
          }
        }
      }

      if (err_code !== "") {
        set_material_table_data([]);
        Swal.fire("Thông báo", "Nhập kho vật liệu thất bại: " + err_code, "error");
      } else {
        set_material_table_data([]);
        Swal.fire("Thông báo", "Nhập kho vật liệu thành công!", "success");
      }
      f_updateStockM090();
    } catch (err: any) {
      Swal.fire("Thông báo", "Lỗi trong quá trình nhập kho: " + err.message, "error");
    }
  }, [material_table_data, selectedFactory, loaink, invoice_no, selectedCustomer]);

  // Xác nhận nhập kho
  const handleConfirmNhapKho = useCallback(() => {
    Swal.fire({
      title: "Nhập liệu vào kho",
      text: `Xác nhận nhập kho ${material_table_data.length} dòng vật liệu?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#2563eb",
      cancelButtonColor: "#64748b",
      confirmButtonText: "Xác Nhận Nhập Kho",
      cancelButtonText: "Hủy",
    }).then((result) => {
      if (result.isConfirmed) {
        checkBP(getUserData(), ["KHO"], ["ALL"], ["ALL"], async () => {
          nhapkho();
        });
      }
    });
  }, [material_table_data.length, nhapkho]);

  // Xóa các dòng đã chọn trong bảng
  const handleDeleteSelected = useCallback(() => {
    if (selectedData.current.length === 0) {
      Swal.fire("Thông báo", "Vui lòng chọn ít nhất một dòng để xóa", "info");
      return;
    }
    set_material_table_data((prev) =>
      prev.filter((item) => !selectedData.current.some((sel) => sel.id === item.id))
    );
    selectedData.current = [];
  }, []);

  // Cấu hình cột bảng
  const columns_inputMaterial = useMemo(
    () => [
      { field: "CUST_NAME_KD", headerName: "VENDOR", width: 100, headerCheckboxSelection: true, checkboxSelection: true },
      { field: "M_CODE", headerName: "M_CODE", width: 100 },
      { field: "M_NAME", headerName: "M_NAME", width: 140 },
      { field: "WIDTH_CD", headerName: "WIDTH_CD", width: 90 },
      { field: "LOT_QTY", headerName: "LOT_QTY", width: 90, editable: true },
      { field: "ROLL_PER_LOT", headerName: "ROLL_PER_LOT", width: 110, editable: true },
      { field: "MET_PER_ROLL", headerName: "MET_PER_ROLL", width: 110, editable: true },
      { field: "INVOICE_NO", headerName: "INVOICE_NO", width: 110, editable: true },
      { field: "REMARK", headerName: "REMARK", width: 120, editable: true },
      { field: "EXP_DATE", headerName: "EXP_DATE", width: 110, editable: true },
      { field: "PROD_REQUEST_NO", headerName: "PROD_REQUEST_NO", width: 130, editable: true },
    ],
    []
  );

  // Thống kê realtime
  const totalRolls = useMemo(
    () =>
      material_table_data.reduce(
        (sum, item) => sum + (Number(item.LOT_QTY) || 0) * (Number(item.ROLL_PER_LOT) || 0),
        0
      ),
    [material_table_data]
  );

  const totalMeters = useMemo(
    () =>
      material_table_data.reduce(
        (sum, item) =>
          sum +
          (Number(item.LOT_QTY) || 0) *
            (Number(item.ROLL_PER_LOT) || 0) *
            (Number(item.MET_PER_ROLL) || 0),
        0
      ),
    [material_table_data]
  );

  return (
    <div className="nhaplieu">
      {/* 1. TOP SUMMARY TELEMETRY BAR */}
      <div className="nhaplieu__telemetryBar">
        <div className="telemetry-left">
          <div className="badge-indicator">
            <FiCheckCircle />
            <span>KHO VẬT LIỆU • NHẬP KHO</span>
          </div>
          <span className="telemetry-hint">Điền thông tin lô liệu và nhấn Thêm để đưa vào danh sách chờ nhập kho</span>
        </div>

        <div className="telemetry-metrics">
          <div className="metric-pill">
            <span>Dòng:</span>
            <strong>{material_table_data.length}</strong>
          </div>
          <div className="metric-pill metric-pill--emerald">
            <span>Tổng Cuộn:</span>
            <strong>{totalRolls.toLocaleString("en-US")}</strong>
          </div>
          <div className="metric-pill metric-pill--blue">
            <span>Tổng Mét:</span>
            <strong>{totalMeters.toLocaleString("en-US")} m</strong>
          </div>
        </div>
      </div>

      {/* 2. INPUT CONTROL FORM CARD */}
      <div className="nhaplieu__formCard">
        <div className="form-grid">
          {/* Vendor */}
          <div className="form-field">
            <label>
              Vendor <span className="required">*</span>
            </label>
            <div className="stitch-autocomplete">
              <Autocomplete
                size="small"
                disablePortal
                options={customerList}
                filterOptions={filterOptions}
                isOptionEqualToValue={(option: any, value: any) => option.CUST_CD === value.CUST_CD}
                getOptionLabel={(option: any) =>
                  `${option.CUST_NAME_KD ? option.CUST_NAME_KD : ""}${option.CUST_CD ? ` (${option.CUST_CD})` : ""}`
                }
                renderInput={(params) => <TextField {...params} placeholder="Chọn Vendor" />}
                renderOption={(props, option: any) => (
                  <Typography style={{ fontSize: "11.5px", padding: "4px 8px" }} {...props}>
                    <strong>{option.CUST_NAME_KD}</strong> ({option.CUST_CD}) - {option.CUST_NAME}
                  </Typography>
                )}
                value={selectedCustomer}
                onChange={(_event: any, newValue: any) => setSelectedCustomer(newValue)}
              />
            </div>
          </div>

          {/* Chọn Vật Liệu */}
          <div className="form-field">
            <label>
              Vật liệu <span className="required">*</span>
            </label>
            <div className="stitch-autocomplete">
              <Autocomplete
                size="small"
                disablePortal
                options={materialList}
                filterOptions={filterOptions}
                isOptionEqualToValue={(option: any, value: any) => option.M_CODE === value.M_CODE}
                getOptionLabel={(option: MaterialListData | any) =>
                  `${option.M_NAME} | ${option.WIDTH_CD} | ${option.M_CODE}`
                }
                renderInput={(params) => <TextField {...params} placeholder="Chọn vật liệu" />}
                renderOption={(props, option: any) => (
                  <Typography style={{ fontSize: "11.5px", padding: "4px 8px" }} {...props}>
                    <strong>{option.M_NAME}</strong> | Khổ: {option.WIDTH_CD} | Mã: {option.M_CODE}
                  </Typography>
                )}
                value={selectedMaterial}
                onChange={(_event: any, newValue: any) => setSelectedMaterial(newValue)}
              />
            </div>
          </div>

          {/* Invoice No */}
          <div className="form-field">
            <label>
              Invoice No <span className="required">*</span>
            </label>
            <input
              type="text"
              placeholder="Nhập số Invoice..."
              value={invoice_no}
              onChange={(e) => setInvoiceNo(e.target.value)}
            />
          </div>

          {/* Factory */}
          <div className="form-field">
            <label>Factory</label>
            <select value={selectedFactory} onChange={(e) => setSelectedFactory(e.target.value)}>
              <option value="NM1">NM1 (Nhà máy 1)</option>
              <option value="NM2">NM2 (Nhà máy 2)</option>
            </select>
          </div>

          {/* Phân Loại Nhập Khẩu */}
          <div className="form-field">
            <label>Phân loại Nhập khẩu</label>
            <select value={loaink} onChange={(e) => setloaiNK(e.target.value)}>
              <option value="01">01 - GC (Gia công)</option>
              <option value="02">02 - SK (Sản xuất)</option>
              <option value="03">03 - KD (Kinh doanh)</option>
              <option value="04">04 - VN (Việt Nam)</option>
              <option value="05">05 - SAMPLE (Hàng mẫu)</option>
              <option value="06">06 - Vải bạc 4</option>
              <option value="07">07 - ETC (Khác)</option>
            </select>
          </div>

          {/* Ngày nhập kho */}
          <div className="form-field">
            <label>Ngày nhập kho</label>
            <input type="date" value={fromdate} onChange={(e) => setFromDate(e.target.value)} />
          </div>

          {/* Hạn sử dụng */}
          <div className="form-field">
            <label>
              Hạn Sử Dụng <span className="required">*</span>
            </label>
            <input type="date" value={todate} onChange={(e) => setToDate(e.target.value)} />
          </div>

          {/* Số Lot Qty */}
          <div className="form-field">
            <label>Số Lô (Lot QTY)</label>
            <input
              type="number"
              min={1}
              value={lot_qty}
              onChange={(e) => setLotQty(e.target.value)}
            />
          </div>

          {/* Cuộn / Lot */}
          <div className="form-field">
            <label>Cuộn / Lô (Roll/Lot)</label>
            <input
              type="number"
              min={1}
              value={roll_per_lot}
              onChange={(e) => setRollPerLot(e.target.value)}
            />
          </div>

          {/* Mét / Cuộn */}
          <div className="form-field">
            <label>Mét / Cuộn (Met/Roll)</label>
            <input
              type="number"
              min={0}
              value={met_per_roll}
              onChange={(e) => setMetPerRoll(e.target.value)}
            />
          </div>

          {/* Số YCSX */}
          <div className="form-field">
            <label>Số YCSX (Prod Request No)</label>
            <input
              type="text"
              placeholder="VD: YCSX-001..."
              value={prod_request_no}
              onChange={(e) => setProdRequestNo(e.target.value)}
            />
          </div>

          {/* Ghi chú */}
          <div className="form-field">
            <label>Ghi chú (Remark)</label>
            <input
              type="text"
              placeholder="Ghi chú thêm..."
              value={remark}
              onChange={(e) => setRemark(e.target.value)}
            />
          </div>
        </div>

        {/* Row nút hành động */}
        <div className="form-actions-row">
          <button type="button" className="btn-action-hero btn-action-hero--add" onClick={addMaterial}>
            <FiPlus size={15} />
            <span>Thêm Vào Danh Sách</span>
          </button>
          <button
            type="button"
            className="btn-action-hero btn-action-hero--submit"
            onClick={handleConfirmNhapKho}
            disabled={material_table_data.length === 0}
          >
            <MdInput size={16} />
            <span>Xác Nhận Nhập Kho ({material_table_data.length})</span>
          </button>
        </div>
      </div>

      {/* 3. TABLE WORKSPACE CONTAINER */}
      <div className="nhaplieu__tableWrapper">
        <div className="table-toolbar">
          <div className="table-title">
            <MdInput />
            <span>Danh Sách Vật Liệu Đang Chuẩn Bị Nhập Kho</span>
            <span className="row-counter">{material_table_data.length} dòng</span>
          </div>

          <div className="table-actions">
            <button
              type="button"
              className="btn-delete-selected"
              onClick={handleDeleteSelected}
              title="Xóa các dòng đã tích chọn trên bảng"
            >
              <MdDelete size={14} />
              <span>Xóa Dòng Chọn</span>
            </button>
          </div>
        </div>

        <div className="table-body">
          <AGTable
            columns={columns_inputMaterial}
            data={material_table_data}
            onSelectionChange={(params: any) => {
              selectedData.current = params?.api?.getSelectedRows() || [];
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default NHAPLIEU;
