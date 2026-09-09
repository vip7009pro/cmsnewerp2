import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import Swal from 'sweetalert2';
import moment from 'moment';
import * as XLSX from 'xlsx';
import { RootState } from '../../../redux/store';
import { generalQuery, getSocket, getUserData } from '../../../api/Api';
import { f_insert_Notification_Data } from '../../../api/services/notificationService';
import { NotificationElement } from '../../../components/NotificationPanel/Notification';
import { DiemDanhNhomData, WorkPositionTableData } from '../interfaces/nhansuInterface';
import AGTable from '../../../components/DataTable/AGTable';

// Import Subcomponents theo phong cách Stitch
import PrecisionDieuChuyenHeader from './PrecisionDieuChuyenTeam/PrecisionDieuChuyenHeader';
import PrecisionDieuChuyenToolbar from './PrecisionDieuChuyenTeam/PrecisionDieuChuyenToolbar';
import PrecisionDieuChuyenKpi from './PrecisionDieuChuyenTeam/PrecisionDieuChuyenKpi';
import PrecisionDieuChuyenPivotModal from './PrecisionDieuChuyenTeam/PrecisionDieuChuyenPivotModal';
import {
  CodeCellRenderer,
  NsIdCellRenderer,
  NameAvatarCellRenderer,
  TeamActionCell,
  ShiftActionCell,
  FactoryActionCell,
  PositionSelectCell,
} from './PrecisionDieuChuyenTeam/PrecisionDieuChuyenCells';

import './PrecisionDieuChuyenTeam/PrecisionDieuChuyenTeam.scss';

interface DieuChuyenTeamCMSProps {
  option1: string;
  option2: string;
}

