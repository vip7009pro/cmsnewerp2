import React from 'react';
import { Button, Typography } from '@mui/material';
import { DiemDanhNhomData } from '../../interfaces/nhansuInterface';

interface ShiftCellProps {
  data: DiemDanhNhomData;
  onSetCa: (params: any, value: number) => void;
  onResetCa: (params: any) => void;
}

const ShiftCell: React.FC<ShiftCellProps> = ({ data, onSetCa, onResetCa }) => {
  if (data.CALV === null) {
    return (
      <div className="calvdiv">
        <Button size="small" variant="contained" className="tcbutton" onClick={() => onSetCa({ data }, 0)}>
          Ca HC
        </Button>
        <Button size="small" variant="contained" className="tcbutton" onClick={() => onSetCa({ data }, 1)}>
          Ca ngày
        </Button>
        <Button size="small" variant="contained" className="tcbutton" onClick={() => onSetCa({ data }, 2)}>
          Ca đêm
        </Button>
      </div>
    );
  }

  return (
    <div className="onoffdiv">
      <Typography sx={{ fontSize: '0.75rem', fontWeight: 'bold', mr: 1 }} className={`onoffshowtext A${data.CALV}`}>
        {data.CALV === 0 ? "Ca HC" : data.CALV === 1 ? "Ca ngày" : data.CALV === 2 ? "Ca đêm" : "Chưa có ca"}
      </Typography>
      <Button size="small" variant="outlined" className="resetbutton" onClick={() => onResetCa({ data })}>
        RESET
      </Button>
    </div>
  );
};

export default ShiftCell;
