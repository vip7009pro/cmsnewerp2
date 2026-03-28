import React from 'react';
import { Button } from '@mui/material';
import { DiemDanhNhomData } from '../../interfaces/nhansuInterface';

interface FactoryCellProps {
  data: DiemDanhNhomData;
  onSetFactory: (EMPL_NO: string, value: number) => void;
}

const FactoryCell: React.FC<FactoryCellProps> = ({ data, onSetFactory }) => {
  if (data.FACTORY_NAME === "Nhà máy 1") {
    return (
      <div className="onoffdiv">
        <Button size="small" variant="contained" className="team2bt" onClick={() => onSetFactory(data.EMPL_NO, 2)}>
          SET NM2
        </Button>
      </div>
    );
  } else if (data.FACTORY_NAME === "Nhà máy 2") {
    return (
      <div className="onoffdiv">
        <Button size="small" variant="contained" className="hcbt" onClick={() => onSetFactory(data.EMPL_NO, 1)}>
          SET NM1
        </Button>
      </div>
    );
  } else {
    return (
      <div className="onoffdiv">
        <Button size="small" variant="contained" className="team1bt" onClick={() => onSetFactory(data.EMPL_NO, 1)}>
          SET NM1
        </Button>
        <Button size="small" variant="contained" className="hcbt" onClick={() => onSetFactory(data.EMPL_NO, 2)}>
          SET NM2
        </Button>
      </div>
    );
  }
};

export default FactoryCell;
