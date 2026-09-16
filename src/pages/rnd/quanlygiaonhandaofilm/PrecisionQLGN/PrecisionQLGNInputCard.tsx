import React from "react";
import { Autocomplete, TextField, createFilterOptions } from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import BusinessIcon from "@mui/icons-material/Business";
import QrCodeIcon from "@mui/icons-material/QrCode";
import { CodeListData, CustomerListData } from "../../../kinhdoanh/interfaces/kdInterface";
import { HANDOVER_DATA } from "../../interfaces/rndInterface";

const filterOptions1 = createFilterOptions({
  matchFrom: "any",
  limit: 100,
});

interface PrecisionQLGNInputCardProps {
  customerList: CustomerListData[];
  selectedCust_CD: CustomerListData | null;
  setSelectedCust_CD: (c: CustomerListData | null) => void;
  codeList: CodeListData[];
  selectedCode: CodeListData | null;
  setSelectedCode: (c: CodeListData | null) => void;
  selectedRows: HANDOVER_DATA;
  setBarCodeInfo: (key: string, val: any) => void;
  fromdate: string;
  setFromDate: (d: string) => void;
  plph: string;
  setPLPH: (v: string) => void;
  pltl: string;
  setPLTL: (v: string) => void;
  ldph: string;
  setLDPH: (v: string) => void;
  rndEmpl: string;
  setRNDEMPL: (v: string) => void;
  qcEmpl: string;
  setQCEMPL: (v: string) => void;
  sxEmpl: string;
  setSXEMPL: (v: string) => void;
  daofimltotalqty: number;
  setDaoFilmTotalQty: (v: number) => void;
  pldao: string;
  setPLDao: (v: string) => void;
  plfilm: string;
  setPLFilm: (v: string) => void;
  ohpfilmqty: number;
  setOHPFilmQTy: (v: number) => void;
  madaofilm: string;
  setMaDaoFilm: (v: string) => void;
  vitritailieu: string;
  setViTriTaiLieu: (v: string) => void;
  g_width: number;
  setG_Width: (v: number) => void;
  g_length: number;
  setG_Length: (v: number) => void;
  remark: string;
  setRemark: (v: string) => void;
  onSubmit: () => void;
  onReset: () => void;
}

