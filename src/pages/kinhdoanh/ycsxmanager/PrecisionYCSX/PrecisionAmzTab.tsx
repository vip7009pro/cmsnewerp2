import React, { memo, useState, useEffect, useRef, useMemo } from "react";
import moment from "moment";
import Swal from "sweetalert2";
import * as XLSX from "xlsx";
import { createPortal } from "react-dom";
import {
  FiFilter,
  FiPrinter,
  FiDownload,
  FiPlusCircle,
  FiRefreshCw,
  FiLayers,
  FiCheckCircle,
  FiClock,
  FiSidebar,
  FiX,
} from "react-icons/fi";
import { AiOutlineQrcode, AiFillAmazonCircle } from "react-icons/ai";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material";
import AGTable from "../../../../components/DataTable/AGTable";
import { generalQuery, getAuditMode, getUserData } from "../../../../api/Api";
import { AMAZON_DATA } from "../../interfaces/kdInterface";
import { COMPONENT_DATA } from "../../../rnd/interfaces/rndInterface";
import { renderElement } from "../../../../api/services/utilService";

interface Props {
  onOpenAmzAddModal: () => void;
}

const PrintTrigger = ({ onPrint }: { onPrint: () => void }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onPrint();
    }, 1500);
    return () => clearTimeout(timer);
  }, [onPrint]);
  return null;
};

const DEFAULT_COMPONENT_LIST: COMPONENT_DATA[] = [
  {
    G_CODE_MAU: "0000",
    DOITUONG_NO: 1,
    DOITUONG_NAME: "2D MATRIX",
    DOITUONG_STT: "1",
    CAVITY_PRINT: 1,
    FONT_NAME: "Arial",
    FONT_SIZE: 10,
    FONT_STYLE: "Regular",
    PHANLOAI_DT: "2D MATRIX",
    GIATRI: "0000",
    POS_X: 2,
    POS_Y: 2,
    SIZE_W: 9,
    SIZE_H: 9,
    ROTATE: 0,
    REMARK: "remark",
  },
];

