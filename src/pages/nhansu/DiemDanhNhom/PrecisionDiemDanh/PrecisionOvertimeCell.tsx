import React from 'react';
import Swal from 'sweetalert2';
import moment from 'moment';
import { generalQuery, getSocket, getUserData } from '../../../../api/Api';
import { getErrMessage, getTkMessage, isTkOk } from '../../../../api/services/responseService';
import { f_insert_Notification_Data } from '../../../../api/services/notificationService';
import { NotificationElement } from '../../../../components/NotificationPanel/Notification';
import { DiemDanhNhomData } from '../../interfaces/nhansuInterface';

interface PrecisionOvertimeCellProps {
  data: DiemDanhNhomData;
  tableData: DiemDanhNhomData[];
  setTableData: (data: DiemDanhNhomData[]) => void;
  isCMS: boolean;
}

const PrecisionOvertimeCell: React.FC<PrecisionOvertimeCellProps> = ({
  data,
  tableData,
  setTableData,
  isCMS,
}) => {
  const onClick = (overtimeinfo: string) => {
    generalQuery('dangkytangcanhom', {
      tangcavalue: overtimeinfo === 'KTC' ? 0 : 1,
      EMPL_NO: data.EMPL_NO,
      overtime_info: overtimeinfo,
    })
      .then(async (response: any) => {
        if (isTkOk(response)) {
          const newProjects = tableData.map((p) =>
            p.EMPL_NO === data.EMPL_NO
              ? {
                  ...p,
                  OVERTIME: overtimeinfo === 'KTC' ? 0 : 1,
                  OVERTIME_INFO: overtimeinfo,
                }
              : p
          );

          const newNotification: NotificationElement = {
            CTR_CD: '002',
            NOTI_ID: -1,
            NOTI_TYPE: 'success',
            TITLE: 'Đăng ký tăng ca hộ',
            CONTENT: `${getUserData()?.EMPL_NO} (${
              getUserData()?.MIDLAST_NAME
            } ${getUserData()?.FIRST_NAME}), nhân viên ${
              getUserData()?.WORK_POSITION_NAME
            } đã đăng ký tăng ca cho ${data.EMPL_NO}_ ${data.MIDLAST_NAME} ${
              data.FIRST_NAME
            } ${overtimeinfo}`,
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
          Swal.fire('Có lỗi', 'Nội dung: ' + getTkMessage(response), 'error');
        }
      })
      .catch((error: any) => {
        console.error(error);
        Swal.fire('Lỗi', `Đăng ký tăng ca thất bại: ${getErrMessage(error)}`, 'error');
      });
  };

  const onReset = () => {
    const newProjects = tableData.map((p) =>
      p.EMPL_NO === data.EMPL_NO
        ? { ...p, OVERTIME: null, OVERTIME_INFO: null }
        : p
    );
    setTableData(newProjects);
  };

  if (data.OVERTIME === null) {
    const otOptions = isCMS
      ? [
          'KTC',
          '0500-0800',
          '1700-2000',
          '1700-1800',
          '1400-1800',
          '1600-2000',
          '0200-0600',
          '0200-0800',
          '1400-2000',
        ]
      : [
          'KTC',
          '0500-0800',
          '1700-2000',
          '1700-1800',
          '1400-1800',
          '1600-2000',
        ];

    return (
      <div className="cell-overtime">
        {otOptions.map((opt) => (
          <button
            key={opt}
            type="button"
            className={`btn-ot ${opt === 'KTC' ? 'btn-ot--ktc' : ''}`}
            onClick={() => onClick(opt)}
            title={`Đăng ký tăng ca: ${opt}`}
          >
            {opt === 'KTC' ? 'KTC' : opt.replace(/00/g, '')}
          </button>
        ))}
      </div>
    );
  }

  const overtimeText = (() => {
    if (!data.OVERTIME_INFO || data.OVERTIME_INFO === 'null') return '';
    if (data.OVERTIME_INFO === 'KTC') return 'Không tăng ca';
    return `+${data.OVERTIME_INFO}`;
  })();

  return (
    <div className="cell-attendance">
      <span className="badge-ot">{overtimeText}</span>
      <button
        type="button"
        className="btn-reset"
        onClick={onReset}
        title="Khôi phục trạng thái chưa đăng ký OT"
      >
        Reset
      </button>
    </div>
  );
};

export default React.memo(PrecisionOvertimeCell);
