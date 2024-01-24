import React, { useEffect, useRef, useState } from 'react';

const CameraComponent: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isFrontCamera, setIsFrontCamera] = useState<boolean>(true);

  useEffect(() => {
    const enableCamera = async () => {
      try {
        const facingMode = isFrontCamera ? 'user' : 'environment';
        const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode } });

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
  }, [isFrontCamera]);

  const handleCameraSwitch = () => {
    setIsFrontCamera(prevIsFrontCamera => !prevIsFrontCamera);
  };

  return (
    <div>
      <h2>Camera Debug Mode</h2>
      <video ref={videoRef} autoPlay playsInline muted />
      <button onClick={handleCameraSwitch}>Switch Camera</button>
    </div>
  );
};

export default CameraComponent;