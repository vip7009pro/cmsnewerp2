import React, { useMemo } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Chip,
  Box,
} from '@mui/material';
import { DiemDanhNhomData } from '../../interfaces/nhansuInterface';

interface PrecisionPivotModalProps {
  open: boolean;
  onClose: () => void;
  tableData: DiemDanhNhomData[];
}

const PrecisionPivotModal: React.FC<PrecisionPivotModalProps> = ({
  open,
  onClose,
  tableData,
}) => {
  const pivotByTeam = useMemo(() => {
    const groups: Record<
      string,
      { team: string; total: number; present: number; absent: number }
    > = {};

    tableData.forEach((row) => {
      const team = row.WORK_SHIF_NAME || 'Chưa phân ca';
      if (!groups[team]) {
        groups[team] = { team, total: 0, present: 0, absent: 0 };
      }
      groups[team].total += 1;
      if (row.ON_OFF === 1) {
        groups[team].present += 1;
      } else if (row.ON_OFF === 0) {
        groups[team].absent += 1;
      }
    });

    return Object.values(groups);
  }, [tableData]);

  const pivotByJob = useMemo(() => {
    const groups: Record<
      string,
      { job: string; total: number; present: number; absent: number }
    > = {};

    tableData.forEach((row) => {
      const job = row.JOB_NAME || 'Khác';
      if (!groups[job]) {
        groups[job] = { job, total: 0, present: 0, absent: 0 };
      }
      groups[job].total += 1;
      if (row.ON_OFF === 1) {
        groups[job].present += 1;
      } else if (row.ON_OFF === 0) {
        groups[job].absent += 1;
      }
    });

    return Object.values(groups);
  }, [tableData]);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: '12px',
          boxShadow: '0 20px 25px -5px rgba(15, 23, 42, 0.15)',
        },
      }}
    >
      <DialogTitle
        sx={{
          fontSize: '14px',
          fontWeight: 800,
          fontFamily: 'Plus Jakarta Sans, sans-serif',
          color: '#0f172a',
          borderBottom: '1px solid #e2e8f0',
          py: 1.5,
          display: 'flex',
          alignItems: 'center',
          gap: 1,
        }}
      >
        <span className="material-symbols-outlined" style={{ fontSize: 20, color: '#2563eb' }}>
          pivot_table_chart
        </span>
        <span>Phân Tích Đa Chiều Pivot - Quân Số &amp; Tỷ Lệ Điểm Danh</span>
      </DialogTitle>

      <DialogContent sx={{ p: 2 }}>
        {/* Bảng 1: Thống kê theo Team/Ca */}
        <Box sx={{ mb: 2.5 }}>
          <Box
            sx={{
              fontSize: '12px',
              fontWeight: 700,
              color: '#334155',
              mb: 1,
              display: 'flex',
              alignItems: 'center',
              gap: 0.5,
            }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: 16, color: '#f59e0b' }}>
              schedule
            </span>
            <span>1. Thống kê theo Ca Kíp / Team:</span>
          </Box>
          <Table size="small" sx={{ border: '1px solid #e2e8f0', borderRadius: '6px', overflow: 'hidden' }}>
            <TableHead sx={{ bgcolor: '#f8fafc' }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 700, fontSize: '11px', color: '#475569' }}>CA / TEAM</TableCell>
                <TableCell align="center" sx={{ fontWeight: 700, fontSize: '11px', color: '#475569' }}>TỔNG SỐ</TableCell>
                <TableCell align="center" sx={{ fontWeight: 700, fontSize: '11px', color: '#059669' }}>ĐI LÀM</TableCell>
                <TableCell align="center" sx={{ fontWeight: 700, fontSize: '11px', color: '#e11d48' }}>VẮNG</TableCell>
                <TableCell align="center" sx={{ fontWeight: 700, fontSize: '11px', color: '#2563eb' }}>TỶ LỆ CÓ MẶT</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {pivotByTeam.map((row) => {
                const rate = row.total > 0 ? ((row.present / row.total) * 100).toFixed(1) : '0.0';
                return (
                  <TableRow key={row.team} hover>
                    <TableCell sx={{ fontSize: '11.5px', fontWeight: 600 }}>{row.team}</TableCell>
                    <TableCell align="center" sx={{ fontSize: '11.5px', fontWeight: 700 }}>{row.total}</TableCell>
                    <TableCell align="center" sx={{ fontSize: '11.5px', fontWeight: 700, color: '#059669' }}>{row.present}</TableCell>
                    <TableCell align="center" sx={{ fontSize: '11.5px', fontWeight: 700, color: '#e11d48' }}>{row.absent}</TableCell>
                    <TableCell align="center">
                      <Chip
                        size="small"
                        label={`${rate}%`}
                        sx={{
                          height: 20,
                          fontSize: '10.5px',
                          fontWeight: 700,
                          bgcolor: Number(rate) >= 80 ? '#ecfdf5' : '#fff1f2',
                          color: Number(rate) >= 80 ? '#047857' : '#be123c',
                          border: `1px solid ${Number(rate) >= 80 ? '#a7f3d0' : '#fecdd3'}`,
                        }}
                      />
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </Box>

        {/* Bảng 2: Thống kê theo Chức vụ */}
        <Box>
          <Box
            sx={{
              fontSize: '12px',
              fontWeight: 700,
              color: '#334155',
              mb: 1,
              display: 'flex',
              alignItems: 'center',
              gap: 0.5,
            }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: 16, color: '#2563eb' }}>
              badge
            </span>
            <span>2. Thống kê theo Chức Danh / Vị Trí:</span>
          </Box>
          <Table size="small" sx={{ border: '1px solid #e2e8f0', borderRadius: '6px', overflow: 'hidden' }}>
            <TableHead sx={{ bgcolor: '#f8fafc' }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 700, fontSize: '11px', color: '#475569' }}>CHỨC DANH</TableCell>
                <TableCell align="center" sx={{ fontWeight: 700, fontSize: '11px', color: '#475569' }}>TỔNG SỐ</TableCell>
                <TableCell align="center" sx={{ fontWeight: 700, fontSize: '11px', color: '#059669' }}>ĐI LÀM</TableCell>
                <TableCell align="center" sx={{ fontWeight: 700, fontSize: '11px', color: '#e11d48' }}>VẮNG</TableCell>
                <TableCell align="center" sx={{ fontWeight: 700, fontSize: '11px', color: '#2563eb' }}>TỶ LỆ CÓ MẶT</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {pivotByJob.map((row) => {
                const rate = row.total > 0 ? ((row.present / row.total) * 100).toFixed(1) : '0.0';
                return (
                  <TableRow key={row.job} hover>
                    <TableCell sx={{ fontSize: '11.5px', fontWeight: 600 }}>{row.job}</TableCell>
                    <TableCell align="center" sx={{ fontSize: '11.5px', fontWeight: 700 }}>{row.total}</TableCell>
                    <TableCell align="center" sx={{ fontSize: '11.5px', fontWeight: 700, color: '#059669' }}>{row.present}</TableCell>
                    <TableCell align="center" sx={{ fontSize: '11.5px', fontWeight: 700, color: '#e11d48' }}>{row.absent}</TableCell>
                    <TableCell align="center">
                      <Chip
                        size="small"
                        label={`${rate}%`}
                        sx={{
                          height: 20,
                          fontSize: '10.5px',
                          fontWeight: 700,
                          bgcolor: Number(rate) >= 80 ? '#ecfdf5' : '#fff1f2',
                          color: Number(rate) >= 80 ? '#047857' : '#be123c',
                          border: `1px solid ${Number(rate) >= 80 ? '#a7f3d0' : '#fecdd3'}`,
                        }}
                      />
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </Box>
      </DialogContent>

      <DialogActions sx={{ borderTop: '1px solid #e2e8f0', px: 2, py: 1 }}>
        <Button
          onClick={onClose}
          size="small"
          sx={{
            textTransform: 'none',
            fontWeight: 600,
            fontSize: '12px',
            color: '#475569',
          }}
        >
          Đóng
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default React.memo(PrecisionPivotModal);
