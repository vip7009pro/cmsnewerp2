import React from "react";
import Swal from "sweetalert2";
import { FiSave, FiUpload, FiRefreshCw, FiImage } from "react-icons/fi";
import { zeroPad } from "../../../../api/services/utilService";
import { ERROR_TABLE } from "../../interfaces/qcInterface";
import { UserData } from "../../../../api/GlobalInterface";

interface PrecisionPQC3InputCardProps {
  userData?: UserData;
  factory: string;
  setFactory: (val: string) => void;
  process_lot_no: string;
  setProcessLotNo: (val: string) => void;
  lineqc_empl: string;
  setLineqc_empl: (val: string) => void;
  empl_name: string;
  err_code: string;
  setErr_Code: (val: string) => void;
  error_tb: ERROR_TABLE[];
  defect_phenomenon: string;
  setDefectPhenomenon: (val: string) => void;
  occurr_time: string;
  setOccurrTime: (val: string) => void;
  remark: string;
  setReMark: (val: string) => void;
  sample_qty: number;
  setSample_Qty: (val: number) => void;
  defect_qty: number;
  setDefect_Qty: (val: number) => void;
  file: any;
  setFile: (val: any) => void;
  pqc1Id: number;
  pqc3Id: number;
  refArray: React.MutableRefObject<any>[];
  handleKeyDown: (e: any, index: number) => void;
  checkProcessLotNo: (lotNo: string) => void;
  checkEMPL_NAME: (sel: number, emplNo: string) => void;
  checkInput: () => boolean;
  onSaveDefect: () => void;
  onUpdatePhoto: (targetId: number) => void;
  onResetForm: () => void;
}

