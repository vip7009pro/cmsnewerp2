import React from 'react';
import { FormControl, Select, MenuItem } from '@mui/material';
import { DiemDanhNhomData, WorkPositionTableData } from '../../interfaces/nhansuInterface';

interface PositionCellProps {
  data: DiemDanhNhomData;
  workpositionload: WorkPositionTableData[];
  onSetViTri: (EMPL_NO: string, WORK_POSITION_CODE: number) => void;
}

const PositionCell: React.FC<PositionCellProps> = ({ data, workpositionload, onSetViTri }) => {
  return (
    <div className="onoffdiv">
      <FormControl variant="outlined" size="small" sx={{ minWidth: 100, bgcolor: 'white' }}>
        <Select
          value={data.WORK_POSITION_CODE ?? ''}
          onChange={(e) => onSetViTri(data.EMPL_NO, Number(e.target.value))}
          sx={{ height: '24px', fontSize: '0.7rem' }}
        >
          {workpositionload.map((element) => (
            <MenuItem key={element.WORK_POSITION_CODE} value={element.WORK_POSITION_CODE} sx={{ fontSize: '0.7rem' }}>
              {element.WORK_POSITION_NAME}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </div>
  );
};

export default PositionCell;
