// PrecisionADDSPECDTCMobileConfigDrawer.tsx - Bottom Sheet Cấu Hình Zero-Blur cho ADDSPECDTC

import React from "react";
import { FiX, FiSettings, FiRotateCcw } from "react-icons/fi";
import { Autocomplete, TextField } from "@mui/material";
import { CodeListData } from "../../../kinhdoanh/interfaces/kdInterface";
import { CheckAddedSPECDATA, MaterialListData, TestListTable } from "../../interfaces/qcInterface";
import { getCompany } from "../../../../api/Api";

interface PrecisionADDSPECDTCMobileConfigDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  checkNVL: boolean;
  onToggleCheckNVL: () => void;
  codeList: CodeListData[];
  selectedCode: CodeListData | null;
  onSelectCode: (code: CodeListData | null) => void;
  materialList: MaterialListData[];
  selectedMaterial: MaterialListData | null;
  onSelectMaterial: (mat: MaterialListData | null) => void;
  filterOptions1: any;
  testList: TestListTable[];
  testname: string;
  onChangeTestName: (val: string) => void;
  onLoadSpec: () => void;
  onAddSpec: () => void;
  onUpdateSpec: () => void;
  addedSpec: CheckAddedSPECDATA[];
  onCopyXRFSS: () => void;
  onCopyXRFSDI: () => void;
}

