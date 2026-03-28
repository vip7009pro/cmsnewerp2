import { useCallback, useEffect, useMemo, useState } from 'react';
import { getCompany } from '../../../api/Api';
import { getlang } from '../../../components/String/String';
import moment from 'moment';
import { useSelector } from 'react-redux';
import { RootState } from '../../../redux/store';
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  Box
} from '@mui/material';
import AGTable from '../../../components/DataTable/AGTable';
import { DiemDanhNhomData } from '../interfaces/nhansuInterface';
import { f_getDiemDanhNhom, f_updateWorkHour } from '../utils/nhansuUtils';
import AttendanceCell from './components/AttendanceCell';
import OvertimeCell from './components/OvertimeCell';
import './DiemDanhNhom.scss';
import Swal from 'sweetalert2';

/* ==========================================================================
   Helper Cell Elements
   ========================================================================== */
const FullNameCellElement = (params: any) => {
  const on_off = params.data?.ON_OFF;
  const color = on_off === 1 ? 'green' : on_off === 0 ? 'red' : 'inherit';
  return (
    <Typography sx={{ fontSize: '0.6rem', fontWeight: 'bold', color }}>
      {params.data?.FULL_NAME}
    </Typography>
  );
};

const AvatarCellElement = (params: any) => {
  const empl_no = params.data?.EMPL_NO;
  if (!empl_no) return null;
  return (
    <Box
      component="img"
      sx={{ width: '100%', height: 80, objectFit: 'cover' }}
      src={`/Picture_NS/NS_${empl_no}.jpg`}
      alt={empl_no}
    />
  );
};

