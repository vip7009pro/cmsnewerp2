import React, { useState, useEffect, useRef } from 'react';
import Swal from 'sweetalert2';

const CameraComponent: React.FC = () => {
  const [cameraDevices, setCameraDevices] = useState<MediaDeviceInfo[]>([]);
  const [selectedCameraIndex, setSelectedCameraIndex] = useState<number>(0);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const getCameraDevices = async () => {
      try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        const cameras = devices.filter(device => device.kind === 'videoinput');
        
        let str: string = '';
        cameras.map((ele: any, index: number)=> {
          str += `${index}: ${ele.deviceId} | ${ele.groupId} | ${ele.kind} | ${ele.label} | `
        });
        Swal.fire('Camera', str);
        console.log(cameras);
        setCameraDevices(cameras);
      } catch (error) {
        console.error('Error getting camera devices:', error);
      }
    };
    getCameraDevices();
  }, []);

  useEffect(() => {
    const enableCamera = async () => {
      try {
        const newStream = await navigator.mediaDevices.getUserMedia({
          video: {
            deviceId: {
              exact: cameraDevices[selectedCameraIndex]?.deviceId,
            },
          },
        });

        if (videoRef.current) {
          videoRef.current.srcObject = newStream;
          setStream(newStream);
        }
      } catch (error) {
        console.error('Error accessing camera:', error);
      }
    };
    enableCamera();
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [selectedCameraIndex]);

  const handleCameraSwitch = () => {
    setSelectedCameraIndex(prevIndex => (prevIndex + 1) % cameraDevices.length);
  };

  const handleTakePicture = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      const context = canvas.getContext('2d');
      if (context) {
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        const imageDataURL = canvas.toDataURL('image/jpeg');

        // Create a download link for the captured image
        const downloadLink = document.createElement('a');
        downloadLink.href = imageDataURL;
        downloadLink.download = 'captured_image.jpg';
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
      }
    }
  };

  return (
    <div>
      <h2>Camera Capture</h2>
      {cameraDevices.length > 1 && (
        <button onClick={handleCameraSwitch}>Switch Camera</button>
      )}
      <video ref={videoRef} autoPlay playsInline />
      <button onClick={handleTakePicture}>Take Picture</button>
      <canvas ref={canvasRef} style={{ display: 'block' }} width={'1920px'} height={'1080px'}/>
    </div>
  );
};

export default CameraComponent;