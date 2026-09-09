import React, { useMemo } from "react";
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
  Typography,
  Box,
} from "@mui/material";
import { DiemDanhLichSuData } from "../../interfaces/nhansuInterface";

interface PrecisionLichSuPivotModalProps {
  open: boolean;
  onClose: () => void;
  data: DiemDanhLichSuData[];
}

export const PrecisionLichSuPivotModal: React.FC<PrecisionLichSuPivotModalProps> = ({
  open,
  onClose,
  data,
}) => {
  // 1. Phân tích theo Thứ trong tuần
  const weekdayStats = useMemo(() => {
    const daysOrder = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
    const statsMap = new Map<
      string,
      {
        totalDays: number;
        workDays: number;
        offDays: number;
        lateCount: number;
        earlyOutCount: number;
        totalWorkingMins: number;
        totalOtMins: number;
      }
    >();

    for (const d of daysOrder) {
      statsMap.set(d, {
        totalDays: 0,
        workDays: 0,
        offDays: 0,
        lateCount: 0,
        earlyOutCount: 0,
        totalWorkingMins: 0,
        totalOtMins: 0,
      });
    }

    for (const item of data) {
      const w = item.WEEKDAY || "Other";
      if (!statsMap.has(w)) {
        statsMap.set(w, {
          totalDays: 0,
          workDays: 0,
          offDays: 0,
          lateCount: 0,
          earlyOutCount: 0,
          totalWorkingMins: 0,
          totalOtMins: 0,
        });
      }
      const cur = statsMap.get(w)!;
      cur.totalDays += 1;
      if (item.ON_OFF === 1) cur.workDays += 1;
      if (item.ON_OFF === 0) cur.offDays += 1;
      if (Number(item.LATE_IN_MINUTES || 0) > 0) cur.lateCount += 1;
      if (Number(item.EARLY_OUT_MINUTES || 0) > 0) cur.earlyOutCount += 1;
      cur.totalWorkingMins += Number(item.WORKING_MINUTES || 0);
      cur.totalOtMins += Number(item.FINAL_OVERTIMES || 0);
    }

    return Array.from(statsMap.entries()).filter(([_, v]) => v.totalDays > 0);
  }, [data]);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle sx={{ p: "10px 16px", borderBottom: "1px solid #e2e8f0" }}>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Typography variant="subtitle1" fontWeight={700} color="#0f172a">
            PHÂN TÍCH ĐA CHIỀU LỊCH SỬ ĐI LÀM (PIVOT SUMMARY)
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Tổng cộng: {data.length} bản ghi
          </Typography>
        </Box>
      </DialogTitle>

      <DialogContent sx={{ p: 2, display: "flex", flexDirection: "column", gap: 2 }}>
        <Box>
          <Typography variant="body2" fontWeight={700} color="#1e293b" mb={1}>
            1. Thống kê theo ngày trong tuần (Weekday Distribution)
          </Typography>
          <Table size="small" sx={{ border: "1px solid #e2e8f0" }}>
            <TableHead sx={{ background: "#f8fafc" }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 700, fontSize: "11px" }}>Thứ</TableCell>
                <TableCell align="center" sx={{ fontWeight: 700, fontSize: "11px" }}>Tổng ngày</TableCell>
                <TableCell align="center" sx={{ fontWeight: 700, fontSize: "11px", color: "#059669" }}>Đi làm</TableCell>
                <TableCell align="center" sx={{ fontWeight: 700, fontSize: "11px", color: "#dc2626" }}>Nghỉ làm</TableCell>
                <TableCell align="center" sx={{ fontWeight: 700, fontSize: "11px", color: "#d97706" }}>Đi muộn (lần)</TableCell>
                <TableCell align="center" sx={{ fontWeight: 700, fontSize: "11px", color: "#d97706" }}>Về sớm (lần)</TableCell>
                <TableCell align="right" sx={{ fontWeight: 700, fontSize: "11px", color: "#2563eb" }}>Giờ HC (h)</TableCell>
                <TableCell align="right" sx={{ fontWeight: 700, fontSize: "11px", color: "#7c3aed" }}>Giờ OT (h)</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {weekdayStats.map(([weekday, st]) => (
                <TableRow key={weekday} hover>
                  <TableCell sx={{ fontSize: "11px", fontWeight: weekday === "Sunday" ? 700 : 500, color: weekday === "Sunday" ? "#dc2626" : "inherit" }}>
                    {weekday}
                  </TableCell>
                  <TableCell align="center" sx={{ fontSize: "11px", fontFamily: "monospace" }}>{st.totalDays}</TableCell>
                  <TableCell align="center" sx={{ fontSize: "11px", fontFamily: "monospace", color: "#059669", fontWeight: 700 }}>{st.workDays}</TableCell>
                  <TableCell align="center" sx={{ fontSize: "11px", fontFamily: "monospace", color: "#dc2626" }}>{st.offDays}</TableCell>
                  <TableCell align="center" sx={{ fontSize: "11px", fontFamily: "monospace", color: st.lateCount > 0 ? "#dc2626" : "#94a3b8" }}>{st.lateCount}</TableCell>
                  <TableCell align="center" sx={{ fontSize: "11px", fontFamily: "monospace", color: st.earlyOutCount > 0 ? "#dc2626" : "#94a3b8" }}>{st.earlyOutCount}</TableCell>
                  <TableCell align="right" sx={{ fontSize: "11px", fontFamily: "monospace", fontWeight: 600 }}>{(st.totalWorkingMins / 60).toFixed(1)}</TableCell>
                  <TableCell align="right" sx={{ fontSize: "11px", fontFamily: "monospace", fontWeight: 600, color: "#7c3aed" }}>{(st.totalOtMins / 60).toFixed(1)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: "8px 16px", borderTop: "1px solid #e2e8f0" }}>
        <Button onClick={onClose} variant="outlined" size="small">
          Đóng
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default PrecisionLichSuPivotModal;
