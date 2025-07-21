import { useRef, useState, useEffect } from 'react';
import { ReactSketchCanvas } from 'react-sketch-canvas';
import { Button } from '@heroui/react';

export const MySketchCanvasWithCrop = (props) => {
  const canvas = useRef(null);
  const [isCropping, setIsCropping] = useState(false);  //se siamo nella modalità ritaglio
  const [isDrawingCrop, setIsDrawingCrop] = useState(false)  //se abbiao premuto il mouse tasto del mouse e stiamo effettivamente ritagliando
  const [cropStart, setCropStart] = useState({ x: 0, y: 0 });
  const [cropEnd, setCropEnd] = useState({ x: 0, y: 0 });
  const [CanvasStrokeWidth, setCanvasStrokeWidth] = useState(4)

 // ... altre funzioni e rendering

 //Gestisci gli Eventi del Mouse per la Selezione: Aggiungi event listener al componente 
 // che contiene i canvas (o al canvas principale) per gestire l'inizio, il movimento e la 
  // fine del drag per la selezione

  const handleMouseDown = (e) => {
  if (isCropping) {
    //const rect = canvas.current.getBoundingClientRect();
     //The returned value is a DOMRect object which is the smallest rectangle which contains the entire element. https://developer.mozilla.org/en-US/docs/Web/API/Element/getBoundingClientRect
     setIsDrawingCrop(true)
     setCropStart({ x: e.clientX , y: e.clientY  });
  }
};

const handleMouseMove = (e) => {
  if (isCropping) {
        //const rect = canvas.current.getBoundingClientRect();
        setCropEnd({ x: e.clientX , y: e.clientY  });
  }
};

const handleMouseUp = () => {
  if (isCropping) {
    setIsDrawingCrop(false)
    setIsCropping(false);
    canvas.current.undo(); //eliminiamo il disegno fatto per la selezione
    
    setCanvasStrokeWidth(4)
    // Ora hai le coordinate di cropStart e cropEnd
    console.log('start: ')
    console.log(cropStart)
    console.log('end: ')
    console.log(cropEnd)
    performCrop();
  }
};


//Disegna il Rettangolo di Selezione: Crea un secondo canvas sovrapposto (con CSS position: absolute) 
// con le stesse dimensioni del canvas principale. Utilizza useEffect per ridisegnare il rettangolo 
// di selezione su questo canvas sovrapposto ogni volta che cropStart o cropEnd cambiano.
const selectionCanvasRef = useRef(null);

useEffect(() => {
  if (selectionCanvasRef.current && isCropping && isDrawingCrop) {
    const selectionCanvas = selectionCanvasRef.current;
    const ctx = selectionCanvas.getContext('2d');
    ctx.clearRect(0, 0, selectionCanvas.width, selectionCanvas.height); // Pulisci il canvas precedente

    const x = Math.min(cropStart.x, cropEnd.x);
    const y = Math.min(cropStart.y, cropEnd.y)-300;
    const width = Math.abs(cropStart.x - cropEnd.x);
    const height = Math.abs(cropStart.y - cropEnd.y);
    //const width = 50
    //const height = 50

    ctx.strokeStyle = 'blue';
    ctx.lineWidth = 2;
    ctx.strokeRect(x, y, width, height);
  } else if (selectionCanvasRef.current) {
    // Pulisci il canvas di selezione quando la modalità di ritaglio è disattivata
    const selectionCanvas = selectionCanvasRef.current;
    const ctx = selectionCanvas.getContext('2d');
    ctx.clearRect(0, 0, selectionCanvas.width, selectionCanvas.height);
  }
}, [cropStart, cropEnd, isCropping]);



const performCrop = () => {
  if (canvas.current) {
    const mainCanvas = canvas.current;

    const x = Math.min(cropStart.x, cropEnd.x);
    const y = Math.min(cropStart.y, cropEnd.y)-300;
    const width = Math.abs(cropStart.x - cropEnd.x);
    const height = Math.abs(cropStart.y - cropEnd.y);
    console.log('x: ' + x + '  y: ' + y + '  width: ' + width + '  height:  ' + height)

    mainCanvas.exportPaths().then(data=>{
       //salva i punti compresi nel rettangolo di selezione
        let selectedPoints = [];
        let temp = [];
        let newData = [];

       for (let i = 0; i < data.length; i++){
        if (data[i].strokeWidth > 0){
           temp = data[i].paths.map( (point)=>{
            if (point.x > x && point.x < x + width && point.y > y && point.y < y + height) 
              {return point;} else {return null}
           }).filter((point) => {return point != null})

           selectedPoints = selectedPoints.concat(temp)

           //eliminiamo dal canvaspath tutti i punti selezionati e creiamo un nuovo path con quei punti
           
           let newPoints =[];

              newPoints = data[i].paths.filter((point)=>{return !temp.includes(point)})
              console.log('without selected points')
              console.log(newPoints)
              console.log(newPoints.length)
              console.log(temp.length)
 
              newData.push(
                { paths: newPoints.map(x=>x),  //copia di temp, non semplicemente copia del puntator a temp
                  strokeWidth:4,
                  strokeColor: "red",
                  drawMode: true})

          }
           console.log('all points')
           console.log(data[i].paths)
        }
           
           console.log(data)

           //costruiamo un interfaccia canvasPath con i nuovi punti e la carichiamo nel canvas
           mainCanvas.clearCanvas();
           mainCanvas.loadPaths(newData)

    })
  }
};




const performCrop2 = () => {
  if (canvas.current) {
    const mainCanvas = canvas.current;

    const x = Math.min(cropStart.x, cropEnd.x);
    const y = Math.min(cropStart.y, cropEnd.y)-300;
    const width = Math.abs(cropStart.x - cropEnd.x);
    const height = Math.abs(cropStart.y - cropEnd.y);
    console.log('x: ' + x + '  y: ' + y + '  width: ' + width + '  height:  ' + height)

    mainCanvas.exportPaths().then(data=>{
       //salva i punti compresi nel rettangolo di selezione
        let selectedPoints = [];
        let temp = [];
        let newData = [];

       for (let i = 0; i < data.length; i++){

        if (data[i].strokeWidth > 0){

           temp = data[i].paths.map( (point)=>{

            if (point.x > x && point.x < x + width && point.y > y && point.y < y + height) 
              {return point;} else {return null}
           })
           .filter((point) => {return point != null})

           selectedPoints = selectedPoints.concat(temp)

           
           //scorriamo tutti i punti del paths, e facciamo uno slice del vettore nei punti in cui iniza e finisce la corrispondenza con i punti selezionati
           let points = data[i].paths 
           let newPaths = []
           for (let j = 0, k = 0, l = 0, start = 0, finish = 0; j < points.length, k<temp.length; j++){

              if(points[j]==temp[k]){ //slice del vettore in questo punto
                if(j!=0){
                  newPaths.push(points.slice(start, j))
                }
                

                //continuiamo finchè non finiscono i punti selezionati dal crop
                while (points[j]==temp[k] && j < points.length && k<temp.length){
                  j++;
                  k++;
                }

                start = j;
              }

              for (let path of newPaths){
                newData.push(
                { paths: path.map(x=>x),  //copia di temp, non semplicemente copia del puntator a temp
                  strokeWidth:4,
                  strokeColor: "red",
                  drawMode: true})
              }
              
            }
       }
          
        }
         mainCanvas.clearCanvas();
           mainCanvas.loadPaths(newData)

    })
  }
};




return (
       <div
          style={{ position: 'relative' }}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp} // Opzionale: gestisci quando il mouse esce dal contenitore
        >
        <ReactSketchCanvas ref={canvas} width={600} height={400} strokeWidth={CanvasStrokeWidth} />

          {/*isCropping ? <div className='w-[600px] h-[400px] bg-red-100'  style={{ position: 'absolute', top: 0, left: 0, pointerEvents: 'none' }} ></div> : <div></div>*/}
          <canvas
            ref={selectionCanvasRef}
            width={600}
            height={400}
            style={{ position: 'absolute', top: 0, left: 0, pointerEvents: 'none' }}
          />
          <Button onPress={() => {setIsCropping(!isCropping); setCanvasStrokeWidth(0)}}>
              {isCropping ? 'Annulla Ritaglio' : 'Abilita Ritaglio'}
          </Button>
      </div>
)

};









