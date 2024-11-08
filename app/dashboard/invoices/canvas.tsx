import React, { useState, useRef } from 'react';

export default function Canvas({ saveCanvas }){
  const [mouseDown, setMouseDown] = useState(false);
  const [mouseDownPoint, setMouseDownPoint] = useState({x: 0, y: 0});
  const canvasRef = useRef(null);

  const handleMouseDown = (e) => {
    console.log('mouse Down ',e.nativeEvent.offsetX+' '+e.nativeEvent.offsetY);
    setMouseDownPoint({ x: e.nativeEvent.offsetX, y: e.nativeEvent.offsetY });

    const stage = canvasRef.current.getContext('2d');
    stage.strokeStyle = '#000';
    stage.lineWidth = 2;

    stage.moveTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
    
    setMouseDown(true);
  };
  
  const handleMouseMove = (e) => {
    if(mouseDown && canvasRef.current){
      //console.log('mouse moving', e);  
      //console.log('mouse moving', e.nativeEvent.offsetX+' '+e.nativeEvent.offsetY+' '+mouseDownPoint.x+' '+mouseDownPoint.y);  
      
      const stage = canvasRef.current.getContext('2d');
      stage.strokeStyle = '#000';
      stage.lineWidth = 2;

      stage.moveTo(mouseDownPoint.x, mouseDownPoint.y);
      stage.lineTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
      stage.stroke();

      setMouseDownPoint({ x: e.nativeEvent.offsetX, y: e.nativeEvent.offsetY });
    }
  };

  const handleMouseUp = (e) => {
    console.log('mouse Up');
    setMouseDown(false);
    saveCanvas(canvasRef.current.toDataURL());
    //let b64 = canvasRef.current.toDataURL();
    //console.log(b64);
  };

  return (
    <canvas
      ref={ canvasRef }
      width={1280}
      height={720}
      id="canvas"
      className='canvas'
      onMouseDown={ handleMouseDown }
      onMouseMove={ handleMouseMove }
      onMouseUp={ handleMouseUp }
    />
  );
}


