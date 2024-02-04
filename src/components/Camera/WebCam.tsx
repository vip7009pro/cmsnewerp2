import Webcam from "react-webcam";
import React, { useEffect, useState } from 'react'
import Swal from "sweetalert2";
import './WebCam.scss'
const WebCam = () => {
  const videoConstraints = {
    width: 1280,
    height: 720,
    facingMode: "environment"
  };
  const WebcamCapture = () => {
    const webcamRef = React.useRef(null);
    const [capturedImage, setCapturedImage] = useState<any>();
    const [deviceId, setDeviceId] = React.useState({});
    const [devices, setDevices] = React.useState([]);
    const [selectedDevice, setSelectedDevice] = useState({});
    console.log(selectedDevice);
    const handleDevices = React.useCallback(
      mediaDevices =>
        setDevices(mediaDevices.filter(({ kind }) => kind === "videoinput")),
      [setDevices]
    );
    const capture = React.useCallback(
      () => {
        const imageSrc = webcamRef.current?.getScreenshot({ width: 1920, height: 1080 });
        setCapturedImage(imageSrc);
      },
      [webcamRef]
    );
    const handleDownload = (dataUri: any) => {
      if (dataUri) {
        const link = document.createElement('a');
        link.href = dataUri;
        link.download = 'captured_image.jpg';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    };
    let kk = devices[0]?.getCapabilities();
    console.log(kk);
    useEffect(() => {
      navigator.mediaDevices.enumerateDevices().then(handleDevices);
    }, [])
    return (
      <div className="webcam">
        <select
          name="camera"
          value={selectedDevice.deviceId}
          onChange={(e) => {
            setSelectedDevice(devices.filter((ele: any, index: number) => {
              // Swal.fire('Tb',ele.deviceId);
              return (ele.deviceId === e.target.value)
            })[0]);
            //Swal.fire('thoong bao',selectedDevice.deviceId,'success');
          }}
        >
          {devices.map((device, key) => {
            return (
              <option value={device.deviceId}>{device.label}</option>
            )
          })}
        </select>
        <div className="webcamdiv">
          {capturedImage === null && <Webcam
            audio={false}
            height={480}
            ref={webcamRef}
            screenshotFormat="image/jpeg"
            width={640}
            videoConstraints={
              {
                width: 3840,
                height: 2160,
                facingMode: "environment",
                deviceId: selectedDevice.deviceId,
                groupId: selectedDevice.groupId,
              }
            }
            imageSmoothing={true}
            screenshotQuality={1}
            forceScreenshotSourceSize={true}
            minScreenshotHeight={1080}
            minScreenshotWidth={1920}
          />}
        </div>
        <div>
          <button onClick={() => { setCapturedImage(null) }}>Start Cam</button>
          <button onClick={capture}>Capture photo</button>
          <button onClick={() => { handleDownload(capturedImage) }}>Download Image</button>
        </div>
        {capturedImage && (
          <div>
            <h2>Captured Photo:</h2>
            <img src={capturedImage} alt="Captured" width={'640px'} height={'480px'} />
          </div>
        )}
      </div>
    );
  };
  return (
    <div>
      <WebcamCapture />
    </div>
  )
}
export default WebCam