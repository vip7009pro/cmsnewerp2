import cv, { Mat } from "@techstark/opencv-js";
import React, { useEffect, useRef, useState } from "react";
import './OpenCV.scss'
const OpenCV = () => {
  const orgMat = useRef<any>();
  const inputImgRef = useRef<any>();
  const grayImgRef = useRef<any>();
  const cannyEdgeRef = useRef<any>();
  const canvasRefs = useRef<Array<React.RefObject<HTMLCanvasElement>>>([]);
  const [templates, setTemplates]= useState<cv.Mat[]>([]);
  const [imgUrl, setImgUrl] = useState("/Picture_NS/NS_NHU1903.jpg");
  const [isDrawing, setIsDrawing] = useState(false);
  const [startPosition, setStartPosition] = useState({ x: 0, y: 0 });
  const [endPosition, setEndPosition] = useState({ x: 0, y: 0 });
  const [trigger, setTrigger] = useState(true);


  const saveTemplate = () => {
    const canvas = inputImgRef.current;
    const link = document.createElement('a');
    link.download = 'template.png';
    link.href = canvas.toDataURL();
    link.click();
  };

  const drawRectangle = (start: any, end: any) => {
    const canvas = inputImgRef.current;
    const ctx = canvas.getContext('2d');
    const width = end.x - start.x;
    const height = end.y - start.y;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.strokeRect(start.x, start.y, width, height);
  };

  const updatePosition = (e: any) => {
    if (!isDrawing) return;
    const { offsetX, offsetY } = e.nativeEvent;
    setEndPosition({ x: offsetX, y: offsetY });
    const img = cv.imread(orgMat.current);
    let startPoint = new cv.Point(startPosition.x, startPosition.y);
    let endPoint = new cv.Point(endPosition.x, endPosition.y);
    let color = new cv.Scalar(255, 255, 0, 255);
    let thickness = 1;
    cv.rectangle(img, startPoint, endPoint, color, thickness, cv.LINE_4, 0);
    cv.imshow(inputImgRef.current, img);
    img.delete();
  };


  const startDrawing = (e: any) => {
    setIsDrawing(true);
    const canvas = inputImgRef.current;
    const ctx = canvas.getContext('2d');
    const { offsetX, offsetY } = e.nativeEvent;
    setStartPosition({ x: offsetX, y: offsetY });
  };

  const endDrawing = () => {
    setIsDrawing(false);
    setTrigger(!trigger);
  };

  const draw = (e: any) => {
    if (!isDrawing) return;
    const canvas = inputImgRef.current;
    const ctx = canvas.getContext('2d');
    const { offsetX, offsetY } = e.nativeEvent;
    ctx.lineTo(offsetX, offsetY);
    ctx.stroke();
  };

  const resetcanvas = async () => {
    const img = cv.imread(orgMat.current);
    cv.imshow(inputImgRef.current, img);
    img.delete();
    setTemplates([]);
    canvasRefs.current=[];
    setTrigger(!trigger);
  }

  const drawMatsToCanvas = async (templates: cv.Mat[]) => {
    canvasRefs.current = Array(templates.length)
      .fill(null)
      .map((_, i) => canvasRefs.current[i] || React.createRef<HTMLCanvasElement>());      
    const canvasContexts = canvasRefs.current.map(ref => ref.current?.getContext('2d'));
    // Draw each mat to its respective canvas
    await Promise.all(templates.map(async (mat, index) => {
      const canvas = canvasRefs.current[index].current;
      if (!canvas) return; // Skip if canvas is not available
      // Convert the OpenCV Mat to a canvas image
      await cv.imshow(canvas, mat);
      // Draw the canvas image      
    }));
  };

  const addTemplate = async ()=> {
    console.log(startPosition,endPosition);
    const img = cv.imread(orgMat.current);    
    cv.imshow(inputImgRef.current, img);


    const canvas = inputImgRef.current;
    const ctx = canvas.getContext('2d');
    const imageData = ctx.getImageData(startPosition.x, startPosition.y, endPosition.x - startPosition.x, endPosition.y - startPosition.y);
    const croppedCanvas = document.createElement('canvas');
    const croppedCtx = croppedCanvas.getContext('2d');
    croppedCanvas.width = endPosition.x - startPosition.x;
    croppedCanvas.height = endPosition.y - startPosition.y;
    croppedCtx?.putImageData(imageData, 0, 0);    
    const croppedImageData = croppedCtx?.getImageData(0, 0, croppedCanvas.width, croppedCanvas.height);
    const croppedMat = cv.matFromArray(croppedCanvas.height, croppedCanvas.width, cv.CV_8UC4, croppedImageData?.data);   

    setTemplates([...templates, croppedMat]);    
    console.log(templates);
    setTrigger(!trigger);

    drawMatsToCanvas([...templates, croppedMat]);
  }

  const processImage = async (imgSrc: any) => {
    const img = cv.imread(imgSrc);
    // to original image    
    cv.imshow(inputImgRef.current, img);
    // to gray scale
    const imgGray = new cv.Mat();
    cv.cvtColor(img, imgGray, cv.COLOR_BGR2GRAY);
    cv.imshow(grayImgRef.current, imgGray);
    // detect edges using Canny
    const edges = new cv.Mat();
    cv.Canny(imgGray, edges, 100, 100);
    //console.log(edges);
    cv.imshow(cannyEdgeRef.current, edges);
    // need to release them manually
    img.delete();
    imgGray.delete();
    edges.delete();
  }


  useEffect(() => {    



  }, [])
  return (
    <div className="opencvdiv">
      <div style={{ marginTop: "30px" }}>
        <span style={{ marginRight: "10px" }}>Select an image file:</span>
        <input
          type="text"
          name="file"
          onChange={(e) => {
            setImgUrl(e.target.value);
          }}
        />
      </div>
      <div className="images-container">
        <button onClick={() => {
          resetcanvas()
        }}>Reset</button>
        <button onClick={() => {
          addTemplate()
        }}>Add Template</button>

      <div>
      {templates.map((mat, index) => (
        <canvas key={index} ref={canvasRefs.current[index]} />
      ))}
    </div>
        <div className="image-card">
          <img
            hidden={true}
            crossOrigin="anonymous"
            alt="Original input"
            width={"520px"}
            height={"550px"}
            src={imgUrl}
            onLoad={(e) => {
              console.log("Loaded");
              orgMat.current = (e.target);
              processImage(e.target);
            }}            
          />
        </div>
        <div className="image-card">
          <div style={{ margin: "10px" }}>↓↓↓ The original image ↓↓↓</div>
          <canvas
            style={{backgroundColor:'red'}}           
            ref={inputImgRef}
            onMouseDown={startDrawing}
            onMouseUp={endDrawing}
            onMouseMove={updatePosition} />
        </div>
        <div className="image-card">
          <div style={{ margin: "10px" }}>↓↓↓ The gray scale image ↓↓↓</div>
          <canvas ref={grayImgRef} />
        </div>
        <div className="image-card">
          <div style={{ margin: "10px" }}>↓↓↓ Canny Edge Result ↓↓↓</div>
          <canvas ref={cannyEdgeRef} />
        </div>
      </div>
    </div>
  )
}
export default OpenCV