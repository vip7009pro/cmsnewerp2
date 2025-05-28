import { useState } from "react";
import { getCtrCd } from "../../api/Api";
import { f_downloadFile2 } from "../../api/GlobalFunction";

export const DownloadButton = ({ filename}:{filename:string}) => {
  const protocol = window.location.protocol.startsWith("https") ? "https" : "http";
  const [downloadProgress, setDownloadProgress] = useState(0);

  const handleDownload = () => {
    const fullUrl = `${protocol}://${window.location.host}/globalfiles/${getCtrCd()}_${filename}`;
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