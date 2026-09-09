import React from 'react';
import { DiemDanhNhomData, WorkPositionTableData } from '../../interfaces/nhansuInterface';

/* ==========================================================================
   1. Cell Mã Nhân Viên & NS_ID (JetBrains Mono Badge)
   ========================================================================== */
export const CodeCellRenderer = (params: any) => {
  const emplNo = params.data?.EMPL_NO;
  if (!emplNo) return null;

  return (
    <div className="cell-code">
      <span className="code-badge">{emplNo}</span>
    </div>
  );
};

export const NsIdCellRenderer = (params: any) => {
  const cmsId = params.data?.CMS_ID;
  if (!cmsId) return null;

  return (
    <span className="cell-nsid">{cmsId}</span>
  );
};

/* ==========================================================================
   2. Cell Họ Tên & Avatar & Chức Danh
   ========================================================================== */
export const NameAvatarCellRenderer = (params: any) => {
  const fullName = params.data?.FULL_NAME || '';
  const jobName = params.data?.JOB_NAME || params.data?.SUBDEPTNAME || '';
  const emplNo = params.data?.EMPL_NO || '';
  const avatarUrl = `/avatarpic/${emplNo}.jpg`;

  return (
    <div className="cell-avatar-name">
      <div className="avatar-wrap">
        <img
          src={avatarUrl}
          alt={fullName}
          onError={(e) => {
            // Ẩn ảnh lỗi và hiển thị avatar fallback
            (e.target as HTMLElement).style.display = 'none';
            const fallback = (e.target as HTMLElement).nextElementSibling as HTMLElement;
            if (fallback) fallback.style.display = 'flex';
          }}
        />
        <div className="avatar-fallback" style={{ display: 'none' }}>
          {fullName.slice(0, 1).toUpperCase()}
        </div>
        <span className="status-dot"></span>
      </div>

      <div className="name-info">
        <span className="full-name" title={fullName}>
          {fullName}
        </span>
        {jobName && (
          <span className="sub-info" title={jobName}>
            {jobName}
          </span>
        )}
      </div>
    </div>
  );
};

/* ==========================================================================
   3. Cell Thao Tác Chuyển Team (Hành Chính, Team 1, Team 2)
   ========================================================================== */
interface TeamActionCellProps {
  data: DiemDanhNhomData;
  onSetTeam: (EMPL_NO: string, value: number) => void;
}

export const TeamActionCell: React.FC<TeamActionCellProps> = ({ data, onSetTeam }) => {
  const currentTeam = data.WORK_SHIF_NAME;

  if (currentTeam === 'Hành Chính') {
    return (
      <div className="cell-action-group">
        <button
          type="button"
          className="btn-micro btn-micro--team1"
          onClick={() => onSetTeam(data.EMPL_NO, 1)}
          title="Chuyển sang TEAM 1"
        >
          TEAM 1
        </button>
        <button
          type="button"
          className="btn-micro btn-micro--team2"
          onClick={() => onSetTeam(data.EMPL_NO, 2)}
          title="Chuyển sang TEAM 2"
        >
          TEAM 2
        </button>
      </div>
    );
  } else if (currentTeam === 'TEAM 1') {
    return (
      <div className="cell-action-group">
        <button
          type="button"
          className="btn-micro btn-micro--hc"
          onClick={() => onSetTeam(data.EMPL_NO, 0)}
          title="Chuyển sang Hành Chính"
        >
          Hành chính
        </button>
        <button
          type="button"
          className="btn-micro btn-micro--team2"
          onClick={() => onSetTeam(data.EMPL_NO, 2)}
          title="Chuyển sang TEAM 2"
        >
          TEAM 2
        </button>
      </div>
    );
  } else {
    return (
      <div className="cell-action-group">
        <button
          type="button"
          className="btn-micro btn-micro--team1"
          onClick={() => onSetTeam(data.EMPL_NO, 1)}
          title="Chuyển sang TEAM 1"
        >
          TEAM 1
        </button>
        <button
          type="button"
          className="btn-micro btn-micro--hc"
          onClick={() => onSetTeam(data.EMPL_NO, 0)}
          title="Chuyển sang Hành Chính"
        >
          Hành chính
        </button>
      </div>
    );
  }
};

/* ==========================================================================
   4. Cell Thao Tác Gán Ca Làm Việc (Ca HC, Ca ngày, Ca đêm, Reset)
   ========================================================================== */
interface ShiftActionCellProps {
  data: DiemDanhNhomData;
  onSetCa: (params: any, value: number) => void;
  onResetCa: (params: any) => void;
}

