import React, { useEffect, useRef, useState } from 'react'
import { generalQuery, getCtrCd, uploadQuery } from '../../../api/Api';
import Swal from 'sweetalert2';
import moment from 'moment';
import { FaFile, FaFileExcel, FaFileImage, FaFilePdf, FaFileWord } from 'react-icons/fa';
import { FaFileZipper } from 'react-icons/fa6';
import { f_downloadFile } from '../../../api/GlobalFunction';

interface FileProgress {
  file: File;
  progress: number;
}

const FileTransfer = () => {
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
   await generalQuery('update_file_name', {FILE_NAME: filename,FILE_SIZE: filesize, CTR_CD: getCtrCd()});
  } 

  const handleGetFileListFromDataBase = async () => {
    await generalQuery("get_file_list", {
    })
      .then((response) => {
        console.log(response.data.tk_status);
        if(response.data.tk_status !== "NG"){
          setFileList(response.data.data);
        } else {
          setFileList([]);
          console.log("Error get file list from database");
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }

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
      //setUploadedFiles([]);
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

  const handleDownload = (filepath: string) => {
    window.open(filepath, '_blank');
    
  };  

  const handleDelete = (file: File) => {
  setUploadedFiles(uploadedFiles.filter(f => f.file  !== file));  
  };
  
  const handleDeleteFromDatabase = async (filename: string) => {
    await generalQuery('delete_file', {FILE_NAME: filename});
    await handleGetFileListFromDataBase();
  } 

  useEffect(() => {
    handleGetFileListFromDataBase();
  }, []); 


  return (
    <div className="file-transfer-container" style={{ display: 'flex', width: '100%', height: '100%', margin: '0 auto', padding: '20px' }}>
      <div className="upload-section" style={{ flex: 1, marginRight: '20px', height: '100%' }}>
        <div className="file-upload-header" style={{ marginBottom: '20px', height: '100%' }}>
          <div
            className="drag-drop-area"
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            style={{
              border: '2px dashed #ccc',
              borderRadius: '4px',
              padding: '20px',
              textAlign: 'center',
              cursor: 'pointer',
              marginBottom: '10px'
            }}
          >
            Drag and drop files here
          </div>
          <input
            type="file"
            multiple
            onChange={handleFileSelect}
            style={{ display: 'none' }}
            ref={fileInputRef}
          />
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <button 
              onClick={() => {
                setOverallProgress(0);
                setUploadedFiles([]);
                fileInputRef.current?.click()
              }} 
              style={{
                padding: '10px 15px',
                backgroundColor: '#4CAF50',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Select File
            </button>
            <button 
              onClick={() => {
                setOverallProgress(0);
                setUploadedFiles([]);
              }} 
              style={{
                padding: '10px 15px',
                backgroundColor: '#f44336',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Clear
              </button>
            <button 
              onClick={handleUpload}
              style={{
                padding: '10px 15px',
                backgroundColor: '#008CBA',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Upload
            </button>
          </div>
        </div>
        <div className="overall-progress" style={{ marginBottom: '20px', padding: '10px', border: '1px solid #ddd', borderRadius: '4px' }}>
          <h3 style={{ marginBottom: '10px' }}>Overall Progress</h3>
          <div style={{ width: '100%', backgroundColor: '#e0e0e0', borderRadius: '4px', overflow: 'hidden' }}>
            <div 
              style={{
                width: `${overallprogress}%`,
                height: '10px',
                backgroundColor: '#4CAF50',
                transition: 'width 0.3s ease-in-out'
              }}
            />
          </div>
          <div style={{ textAlign: 'right', marginTop: '5px' }}>
            {`${overallprogress.toFixed(0)}%`}
          </div>
        </div>
        <div className="file-list" style={{ border: '1px solid #ddd', borderRadius: '4px', padding: '10px', height: '62.5vh', overflowY: 'auto' }}>
          {uploadedFiles.map((file, index) => (
            <div key={index} className="file-item" style={{ display: 'flex', justifyContent: 'space-between', gap: '10px',   alignItems: 'center', padding: '10px', borderBottom: '1px solid #eee' }}>
              <span style={{ flex: 1 }}> {index + 1}. {file.file.name} - {(file.file.size / 1024).toFixed(2)} kB</span> 
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '5px' }}>
                <div style={{ width: '100%', backgroundColor: '#e0e0e0', borderRadius: '4px', overflow: 'hidden' }}>
                  <div 
                    style={{
                      width: `${file.progress || 0}%`,
                      height: '5px',
                      backgroundColor: '#4CAF50',
                      transition: 'width 0.3s ease-in-out'
                    }}
                  />
                  {file.progress} %
                </div>
                <div>
                  <button 
                    onClick={() => handleDownload(`/globalfiles/${getCtrCd()}_${file.file.name}`)}
                    style={{
                      padding: '5px 10px',
                      backgroundColor: '#4CAF50',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      marginRight: '5px'
                    }}
                  >
                    Download
                  </button>
                  <button 
                    onClick={() => handleDeleteFromDatabase(file.file.name)}
                    style={{
                      padding: '5px 10px',
                      backgroundColor: '#f44336',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer'
                    }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="database-files-section" style={{ flex: 1, height: '100%' }}>
        <h3>Files on Server (Total: {fileList.length}) <button onClick={handleGetFileListFromDataBase}>Refresh</button></h3>
        <div className="file-list" style={{ border: '1px solid #ddd', borderRadius: '4px', padding: '10px', height: '85vh', overflowY: 'auto' }}>
          {fileList.map((file, index) => (
            <div key={index} className="file-item" style={{ display: 'flex', justifyContent: 'space-between', gap: '10px', alignItems: 'center', padding: '10px', borderBottom: '1px solid #eee' }}>
              <div style={{ display: 'flex', alignItems: 'center', flex: 1 }}>
                <div style={{ width: '30px', height: '30px', borderRadius: '50%', backgroundColor: '#ccc', marginRight: '10px', overflow: 'hidden' }}>
                  <img src={`/Picture_NS/NS_${file.INS_EMPL}.jpg`} alt={file.INS_EMPL} style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={(e) => { e.currentTarget.src = '/noimage.webp' }} />
                </div>
                {(() => {
                  const fileExt = file.FILE_NAME.split('.').pop().toLowerCase();
                  if (['doc', 'docx', 'txt', 'rtf'].includes(fileExt)) {
                    return <FaFileWord color='green' size={20}/>
                  }
                  if (['pdf'].includes(fileExt)) {
                    return <FaFilePdf color='red' size={20}/>
                  }
                  if (['xls', 'xlsx'].includes(fileExt)) {
                    return <FaFileExcel color='green' size={20}/>
                  }
                  if (['jpg', 'jpeg', 'png', 'gif', 'bmp'].includes(fileExt)) {
                    return <FaFileImage color='skyblue' size={20}/>
                  }
                  if (['zip', 'rar', '7z'].includes(fileExt)) {
                    return <FaFileZipper color='orange' size={20}/>
                  }
                  return <FaFile color='gray' size={20}/>
                })()}
                <span style={{ flex: 1 }}>{index + 1}. {moment.utc(file.INS_DATE).format('DD/MM/YYYY HH:mm:ss')} {file.INS_EMPL} - <p style={{ display: 'inline-block', maxWidth: '250px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{file.FILE_NAME}</p> - {(file.FILE_SIZE / 1024).toLocaleString('en-US', { maximumFractionDigits: 2 })} kB</span>
              </div>
              <button 
                onClick={() => {
                  const hreftlink = `http://${window.location.host}/globalfiles/${getCtrCd()}_${file.FILE_NAME}`;
                  f_downloadFile(hreftlink, `${getCtrCd()}_${file.FILE_NAME}`);
                }}
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
              <button 
                onClick={() => {
                  const fileUrl = `http://${window.location.host}/globalfiles/${file.CTR_CD}_${file.FILE_NAME}`;
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
              <button 
                onClick={() => handleDeleteFromDatabase(file.FILE_NAME)}
                style={{
                  padding: '5px 10px',
                  backgroundColor: '#f44336',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer' 
                }}
              >
                Delete
              </button> 
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default FileTransfer