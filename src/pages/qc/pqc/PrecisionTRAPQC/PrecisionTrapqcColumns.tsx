import React from 'react';
import moment from 'moment';
import { PQC3_DATA } from '../../interfaces/qcInterface';

export const renderTruncated = (val: any) => {
  if (val === null || val === undefined || val === '') return '';
  return <span className="cell-truncate" title={String(val)}>{String(val)}</span>;
};

export const renderMonoCode = (val: any) => {
  if (!val) return '';
  return <span className="cell-truncate code-mono" title={String(val)}>{String(val)}</span>;
};

export const renderDateUtc = (val: any, format = 'YYYY-MM-DD HH:mm:ss') => {
  if (!val) return '';
  const d = moment.utc(val).format(format);
  return <span style={{ color: '#2563eb' }}>{d}</span>;
};

export const getColumnTraPqc1Data = () => [
  { field: 'PQC1_ID', headerName: 'PQC1_ID', width: 80, cellRenderer: (p: any) => renderMonoCode(p.value) },
  { field: 'YEAR_WEEK', headerName: 'YEAR_WEEK', width: 80, cellRenderer: (p: any) => renderMonoCode(p.value) },
  { field: 'CUST_NAME_KD', headerName: 'CUST_NAME_KD', width: 120, cellRenderer: (p: any) => renderTruncated(p.value) },
  { field: 'PROD_REQUEST_NO', headerName: 'PROD_REQUEST_NO', width: 80, cellRenderer: (p: any) => renderMonoCode(p.value) },
  { field: 'PROD_REQUEST_QTY', headerName: 'PROD_REQUEST_QTY', width: 80, cellRenderer: (p: any) => renderTruncated(p.value?.toLocaleString?.()) },
  { field: 'PROD_REQUEST_DATE', headerName: 'PROD_REQUEST_DATE', width: 80, cellRenderer: (p: any) => renderTruncated(p.value) },
  { field: 'PLAN_ID', headerName: 'PLAN_ID', width: 80, cellRenderer: (p: any) => renderMonoCode(p.value) },
  { field: 'PROCESS_LOT_NO', headerName: 'PROCESS_LOT_NO', width: 80, cellRenderer: (p: any) => renderMonoCode(p.value) },
  { field: 'G_NAME', headerName: 'G_NAME', width: 120, cellRenderer: (p: any) => renderTruncated(p.value) },
  { field: 'G_NAME_KD', headerName: 'G_NAME_KD', width: 120, cellRenderer: (p: any) => renderTruncated(p.value) },
  { field: 'DESCR', headerName: 'DESCR', width: 120, cellRenderer: (p: any) => renderTruncated(p.value) },
  { field: 'LINEQC_PIC', headerName: 'LINEQC_PIC', width: 80, cellRenderer: (p: any) => renderTruncated(p.value) },
  { field: 'PROD_PIC', headerName: 'PROD_PIC', width: 80, cellRenderer: (p: any) => renderTruncated(p.value) },
  { field: 'PROD_LEADER', headerName: 'PROD_LEADER', width: 80, cellRenderer: (p: any) => renderTruncated(p.value) },
  { field: 'LINE_NO', headerName: 'LINE_NO', width: 80, cellRenderer: (p: any) => renderTruncated(p.value) },
  { field: 'STEPS', headerName: 'STEPS', width: 80, cellRenderer: (p: any) => renderTruncated(p.value) },
  { field: 'CAVITY', headerName: 'CAVITY', width: 80, cellRenderer: (p: any) => renderTruncated(p.value) },
  { field: 'SETTING_OK_TIME', cellDataType: 'text', headerName: 'SETTING_OK_TIME', width: 180, cellRenderer: (p: any) => renderDateUtc(p.data.SETTING_OK_TIME) },
  { field: 'FACTORY', headerName: 'FACTORY', width: 80, cellRenderer: (p: any) => renderTruncated(p.value) },
  { field: 'INSPECT_SAMPLE_QTY', headerName: 'SAMPLE_QTY', width: 100, cellRenderer: (p: any) => renderTruncated(p.value?.toLocaleString?.()) },
  { field: 'PROD_LAST_PRICE', headerName: 'PRICE', width: 80, cellRenderer: (p: any) => renderTruncated(p.value?.toLocaleString?.()) },
  { field: 'SAMPLE_AMOUNT', headerName: 'SAMPLE_AMOUNT', width: 80, cellRenderer: (p: any) => <span style={{ color: '#475569', fontWeight: 600 }}>{p.data.SAMPLE_AMOUNT?.toLocaleString('en-US', { maximumFractionDigits: 8 })}</span> },
  { field: 'REMARK', headerName: 'REMARK', width: 80, cellRenderer: (p: any) => renderTruncated(p.value) },
  { field: 'PQC3_ID', headerName: 'PQC3_ID', width: 80, cellRenderer: (p: any) => renderMonoCode(p.value) },
  { field: 'OCCURR_TIME', headerName: 'OCCURR_TIME', width: 150, cellRenderer: (p: any) => renderTruncated(p.value) },
  { field: 'INSPECT_QTY', headerName: 'INSPECT_QTY', width: 120, cellRenderer: (p: any) => renderTruncated(p.value?.toLocaleString?.()) },
  { field: 'DEFECT_QTY', headerName: 'DEFECT_QTY', width: 120, cellRenderer: (p: any) => renderTruncated(p.value?.toLocaleString?.()) },
  { field: 'DEFECT_RATE', headerName: 'DEFECT_RATE', width: 120, cellRenderer: (p: any) => <span style={{ color: '#f43f5e', fontWeight: 600 }}>{p.data.DEFECT_RATE !== '' ? `${Number(p.data.DEFECT_RATE).toFixed(0)}%` : ''}</span> },
  { field: 'DEFECT_PHENOMENON', headerName: 'DEFECT_PHENOMENON', width: 150, cellRenderer: (p: any) => renderTruncated(p.value) },
  { field: 'INS_DATE', cellDataType: 'text', headerName: 'INS_DATE', width: 180, cellRenderer: (p: any) => renderDateUtc(p.data.INS_DATE) },
  { field: 'UPD_DATE', cellDataType: 'text', headerName: 'UPD_DATE', width: 180, cellRenderer: (p: any) => renderDateUtc(p.data.UPD_DATE) },
  { field: 'IMG_1', headerName: 'IMG_1', width: 100, cellRenderer: (p: any) => p.data.IMG_1 ? <a className="link-blue" target="_blank" rel="noopener noreferrer" href={`/lineqc/${p.data.PLAN_ID}_1.jpg`}>LINK</a> : <span style={{ color: '#94a3b8' }}>NO</span> },
  { field: 'IMG_2', headerName: 'IMG_2', width: 100, cellRenderer: (p: any) => p.data.IMG_2 ? <a className="link-blue" target="_blank" rel="noopener noreferrer" href={`/lineqc/${p.data.PLAN_ID}_2.jpg`}>LINK</a> : <span style={{ color: '#94a3b8' }}>NO</span> },
  { field: 'IMG_3', headerName: 'IMG_3', width: 100, cellRenderer: (p: any) => p.data.IMG_3 ? <a className="link-blue" target="_blank" rel="noopener noreferrer" href={`/lineqc/${p.data.PLAN_ID}_3.jpg`}>LINK</a> : <span style={{ color: '#94a3b8' }}>NO</span> },
];