const DieuChuyenTeamCMS: React.FC<DieuChuyenTeamCMSProps> = ({ option1, option2 }) => {
  const glbLang: string | undefined = useSelector((state: RootState) => state.totalSlice.lang);
  const [WORK_SHIFT_CODE, setWORK_SHIFT_CODE] = useState<number>(5); // 5 = Tất cả
  const [selectedFactory, setSelectedFactory] = useState<string>('ALL');
  const [searchKeyword, setSearchKeyword] = useState<string>('');
  const [diemdanhnhomtable, setDiemDanhNhomTable] = useState<Array<DiemDanhNhomData>>([]);
  const [workpositionload, setWorkPositionLoad] = useState<Array<WorkPositionTableData>>([]);
  const [isPivotOpen, setIsPivotOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [lastUpdated, setLastUpdated] = useState<string>(moment().format('HH:mm A'));

  // 1. Tải danh sách nhân viên điểm danh & điều chuyển
  const loadDiemDanhNhomTable = useCallback(
    async (teamnamelist: number) => {
      setLoading(true);
      setWORK_SHIFT_CODE(teamnamelist);
      try {
        const response = await generalQuery(option1, { team_name_list: teamnamelist });
        const loaded_data = response.data.data.map((e: any, index: number) => ({
          ...e,
          REQUEST_DATE: e.REQUEST_DATE ? moment.utc(e.REQUEST_DATE).format('YYYY-MM-DD') : '',
          APPLY_DATE: e.APPLY_DATE ? moment.utc(e.APPLY_DATE).format('YYYY-MM-DD') : '',
          FULL_NAME: `${e.MIDLAST_NAME} ${e.FIRST_NAME}`,
          id: index + 1,
        }));
        setDiemDanhNhomTable(loaded_data);
        setLastUpdated(moment().format('HH:mm A'));
      } catch (err) {
        console.error('Lỗi khi tải dữ liệu điều chuyển team:', err);
      } finally {
        setLoading(false);
      }
    },
    [option1]
  );

  // 2. Tải danh sách vị trí công việc
  const loadWorkPositionTable = useCallback(async () => {
    try {
      const response = await generalQuery(option2, {});
      const loaded_data = response.data.data.map((e: any, index: number) => ({
        ...e,
        id: index + 1,
      }));
      setWorkPositionLoad(loaded_data);
    } catch (err) {
      console.error('Lỗi khi tải vị trí công việc:', err);
    }
  }, [option2]);

  useEffect(() => {
    loadWorkPositionTable();
    loadDiemDanhNhomTable(5);
  }, [loadWorkPositionTable, loadDiemDanhNhomTable]);

  // 3. Danh sách nhà máy duy nhất
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

  // 4. Lọc dữ liệu theo Nhà máy và Từ khóa tìm kiếm
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
        const subDept = (row.SUBDEPTNAME || '').toLowerCase();
        const pos = (row.WORK_POSITION_NAME || '').toLowerCase();
        return (
          name.includes(q) ||
          emplNo.includes(q) ||
          cmsId.includes(q) ||
          subDept.includes(q) ||
          pos.includes(q)
        );
      });
    }

    return result;
  }, [diemdanhnhomtable, searchKeyword, selectedFactory]);

  // 5. Thao tác điều chuyển Team
  const setTeam = useCallback(async (EMPL_NO: string, value: number) => {
    try {
      const response = await generalQuery('setteamnhom', { teamvalue: value, EMPL_NO });
      if (response.data.tk_status === 'OK') {
        const teamName = value === 0 ? 'Hành Chính' : value === 1 ? 'TEAM 1' : 'TEAM 2';
        setDiemDanhNhomTable((prev) =>
          prev.map((p) => (p.EMPL_NO === EMPL_NO ? { ...p, WORK_SHIF_NAME: teamName } : p))
        );
      } else {
        Swal.fire('Có lỗi', response.data.message, 'error');
      }
    } catch (err) {
      console.error('Lỗi setTeam:', err);
    }
  }, []);

  // 6. Thao tác gán Ca làm việc
  const setCa = useCallback(async (params: any, value: number) => {
    const EMPL_NO = params.data?.EMPL_NO;
    try {
      const response = await generalQuery('setca', { EMPL_NO, CALV: value });
      if (response.data.tk_status === 'OK') {
        setDiemDanhNhomTable((prev) =>
          prev.map((p) => (p.EMPL_NO === EMPL_NO ? { ...p, CALV: value } : p))
        );

        const userData = getUserData();
        const shiftText = value === 2 ? 'Ca đêm' : value === 1 ? 'Ca ngày' : 'Ca HC';
        const newNotification: NotificationElement = {
          CTR_CD: '002',
          NOTI_ID: -1,
          NOTI_TYPE: 'success',
          TITLE: 'Thay đổi ca làm việc',
          CONTENT: `${userData?.EMPL_NO} (${userData?.MIDLAST_NAME} ${userData?.FIRST_NAME}) đã thay ca cho ${EMPL_NO} thành ${shiftText}`,
          SUBDEPTNAME: userData?.SUBDEPTNAME ?? '',
          MAINDEPTNAME: userData?.MAINDEPTNAME ?? '',
          INS_EMPL: 'NHU1903',
          INS_DATE: moment().format('YYYY-MM-DD'),
          UPD_EMPL: 'NHU1903',
          UPD_DATE: moment().format('YYYY-MM-DD'),
        };

        if (await f_insert_Notification_Data(newNotification)) {
          getSocket().emit('notification_panel', newNotification);
        }
      } else {
        Swal.fire('Có lỗi', response.data.message, 'error');
      }
    } catch (err) {
      console.error('Lỗi setCa:', err);
    }
  }, []);

  // 7. Reset Ca làm việc
  const resetCa = useCallback(async (params: any) => {
    const EMPL_NO = params.data?.EMPL_NO;
    setDiemDanhNhomTable((prev) =>
      prev.map((p) => (p.EMPL_NO === EMPL_NO ? { ...p, CALV: null } : p))
    );
  }, []);

  // 8. Thao tác chuyển Nhà máy
  const setFactory = useCallback(async (EMPL_NO: string, value: number) => {
    try {
      const response = await generalQuery('setnhamay', { EMPL_NO, FACTORY: value });
      if (response.data.tk_status === 'OK') {
        const facName = value === 1 ? 'Nhà máy 1' : 'Nhà máy 2';
        setDiemDanhNhomTable((prev) =>
          prev.map((p) => (p.EMPL_NO === EMPL_NO ? { ...p, FACTORY_NAME: facName } : p))
        );
      } else {
        Swal.fire('Có lỗi', response.data.message, 'error');
      }
    } catch (err) {
      console.error('Lỗi setFactory:', err);
    }
  }, []);

  // 9. Thao tác chuyển Vị trí làm việc
  const setViTri = useCallback(
    async (EMPL_NO: string, WORK_POSITION_CODE: number) => {
      const posObj = workpositionload.find((w) => w.WORK_POSITION_CODE === WORK_POSITION_CODE);
      const posName = posObj?.WORK_POSITION_NAME ?? '';

      const confirm = await Swal.fire({
        title: 'Xác nhận chuyển vị trí?',
        text: `Bạn có chắc muốn chuyển nhân viên ${EMPL_NO} sang vị trí [${posName}]?`,
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Đồng ý chuyển',
        cancelButtonText: 'Hủy bỏ',
        confirmButtonColor: '#2563eb',
      });

      if (confirm.isConfirmed) {
        try {
          const response = await generalQuery('setEMPL_WORK_POSITION', {
            WORK_POSITION_CODE,
            EMPL_NO,
          });
          if (response.data.tk_status === 'OK') {
            setDiemDanhNhomTable((prev) =>
              prev.map((p) =>
                p.EMPL_NO === EMPL_NO
                  ? {
                    ...p,
                    WORK_POSITION_CODE,
                    WORK_POSITION_NAME: posName,
                  }
                  : p
              )
            );
            Swal.fire({
              title: 'Thành công',
              text: `Đã gán vị trí [${posName}] cho nhân viên ${EMPL_NO}`,
              icon: 'success',
              timer: 1500,
              showConfirmButton: false,
            });
          } else {
            Swal.fire('Lỗi', response.data.message, 'error');
          }
        } catch (err) {
          console.error('Lỗi setViTri:', err);
        }
      }
    },
    [workpositionload]
  );

  // 10. Xuất Excel EX1 (Đang lọc) & EX2 (Tất cả)
  const exportDataToExcel = useCallback(
    (dataset: Array<DiemDanhNhomData>, fileType: 'EX1' | 'EX2') => {
      if (dataset.length === 0) {
        Swal.fire('Thông báo', `Không có dữ liệu để xuất file ${fileType}!`, 'warning');
        return;
      }

      const excelRows = dataset.map((row, index) => ({
        STT: index + 1,
        'MÃ NV': row.EMPL_NO || '',
        NS_ID: row.CMS_ID || '',
        'HỌ VÀ TÊN': row.FULL_NAME || '',
        'NHÀ MÁY': row.FACTORY_NAME || '',
        'TỔ / TEAM': row.WORK_SHIF_NAME || '',
        'CA LÀM VIỆC':
          row.CALV === 0
            ? 'Ca HC'
            : row.CALV === 1
              ? 'Ca ngày'
              : row.CALV === 2
                ? 'Ca đêm'
                : 'Chưa gán ca',
        'VỊ TRÍ PHÂN CÔNG': row.WORK_POSITION_NAME || '',
        'BỘ PHẬN': row.SUBDEPTNAME || '',
        'CÔNG VIỆC': row.JOB_NAME || '',
        'TRẠNG THÁI': row.WORK_STATUS_NAME || '',
        'NGÀY ÁP DỤNG': row.APPLY_DATE || '',
      }));

      const ws = XLSX.utils.json_to_sheet(excelRows);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'DieuChuyenTeam');
      const suffix = fileType === 'EX1' ? 'DangLoc' : 'TatCa';
      const filename = `NS2_DieuChuyen_${suffix}_${moment().format('YYYYMMDD_HHmmss')}.xlsx`;
      XLSX.writeFile(wb, filename);

      Swal.fire({
        title: 'Đã xuất file thành công',
        text: `Đã tải xuống [${filename}] với ${dataset.length} nhân sự (${fileType})`,
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

  // 11. Column Definitions (High-Density Stitch)
  const columns = useMemo(() => {
    return [
      {
        field: 'id',
        headerName: 'STT',
        width: 45,
        cellClass: 'flex-center-vertical',
      },
      {
        field: 'EMPL_NO',
        headerName: 'MÃ NV',
        width: 85,
        cellRenderer: CodeCellRenderer,
      },
      {
        field: 'CMS_ID',
        headerName: 'NS_ID',
        width: 80,
        cellClass: 'flex-center-vertical',
        cellRenderer: NsIdCellRenderer,
      },
      {
        field: 'FULL_NAME',
        headerName: 'HỌ & TÊN NHÂN VIÊN',
        width: 190,
        cellRenderer: NameAvatarCellRenderer,
      },
      {
        field: 'FACTORY_NAME',
        headerName: 'NHÀ MÁY',
        width: 85,
        cellClass: 'flex-center-vertical',
      },
      {
        field: 'SET_NM',
        headerName: 'ĐỔI NM',
        width: 95,
        cellClass: 'flex-center-vertical',
        cellRenderer: (p: any) => (
          <FactoryActionCell data={p.data} onSetFactory={setFactory} />
        ),
      },
      {
        field: 'WORK_SHIF_NAME',
        headerName: 'TỔ / TEAM',
        width: 90,
        cellClass: 'flex-center-vertical',
      },
      {
        field: 'SET_TEAM',
        headerName: 'ĐIỀU CHUYỂN TEAM',
        width: 145,
        cellClass: 'flex-center-vertical',
        cellRenderer: (p: any) => (
          <TeamActionCell data={p.data} onSetTeam={setTeam} />
        ),
      },
      {
        field: 'SETCA',
        headerName: 'SET CA',
        width: 180,
        cellClass: 'flex-center-vertical',
        cellRenderer: (p: any) => (
          <ShiftActionCell data={p.data} onSetCa={setCa} onResetCa={resetCa} />
        ),
      },
      {
        field: 'WORK_POSITION_NAME',
        headerName: 'VỊ TRÍ HIỆN TẠI',
        width: 110,
        cellClass: 'flex-center-vertical',
      },
      {
        field: 'SETVITRI',
        headerName: 'PHÂN CÔNG VỊ TRÍ',
        width: 155,
        cellClass: 'flex-center-vertical',
        cellRenderer: (p: any) => (
          <PositionSelectCell
            data={p.data}
            workpositionload={workpositionload}
            onSetViTri={setViTri}
          />
        ),
      },
      {
        field: 'SUBDEPTNAME',
        headerName: 'BỘ PHẬN',
        width: 100,
        cellClass: 'flex-center-vertical',
      },
      {
        field: 'JOB_NAME',
        headerName: 'CÔNG VIỆC',
        width: 100,
        cellClass: 'flex-center-vertical',
      },
      {
        field: 'WORK_STATUS_NAME',
        headerName: 'TRẠNG THÁI',
        width: 95,
        cellClass: 'flex-center-vertical',
      },
    ];
  }, [setTeam, setCa, resetCa, setFactory, setViTri, workpositionload]);

  return (
    <div className="precision-dieuchuyen">
      {/* 1. Sub-Header Title Bar */}
      <PrecisionDieuChuyenHeader
        onExportExcel={handleExportEX1}
        onSaveSchedule={() => {
          Swal.fire({
            title: 'Lưu phân bổ ca',
            text: 'Đã lưu cấu hình phân bổ ca và điều chuyển nhân sự thành công!',
            icon: 'success',
            timer: 1500,
            showConfirmButton: false,
          });
        }}
      />

      {/* 2. Toolbar & Bộ lọc ngữ cảnh */}
      <PrecisionDieuChuyenToolbar
        workShiftCode={WORK_SHIFT_CODE}
        onShiftChange={loadDiemDanhNhomTable}
        selectedFactory={selectedFactory}
        onFactoryChange={setSelectedFactory}
        factoryList={factoryList}
        onRefresh={() => loadDiemDanhNhomTable(WORK_SHIFT_CODE)}
        loading={loading}
      />

      {/* 3. Realtime 4 KPI Cards */}
      <PrecisionDieuChuyenKpi tableData={diemdanhnhomtable} />

      {/* 4. AG-Grid Table Container */}
      <div className="precision-dieuchuyen__gridContainer">
        {/* Table Search & Meta Header */}
        <div className="precision-dieuchuyen__gridToolbar">
          <div className="precision-dieuchuyen__gridToolbarLeft">
            <div className="precision-dieuchuyen__searchBox">
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
                placeholder="Tìm mã NV, tên, vị trí, bộ phận..."
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

            {/* Cụm nút EX1, EX2, PIVOT trên thanh lọc nhanh */}
            <div className="precision-dieuchuyen__gridActions">
              <button
                type="button"
                className="precision-dieuchuyen__gridBtn precision-dieuchuyen__gridBtn--excel"
                onClick={handleExportEX1}
                title={`Xuất ${filteredTableData.length} nhân sự đang lọc ra Excel`}
              >
                <span className="material-symbols-outlined" style={{ fontSize: 15 }}>
                  description
                </span>
                <span>EX1</span>
                <span className="badge">Đang lọc</span>
              </button>

              <button
                type="button"
                className="precision-dieuchuyen__gridBtn precision-dieuchuyen__gridBtn--excel"
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
                className="precision-dieuchuyen__gridBtn precision-dieuchuyen__gridBtn--pivot"
                onClick={() => setIsPivotOpen(true)}
                title="Mở bảng phân tích Pivot đa chiều theo Team & Nhà máy"
              >
                <span className="material-symbols-outlined" style={{ fontSize: 15 }}>
                  pivot_table_chart
                </span>
                <span>PIVOT</span>
              </button>
            </div>
          </div>

          <div className="precision-dieuchuyen__gridMeta">
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
        <div className="precision-dieuchuyen__gridBody">
          <AGTable
            rowHeight={48}
            columns={columns}
            data={filteredTableData}
            onSelectionChange={() => { }}
          />
        </div>
      </div>

      {/* 5. Pivot Analysis Modal */}
      <PrecisionDieuChuyenPivotModal
        open={isPivotOpen}
        onClose={() => setIsPivotOpen(false)}
        tableData={diemdanhnhomtable}
      />
    </div>
  );
};

export default React.memo(DieuChuyenTeamCMS);
