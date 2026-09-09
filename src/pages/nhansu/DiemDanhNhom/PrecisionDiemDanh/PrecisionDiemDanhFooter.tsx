import React, { useState, useEffect } from 'react';
import moment from 'moment';

interface PrecisionDiemDanhFooterProps {
  totalCount: number;
}

const PrecisionDiemDanhFooter: React.FC<PrecisionDiemDanhFooterProps> = ({
  totalCount,
}) => {
  const [sysTime, setSysTime] = useState(moment().format('YYYY-MM-DD HH:mm:ss'));

  useEffect(() => {
    const timer = setInterval(() => {
      setSysTime(moment().format('YYYY-MM-DD HH:mm:ss'));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="precision-diemdanh__footer">
      <div className="precision-diemdanh__footerLeft">
        <span>
          Hiển thị: <strong style={{ color: '#0f172a' }}>{totalCount} nhân sự</strong> trong danh sách phân hệ NS1
        </span>
        <span className="sep" />
        <span className="socket-badge">
          <span className="dot" />
          <span>Socket Realtime Active</span>
        </span>
        <span className="sep" />
        <span>
          Đồng bộ từ máy quẹt thẻ vân tay: <strong style={{ color: '#047857' }}>100% OK</strong>
        </span>
      </div>

      <div className="precision-diemdanh__footerRight">
        <span>SYS_TIME: {sysTime}</span>
        <span>•</span>
        <span className="ver">CMS_ERP_V2700</span>
      </div>
    </div>
  );
};

export default React.memo(PrecisionDiemDanhFooter);