export const getColumnPqc3Data = (onOpenNNDS: (row: PQC3_DATA) => void) => [
  { field: 'YEAR_WEEK', headerName: 'YEAR_WEEK', width: 80, cellRenderer: (p: any) => renderMonoCode(p.value) },
  { field: 'PQC3_ID', headerName: 'PQC3_ID', width: 80, cellRenderer: (p: any) => renderMonoCode(p.value) },
  { field: 'PQC1_ID', headerName: 'PQC1_ID', width: 80, cellRenderer: (p: any) => renderMonoCode(p.value) },
  { field: 'CUST_NAME_KD', headerName: 'CUST_NAME_KD', width: 120, cellRenderer: (p: any) => renderTruncated(p.value) },
  { field: 'FACTORY', headerName: 'FACTORY', width: 80, cellRenderer: (p: any) => renderTruncated(p.value) },
  { field: 'PROD_REQUEST_NO', headerName: 'PROD_REQUEST_NO', width: 80, cellRenderer: (p: any) => renderMonoCode(p.value) },
  { field: 'PROD_REQUEST_DATE', headerName: 'PROD_REQUEST_DATE', width: 80, cellRenderer: (p: any) => renderTruncated(p.value) },
  { field: 'PROCESS_LOT_NO', headerName: 'PROCESS_LOT_NO', width: 80, cellRenderer: (p: any) => renderMonoCode(p.value) },
  { field: 'G_CODE', headerName: 'G_CODE', width: 80, cellRenderer: (p: any) => renderMonoCode(p.value) },
  { field: 'G_NAME', headerName: 'G_NAME', width: 120, cellRenderer: (p: any) => renderTruncated(p.value) },
  { field: 'G_NAME_KD', headerName: 'G_NAME_KD', width: 120, cellRenderer: (p: any) => renderTruncated(p.value) },
  { field: 'DESCR', headerName: 'DESCR', width: 120, cellRenderer: (p: any) => renderTruncated(p.value) },
  { field: 'PROD_LAST_PRICE', headerName: 'PROD_LAST_PRICE', width: 80, cellRenderer: (p: any) => renderTruncated(p.value?.toLocaleString?.()) },
  { field: 'LINEQC_PIC', headerName: 'LINEQC_PIC', width: 80, cellRenderer: (p: any) => renderTruncated(p.value) },
  { field: 'PROD_PIC', headerName: 'PROD_PIC', width: 80, cellRenderer: (p: any) => renderTruncated(p.value) },
  { field: 'PROD_LEADER', headerName: 'PROD_LEADER', width: 80, cellRenderer: (p: any) => renderTruncated(p.value) },
  { field: 'LINE_NO', headerName: 'LINE_NO', width: 80, cellRenderer: (p: any) => renderTruncated(p.value) },
  { field: 'OCCURR_TIME', cellDataType: 'text', headerName: 'OCCURR_TIME', width: 180, cellRenderer: (p: any) => renderTruncated(p.value) },
  { field: 'INSPECT_QTY', type: 'number', headerName: 'SL KT', width: 80, cellRenderer: (p: any) => renderTruncated(p.value?.toLocaleString?.()) },
  { field: 'DEFECT_QTY', type: 'number', headerName: 'SL NG', width: 80, cellRenderer: (p: any) => <span style={{ color: '#f43f5e', fontWeight: 600 }}>{p.value?.toLocaleString?.()}</span> },
  { field: 'DEFECT_AMOUNT', type: 'number', headerName: 'DEFECT_AMOUNT', width: 120, cellRenderer: (p: any) => renderTruncated(p.value?.toLocaleString?.()) },
  { field: 'ERR_CODE', headerName: 'ERR_CODE', width: 80, cellRenderer: (p: any) => renderMonoCode(p.value) },
  { field: 'DEFECT_PHENOMENON', headerName: 'HIEN TUONG', width: 150, cellRenderer: (p: any) => renderTruncated(p.value) },
  { field: 'DEFECT_IMAGE_LINK', headerName: 'IMAGE LINK', width: 80, cellRenderer: (p: any) => <a className="link-blue" target="_blank" rel="noopener noreferrer" href={`/pqc/PQC3_${p.data.PQC3_ID + 1}.png`}>LINK</a> },
  { field: 'REMARK', headerName: 'REMARK', width: 120, cellRenderer: (p: any) => renderTruncated(p.value) },
  { field: 'WORST5', headerName: 'WORST5', width: 80, cellRenderer: (p: any) => renderTruncated(p.value) },
  { field: 'WORST5_MONTH', headerName: 'WORST5_MONTH', width: 80, cellRenderer: (p: any) => renderTruncated(p.value) },
  { field: 'UPDATE_NNDS', headerName: 'UPDATE_NNDS', width: 120, cellRenderer: (p: any) => <button type="button" className="btn-nnds-action" onClick={() => onOpenNNDS(p.data)}>Update NNDS</button> },
  { field: 'NG_NHAN', headerName: 'NG_NHAN', width: 80, cellRenderer: (p: any) => renderTruncated(p.value) },
  { field: 'DOI_SACH', headerName: 'DOI_SACH', width: 80, cellRenderer: (p: any) => renderTruncated(p.value) },
];

