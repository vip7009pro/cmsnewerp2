import React from "react";
import {
  FiFileText,
  FiCalendar,
  FiImage,
  FiBookmark,
  FiAward,
  FiUserCheck,
} from "react-icons/fi";

interface KpiProps {
  total: number;
  thisMonthCount: number;
  mediaCount: number;
  mediaRate: string;
  pinnedCount: number;
  last7DaysCount: number;
  topDeptName: string;
  topDeptCount: number;
  topAuthorName: string;
  topAuthorCount: number;
}

const PrecisionAddInfoKpi: React.FC<{ data: KpiProps }> = ({ data }) => {
  return (
    <div className="precision-addinfo__kpiGrid">
      {/* 1. Tổng Bài Đăng */}
      <div className="kpi-card kpi-card--blue">
        <div className="kpi-card__header">
          <span className="kpi-card__title">Tổng Bài Đăng</span>
          <span className="kpi-card__iconWrap">
            <FiFileText size={14} />
          </span>
        </div>
        <div className="kpi-card__value">{data.total.toLocaleString()}</div>
        <div className="kpi-card__meta">
          <span>7 ngày qua: {data.last7DaysCount} tin</span>
          <span className="kpi-card__pill">Toàn hệ thống</span>
        </div>
      </div>

      {/* 2. Tin Tháng Này */}
      <div className="kpi-card kpi-card--green">
        <div className="kpi-card__header">
          <span className="kpi-card__title">Phát Hành Tháng Này</span>
          <span className="kpi-card__iconWrap">
            <FiCalendar size={14} />
          </span>
        </div>
        <div className="kpi-card__value">{data.thisMonthCount.toLocaleString()}</div>
        <div className="kpi-card__meta">
          <span>Tỷ trọng tháng: {data.total > 0 ? ((data.thisMonthCount / data.total) * 100).toFixed(0) : 0}%</span>
          <span className="kpi-card__pill">Mới nhất</span>
        </div>
      </div>

      {/* 3. Tin Kèm Ảnh Đa Phương Tiện */}
      <div className="kpi-card kpi-card--purple">
        <div className="kpi-card__header">
          <span className="kpi-card__title">Đa Phương Tiện (Ảnh)</span>
          <span className="kpi-card__iconWrap">
            <FiImage size={14} />
          </span>
        </div>
        <div className="kpi-card__value">{data.mediaCount.toLocaleString()}</div>
        <div className="kpi-card__meta">
          <span>Tỷ lệ có hình ảnh</span>
          <span className="kpi-card__pill">{data.mediaRate}%</span>
        </div>
      </div>

      {/* 4. Tin Ghim Nổi Bật */}
      <div className="kpi-card kpi-card--amber">
        <div className="kpi-card__header">
          <span className="kpi-card__title">Tin Ghim Nổi Bật</span>
          <span className="kpi-card__iconWrap">
            <FiBookmark size={14} />
          </span>
        </div>
        <div className="kpi-card__value">{data.pinnedCount.toLocaleString()}</div>
        <div className="kpi-card__meta">
          <span>Thông cáo ưu tiên cao</span>
          <span className="kpi-card__pill">Sticky Pin</span>
        </div>
      </div>

      {/* 5. Bộ Phận Tích Cực Nhất */}
      <div className="kpi-card kpi-card--indigo">
        <div className="kpi-card__header">
          <span className="kpi-card__title">Phòng Ban Năng Động</span>
          <span className="kpi-card__iconWrap">
            <FiAward size={14} />
          </span>
        </div>
        <div className="kpi-card__value" style={{ fontSize: "15px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }} title={data.topDeptName}>
          {data.topDeptName}
        </div>
        <div className="kpi-card__meta">
          <span>Số bài đã đóng góp</span>
          <span className="kpi-card__pill">{data.topDeptCount} bài</span>
        </div>
      </div>

      {/* 6. Tác Giả Đóng Góp Hàng Đầu */}
      <div className="kpi-card kpi-card--rose">
        <div className="kpi-card__header">
          <span className="kpi-card__title">Tác Giả Hàng Đầu</span>
          <span className="kpi-card__iconWrap">
            <FiUserCheck size={14} />
          </span>
        </div>
        <div className="kpi-card__value" style={{ fontSize: "15px" }}>
          {data.topAuthorName}
        </div>
        <div className="kpi-card__meta">
          <span>Đóng góp nội dung</span>
          <span className="kpi-card__pill">{data.topAuthorCount} bài</span>
        </div>
      </div>
    </div>
  );
};

export default React.memo(PrecisionAddInfoKpi);
