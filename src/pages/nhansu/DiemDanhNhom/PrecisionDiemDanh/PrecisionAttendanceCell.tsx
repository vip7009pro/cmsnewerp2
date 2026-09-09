import React from 'react';
import Swal from 'sweetalert2';
import moment from 'moment';
import { generalQuery, getSocket, getUserData } from '../../../../api/Api';
import { f_insert_Notification_Data } from '../../../../api/services/notificationService';
import { NotificationElement } from '../../../../components/NotificationPanel/Notification';
import { DiemDanhNhomData } from '../../interfaces/nhansuInterface';

interface PrecisionAttendanceCellProps {
  data: DiemDanhNhomData;
  tableData: DiemDanhNhomData[];
  setTableData: (data: DiemDanhNhomData[]) => void;
}

const PrecisionAttendanceCell: React.FC<PrecisionAttendanceCellProps> = ({
  data,
  tableData,
  setTableData,
}) => {
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
          const newProjects = tableData.map((p) =>
            p.EMPL_NO === data.EMPL_NO
              ? { ...p, ON_OFF: 0, REASON_NAME: 'AUTO' }
              : p
          );
          setTableData(newProjects);
          Swal.fire(
            'Thông báo',
            'Người này nghỉ ko đăng ký, auto đăng ký nghỉ!',
            'warning'
          );
        } else {
          Swal.fire(
            'Lỗi',
            'Người này nghỉ ko đăng ký, auto chuyển nghỉ, tuy nhiên thao tác thất bại! ' +
              response.data.message,
            'error'
          );
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
          console.error('Xóa đăng ký nghỉ AUTO thất bại');
        }
      })
      .catch((error: any) => {
        console.error(error);
      });
  };

  const onClick = async (type: number, calv?: number) => {
    if (type === 1) {
      if (data.OFF_ID === null || data.REASON_NAME === 'Nửa phép') {
        generalQuery('setdiemdanhnhom', {
          diemdanhvalue: type,
          EMPL_NO: data.EMPL_NO,
          CURRENT_TEAM:
            data.WORK_SHIF_NAME === 'Hành Chính'
              ? 0
              : data.WORK_SHIF_NAME === 'TEAM 1'
              ? 1
              : 2,
          CURRENT_CA: data.WORK_SHIF_NAME === 'Hành Chính' ? 0 : calv,
        })
          .then(async (response: any) => {
            if (response.data.tk_status === 'OK') {
              const newProjects = tableData.map((p) =>
                p.EMPL_NO === data.EMPL_NO ? { ...p, ON_OFF: type } : p
              );
              setTableData(newProjects);
            } else {
              Swal.fire('Có lỗi', 'Nội dung: ' + response.data.message, 'error');
            }
          })
          .catch((error: any) => {
            console.error(error);
          });
      } else {
        Swal.fire(
          'Có lỗi',
          'Đã đăng ký nghỉ rồi, không điểm danh được',
          'error'
        );
        return;
      }
    } else if (type === 0 || type === 2) {
      const diemdanhvalue = type === 2 ? 0 : type;
      const reasonCode = type === 2 ? 5 : 3;
      generalQuery('setdiemdanhnhom', {
        diemdanhvalue: diemdanhvalue,
        EMPL_NO: data.EMPL_NO,
        CURRENT_TEAM:
          data.WORK_SHIF_NAME === 'Hành Chính'
            ? 0
            : data.WORK_SHIF_NAME === 'TEAM 1'
            ? 1
            : 2,
        CURRENT_CA: data.WORK_SHIF_NAME === 'Hành Chính' ? 0 : calv,
      })
        .then((response: any) => {
          if (response.data.tk_status === 'OK') {
            const newProjects = tableData.map((p) =>
              p.EMPL_NO === data.EMPL_NO ? { ...p, ON_OFF: 0 } : p
            );
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
      CONTENT: `${getUserData()?.EMPL_NO} (${getUserData()?.MIDLAST_NAME} ${
        getUserData()?.FIRST_NAME
      }), nhân viên ${
        getUserData()?.WORK_POSITION_NAME
      } đã điểm danh thủ công cho ${data.EMPL_NO}_ ${data.MIDLAST_NAME} ${
        data.FIRST_NAME
      } ${type === 1 ? 'đi làm' : 'nghỉ'}`,
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
      const newProjects = tableData.map((p) =>
        p.EMPL_NO === data.EMPL_NO
          ? { ...p, ON_OFF: null, OFF_ID: null, REASON_NAME: null }
          : p
      );
      setTableData(newProjects);
      xoadangkynghi_auto();
    } else {
      const newProjects = tableData.map((p) =>
        p.EMPL_NO === data.EMPL_NO ? { ...p, ON_OFF: null } : p
      );
      setTableData(newProjects);
    }
  };

  if (data.ON_OFF === null) {
    return (
      <div className="cell-attendance">
        <button
          type="button"
          className="btn-shift btn-shift--day"
          onClick={() => onClick(1, 1)}
          title="Điểm danh làm ca ngày"
        >
          Làm Ngày
        </button>
        <button
          type="button"
          className="btn-shift btn-shift--night"
          onClick={() => onClick(1, 2)}
          title="Điểm danh làm ca đêm"
        >
          Làm Đêm
        </button>
        <button
          type="button"
          className="btn-shift btn-shift--off"
          onClick={() => onClick(0, 1)}
          title="Đánh dấu nghỉ làm"
        >
          Nghỉ
        </button>
        <button
          type="button"
          className="btn-shift btn-shift--half"
          onClick={() => onClick(2)}
          title="Nghỉ 50% (nửa ca)"
        >
          50%
        </button>
      </div>
    );
  }

  const isPresent = data.ON_OFF === 1;

  return (
    <div className="cell-attendance">
      <span
        className={`badge-status ${
          isPresent ? 'badge-status--present' : 'badge-status--absent'
        }`}
      >
        <span className="material-symbols-outlined" style={{ fontSize: 13 }}>
          {isPresent ? 'check' : 'cancel'}
        </span>
        {isPresent ? 'Đi làm' : data.REASON_NAME || 'Nghỉ làm'}
      </span>
      <button
        type="button"
        className="btn-reset"
        onClick={onReset}
        title="Khôi phục trạng thái chưa điểm danh"
      >
        Reset
      </button>
    </div>
  );
};

export default React.memo(PrecisionAttendanceCell);