const DiemDanhNhomCMS = ({ option }: { option: string }) => {
  const glbLang: string | undefined = useSelector((state: RootState) => state.totalSlice.lang);
  const [WORK_SHIFT_CODE, setWORK_SHIFT_CODE] = useState(5); // Default to "Tất cả"
  const [diemdanhnhomtable, setDiemDanhNhomTable] = useState<Array<DiemDanhNhomData>>([]);

  const isCMS = getCompany() === "CMS";

  /* ==========================================================================
     Column Definitions (Unified)
     ========================================================================== */
  const columns_diemdanhnhom = useMemo(() => {
    const baseColumns = [
      { field: 'id', headerName: 'STT', width: 40 },
      { field: 'EMPL_NO', headerName: 'EMPL_NO', width: 60 },
      { field: 'CMS_ID', headerName: 'NS_ID', width: 60 },
      {
        field: 'FULL_NAME',
        headerName: 'FULL_NAME',
        width: 140,
        cellRenderer: FullNameCellElement,
      },
      {
        field: 'AVATAR',
        headerName: 'AVATAR',
        width: 80,
        cellRenderer: AvatarCellElement,
      },
      {
        field: 'DIEMDANH',
        headerName: 'DIEMDANH',
        width: 160,
        cellClass: 'flex-center-end-cell',
        cellRenderer: (params: any) => (
          <AttendanceCell
            data={params.data}
            tableData={diemdanhnhomtable}
            setTableData={setDiemDanhNhomTable}
          />
        ),
      },
      {
        field: 'TANGCA',
        headerName: 'TANGCA',
        minWidth: 200,
        flex: 1,
        cellClass: 'flex-center-end-cell',
        cellRenderer: (params: any) => (
          <OvertimeCell
            data={params.data}
            tableData={diemdanhnhomtable}
            setTableData={setDiemDanhNhomTable}
            isCMS={isCMS}
          />
        ),
      },
    ];

    const trailingColumns = [
      { field: 'PHONE_NUMBER', headerName: 'PHONE_NUMBER', width: 100 },
      { field: 'FACTORY_NAME', headerName: 'FACTORY_NAME', width: 100 },
      { field: 'JOB_NAME', headerName: 'JOB_NAME', width: 80 },
      { field: 'WORK_SHIF_NAME', headerName: 'TEAM', width: 80 },
      { field: 'WORK_POSITION_NAME', headerName: 'VI TRI', width: 80 },
      { field: 'SUBDEPTNAME', headerName: 'SUBDEPTNAME', width: 120 },
      { field: 'MAINDEPTNAME', headerName: 'MAINDEPTNAME', width: 120 },
      { field: 'REQUEST_DATE', headerName: 'REQ_DATE', width: 100 },
      { field: 'APPLY_DATE', headerName: 'APP_DATE', width: 100 },
      { field: 'APPROVAL_STATUS', headerName: 'STATUS', width: 100 },
      { field: 'REASON_NAME', headerName: 'REASON', width: 100 },
      { field: 'OFF_ID', headerName: 'OFF_ID', width: 80 },
      { field: 'CA_NGHI', headerName: 'CA_NGHI', width: 80 },
      { field: 'REMARK', headerName: 'REMARK', width: 100 },
    ];

    // Add WORK_HOUR if not CMS (based on the original logic)
    if (!isCMS) {
      baseColumns.push({ field: 'WORK_HOUR', headerName: 'WORK_HOUR', width: 100 } as any);
    }

    const finalColumns = [...baseColumns, ...trailingColumns].map((col: any) => ({
      ...col,
      cellClass: col.cellClass ? `${col.cellClass} flex-center-vertical` : 'flex-center-vertical'
    }));

    return finalColumns;
  }, [diemdanhnhomtable, isCMS]);

  /* ==========================================================================
     Handlers & API Calls
     ========================================================================== */
  const loadData = useCallback(async (shiftCode: number) => {
    setWORK_SHIFT_CODE(shiftCode);
    const loaded_data = await f_getDiemDanhNhom(option, shiftCode);
    setDiemDanhNhomTable(loaded_data);
    if (loaded_data.length > 0) {
      Swal.fire('Thông báo', `Đã load ${loaded_data.length} dòng`, 'success');
    }
  }, [option]);

  useEffect(() => {
    loadData(5); // Initial load: Tất cả
  }, [loadData]);

  /* ==========================================================================
     Main Render
     ========================================================================== */
  return (
    <Box className="diemdanhnhom">
      {/* Search Header */}
      <Box className="filterform" sx={{ p: 0.2, borderRadius: 1, display: 'flex', alignItems: 'center', height: 'fit-content' }}>
        <FormControl variant="outlined" size="small" sx={{ minWidth: 200, bgcolor: 'white', borderRadius: 1, height: '25px' }}>
          <InputLabel sx={{ fontSize: '0.75rem', top: '2px' }}>{getlang('calamviec', glbLang!)}</InputLabel>
          <Select
            label={getlang('calamviec', glbLang!)}
            value={WORK_SHIFT_CODE}
            onChange={(e) => loadData(Number(e.target.value))}
            sx={{ height: '28px', fontSize: '0.75rem' }}
          >
            <MenuItem value={0} sx={{ fontSize: '0.7rem' }}>TEAM 1 + Hành chính</MenuItem>
            <MenuItem value={1} sx={{ fontSize: '0.7rem' }}>TEAM 2 + Hành chính</MenuItem>
            <MenuItem value={2} sx={{ fontSize: '0.7rem' }}>TEAM 1</MenuItem>
            <MenuItem value={3} sx={{ fontSize: '0.7rem' }}>TEAM 2</MenuItem>
            <MenuItem value={4} sx={{ fontSize: '0.7rem' }}>Hành chính</MenuItem>
            <MenuItem value={5} sx={{ fontSize: '0.7rem' }}>Tất cả</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {/* Main Grid Workspace */}
      <Box className="maindept_table">
        <AGTable
          rowHeight={100}
          toolbar={<></>}
          columns={columns_diemdanhnhom}
          data={diemdanhnhomtable}
          onCellEditingStopped={(e: any) => {
            if (e.column.colId === 'WORK_HOUR') {
              if (e.data.ON_OFF === 1) {
                f_updateWorkHour(e.data, moment().format('YYYY-MM-DD'));
              } else {
                Swal.fire('Thông báo', `Nhân viên ${e.data.EMPL_NO} không đi làm, hãy điểm danh đi làm trước`, 'warning');
              }
            }
          }}
        />
      </Box>
    </Box>
  );
};

export default DiemDanhNhomCMS;
