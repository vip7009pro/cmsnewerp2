import cv, { Mat } from "@techstark/opencv-js";
import React, { useEffect, useRef, useState } from "react";
import './OpenCV.scss'
interface ROI_POINT {
  p1: cv.Point,
  p2: cv.Point
}
const OpenCV = () => {
  const wait = useRef(false);
  const timesPerSecond = 1000000;
  const orgMat = useRef<any>();
  const tempRef = useRef<HTMLCanvasElement>(null);
  const inputImgRef = useRef<any>();
  const grayImgRef = useRef<any>();
  const cannyEdgeRef = useRef<any>();
  const canvasRefs = useRef<Array<React.RefObject<HTMLCanvasElement>>>([]);
  const [templates, setTemplates] = useState<cv.Mat[]>([]);
  const [imgUrl, setImgUrl] = useState("/Picture_NS/NS_NHU1903.jpg");
  const [isDrawing, setIsDrawing] = useState(false);
  const [startPosition, setStartPosition] = useState({ x: 0, y: 0 });
  const [endPosition, setEndPosition] = useState({ x: 0, y: 0 });
  const [trigger, setTrigger] = useState(true);
  const [roiList, setROIList] = useState<ROI_POINT[]>([]);
  const downloadTemplate = () => {
    const canvas = inputImgRef.current;
    const link = document.createElement('a');
    link.download = 'template.png';
    link.href = canvas.toDataURL();
    link.click();
  };
  const drawRectangle = (start: any, end: any) => {
    const canvas = inputImgRef.current;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    const width = end.x - start.x;
    const height = end.y - start.y;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.strokeRect(start.x, start.y, width, height);
  };
  const updatePosition = (e: any) => {
    if (!isDrawing) return;
    if (!wait.current) {
      wait.current = true;
      setTimeout(() => {
        wait.current = false;
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
      }, 1000 / timesPerSecond);
    }
  };
  const startDrawing = (e: any) => {
    setIsDrawing(true);
    const canvas = inputImgRef.current;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
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
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    const { offsetX, offsetY } = e.nativeEvent;
    ctx.lineTo(offsetX, offsetY);
    ctx.stroke();
  };
  const resetcanvas = async () => {
    const img = cv.imread(orgMat.current);
    cv.imshow(inputImgRef.current, img);
    img.delete();
    setTemplates([]);
    canvasRefs.current = [];
    setTrigger(!trigger);
    setROIList([]);
    setStartPosition({ x: 0, y: 0 });
    setEndPosition({ x: 0, y: 0 });
  }
  const drawMatsToCanvas = async (templates: cv.Mat[]) => {
    console.log('inputtemp', templates)
    canvasRefs.current = Array(templates.length)
      .fill(null)
      .map((_, i) => canvasRefs.current[i] || React.createRef<HTMLCanvasElement>());
    const canvasContexts = canvasRefs.current.map(ref => ref.current?.getContext('2d', { willReadFrequently: true }));
    // Draw each mat to its respective canvas
    await Promise.all(templates.map(async (mat, index) => {
      const canvas = canvasRefs.current[index].current;
      if (!canvas) return;
      // Skip if canvas is not available
      // Convert the OpenCV Mat to a canvas image
      await cv.imshow(canvas, mat);
      // Draw the canvas image      
    }));
  };
  const saveImage = ({ mat }: { mat: cv.Mat }) => {
    console.log('mat', mat);
    cv.imshow(tempRef.current!, mat);
    const canvas = tempRef.current;
    const link = document.createElement('a');
    link.download = 'template.png';
    link.href = canvas?.toDataURL()!;
    link.click();
  };
  const MatToCanvas = ({ mat }: { mat: cv.Mat }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    useEffect(() => {
      const drawMatToCanvas = async () => {
        if (!canvasRef.current || !mat) return;
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d', { willReadFrequently: true });
        ctx?.clearRect(0, 0, canvas.width, canvas.height);
        await cv.imshow(canvas, mat);
      };
      drawMatToCanvas();
    }, [mat]);
    return <canvas ref={canvasRef} />;
  };
  const addTemplate = async () => {
    console.log(startPosition, endPosition);
    const img = cv.imread(orgMat.current);
    cv.imshow(inputImgRef.current, img);
    const canvas = inputImgRef.current;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    const imageData = ctx.getImageData(startPosition.x, startPosition.y, endPosition.x - startPosition.x, endPosition.y - startPosition.y, { willReadFrequently: true });
    const croppedCanvas = document.createElement('canvas');
    const croppedCtx = croppedCanvas.getContext('2d', { willReadFrequently: true });
    croppedCanvas.width = endPosition.x - startPosition.x;
    croppedCanvas.height = endPosition.y - startPosition.y;
    croppedCtx?.putImageData(imageData, 0, 0);
    const croppedImageData = croppedCtx?.getImageData(0, 0, croppedCanvas.width, croppedCanvas.height);
    const croppedMat = cv.matFromArray(croppedCanvas.height, croppedCanvas.width, cv.CV_8UC4, croppedImageData?.data);
    setTemplates([...templates, croppedMat]);
    console.log([...templates, croppedMat]);
    setTrigger(!trigger);
    drawMatsToCanvas([...templates, croppedMat]);
  }
  const addROI = async () => {
    console.log(startPosition, endPosition);
    let startPoint = new cv.Point(startPosition.x, startPosition.y);
    let endPoint = new cv.Point(endPosition.x, endPosition.y);
    let newROI: ROI_POINT = {
      p1: startPoint,
      p2: endPoint
    }
    setROIList([...roiList, newROI]);
    console.log([...roiList, newROI]);
  }
  const drawROI = async () => {
    const img = cv.imread(orgMat.current);
    for (let i = 0; i < roiList.length; i++) {
      let color = new cv.Scalar(255, 255, 0, 255);
      let thickness = 1;
      cv.rectangle(img, roiList[i].p1, roiList[i].p2, color, thickness, cv.LINE_4, 0);
      cv.imshow(inputImgRef.current, img);
    }
    img.delete();
  }
  const matchTemplate = async () => {
    let Start = new Date().getTime(); 
    const img = cv.imread(orgMat.current);
    for (let i = 0; i < templates.length; i++) {
      const dstMat = new cv.Mat();
      const mask = new cv.Mat();
      cv.matchTemplate(img, templates[i], dstMat, cv.TM_CCOEFF_NORMED, mask);
      const result = cv.minMaxLoc(dstMat, mask);
      const maxPoint = result.maxLoc;
      let addMaxPoint: cv.Point = {
        x: maxPoint.x + templates[i].cols,
        y: maxPoint.y + templates[i].rows
      }
      let color = new cv.Scalar(255, 255, 0, 255);
      let thickness = 1;
      cv.rectangle(img, maxPoint, addMaxPoint, color, thickness, cv.LINE_4, 0);
      cv.imshow(inputImgRef.current, img);
    }
    img.delete();
    let  end = new Date().getTime();
    let executionTime = end - Start; 
    console.log("Function took " + executionTime + " milliseconds");
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
      <canvas ref={tempRef} style={{ display: 'none' }} />
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
        <div className="buttondiv">
          <button onClick={() => {
            resetcanvas()
          }}>Reset</button>
          <button onClick={() => {
            addTemplate()
          }}>Add Template</button>
          <button onClick={() => {
          }}>Save Template</button>
          <button onClick={() => {
            addROI();
          }}>Add ROI</button>
          <button onClick={() => {
            drawROI();
          }}>Draw ROI</button>
          <button onClick={() => {
            matchTemplate();
          }}>Match template</button>
          <button onClick={() => {
            console.log(templates);
          }}>Refresh</button>
        </div>
        <div className="templatediv">
          {
            templates.map((mat, index) => {
              return (
                <div className="templatecv" onClick={() => {
                  console.log(templates[index])
                  //downloadTemplate();
                  saveImage({ mat: templates[index] });
                }} key={index}>
                  <MatToCanvas key={index} mat={mat}></MatToCanvas>
                </div>
              )
            }
            )
          }
        </div>
        <div className="image-card">
          <img
            hidden={true}
            crossOrigin="anonymous"
            alt="Original input"
             width={"700px"}
             height={"640px"}
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
            style={{ backgroundColor: 'red' }}
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