export const getColumnDaofilmData = () => [
  { field: 'KNIFE_FILM_ID', headerName: 'ID', width: 80, cellRenderer: (p: any) => renderMonoCode(p.value) },
  { field: 'FACTORY_NAME', headerName: 'FACTORY', width: 80, cellRenderer: (p: any) => renderTruncated(p.value) },
  { field: 'NGAYBANGIAO', headerName: 'NGAYBANGIAO', width: 100, cellRenderer: (p: any) => renderDateUtc(p.data.NGAYBANGIAO, 'YYYY-MM-DD') },
  { field: 'G_CODE', headerName: 'G_CODE', width: 80, cellRenderer: (p: any) => renderMonoCode(p.value) },
  { field: 'G_NAME', headerName: 'G_NAME', width: 250, cellRenderer: (p: any) => renderTruncated(p.value) },
  { field: 'LOAIBANGIAO_PDP', headerName: 'LOAIBANGIAO', width: 80, cellRenderer: (p: any) => {
    switch (p.data.LOAIBANGIAO_PDP) {
      case 'D': return <span style={{ color: '#2563eb', fontWeight: 600 }}>DAO</span>;
      case 'F': return <span style={{ color: '#7c3aed', fontWeight: 600 }}>FILM</span>;
      case 'T': return <span style={{ color: '#059669', fontWeight: 600 }}>TAI LIEU</span>;
      default: return <span>N/A</span>;
    }
  }},
  { field: 'LOAIPHATHANH', headerName: 'LOAIPHATHANH', width: 110, cellRenderer: (p: any) => {
    switch (p.data.LOAIPHATHANH) {
      case 'PH': return <span className="status-badge status-badge--ok">PHAT HANH</span>;
      case 'TH': return <span className="status-badge status-badge--ng">THU HOI</span>;
      default: return <span>N/A</span>;
    }
  }},
  { field: 'SOLUONG', headerName: 'SOLUONG', width: 80, cellRenderer: (p: any) => renderTruncated(p.value?.toLocaleString?.()) },
  { field: 'SOLUONGOHP', headerName: 'SOLUONGOHP', width: 80, cellRenderer: (p: any) => renderTruncated(p.value?.toLocaleString?.()) },
  { field: 'LYDOBANGIAO', headerName: 'LYDOBANGIAO', width: 120, cellRenderer: (p: any) => renderTruncated(p.value) },
  { field: 'PQC_EMPL_NO', headerName: 'PQC_EMPL_NO', width: 80, cellRenderer: (p: any) => renderTruncated(p.value) },
  { field: 'RND_EMPL_NO', headerName: 'RND_EMPL_NO', width: 80, cellRenderer: (p: any) => renderTruncated(p.value) },
  { field: 'SX_EMPL_NO', headerName: 'SX_EMPL_NO', width: 80, cellRenderer: (p: any) => renderTruncated(p.value) },
  { field: 'MA_DAO', headerName: 'MA_DAO', width: 100, cellRenderer: (p: any) => renderMonoCode(p.value) },
  { field: 'REMARK', headerName: 'REMARK', width: 150, cellRenderer: (p: any) => renderTruncated(p.value) },
];