const PrecisionAmzTab: React.FC<Props> = ({ onOpenAmzAddModal }) => {
  const [isFilterHidden, setIsFilterHidden] = useState(false);
  const [isLoading, setisLoading] = useState(false);
  const [fromdate, setFromDate] = useState(moment().format("YYYY-MM-DD"));
  const [todate, setToDate] = useState(moment().format("YYYY-MM-DD"));
  const [codeKD, setCodeKD] = useState("");
  const [codeCMS, setCodeCMS] = useState("");
  const [prodrequestno, setProdRequestNo] = useState("");
  const [plan_id, setPlanID] = useState("");
  const [dataAMZ, setDataAMZ] = useState("");
  const [alltime, setAllTime] = useState(false);
  const [amzdatatable, setAMZDataTable] = useState<AMAZON_DATA[]>([]);
  const [selectedRows, setSelectedRows] = useState<AMAZON_DATA[]>([]);
  const [lastSyncTime, setLastSyncTime] = useState(moment().format("HH:mm:ss"));

  // Print States
  const [openPrintModal, setOpenPrintModal] = useState(false);
  const [printData, setPrintData] = useState<
    Array<{ design: COMPONENT_DATA[]; dataRow: AMAZON_DATA }>
  >([]);
  const [printOffsetX, setPrintOffsetX] = useState(
    Number(localStorage.getItem("AMZ_PrintOffsetX")) || 0
  );
  const [printOffsetY, setPrintOffsetY] = useState(
    Number(localStorage.getItem("AMZ_PrintOffsetY")) || 0
  );
  const [isPrinting, setIsPrinting] = useState(false);
  const [printWindowContainer, setPrintWindowContainer] =
    useState<HTMLElement | null>(null);
  const printWindowRef = useRef<Window | null>(null);
  const [confirmPrintOpen, setConfirmPrintOpen] = useState(false);
  const [printSuccessCount, setPrintSuccessCount] = useState(0);

  const escapeSingleQuote = (s: string) => s.replace(/'/g, "''");

  useEffect(() => {
    localStorage.setItem("AMZ_PrintOffsetX", printOffsetX.toString());
    localStorage.setItem("AMZ_PrintOffsetY", printOffsetY.toString());
  }, [printOffsetX, printOffsetY]);

  // Tra cứu dữ liệu AMZ
  const handle_traAMZ = () => {
    setisLoading(true);
    generalQuery("traDataAMZ", {
      ALLTIME: alltime,
      FROM_DATE: fromdate,
      TO_DATE: todate,
      PROD_REQUEST_NO: prodrequestno,
      NO_IN: plan_id,
      G_NAME: codeKD,
      G_CODE: codeCMS,
      DATA_AMZ: escapeSingleQuote(dataAMZ),
    })
      .then((response) => {
        setisLoading(false);
        if (response.data.tk_status !== "NG") {
          const loaded_data: AMAZON_DATA[] = response.data.data.map(
            (element: AMAZON_DATA, index: number) => ({
              ...element,
              G_NAME:
                getAuditMode() === 0
                  ? element?.G_NAME
                  : element?.G_NAME?.search("CNDB") === -1
                    ? element?.G_NAME
                    : "TEM_NOI_BO",
              INS_DATE: moment(element.INS_DATE)
                .utc()
                .format("YYYY-MM-DD HH:mm:ss"),
              id: index,
            })
          );
          setAMZDataTable(loaded_data);
          setLastSyncTime(moment().format("HH:mm:ss"));
          Swal.fire(
            "Thông báo",
            `Đã tải thành công ${loaded_data.length} bản ghi AMZ`,
            "success"
          );
        } else {
          setAMZDataTable([]);
          Swal.fire("Thông báo", "Không tìm thấy dữ liệu AMZ phù hợp", "info");
        }
      })
      .catch(() => {
        setisLoading(false);
        Swal.fire("Lỗi", "Không thể kết nối máy chủ tra AMZ", "error");
      });
  };

  // Label Design Fetch
  const handleGETAMAZON_DESIGN = async (
    G_CODE: string
  ): Promise<COMPONENT_DATA[]> => {
    try {
      const response = await generalQuery("getAMAZON_DESIGN", { G_CODE });
      if (response.data.tk_status !== "NG" && response.data.data.length > 0) {
        return response.data.data.map(
          (element: COMPONENT_DATA, index: number) => ({
            ...element,
            id: index,
          })
        );
      }
      return DEFAULT_COMPONENT_LIST;
    } catch {
      return DEFAULT_COMPONENT_LIST;
    }
  };

  // Chuẩn bị in tem
  const handlePreparePrint = async () => {
    if (selectedRows.length === 0) {
      Swal.fire("Lỗi", "Vui lòng tích chọn ít nhất 1 dòng để in tem", "warning");
      return;
    }

    setisLoading(true);
    const uniqueGCodes = [
      ...new Set(selectedRows.map((row) => row.G_CODE_MAU)),
    ];
    const designMap: { [key: string]: COMPONENT_DATA[] } = {};

    for (const g_code of uniqueGCodes) {
      if (g_code) {
        const tempDesign = await handleGETAMAZON_DESIGN(g_code);
        designMap[g_code] = tempDesign;
      }
    }

    const newPrintData = selectedRows.map((row) => {
      const design = designMap[row.G_CODE_MAU!]
        ? designMap[row.G_CODE_MAU!].map((comp) => ({ ...comp }))
        : [];
      const matrices = design.filter((d) => d.PHANLOAI_DT === "2D MATRIX");
      if (matrices.length > 0) {
        matrices[0].GIATRI = row.DATA_1 ?? "";
      }
      if (matrices.length > 1) {
        matrices[1].GIATRI = row.DATA_2 ?? "";
      }
      return {
        design,
        dataRow: row,
      };
    });

    setPrintData(newPrintData);
    setisLoading(false);
    setOpenPrintModal(true);
  };

  // Xác thực mật khẩu & Bắt đầu in
  const handlePrint = async () => {
    const password = prompt("Nhập mật khẩu để in tem Amazon:");
    if (password === null) return;

    const auth = await generalQuery("checkpassAMZ", { PASSAMZ: password });
    if (auth.data.tk_status !== "ok") {
      Swal.fire("Thông báo", "Mật khẩu không chính xác", "error");
      return;
    }

    setIsPrinting(true);
  };

  // Cập nhật trạng thái in
  const handleUpdatePrintStatus = async () => {
    if (printSuccessCount <= 0) {
      Swal.fire("Thông báo", "Số lượng in phải lớn hơn 0", "warning");
      return;
    }
    Swal.fire(
      "Thành công",
      `Đã cập nhật trạng thái in cho ${printSuccessCount} tem!`,
      "success"
    );
    setConfirmPrintOpen(false);
    setOpenPrintModal(false);
  };

  // Portal in ấn
  useEffect(() => {
    if (isPrinting) {
      setPrintSuccessCount(printData.length);
      const pWin = window.open("", "", "height=600,width=800");
      if (pWin) {
        printWindowRef.current = pWin;
        pWin.document.write(
          "<html><head><title>Print Labels</title></head><body><div id='print-root'></div></body></html>"
        );
        pWin.document.write(`<style>
            @media print {
                @page { size: auto; margin: 0mm; }
                body { margin: 0mm; }
                .print-label-item { break-after: page; page-break-after: always; }
            }
            .print-label-item { position: relative; }
         </style>`);
        pWin.document.close();
        setPrintWindowContainer(pWin.document.getElementById("print-root"));
      } else {
        alert("Vui lòng cho phép mở popup trình duyệt để in tem");
        setIsPrinting(false);
      }
    } else {
      if (printWindowRef.current) {
        printWindowRef.current.close();
        printWindowRef.current = null;
        setPrintWindowContainer(null);
      }
    }
  }, [isPrinting, printData.length]);

  // Xuất Excel
  const exportExcel = (data: any[], fileName: string) => {
    if (!data || data.length === 0) {
      Swal.fire("Thông báo", "Không có dữ liệu để xuất Excel", "warning");
      return;
    }
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "AMZ");
    XLSX.writeFile(wb, `${fileName}_${moment().format("YYYYMMDD_HHmmss")}.xlsx`);
  };

  // Columns AG Grid
  const columns = useMemo(
    () => [
      {
        field: "ROW_NO",
        headerName: "STT",
        width: 75,
        checkboxSelection: true,
        headerCheckboxSelection: true,
      },
      { field: "G_NAME", headerName: "TÊN SẢN PHẨM (KD)", width: 170 },
      { field: "G_CODE", headerName: "MÃ CODE ERP", width: 90 },
      {
        field: "PROD_REQUEST_NO",
        headerName: "SỐ YCSX",
        width: 95,
        cellRenderer: (p: any) => (
          <strong style={{ color: "#2563eb" }}>{p.value}</strong>
        ),
      },
      { field: "NO_IN", headerName: "ID CÔNG VIỆC / PLAN", width: 150 },
      { field: "DATA_1", headerName: "MÃ BARCODE 1 (DATA_1)", width: 190 },
      { field: "DATA_2", headerName: "MÃ BARCODE 2 (DATA_2)", width: 190 },
      {
        field: "PRINT_STATUS",
        headerName: "TRẠNG THÁI IN",
        width: 105,
        cellRenderer: (p: any) => {
          if (p.value === "OK") {
            return (
              <span
                style={{
                  color: "#059669",
                  fontWeight: 700,
                  background: "#ecfdf5",
                  padding: "2px 8px",
                  borderRadius: 4,
                }}
              >
                OK
              </span>
            );
          }
          return (
            <span
              style={{
                color: "#e11d48",
                fontWeight: 600,
                background: "#fff1f2",
                padding: "2px 8px",
                borderRadius: 4,
              }}
            >
              NG
            </span>
          );
        },
      },
      { field: "INLAI_COUNT", headerName: "SỐ LẦN IN", width: 90 },
      { field: "REMARK", headerName: "GHI CHÚ", width: 120 },
      { field: "G_CODE_MAU", headerName: "CODE MẪU IN", width: 100 },
      { field: "INS_DATE", headerName: "NGÀY TẠO", width: 130 },
      { field: "INS_EMPL", headerName: "NGƯỜI TẠO", width: 95 },
    ],
    []
  );

  // KPI Calculations
  const kpiData = useMemo(() => {
    const total = amzdatatable.length;
    const printed = amzdatatable.filter((r) => r.PRINT_STATUS === "Y").length;
    const inlay = amzdatatable.reduce(
      (acc, r) => acc + (Number(r.INLAI_COUNT) || 1),
      0
    );
    return {
      total,
      printed,
      inlay,
      rate: total > 0 ? ((printed / total) * 100).toFixed(1) : "0.0",
    };
  }, [amzdatatable]);

  return (
    <div
      className="precision-ycsx"
      style={{ display: "flex", flexDirection: "column", height: "100%", width: "100%", overflow: "hidden" }}
    >
      {/* 1. KPI Cards Amazon */}
      <div className="precision-ycsx__kpiGrid">
        {/* Card 1: Tổng Serial */}
        <div className="precision-ycsx__kpiCard precision-ycsx__kpiCard--blue">
          <div className="precision-ycsx__kpiInfo">
            <span className="precision-ycsx__kpiLabel">TỔNG SERIAL / QR AMZ</span>
            <div className="precision-ycsx__kpiValueRow">
              <span className="precision-ycsx__kpiValue">{kpiData.total.toLocaleString()}</span>
              <span className="precision-ycsx__kpiSub">Bản ghi</span>
            </div>
          </div>
          <div className="precision-ycsx__kpiIcon">
            <AiOutlineQrcode />
          </div>
        </div>

        {/* Card 2: Đã In Tem */}
        <div className="precision-ycsx__kpiCard precision-ycsx__kpiCard--emerald">
          <div className="precision-ycsx__kpiInfo">
            <span className="precision-ycsx__kpiLabel">ĐÃ IN TEM (PRINT STATUS)</span>
            <div className="precision-ycsx__kpiValueRow">
              <span className="precision-ycsx__kpiValue">
                {kpiData.printed}/{kpiData.total}
              </span>
              <span className="precision-ycsx__kpiSub">{kpiData.rate}% OK</span>
            </div>
          </div>
          <div className="precision-ycsx__kpiIcon">
            <FiPrinter />
          </div>
        </div>

        {/* Card 3: Tổng Inlay */}
        <div className="precision-ycsx__kpiCard precision-ycsx__kpiCard--purple">
          <div className="precision-ycsx__kpiInfo">
            <span className="precision-ycsx__kpiLabel">TỔNG SỐ LƯỢNG INLAY</span>
            <div className="precision-ycsx__kpiValueRow">
              <span className="precision-ycsx__kpiValue">{kpiData.inlay.toLocaleString()}</span>
              <span className="precision-ycsx__kpiSub">INLAY</span>
            </div>
          </div>
          <div className="precision-ycsx__kpiIcon">
            <FiLayers />
          </div>
        </div>

        {/* Card 4: Đồng bộ */}
        <div className="precision-ycsx__kpiCard precision-ycsx__kpiCard--amber">
          <div className="precision-ycsx__kpiInfo">
            <span className="precision-ycsx__kpiLabel">ĐỒNG BỘ GẦN NHẤT</span>
            <div className="precision-ycsx__kpiValueRow">
              <span className="precision-ycsx__kpiValue">{lastSyncTime}</span>
              <span className="precision-ycsx__kpiSub">Server Active</span>
            </div>
          </div>
          <div className="precision-ycsx__kpiIcon">
            <FiClock />
          </div>
        </div>
      </div>

      {/* 2. Workspace Split Body */}
      <div className="precision-ycsx__mainBody">
        {/* Left 250px Filter Sidebar */}
        <aside
          className={`precision-ycsx__filterPanel ${isFilterHidden ? "precision-ycsx__filterPanel--hidden" : ""
            }`}
        >
          <div className="precision-ycsx__filterHeader">
            <span className="precision-ycsx__filterTitle">
              <FiFilter /> BỘ LỌC TÌM KIẾM AMZ
            </span>
          </div>

          <div className="precision-ycsx__filterBody">
            <div className="precision-ycsx__filterRow2">
              <div className="precision-ycsx__filterGroup">
                <label className="precision-ycsx__filterLabel">Từ ngày:</label>
                <input
                  type="date"
                  className="precision-ycsx__filterInput"
                  value={fromdate.slice(0, 10)}
                  onChange={(e) => setFromDate(e.target.value)}
                />
              </div>
              <div className="precision-ycsx__filterGroup">
                <label className="precision-ycsx__filterLabel">Tới ngày:</label>
                <input
                  type="date"
                  className="precision-ycsx__filterInput"
                  value={todate.slice(0, 10)}
                  onChange={(e) => setToDate(e.target.value)}
                />
              </div>
            </div>

            <div className="precision-ycsx__filterGroup">
              <label className="precision-ycsx__filterLabel">Mã Code KD:</label>
              <input
                type="text"
                className="precision-ycsx__filterInput"
                placeholder="GH63-xxxxxx..."
                value={codeKD}
                onChange={(e) => setCodeKD(e.target.value)}
              />
            </div>

            <div className="precision-ycsx__filterGroup">
              <label className="precision-ycsx__filterLabel">Mã Code ERP:</label>
              <input
                type="text"
                className="precision-ycsx__filterInput"
                placeholder="7C123xxx..."
                value={codeCMS}
                onChange={(e) => setCodeCMS(e.target.value)}
              />
            </div>

            <div className="precision-ycsx__filterGroup">
              <label className="precision-ycsx__filterLabel">Số Yêu Cầu (YCSX):</label>
              <input
                type="text"
                className="precision-ycsx__filterInput"
                placeholder="1F80008..."
                value={prodrequestno}
                onChange={(e) => setProdRequestNo(e.target.value)}
              />
            </div>

            <div className="precision-ycsx__filterGroup">
              <label className="precision-ycsx__filterLabel">ID Công Việc / Plan:</label>
              <input
                type="text"
                className="precision-ycsx__filterInput"
                placeholder="CG123456789..."
                value={plan_id}
                onChange={(e) => setPlanID(e.target.value)}
              />
            </div>

            <div className="precision-ycsx__filterGroup">
              <label className="precision-ycsx__filterLabel">Dữ liệu Barcode (Data AMZ):</label>
              <input
                type="text"
                className="precision-ycsx__filterInput"
                placeholder="AZ:H3BS9IZEHF..."
                value={dataAMZ}
                onChange={(e) => setDataAMZ(e.target.value)}
              />
            </div>

            <div className="precision-ycsx__filterCheckGroup">
              <label className="precision-ycsx__filterCheck">
                <input
                  type="checkbox"
                  checked={alltime}
                  onChange={(e) => setAllTime(e.target.checked)}
                />
                <span>Tra cứu tất cả thời gian</span>
              </label>
            </div>

            <button
              type="button"
              className="precision-ycsx__filterSearchBtn"
              onClick={handle_traAMZ}
            >
              <FiFilter /> TRA CỨU DỮ LIỆU AMZ
            </button>
          </div>
        </aside>

        {/* Right Content */}
        <main className="precision-ycsx__content">
          {/* Action Toolbar */}
          <div className="precision-ycsx__gridToolbar">
            <div className="precision-ycsx__gridToolbarLeft">
              <button
                type="button"
                className="precision-ycsx__toolBtn"
                onClick={() => setIsFilterHidden((prev) => !prev)}
                title="Ẩn/Hiện Sidebar bộ lọc"
              >
                <FiSidebar />
                <span>{isFilterHidden ? "Hiện Lọc" : "Ẩn Lọc"}</span>
              </button>

              <div className="precision-ycsx__toolSep" />

              {/* Nút In Tem AMZ */}
              <button
                type="button"
                className="precision-ycsx__toolBtn precision-ycsx__toolBtn--primary"
                disabled={selectedRows.length === 0}
                onClick={handlePreparePrint}
                title="Xem trước và In tem AMZ cho các dòng được tích chọn"
                style={{
                  opacity: selectedRows.length === 0 ? 0.6 : 1,
                  cursor: selectedRows.length === 0 ? "not-allowed" : "pointer",
                }}
              >
                <FiPrinter size={14} />
                <span>IN TEM AMZ ({selectedRows.length})</span>
              </button>

              {/* Offset X & Y */}
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 4,
                  fontSize: 11,
                  color: "#475569",
                  marginLeft: 4,
                }}
              >
                <span>Offset X:</span>
                <input
                  type="number"
                  step="0.1"
                  value={printOffsetX}
                  onChange={(e) => setPrintOffsetX(Number(e.target.value))}
                  style={{ width: 44, height: 24, padding: "0 4px", fontSize: 11 }}
                />
                <span>Y:</span>
                <input
                  type="number"
                  step="0.1"
                  value={printOffsetY}
                  onChange={(e) => setPrintOffsetY(Number(e.target.value))}
                  style={{ width: 44, height: 24, padding: "0 4px", fontSize: 11 }}
                />
              </div>

              <div className="precision-ycsx__toolSep" />

              {/* Xuất Excel */}
              <button
                type="button"
                className="precision-ycsx__toolBtn"
                onClick={() => exportExcel(amzdatatable, "AMZ_ToanBo")}
              >
                <FiDownload /> EX1
              </button>
              <button
                type="button"
                className="precision-ycsx__toolBtn"
                onClick={() =>
                  exportExcel(
                    selectedRows.length > 0 ? selectedRows : amzdatatable,
                    "AMZ_DongChon"
                  )
                }
              >
                <FiDownload /> EX2
              </button>
            </div>

            <div className="precision-ycsx__gridToolbarRight">
              <button
                type="button"
                className="precision-ycsx__toolBtn precision-ycsx__toolBtn--emerald"
                onClick={onOpenAmzAddModal}
                title="Mở modal tải dữ liệu Amazon hàng loạt"
              >
                <AiFillAmazonCircle size={15} />
                <span>+ THÊM DỮ LIỆU AMZ MỚI</span>
              </button>
            </div>
          </div>

          {/* Table Container (100% full stretch) */}
          <div className="precision-ycsx__tableContainer">
            <AGTable
              data={amzdatatable}
              columns={columns}
              showFilter={true}
              toolbar={null}
              suppressRowClickSelection={false}
              onSelectionChange={(params: any) => {
                setSelectedRows(params?.api?.getSelectedRows() || []);
              }}
            />
          </div>
        </main>
      </div>

      {/* Dialog Preview Print Labels */}
      <Dialog
        open={openPrintModal}
        onClose={() => setOpenPrintModal(false)}
        maxWidth="lg"
        fullWidth
      >
        <DialogTitle>Xem trước bản in tem ({printData.length} tem)</DialogTitle>
        <DialogContent>
          <div
            style={{
              display: "flex",
              gap: 12,
              marginBottom: 12,
              alignItems: "center",
            }}
          >
            <TextField
              label="Offset X (mm)"
              type="number"
              size="small"
              value={printOffsetX}
              onChange={(e) => setPrintOffsetX(Number(e.target.value))}
              inputProps={{ step: "0.01" }}
            />
            <TextField
              label="Offset Y (mm)"
              type="number"
              size="small"
              value={printOffsetY}
              onChange={(e) => setPrintOffsetY(Number(e.target.value))}
              inputProps={{ step: "0.01" }}
            />
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 16,
              padding: 16,
              maxHeight: "55vh",
              overflowY: "auto",
              background: "#f8fafc",
              border: "1px solid #e2e8f0",
              borderRadius: 6,
            }}
          >
            {printData.slice(0, 50).map((item, index) => {
              let max_W = 0;
              let max_H = 0;
              item.design.forEach((d) => {
                const right = Number(d.POS_X) + Number(d.SIZE_W);
                const bottom = Number(d.POS_Y) + Number(d.SIZE_H);
                if (right > max_W) max_W = right;
                if (bottom > max_H) max_H = bottom;
              });

              return (
                <div
                  key={index}
                  className="print-label-item"
                  style={{
                    position: "relative",
                    width: max_W + "mm",
                    height: max_H + "mm",
                    border: "1px solid #94a3b8",
                    background: "#fff",
                    boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                  }}
                >
                  {renderElement(item.design)}
                </div>
              );
            })}
            {printData.length > 50 && (
              <div style={{ padding: 16, textAlign: "center", color: "#64748b" }}>
                ... và {printData.length - 50} tem khác. Bấm "In Tem" để in toàn bộ.
              </div>
            )}
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenPrintModal(false)}>Đóng</Button>
          <Button onClick={handlePrint} variant="contained" color="primary">
            Tiến Hành In (Print)
          </Button>
        </DialogActions>
      </Dialog>

      {/* Print Portal */}
      {isPrinting &&
        printWindowContainer &&
        createPortal(
          <div style={{ width: "100%", height: "100%" }}>
            {printData.map((item, index) => {
              let max_W = 0;
              let max_H = 0;
              item.design.forEach((d) => {
                const right = Number(d.POS_X) + Number(d.SIZE_W);
                const bottom = Number(d.POS_Y) + Number(d.SIZE_H);
                if (right > max_W) max_W = right;
                if (bottom > max_H) max_H = bottom;
              });

              return (
                <div
                  key={index}
                  className="print-label-item"
                  style={{
                    position: "relative",
                    width: max_W + "mm",
                    height: max_H + "mm",
                    border: "none",
                    pageBreakAfter: "always",
                    breakAfter: "page",
                    left: `${printOffsetX}mm`,
                    top: `${printOffsetY}mm`,
                  }}
                >
                  {renderElement(item.design)}
                </div>
              );
            })}
            <PrintTrigger
              onPrint={() => {
                printWindowRef.current?.print();
                setIsPrinting(false);
                setConfirmPrintOpen(true);
              }}
            />
          </div>,
          printWindowContainer
        )}

      {/* Confirm Print Dialog */}
      <Dialog
        open={confirmPrintOpen}
        onClose={() => setConfirmPrintOpen(false)}
      >
        <DialogTitle>Xác nhận kết quả in</DialogTitle>
        <DialogContent>
          <div style={{ padding: 8 }}>
            <p>
              Hệ thống đã gửi lệnh in <b>{printData.length}</b> tem tới máy in.
            </p>
            <p>Vui lòng xác nhận số lượng tem thực tế đã in thành công:</p>
            <TextField
              type="number"
              label="Số lượng in thành công"
              value={printSuccessCount}
              onChange={(e) => setPrintSuccessCount(Number(e.target.value))}
              fullWidth
              inputProps={{ min: 0, max: printData.length }}
              style={{ marginTop: 12 }}
            />
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmPrintOpen(false)} color="error">
            Hủy
          </Button>
          <Button
            onClick={handleUpdatePrintStatus}
            variant="contained"
            color="success"
          >
            Xác nhận Cập Nhật
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default memo(PrecisionAmzTab);