export const PrecisionPQC3InputCard: React.FC<PrecisionPQC3InputCardProps> = ({
  userData,
  factory,
  setFactory,
  process_lot_no,
  setProcessLotNo,
  lineqc_empl,
  setLineqc_empl,
  empl_name,
  err_code,
  setErr_Code,
  error_tb,
  defect_phenomenon,
  setDefectPhenomenon,
  occurr_time,
  setOccurrTime,
  remark,
  setReMark,
  sample_qty,
  setSample_Qty,
  defect_qty,
  setDefect_Qty,
  file,
  setFile,
  pqc1Id,
  pqc3Id,
  refArray,
  handleKeyDown,
  checkProcessLotNo,
  checkEMPL_NAME,
  checkInput,
  onSaveDefect,
  onUpdatePhoto,
  onResetForm,
}) => {
  const handleSaveClick = () => {
    if (checkInput()) {
      refArray[0]?.current?.focus();
      onSaveDefect();
    } else {
      let missingFields = [];
      if (!process_lot_no) missingFields.push("LOT SX");
      if (!lineqc_empl) missingFields.push("Mã LINEQC");
      if (pqc1Id === 0) missingFields.push("Chọn Lô Setting PQC1 liên kết");
      if (!file) missingFields.push("Ảnh lỗi đính kèm");
      if (!defect_phenomenon) missingFields.push("Hiện tượng lỗi");

      Swal.fire({
        title: "Thiếu thông tin bắt buộc",
        html: `<div style="text-align: left; font-size: 13px;">Vui lòng nhập đủ các mục sau:<br/><b>• ${missingFields.join("<br/>• ")}</b></div>`,
        icon: "warning",
      });
      refArray[0]?.current?.focus();
    }
  };

  return (
    <div className="precision-pqc3-input-card">
      <div className="precision-pqc3-input-card__grid">
        {/* Hàng 1: Nhà máy, LOT SX, Mã LINEQC + Tên NV, Mã lỗi */}
        <div className="form-group">
          <label>
            Nhà Máy
            <span className="field-tag">Bắt buộc</span>
          </label>
          <select
            disabled={userData?.EMPL_NO === "NHU1903"}
            value={factory}
            onChange={(e) => setFactory(e.target.value)}
          >
            <option value="NM1">NM1 (Nhà máy 1)</option>
            <option value="NM2">NM2 (Nhà máy 2)</option>
          </select>
        </div>

        <div className="form-group">
          <label>
            LOT Sản Xuất
            <span className="field-tag">Quét mã</span>
          </label>
          <input
            ref={refArray[0]}
            type="text"
            placeholder="Nhập/quét LOT SX..."
            value={process_lot_no}
            onKeyDown={(e) => handleKeyDown(e, 0)}
            onChange={(e) => {
              const val = e.target.value.toUpperCase();
              setProcessLotNo(val);
              if (val.length >= 8) {
                checkProcessLotNo(val);
              }
            }}
          />
        </div>

        <div className="form-group">
          <label>
            Mã LINEQC
            {empl_name && (
              <span className="field-tag" style={{ color: "#059669", background: "#ecfdf5" }}>
                {empl_name}
              </span>
            )}
          </label>
          <input
            ref={refArray[1]}
            type="text"
            placeholder="Mã thẻ NV..."
            value={lineqc_empl}
            onKeyDown={(e) => handleKeyDown(e, 1)}
            onChange={(e) => {
              const val = e.target.value.toUpperCase();
              setLineqc_empl(val);
              if (val.length >= 7) {
                checkEMPL_NAME(1, val);
              }
            }}
          />
        </div>

        <div className="form-group">
          <label>
            Phân Loại Mã Lỗi
            <span className="field-tag">Danh mục</span>
          </label>
          <select
            ref={refArray[2]}
            value={err_code}
            onKeyDown={(e) => handleKeyDown(e, 2)}
            onChange={(e) => setErr_Code(e.target.value)}
          >
            {error_tb.map((ele, idx) => (
              <option key={ele.ERR_CODE || idx} value={ele.ERR_CODE}>
                {zeroPad(idx + 1, 2)} | {ele.ERR_NAME_VN}
              </option>
            ))}
          </select>
        </div>

        {/* Hàng 2: Hiện tượng lỗi, Thời gian phát sinh, Ghi chú, Ảnh đính kèm */}
        <div className="form-group span-2">
          <label>
            Hiện Tượng Lỗi (Defect Phenomenon)
            <span className="field-tag">Bắt buộc</span>
          </label>
          <input
            ref={refArray[3]}
            type="text"
            placeholder="Mô tả cụ thể vị trí, hiện tượng..."
            value={defect_phenomenon}
            onKeyDown={(e) => handleKeyDown(e, 3)}
            onChange={(e) => setDefectPhenomenon(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label>Thời Gian Phát Sinh</label>
          <input
            ref={refArray[4]}
            type="datetime-local"
            value={occurr_time}
            onKeyDown={(e) => handleKeyDown(e, 4)}
            onChange={(e) => setOccurrTime(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label>Ghi Chú (Remark)</label>
          <input
            ref={refArray[5]}
            type="text"
            placeholder="Ghi chú thêm..."
            value={remark}
            onKeyDown={(e) => handleKeyDown(e, 5)}
            onChange={(e) => setReMark(e.target.value)}
          />
        </div>

        {/* Hàng 3: Mẫu kiểm tra, Lượng lỗi, File upload */}
        <div className="form-group">
          <label>Số Lượng Mẫu KT (Inspect Qty)</label>
          <input
            ref={refArray[6]}
            type="number"
            min={0}
            value={sample_qty}
            onKeyDown={(e) => handleKeyDown(e, 6)}
            onChange={(e) => setSample_Qty(Number(e.target.value))}
          />
        </div>

        <div className="form-group">
          <label>Số Lượng Hàng Lỗi (Defect Qty)</label>
          <input
            ref={refArray[7]}
            type="number"
            min={0}
            value={defect_qty}
            onKeyDown={(e) => handleKeyDown(e, 7)}
            onChange={(e) => setDefect_Qty(Number(e.target.value))}
          />
        </div>

        <div className="form-group span-2">
          <label>
            Ảnh Lỗi Hiện Trường (.png, .jpg)
            {file && (
              <span className="field-tag" style={{ color: "#059669", background: "#ecfdf5" }}>
                Đã chọn: {file.name}
              </span>
            )}
          </label>
          <div className="file-input-wrapper">
            <input
              ref={refArray[8]}
              type="file"
              accept="image/*,.jpg,.png"
              onKeyDown={(e) => handleKeyDown(e, 8)}
              onChange={(e: any) => {
                if (e.target.files && e.target.files[0]) {
                  setFile(e.target.files[0]);
                }
              }}
            />
          </div>
        </div>
      </div>

      {/* Action Footer */}
      <div className="precision-pqc3-input-card__actions">
        <div className="action-left">
          <button
            type="button"
            className="btn-submit btn-submit--reset"
            onClick={onResetForm}
            title="Làm mới toàn bộ form nhập"
          >
            <FiRefreshCw size={12} /> Làm Mới Form
          </button>
        </div>

        <div className="action-right">
          <button
            type="button"
            className="btn-submit btn-submit--update-img"
            onClick={() => onUpdatePhoto(pqc3Id)}
            title="Cập nhật ảnh cho bản ghi PQC3 đang chọn"
          >
            <FiUpload size={12} /> Update Ảnh PQC3 {pqc3Id > 0 ? `#${pqc3Id}` : ""}
          </button>

          <button
            ref={refArray[9]}
            type="button"
            className="btn-submit btn-submit--save"
            onClick={handleSaveClick}
            title="Lưu dữ liệu đăng ký sự cố lỗi PQC3"
          >
            <FiSave size={12} /> Lưu Sự Cố (Input Data)
          </button>
        </div>
      </div>
    </div>
  );
};

export default React.memo(PrecisionPQC3InputCard);
