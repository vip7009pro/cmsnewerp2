import React, { useState, useMemo } from "react";
import { IoCheckmarkDoneOutline, IoCloseCircleOutline, IoSearchOutline, IoShieldCheckmarkOutline } from "react-icons/io5";
import { TestListTable, CheckAddedSPECDATA } from "../../interfaces/qcInterface";

interface PrecisionDKDTCChecklistProps {
  testList: TestListTable[];
  addedSpec: CheckAddedSPECDATA[];
  checkNVL: boolean;
  onToggleTestItem: (testCode: number) => void;
  onSelectAllTests: (select: boolean) => void;
}

const PrecisionDKDTCChecklist: React.FC<PrecisionDKDTCChecklistProps> = ({
  testList,
  addedSpec,
  checkNVL,
  onToggleTestItem,
  onSelectAllTests,
}) => {
  const [filterText, setFilterText] = useState<string>("");

  const selectedCount = useMemo(
    () => testList.filter((t) => t.SELECTED).length,
    [testList]
  );

  // Map kiểm tra Spec đã thêm cho từng Test Code
  const addedSpecMap = useMemo(() => {
    const map = new Map<number, boolean>();
    addedSpec.forEach((item) => {
      if (item.CHECKADDED !== null && item.CHECKADDED !== undefined) {
        map.set(item.TEST_CODE, true);
      }
    });
    return map;
  }, [addedSpec]);

  const filteredTests = useMemo(() => {
    if (!filterText.trim()) return testList;
    const term = filterText.toLowerCase();
    return testList.filter((t) => t.TEST_NAME.toLowerCase().includes(term));
  }, [testList, filterText]);

  return (
    <div className="precision-dkdtc__checklistCard">
      <div className="precision-dkdtc__checklistHeader">
        <div className="precision-dkdtc__checklistTitle">
          <span>HẠNG MỤC TEST</span>
          <span className="count-badge">({selectedCount}/{testList.length})</span>
        </div>
        <div className="precision-dkdtc__checklistTools">
          <button
            type="button"
            className="precision-dkdtc__toolBtn"
            onClick={() => onSelectAllTests(true)}
            title="Chọn tất cả hạng mục"
          >
            <IoCheckmarkDoneOutline size={12} />
            <span>Tất cả</span>
          </button>
          <button
            type="button"
            className="precision-dkdtc__toolBtn"
            onClick={() => onSelectAllTests(false)}
            title="Bỏ chọn toàn bộ"
          >
            <IoCloseCircleOutline size={12} />
            <span>Bỏ chọn</span>
          </button>
        </div>
      </div>

      {/* Ô tìm kiếm nhanh hạng mục test */}
      {testList.length > 8 && (
        <div className="precision-dkdtc__checklistSearch">
          <IoSearchOutline size={12} className="icon" />
          <input
            type="text"
            placeholder="Lọc hạng mục test..."
            value={filterText}
            onChange={(e) => setFilterText(e.target.value)}
          />
          {filterText && (
            <button
              type="button"
              className="clear-btn"
              onClick={() => setFilterText("")}
            >
              ×
            </button>
          )}
        </div>
      )}

      {/* Lưới checklist 2 cột */}
      <div className="precision-dkdtc__checklistGrid">
        {filteredTests.map((test) => {
          const hasSpec = addedSpecMap.get(test.TEST_CODE) || false;
          const isSelected = Boolean(test.SELECTED);

          return (
            <label
              key={test.TEST_CODE}
              className={`precision-dkdtc__checkItem ${
                isSelected ? "precision-dkdtc__checkItem--selected" : ""
              } ${hasSpec ? "precision-dkdtc__checkItem--hasSpec" : ""}`}
              title={
                hasSpec
                  ? "Đã có SPEC kỹ thuật chuẩn"
                  : checkNVL
                  ? "Hạng mục test vật liệu"
                  : "Chưa khai báo SPEC kỹ thuật"
              }
            >
              <input
                type="checkbox"
                checked={isSelected}
                onChange={() => onToggleTestItem(test.TEST_CODE)}
              />
              <span className="test-name">{test.TEST_NAME}</span>
              {hasSpec && (
                <IoShieldCheckmarkOutline
                  size={12}
                  className="spec-icon"
                  title="Đã có SPEC"
                />
              )}
            </label>
          );
        })}
      </div>

      {/* Danh sách chip hiển thị các hạng mục đang được chọn */}
      {selectedCount > 0 && (
        <div className="precision-dkdtc__selectedSummary">
          {testList
            .filter((t) => t.SELECTED)
            .map((t) => (
              <span key={t.TEST_CODE} className="selected-tag">
                {t.TEST_NAME}
              </span>
            ))}
        </div>
      )}
    </div>
  );
};

export default React.memo(PrecisionDKDTCChecklist);
