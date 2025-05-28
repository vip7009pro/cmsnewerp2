import React, { useEffect, useRef, useState } from 'react';
import { generalQuery, getCtrCd, uploadQuery } from '../../../api/Api';
import Swal from 'sweetalert2';
import moment from 'moment';
import { FaFile, FaFileExcel, FaFileImage, FaFilePdf, FaFileWord } from 'react-icons/fa';
import { FaFileZipper } from 'react-icons/fa6';
import { DownloadButton } from '../../../components/DownloadButton/DownloadButton';
import './FileTransfer.scss';

interface FileProgress {
  file: File;
  progress: number;
}

const FileTransfer = () => {
  const protocol = window.location.protocol.startsWith("https") ? "https" : "http";
  const [uploadedFiles, setUploadedFiles] = useState<FileProgress[]>([]);
  const [fileList, setFileList] = useState<any[]>([]);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [overallprogress, setOverallProgress] = useState(0);

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    setUploadedFiles(Array.from(files).map(file => ({ file, progress: 0 })));
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      setUploadedFiles(Array.from(files).map(file => ({ file, progress: 0 })));
    }
  };

  const handleUpdateFileNameToDataBase = async (filename: string, filesize: number) => {
    await generalQuery('update_file_name', { FILE_NAME: filename, FILE_SIZE: filesize, CTR_CD: getCtrCd() });
  };

  const handleGetFileListFromDataBase = async () => {
    await generalQuery("get_file_list", {})
      .then((response) => {
        if (response.data.tk_status !== "NG") {
          setFileList(response.data.data);
        } else {
          setFileList([]);
          console.log("Error get file list from database");
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleUpload = async () => {
    setOverallProgress(0);
    if (uploadedFiles.length > 0) {
      for (let i = 0; i < uploadedFiles.length; i++) {
        const file = uploadedFiles[i];
        try {
          await uploadQuery(file.file, getCtrCd() + '_' + file.file.name, 'globalfiles');
          await handleUpdateFileNameToDataBase(file.file.name, file.file.size);
          file.progress = 100;
          console.log(`File ${file.file.name} uploaded successfully`);
        } catch (error) {
          console.error(`Error uploading file ${file.file.name}:`, error);
        }
        setOverallProgress((prevProgress) => prevProgress + (100 / uploadedFiles.length));
      }
      Swal.fire({
        title: 'Success',
        text: 'File uploaded successfully',
        icon: 'success',
        confirmButtonText: 'OK'
      });
      await handleGetFileListFromDataBase();
    } else {
      console.log('No files to upload');
    }
  };

  const handleDeleteFromDatabase = async (filename: string) => {
    await generalQuery('delete_file', { FILE_NAME: filename });
    await handleGetFileListFromDataBase();
  };

  useEffect(() => {
    handleGetFileListFromDataBase();
  }, []);

  return (
    <div className="file-transfer-container">
      <div className="upload-section">
        <div className="file-upload-header">
          <div className="drag-drop-area" onDrop={handleDrop} onDragOver={handleDragOver}>
            Drag and drop files here
          </div>
          <input
            type="file"
            multiple
            onChange={handleFileSelect}
            ref={fileInputRef}
          />
          <div className="button-group">
            <button onClick={() => {
              setOverallProgress(0);
              setUploadedFiles([]);
              fileInputRef.current?.click();
            }}>
              Select File
            </button>
            <button onClick={() => {
              setOverallProgress(0);
              setUploadedFiles([]);
            }}>
              Clear
            </button>
            <button onClick={handleUpload}>
              Upload
            </button>
          </div>
        </div>
        <div className="overall-progress">
          <h3>Overall Progress</h3>
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${overallprogress}%` }} />
          </div>
          <div className="progress-text">{`${overallprogress.toFixed(0)}%`}</div>
        </div>
        <div className="file-list">
          {uploadedFiles.map((file, index) => (
            <div key={index} className="file-item">
              <span>{index + 1}. {file.file.name} - {(file.file.size / 1024).toFixed(2)} kB</span>
              <div className="file-actions">
                <div className="progress-bar">
                  <div className="progress-fill" style={{ width: `${file.progress || 0}%` }} />
                  {file.progress} %
                </div>
                <div className="button-group">
                  <button onClick={() => window.open(`/globalfiles/${getCtrCd()}_${file.file.name}`, '_blank')}>
                    Download
                  </button>
                  <button onClick={() => handleDeleteFromDatabase(file.file.name)}>
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="database-files-section">
        <h3>
          Files on Server (Total: {fileList.length})
          <button onClick={handleGetFileListFromDataBase}>Refresh</button>
        </h3>
        <div className="file-list">
          {fileList.map((file, index) => (
            <div key={index} className="file-item">
              <div className="file-info">
                <div className="avatar">
                  <img src={`/Picture_NS/NS_${file.INS_EMPL}.jpg`} alt={file.INS_EMPL} onError={(e) => { e.currentTarget.src = '/noimage.webp' }} />
                </div>
                {(() => {
                  const fileExt = file.FILE_NAME.split('.').pop().toLowerCase();
                  if (['doc', 'docx', 'txt', 'rtf'].includes(fileExt)) return <FaFileWord color='green' size={20} />;
                  if (['pdf'].includes(fileExt)) return <FaFilePdf color='red' size={20} />;
                  if (['xls', 'xlsx'].includes(fileExt)) return <FaFileExcel color='green' size={20} />;
                  if (['jpg', 'jpeg', 'png', 'gif', 'bmp'].includes(fileExt)) return <FaFileImage color='skyblue' size={20} />;
                  if (['zip', 'rar', '7z'].includes(fileExt)) return <FaFileZipper color='orange' size={20} />;
                  return <FaFile color='gray' size={20} />;
                })()}
                <span>
                  {index + 1}. {moment.utc(file.INS_DATE).format('DD/MM/YYYY HH:mm:ss')} {file.INS_EMPL} - 
                  <p>{file.FILE_NAME}</p> - {(file.FILE_SIZE / 1024).toLocaleString('en-US', { maximumFractionDigits: 2 })} kB
                </span>
              </div>
              <DownloadButton filename={file.FILE_NAME} />
              <button
                onClick={() => {
                  const fullUrl = `${protocol}://${window.location.host}/globalfiles/${getCtrCd()}_${file.FILE_NAME}`;
                  //console.log('fullUrl', fullUrl);      
                  const fileUrl = encodeURI(fullUrl);
                  if (navigator.clipboard) {
                    navigator.clipboard.writeText(fileUrl)
                      .then(() => {
                        Swal.fire({
                          title: 'Success',
                          text: 'Link copied to clipboard',
                          icon: 'success',
                          confirmButtonText: 'OK'
                        });
                      })
                      .catch(err => {
                        console.error('Failed to copy: ', err);
                        Swal.fire({
                          title: 'Error',
                          text: 'Failed to copy link to clipboard',
                          icon: 'error',
                          confirmButtonText: 'OK'
                        });
                      });
                  } else {
                    // Fallback for browsers that don't support clipboard API
                    const textArea = document.createElement("textarea");
                    textArea.value = fileUrl;
                    document.body.appendChild(textArea);
                    textArea.select();
                    try {
                      document.execCommand('copy');
                      Swal.fire({
                        title: 'Success',
                        text: 'Link copied to clipboard',
                        icon: 'success',
                        confirmButtonText: 'OK'
                      });
                    } catch (err) {
                      console.error('Failed to copy: ', err);
                      Swal.fire({
                        title: 'Error',
                        text: 'Failed to copy link to clipboard',
                        icon: 'error',
                        confirmButtonText: 'OK'
                      });
                    }
                    document.body.removeChild(textArea);
                  }
                }}
                style={{
                  padding: '5px 10px',
                  backgroundColor: '#2196F3',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  marginRight: '5px'
                }}
              >
                Copy Link
              </button>
              <button onClick={() => handleDeleteFromDatabase(file.FILE_NAME)}>
                Delete
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FileTransfer;