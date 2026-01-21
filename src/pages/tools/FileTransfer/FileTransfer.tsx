import React, { useEffect, useRef, useState } from 'react';
import { generalQuery, getCtrCd, uploadQuery } from '../../../api/Api';
import Swal from 'sweetalert2';
import moment from 'moment';
import { FaFile, FaFileExcel, FaFileImage, FaFilePdf, FaFileWord } from 'react-icons/fa';
import { FaFileZipper } from 'react-icons/fa6';
import { DownloadButton } from '../../../components/DownloadButton/DownloadButton';
import './FileTransfer.scss';
import axios from 'axios';

interface FileProgress {
  id: string;
  file: File;
  progress: number;
  uploadedBytes: number;
  totalBytes: number;
  status: 'pending' | 'uploading' | 'done' | 'error';
  error?: string;
}

const FileTransfer = () => {
  const protocol = window.location.protocol.startsWith("https") ? "https" : "http";
  const [uploadedFiles, setUploadedFiles] = useState<FileProgress[]>([]);
  const [fileList, setFileList] = useState<any[]>([]);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [overallprogress, setOverallProgress] = useState(0);

  const getFileIcon = (fileName: string) => {
    const fileExt = String(fileName || '').split('.').pop()?.toLowerCase() || '';
    if (['doc', 'docx', 'txt', 'rtf'].includes(fileExt)) return <FaFileWord color='green' size={16} />;
    if (['pdf'].includes(fileExt)) return <FaFilePdf color='red' size={16} />;
    if (['xls', 'xlsx'].includes(fileExt)) return <FaFileExcel color='green' size={16} />;
    if (['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp'].includes(fileExt)) return <FaFileImage color='skyblue' size={16} />;
    if (['zip', 'rar', '7z'].includes(fileExt)) return <FaFileZipper color='orange' size={16} />;
    return <FaFile color='gray' size={16} />;
  };

  const toKB = (bytes: number) => (bytes / 1024).toLocaleString('en-US', { maximumFractionDigits: 2 });
  const makeUploadItems = (files: FileList | File[]) => {
    const arr = Array.isArray(files) ? files : Array.from(files);
    return arr.map((file, index) => {
      const id = `${file.name}__${file.size}__${file.lastModified}__${index}`;
      return {
        id,
        file,
        progress: 0,
        uploadedBytes: 0,
        totalBytes: file.size,
        status: 'pending' as const,
      };
    });
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    setUploadedFiles(makeUploadItems(files));
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      setUploadedFiles(makeUploadItems(files));
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
      let completedCount = 0;
      let failedCount = 0;
      for (let i = 0; i < uploadedFiles.length; i++) {
        const item = uploadedFiles[i];
        try {
          setUploadedFiles((prev) =>
            prev.map((f) =>
              f.id === item.id
                ? { ...f, status: 'uploading', progress: 0, uploadedBytes: 0, totalBytes: f.file.size }
                : f
            )
          );
          await uploadQuery(
            item.file,
            getCtrCd() + '_' + item.file.name,
            'globalfiles',
            undefined,
            (progressEvent: any) => {
              const loaded: number = progressEvent?.loaded ?? 0;
              const total: number = progressEvent?.total ?? item.file.size;
              const percent = total > 0 ? Math.min(100, Math.round((loaded / total) * 100)) : 0;
              setUploadedFiles((prev) =>
                prev.map((f) =>
                  f.id === item.id
                    ? {
                        ...f,
                        uploadedBytes: loaded,
                        totalBytes: total,
                        progress: percent,
                        status: 'uploading',
                      }
                    : f
                )
              );
            }
          );
          await handleUpdateFileNameToDataBase(item.file.name, item.file.size);
          setUploadedFiles((prev) =>
            prev.map((f) =>
              f.id === item.id
                ? {
                    ...f,
                    progress: 100,
                    uploadedBytes: f.totalBytes,
                    status: 'done',
                  }
                : f
            )
          );
          completedCount++;
        } catch (error) {
          let errorMessage = 'Upload failed';
          if (axios.isAxiosError(error)) {
            const status = error.response?.status;
            const statusText = error.response?.statusText;
            const serverMessage = (error.response?.data as any)?.message;
            const tkStatus = (error.response?.data as any)?.tk_status;
            errorMessage = [
              status ? `HTTP ${status}` : undefined,
              statusText,
              tkStatus ? `tk_status: ${tkStatus}` : undefined,
              serverMessage ? `message: ${serverMessage}` : undefined,
              error.message,
            ]
              .filter(Boolean)
              .join(' | ');
          } else {
            errorMessage = String(error);
          }

          setUploadedFiles((prev) =>
            prev.map((f) =>
              f.id === item.id
                ? {
                    ...f,
                    status: 'error',
                    error: errorMessage,
                  }
                : f
            )
          );
          failedCount++;
        }
        setOverallProgress(uploadedFiles.length > 0 ? (completedCount / uploadedFiles.length) * 100 : 0);
      }

      if (failedCount === 0) {
        Swal.fire({
          title: 'Success',
          text: 'File uploaded successfully',
          icon: 'success',
          confirmButtonText: 'OK'
        });
      } else if (completedCount === 0) {
        Swal.fire({
          title: 'Error',
          text: 'Upload failed. Please check server limits/logs.',
          icon: 'error',
          confirmButtonText: 'OK'
        });
      } else {
        Swal.fire({
          title: 'Warning',
          text: `Uploaded: ${completedCount}, Failed: ${failedCount}. Click the failed row to see error details.`,
          icon: 'warning',
          confirmButtonText: 'OK'
        });
      }
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
    <div className="fileTransfer">
      <div className="fileTransfer__panel">
        <div className="fileTransfer__header">
          <div>
            <div className="fileTransfer__title">Upload Queue</div>
            <div className="fileTransfer__subtitle">Drag & drop files or select from your computer</div>
          </div>
          <div className="fileTransfer__toolbar">
            <input
              type="file"
              multiple
              onChange={handleFileSelect}
              ref={fileInputRef}
            />
            <button
              className="ftBtn ftBtn--primary"
              onClick={() => {
                setOverallProgress(0);
                setUploadedFiles([]);
                fileInputRef.current?.click();
              }}
            >
              Select Files
            </button>
            <button
              className="ftBtn"
              onClick={() => {
                setOverallProgress(0);
                setUploadedFiles([]);
              }}
            >
              Clear
            </button>
            <button className="ftBtn ftBtn--success" onClick={handleUpload}>
              Upload
            </button>
          </div>
        </div>

        <div className="fileTransfer__dropzone" onDrop={handleDrop} onDragOver={handleDragOver} onClick={() => fileInputRef.current?.click()}>
          <div className="fileTransfer__dropzoneTitle">Drop files here</div>
          <div className="fileTransfer__dropzoneHint">or click to browse</div>
        </div>

        <div className="fileTransfer__overall">
          <div className="fileTransfer__overallRow">
            <div className="fileTransfer__overallLabel">Overall (completed files / total)</div>
            <div className="fileTransfer__overallValue">{uploadedFiles.filter((f) => f.status === 'done').length}/{uploadedFiles.length}</div>
          </div>
          <div className="ftProgress">
            <div className="ftProgress__fill" style={{ width: `${overallprogress}%` }} />
          </div>
          <div className="fileTransfer__overallPercent">{overallprogress.toFixed(0)}%</div>
        </div>

        <div className="fileTransfer__tableWrap">
          <div className="fileTransfer__table">
            <div className="fileTransfer__thead">
              <div>Name</div>
              <div>Size</div>
              <div>Status</div>
              <div>Progress</div>
              <div>Actions</div>
            </div>
            {uploadedFiles.length === 0 && (
              <div className="fileTransfer__empty">No files selected</div>
            )}
            {uploadedFiles.map((item, index) => (
              <div key={item.id} className="fileTransfer__row">
                <div className="fileTransfer__name">
                  <div className="fileTransfer__nameMain">{index + 1}. {item.file.name}</div>
                  <div className="fileTransfer__nameSub">{toKB(item.uploadedBytes)} / {toKB(item.totalBytes)} kB</div>
                </div>
                <div>{toKB(item.file.size)} kB</div>
                <div className={`fileTransfer__status fileTransfer__status--${item.status}`}>{item.status}</div>
                <div>
                  <div className="ftProgress ftProgress--sm">
                    <div className="ftProgress__fill" style={{ width: `${item.progress || 0}%` }} />
                  </div>
                  <div className="fileTransfer__percent">{item.progress || 0}%</div>
                  {item.status === 'error' && item.error && (
                    <div className="fileTransfer__errorText" title={item.error}>{item.error}</div>
                  )}
                </div>
                <div className="fileTransfer__actions">
                  <button
                    className="ftBtn ftBtn--ghost"
                    onClick={() => window.open(`/globalfiles/${getCtrCd()}_${item.file.name}`, '_blank')}
                    disabled={item.status !== 'done'}
                  >
                    Download
                  </button>
                  <button
                    className="ftBtn ftBtn--danger"
                    onClick={() => handleDeleteFromDatabase(item.file.name)}
                    disabled={item.status !== 'done'}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="fileTransfer__panel">
        <div className="fileTransfer__header">
          <div>
            <div className="fileTransfer__title">Files on Server</div>
            <div className="fileTransfer__subtitle">Total: {fileList.length}</div>
          </div>
          <div className="fileTransfer__toolbar">
            <button className="ftBtn" onClick={handleGetFileListFromDataBase}>Refresh</button>
          </div>
        </div>

        <div className="fileTransfer__serverList">
          {fileList.map((file, index) => (
            <div key={index} className="fileTransfer__serverRow">
              <div className="fileTransfer__serverMeta">
                <div className="avatar">
                  <img
                    src={`/Picture_NS/NS_${file.INS_EMPL}.jpg`}
                    alt={file.INS_EMPL}
                    onError={(e) => {
                      e.currentTarget.src = '/noimage.webp';
                    }}
                  />
                </div>
                <div className="fileTransfer__serverText">
                  <span className="fileTransfer__serverIndex">{index + 1}.</span>
                  <span className="fileTransfer__serverIcon">{getFileIcon(file.FILE_NAME)}</span>
                  <span className="fileTransfer__serverDate">
                    {moment.utc(file.INS_DATE).format('DD/MM/YYYY HH:mm:ss')}
                  </span>
                  <span className="fileTransfer__serverEmpl">{file.INS_EMPL}</span>
                  <span className="fileTransfer__serverName">{file.FILE_NAME}</span>
                  <span className="fileTransfer__serverSize">
                    ({toKB(Number(file.FILE_SIZE || 0))} kB)
                  </span>
                </div>
              </div>
              <div className="fileTransfer__serverActions">
                <DownloadButton filename={file.FILE_NAME} />

                <button
                  onClick={() => {
                    const fullUrl = `${protocol}://${window.location.host}/globalfiles/${getCtrCd()}_${file.FILE_NAME}`;
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
                  className="ftBtn ftBtn--primary"
                >
                  Copy Link
                </button>
                <button className="ftBtn ftBtn--danger" onClick={() => handleDeleteFromDatabase(file.FILE_NAME)}>
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FileTransfer;