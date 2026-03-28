import React from 'react';
import { Button } from '@mui/material';
import { DiemDanhNhomData } from '../../interfaces/nhansuInterface';

interface TeamCellProps {
  data: DiemDanhNhomData;
  onSetTeam: (EMPL_NO: string, value: number) => void;
}

const TeamCell: React.FC<TeamCellProps> = ({ data, onSetTeam }) => {
  if (data.WORK_SHIF_NAME === "Hành Chính") {
    return (
      <div className="onoffdiv">
        <Button size="small" variant="contained" className="team1bt" onClick={() => onSetTeam(data.EMPL_NO, 1)}>
          TEAM1
        </Button>
        <Button size="small" variant="contained" className="team2bt" onClick={() => onSetTeam(data.EMPL_NO, 2)}>
          TEAM2
        </Button>
      </div>
    );
  } else if (data.WORK_SHIF_NAME === "TEAM 1") {
    return (
      <div className="onoffdiv">
        <Button size="small" variant="contained" className="hcbt" onClick={() => onSetTeam(data.EMPL_NO, 0)}>
          HanhChinh
        </Button>
        <Button size="small" variant="contained" className="team2bt" onClick={() => onSetTeam(data.EMPL_NO, 2)}>
          TEAM2
        </Button>
      </div>
    );
  } else {
    return (
      <div className="onoffdiv">
        <Button size="small" variant="contained" className="team1bt" onClick={() => onSetTeam(data.EMPL_NO, 1)}>
          TEAM1
        </Button>
        <Button size="small" variant="contained" className="hcbt" onClick={() => onSetTeam(data.EMPL_NO, 0)}>
          HanhChinh
        </Button>
      </div>
    );
  }
};

export default TeamCell;
