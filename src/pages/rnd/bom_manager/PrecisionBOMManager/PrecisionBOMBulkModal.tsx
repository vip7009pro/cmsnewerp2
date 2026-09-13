import React, { useEffect, useState } from "react";
import { AiOutlineClose, AiOutlineCloudUpload } from "react-icons/ai";
import Swal from "sweetalert2";
import * as XLSX from "xlsx";
import { generalQuery, getCompany, getUserData } from "../../../../api/Api";
import { zeroPad } from "../../../../api/services/utilService";
import AGTable from "../../../../components/DataTable/AGTable";
import { DEFAULT_DM } from "../../../kinhdoanh/interfaces/kdInterface";
import { CODE_FULL_INFO } from "../../interfaces/rndInterface";

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
  const [columns, setColumns] = useState<Array<any>>([]);
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
      if (res.data.tk_status !== "NG") {
        setDefaultDM(res.data.data[0]);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (isOpen) {
      loadDefaultDM();
    }
  }, [isOpen]);

  const readUploadFile = (e: any) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (ev: any) => {
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

        const keysArray = Object.getOwnPropertyNames(filejson[0]);
        const column_map = keysArray.map((e) => ({
          field: e,
          headerName: e,
          width: e === "CHECKSTATUS" ? 140 : e === "G_NAME" || e === "DESCR" ? 180 : 95,
          cellRenderer: (ele: any) => {
            if (e === "CHECKSTATUS") {
              const val = ele.data[e];
              const bg = val === "OK" ? "#059669" : val === "NG" ? "#e11d48" : "#4f46e5";
              return (
                <div style={{ textAlign: "center", color: "#fff", background: bg, borderRadius: 3, fontWeight: 700, padding: "2px 6px" }}>
                  {val}
                </div>
              );
            }
            return <span>{ele.data[e]}</span>;
          },
        }));

        setColumns(column_map);
        setCurrentTable(filejson);
      };
      reader.readAsArrayBuffer(e.target.files[0]);
    }
  };

  const checkG_NAME_KD_Exist = async (g_name_kd: string) => {
    try {
      const res = await generalQuery("checkGNAMEKDExist", { G_NAME_KD: g_name_kd });
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
        !["REMK", "FACTORY", "Setting1", "Setting2", "Setting3", "Setting4", "UPH1", "UPH2", "UPH3", "UPH4", "Step1", "Step2", "Step3", "Step4", "LOSS_SX1", "LOSS_SX2", "LOSS_SX3", "LOSS_SX4", "LOSS_SETTING1", "LOSS_SETTING2", "LOSS_SETTING3", "LOSS_SETTING4", "LOSS_ST_SX1", "LOSS_ST_SX2", "LOSS_ST_SX3", "LOSS_ST_SX4", "NOTE", "EQ3", "EQ4"].includes(k)
      ) {
        return false;
      }
    }
    return true;
  };

  const addhangloat = async () => {
    if (currentTable.length === 0) {
      Swal.fire("Thông báo", "Vui lòng chọn file Excel trước khi nạp", "warning");
      return;
    }

    let err_code = "";
    const tempTable = [...currentTable];

    for (let i = 0; i < tempTable.length; i++) {
      const gnamekdExist = await checkG_NAME_KD_Exist(tempTable[i].G_NAME_KD);
      const rowValid = await handleCheckCodeInfo(tempTable[i]);

      if (!gnamekdExist && rowValid) {
        let max_g_code = "";
        const maxCodeRes = await generalQuery("checkmaxG_CODE", {
          PROD_PROJECT: tempTable[i].PROD_PROJECT,
          PROD_MODEL: tempTable[i].PROD_MODEL,
          CODE_12: tempTable[i].CODE_12,
        });

        if (maxCodeRes.data.tk_status !== "NG") {
          const max_seq: number = maxCodeRes.data.data[0].MAX_SEQ;
          const current_seq: number = max_seq + 1;
          max_g_code = `${tempTable[i].CODE_12}${tempTable[i].CODE_27}${zeroPad(current_seq, 5)}A`;
        }

        if (max_g_code) {
          const uploadRes = await generalQuery("upload_codeinfo", {
            ...tempTable[i],
            G_CODE: max_g_code,
            DEFAULT_DM: defaultDM,
          });

          if (uploadRes.data.tk_status === "OK") {
            tempTable[i].CHECKSTATUS = "OK";
          } else {
            tempTable[i].CHECKSTATUS = "NG";
            err_code += `${tempTable[i].G_NAME_KD}, `;
          }
        } else {
          tempTable[i].CHECKSTATUS = "NG";
          err_code += `${tempTable[i].G_NAME_KD}, `;
        }
      } else {
        tempTable[i].CHECKSTATUS = "NG";
        err_code += `${tempTable[i].G_NAME_KD}, `;
      }
    }

    setCurrentTable([...tempTable]);

    if (err_code === "") {
      Swal.fire("Thành công", "Đã nạp toàn bộ mã BOM thành công!", "success");
      onSuccessReload();
    } else {
      Swal.fire("Cảnh báo", `Nạp thất bại các mã: ${err_code}`, "error");
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
                Hợp nhất quản lý BOM & Upload Excel - Tự động tạo G_CODE và đối soát thông số
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
