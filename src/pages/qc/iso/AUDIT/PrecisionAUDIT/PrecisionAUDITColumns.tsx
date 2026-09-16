import React, { useRef, useState } from "react";

// Micro Upload Cell Component
const AuditUploadCellRenderer: React.FC<{
  data: any;
  onUpload: (auditResultId: number, auditResultDetailId: number, files: FileList | null) => void;
}> = ({ data, onUpload }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null);

  if (data?.AUDIT_EVIDENT === "Y") {
    const href = `/audit/AUDIT_${data.AUDIT_RESULT_DETAIL_ID}.jpg`;
    return (
      <div className="audit-thumb-container">
        <a
          target="_blank"
          rel="noopener noreferrer"
          href={href}
          className="thumb-item"
          title="Xem ảnh bằng chứng"
        >
          <img src={href} alt="Evident" />
        </a>
      </div>
    );
  }

  return (
    <div className="audit-upload-cell">
      <input
        ref={fileInputRef}
        type="file"
        accept=".jpg,.jpeg,.png"
        multiple={true}
        style={{ display: "none" }}
        onChange={(e) => {
          setSelectedFiles(e.target.files);
        }}
      />

      <button
        type="button"
        className="upload-btn"
        onClick={() => fileInputRef.current?.click()}
        title="Chọn ảnh bằng chứng JPG"
      >
        <span className="material-symbols-outlined">add_photo_alternate</span>
        <span>{selectedFiles && selectedFiles.length > 0 ? `${selectedFiles.length} file` : "Chọn ảnh"}</span>
      </button>

      {selectedFiles && selectedFiles.length > 0 && (
        <button
          type="button"
          className="upload-action-btn"
          onClick={() => {
            onUpload(data.AUDIT_RESULT_ID, data.AUDIT_RESULT_DETAIL_ID, selectedFiles);
            setSelectedFiles(null);
            if (fileInputRef.current) fileInputRef.current.value = "";
          }}
          title="Tải ảnh lên hệ thống"
        >
          <span className="material-symbols-outlined" style={{ fontSize: 13 }}>cloud_upload</span>
          <span>Up</span>
        </button>
      )}
    </div>
  );
};

// Evident Image List Cell Component
const AuditImageThumbRenderer: React.FC<{
  data: any;
  onPreviewImage: (url: string) => void;
}> = ({ data, onPreviewImage }) => {
  if (!data?.AUDIT_EVIDENT) return null;
  const fileList: string[] = data.AUDIT_EVIDENT.split(",").filter((f: string) => f.trim().length > 0);

  return (
    <div className="audit-thumb-container">
      {fileList.map((filename: string, idx: number) => {
        const href = `/audit/AUDIT_${data.AUDIT_RESULT_ID}_${data.AUDIT_RESULT_DETAIL_ID}_${filename.trim()}`;
        return (
          <div
            key={idx}
            className="thumb-item"
            onClick={() => onPreviewImage(href)}
            title={`Xem ảnh ${filename}`}
          >
            <img src={href} alt={filename} />
          </div>
        );
      })}
    </div>
  );
};

export const getAuditBatchColumns = () => [
  {
    field: "AUDIT_RESULT_ID",
    headerName: "RS_ID",
    width: 60,
    cellRenderer: (params: any) => <span className="audit-code-cell">{params.value}</span>,
  },
  {
    field: "AUDIT_ID",
    headerName: "AD_ID",
    width: 50,
    cellRenderer: (params: any) => <span className="audit-code-cell">{params.value}</span>,
  },
  {
    field: "AUDIT_NAME",
    headerName: "AUDIT_NAME",
    width: 140,
    cellRenderer: (params: any) => <strong>{params.value}</strong>,
  },
  {
    field: "AUDIT_DATE",
    headerName: "AUDIT_DATE",
    width: 90,
    cellRenderer: (params: any) => <span className="audit-code-cell">{params.value}</span>,
  },
  {
    field: "REMARK",
    headerName: "REMARK",
    width: 100,
  },
  {
    field: "INS_DATE",
    headerName: "INS_DATE",
    width: 120,
    cellRenderer: (params: any) => <span className="audit-code-cell">{params.value}</span>,
  },
  {
    field: "INS_EMPL",
    headerName: "INS_EMPL",
    width: 70,
  },
  {
    field: "UPD_DATE",
    headerName: "UPD_DATE",
    width: 120,
    cellRenderer: (params: any) => <span className="audit-code-cell">{params.value}</span>,
  },
  {
    field: "UPD_EMPL",
    headerName: "UPD_EMPL",
    width: 70,
  },
];

