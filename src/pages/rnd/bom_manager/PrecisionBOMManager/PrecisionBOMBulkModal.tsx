import React, { useEffect, useState } from "react";
import { AiOutlineClose, AiOutlineCloudUpload, AiOutlineDownload } from "react-icons/ai";
import Swal from "sweetalert2";
import * as XLSX from "xlsx";
import { generalQuery, getCompany, getUserData } from "../../../../api/Api";
import { zeroPad } from "../../../../api/services/utilService";
import AGTable from "../../../../components/DataTable/AGTable";
import { DEFAULT_DM } from "../../../kinhdoanh/interfaces/kdInterface";
import { CODE_FULL_INFO } from "../../interfaces/rndInterface";
import { DEFAULT_BULK_EXCEL_COLUMNS, getDynamicBulkExcelColumns } from "./precisionBOMBulkColumns";
import "./PrecisionBOMManager.scss";

interface PrecisionBOMBulkModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccessReload: () => void;
}

const PrecisionBOMBulkModal: React.FC<PrecisionBOMBulkModalProps> = ({
  isOpen,
  onClose,
  onSuccessReload,
}) => {
  const [currentTable, setCurrentTable] = useState<Array<any>>([]);
  const [columns, setColumns] = useState<Array<any>>(DEFAULT_BULK_EXCEL_COLUMNS);
  const [defaultDM, setDefaultDM] = useState<DEFAULT_DM>({
    id: 0,
    WIDTH_OFFSET: 0,
    LENGTH_OFFSET: 0,
    KNIFE_UNIT: 0,
    FILM_UNIT: 0,
    INK_UNIT: 0,
    LABOR_UNIT: 0,
    DELIVERY_UNIT: 0,
    DEPRECATION_UNIT: 0,
    GMANAGEMENT_UNIT: 0,
    M_LOSS_UNIT: 0,
  });

  const loadDefaultDM = async () => {
    try {
      const res = await generalQuery("loadDefaultDM", {});
      if (res.data.tk_status !== "NG" && res.data.data?.length > 0) {
        setDefaultDM(res.data.data[0]);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (isOpen) {
      loadDefaultDM();
      // Đảm bảo khi mở modal, bảng luôn hiển thị đầy đủ 44 cột mặc định
      if (currentTable.length === 0) {
        setColumns(DEFAULT_BULK_EXCEL_COLUMNS);
      }
    }
  }, [isOpen]);

  const readUploadFile = (e: any) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (ev: any) => {
        try {
          const data = ev.target.result;
          const workbook = XLSX.read(data, { type: "array" });
          const sheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[sheetName];
          const json: any = XLSX.utils.sheet_to_json(worksheet);

          if (!json || json.length === 0) {
            Swal.fire("Lỗi", "File Excel không có dữ liệu", "error");
            return;
          }

          const filejson = json.map((element: any, index: number) => ({
            ...element,
            CHECKSTATUS: "Waiting",
            id: index,
          }));

          const keysArray = Object.keys(filejson[0]);
          setColumns(getDynamicBulkExcelColumns(keysArray));
          setCurrentTable(filejson);
        } catch (err: any) {
          Swal.fire("Lỗi đọc file", err?.message || "Không thể đọc file Excel", "error");
        }
      };
      reader.readAsArrayBuffer(e.target.files[0]);
    }
  };

  const handleDownloadTemplate = () => {
    const templateFields = DEFAULT_BULK_EXCEL_COLUMNS
      .filter((c) => c.field !== "CHECKSTATUS")
      .map((c) => c.field);
    const sampleRow: Record<string, any> = {};
    templateFields.forEach((f) => {
      sampleRow[f] = "";
    });
    // Gợi ý dữ liệu mẫu cho dòng đầu
    sampleRow["CUST_CD"] = "CUST01";
    sampleRow["PROD_PROJECT"] = "PROJECT_A";
    sampleRow["PROD_MODEL"] = "MODEL_01";
    sampleRow["CODE_12"] = "7";
    sampleRow["PROD_TYPE"] = "LABEL";
    sampleRow["G_NAME_KD"] = "SAMPLE_CODE_KD";
    sampleRow["DESCR"] = "Mô tả sản phẩm";
    sampleRow["PROD_MAIN_MATERIAL"] = "PET";
    sampleRow["G_NAME"] = "SAMPLE_PART_NO";
    sampleRow["G_LENGTH"] = 30;
    sampleRow["G_WIDTH"] = 20;
    sampleRow["PD"] = 35;
    sampleRow["USE_YN"] = "Y";
    sampleRow["ROLE_EA_QTY"] = 1000;

    const ws = XLSX.utils.json_to_sheet([sampleRow]);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "BOM_TEMPLATE");
    XLSX.writeFile(wb, "BOM_BULK_UPLOAD_TEMPLATE.xlsx");
  };

  const checkG_NAME_KD_Exist = async (g_name_kd: string) => {
    try {
      const res = await generalQuery("checkGNAMEKDExist", {
        G_NAME_KD: g_name_kd,
      });
      return res.data.tk_status !== "NG";
    } catch {
      return false;
    }
  };

  const handleCheckCodeInfo = async (codefullinfo: CODE_FULL_INFO) => {
    if (getCompany() !== "CMS" && getUserData()?.MAINDEPTNAME === "KD") {
      return true;
    }
    const abc: any = codefullinfo;
    for (const [k, v] of Object.entries(abc)) {
      if (
        (v === null || v === "") &&
        k !== "REMK" &&
        k !== "FACTORY" &&
        k !== "Setting1" &&
        k !== "Setting2" &&
        k !== "Setting3" &&
        k !== "Setting4" &&
        k !== "UPH1" &&
        k !== "UPH2" &&
        k !== "UPH3" &&
        k !== "UPH4" &&
        k !== "Step1" &&
        k !== "Step2" &&
        k !== "Step3" &&
        k !== "Step4" &&
        k !== "LOSS_SX1" &&
        k !== "LOSS_SX2" &&
        k !== "LOSS_SX3" &&
        k !== "LOSS_SX4" &&
        k !== "LOSS_SETTING1" &&
        k !== "LOSS_SETTING2" &&
        k !== "LOSS_SETTING3" &&
        k !== "LOSS_SETTING4" &&
        k !== "LOSS_ST_SX1" &&
        k !== "LOSS_ST_SX2" &&
        k !== "LOSS_ST_SX3" &&
        k !== "LOSS_ST_SX4" &&
        k !== "NOTE" &&
        k !== "EQ3" &&
        k !== "EQ4"
      ) {
        return false;
      }
    }
    return true;
  };

  const getNextG_CODE = async (CODE_12: string, CODE_27: string) => {
    let nextseq = "";
    let nextseqno = "";
    try {
      const response = await generalQuery("getNextSEQ_G_CODE", {
        CODE_12: CODE_12,
        CODE_27: CODE_27,
      });
      const currentseq = response.data.data[0].LAST_SEQ_NO;
      if (response.data.tk_status !== "NG") {
        if (CODE_12 === "9") {
          nextseq = zeroPad(Number(currentseq) + 1, 6);
          nextseqno = nextseq;
        } else {
          nextseq = zeroPad(Number(currentseq) + 1, 5) + "A";
          nextseqno = zeroPad(Number(currentseq) + 1, 5);
        }
      } else {
        if (CODE_12 === "9") {
          nextseq = "000001";
          nextseqno = nextseq;
        } else {
          nextseq = "00001A";
          nextseqno = "00001";
        }
      }
    } catch {
      if (CODE_12 === "9") {
        nextseq = "000001";
        nextseqno = nextseq;
      } else {
        nextseq = "00001A";
        nextseqno = "00001";
      }
    }
    return { NEXT_G_CODE: CODE_12 + CODE_27 + nextseq, NEXT_SEQ_NO: nextseqno };
  };

  const handleinsertCodeTBG = (NEWG_CODE: string, codefullinfo: CODE_FULL_INFO) => {
    generalQuery("insertM100BangTinhGia", {
      G_CODE: NEWG_CODE,
      DEFAULT_DM: defaultDM,
      CODE_FULL_INFO: codefullinfo,
    }).catch((error) => {
      console.error(error);
    });
  };

  const handleAddNewCode = async (codefullinfo: CODE_FULL_INFO) => {
    if (Number(codefullinfo.CODE_12) < 6 || Number(codefullinfo.CODE_12) > 9) {
      Swal.fire("Thông báo", "Code 12 phải là số từ 6 đến 9", "error");
      return false;
    }
    let insertStatus = false;
    const checkg_name_kd = await checkG_NAME_KD_Exist(
      codefullinfo.G_NAME_KD === undefined ? "zzzzzzzzz" : codefullinfo.G_NAME_KD
    );

    const isCMS = getCompany() === "CMS";
    const isValidCMS = isCMS && (await handleCheckCodeInfo(codefullinfo));
    const isValidOther = !isCMS && checkg_name_kd === false;

    if (isValidCMS || isValidOther) {
      let CODE_27 = "C";
      const pType = (codefullinfo.PROD_TYPE || "").trim().toUpperCase();
      if (pType === "TSP" || pType === "OLED" || pType === "UV") {
        CODE_27 = "C";
      } else if (pType === "LABEL") {
        CODE_27 = "A";
      } else if (pType === "TAPE") {
        CODE_27 = "B";
      } else if (pType === "RIBBON") {
        CODE_27 = "E";
      }

      const nextcodeinfo = await getNextG_CODE(codefullinfo.CODE_12, CODE_27);
      const nextcode = nextcodeinfo.NEXT_G_CODE;
      const nextgseqno = nextcodeinfo.NEXT_SEQ_NO;

      try {
        const response = await generalQuery("insertM100", {
          G_CODE: nextcode,
          CODE_27: CODE_27,
          NEXT_SEQ_NO: nextgseqno,
          CODE_FULL_INFO: codefullinfo,
        });
        if (response.data.tk_status !== "NG") {
          insertStatus = true;
        }
      } catch (error) {
        console.error(error);
      }
      handleinsertCodeTBG(nextcode, codefullinfo);
    }
    return insertStatus;
  };

  const addhangloat = async () => {
    if (currentTable.length === 0) {
      Swal.fire("Thông báo", "Kéo file vào trước khi up", "warning");
      return;
    }

    let err_code = "";
    const tempTable = [...currentTable];

    for (let i = 0; i < tempTable.length; i++) {
      const insertStatus = await handleAddNewCode({
        ...tempTable[i],
        QL_HSD: tempTable[i]?.QL_HSD ?? "Y",
        EXP_DATE: tempTable[i]?.EXP_DATE ?? "0",
      });

      if (!insertStatus) {
        err_code += `${tempTable[i].G_NAME_KD || "Mã"}: NG | `;
        tempTable[i]["CHECKSTATUS"] = "NG";
      } else {
        tempTable[i]["CHECKSTATUS"] = "OK";
      }
    }

    setCurrentTable([...tempTable]);

    if (err_code === "") {
      Swal.fire("Thông báo", "Up code hàng loạt thành công", "success");
      onSuccessReload();
    } else {
      Swal.fire("Thông báo", `Up thất bại các code sau, hãy check lại thông tin: ${err_code}`, "error");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="precision-bom__bulkModal">
      <div className="modal-container">
        {/* Header */}
        <div className="modal-header">
          <div className="title-left">
            <div className="icon-box">
              <AiOutlineCloudUpload />
            </div>
            <div>
              <div className="title">TRUNG TÂM NẠP MÃ BOM HÀNG LOẠT (EXCEL BULK IMPORT)</div>
              <div className="subtitle">
                Hợp nhất quản lý BOM & Upload Excel - Tự động tạo G_CODE và đối soát thông số theo bản gốc
              </div>
            </div>
          </div>
          <button className="btn-close" onClick={onClose} title="Đóng modal">
            <AiOutlineClose />
          </button>
        </div>

        {/* Toolbar */}
        <div className="modal-toolbar">
          <div className="file-select-wrap">
            <input
              type="file"
              accept=".xlsx, .xls"
              onChange={readUploadFile}
            />
            <span style={{ fontSize: 11, color: "#64748b" }}>
              Đã nạp: <strong>{currentTable.length}</strong> dòng
            </span>
          </div>

          <div className="action-wrap">
            <button
              className="btn-up-code"
              style={{
                backgroundColor: "#0284c7",
                display: "inline-flex",
                alignItems: "center",
                gap: 5,
              }}
              onClick={handleDownloadTemplate}
              title="Tải file Excel mẫu gồm 43 cột chuẩn"
            >
              <AiOutlineDownload /> TẢI FILE MẪU
            </button>
            <button className="btn-up-code" onClick={addhangloat}>
              XÁC NHẬN NẠP CODE HÀNG LOẠT
            </button>
          </div>
        </div>

        {/* Preview Table */}
        <div className="modal-body">
          <AGTable
            toolbar={<></>}
            columns={columns}
            data={currentTable}
            showFilter={true}
          />
        </div>
      </div>
    </div>
  );
};

export default React.memo(PrecisionBOMBulkModal);
