import React from "react";
import "./PrecisionDeptModal.scss";
import {
  MainDeptTableData,
  SubDeptTableData,
  WORK_POSITION_DATA,
} from "../../interfaces/nhansuInterface";
import {
  FiBriefcase,
  FiFolder,
  FiClipboard,
  FiX,
  FiPlus,
  FiCheck,
  FiTrash2,
  FiRefreshCw,
} from "react-icons/fi";
import PrecisionDeptMainForm from "./PrecisionDeptMainForm";
import PrecisionDeptSubForm from "./PrecisionDeptSubForm";
import PrecisionDeptPosForm from "./PrecisionDeptPosForm";

interface PrecisionDeptModalProps {
  isOpen: boolean;
  onClose: () => void;
  tableSelection: number; // 1: MainDept, 2: SubDept, 3: WorkPosition
  selectedMainDept: MainDeptTableData;
  setMainDeptInfo: (keyname: string, value: any) => void;
  selectedSubDept: SubDeptTableData;
  setSubDeptInfo: (keyname: string, value: any) => void;
  selectedWorkPosition: WORK_POSITION_DATA;
  setWorkPositionInfo: (keyname: string, value: any) => void;
  mainDeptList?: Array<MainDeptTableData>;
  subDeptList?: Array<SubDeptTableData>;
  onAdd: () => void;
  onUpdate: () => void;
  onDelete: () => void;
  onClear: () => void;
  isLoading?: boolean;
}