export const getColumnCndbData = () => [
  { field: 'CNDB_DATE', cellDataType: 'text', headerName: 'CNDB_DATE', width: 120, cellRenderer: (p: any) => renderTruncated(p.value) },
  { field: 'CNDB_NO', headerName: 'CNDB_NO', width: 80, cellRenderer: (p: any) => renderMonoCode(p.value) },
  { field: 'CNDB_ENCODE', headerName: 'CNDB_ENCODE', width: 100, cellRenderer: (p: any) => renderMonoCode(p.value) },
  { field: 'M_NAME', headerName: 'M_NAME', width: 150, cellRenderer: (p: any) => renderTruncated(p.value) },
  { field: 'DEFECT_NAME', headerName: 'DEFECT_NAME', width: 100, cellRenderer: (p: any) => renderTruncated(p.value) },
  { field: 'DEFECT_CONTENT', headerName: 'DEFECT_CONTENT', width: 150, cellRenderer: (p: any) => renderTruncated(p.value) },
  { field: 'REG_EMPL_NO', headerName: 'REG_EMPL_NO', width: 150, cellRenderer: (p: any) => renderTruncated(p.value) },
  { field: 'REMARK', headerName: 'REMARK', width: 80, cellRenderer: (p: any) => renderTruncated(p.value) },
  { field: 'M_NAME2', headerName: 'M_NAME2', width: 120, cellRenderer: (p: any) => renderTruncated(p.value) },
  { field: 'INS_DATE', cellDataType: 'text', headerName: 'INS_DATE', width: 120, cellRenderer: (p: any) => renderDateUtc(p.data.INS_DATE) },
  { field: 'APPROVAL_STATUS', headerName: 'APPROVAL_STATUS', width: 120, cellRenderer: (p: any) => p.data.APPROVAL_STATUS === 'Y' ? <span className="status-badge status-badge--ok">Phê Duyệt</span> : <span className="status-badge status-badge--ng">Chưa duyệt</span> },
  { field: 'APPROVAL_EMPL', headerName: 'APPROVAL_EMPL', width: 120, cellRenderer: (p: any) => renderTruncated(p.value) },
  { field: 'APPROVAL_DATE', headerName: 'APPROVAL_DATE', width: 80, cellRenderer: (p: any) => p.data.APPROVAL_DATE !== null ? renderDateUtc(p.data.APPROVAL_DATE) : <span className="status-badge status-badge--pending">Chưa duyệt</span> },
  { field: 'G_CODE', headerName: 'G_CODE', width: 80, cellRenderer: (p: any) => renderMonoCode(p.value) },
  { field: 'G_NAME', headerName: 'G_NAME', width: 250, cellRenderer: (p: any) => renderTruncated(p.value) },
];
