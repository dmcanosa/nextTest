import React, { useState, useRef, SyntheticEvent } from 'react';

type CanvasProps = {
  saveCanvas: (s:string) => void;
};

export default function Canvas( {saveCanvas}: CanvasProps){
  const [mouseDown, setMouseDown] = useState(false);
  const [mouseDownPoint, setMouseDownPoint] = useState({x: 0, y: 0});
  const canvasRef = useRef(null);

  const handleMouseDown = (e: SyntheticEvent) => {
    console.log('mouse Down ',(e.nativeEvent as MouseEvent).offsetX+' '+(e.nativeEvent as MouseEvent).offsetY);
    setMouseDownPoint({ x: (e.nativeEvent as MouseEvent).offsetX, y: (e.nativeEvent as MouseEvent).offsetY });

    if(canvasRef.current){
      const stage:CanvasRenderingContext2D = (canvasRef.current as HTMLCanvasElement).getContext('2d') as CanvasRenderingContext2D;
      stage.strokeStyle = '#000';
      stage.lineWidth = 2;

      stage.moveTo(((e.nativeEvent as MouseEvent) as MouseEvent).offsetX, ((e.nativeEvent as MouseEvent) as MouseEvent).offsetY);
    }
    setMouseDown(true);
  };
  
  const handleMouseMove = (e: SyntheticEvent) => {
    if(mouseDown && canvasRef.current){
      //console.log('mouse moving', e);  
      //console.log('mouse moving', (e.nativeEvent as MouseEvent).offsetX+' '+(e.nativeEvent as MouseEvent).offsetY+' '+mouseDownPoint.x+' '+mouseDownPoint.y);  
      
      const stage:CanvasRenderingContext2D = (canvasRef.current as HTMLCanvasElement).getContext('2d') as CanvasRenderingContext2D;
      stage.strokeStyle = '#000';
      stage.lineWidth = 2;

      stage.moveTo(mouseDownPoint.x, mouseDownPoint.y);
      stage.lineTo((e.nativeEvent as MouseEvent).offsetX, (e.nativeEvent as MouseEvent).offsetY);
      stage.stroke();

      setMouseDownPoint({ x: (e.nativeEvent as MouseEvent).offsetX, y: (e.nativeEvent as MouseEvent).offsetY });
    }
  };

  const handleMouseUp = (e: SyntheticEvent) => {
    console.log('mouse Up', e);
    setMouseDown(false);
    let b64:string = '';
    if(canvasRef.current){
      b64 = (canvasRef.current as HTMLCanvasElement).toDataURL();
    }
    //b64 = b64.substring(22);
    //data:image/png;base64,
    //console.log(b64);
    saveCanvas(b64);
  };

  return (
    <canvas
      ref={ canvasRef }
      width={640}
      height={480}
      id="canvas"
      className='canvas'
      onMouseDown={ handleMouseDown }
      onMouseMove={ handleMouseMove }
      onMouseUp={ handleMouseUp }
    />
  );
}

