import React from "react";
import { HiOutlineOfficeBuilding } from "react-icons/hi";
import { BiGitRepoForked, BiBadgeCheck, BiTimeFive } from "react-icons/bi";
import { AiOutlineApartment } from "react-icons/ai";

interface PrecisionDeptHeaderProps {
  mainDeptCount: number;
  subDeptCount: number;
  workPosCount: number;
}

export const PrecisionDeptHeader: React.FC<PrecisionDeptHeaderProps> = ({
  mainDeptCount,
  subDeptCount,
  workPosCount,
}) => {
  return (
    <>
      <div className="precision-deptmanager__header">
        <div className="precision-deptmanager__titleBox">
          <div className="precision-deptmanager__iconBadge">
            <HiOutlineOfficeBuilding size={18} />
          </div>
          <div className="precision-deptmanager__titleGroup">
            <span className="precision-deptmanager__subTitle">
              CƠ CẤU TỔ CHỨC & ĐỊNH BIÊN NHÂN LỰC
            </span>
            <h1 className="precision-deptmanager__title">
              QUẢN LÝ PHÒNG BAN & VỊ TRÍ CÔNG TÁC (NS2)
            </h1>
          </div>
        </div>

        <div className="precision-deptmanager__telemetry">
          <div className="precision-deptmanager__statusPill precision-deptmanager__statusPill--tree">
            <span>MÔ HÌNH:</span>
            <b>MAIN (1) → SUB (N) → WORK POS (N)</b>
          </div>

          <div className="precision-deptmanager__statusPill precision-deptmanager__statusPill--sync">
            <span className="pulse-dot" />
            <span>HRM-NS10 • MASTER TREE SYNCED</span>
          </div>
        </div>
      </div>

      {/* 4 KPI Metric Cards */}
      <div className="precision-deptmanager__kpis">
        {/* Card 1: Main Dept */}
        <div className="precision-deptmanager__kpiCard precision-deptmanager__kpiCard--blue">
          <div className="precision-deptmanager__kpiContent">
            <span className="precision-deptmanager__kpiLabel">
              Tổng Bộ Phận Chính
            </span>
            <div className="precision-deptmanager__kpiValueRow">
              <span className="precision-deptmanager__kpiValue">{mainDeptCount}</span>
              <span className="precision-deptmanager__kpiTag precision-deptmanager__kpiTag--blue">
                MAIN DEPT
              </span>
            </div>
            <span className="precision-deptmanager__kpiSubText">
              QC, SX, KD, KHO, NHANSU...
            </span>
          </div>
          <div className="precision-deptmanager__kpiIcon">
            <HiOutlineOfficeBuilding size={20} />
          </div>
        </div>

        {/* Card 2: Sub Dept */}
        <div className="precision-deptmanager__kpiCard precision-deptmanager__kpiCard--indigo">
          <div className="precision-deptmanager__kpiContent">
            <span className="precision-deptmanager__kpiLabel">
              Phòng Ban Trực Thuộc
            </span>
            <div className="precision-deptmanager__kpiValueRow">
              <span className="precision-deptmanager__kpiValue">{subDeptCount}</span>
              <span className="precision-deptmanager__kpiTag precision-deptmanager__kpiTag--indigo">
                SUB DEPT
              </span>
            </div>
            <span className="precision-deptmanager__kpiSubText">
              Phân bổ trong {mainDeptCount} BP chính
            </span>
          </div>
          <div className="precision-deptmanager__kpiIcon">
            <BiGitRepoForked size={20} />
          </div>
        </div>

        {/* Card 3: Work Position */}
        <div className="precision-deptmanager__kpiCard precision-deptmanager__kpiCard--emerald">
          <div className="precision-deptmanager__kpiContent">
            <span className="precision-deptmanager__kpiLabel">
              Vị Trí & Nghiệp Vụ
            </span>
            <div className="precision-deptmanager__kpiValueRow">
              <span className="precision-deptmanager__kpiValue">{workPosCount}</span>
              <span className="precision-deptmanager__kpiTag precision-deptmanager__kpiTag--emerald">
                WORK POS
              </span>
            </div>
            <span className="precision-deptmanager__kpiSubText">
              Chức danh định biên line
            </span>
          </div>
          <div className="precision-deptmanager__kpiIcon">
            <BiBadgeCheck size={20} />
          </div>
        </div>

        {/* Card 4: Attendance Groups */}
        <div className="precision-deptmanager__kpiCard precision-deptmanager__kpiCard--amber">
          <div className="precision-deptmanager__kpiContent">
            <span className="precision-deptmanager__kpiLabel">
              Nhóm Chấm Công ATT
            </span>
            <div className="precision-deptmanager__kpiValueRow">
              <span className="precision-deptmanager__kpiValue">15</span>
              <span className="precision-deptmanager__kpiTag precision-deptmanager__kpiTag--amber">
                ATT_GROUPS
              </span>
            </div>
            <span className="precision-deptmanager__kpiSubText">
              Liên kết ca kíp nhà máy CMS
            </span>
          </div>
          <div className="precision-deptmanager__kpiIcon">
            <BiTimeFive size={20} />
          </div>
        </div>
      </div>
    </>
  );
};

export default PrecisionDeptHeader;
