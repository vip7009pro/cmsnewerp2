import React from 'react';
import Swal from 'sweetalert2';
import moment from 'moment';
import { Button, Typography } from '@mui/material';
import { generalQuery, getSocket, getUserData } from '../../../../api/Api';
import { f_insert_Notification_Data } from "../../../../api/services/notificationService";
import { NotificationElement } from '../../../../components/NotificationPanel/Notification';
import { DiemDanhNhomData } from '../../interfaces/nhansuInterface';

interface AttendanceCellProps {
  data: DiemDanhNhomData;
  tableData: DiemDanhNhomData[];
  setTableData: (data: DiemDanhNhomData[]) => void;
}

const AttendanceCell: React.FC<AttendanceCellProps> = ({ data, tableData, setTableData }) => {
  const dangkynghi_auto = (REASON_CODE: number) => {
    const insertData = {
      canghi: 1,
      reason_code: REASON_CODE,
      remark_content: 'AUTO',
      ngaybatdau: moment().format('YYYY-MM-DD'),
      ngayketthuc: moment().format('YYYY-MM-DD'),
      EMPL_NO: data.EMPL_NO,
    };
    generalQuery('dangkynghi2_AUTO', insertData)
      .then((response: any) => {
        if (response.data.tk_status === 'OK') {
          const newProjects = tableData.map((p) => (p.EMPL_NO === data.EMPL_NO ? { ...p, ON_OFF: 0, REASON_NAME: 'AUTO' } : p));
          setTableData(newProjects);
          Swal.fire('Thông báo', 'Người này nghỉ ko đăng ký, auto đăng ký nghỉ!', 'warning');
        } else {
          Swal.fire('Lỗi', 'Người này nghỉ ko đăng ký, auto chuyển nghỉ, tuy nhiên thao tác thất bại ! ' + response.data.message, 'error');
        }
      })
      .catch((error: any) => {
        console.error(error);
      });
  };

  const xoadangkynghi_auto = () => {
    generalQuery('xoadangkynghi_AUTO', { EMPL_NO: data.EMPL_NO })
      .then((response: any) => {
        if (response.data.tk_status !== 'OK') {
          console.error("Xóa đăng ký nghỉ AUTO thất bại");
        }
      })
      .catch((error: any) => {
        console.error(error);
      });
  };

  const onClick = async (type: number, calv?: number) => {
    // Check constraints if any. The original code had a checkcurrentDAYSHIFT commented out.
    if (type === 1) {
      if (data.OFF_ID === null || data.REASON_NAME === 'Nửa phép') {
        generalQuery('setdiemdanhnhom', {
          diemdanhvalue: type,
          EMPL_NO: data.EMPL_NO,
          CURRENT_TEAM: data.WORK_SHIF_NAME === 'Hành Chính' ? 0 : data.WORK_SHIF_NAME === 'TEAM 1' ? 1 : 2,
          CURRENT_CA: data.WORK_SHIF_NAME === 'Hành Chính' ? 0 : calv,
        })
          .then(async (response: any) => {
            if (response.data.tk_status === 'OK') {
              const newProjects = tableData.map((p) => (p.EMPL_NO === data.EMPL_NO ? { ...p, ON_OFF: type } : p));
              setTableData(newProjects);
            } else {
              Swal.fire('Có lỗi', 'Nội dung: ' + response.data.message, 'error');
            }
          })
          .catch((error: any) => {
            console.error(error);
          });
      } else {
        Swal.fire('Có lỗi', 'Đã đăng ký nghỉ rồi, không điểm danh được', 'error');
        return;
      }
    } else if (type === 0 || type === 2) {
      const diemdanhvalue = type === 2 ? 0 : type;
      const reasonCode = type === 2 ? 5 : 3;
      generalQuery('setdiemdanhnhom', {
        diemdanhvalue: diemdanhvalue,
        EMPL_NO: data.EMPL_NO,
        CURRENT_TEAM: data.WORK_SHIF_NAME === 'Hành Chính' ? 0 : data.WORK_SHIF_NAME === 'TEAM 1' ? 1 : 2,
        CURRENT_CA: data.WORK_SHIF_NAME === 'Hành Chính' ? 0 : calv,
      })
        .then((response: any) => {
          if (response.data.tk_status === 'OK') {
            const newProjects = tableData.map((p) => (p.EMPL_NO === data.EMPL_NO ? { ...p, ON_OFF: 0 } : p));
            if (data.OFF_ID === null) {
              dangkynghi_auto(reasonCode);
            }
            setTableData(newProjects);
          } else {
            Swal.fire('Có lỗi', 'Nội dung: ' + response.data.message, 'error');
          }
        })
        .catch((error: any) => {
          console.error(error);
        });
    }

    const newNotification: NotificationElement = {
      CTR_CD: '002',
      NOTI_ID: -1,
      NOTI_TYPE: 'success',
      TITLE: 'Điểm danh thủ công',
      CONTENT: `${getUserData()?.EMPL_NO} (${getUserData()?.MIDLAST_NAME} ${getUserData()?.FIRST_NAME}), nhân viên ${getUserData()?.WORK_POSITION_NAME} đã điểm danh thủ công cho ${data.EMPL_NO}_ ${data.MIDLAST_NAME} ${data.FIRST_NAME} ${type === 1 ? 'đi làm' : 'nghỉ'}`,
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
  };

  const onReset = () => {
    if (data.REMARK === 'AUTO') {
      const newProjects = tableData.map((p) => (p.EMPL_NO === data.EMPL_NO ? { ...p, ON_OFF: null, OFF_ID: null, REASON_NAME: null } : p));
      setTableData(newProjects);
      xoadangkynghi_auto();
    } else {
      const newProjects = tableData.map((p) => (p.EMPL_NO === data.EMPL_NO ? { ...p, ON_OFF: null } : p));
      setTableData(newProjects);
    }
  };

  if (data.ON_OFF === null) {
    return (
      <div className="onoffdiv flex flex-col gap-1 items-end">
        <div className="flex gap-1">
          <Button size="small" variant="contained" className="onbutton" onClick={() => onClick(1, 1)}>
            Làm Ngày
          </Button>
          <Button size="small" variant="contained" className="onbutton" onClick={() => onClick(1, 2)}>
            Làm Đêm
          </Button>
        </div>
        <div className="flex gap-1">
          <Button size="small" variant="contained" className="offbutton" onClick={() => onClick(0, 1)}>
            Nghỉ
          </Button>
          <Button size="small" variant="contained" className="off50button" onClick={() => onClick(2)}>
            50%
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="onoffdiv flex items-center justify-end px-2 gap-2">
      <Typography sx={{ fontSize: '0.75rem', fontWeight: 'bold', color: data.ON_OFF === 1 ? 'green' : 'red' }}>
        {data.ON_OFF === 1 ? 'Đi làm' : 'Nghỉ làm'}
      </Typography>
      <Button size="small" variant="outlined" className="resetbutton" onClick={onReset}>
        RESET
      </Button>
    </div>
  );
};

export default AttendanceCell;
