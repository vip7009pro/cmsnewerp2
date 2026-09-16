import React from "react";
import ImageSearchIcon from "@mui/icons-material/ImageSearch";
import { QTR_DATA } from "../QTR_DATA";
import { PrecisionVOCHistoryCard } from "./PrecisionVOCHistoryCard";

interface Props {
  data: QTR_DATA[];
  isLoading: boolean;
  appliedSearchValue: string;
}

export const PrecisionVOCHistoryGrid: React.FC<Props> = ({
  data,
  isLoading,
  appliedSearchValue,
}) => {
  if (isLoading && data.length === 0) {
    return (
      <div className="pvoc-content">
        <div className="pvoc-empty">
          <ImageSearchIcon className="pvoc-empty__icon animate-pulse text-blue-500" />
          <div className="pvoc-empty__title">Đang tải danh mục khiếu nại VOC...</div>
          <div className="pvoc-empty__subtitle">Hệ thống đang đồng bộ hình ảnh và dữ liệu từ máy chủ CMS</div>
        </div>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="pvoc-content">
        <div className="pvoc-empty">
          <ImageSearchIcon className="pvoc-empty__icon text-slate-400" />
          <div className="pvoc-empty__title">Không tìm thấy hồ sơ VOC phù hợp</div>
          <div className="pvoc-empty__subtitle">
            {appliedSearchValue
              ? `Không có lỗi nào liên quan tới từ khóa hoặc mã: "${appliedSearchValue}".`
              : "Hiện không có dữ liệu khiếu nại VOC trong hệ thống."}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pvoc-content">
      <div className="pvoc-grid">
        {data.map((item) => (
          <PrecisionVOCHistoryCard
            key={`${item.MANAGEMENT_NUMBER}_${item.REGISTERED_DATE}_${item.G_CODE}`}
            item={item}
          />
        ))}
      </div>
    </div>
  );
};
