import React, { memo } from "react";
import { CODEDATA, GIANVL } from "../../interfaces/kdInterface";

interface Props {
  gianvl: GIANVL;
  selectedCode: CODEDATA;
  onSetCodeInfo: (keyname: string, value: number) => void;
  custNhanCong: string;
  onChangeCustNhanCong: (val: string) => void;
  custVanChuyen: string;
  onChangeCustVanChuyen: (val: string) => void;
  custKhauHao: string;
  onChangeCustKhauHao: (val: string) => void;
  custQuanLyChung: string;
  onChangeCustQuanLyChung: (val: string) => void;
}

const PrecisionCostSheet: React.FC<Props> = ({
  gianvl,
  selectedCode,
  onSetCodeInfo,
  custNhanCong,
  onChangeCustNhanCong,
  custVanChuyen,
  onChangeCustVanChuyen,
  custKhauHao,
  onChangeCustKhauHao,
  custQuanLyChung,
  onChangeCustQuanLyChung,
}) => {
  return (
    <div className="stitch-calc__cost-sheet">
      {/* Header bar màu xanh ngọc chuẩn Stitch */}
      <div className="stitch-calc__header-bar">
        <span className="title">CƠ CẤU CHI PHÍ &amp; TÙY BIẾN</span>
        <span style={{ fontSize: 10, background: "#047857", padding: "1px 6px", borderRadius: 3 }}>
          BOM Calculation
        </span>
      </div>

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th style={{ textAlign: "left" }}>HẠNG MỤC</th>
              <th style={{ textAlign: "right", width: 85 }}>GIÁ TRỊ</th>
              <th style={{ textAlign: "right", width: 85 }}>TÙY BIẾN</th>
              <th style={{ textAlign: "center", width: 45 }}>UNIT</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="item-name">Khổ liệu sử dụng</td>
              <td className="item-val">
                <input
                  type="text"
                  readOnly
                  value={gianvl.mCutWidth?.toLocaleString("en-US", { maximumFractionDigits: 2 })}
                />
              </td>
              <td>
                <input
                  type="number"
                  value={selectedCode.WIDTH_OFFSET === null ? 0 : selectedCode.WIDTH_OFFSET}
                  onChange={(e) => onSetCodeInfo("WIDTH_OFFSET", Number(e.target.value))}
                />
              </td>
              <td className="item-unit">mm</td>
            </tr>

            <tr>
              <td className="item-name">Chiều dài liệu cần</td>
              <td className="item-val">
                <input
                  type="text"
                  readOnly
                  value={gianvl.mLength?.toLocaleString("en-US", { maximumFractionDigits: 2 })}
                />
              </td>
              <td style={{ background: "#f8fafc" }}></td>
              <td className="item-unit">mm</td>
            </tr>

            <tr>
              <td className="item-name">Diện tích liệu cần</td>
              <td className="item-val">
                <input
                  type="text"
                  readOnly
                  value={(gianvl.mArea * 1000000)?.toLocaleString("en-US", { maximumFractionDigits: 2 })}
                />
              </td>
              <td style={{ background: "#f8fafc" }}></td>
              <td className="item-unit">mm2</td>
            </tr>

            <tr style={{ background: "rgba(239, 246, 255, 0.4)" }}>
              <td className="item-name" style={{ color: "#1e40af", fontWeight: 700 }}>
                Tiền VL Nội Bộ
              </td>
              <td className="item-val">
                <input
                  type="text"
                  readOnly
                  style={{ color: "#1d4ed8", fontWeight: 800 }}
                  value={gianvl.giaVLCMS?.toLocaleString("en-US", { maximumFractionDigits: 2 })}
                />
              </td>
              <td style={{ background: "#f8fafc" }}></td>
              <td className="item-unit">VND</td>
            </tr>

            <tr>
              <td className="item-name">Tiền VL Open</td>
              <td className="item-val">
                <input
                  type="text"
                  readOnly
                  value={gianvl.giaVLSS?.toLocaleString("en-US", { maximumFractionDigits: 2 })}
                />
              </td>
              <td style={{ background: "#f8fafc" }}></td>
              <td className="item-unit">VND</td>
            </tr>

            <tr>
              <td className="item-name">Tiền Dao</td>
              <td className="item-val">
                <input
                  type="text"
                  readOnly
                  value={gianvl.knife_cost?.toLocaleString("en-US", { maximumFractionDigits: 2 })}
                />
              </td>
              <td style={{ background: "#f8fafc" }}></td>
              <td className="item-unit">VND</td>
            </tr>

            <tr>
              <td className="item-name">Tiền film bản</td>
              <td className="item-val">
                <input
                  type="text"
                  readOnly
                  value={gianvl.film_cost?.toLocaleString("en-US", { maximumFractionDigits: 2 })}
                />
              </td>
              <td style={{ background: "#f8fafc" }}></td>
              <td className="item-unit">VND</td>
            </tr>

            <tr>
              <td className="item-name">Tiền mực</td>
              <td className="item-val">
                <input
                  type="text"
                  readOnly
                  value={gianvl.ink_cost?.toLocaleString("en-US", { maximumFractionDigits: 2 })}
                />
              </td>
              <td style={{ background: "#f8fafc" }}></td>
              <td className="item-unit">VND</td>
            </tr>

            <tr>
              <td className="item-name">Tiền nhân công</td>
              <td className="item-val">
                <input
                  type="text"
                  readOnly
                  value={gianvl.labor_cost?.toLocaleString("en-US", { maximumFractionDigits: 2 })}
                />
              </td>
              <td>
                <input
                  type="text"
                  value={custNhanCong}
                  onChange={(e) => {
                    onChangeCustNhanCong(e.target.value);
                    const area = gianvl.mArea > 0 ? gianvl.mArea : 1;
                    onSetCodeInfo("LABOR_UNIT", (Number(e.target.value) / area) * 1.0);
                  }}
                />
              </td>
              <td className="item-unit">VND</td>
            </tr>

            <tr>
              <td className="item-name">Phí vận chuyển</td>
              <td className="item-val">
                <input
                  type="text"
                  readOnly
                  value={gianvl.delivery_cost?.toLocaleString("en-US", { maximumFractionDigits: 2 })}
                />
              </td>
              <td>
                <input
                  type="text"
                  value={custVanChuyen}
                  onChange={(e) => {
                    onChangeCustVanChuyen(e.target.value);
                    onSetCodeInfo("DELIVERY_UNIT", Number(e.target.value));
                  }}
                />
              </td>
              <td className="item-unit">VND</td>
            </tr>

            <tr>
              <td className="item-name">Khấu hao máy</td>
              <td className="item-val">
                <input
                  type="text"
                  readOnly
                  value={gianvl.deprecation_cost?.toLocaleString("en-US", { maximumFractionDigits: 2 })}
                />
              </td>
              <td>
                <input
                  type="text"
                  value={custKhauHao}
                  onChange={(e) => {
                    onChangeCustKhauHao(e.target.value);
                    const area = gianvl.mArea > 0 ? gianvl.mArea : 1;
                    onSetCodeInfo("DEPRECATION_UNIT", (Number(e.target.value) / area) * 1.0);
                  }}
                />
              </td>
              <td className="item-unit">VND</td>
            </tr>

            <tr>
              <td className="item-name">Phí quản lý chung</td>
              <td className="item-val">
                <input
                  type="text"
                  readOnly
                  value={gianvl.gmanagement_cost?.toLocaleString("en-US", { maximumFractionDigits: 2 })}
                />
              </td>
              <td>
                <input
                  type="text"
                  value={custQuanLyChung}
                  onChange={(e) => {
                    onChangeCustQuanLyChung(e.target.value);
                    const area = gianvl.mArea > 0 ? gianvl.mArea : 1;
                    onSetCodeInfo("GMANAGEMENT_UNIT", (Number(e.target.value) / area) * 1.0);
                  }}
                />
              </td>
              <td className="item-unit">VND</td>
            </tr>

            {/* Hàng tổng chi phí */}
            <tr style={{ background: "#fffbeb" }}>
              <td className="item-name total-row" style={{ color: "#78350f" }}>
                Tổng chi phí Nội Bộ
              </td>
              <td className="item-val total-row">
                <input
                  type="text"
                  readOnly
                  style={{ color: "#78350f", background: "#fef3c7", borderColor: "#fde68a" }}
                  value={gianvl.totalcostCMS?.toLocaleString("en-US", { maximumFractionDigits: 0 })}
                />
              </td>
              <td style={{ background: "#fffbeb" }}></td>
              <td className="item-unit total-row" style={{ color: "#78350f" }}>VND</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default memo(PrecisionCostSheet);
