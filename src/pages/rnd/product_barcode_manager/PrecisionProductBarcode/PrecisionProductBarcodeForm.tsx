import React, { useCallback, useMemo } from "react";
import { AiOutlineBarcode, AiOutlineDelete, AiOutlineEdit, AiOutlinePlus, AiOutlineReload } from "react-icons/ai";
import { BsEye, BsQrCodeScan } from "react-icons/bs";
import { CodeListData } from "../../../kinhdoanh/interfaces/kdInterface";
import { BARCODE_DATA, COMPONENT_DATA } from "../../interfaces/rndInterface";
import BARCODE from "../../design_amazon/design_components/BARCODE";
import DATAMATRIX from "../../design_amazon/design_components/DATAMATRIX";
import QRCODE from "../../design_amazon/design_components/QRCODE";
import { ProductCodeAutocomplete } from "./ProductCodeAutocomplete";

// Giá trị nền dùng chung cho khối preview (POS_X/POS_Y phải bằng 0 vì đã có visStage neo sẵn)
const PREVIEW_BASE: COMPONENT_DATA = {
  CAVITY_PRINT: 2,
  DOITUONG_NAME: "bc",
  DOITUONG_NO: 1,
  DOITUONG_STT: "0",
  FONT_NAME: "Arial",
  FONT_SIZE: 6,
  FONT_STYLE: "normal",
  G_CODE_MAU: "",
  GIATRI: "",
  PHANLOAI_DT: "1D BARCODE",
  POS_X: 0,
  POS_Y: 0,
  SIZE_W: 60,
  SIZE_H: 10,
  REMARK: "",
  ROTATE: 0,
};

interface FormProps {
  isOpen: boolean;
  codeList: CodeListData[];
  selectedCode: CodeListData | null;
  setSelectedCode: (val: CodeListData | null) => void;
  selectedRows: BARCODE_DATA;
  setBarCodeInfo: (keyname: string, value: any) => void;
  onAdd: () => void;
  onUpdate: () => void;
  onDelete: () => void;
  onReset: () => void;
}

