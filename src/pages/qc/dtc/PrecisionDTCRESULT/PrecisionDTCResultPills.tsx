import React from "react";
import { IoCheckmarkCircle, IoLayersOutline } from "react-icons/io5";
import { TestListTable } from "../../interfaces/qcInterface";

interface PrecisionDTCResultPillsProps {
  testList: TestListTable[];
  activeTestCode: string;
  onSelectTest: (code: string) => void;
}

const PrecisionDTCResultPills: React.FC<PrecisionDTCResultPillsProps> = ({
  testList,
  activeTestCode,
  onSelectTest,
}) => {
  return (
    <div className="precision-dtcresult__pillsSection">
      <div className="precision-dtcresult__pillsLabel">
        <IoLayersOutline size={14} color="#2563eb" />
        <span>HẠNG MỤC TEST:</span>
      </div>

      <div className="precision-dtcresult__pillsTrack">
        {testList.map((test) => {
          const testCodeStr = test.TEST_CODE.toString();
          const isActive = activeTestCode === testCodeStr;
          const isRegistered = Boolean(test.CHECKADDED);

          let className = "precision-dtcresult__pill";
          if (isRegistered) {
            className += " precision-dtcresult__pill--registered";
          }
          if (isActive) {
            className += " precision-dtcresult__pill--active";
          }

          return (
            <button
              key={test.TEST_CODE}
              type="button"
              className={className}
              onClick={() => onSelectTest(testCodeStr)}
              title={
                isRegistered
                  ? "Hạng mục này đã được đăng ký kiểm tra cho mã hiện tại"
                  : "Chưa đăng ký kiểm tra"
              }
            >
              {isActive ? (
                <span className="pill-dot" />
              ) : isRegistered ? (
                <IoCheckmarkCircle size={12} color="#10b981" />
              ) : null}
              <span>{test.TEST_NAME}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default React.memo(PrecisionDTCResultPills);
