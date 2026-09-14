import React from "react";
import { AiOutlineCloudUpload } from "react-icons/ai";

export const renderTruncated = (val: any, isMono: boolean = false) => {
  if (val === null || val === undefined || val === "") return "";
  return (
    <span
      className={`cell-truncate ${isMono ? "ncr-cell-mono" : ""}`}
      title={String(val)}
    >
      {String(val)}
    </span>
  );
};

export const renderProcessStatus = (status: string | null | undefined) => {
  if (status === "Y") {
    return <span className="ncr-pill completed">COMPLETED</span>;
  } else if (status === "N") {
    return <span className="ncr-pill not-completed">NOT COMPLETED</span>;
  } else {
    return <span className="ncr-pill pending">PENDING</span>;
  }
};

export const renderDefectImageCell = (
  params: any,
  onUpload: (file: File, ncrId: number) => void
) => {
  const hasImage =
    params.data?.DEFECT_IMAGE !== "N" &&
    params.data?.DEFECT_IMAGE !== null &&
    params.data?.DEFECT_IMAGE !== undefined &&
    params.data?.DEFECT_IMAGE !== "P";

  if (hasImage) {
    const hrefLink = `/ncrimage/NCR_${params.data.NCR_ID}.png`;
    return (
      <a
        target="_blank"
        rel="noopener noreferrer"
        href={hrefLink}
        className="ncr-file-link"
        title="Xem ảnh lỗi PNG"
      >
        LINK (IMG)
      </a>
    );
  }

  return (
    <label className="ncr-upload-btn" title="Tải lên ảnh lỗi .png">
      <AiOutlineCloudUpload size={12} />
      <span>Upload</span>
      <input
        type="file"
        accept=".png"
        hidden
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
          const file = e.target.files?.[0];
          if (file && params.data?.NCR_ID) {
            onUpload(file, params.data.NCR_ID);
          }
        }}
      />
    </label>
  );
};

export const renderCountermeasureCell = (
  params: any,
  onUpload: (file: File, ncrId: number) => void
) => {
  const hasCM = params.data?.COUNTERMEASURE === "Y";

  if (hasCM) {
    const ext = params.data?.COUNTERMEASURE_EXT || "pdf";
    const filename = `NCR_${params.data.NCR_ID}.${ext}`;
    const hrefLink = `/ncrimage/${filename}`;
    return (
      <a
        target="_blank"
        rel="noopener noreferrer"
        href={hrefLink}
        className="ncr-file-link"
        title={`Xem đối sách .${ext}`}
      >
        LINK ({ext.toUpperCase()})
      </a>
    );
  }

  return (
    <label className="ncr-upload-btn" title="Tải lên file đối sách (PDF, PPTX, DOCX, XLSX)">
      <AiOutlineCloudUpload size={12} />
      <span>Upload</span>
      <input
        type="file"
        accept=".pdf,.pptx,.docx,.xlsx"
        hidden
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
          const file = e.target.files?.[0];
          if (file && params.data?.NCR_ID) {
            onUpload(file, params.data.NCR_ID);
          }
        }}
      />
    </label>
  );
};