export const PrecisionProductBarcodeForm: React.FC<FormProps> = React.memo(
  ({
    isOpen,
    codeList,
    selectedCode,
    setSelectedCode,
    selectedRows,
    setBarCodeInfo,
    onAdd,
    onUpdate,
    onDelete,
    onReset,
  }) => {
    // Chọn mã sản phẩm từ AutoComplete -> setSelectedCode + đồng bộ G_CODE/G_NAME cho form
    const handleSelectCode = useCallback(
      (val: CodeListData | null) => {
        setSelectedCode(val);
        setBarCodeInfo("G_CODE", val?.G_CODE ?? "");
        setBarCodeInfo("G_NAME", val?.G_NAME ?? "");
      },
      [setSelectedCode, setBarCodeInfo]
    );

    // Loại mã đang chọn: 1D (60x10mm) / QR - MATRIX (10x10mm)
    const barcodeType = selectedRows?.BARCODE_TYPE || "1D";
    const is1D = barcodeType !== "QR" && barcodeType !== "MATRIX";

    // Dữ liệu đưa vào component vẽ mã (BARCODE/QRCODE/DATAMATRIX dùng kích thước mm)
    const previewData = useMemo<COMPONENT_DATA>(
      () => ({
        ...PREVIEW_BASE,
        GIATRI: selectedRows?.BARCODE_RND ?? "",
        PHANLOAI_DT: is1D ? "1D BARCODE" : barcodeType === "QR" ? "QR CODE" : "2D MATRIX",
        SIZE_W: is1D ? 60 : 10,
        SIZE_H: 10,
      }),
      [selectedRows?.BARCODE_RND, is1D, barcodeType]
    );

    return (
      <aside className={`precision-barcode__formPane ${!isOpen ? "precision-barcode__formPane--collapsed" : ""}`}>
        {/* TIÊU ĐỀ FORM */}
        <div className="precision-barcode__formTitle">
          <h3>
            <BsQrCodeScan size={15} color="#2563eb" />
            <span>THIẾT LẬP MÃ VẠCH</span>
          </h3>
          <button type="button" className="clearBtn" onClick={onReset} title="Xóa trắng để tạo mới">
            <AiOutlineReload size={12} style={{ marginRight: 3 }} />
            <span>Nhập mới</span>
          </button>
        </div>

        {/* CÁC TRƯỜNG NHẬP LIỆU */}
        <div className="precision-barcode__formBody">
          {/* MÃ SẢN PHẨM */}
          <div className="formItem">
            <label>
              <span>MÃ SẢN PHẨM (PRODUCT CODE):</span>
            </label>
            <div className="codeSelectWrap">
              {/* AUTOCOMPLETE: gõ mã/tên để search, Enter chọn option đầu tiên của list sau lọc */}
              <ProductCodeAutocomplete
                codeList={codeList}
                selectedCode={selectedCode}
                onSelect={handleSelectCode}
              />
              {selectedCode && (
                <div className="productMeta" title={selectedCode.G_NAME}>
                  {selectedCode.G_CODE} — {selectedCode.G_NAME}
                </div>
              )}
            </div>
          </div>

          {/* SỐ THỨ TỰ & LOẠI MÃ */}
          <div className="formRow2">
            <div className="formItem">
              <label>
                <span>STT BARCODE:</span>
              </label>
              <input
                type="text"
                placeholder="VD: 1, 2..."
                value={selectedRows?.BARCODE_STT ?? ""}
                onChange={(e) => setBarCodeInfo("BARCODE_STT", e.target.value)}
              />
            </div>

            <div className="formItem">
              <label>
                <span>LOẠI MÃ VẠCH:</span>
              </label>
              <select
                value={selectedRows?.BARCODE_TYPE ?? "1D"}
                onChange={(e) => setBarCodeInfo("BARCODE_TYPE", e.target.value)}
              >
                <option value="1D">1D BARCODE</option>
                <option value="MATRIX">2D MATRIX</option>
                <option value="QR">QR CODE</option>
              </select>
            </div>
          </div>

          {/* CHUỖI MÃ VẠCH R&D */}
          <div className="formItem">
            <label>
              <AiOutlineBarcode size={14} color="#2563eb" />
              <span>BARCODE RND (CHUỖI DỮ LIỆU):</span>
            </label>
            <input
              type="text"
              placeholder="Nhập giá trị chuỗi mã vạch R&D..."
              value={selectedRows?.BARCODE_RND ?? ""}
              onChange={(e) => setBarCodeInfo("BARCODE_RND", e.target.value)}
            />
          </div>

          {/* MÃ DTC & KT (READONLY) */}
          <div className="formRow2">
            <div className="formItem">
              <label>
                <span>BARCODE DTC:</span>
              </label>
              <input
                type="text"
                disabled
                placeholder="BARCODE DTC"
                value={selectedRows?.BARCODE_RELI ?? ""}
              />
            </div>

            <div className="formItem">
              <label>
                <span>BARCODE KT:</span>
              </label>
              <input
                type="text"
                disabled
                placeholder="BARCODE KT"
                value={selectedRows?.BARCODE_INSP ?? ""}
              />
            </div>
          </div>
        </div>

        {/* LIVE BARCODE VISUALIZER PREVIEW */}
        <div className="precision-barcode__visualizerCard">
          <div className="visTitle">
            <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
              <BsEye size={12} color="#2563eb" />
              <span>XEM TRƯỚC MÃ QUÉT TRỰC TIẾP ({barcodeType})</span>
            </span>
          </div>
          <div className="visBox">
            {selectedRows?.BARCODE_RND ? (
              // visStage là khung định vị (position:relative) + có tỉ lệ mm của tem:
              // các component BARCODE/QRCODE/DATAMATRIX đều render position:absolute theo mm
              // nên BẮT BUỘC phải nằm trong stage này, nếu không sẽ "dạt" ra góc component.
              <div
                className={`visStage ${is1D ? "visStage--stretch" : "visStage--square"}`}
                style={{ aspectRatio: `${previewData.SIZE_W} / ${previewData.SIZE_H}` }}
              >
                {barcodeType === "QR" ? (
                  <QRCODE DATA={previewData} />
                ) : barcodeType === "MATRIX" ? (
                  <DATAMATRIX DATA={previewData} />
                ) : (
                  <BARCODE DATA={previewData} />
                )}
              </div>
            ) : (
              <span className="emptyHint">Nhập BARCODE_RND để hiển thị mã quét</span>
            )}
          </div>
        </div>

        {/* NÚT THAO TÁC */}
        <div className="precision-barcode__formActions">
          <button
            type="button"
            className="btnAction btnAction--add"
            onClick={onAdd}
            disabled={!selectedRows?.G_CODE || !selectedRows?.BARCODE_RND || !String(selectedRows?.BARCODE_STT ?? "").trim()}
            title="Thêm mới barcode cho sản phẩm (cần Mã SP, STT và chuỗi Barcode R&D)"
          >
            <AiOutlinePlus size={14} />
            <span>THÊM MỚI</span>
          </button>

          <button
            type="button"
            className="btnAction btnAction--update"
            onClick={onUpdate}
            disabled={!selectedRows?.G_CODE || !String(selectedRows?.BARCODE_STT ?? "").trim()}
            title="Cập nhật thông tin barcode"
          >
            <AiOutlineEdit size={14} />
            <span>CẬP NHẬT</span>
          </button>

          <button
            type="button"
            className="btnAction btnAction--delete"
            onClick={onDelete}
            disabled={!selectedRows?.G_CODE || !String(selectedRows?.BARCODE_STT ?? "").trim()}
            title="Xóa barcode (chỉ xóa khi chưa sản xuất)"
          >
            <AiOutlineDelete size={14} />
            <span>XÓA MÃ VẠCH NÀY</span>
          </button>
        </div>
      </aside>
    );
  }
);

PrecisionProductBarcodeForm.displayName = "PrecisionProductBarcodeForm";
