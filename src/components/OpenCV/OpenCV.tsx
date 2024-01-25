import React from 'react'

const OpenCV = () => {
  
  return (
    <>
      <h2>Hello OpenCV.js</h2>
      <div>
        <div className="inputoutput">
          <img id="imageSrc" alt="No Image" />
          <div className="caption">imageSrc <input type="file" id="fileInput" name="file" /></div>
        </div>
      </div>
    </>
  )
}
export default OpenCV