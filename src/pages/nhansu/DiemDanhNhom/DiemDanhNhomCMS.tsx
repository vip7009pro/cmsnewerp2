import React, { useCallback, useEffect, useMemo, useState } from 'react';
import moment from 'moment';
import * as XLSX from 'xlsx';
import Swal from 'sweetalert2';
import AGTable from '../../../components/DataTable/AGTable';
import { DiemDanhNhomData } from '../interfaces/nhansuInterface';
import { f_getDiemDanhNhom, f_updateWorkHour } from '../utils/nhansuUtils';
import { generalQuery, getCompany } from '../../../api/Api';

import PrecisionDiemDanhHeader from './PrecisionDiemDanh/PrecisionDiemDanhHeader';
import PrecisionDiemDanhToolbar from './PrecisionDiemDanh/PrecisionDiemDanhToolbar';
import PrecisionDiemDanhKpi from './PrecisionDiemDanh/PrecisionDiemDanhKpi';
import PrecisionAttendanceCell from './PrecisionDiemDanh/PrecisionAttendanceCell';
import PrecisionOvertimeCell from './PrecisionDiemDanh/PrecisionOvertimeCell';
import PrecisionPivotModal from './PrecisionDiemDanh/PrecisionPivotModal';
import './PrecisionDiemDanh/PrecisionDiemDanh.scss';

/* ==========================================================================
   Custom High-Density Cell Renderers (Stitch Design System)
   ========================================================================== */

// 1. Mã Nhân Viên & ERP ID
const EmpCodeCellRenderer = (params: any) => {
  const emplNo = params.data?.EMPL_NO;
  const cmsId = params.data?.CMS_ID;
  if (!emplNo) return null;

  return (
    <div className="cell-empcode">
      <span className="code-chip">{emplNo}</span>
      {cmsId && <span className="erp-id">{cmsId}</span>}
    </div>
  );
};

// 2. Họ & Tên Nhân Viên kèm Phòng ban/Tổ
const FullNameCellRenderer = (params: any) => {
  const onOff = params.data?.ON_OFF;
  const fullName = params.data?.FULL_NAME || '';
  const subDept = params.data?.SUBDEPTNAME || '';
  const mainDept = params.data?.MAINDEPTNAME || '';
  const deptLabel = [subDept, mainDept].filter(Boolean).join(' • ');

  const nameColorClass =
    onOff === 1
      ? 'name-text--on'
      : onOff === 0
        ? 'name-text--off'
        : 'name-text--default';

  return (
    <div className="cell-fullname" title={fullName}>
      <span className={`name-text ${nameColorClass}`}>{fullName}</span>
      {deptLabel && <span className="dept-text">{deptLabel}</span>}
    </div>
  );
};

// 3. Ảnh Thẻ Avatar vuông bo góc với Chấm Xanh Online
const AvatarCellRenderer = (params: any) => {
  const emplNo = params.data?.EMPL_NO;
  const [imgError, setImgError] = useState(false);
  if (!emplNo) return null;

  const initial =
    params.data?.FIRST_NAME?.slice(0, 1) ||
    params.data?.MIDLAST_NAME?.slice(0, 1) ||
    'U';

  return (
    <div className="cell-avatar">
      {!imgError ? (
        <img
          src={`/Picture_NS/NS_${emplNo}.jpg`}
          alt={emplNo}
          onError={() => setImgError(true)}
          loading="lazy"
        />
      ) : (
        <div className="avatar-fallback">{initial}</div>
      )}
      <span className="status-dot" title="Sẵn sàng ca làm việc" />
    </div>
  );
};

// 4. Số Điện Thoại
const PhoneCellRenderer = (params: any) => {
  const phone = params.data?.PHONE_NUMBER;
  if (!phone) return <span style={{ color: '#94a3b8' }}>-</span>;

  return (
    <div className="cell-phone">
      <span className="material-symbols-outlined icon">call</span>
      <span>{phone}</span>
    </div>
  );
};

// 5. Chức Vụ & Xưởng
const JobCellRenderer = (params: any) => {
  const job = params.data?.JOB_NAME || 'Worker';
  const factory = params.data?.FACTORY_NAME || 'Nhà máy 1';
  const isLeader =
    job.toLowerCase().includes('leader') ||
    job.toLowerCase().includes('tổ trưởng') ||
    job.toLowerCase().includes('admin');

  return (
    <div className="cell-job">
      <span
        className={`job-chip ${isLeader ? 'job-chip--leader' : 'job-chip--worker'
          }`}
      >
        {job}
      </span>
      <span className="factory-text">{factory}</span>
    </div>
  );
};