export const PrecisionQLGNInputCard: React.FC<PrecisionQLGNInputCardProps> = ({
  customerList,
  selectedCust_CD,
  setSelectedCust_CD,
  codeList,
  selectedCode,
  setSelectedCode,
  selectedRows,
  setBarCodeInfo,
  fromdate,
  setFromDate,
  plph,
  setPLPH,
  pltl,
  setPLTL,
  ldph,
  setLDPH,
  rndEmpl,
  setRNDEMPL,
  qcEmpl,
  setQCEMPL,
  sxEmpl,
  setSXEMPL,
  daofimltotalqty,
  setDaoFilmTotalQty,
  pldao,
  setPLDao,
  plfilm,
  setPLFilm,
  ohpfilmqty,
  setOHPFilmQTy,
  madaofilm,
  setMaDaoFilm,
  vitritailieu,
  setViTriTaiLieu,
  g_width,
  setG_Width,
  g_length,
  setG_Length,
  remark,
  setRemark,
  onSubmit,
  onReset,
}) => {
  return (
    <div className="precision-qlgn-sidebar">
      <div className="sidebar-header">
        <div className="title">
          <QrCodeIcon fontSize="small" style={{ color: "#2563eb" }} />
          <span>THÔNG TIN BÀN GIAO</span>
        </div>
        <span className="badge-type">{plph === "PH" ? "PHÁT HÀNH" : "THU HỒI"}</span>
      </div>

      <div className="sidebar-body">
        {/* Section: Khách Hàng & Sản Phẩm */}
        <div className="form-section">
          <span className="section-label">
            <BusinessIcon style={{ fontSize: "0.8rem" }} /> Khách hàng & Sản phẩm
          </span>
          <div className="form-control-group">
            <Autocomplete
              size="small"
              options={customerList}
              filterOptions={filterOptions1}
              isOptionEqualToValue={(option: any, value: any) => option.CUST_CD === value.CUST_CD}
              getOptionLabel={(option: any) => `${option.CUST_CD}: ${option.CUST_NAME_KD}`}
              renderInput={(params) => <TextField {...params} placeholder="Chọn khách hàng" size="small" />}
              value={selectedCust_CD}
              onChange={(_, val) => setSelectedCust_CD(val)}
              sx={{ "& .MuiInputBase-root": { fontSize: "0.75rem", height: "28px" } }}
            />
          </div>
          <div className="form-control-group" style={{ marginTop: 4 }}>
            <Autocomplete
              size="small"
              options={codeList}
              filterOptions={filterOptions1}
              getOptionLabel={(option: any) => `${option.G_CODE}: ${option.G_NAME}`}
              renderInput={(params) => <TextField {...params} placeholder="Chọn mã sản phẩm" size="small" />}
              value={codeList.find((e) => e.G_CODE === selectedRows.G_CODE) || selectedCode}
              onChange={(_, val) => {
                setSelectedCode(val);
                if (val?.G_CODE) setBarCodeInfo("G_CODE", val.G_CODE);
              }}
              isOptionEqualToValue={(option: any, value: any) => option.G_CODE === value.G_CODE}
              sx={{ "& .MuiInputBase-root": { fontSize: "0.75rem", height: "28px" } }}
            />
          </div>
        </div>

        {/* Section: Phân Loại Bàn Giao */}
        <div className="form-section">
          <span className="section-label">Phân loại & Thời gian</span>
          <div className="input-row two-col">
            <div className="form-control-group">
              <label>Ngày bàn giao</label>
              <input type="date" value={fromdate.slice(0, 10)} onChange={(e) => setFromDate(e.target.value)} />
            </div>
            <div className="form-control-group">
              <label>PL Phát hành</label>
              <select value={plph} onChange={(e) => setPLPH(e.target.value)}>
                <option value="PH">PHÁT HÀNH</option>
                <option value="TH">THU HỒI</option>
              </select>
            </div>
          </div>
          <div className="input-row two-col" style={{ marginTop: 4 }}>
            <div className="form-control-group">
              <label>PL Tài liệu</label>
              <select value={pltl} onChange={(e) => setPLTL(e.target.value)}>
                <option value="D">DAO</option>
                <option value="F">FILM</option>
                <option value="T">TÀI LIỆU</option>
                <option value="M">MẮT DAO</option>
              </select>
            </div>
            <div className="form-control-group">
              <label>Lý do bàn giao</label>
              <select value={ldph} onChange={(e) => setLDPH(e.target.value)}>
                <option value="New Code">New Code</option>
                <option value="ECN">ECN</option>
                <option value="Update">Update</option>
                <option value="Amendment">Amendment</option>
              </select>
            </div>
          </div>
        </div>

        {/* Section: Nhân Sự 3 Bên */}
        <div className="form-section">
          <span className="section-label">Nhân sự liên quan (Bắt buộc ≥7 số)</span>
          <div className="input-row three-col">
            <div className="form-control-group">
              <label>NV R&D *</label>
              <input className="font-mono" placeholder="Mã R&D" value={rndEmpl} onChange={(e) => setRNDEMPL(e.target.value)} />
            </div>
            <div className="form-control-group">
              <label>NV QC *</label>
              <input className="font-mono" placeholder="Mã QC" value={qcEmpl} onChange={(e) => setQCEMPL(e.target.value)} />
            </div>
            <div className="form-control-group">
              <label>NV SX</label>
              <input className="font-mono" placeholder="Mã SX" value={sxEmpl} onChange={(e) => setSXEMPL(e.target.value)} />
            </div>
          </div>
        </div>

        {/* Section: Số Lượng & Đặc Tả */}
        <div className="form-section">
          <span className="section-label">Thông số kỹ thuật</span>
          <div className="input-row two-col">
            <div className="form-control-group">
              <label>Số lượng Dao/Film/TL *</label>
              <input
                type="number"
                min={0}
                className="font-mono"
                value={daofimltotalqty || ""}
                onChange={(e) => setDaoFilmTotalQty(Number(e.target.value))}
                placeholder="Số lượng"
              />
            </div>
            {(pltl === "D" || pltl === "M") && (
              <div className="form-control-group">
                <label>Phân loại Dao</label>
                <select value={pldao} onChange={(e) => setPLDao(e.target.value)}>
                  <option value="PVC">PVC</option>
                  <option value="PINACLE">PINACLE</option>
                </select>
              </div>
            )}
            {pltl === "F" && (
              <div className="form-control-group">
                <label>Phân loại Film</label>
                <select value={plfilm} onChange={(e) => setPLFilm(e.target.value)}>
                  <option value="CTF">CTF</option>
                  <option value="CTP">CTP</option>
                </select>
              </div>
            )}
          </div>

          {pltl === "F" && (
            <div className="form-control-group" style={{ marginTop: 4 }}>
              <label>OHP Film Qty</label>
              <input
                type="number"
                min={0}
                className="font-mono"
                value={ohpfilmqty || ""}
                onChange={(e) => setOHPFilmQTy(Number(e.target.value))}
                placeholder="Số lượng OHP Film"
              />
            </div>
          )}

          {(pltl === "D" || pltl === "F") && (
            <div className="form-control-group" style={{ marginTop: 4 }}>
              <label>Mã Dao / Mã Film</label>
              <input placeholder="Nhập mã dao film..." value={madaofilm} onChange={(e) => setMaDaoFilm(e.target.value)} />
            </div>
          )}

          {pltl === "T" && (
            <div className="form-control-group" style={{ marginTop: 4 }}>
              <label>Vị trí tài liệu</label>
              <input placeholder="Vị trí lưu trữ tài liệu..." value={vitritailieu} onChange={(e) => setViTriTaiLieu(e.target.value)} />
            </div>
          )}

          {pltl !== "T" && (
            <div className="input-row two-col" style={{ marginTop: 4 }}>
              <div className="form-control-group">
                <label>Rộng (mm)</label>
                <input type="number" className="font-mono" value={g_width || ""} onChange={(e) => setG_Width(Number(e.target.value))} placeholder="Width" />
              </div>
              <div className="form-control-group">
                <label>Dài (mm)</label>
                <input type="number" className="font-mono" value={g_length || ""} onChange={(e) => setG_Length(Number(e.target.value))} placeholder="Length" />
              </div>
            </div>
          )}

          <div className="form-control-group" style={{ marginTop: 4 }}>
            <label>Ghi chú (Remark)</label>
            <input placeholder="Ghi chú thêm..." value={remark} onChange={(e) => setRemark(e.target.value)} />
          </div>
        </div>
      </div>

      <div className="sidebar-footer">
        <button className="btn-submit" onClick={onSubmit} title="Lưu thông tin giao nhận">
          <SaveIcon fontSize="small" />
          <span>Lưu Bàn Giao</span>
        </button>
        <button className="btn-reset" onClick={onReset} title="Xóa dữ liệu đang nhập">
          <RestartAltIcon fontSize="small" />
        </button>
      </div>
    </div>
  );
};

export default React.memo(PrecisionQLGNInputCard);