const PrecisionADDSPECDTCMobileConfigDrawer: React.FC<PrecisionADDSPECDTCMobileConfigDrawerProps> = ({
  isOpen,
  onClose,
  checkNVL,
  onToggleCheckNVL,
  codeList,
  selectedCode,
  onSelectCode,
  materialList,
  selectedMaterial,
  onSelectMaterial,
  filterOptions1,
  testList,
  testname,
  onChangeTestName,
  onLoadSpec,
  onAddSpec,
  onUpdateSpec,
  addedSpec,
  onCopyXRFSS,
  onCopyXRFSDI,
}) => {
  if (!isOpen) return null;

  const showCopyXRF = getCompany() === "CMS" && testname === "3";
  const yesCount = addedSpec.filter((item) => item.CHECKADDED).length;

  return (
    <div className="addspecdtc-drawer-overlay" onClick={onClose}>
      <div className="addspecdtc-drawer" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="drawer-header">
          <div className="drawer-title">
            <FiSettings size={16} style={{ color: "#2563eb" }} />
            <span>{checkNVL ? "Cấu Hình SPEC NVL (IQC)" : "Cấu Hình SPEC ĐTC (R&D)"}</span>
          </div>
          <button
            type="button"
            className="drawer-close-btn"
            onClick={onClose}
            title="Đóng"
          >
            <FiX size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="drawer-body">
          {/* 1. Toggle NVL / SP */}
          <div className="drawer-field">
            <div className="drawer-field-header">
              <label className="drawer-label">Chế Độ Kiểm Tra</label>
              <button
                type="button"
                className={`drawer-quick-toggle ${checkNVL ? "active" : ""}`}
                onClick={onToggleCheckNVL}
              >
                {checkNVL ? "NVL (IQC) ✓" : "Thành Phẩm (R&D)"}
              </button>
            </div>
          </div>

          {/* 2. Autocomplete Chọn Code / NVL */}
          <div className="drawer-field">
            <label className="drawer-label">
              {checkNVL ? "Chọn Nguyên Vật Liệu" : "Code / Liệu (Sản phẩm)"}
            </label>
            {!checkNVL ? (
              <Autocomplete
                size="small"
                disablePortal
                options={codeList}
                filterOptions={filterOptions1}
                isOptionEqualToValue={(option: any, value: any) =>
                  option?.G_CODE === value?.G_CODE
                }
                getOptionLabel={(option: any) =>
                  option ? `${option.G_CODE}: ${option.G_NAME || ""}` : ""
                }
                renderInput={(params: any) => (
                  <TextField
                    {...params}
                    placeholder="Nhập mã hoặc tên sản phẩm..."
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        fontSize: "14px",
                        padding: "4px 8px !important",
                        height: "38px",
                        backgroundColor: "#ffffff",
                        borderRadius: "6px",
                      },
                      "& .MuiOutlinedInput-notchedOutline": {
                        borderColor: "#cbd5e1",
                      },
                    }}
                  />
                )}
                value={selectedCode}
                onChange={(_event: any, newValue: any) => onSelectCode(newValue)}
              />
            ) : (
              <Autocomplete
                size="small"
                disablePortal
                options={materialList}
                filterOptions={filterOptions1}
                isOptionEqualToValue={(option: any, value: any) =>
                  option?.M_CODE === value?.M_CODE
                }
                getOptionLabel={(option: any) =>
                  option ? `${option.M_NAME || ""}|${option.WIDTH_CD || 0}|${option.M_CODE}` : ""
                }
                renderInput={(params: any) => (
                  <TextField
                    {...params}
                    placeholder="Chọn nguyên vật liệu..."
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        fontSize: "14px",
                        padding: "4px 8px !important",
                        height: "38px",
                        backgroundColor: "#ffffff",
                        borderRadius: "6px",
                      },
                      "& .MuiOutlinedInput-notchedOutline": {
                        borderColor: "#cbd5e1",
                      },
                    }}
                  />
                )}
                value={selectedMaterial}
                onChange={(_event: any, newValue: any) => onSelectMaterial(newValue)}
              />
            )}
          </div>

          {/* 3. Dropdown Hạng Mục Test */}
          <div className="drawer-field">
            <label className="drawer-label">Hạng Mục Test (Reliability Item)</label>
            <select
              className="drawer-input"
              value={testname}
              onChange={(e) => onChangeTestName(e.target.value)}
            >
              {testList.map((ele: TestListTable, index: number) => (
                <option key={index} value={ele.TEST_CODE}>
                  {ele.TEST_NAME}
                </option>
              ))}
            </select>
          </div>

          {/* 4. Cụm 3 nút hành động chính */}
          <div className="drawer-action-grid">
            <button
              type="button"
              className="drawer-action-btn drawer-action-btn--load"
              onClick={() => { onLoadSpec(); onClose(); }}
            >
              LOAD SPEC
            </button>
            <button
              type="button"
              className="drawer-action-btn drawer-action-btn--add"
              onClick={() => { onAddSpec(); onClose(); }}
            >
              ADD SPEC
            </button>
            <button
              type="button"
              className="drawer-action-btn drawer-action-btn--update"
              onClick={() => { onUpdateSpec(); onClose(); }}
            >
              UPDATE SPEC
            </button>
          </div>

          {/* 5. Cụm Copy XRF (nếu có) */}
          {showCopyXRF && (
            <div className="drawer-xrf-grid">
              <button
                type="button"
                className="drawer-xrf-btn drawer-xrf-btn--ss"
                onClick={() => { onCopyXRFSS(); onClose(); }}
              >
                Copy XRF SS
              </button>
              <button
                type="button"
                className="drawer-xrf-btn drawer-xrf-btn--sdi"
                onClick={() => { onCopyXRFSDI(); onClose(); }}
              >
                Copy XRF SDI
              </button>
            </div>
          )}

          {/* 6. Mini Matrix Trạng Thái */}
          <div className="drawer-matrix-section">
            <div className="drawer-matrix-header">
              <span>Ma Trận Hạng Mục</span>
              <span className="drawer-matrix-badge">
                {yesCount}/{addedSpec.length}
              </span>
            </div>
            <div className="drawer-matrix-grid">
              {addedSpec.length > 0 ? (
                addedSpec.map((element, index) => {
                  const isYes = Boolean(element.CHECKADDED);
                  return (
                    <div
                      key={index}
                      className={`drawer-matrix-item ${isYes ? "drawer-matrix-item--yes" : ""}`}
                    >
                      <span className="drawer-matrix-label">{element.TEST_NAME}</span>
                      <span className={`drawer-matrix-status ${isYes ? "yes" : "no"}`}>
                        {isYes ? "YES" : "NO"}
                      </span>
                    </div>
                  );
                })
              ) : (
                <div className="drawer-matrix-empty">
                  Nhấn "Load Spec" để kiểm tra
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="drawer-footer">
          <button
            type="button"
            className="btn-drawer-reset"
            onClick={onClose}
          >
            <FiRotateCcw size={14} />
            <span>Đóng</span>
          </button>
          <button
            type="button"
            className="btn-drawer-apply"
            onClick={() => { onLoadSpec(); onClose(); }}
          >
            <span>📥</span>
            <span>LOAD & Đóng</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default React.memo(PrecisionADDSPECDTCMobileConfigDrawer);
