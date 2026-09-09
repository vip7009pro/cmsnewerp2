import React from 'react';

const PrecisionDiemDanhHeader: React.FC = () => {
  return (
    <div className="precision-diemdanh__subHeader">
      <div className="precision-diemdanh__titleBlock">
        <div className="precision-diemdanh__iconBadge">
          <span className="material-symbols-outlined" style={{ fontSize: 20 }}>
            how_to_reg
          </span>
        </div>
        <div className="precision-diemdanh__titleWrap">
          <div className="precision-diemdanh__titleRow">
            <span>01. NHÂN SỰ &amp; HÀNH CHÍNH</span>
            <span className="sep">•</span>
            <span className="subcode">NS1 - Điểm danh quân số ca làm việc</span>
          </div>
          <p className="precision-diemdanh__subtitle">
            Điểm danh trực tiếp tại tổ theo thời gian thực, quản lý ca kíp, vắng mặt có phép và tính công OT
          </p>
        </div>
      </div>

      <div className="precision-diemdanh__syncPill" title="Dữ liệu máy quét thẻ và bảng chấm công được đồng bộ trực tiếp">
        <span className="dot" />
        <span>Đồng bộ dữ liệu chấm công: Bình thường</span>
      </div>
    </div>
  );
};

export default React.memo(PrecisionDiemDanhHeader);