export const ShiftActionCell: React.FC<ShiftActionCellProps> = ({ data, onSetCa, onResetCa }) => {
  if (data.CALV === null || data.CALV === undefined) {
    return (
      <div className="cell-action-group">
        <button
          type="button"
          className="btn-micro btn-micro--hc"
          onClick={() => onSetCa({ data }, 0)}
          title="Gán Ca Hành Chính (07:30 - 16:30)"
        >
          Ca HC
        </button>
        <button
          type="button"
          className="btn-micro btn-micro--shift-day"
          onClick={() => onSetCa({ data }, 1)}
          title="Gán Ca Ngày 12h (07:30 - 19:30)"
        >
          Ca ngày
        </button>
        <button
          type="button"
          className="btn-micro btn-micro--shift-night"
          onClick={() => onSetCa({ data }, 2)}
          title="Gán Ca Đêm 12h (19:30 - 07:30)"
        >
          Ca đêm
        </button>
      </div>
    );
  }

  const shiftLabel =
    data.CALV === 0 ? 'Ca HC' : data.CALV === 1 ? 'Ca ngày' : data.CALV === 2 ? 'Ca đêm' : 'Chưa có ca';
  const chipClass =
    data.CALV === 0
      ? 'chip-active--hc'
      : data.CALV === 1
        ? 'chip-active--day'
        : 'chip-active--night';

  return (
    <div className="cell-action-group">
      <span className={`chip-active ${chipClass}`}>{shiftLabel}</span>
      <button
        type="button"
        className="btn-micro btn-micro--reset"
        onClick={() => onResetCa({ data })}
        title="Hủy gán ca này"
      >
        ✕
      </button>
    </div>
  );
};

/* ==========================================================================
   5. Cell Thao Tác Chuyển Nhà Máy (SET NM1 / SET NM2)
   ========================================================================== */
interface FactoryActionCellProps {
  data: DiemDanhNhomData;
  onSetFactory: (EMPL_NO: string, value: number) => void;
}

export const FactoryActionCell: React.FC<FactoryActionCellProps> = ({ data, onSetFactory }) => {
  if (data.FACTORY_NAME === 'Nhà máy 1') {
    return (
      <div className="cell-action-group">
        <button
          type="button"
          className="btn-micro btn-micro--nm2"
          onClick={() => onSetFactory(data.EMPL_NO, 2)}
          title="Điều chuyển sang Nhà máy 2"
        >
          SET NM2
        </button>
      </div>
    );
  } else if (data.FACTORY_NAME === 'Nhà máy 2') {
    return (
      <div className="cell-action-group">
        <button
          type="button"
          className="btn-micro btn-micro--nm1"
          onClick={() => onSetFactory(data.EMPL_NO, 1)}
          title="Điều chuyển sang Nhà máy 1"
        >
          SET NM1
        </button>
      </div>
    );
  } else {
    return (
      <div className="cell-action-group">
        <button
          type="button"
          className="btn-micro btn-micro--nm1"
          onClick={() => onSetFactory(data.EMPL_NO, 1)}
          title="Gán Nhà máy 1"
        >
          NM1
        </button>
        <button
          type="button"
          className="btn-micro btn-micro--nm2"
          onClick={() => onSetFactory(data.EMPL_NO, 2)}
          title="Gán Nhà máy 2"
        >
          NM2
        </button>
      </div>
    );
  }
};

/* ==========================================================================
   6. Cell Lựa Chọn Vị Trí Làm Việc (Dropdown Position)
   ========================================================================== */
interface PositionSelectCellProps {
  data: DiemDanhNhomData;
  workpositionload: WorkPositionTableData[];
  onSetViTri: (EMPL_NO: string, WORK_POSITION_CODE: number) => void;
}

export const PositionSelectCell: React.FC<PositionSelectCellProps> = ({
  data,
  workpositionload,
  onSetViTri,
}) => {
  return (
    <div className="cell-select-wrap">
      <select
        value={data.WORK_POSITION_CODE ?? ''}
        onChange={(e) => onSetViTri(data.EMPL_NO, Number(e.target.value))}
        title="Chọn vị trí công việc phân công"
      >
        <option value="">-- Chọn vị trí --</option>
        {workpositionload.map((item) => (
          <option key={item.WORK_POSITION_CODE} value={item.WORK_POSITION_CODE}>
            {item.WORK_POSITION_NAME}
          </option>
        ))}
      </select>
    </div>
  );
};