export const getAuditChecklistColumns = (
  onUpload: (auditResultId: number, auditResultDetailId: number, files: FileList | null) => void,
  onPreviewImage: (url: string) => void
) => [
  {
    field: "AUDIT_RESULT_DETAIL_ID",
    headerName: "RS_DT_ID",
    width: 60,
    cellRenderer: (params: any) => <span className="audit-code-cell">{params.value}</span>,
    checkboxSelection: true,
    headerCheckboxSelection: true,
  },
  {
    field: "AUDIT_RESULT_ID",
    headerName: "RS_ID",
    width: 50,
    cellRenderer: (params: any) => <span className="audit-code-cell">{params.value}</span>,
  },
  {
    field: "AUDIT_DETAIL_ID",
    headerName: "DT_ID",
    width: 50,
    cellRenderer: (params: any) => <span className="audit-code-cell">{params.value}</span>,
  },
  {
    field: "AUDIT_ID",
    headerName: "AD_ID",
    width: 50,
    cellRenderer: (params: any) => <span className="audit-code-cell">{params.value}</span>,
  },
  {
    field: "AUDIT_NAME",
    headerName: "AUDIT_NAME",
    width: 130,
    cellRenderer: (params: any) => <strong>{params.value}</strong>,
  },
  {
    field: "MAIN_ITEM_NO",
    headerName: "MAIN_NO",
    width: 60,
    cellRenderer: (params: any) => <span className="audit-code-cell">{params.value}</span>,
  },
  {
    field: "MAIN_ITEM_CONTENT",
    headerName: "MAIN_CONTENT",
    width: 120,
  },
  {
    field: "SUB_ITEM_NO",
    headerName: "SUB_NO",
    width: 55,
    cellRenderer: (params: any) => <span className="audit-code-cell">{params.value}</span>,
  },
  {
    field: "SUB_ITEM_CONTENT",
    headerName: "SUB_CONTENT",
    width: 150,
  },
  {
    field: "LEVEL_CAT",
    headerName: "LEVEL_CAT",
    width: 70,
    cellRenderer: (params: any) => (
      <span className="audit-cell-badge audit-cell-badge--info">{params.value}</span>
    ),
  },
  {
    field: "DETAIL_VN",
    headerName: "DETAIL_VN",
    width: 220,
  },
  {
    field: "MAX_SCORE",
    headerName: "MAX_SCORE",
    width: 70,
    cellRenderer: (params: any) => (
      <span className="audit-score-cell" style={{ color: "#475569" }}>
        {params.value}
      </span>
    ),
  },
  {
    field: "AUDIT_SCORE",
    headerName: "AUDIT_SCORE",
    width: 80,
    editable: true,
    cellRenderer: (params: any) => {
      const val = Number(params.value ?? 0);
      const max = Number(params.data?.MAX_SCORE ?? 1);
      const isHigh = val >= max;
      return (
        <span
          className={`audit-score-cell ${isHigh ? "" : val > 0 ? "audit-score-cell--warning" : "audit-score-cell--danger"}`}
        >
          {params.value ?? 0}
        </span>
      );
    },
  },
  {
    field: "AUDIT_EVIDENT",
    headerName: "EVD_FILE",
    width: 70,
    cellRenderer: (params: any) => <span className="audit-code-cell">{params.value || ""}</span>,
  },
  {
    field: "EVIDENT_IMAGE",
    headerName: "EVD_IMAGE",
    width: 180,
    cellRenderer: (params: any) => (
      <AuditImageThumbRenderer data={params.data} onPreviewImage={onPreviewImage} />
    ),
  },
  {
    field: "AUDIT_EVIDENT2",
    headerName: "UPLOAD EVIDENT",
    width: 180,
    cellRenderer: (params: any) => (
      <AuditUploadCellRenderer data={params.data} onUpload={onUpload} />
    ),
  },
  {
    field: "REMARK",
    headerName: "REMARK",
    width: 130,
    editable: true,
  },
  {
    field: "DEPARTMENT",
    headerName: "DEPARTMENT",
    width: 80,
  },
  {
    field: "DETAIL_KR",
    headerName: "DETAIL_KR",
    width: 180,
  },
  {
    field: "DETAIL_EN",
    headerName: "DETAIL_EN",
    width: 180,
  },
  {
    field: "INS_DATE",
    headerName: "INS_DATE",
    width: 120,
    cellRenderer: (params: any) => <span className="audit-code-cell">{params.value}</span>,
  },
  {
    field: "INS_EMPL",
    headerName: "INS_EMPL",
    width: 70,
  },
  {
    field: "UPD_DATE",
    headerName: "UPD_DATE",
    width: 120,
    cellRenderer: (params: any) => <span className="audit-code-cell">{params.value}</span>,
  },
  {
    field: "UPD_EMPL",
    headerName: "UPD_EMPL",
    width: 70,
  },
];
