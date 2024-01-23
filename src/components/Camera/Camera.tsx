import React, { useEffect, useRef } from 'react';

const CameraComponent: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const enableCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (error) {
        console.error('Error accessing camera:', error);
      }
    };

    enableCamera();

    // Cleanup function to stop the camera when the component is unmounted
    return () => {
      const stream = videoRef.current?.srcObject as MediaStream;
      if (stream) {
        const tracks = stream.getTracks();
        tracks.forEach(track => track.stop());
      }
    };
  }, []);

  return (
    <div>
      <h2>Camera Debug Mode</h2>
      <video ref={videoRef} autoPlay playsInline muted />
    </div>
  );
};

export default CameraComponent;
