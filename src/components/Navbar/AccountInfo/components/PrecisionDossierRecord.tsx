import React, { useState } from "react";
import moment from "moment";
import { useSelector } from "react-redux";
import { RootState } from "../../../../redux/store";
import { UserData } from "../../../../api/GlobalInterface";
import getsentence from "../../../String/String";

interface PrecisionDossierRecordProps {
  userData?: UserData;
}

export default function PrecisionDossierRecord({ userData }: PrecisionDossierRecordProps) {
  const [showDocPreview, setShowDocPreview] = useState(false);
  const lang: string | undefined = useSelector(
    (state: RootState) => state.totalSlice.lang
  );

  const fullName =
    [userData?.MIDLAST_NAME, userData?.FIRST_NAME].filter(Boolean).join(" ") ||
    userData?.EMPL_NO ||
    "---";

  const getAgeString = () => {
    if (!userData?.DOB) return "---";
    const dobMoment = moment(userData.DOB);
    if (!dobMoment.isValid()) return userData.DOB;
    const age = moment().diff(dobMoment, "years");
    return `${dobMoment.format("DD/MM/YYYY")} (${age} tuổi)`;
  };

  const getStartDateString = () => {
    if (!userData?.WORK_START_DATE) return "---";
    const startMoment = moment(userData.WORK_START_DATE);
    if (!startMoment.isValid()) return userData.WORK_START_DATE;
    const now = moment();
    const years = now.diff(startMoment, "years");
    startMoment.add(years, "years");
    const months = now.diff(startMoment, "months");
    const tenure = years > 0 ? `${years} năm ${months} tháng` : `${months} tháng`;
    return `${moment(userData.WORK_START_DATE).format("DD/MM/YYYY")} (Thâm niên ${tenure})`;
  };

  const address =
    [
      userData?.ADD_VILLAGE,
      userData?.ADD_COMMUNE,
      userData?.ADD_DISTRICT,
      userData?.ADD_PROVINCE,
    ]
      .filter(Boolean)
      .join(", ") || "---";

  return (
    <div className="precision-hub__card">
      <div className="precision-hub__cardHeader" style={{ marginBottom: 16 }}>
        <div className="precision-hub__cardHeaderLeft">
          <div className="precision-hub__headerIconWrap">
            <span className="material-symbols-outlined" style={{ fontSize: 18 }}>
              contact_page
            </span>
          </div>
          <div>
            <h2 className="precision-hub__cardTitle">
              {getsentence(18, lang ?? "en")} (Sơ Yếu Lý Lịch Điện Tử)
            </h2>
            <p className="precision-hub__cardSubtitle">
              Dữ liệu định danh, thâm niên và thông tin quản lý nội bộ hệ thống ERP
            </p>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <button
            type="button"
            className="precision-hub__btnAction"
            onClick={() => setShowDocPreview(!showDocPreview)}
            title="Xem bản chụp hồ sơ gốc"
          >
            <span className="material-symbols-outlined" style={{ fontSize: 15, color: "#2563eb" }}>
              visibility
            </span>
            <span>{showDocPreview ? "Ẩn hồ sơ gốc" : "Xem hồ sơ gốc"}</span>
          </button>

          <button
            type="button"
            className="precision-hub__btnAction"
            onClick={() => window.print()}
            title="In trích lục sơ yếu lý lịch"
          >
            <span className="material-symbols-outlined" style={{ fontSize: 15 }}>
              print
            </span>
            <span>In trích lục</span>
          </button>
        </div>
      </div>

      {/* Collapsible Document Snapshot Box */}
      {showDocPreview && (
        <div
          style={{
            background: "#f1f5f9",
            border: "1px solid #cbd5e1",
            borderRadius: 8,
            padding: 12,
            marginBottom: 16,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              paddingBottom: 8,
              borderBottom: "1px solid #e2e8f0",
              fontSize: 12,
              fontWeight: 700,
              color: "#334155",
            }}
          >
            <span>BẢN SAO LƯU TRỮ HỒ SƠ GỐC CMS-ERP (DOCUMENT ARCHIVE VIEW)</span>
            <button
              type="button"
              onClick={() => setShowDocPreview(false)}
              style={{
                background: "transparent",
                border: "none",
                cursor: "pointer",
                color: "#64748b",
              }}
            >
              <span className="material-symbols-outlined" style={{ fontSize: 18 }}>
                close
              </span>
            </button>
          </div>
          <div
            style={{
              padding: 12,
              display: "flex",
              justifyContent: "center",
              background: "#ffffff",
              borderRadius: 6,
              marginTop: 8,
            }}
          >
            {userData?.EMPL_IMAGE === "Y" ? (
              <img
                src={`/Picture_NS/NS_${userData?.EMPL_NO}.jpg`}
                alt="Bản chụp gốc hồ sơ nhân sự"
                style={{ maxHeight: 280, maxWidth: "100%", objectFit: "contain", borderRadius: 4 }}
              />
            ) : (
              <div style={{ padding: 24, color: "#64748b", fontSize: 12 }}>
                Chưa có bản quét hình ảnh hồ sơ gốc. Vui lòng liên hệ Phòng Hành chính - Nhân sự.
              </div>
            )}
          </div>
        </div>
      )}

      {/* 2-Column Key-Value Ledger */}
      <div className="precision-hub__dossierGrid">
        {/* Left Column */}
        <div className="precision-hub__dossierCol">
          <div className="precision-hub__dossierRow">
            <span className="precision-hub__dossierKey">Họ và tên:</span>
            <span className="precision-hub__dossierVal precision-hub__dossierVal--strong">
              {fullName}
            </span>
          </div>

          <div className="precision-hub__dossierRow">
            <span className="precision-hub__dossierKey">{getsentence(22, lang ?? "en")}:</span>
            <span className="precision-hub__dossierVal">{getAgeString()}</span>
          </div>

          <div className="precision-hub__dossierRow">
            <span className="precision-hub__dossierKey">{getsentence(20, lang ?? "en")}:</span>
            <span className="precision-hub__dossierVal precision-hub__dossierVal--primary precision-hub__dossierVal--mono">
              {userData?.CMS_ID || "---"}
            </span>
          </div>

          <div className="precision-hub__dossierRow">
            <span className="precision-hub__dossierKey">{getsentence(23, lang ?? "en")}:</span>
            <span className="precision-hub__dossierVal">{userData?.HOMETOWN || "---"}</span>
          </div>

          <div className="precision-hub__dossierRow">
            <span className="precision-hub__dossierKey">{getsentence(24, lang ?? "en")}:</span>
            <span className="precision-hub__dossierVal">{address}</span>
          </div>

          <div className="precision-hub__dossierRow">
            <span className="precision-hub__dossierKey">Nhà máy / Chi nhánh:</span>
            <span className="precision-hub__dossierVal">
              {userData?.FACTORY_NAME || "Nhà máy chính CMS VINA"}
            </span>
          </div>
        </div>

        {/* Right Column */}
        <div className="precision-hub__dossierCol">
          <div className="precision-hub__dossierRow">
            <span className="precision-hub__dossierKey">{getsentence(21, lang ?? "en")}:</span>
            <span className="precision-hub__dossierVal precision-hub__dossierVal--mono">
              {userData?.EMPL_NO || "---"}
            </span>
          </div>

          <div className="precision-hub__dossierRow">
            <span className="precision-hub__dossierKey">Ngày vào công ty:</span>
            <span className="precision-hub__dossierVal precision-hub__dossierVal--primary">
              {getStartDateString()}
            </span>
          </div>

          <div className="precision-hub__dossierRow">
            <span className="precision-hub__dossierKey">{getsentence(27, lang ?? "en")}:</span>
            <span className="precision-hub__dossierVal">
              {userData?.WORK_POSITION_NAME || "---"}
            </span>
          </div>

          <div className="precision-hub__dossierRow">
            <span className="precision-hub__dossierKey">{getsentence(28, lang ?? "en")}:</span>
            <span className="precision-hub__dossierVal">
              {userData?.WORK_SHIF_NAME || `Nhóm ${userData?.ATT_GROUP_CODE ?? 1} (08:00 - 17:00)`}
            </span>
          </div>

          <div className="precision-hub__dossierRow">
            <span className="precision-hub__dossierKey">{getsentence(29, lang ?? "en")}:</span>
            <span className="precision-hub__dossierVal">
              {userData?.JOB_NAME || "---"}
            </span>
          </div>

          <div className="precision-hub__dossierRow">
            <span className="precision-hub__dossierKey">Email / SĐT:</span>
            <span className="precision-hub__dossierVal precision-hub__dossierVal--primary precision-hub__dossierVal--mono">
              {userData?.EMAIL || "---"} / {userData?.PHONE_NUMBER || "---"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
