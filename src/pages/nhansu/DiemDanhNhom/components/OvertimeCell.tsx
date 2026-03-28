import React from 'react';
import Swal from 'sweetalert2';
import moment from 'moment';
import { Button, Typography } from '@mui/material';
import { generalQuery, getSocket, getUserData } from '../../../../api/Api';
import { f_insert_Notification_Data } from "../../../../api/services/notificationService";
import { NotificationElement } from '../../../../components/NotificationPanel/Notification';
import { DiemDanhNhomData } from '../../interfaces/nhansuInterface';

interface OvertimeCellProps {
  data: DiemDanhNhomData;
  tableData: DiemDanhNhomData[];
  setTableData: (data: DiemDanhNhomData[]) => void;
  isCMS: boolean;
}

const OvertimeCell: React.FC<OvertimeCellProps> = ({ data, tableData, setTableData, isCMS }) => {
  const onClick = (overtimeinfo: string) => {
    generalQuery('dangkytangcanhom', {
      tangcavalue: overtimeinfo === 'KTC' ? 0 : 1,
      EMPL_NO: data.EMPL_NO,
      overtime_info: overtimeinfo,
    })
      .then(async (response: any) => {
        if (response.data.tk_status === 'OK') {
          const newProjects = tableData.map((p) => p.EMPL_NO === data.EMPL_NO ? { ...p, OVERTIME: overtimeinfo === 'KTC' ? 0 : 1, OVERTIME_INFO: overtimeinfo } : p);
          
          let newNotification: NotificationElement = {
            CTR_CD: '002',
            NOTI_ID: -1,
            NOTI_TYPE: 'success',
            TITLE: 'Đăng ký tăng ca hộ',
            CONTENT: `${getUserData()?.EMPL_NO} (${getUserData()?.MIDLAST_NAME} ${getUserData()?.FIRST_NAME}), nhân viên ${getUserData()?.WORK_POSITION_NAME} đã đăng ký tăng ca cho ${data.EMPL_NO}_ ${data.MIDLAST_NAME} ${data.FIRST_NAME} ${overtimeinfo}`,
            SUBDEPTNAME: getUserData()?.SUBDEPTNAME ?? '',
            MAINDEPTNAME: getUserData()?.MAINDEPTNAME ?? '',
            INS_EMPL: 'NHU1903',
            INS_DATE: moment().format('YYYY-MM-DD'),
            UPD_EMPL: 'NHU1903',
            UPD_DATE: moment().format('YYYY-MM-DD'),
          };
          
          if (await f_insert_Notification_Data(newNotification)) {
            getSocket().emit('notification_panel', newNotification);
          }
          setTableData(newProjects);
        } else {
          Swal.fire('Có lỗi', 'Nội dung: ' + response.data.message, 'error');
        }
      })
      .catch((error: any) => {
        console.error(error);
      });
  };

  const onReset = () => {
    const newProjects = tableData.map((p) => (p.EMPL_NO === data.EMPL_NO ? { ...p, OVERTIME: null, OVERTIME_INFO: null } : p));
    setTableData(newProjects);
  };

  if (data.OVERTIME === null) {
    const otOptions = isCMS 
      ? ['KTC', '0500-0800', '1700-2000', '1700-1800', '1400-1800', '1600-2000', '0200-0600', '0200-0800', '1400-2000']
      : ['KTC', '0500-0800', '1700-2000', '1700-1800', '1400-1800', '1600-2000'];

    return (
      <div className="onoffdiv flex flex-wrap gap-1 items-center justify-end p-1">
        {otOptions.map((opt) => (
          <Button key={opt} size="small" variant="contained" className="tcbutton" onClick={() => onClick(opt)}>
             {opt === 'KTC' ? 'KTC' : opt.replace('00', '').replace('00', '')}
          </Button>
        ))}
      </div>
    );
  }

  return (
    <div className="onoffdiv flex items-center justify-end px-2 gap-2">
      <Typography sx={{ fontSize: '0.75rem', fontWeight: 'bold', color: data.OVERTIME === 1 ? 'green' : 'red' }}>
        {data.OVERTIME_INFO}
      </Typography>
      <Button size="small" variant="outlined" className="resetbutton" onClick={onReset}>
        RESET
      </Button>
    </div>
  );
};

export default OvertimeCell;