export const PrecisionDeptModal: React.FC<PrecisionDeptModalProps> = ({
  isOpen,
  onClose,
  tableSelection,
  selectedMainDept,
  setMainDeptInfo,
  selectedSubDept,
  setSubDeptInfo,
  selectedWorkPosition,
  setWorkPositionInfo,
  mainDeptList = [],
  subDeptList = [],
  onAdd,
  onUpdate,
  onDelete,
  onClear,
  isLoading,
}) => {
  if (!isOpen) return null;

  // Level config
  const levelConfig = {
    1: {
      modifier: "level1",
      tierName: "Cấp 1 • Danh Mục Cốt Lõi",
      codePill: `MAIN_DEPT: ${selectedMainDept.MAINDEPTCODE || "MỚI"}`,
      icon: <FiBriefcase size={22} />,
      title: "Thao Tác Bộ Phận Chính",
      tag: selectedMainDept.MAINDEPTNAME || "MỚI",
      parentName: "(Khối Toàn Nhà Máy)",
      desc: "Quản lý và thiết lập mã danh mục bộ phận cấp 1 cho toàn bộ khối sản xuất CMS Vina.",
    },
    2: {
      modifier: "level2",
      tierName: "Cấp 2 • Đơn Vị Trực Thuộc",
      codePill: `SUB_DEPT: ${selectedSubDept.SUBDEPTCODE || "MỚI"}`,
      icon: <FiFolder size={22} />,
      title: "Thao Tác Phòng Ban Trực Thuộc",
      tag: selectedSubDept.SUBDEPTNAME || "MỚI",
      parentName: `(← Thuộc ${selectedMainDept.MAINDEPTNAME || "Bộ Phận Chính"})`,
      desc: "Quản lý các ban, tổ kỹ thuật trực thuộc bộ phận cha trong chuỗi vận hành.",
    },
    3: {
      modifier: "level3",
      tierName: "Cấp 3 • Công Đoạn & Chấm Công",
      codePill: `POS: ${selectedWorkPosition.WORK_POSITION_CODE || "MỚI"} • ATT: ${selectedWorkPosition.ATT_GROUP_CODE || "MỚI"}`,
      icon: <FiClipboard size={22} />,
      title: "Thao Tác Vị Trí Công Đoạn",
      tag: selectedWorkPosition.WORK_POSITION_NAME || "MỚI",
      parentName: `(← Thuộc ${selectedSubDept.SUBDEPTNAME || "Phòng Ban Con"})`,
      desc: "Thiết lập vị trí thao tác tại chuyền và cấu hình ánh xạ nhóm máy chấm công (ATT).",
    },
  }[tableSelection] || {
    modifier: "level1",
    tierName: "Cấp 1 • Danh Mục Cốt Lõi",
    codePill: "MỚI",
    icon: <FiBriefcase size={22} />,
    title: "Thao Tác Danh Mục",
    tag: "MỚI",
    parentName: "",
    desc: "Quản trị cơ cấu phân cấp phòng ban.",
  };

  return (
    <div className="precision-dept-modal-overlay" onClick={onClose}>
      <div
        className="precision-dept-modal"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 1. Category Top Bar */}
        <div
          className={`precision-dept-modal__topBar precision-dept-modal__topBar--${levelConfig.modifier}`}
        >
          <div className="precision-dept-modal__topBarLeft">
            <span
              className={`precision-dept-modal__tierBadge precision-dept-modal__tierBadge--${levelConfig.modifier}`}
            >
              {tableSelection}
            </span>
            <span className="precision-dept-modal__tierTitle">
              {levelConfig.tierName}
            </span>
          </div>
          <span
            className={`precision-dept-modal__codePill precision-dept-modal__codePill--${levelConfig.modifier}`}
          >
            {levelConfig.codePill}
          </span>
        </div>

        {/* 2. Main Header */}
        <div className="precision-dept-modal__header">
          <div className="precision-dept-modal__headerRow">
            <div className="precision-dept-modal__headerLeft">
              <div
                className={`precision-dept-modal__headerIcon precision-dept-modal__headerIcon--${levelConfig.modifier}`}
              >
                {levelConfig.icon}
              </div>
              <div className="precision-dept-modal__headerTitleBlock">
                <h2 className="precision-dept-modal__modalTitle">
                  {levelConfig.title}
                </h2>
                <div className="precision-dept-modal__headerMetaRow">
                  <span
                    className={`precision-dept-modal__headerTag precision-dept-modal__headerTag--${levelConfig.modifier}`}
                  >
                    {levelConfig.tag}
                  </span>
                  <span className="precision-dept-modal__headerParentName">
                    {levelConfig.parentName}
                  </span>
                </div>
              </div>
            </div>

            <button
              className="precision-dept-modal__btnClose"
              onClick={onClose}
              title="Đóng cửa sổ"
            >
              <FiX size={20} />
            </button>
          </div>
          <p className="precision-dept-modal__headerDesc">{levelConfig.desc}</p>
        </div>

        {/* 3. Form Body */}
        <div className="precision-dept-modal__body">
          {tableSelection === 1 && (
            <PrecisionDeptMainForm
              selectedMainDept={selectedMainDept}
              setMainDeptInfo={setMainDeptInfo}
            />
          )}

          {tableSelection === 2 && (
            <PrecisionDeptSubForm
              selectedSubDept={selectedSubDept}
              setSubDeptInfo={setSubDeptInfo}
              mainDeptList={mainDeptList}
              parentDeptName={selectedMainDept.MAINDEPTNAME}
            />
          )}

          {tableSelection === 3 && (
            <PrecisionDeptPosForm
              selectedWorkPosition={selectedWorkPosition}
              setWorkPositionInfo={setWorkPositionInfo}
              subDeptList={subDeptList}
              parentSubDeptName={selectedSubDept.SUBDEPTNAME}
            />
          )}
        </div>

        {/* 4. Action Buttons Footer */}
        <div className="precision-dept-modal__footer">
          <div className="precision-dept-modal__btnGrid">
            <button
              type="button"
              className="precision-dept-modal__btn precision-dept-modal__btn--clear"
              onClick={onClear}
              title="Xóa trắng form nhập"
            >
              <FiRefreshCw size={13} />
              CLEAR FORM
            </button>

            <button
              type="button"
              className="precision-dept-modal__btn precision-dept-modal__btn--add"
              onClick={onAdd}
              disabled={isLoading}
              title="Thêm bản ghi mới"
            >
              <FiPlus size={14} />
              THÊM MỚI
            </button>

            <button
              type="button"
              className="precision-dept-modal__btn precision-dept-modal__btn--update"
              onClick={onUpdate}
              disabled={isLoading}
              title="Lưu cập nhật"
            >
              <FiCheck size={14} />
              CẬP NHẬT
            </button>

            <button
              type="button"
              className="precision-dept-modal__btn precision-dept-modal__btn--delete"
              onClick={onDelete}
              disabled={isLoading}
              title="Xóa bản ghi"
            >
              <FiTrash2 size={13} />
              XÓA
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrecisionDeptModal;