// 6. Giờ Quẹt Thẻ Vân Tay
const FingerprintCellRenderer = (params: any) => {
  const isPresent = params.data?.ON_OFF === 1;

  if (isPresent) {
    return (
      <div className="cell-fingerprint">
        <span className="chip-scanned">
          <span className="material-symbols-outlined" style={{ fontSize: 13 }}>
            fingerprint
          </span>
          <span>Đã chấm công</span>
        </span>
      </div>
    );
  }

  return (
    <div className="cell-fingerprint">
      <span className="chip-unscanned">Chưa chấm công</span>
    </div>
  );
};

/* ==========================================================================
   Main Component: DiemDanhNhomCMS
   ========================================================================== */
interface DiemDanhNhomCMSProps {
  option: string;
}

const DiemDanhNhomCMS: React.FC<DiemDanhNhomCMSProps> = ({ option }) => {
  const [workShiftCode, setWorkShiftCode] = useState<number>(5); // 5 = Tất cả
  const [selectedFactory, setSelectedFactory] = useState<string>('ALL');
  const [diemdanhnhomtable, setDiemDanhNhomTable] = useState<Array<DiemDanhNhomData>>([]);
  const [searchKeyword, setSearchKeyword] = useState<string>('');
  const [isPivotOpen, setIsPivotOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [lastUpdated, setLastUpdated] = useState<string>(moment().format('HH:mm A'));

  const isCMS = getCompany() === 'CMS';

  // Load Data
  const loadData = useCallback(
    async (shiftCode: number) => {
      setLoading(true);
      setWorkShiftCode(shiftCode);
      try {
        const loadedData = await f_getDiemDanhNhom(option, shiftCode);
        setDiemDanhNhomTable(loadedData);
        setLastUpdated(moment().format('HH:mm A'));
        if (loadedData.length > 0) {
          Swal.fire({
            title: 'Thành công',
            text: `Đã tải ${loadedData.length} nhân sự trong ca làm việc`,
            icon: 'success',
            timer: 1500,
            timerProgressBar: true,
            showConfirmButton: false,
          });
        }
      } catch (err) {
        console.error('Lỗi khi tải dữ liệu điểm danh:', err);
      } finally {
        setLoading(false);
      }
    },
    [option]
  );

  useEffect(() => {
    loadData(5); // Initial load: Tất cả
  }, [loadData]);

  // Trích xuất danh sách nhà máy duy nhất
  const factoryList = useMemo(() => {
    const setFac = new Set<string>();
    diemdanhnhomtable.forEach((row) => {
      if (row.FACTORY_NAME) setFac.add(row.FACTORY_NAME);
    });
    if (setFac.size === 0) {
      setFac.add('Nhà máy 1');
      setFac.add('Nhà máy 2');
    }
    return Array.from(setFac);
  }, [diemdanhnhomtable]);

  // Lọc dữ liệu theo Nhà máy và Từ khóa tìm kiếm
  const filteredTableData = useMemo(() => {
    let result = diemdanhnhomtable;

    if (selectedFactory !== 'ALL') {
      result = result.filter((row) => row.FACTORY_NAME === selectedFactory);
    }

    if (searchKeyword.trim()) {
      const q = searchKeyword.toLowerCase().trim();
      result = result.filter((row) => {
        const name = (row.FULL_NAME || '').toLowerCase();
        const emplNo = (row.EMPL_NO || '').toLowerCase();
        const cmsId = (row.CMS_ID || '').toLowerCase();
        const phone = (row.PHONE_NUMBER || '').toLowerCase();
        const subDept = (row.SUBDEPTNAME || '').toLowerCase();
        return (
          name.includes(q) ||
          emplNo.includes(q) ||
          cmsId.includes(q) ||
          phone.includes(q) ||
          subDept.includes(q)
        );
      });
    }

    return result;
  }, [diemdanhnhomtable, searchKeyword, selectedFactory]);

  // Action: Điểm danh nhanh tất cả
  const handleMarkAllPresent = useCallback(async () => {
    const unmarkedList = diemdanhnhomtable.filter((e) => e.ON_OFF === null);
    if (unmarkedList.length === 0) {
      Swal.fire(
        'Thông báo',
        'Tất cả nhân sự trong ca hiện tại đã được điểm danh!',
        'info'
      );
      return;
    }

    const confirm = await Swal.fire({
      title: 'Xác nhận điểm danh nhanh',
      text: `Bạn có chắc chắn muốn điểm danh ĐI LÀM cho tất cả ${unmarkedList.length} nhân sự chưa điểm danh?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#059669',
      cancelButtonColor: '#64748b',
      confirmButtonText: 'Đồng ý điểm danh tất cả',
      cancelButtonText: 'Hủy bỏ',
    });

    if (confirm.isConfirmed) {
      setLoading(true);
      try {
        // Cập nhật state nội bộ tức thời
        const updatedTable = diemdanhnhomtable.map((row) =>
          row.ON_OFF === null ? { ...row, ON_OFF: 1 } : row
        );
        setDiemDanhNhomTable(updatedTable);

        // Gọi API backend cho từng nhân sự chưa điểm danh
        await Promise.all(
          unmarkedList.map((emp) =>
            generalQuery('setdiemdanhnhom', {
              diemdanhvalue: 1,
              EMPL_NO: emp.EMPL_NO,
              CURRENT_TEAM:
                emp.WORK_SHIF_NAME === 'Hành Chính'
                  ? 0
                  : emp.WORK_SHIF_NAME === 'TEAM 1'
                    ? 1
                    : 2,
              CURRENT_CA: emp.WORK_SHIF_NAME === 'Hành Chính' ? 0 : 1,
            })
          )
        );

        Swal.fire({
          title: 'Thành công',
          text: `Đã điểm danh ĐI LÀM cho ${unmarkedList.length} nhân sự!`,
          icon: 'success',
          timer: 2000,
          timerProgressBar: true,
          showConfirmButton: false,
        });
      } catch (err) {
        console.error('Lỗi điểm danh nhanh:', err);
        Swal.fire('Lỗi', 'Có lỗi xảy ra trong quá trình điểm danh nhanh', 'error');
      } finally {
        setLoading(false);
      }
    }
  }, [diemdanhnhomtable]);

  // Action: Xuất Excel chung cho EX1 (Đang lọc) hoặc EX2 (Tất cả)
  const exportDataToExcel = useCallback(
    (dataset: Array<DiemDanhNhomData>, fileType: 'EX1' | 'EX2') => {
      if (dataset.length === 0) {
        Swal.fire(
          'Thông báo',
          `Không có dữ liệu để xuất file ${fileType}!`,
          'warning'
        );
        return;
      }

      const excelRows = dataset.map((row, index) => ({
        STT: index + 1,
        'MÃ NV': row.EMPL_NO || '',
        NS_ID: row.CMS_ID || '',
        'HỌ VÀ TÊN': row.FULL_NAME || '',
        'ĐIỂM DANH':
          row.ON_OFF === 1
            ? 'Đi làm'
            : row.ON_OFF === 0
              ? row.REASON_NAME || 'Nghỉ làm'
              : 'Chưa điểm danh',
        'TĂNG CA (OT)': row.OVERTIME_INFO || 'Không',
        'SỐ ĐIỆN THOẠI': row.PHONE_NUMBER || '',
        'CHỨC VỤ': row.JOB_NAME || '',
        XƯỞNG: row.FACTORY_NAME || '',
        CA: row.WORK_SHIF_NAME || '',
        'VỊ TRÍ': row.WORK_POSITION_NAME || '',
        'PHÒNG BAN PHỤ': row.SUBDEPTNAME || '',
        'PHÒNG BAN CHÍNH': row.MAINDEPTNAME || '',
        'NGÀY ÁP DỤNG': row.APPLY_DATE || '',
        'GHI CHÚ': row.REMARK || '',
      }));

      const ws = XLSX.utils.json_to_sheet(excelRows);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'DiemDanhNhom');
      const suffix = fileType === 'EX1' ? 'DangLoc' : 'TatCa';
      const filename = `NS1_DiemDanh_${suffix}_${moment().format('YYYYMMDD_HHmmss')}.xlsx`;
      XLSX.writeFile(wb, filename);

      Swal.fire({
        title: 'Đã xuất file thành công',
        text: `Đã tải xuống [${filename}] với ${dataset.length} dòng dữ liệu (${fileType})`,
        icon: 'success',
        timer: 1800,
        showConfirmButton: false,
      });
    },
    []
  );

  const handleExportEX1 = useCallback(() => {
    exportDataToExcel(filteredTableData, 'EX1');
  }, [exportDataToExcel, filteredTableData]);

  const handleExportEX2 = useCallback(() => {
    exportDataToExcel(diemdanhnhomtable, 'EX2');
  }, [exportDataToExcel, diemdanhnhomtable]);

  // Column Definitions
  const columns = useMemo(() => {
    const baseCols = [
      {
        field: 'id',
        headerName: 'STT',
        width: 45,
        cellClass: 'flex-center-vertical',
      },
      {
        field: 'EMPL_NO',
        headerName: 'MÃ NV / ERP',
        width: 100,
        cellRenderer: EmpCodeCellRenderer,
      },
      {
        field: 'FULL_NAME',
        headerName: 'HỌ & TÊN NHÂN VIÊN',
        width: 185,
        cellRenderer: FullNameCellRenderer,
      },
      {
        field: 'AVATAR',
        headerName: 'ẢNH THẺ',
        width: 65,
        cellClass: 'flex-center-vertical',
        cellRenderer: AvatarCellRenderer,
      },
      {
        field: 'DIEMDANH',
        headerName: 'ĐIỂM DANH CA',
        width: 185,
        cellClass: 'flex-center-vertical',
        cellRenderer: (params: any) => (
          <PrecisionAttendanceCell
            data={params.data}
            tableData={diemdanhnhomtable}
            setTableData={setDiemDanhNhomTable}
          />
        ),
      },
      {
        field: 'TANGCA',
        headerName: 'TĂNG CA (OT)',
        minWidth: 195,
        flex: 1,
        cellClass: 'flex-center-vertical',
        cellRenderer: (params: any) => (
          <PrecisionOvertimeCell
            data={params.data}
            tableData={diemdanhnhomtable}
            setTableData={setDiemDanhNhomTable}
            isCMS={isCMS}
          />
        ),
      },
    ];

    const trailingCols = [
      {
        field: 'PHONE_NUMBER',
        headerName: 'SỐ ĐIỆN THOẠI',
        width: 115,
        cellRenderer: PhoneCellRenderer,
      },
      {
        field: 'JOB_NAME',
        headerName: 'CHỨC VỤ & XƯỞNG',
        width: 125,
        cellRenderer: JobCellRenderer,
      },
      {
        field: 'FINGERPRINT',
        headerName: 'GIỜ CHẤM CÔNG',
        width: 115,
        cellRenderer: FingerprintCellRenderer,
      },
      {
        field: 'WORK_SHIF_NAME',
        headerName: 'TEAM / CA',
        width: 90,
        cellClass: 'flex-center-vertical',
      },
      {
        field: 'WORK_POSITION_NAME',
        headerName: 'VỊ TRÍ',
        width: 95,
        cellClass: 'flex-center-vertical',
      },
      {
        field: 'SUBDEPTNAME',
        headerName: 'BỘ PHẬN',
        width: 120,
        cellClass: 'flex-center-vertical',
      },
      {
        field: 'REQUEST_DATE',
        headerName: 'REQ_DATE',
        width: 95,
        cellClass: 'flex-center-vertical',
      },
      {
        field: 'APPLY_DATE',
        headerName: 'APP_DATE',
        width: 95,
        cellClass: 'flex-center-vertical',
      },
      {
        field: 'REASON_NAME',
        headerName: 'LÝ DO NGHỈ',
        width: 110,
        cellClass: 'flex-center-vertical',
      },
      {
        field: 'REMARK',
        headerName: 'GHI CHÚ',
        width: 100,
        cellClass: 'flex-center-vertical',
      },
    ];

    // Non-CMS WORK_HOUR column
    if (!isCMS) {
      baseCols.push({
        field: 'WORK_HOUR',
        headerName: 'WORK_HOUR',
        width: 95,
        cellClass: 'flex-center-vertical',
      } as any);
    }

    return [...baseCols, ...trailingCols];
  }, [diemdanhnhomtable, isCMS]);

  return (
    <div className="precision-diemdanh">
      {/* 1. Subheader Title Bar */}
      <PrecisionDiemDanhHeader />

      {/* 2. Toolbar & Action Controls */}
      <PrecisionDiemDanhToolbar
        workShiftCode={workShiftCode}
        onShiftChange={loadData}
        selectedFactory={selectedFactory}
        onFactoryChange={setSelectedFactory}
        factoryList={factoryList}
        onMarkAllPresent={handleMarkAllPresent}
        onRefresh={() => loadData(workShiftCode)}
        loading={loading}
      />

      {/* 3. Realtime 3 KPI Cards */}
      <PrecisionDiemDanhKpi tableData={diemdanhnhomtable} />

      {/* 4. AG-Grid High-Density Table */}
      <div className="precision-diemdanh__gridContainer">
        {/* Table Search & Meta Header */}
        <div className="precision-diemdanh__gridToolbar">
          <div className="precision-diemdanh__gridToolbarLeft">
            <div className="precision-diemdanh__searchBox">
              <span
                className="material-symbols-outlined"
                style={{ fontSize: 16, color: '#94a3b8' }}
              >
                search
              </span>
              <input
                type="text"
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
                placeholder="Lọc nhanh họ tên, mã NV (CMS...), SĐT..."
              />
              {searchKeyword && (
                <span
                  className="material-symbols-outlined"
                  style={{ fontSize: 14, color: '#94a3b8', cursor: 'pointer' }}
                  onClick={() => setSearchKeyword('')}
                >
                  close
                </span>
              )}
            </div>

            {/* Nút EX1, EX2, PIVOT đưa lên trên cùng thanh lọc nhanh */}
            <div className="precision-diemdanh__gridActions">
              <button
                type="button"
                className="precision-diemdanh__gridBtn precision-diemdanh__gridBtn--excel"
                onClick={handleExportEX1}
                title={`Xuất ${filteredTableData.length} nhân sự đang hiển thị/lọc ra Excel`}
              >
                <span className="material-symbols-outlined" style={{ fontSize: 15 }}>
                  description
                </span>
                <span>EX1</span>
                <span className="badge">Đang lọc</span>
              </button>

              <button
                type="button"
                className="precision-diemdanh__gridBtn precision-diemdanh__gridBtn--excel"
                onClick={handleExportEX2}
                title={`Xuất toàn bộ ${diemdanhnhomtable.length} nhân sự ra Excel`}
              >
                <span className="material-symbols-outlined" style={{ fontSize: 15 }}>
                  file_download
                </span>
                <span>EX2</span>
                <span className="badge">Tất cả</span>
              </button>

              <button
                type="button"
                className="precision-diemdanh__gridBtn precision-diemdanh__gridBtn--pivot"
                onClick={() => setIsPivotOpen(true)}
                title="Mở phân tích tổng hợp Pivot đa chiều"
              >
                <span className="material-symbols-outlined" style={{ fontSize: 15 }}>
                  pivot_table_chart
                </span>
                <span>PIVOT</span>
              </button>
            </div>
          </div>

          <div className="precision-diemdanh__gridMeta">
            <span>
              Đang lọc theo:{' '}
              <strong>
                {filteredTableData.length} / {diemdanhnhomtable.length} nhân sự
              </strong>
            </span>
            <span>•</span>
            <span>
              Cập nhật gần nhất: <strong>{lastUpdated}</strong>
            </span>
          </div>
        </div>

        {/* AGTable Grid Body (Đã ẩn hoàn toàn toolbar mặc định của AGTable) */}
        <div className="precision-diemdanh__gridBody">
          <AGTable
            rowHeight={48}
            columns={columns}
            data={filteredTableData}
            onCellEditingStopped={(e: any) => {
              if (e.column.colId === 'WORK_HOUR') {
                if (e.data.ON_OFF === 1) {
                  f_updateWorkHour(e.data, moment().format('YYYY-MM-DD'));
                } else {
                  Swal.fire(
                    'Thông báo',
                    `Nhân viên ${e.data.EMPL_NO} không đi làm, hãy điểm danh đi làm trước`,
                    'warning'
                  );
                }
              }
            }}
          />
        </div>
      </div>

      {/* 5. Pivot Analysis Modal */}
      <PrecisionPivotModal
        open={isPivotOpen}
        onClose={() => setIsPivotOpen(false)}
        tableData={diemdanhnhomtable}
      />
    </div>
  );
};

export default React.memo(DiemDanhNhomCMS);
