import React from "react";

export const PrecisionPheDuyetHeader: React.FC = () => {
  return (
    <div className="precision-pheduyet__header">
      <div className="header-left">
        <div className="icon-box">
          <span className="material-symbols-outlined">fact_check</span>
        </div>
        <div className="title-info">
          <span className="breadcrumb">01. Nhân sự &amp; Hành chính • NS2 - Phê duyệt nghỉ phép</span>
          <div className="title-row">
            <h1 className="title">Trung tâm Phê duyệt Nghỉ phép &amp; Quản lý Phép ca kíp</h1>
            <span className="sync-pill sync-pill--green">
              <span className="dot"></span>
              <span>SOCKET REALTIME SYNC</span>
            </span>
            <span className="sync-pill sync-pill--blue">
              <span>MES &amp; HRM SYNC ACTIVE</span>
            </span>
          </div>
        </div>
      </div>

      <div className="header-right">
        <span className="helper-caption">
          "Xét duyệt các đơn xin nghỉ phép năm, nghỉ ốm BHXH, việc riêng và chế độ thai sản của công nhân viên."
        </span>
      </div>
    </div>
  );
};

export default React.memo(PrecisionPheDuyetHeader);
