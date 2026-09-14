import { useState, useCallback } from 'react';
import moment from 'moment';
import Swal from 'sweetalert2';
import { generalQuery, getAuditMode } from '../../../../api/Api';
import {
  CNDB_DATA,
  DAO_FILM_DATA,
  PQC3_DATA,
  TRA_PQC1_DATA,
} from '../../interfaces/qcInterface';
import { SaveExcel } from '../../../../api/services/excelService';

export type TrapqcMode = 'SETTING' | 'DEFECT' | 'DAOFILM' | 'CNDB';

export const useTrapqcData = () => {
  // Chế độ nguồn dữ liệu hiện tại
  const [activeMode, setActiveMode] = useState<TrapqcMode>('SETTING');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [pqcdatatable, setPqcDataTable] = useState<Array<any>>([]);
  const [quickFilterText, setQuickFilterText] = useState<string>('');

  // Bộ lọc Sidebar
  const [alltime, setAllTime] = useState<boolean>(false);
  const [fromdate, setFromDate] = useState<string>(moment().format('YYYY-MM-DD'));
  const [todate, setToDate] = useState<string>(moment().format('YYYY-MM-DD'));
  const [factory, setFactory] = useState<string>('All');
  const [codeKD, setCodeKD] = useState<string>('');
  const [codeCMS, setCodeCMS] = useState<string>('');
  const [empl_name, setEmpl_Name] = useState<string>('');
  const [cust_name, setCustName] = useState<string>('');
  const [process_lot_no, setProcess_Lot_No] = useState<string>('');
  const [prod_type, setProdType] = useState<string>('');
  const [prodrequestno, setProdRequestNo] = useState<string>('');
  const [id, setID] = useState<string>('');

  // Modal Cập nhật NNDS
  const [showNNDSModal, setShowNNDSModal] = useState<boolean>(false);
  const [currentNN, setCurrentNN] = useState<string>('');
  const [currentDS, setCurrentDS] = useState<string>('');
  const [currentDefectRow, setCurrentDefectRow] = useState<PQC3_DATA>({
    CUST_NAME_KD: '',
    DEFECT_AMOUNT: 0,
    DEFECT_IMAGE_LINK: '',
    DEFECT_PHENOMENON: '',
    DEFECT_QTY: 0,
    ERR_CODE: '',
    FACTORY: '',
    G_CODE: '',
    G_NAME: '',
    G_NAME_KD: '',
    INSPECT_QTY: 0,
    LINE_NO: '',
    LINEQC_PIC: '',
    OCCURR_TIME: '',
    PQC1_ID: 0,
    PQC3_ID: 0,
    PROCESS_LOT_NO: '',
    PROD_LAST_PRICE: 0,
    PROD_LEADER: '',
    PROD_PIC: '',
    PROD_REQUEST_DATE: '',
    PROD_REQUEST_NO: '',
    REMARK: '',
    WORST5: '',
    WORST5_MONTH: '',
    YEAR_WEEK: '',
    DOI_SACH: '',
    NG_NHAN: '',
    STATUS: '',
  });

  // 1. Tra cứu Setting (PQC1)
  const handletraInspectionInput = useCallback(() => {
    setIsLoading(true);
    generalQuery('trapqc1data', {
      ALLTIME: alltime,
      FROM_DATE: fromdate,
      TO_DATE: todate,
      CUST_NAME: cust_name,
      PROCESS_LOT_NO: process_lot_no,
      G_CODE: codeCMS,
      G_NAME: codeKD,
      PROD_TYPE: prod_type,
      EMPL_NAME: empl_name,
      PROD_REQUEST_NO: prodrequestno,
      ID: id,
      FACTORY: factory,
    })
      .then((response) => {
        if (response.data.tk_status !== 'NG') {
          const loadeddata: TRA_PQC1_DATA[] = response.data.data.map(
            (element: TRA_PQC1_DATA, index: number) => {
              return {
                ...element,
                G_NAME:
                  getAuditMode() === 0
                    ? element?.G_NAME
                    : element?.G_NAME?.search('CNDB') === -1
                    ? element?.G_NAME
                    : 'TEM_NOI_BO',
                G_NAME_KD:
                  getAuditMode() === 0
                    ? element?.G_NAME_KD
                    : element?.G_NAME?.search('CNDB') === -1
                    ? element?.G_NAME_KD
                    : 'TEM_NOI_BO',
                PROD_DATETIME: moment.utc(element.INS_DATE).format('YYYY-MM-DD HH:mm:ss'),
                OCCURR_TIME:
                  element.OCCURR_TIME !== null
                    ? moment.utc(element.OCCURR_TIME).format('YYYY-MM-DD HH:mm:ss')
                    : '',
                INPUT_DATETIME: moment.utc(element.UPD_DATE).format('YYYY-MM-DD HH:mm:ss'),
                DEFECT_RATE:
                  element.INSPECT_QTY !== null
                    ? ((element.DEFECT_QTY !== null ? element.DEFECT_QTY : 0) /
                        element.INSPECT_QTY) *
                      100
                    : '',
                id: index,
              };
            }
          );
          setPqcDataTable(loadeddata);
          setIsLoading(false);
          Swal.fire('Thông báo', 'Đã nạp ' + response.data.data.length + ' dòng Setting', 'success');
        } else {
          Swal.fire('Thông báo', 'Nội dung: ' + response.data.message, 'error');
          setIsLoading(false);
        }
      })
      .catch((error) => {
        console.error(error);
        setIsLoading(false);
      });
  }, [alltime, fromdate, todate, cust_name, process_lot_no, codeCMS, codeKD, prod_type, empl_name, prodrequestno, id, factory]);

  // 2. Tra cứu Defect (PQC3)
  const handletraInspectionOutput = useCallback(() => {
    setIsLoading(true);
    generalQuery('trapqc3data', {
      ALLTIME: alltime,
      FROM_DATE: fromdate,
      TO_DATE: todate,
      CUST_NAME: cust_name,
      PROCESS_LOT_NO: process_lot_no,
      G_CODE: codeCMS,
      G_NAME: codeKD,
      PROD_TYPE: prod_type,
      EMPL_NAME: empl_name,
      PROD_REQUEST_NO: prodrequestno,
      ID: id,
      FACTORY: factory,
    })
      .then((response) => {
        if (response.data.tk_status !== 'NG') {
          const loadeddata: PQC3_DATA[] = response.data.data.map(
            (element: PQC3_DATA, index: number) => {
              return {
                ...element,
                G_NAME:
                  getAuditMode() === 0
                    ? element?.G_NAME
                    : element?.G_NAME?.search('CNDB') === -1
                    ? element?.G_NAME
                    : 'TEM_NOI_BO',
                G_NAME_KD:
                  getAuditMode() === 0
                    ? element?.G_NAME_KD
                    : element?.G_NAME?.search('CNDB') === -1
                    ? element?.G_NAME_KD
                    : 'TEM_NOI_BO',
                OCCURR_TIME: moment.utc(element.OCCURR_TIME).format('YYYY-MM-DD HH:mm:ss'),
                id: index,
              };
            }
          );
          setPqcDataTable(loadeddata);
          setIsLoading(false);
          Swal.fire('Thông báo', 'Đã nạp ' + response.data.data.length + ' dòng Defect', 'success');
        } else {
          Swal.fire('Thông báo', 'Nội dung: ' + response.data.message, 'error');
          setIsLoading(false);
        }
      })
      .catch((error) => {
        console.error(error);
        setIsLoading(false);
      });
  }, [alltime, fromdate, todate, cust_name, process_lot_no, codeCMS, codeKD, prod_type, empl_name, prodrequestno, id, factory]);

  // 3. Tra cứu Dao-film
  const handletraInspectionInOut = useCallback(() => {
    setIsLoading(true);
    generalQuery('tradaofilm', {
      ALLTIME: alltime,
      FROM_DATE: fromdate,
      TO_DATE: todate,
      G_CODE: codeCMS,
      G_NAME: codeKD,
      FACTORY: factory,
    })
      .then((response) => {
        if (response.data.tk_status !== 'NG') {
          const loadeddata: DAO_FILM_DATA[] = response.data.data.map(
            (element: DAO_FILM_DATA, index: number) => {
              return {
                ...element,
                G_NAME:
                  getAuditMode() === 0
                    ? element?.G_NAME
                    : element?.G_NAME?.search('CNDB') === -1
                    ? element?.G_NAME
                    : 'TEM_NOI_BO',
                id: index,
              };
            }
          );
          setPqcDataTable(loadeddata);
          setIsLoading(false);
          Swal.fire('Thông báo', 'Đã nạp ' + response.data.data.length + ' dòng Dao-Film', 'success');
        } else {
          Swal.fire('Thông báo', 'Nội dung: ' + response.data.message, 'error');
          setIsLoading(false);
        }
      })
      .catch((error) => {
        console.error(error);
        setIsLoading(false);
      });
  }, [alltime, fromdate, todate, codeCMS, codeKD, factory]);

  // 4. Tra cứu CNĐB
  const handletraInspectionNG = useCallback(() => {
    setIsLoading(true);
    generalQuery('traCNDB', {
      ALLTIME: alltime,
      FROM_DATE: fromdate,
      TO_DATE: todate,
      CUST_NAME: cust_name,
      process_lot_no: process_lot_no,
      G_CODE: codeCMS,
      G_NAME: codeKD,
      PROD_TYPE: prod_type,
      EMPL_NAME: empl_name,
      PROD_REQUEST_NO: prodrequestno,
    })
      .then((response) => {
        if (response.data.tk_status !== 'NG') {
          const loadeddata: CNDB_DATA[] = response.data.data.map(
            (element: CNDB_DATA, index: number) => {
              return {
                ...element,
                G_NAME:
                  getAuditMode() === 0
                    ? element?.G_NAME
                    : element?.G_NAME?.search('CNDB') === -1
                    ? element?.G_NAME
                    : 'TEM_NOI_BO',
                CNDB_DATE: moment.utc(element.CNDB_DATE).format('YYYY-MM-DD'),
                id: index,
              };
            }
          );
          setPqcDataTable(loadeddata);
          setIsLoading(false);
          Swal.fire('Thông báo', 'Đã nạp ' + response.data.data.length + ' dòng CNĐB', 'success');
        } else {
          Swal.fire('Thông báo', 'Nội dung: ' + response.data.message, 'error');
          setIsLoading(false);
        }
      })
      .catch((error) => {
        console.error(error);
        setIsLoading(false);
      });
  }, [alltime, fromdate, todate, cust_name, process_lot_no, codeCMS, codeKD, prod_type, empl_name, prodrequestno]);

  // Hàm chuyển đổi chế độ và tự động tra cứu
  const handleSwitchMode = useCallback(
    (mode: TrapqcMode) => {
      setActiveMode(mode);
      setPqcDataTable([]);
      if (mode === 'SETTING') {
        handletraInspectionInput();
      } else if (mode === 'DEFECT') {
        handletraInspectionOutput();
      } else if (mode === 'DAOFILM') {
        handletraInspectionInOut();
      } else if (mode === 'CNDB') {
        handletraInspectionNG();
      }
    },
    [handletraInspectionInput, handletraInspectionOutput, handletraInspectionInOut, handletraInspectionNG]
  );

  // Hàm Tra Cứu chính theo mode đang active
  const handleSearchCurrentMode = useCallback(() => {
    if (activeMode === 'SETTING') {
      handletraInspectionInput();
    } else if (activeMode === 'DEFECT') {
      handletraInspectionOutput();
    } else if (activeMode === 'DAOFILM') {
      handletraInspectionInOut();
    } else if (activeMode === 'CNDB') {
      handletraInspectionNG();
    }
  }, [activeMode, handletraInspectionInput, handletraInspectionOutput, handletraInspectionInOut, handletraInspectionNG]);

  // Cập nhật NNDS
  const handleOpenNNDSModal = useCallback((row: PQC3_DATA) => {
    setCurrentDefectRow(row);
    setCurrentNN(row.NG_NHAN || '');
    setCurrentDS(row.DOI_SACH || '');
    setShowNNDSModal(true);
  }, []);

  const handleCloseNNDSModal = useCallback(() => {
    setShowNNDSModal(false);
    setCurrentNN('');
    setCurrentDS('');
  }, []);

  const handleUpdateNNDS = useCallback(() => {
    generalQuery('updatenndspqc', {
      PQC3_ID: currentDefectRow.PQC3_ID,
      NG_NHAN: currentNN,
      DOI_SACH: currentDS,
    })
      .then((response) => {
        if (response.data.tk_status !== 'NG') {
          Swal.fire('Thông báo', 'Cập nhật Nguyên Nhân & Đối Sách thành công', 'success');
          setShowNNDSModal(false);
          // Cập nhật lại trong mảng hiện tại
          setPqcDataTable((prev) =>
            prev.map((item) =>
              item.PQC3_ID === currentDefectRow.PQC3_ID
                ? { ...item, NG_NHAN: currentNN, DOI_SACH: currentDS }
                : item
            )
          );
        } else {
          Swal.fire('Thông báo', 'Nội dung: ' + response.data.message, 'error');
        }
      })
      .catch((error) => {
        console.error(error);
      });
  }, [currentDefectRow.PQC3_ID, currentNN, currentDS]);

  // Xuất Excel
  const handleExportExcel = useCallback(
    (type: 'EX1' | 'EX2') => {
      if (pqcdatatable.length === 0) {
        Swal.fire('Cảnh báo', 'Không có dữ liệu để xuất Excel', 'warning');
        return;
      }
      const filename = `TRAPQC_${activeMode}_${moment().format('YYYYMMDD_HHmmss')}`;
      SaveExcel(pqcdatatable, filename);
    },
    [pqcdatatable, activeMode]
  );

  return {
    activeMode,
    setActiveMode,
    handleSwitchMode,
    handleSearchCurrentMode,
    isLoading,
    pqcdatatable,
    quickFilterText,
    setQuickFilterText,
    alltime,
    setAllTime,
    fromdate,
    setFromDate,
    todate,
    setToDate,
    factory,
    setFactory,
    codeKD,
    setCodeKD,
    codeCMS,
    setCodeCMS,
    empl_name,
    setEmpl_Name,
    cust_name,
    setCustName,
    process_lot_no,
    setProcess_Lot_No,
    prod_type,
    setProdType,
    prodrequestno,
    setProdRequestNo,
    id,
    setID,
    showNNDSModal,
    currentDefectRow,
    currentNN,
    setCurrentNN,
    currentDS,
    setCurrentDS,
    handleOpenNNDSModal,
    handleCloseNNDSModal,
    handleUpdateNNDS,
    handleExportExcel,
  };
};
