import React, { useState, useEffect, useRef } from 'react'
import { Html5QrcodeScanner } from 'html5-qrcode'
import './Scanner.scss'
const Scanner = () => {
  const [scanResult, setScanResult] = useState('');
  const scanner = useRef<any>(null);
  function success(result: string) {
    //scanner.current.clear();      
    setScanResult(result);
    console.log(result);
  }
  function error(err: string) {
    //console.log(err)
  }
  const startRender = () => {
    scanner.current.render(success, error);
  }
  useEffect(() => {    
    scanner.current = new Html5QrcodeScanner('reader', {      
      qrbox: {
        width: 500,
        height: 500
      },
      fps: 1,
      rememberLastUsedCamera: true,
      showTorchButtonIfSupported: true,
    }, false);
  }, [])
  return (
    <div className="scanQR">
      <h1> QR code Scanner</h1>
      <button onClick={() => {
        setScanResult('');
        startRender();
      }}>Reset</button>
      <div>Scan result: {scanResult}</div>
      <div id="reader"></div>
    </div>
  )
}
export default Scanner