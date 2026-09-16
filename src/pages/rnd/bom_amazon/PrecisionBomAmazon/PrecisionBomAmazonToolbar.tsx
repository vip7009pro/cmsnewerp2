import React from "react";
import { AiFillEdit, AiFillFileExcel, AiFillSave, AiOutlineSearch } from "react-icons/ai";
import { BsArrowRepeat } from "react-icons/bs";

interface ToolbarProps {
  codeinfoCMS: string;
  codeinfoKD: string;
  isBomExist: boolean;
  bomDataLength: number;
  filteredCount: number;
  enableEdit: boolean;
  onToggleEdit: () => void;
  onSaveBom: () => void;
  onResetToTemplate: () => void;
  onExportExcel: () => void;
  quickSearchBom: string;
  setQuickSearchBom: (val: string) => void;
}

export const PrecisionBomAmazonToolbar: React.FC<ToolbarProps> = React.memo(
  ({
    codeinfoCMS,
    codeinfoKD,
    isBomExist,
    bomDataLength,
    filteredCount,
    enableEdit,
    onToggleEdit,
    onSaveBom,
    onResetToTemplate,
    onExportExcel,
    quickSearchBom,
    setQuickSearchBom,
  }) => {
    return (
      <div className="precision-bom-amz__toolbar">
        {/* HÀNG 1: THÔNG TIN SẢN PHẨM ĐANG CHỌN */}
        <div className="precision-bom-amz__toolbarRow1">
          <div className="precision-bom-amz__productInfoGroup">
            {codeinfoCMS ? (
              <>
                <span className="precision-bom-amz__codeBadge">{codeinfoCMS}</span>
                <span className="precision-bom-amz__nameBadge" title={codeinfoKD}>
                  {codeinfoKD || "Chưa có tên KD"}
                </span>
                <span
                  className={`precision-bom-amz__statusBadge ${
                    isBomExist
                      ? "precision-bom-amz__statusBadge--existing"
                      : "precision-bom-amz__statusBadge--template"
                  }`}
                >
                  {isBomExist ? "✓ BOM ĐÃ LƯU TRÊN HỆ THỐNG" : "★ BOM MỚI (TỪ PHÔI MẪU)"}
                </span>
              </>
            ) : (
              <span className="precision-bom-amz__statusBadge precision-bom-amz__statusBadge--empty">
                ℹ Vui lòng chọn một mã sản phẩm từ danh mục bên trái
              </span>
            )}
          </div>

          <div className="precision-bom-amz__metaBadge">
            Tổng số chỉ tiêu BOM: <strong>{filteredCount} / {bomDataLength}</strong> dòng
          </div>
        </div>

        {/* HÀNG 2: CỤM NÚT THAO TÁC & TÌM KIẾM NHANH */}
        <div className="precision-bom-amz__toolbarRow2">
          <div className="precision-bom-amz__actionGroupLeft">
            <button
              type="button"
              className="precision-bom-amz__btn precision-bom-amz__btn--save"
              onClick={onSaveBom}
              disabled={!codeinfoCMS || bomDataLength === 0}
              title="Lưu cấu trúc BOM Amazon vào cơ sở dữ liệu"
            >
              <AiFillSave size={15} />
              <span>LƯU BOM</span>
            </button>

            <button
              type="button"
              className={`precision-bom-amz__btn precision-bom-amz__btn--edit ${
                enableEdit ? "is-active" : ""
              }`}
              onClick={onToggleEdit}
              title="Bật/Tắt chế độ chỉnh sửa giá trị và ghi chú trên bảng"
            >
              <AiFillEdit size={14} />
              <span>{enableEdit ? "ĐANG BẬT SỬA" : "BẬT CHẾ ĐỘ SỬA"}</span>
            </button>

            {codeinfoCMS && (
              <button
                type="button"
                className="precision-bom-amz__btn precision-bom-amz__btn--template"
                onClick={onResetToTemplate}
                title="Khởi tạo lại bảng BOM theo code phôi mẫu đang chọn"
              >
                <BsArrowRepeat size={14} />
                <span>NẠP LẠI TỪ PHÔI</span>
              </button>
            )}

            <button
              type="button"
              className="precision-bom-amz__btn precision-bom-amz__btn--excel"
              onClick={onExportExcel}
              disabled={bomDataLength === 0}
              title="Xuất bảng dữ liệu BOM ra tệp Excel"
            >
              <AiFillFileExcel size={15} />
              <span>XUẤT EXCEL</span>
            </button>
          </div>

          <div className="precision-bom-amz__actionGroupRight">
            <div className="precision-bom-amz__quickFilterBox">
              <span className="icon">
                <AiOutlineSearch />
              </span>
              <input
                type="text"
                placeholder="Lọc nhanh trong bảng BOM..."
                value={quickSearchBom}
                onChange={(e) => setQuickSearchBom(e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
);

PrecisionBomAmazonToolbar.displayName = "PrecisionBomAmazonToolbar";
