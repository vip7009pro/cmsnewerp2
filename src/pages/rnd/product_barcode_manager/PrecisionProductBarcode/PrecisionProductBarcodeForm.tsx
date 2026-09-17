import React from "react";
import { AiOutlineBarcode, AiOutlineDelete, AiOutlineEdit, AiOutlinePlus, AiOutlineReload } from "react-icons/ai";
import { BsEye, BsQrCodeScan } from "react-icons/bs";
import { CodeListData } from "../../../kinhdoanh/interfaces/kdInterface";
import { BARCODE_DATA } from "../../interfaces/rndInterface";
import BARCODE from "../../design_amazon/design_components/BARCODE";
import DATAMATRIX from "../../design_amazon/design_components/DATAMATRIX";
import QRCODE from "../../design_amazon/design_components/QRCODE";

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
              <select
                value={selectedCode?.G_CODE ?? ""}
                onChange={(e) => {
                  const found = codeList.find((x) => x.G_CODE === e.target.value) ?? null;
                  setSelectedCode(found);
                  setBarCodeInfo("G_CODE", e.target.value);
                  if (found) {
                    setBarCodeInfo("G_NAME", found.G_NAME);
                  }
                }}
              >
                <option value="">-- Chọn mã sản phẩm --</option>
                {codeList.map((x) => (
                  <option key={x.G_CODE} value={x.G_CODE}>
                    {x.G_CODE} : {x.G_NAME}
                  </option>
                ))}
              </select>
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
              <span>XEM TRƯỚC MÃ QUÉT TRỰC TIẾP ({selectedRows?.BARCODE_TYPE || "1D"})</span>
            </span>
          </div>
          <div className="visBox">
            {selectedRows?.BARCODE_RND ? (
              selectedRows.BARCODE_TYPE === "QR" ? (
                <QRCODE
                  DATA={{
                    CAVITY_PRINT: 2,
                    DOITUONG_NAME: "bc",
                    DOITUONG_NO: 1,
                    DOITUONG_STT: "0",
                    FONT_NAME: "Arial",
                    FONT_SIZE: 6,
                    FONT_STYLE: "normal",
                    G_CODE_MAU: "",
                    GIATRI: selectedRows.BARCODE_RND,
                    PHANLOAI_DT: "QR CODE",
                    POS_X: 0,
                    POS_Y: 0,
                    SIZE_W: 10,
                    SIZE_H: 10,
                    REMARK: "",
                    ROTATE: 0,
                  }}
                />
              ) : selectedRows.BARCODE_TYPE === "MATRIX" ? (
                <DATAMATRIX
                  DATA={{
                    CAVITY_PRINT: 2,
                    DOITUONG_NAME: "bc",
                    DOITUONG_NO: 1,
                    DOITUONG_STT: "0",
                    FONT_NAME: "Arial",
                    FONT_SIZE: 6,
                    FONT_STYLE: "normal",
                    G_CODE_MAU: "",
                    GIATRI: selectedRows.BARCODE_RND,
                    PHANLOAI_DT: "QR CODE",
                    POS_X: 0,
                    POS_Y: 0,
                    SIZE_W: 10,
                    SIZE_H: 10,
                    REMARK: "",
                    ROTATE: 0,
                  }}
                />
              ) : (
                <BARCODE
                  DATA={{
                    CAVITY_PRINT: 2,
                    DOITUONG_NAME: "bc",
                    DOITUONG_NO: 1,
                    DOITUONG_STT: "0",
                    FONT_NAME: "Arial",
                    FONT_SIZE: 6,
                    FONT_STYLE: "normal",
                    G_CODE_MAU: "",
                    GIATRI: selectedRows.BARCODE_RND,
                    PHANLOAI_DT: "QR CODE",
                    POS_X: 0,
                    POS_Y: 0,
                    SIZE_W: 60,
                    SIZE_H: 10,
                    REMARK: "",
                    ROTATE: 0,
                  }}
                />
              )
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
            disabled={!selectedRows?.G_CODE || !selectedRows?.BARCODE_RND}
            title="Thêm mới barcode cho sản phẩm"
          >
            <AiOutlinePlus size={14} />
            <span>THÊM MỚI</span>
          </button>

          <button
            type="button"
            className="btnAction btnAction--update"
            onClick={onUpdate}
            disabled={!selectedRows?.G_CODE}
            title="Cập nhật thông tin barcode"
          >
            <AiOutlineEdit size={14} />
            <span>CẬP NHẬT</span>
          </button>

          <button
            type="button"
            className="btnAction btnAction--delete"
            onClick={onDelete}
            disabled={!selectedRows?.G_CODE}
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
