import React from "react";
import { Autocomplete, TextField } from "@mui/material";
import { CodeListData } from "../../../kinhdoanh/interfaces/kdInterface";
import { CheckAddedSPECDATA, MaterialListData, TestListTable } from "../../interfaces/qcInterface";


interface PrecisionADDSPECDTCSidebarProps {
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
  onChangeTestName: (test_name: string) => void;
  onLoadSpec: () => void;
  onAddSpec: () => void;
  onUpdateSpec: () => void;
  addedSpec: CheckAddedSPECDATA[];
  showCopyXRF: boolean;
  onCopyXRFSS: () => void;
  onCopyXRFSDI: () => void;
}

export const PrecisionADDSPECDTCSidebar: React.FC<PrecisionADDSPECDTCSidebarProps> = ({
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
  showCopyXRF,
  onCopyXRFSS,
  onCopyXRFSDI,
}) => {
  return (
    <aside className="precision-addspecdtc__sidebar">
      {/* Header Panel */}
      <div className="precision-addspecdtc__sidebarHeader">
        <div className="precision-addspecdtc__sidebarTitle">
          <span className="indicator"></span>
          <span>{checkNVL ? "CẤU HÌNH SPEC NVL" : "CẤU HÌNH SPEC ĐTC"}</span>
        </div>
        <span className="precision-addspecdtc__sidebarTag">
          {checkNVL ? "IQC DEPT" : "R&D DEPT"}
        </span>
      </div>

      {/* Body Panel */}
      <div className="precision-addspecdtc__sidebarBody">
        {/* 1. Chọn Code sản phẩm hoặc Mã NVL */}
        <div className="precision-addspecdtc__formGroup">
          <label className="precision-addspecdtc__formLabel">
            <span>{checkNVL ? "Chọn Nguyên Vật Liệu" : "Code / Liệu (Sản phẩm)"}</span>
            <span className="required">bắt buộc *</span>
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
                      fontSize: "11px",
                      padding: "2px 6px !important",
                      height: "28px",
                      backgroundColor: "#f8fafc",
                      borderRadius: "4px",
                    },
                    "& .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#cbd5e1",
                    },
                  }}
                />
              )}
              value={selectedCode}
              onChange={(_event: any, newValue: any) => {
                onSelectCode(newValue);
              }}
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
                      fontSize: "11px",
                      padding: "2px 6px !important",
                      height: "28px",
                      backgroundColor: "#f8fafc",
                      borderRadius: "4px",
                    },
                    "& .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#cbd5e1",
                    },
                  }}
                />
              )}
              value={selectedMaterial}
              onChange={(_event: any, newValue: any) => {
                onSelectMaterial(newValue);
              }}
            />
          )}
        </div>

        {/* 2. Dropdown Chọn Hạng Mục Test */}
        <div className="precision-addspecdtc__formGroup">
          <label className="precision-addspecdtc__formLabel">
            <span>Hạng Mục Test (Reliability Item)</span>
          </label>
          <select
            className="precision-addspecdtc__select"
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

        {/* 3. Cụm 3 nút hành động chính */}
        <div className="precision-addspecdtc__actionButtons">
          <button
            type="button"
            className="precision-addspecdtc__btn precision-addspecdtc__btn--load"
            onClick={onLoadSpec}
            title="Tải thông tin tiêu chuẩn của code/hạng mục đang chọn"
          >
            LOAD SPEC
          </button>
          <button
            type="button"
            className="precision-addspecdtc__btn precision-addspecdtc__btn--add"
            onClick={onAddSpec}
            title="Thêm mới các dòng tiêu chuẩn vào CSDL"
          >
            ADD SPEC
          </button>
          <button
            type="button"
            className="precision-addspecdtc__btn precision-addspecdtc__btn--update"
            onClick={onUpdateSpec}
            title="Cập nhật tiêu chuẩn cho các dòng đang chọn trên bảng"
          >
            UPDATE SPEC
          </button>
        </div>

        {/* 4. Cụm nút Copy XRF (khi công ty là CMS và test XRF) */}
        {showCopyXRF && (
          <div className="precision-addspecdtc__copyXRF">
            <button
              type="button"
              className="precision-addspecdtc__btnCopy precision-addspecdtc__btnCopy--ss"
              onClick={onCopyXRFSS}
              title="Sao chép tiêu chuẩn XRF từ Samsung"
            >
              Copy XRF Spec SS
            </button>
            <button
              type="button"
              className="precision-addspecdtc__btnCopy precision-addspecdtc__btnCopy--sdi"
              onClick={onCopyXRFSDI}
              title="Sao chép tiêu chuẩn XRF từ SDI"
            >
              Copy XRF Spec SDI
            </button>
          </div>
        )}

        {/* 5. Ma Trận Trạng Thái Hạng Mục Kiểm Tra */}
        <div className="precision-addspecdtc__matrixCard">
          <div className="precision-addspecdtc__matrixHeader">
            <span>Ma Trận Hạng Mục Kiểm Tra</span>
            <span className="badge">STATUS</span>
          </div>

          <div className="precision-addspecdtc__matrixGrid">
            {addedSpec.length > 0 ? (
              addedSpec.map((element: CheckAddedSPECDATA, index: number) => {
                const isYes = Boolean(element.CHECKADDED);
                return (
                  <div
                    key={index}
                    className={`precision-addspecdtc__matrixItem ${element.TEST_NAME.length > 14 ? "precision-addspecdtc__matrixItem--full" : ""
                      }`}
                  >
                    <span className="precision-addspecdtc__matrixLabel" title={element.TEST_NAME}>
                      {element.TEST_NAME}:
                    </span>
                    <span
                      className={`precision-addspecdtc__matrixStatus ${isYes
                          ? "precision-addspecdtc__matrixStatus--yes"
                          : "precision-addspecdtc__matrixStatus--no"
                        }`}
                    >
                      {isYes ? "YES" : "NO"}
                    </span>
                  </div>
                );
              })
            ) : (
              <div
                style={{
                  gridColumn: "span 2",
                  textAlign: "center",
                  padding: "10px 0",
                  fontSize: "11px",
                  color: "#94a3b8",
                }}
              >
                Nhấn "Load Spec" để kiểm tra trạng thái
              </div>
            )}
          </div>
        </div>

        {/* 6. Checkbox hoán đổi nguyên vật liệu / sản phẩm */}
        <label className="precision-addspecdtc__swapOption">
          <input
            type="checkbox"
            checked={checkNVL}
            onChange={onToggleCheckNVL}
          />
          <span>
            {checkNVL ? "Swap (SP):" : "Swap (NVL):"}{" "}
            <span className="hint">
              {checkNVL
                ? "Chuyển sang cấu hình Thành phẩm R&D"
                : "Hoán đổi sang kiểm tra Nguyên vật liệu IQC"}
            </span>
          </span>
        </label>
      </div>
    </aside>
  );
};
