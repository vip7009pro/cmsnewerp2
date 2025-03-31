import { useState } from "react";
import { getCtrCd } from "../../api/Api";
import { f_downloadFile2 } from "../../api/GlobalFunction";

export const DownloadButtonAll = ({ fullUrl,filename}:{fullUrl: string, filename:string}) => {
  const [downloadProgress, setDownloadProgress] = useState(0);

  const handleDownload = () => {    
    const hreftlink = encodeURI(fullUrl);    
    f_downloadFile2(hreftlink, `${getCtrCd()}_${filename}`, setDownloadProgress);
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
      <button
        onClick={handleDownload}
        style={{
          padding: '5px 10px',
          backgroundColor: '#09be27',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer'
        }}
      >
        Download
      </button>
      {downloadProgress > 0 && (
        <span style={{ color: '#666' }}>
          {downloadProgress}%
        </span>
      )}
    </div>
  );
};