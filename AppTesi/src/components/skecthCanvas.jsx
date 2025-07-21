import { useState, useRef, useEffect, useCallback, forwardRef, useImperativeHandle } from 'react';

import { DraggableBar } from "../components/DraggableBar";
import { TransformWrapper, TransformComponent, useControls, useTransformContext, useTransformEffect } from "react-zoom-pan-pinch";
import { Button } from '@heroui/react';

import { CiZoomIn, CiZoomOut } from "react-icons/ci"


const SketchCavas = forwardRef((props, ref) => {

  const {canvasOnTheLeft, w,h, percentWidth, isImageBackgrounds, page, transparency, visibleBoundingBoxes} = props;

  const canvasRef = useRef(null); // Riferimento al canvas principale
  const selectionCanvasRef = useRef(null); // Riferimento al canvas per la selezione del ritaglio
  const BBCanvasRef = useRef(null); // Riferimento al canvas per i bounding boxes
  
  // Stato per il contesto di disegno 2D del canvas
  const [ctx, setCtx] = useState(null);
  const contextRef = useRef(null); // Riferimento al contesto 2D del canvas principale

  const [isDrawing, setIsDrawing] = useState(false); // Indica se l'utente sta disegnando
  const [tool, setTool] = useState('pen'); // Strumento corrente: 'pen', 'eraser', 'crop'
  const [penColor, setPenColor] = useState('black'); // Colore della penna
  const [penSize, setPenSize] = useState(3); // Dimensione della penna/gomma


  const [isCropping, setIsCropping] = useState(false); // Indica se la modalità ritaglio è attiva
  const [cropStart, setCropStart] = useState({ x: 0, y: 0 }); // Coordinate di inizio selezione ritaglio
  const [cropEnd, setCropEnd] = useState({ x: 0, y: 0 }); // Coordinate di fine selezione ritaglio
  //const [croppedImage, setCroppedImage] = useState(null); // URL dei dati dell'immagine ritagliata

  // Stati per lo spostamento dell'immagine ritagliata
  const [copiedElement, setCopiedElement] = useState(); // Immagine ritagliata
  const [isDragging, setIsDragging] = useState(false); // Indica se un elemento è in fase di trascinamento
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 }); // Offset del mouse rispetto all'angolo superiore sinistro dell'elemento
  const [isSelection, setIsSelection] = useState(false)
  const [selectionStart, setSelectionStart] = useState({ x: 0, y: 0 });
  const [selectionEnd, setSelectionEnd] = useState({ x: 0, y: 0 });

  //stati per undo/redo
  const [history, setHistory] = useState([]);
  const [historyPointer, setHistoryPointer] = useState(-1);

  //stati zoom e pan
  const [isAbleToPan, setisAbletoPan] = useState(false);
  const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0, scale: 1 });
  const latestZoom = useRef(zoomPosition);

  //const ZoomContext = useTransformContext();

  // Aggiorna il ref  dello zoom ogni volta che 'zoom' cambia.
  // Questo useEffect si esegue solo quando 'zoom' cambia.
  /*useEffect(() => {
    latestZoom.current = zoomPosition;
    console.log(latestZoom.current);
  }, [zoomPosition]);*/

  //controlli zoom e pan
  const HandleZoomIn = useCallback(() => {
    const { zoomIn } = useControls(); 
    const ZoomContext = useTransformContext();
    //console.log(ZoomContext.transformState)
    

    const handleZoomInClick = () =>{
      setTool('pan'); 
      zoomIn(); 
      setisAbletoPan(true);
      //setZoomPosition({x: ZoomContext.transformState.positionX, y: ZoomContext.transformState.positionY, scale: ZoomContext.transformState.scale});
      latestZoom.current = {x: ZoomContext.transformState.positionX, y: ZoomContext.transformState.positionY, scale: ZoomContext.transformState.scale}
      console.log(ZoomContext.transformState)
      //console.log(latestZoom.current)
      
    }

    return(
      <Button variant="light" size='sm' onPress={()=>handleZoomInClick()}><CiZoomIn size = {20}/></Button>
    );
  }, [setTool]);

    const HandleZoomOut = useCallback(() => {
    const { zoomOut } = useControls();   
    const ZoomContext = useTransformContext();

    const handleZoomOutClick = () =>{
      setTool('pan'); 
      zoomOut(); 
      setisAbletoPan(true);
      //setZoomPosition({x: ZoomContext.transformState.positionX, y: ZoomContext.transformState.positionY, scale: ZoomContext.transformState.scale});
      latestZoom.current = {x: ZoomContext.transformState.positionX, y: ZoomContext.transformState.positionY, scale: ZoomContext.transformState.scale}
      console.log(ZoomContext.transformState)
      //console.log(latestZoom.current)
      
    }

    return(
      <Button variant="light" size='sm' onPress={()=>handleZoomOutClick()}><CiZoomOut size = {20}/> </Button>
    );
  },[setTool]);


  // Inizializzazione del Canvas e del Contesto
  useEffect(() => {
    if (canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        contextRef.current = ctx;
        ctx.strokeStyle = penColor;
        ctx.lineWidth = penSize;
        ctx.lineCap = 'round';
        ctx.fillStyle = 'white'; // Sfondo bianco predefinito
        ctx.fillRect(0, 0, canvas.width, canvas.height); // Riempie il canvas di bianco
        setCtx(ctx);

        
      // Salva lo stato iniziale del canvas nella cronologia
      // Questo viene fatto solo una volta all'avvio del componente
      const initialCanvasData = canvas.toDataURL();
      setHistory([initialCanvasData]);
      setHistoryPointer(0);
      }
    }
  }, [penColor, penSize]);

  const handlePenClick = () => {
    if (tool == 'pen'){
    setTool('pan');
    setisAbletoPan(true);      
    } else {
    setTool('pen');
    setisAbletoPan(false);
    }
  }
  const handleEraserClick = () => {
    if (tool == 'eraser'){
    setTool('pan');
    setisAbletoPan(true);      
    } else {
    setTool('eraser');
    setisAbletoPan(false);
    }
  }
  const handleCropClick = () => {
    if (tool == 'crop'){
    setTool('pan');
    setisAbletoPan(true);      
    } else {
    setTool('crop');
    setisAbletoPan(false);
    }
  }

  // Funzione per ridisegnare tutti gli elementi sul canvas
  const redrawAllElements = useCallback(() => {
    if (canvasRef.current && contextRef.current) {
      const canvas = canvasRef.current;
      const ctx = contextRef.current;     
    }
  }, [copiedElement]);



   // Effetto per ridisegnare il canvas ogni volta che gli elementi disegnati cambiano
  /*useEffect(() => {
    redrawAllElements();

  }, [copiedElement, redrawAllElements]);*/

  // Funzioni di Disegno (Penna/Gomma)
  const startDrawing = useCallback(
    (e) => {
      if (tool === 'crop') return; // Non disegnare se lo strumento è "crop"
      setIsDrawing(true);
      const canvas = canvasRef.current;
      const ctx = contextRef.current;
      if (!canvas || !ctx) return;

      const zoom = latestZoom.current;

      //console.log(zoom);
      let clientX = e.clientX;
      let clientY = e.clientY;

      // Gestisce sia eventi mouse che touch
      /*if (e instanceof MouseEvent) {
        clientX = e.clientX;
        clientY = e.clientY;
      } else {
        clientX = e.touches[0].clientX;
        clientY = e.touches[0].clientY;
      }*/

      const rect = canvas.getBoundingClientRect();
      let x = clientX - rect.lef;
      let y = clientY - rect.top;
      x = (x-zoom.x)/zoom.scale;
      y = (y-zoom.y)/zoom.scale;

      ctx.beginPath(); // Inizia un nuovo percorso di disegno
      ctx.moveTo(x, y); // Sposta il punto di inizio del percorso
      e.preventDefault(); // Previene lo scrolling su mobile
    },
    [tool]
  );

  const draw = useCallback(
    (e) => {
      if (!isDrawing || tool === 'crop' || tool ==='drag') return; // Disegna solo se isDrawing è true e lo strumento non è "crop"
      const canvas = canvasRef.current;
      const ctx = contextRef.current;
      if (!canvas || !ctx) return;

      let clientX = e.clientX;
      let clientY = e.clientY;

      const rect = canvas.getBoundingClientRect();
      let x = clientX - rect.left;
      let y = clientY - rect.top;

      const zoom = latestZoom.current;

      x = (x-zoom.x)/zoom.scale;
      y = (y-zoom.y)/zoom.scale;

      if (tool === 'pen') {
        ctx.strokeStyle = penColor; // Imposta il colore della penna
        ctx.lineWidth = penSize; // Imposta la dimensione della penna
        ctx.lineTo(x, y); // Disegna una linea fino alla posizione corrente del mouse/touch
        ctx.stroke(); // Rende visibile il percorso
        //path.lineTo(x, y)
      } else if (tool === 'eraser') {
        ctx.strokeStyle = 'white'; // Colore della gomma (lo stesso dello sfondo)
        ctx.lineWidth = 20; // Dimensione della gomma
        ctx.lineTo(x, y);
        ctx.stroke();
      }
      e.preventDefault(); // Previene lo scrolling su mobile
    },
    [isDrawing, tool, penColor, penSize]
  );

  // Gestione del Dragging degli Elementi Ritagliati
  const handleElementMouseDown = useCallback((e) => {
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();

    let clientX = e.clientX;
    let clientY = e.clientY;

    const zoom = latestZoom.current;

    let mouseX = clientX - rect.left;
    let mouseY = clientY - rect.top;

    mouseX = (mouseX-zoom.x)/zoom.scale;
    mouseY = (mouseY-zoom.y)/zoom.scale;

    //controlla se il click è all'interno nel retttangolo di selezione

    if (
          mouseX >= selectionStart.x &&
          mouseX <= selectionEnd.x &&
          mouseY >= selectionStart.y &&
          mouseY <= selectionEnd.y 
        ){
          console.log('click in rettangolo di selezione');
        }

        setIsDragging(true);

  }, [copiedElement/*drawnElements*/]);

  const handleElementMouseMove = useCallback((e) => {
    if (isDragging /*&& draggedElementIndex !== null*/) {

      const canvas = canvasRef.current;
      if (!canvas) return;  
      const rect = canvas.getBoundingClientRect();

      let clientX = e.clientX;
      let clientY = e.clientY;

      let mouseX = clientX - rect.left;
      let mouseY = clientY - rect.top;

      const zoom = latestZoom.current;

      mouseX = (mouseX-zoom.x)/zoom.scale;
      mouseY = (mouseY-zoom.y)/zoom.scale;

      const newX = mouseX - dragOffset.x;
      const newY = mouseY - dragOffset.y;

      const width = selectionEnd.x - selectionStart.x;
      const height = selectionEnd.y - selectionStart.y;

      setCopiedElement({
        
          type: 'image',
          data: copiedElement.data,
          x: newX,
          y: newY,
          width: width,
          height: height,
      }
      );

      //aggiorna la posizione del rettangolo di selezione
      setSelectionStart({x: newX, y: newY});
      setSelectionEnd({x: newX + width, y: newY + height});

      e.preventDefault(); // Previene il comportamento di selezione del browser
    }
  }, [isDragging, dragOffset]);

  const handleElementMouseUp = useCallback((e) => {
    setIsDragging(false);
    setIsSelection(false)
    //setTool('pen')

    //disegnamo il contenuto del canvas di selezione sul canvas principale
    const mainCanvas = canvasRef.current;
		const mainctx = mainCanvas.getContext('2d');

    const selectioncontext = selectionCanvasRef.current.getContext('2d');
    const width = Math.abs(selectionStart.x - selectionEnd.x);
    const height = Math.abs(selectionStart.y - selectionEnd.y);

    selectioncontext.strokeStyle = 'white'; 
    selectioncontext.lineWidth = 4;
    selectioncontext.setLineDash([]);
    selectioncontext.strokeRect(selectionStart.x, selectionStart.y, width, height)

		let selectionCanvas = selectionCanvasRef.current;
		mainctx.drawImage(selectionCanvas, 0, 0);

    saveCanvasState();

  }, [selectionStart, selectionEnd]);

  // Gestione unificata degli eventi del mouse/touch sul contenitore del canvas
  const handleGlobalMouseDown =(e) => {
    if (tool === 'crop') {
      setIsCropping(true);
      const canvas = canvasRef.current;
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();

      let clientX = e.clientX;
      let clientY = e.clientY;

      let mouseX = clientX - rect.left;
      let mouseY = clientY - rect.top;

      const zoom = latestZoom.current;

      mouseX = (mouseX-zoom.x)/zoom.scale;
      mouseY = (mouseY-zoom.y)/zoom.scale;

      setCropStart({ x: mouseX, y: mouseY });
    } else if (tool === 'pen' || tool === 'eraser') {
      startDrawing(e);
    } else { // Se lo strumento non è 'crop', 'pen' o 'eraser' è 'drag'  prova a trascinare
      handleElementMouseDown(e);
    }
  };

  const handleGlobalMouseMove = (e) => {
    if (tool === 'crop' && isCropping) {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      let clientX = e.clientX;
      let clientY = e.clientY;

      let mouseX = clientX - rect.left;
      let mouseY = clientY - rect.top;

      const zoom = latestZoom.current;

      mouseX = (mouseX-zoom.x)/zoom.scale;
      mouseY = (mouseY-zoom.y)/zoom.scale;


      setCropEnd({ x: mouseX, y: mouseY});
    } else if (isDrawing) {
      draw(e);
    } else if (isDragging && tool != 'pan') {
      handleElementMouseMove(e);
    }
  };

  const handleGlobalMousLeave = (e) =>{
    if (tool != 'crop'){
      handleGlobalMouseUp(e);
    }
    else{ //quando siamo in ritaglio e il mouse esce

    }
  }

  const handleGlobalMouseUp = (e) => {
    if (tool === 'crop') {
      setCopiedElement(null);
      setIsCropping(false);
      setIsSelection(true);
      setSelectionStart(cropStart);
      setSelectionEnd(cropEnd);
      performCrop();
    } else if (isDrawing) {
      stopDrawing();
    } else if (isDragging) {
      handleElementMouseUp(e);
    }
  };

  // Gestione del Ritaglio Effettivo
  const performCrop = () => {
    if (canvasRef.current) {
      const mainCanvas = canvasRef.current;
      const ctx = mainCanvas.getContext('2d');
      if (!ctx) return;

        // Resetta lo stato di ritaglio
        setCropStart({ x: 0, y: 0 });
        setCropEnd({ x: 0, y: 0 });

    }
  };

  // Effetto per disegnare il rettangolo di selezione sul canvas di selezione, si esegue mentre si seleziona
  useEffect(() => {
    if (selectionCanvasRef.current && isCropping) {
      const selectionCanvas = selectionCanvasRef.current;
      const ctx = selectionCanvas.getContext('2d');
      if (!ctx) return;
      ctx.clearRect(0, 0, selectionCanvas.width, selectionCanvas.height); // Pulisci il canvas di selezione precedente

      const x = Math.min(cropStart.x, cropEnd.x);
      const y = Math.min(cropStart.y, cropEnd.y);
      const width = Math.abs(cropStart.x - cropEnd.x);
      const height = Math.abs(cropStart.y - cropEnd.y);

      ctx.strokeStyle = 'rgba(0, 128, 255, 0.8)'; // Blu traslucido
      ctx.lineWidth = 2;
      ctx.setLineDash([5, 5]); // Linea tratteggiata
      ctx.strokeRect(x, y, width, height);
    } 
    else if (selectionCanvasRef.current && !isSelection) {
      // Pulisci il canvas di selezione quando la modalità di ritaglio è disattivata
      const ctx = selectionCanvasRef.current.getContext('2d');
      if (ctx) {
        ctx.clearRect(0, 0, selectionCanvasRef.current.width, selectionCanvasRef.current.height);
      }
    } 
    else if (selectionCanvasRef.current && isSelection){ //siamo in selezione o in dragging
      const selectionCanvas = selectionCanvasRef.current;
      const ctx = selectionCanvas.getContext('2d');
      if (!ctx) return;
      ctx.clearRect(0, 0, selectionCanvas.width, selectionCanvas.height); // Pulisci il canvas di selezione precedente

      const x = Math.min(selectionStart.x, selectionEnd.x);
      const y = Math.min(selectionStart.y, selectionEnd.y);
      const width = Math.abs(selectionStart.x - selectionEnd.x);
      const height = Math.abs(selectionStart.y - selectionEnd.y);

      ctx.strokeStyle = 'red'; 
      ctx.lineWidth = 2;
      ctx.setLineDash([5, 5]); // Linea tratteggiata
      ctx.strokeRect(x, y, width, height);
      
      //disegna l'elemento copiato sul canvas di selezione
      if (copiedElement && copiedElement.type === 'image') {
        const img = new Image();
        img.onload = () => {
          ctx.drawImage(img, x, y, width, height);
      };
        img.src = copiedElement.data;
        //aggiorna elemento copiato
        /*setCopiedElement({
            type: 'image',
            data: copiedElement.data,
            x: x,
            y: y,
            width: width,
            height: height,
        }
      );*/
    }
    }
  }, [cropStart, cropEnd, isCropping, isSelection, selectionStart, selectionEnd,]);

  const deleteSelectedElement = () =>{

    if(isDragging){

    }
    else{
      const Canvas = canvasRef.current;
      const ctx = Canvas.getContext('2d');
      if (!ctx) return;

      //cancelliamo la zona selezionata
      const x = Math.min(selectionStart.x, selectionEnd.x);
      const y = Math.min(selectionStart.y, selectionEnd.y);
      const width = Math.abs(selectionStart.x - selectionEnd.x);
      const height = Math.abs(selectionStart.y - selectionEnd.y);
      ctx.clearRect(x, y, width, height);

      setIsSelection(false);
    }
    saveCanvasState();
  }

  const copyCroppedElement = (type) =>{
    const mainCanvas = canvasRef.current;
    const ctx = mainCanvas.getContext('2d');
    if (!ctx) return;

    const x = Math.min(selectionStart.x, selectionEnd.x);
    const y = Math.min(selectionStart.y, selectionEnd.y);
    const width = Math.abs(selectionStart.x - selectionEnd.x);
    const height = Math.abs(selectionStart.y - selectionEnd.y);
     
    // Crea un nuovo canvas per l'immagine ritagliata
    const croppedCanvas = document.createElement('canvas');
    croppedCanvas.width = width;
    croppedCanvas.height = height;
    const croppedCtx = croppedCanvas.getContext('2d');
    if (croppedCtx) {

      // Disegna la porzione selezionata dal canvas principale sul nuovo canvas
      croppedCtx.drawImage(mainCanvas, x, y, width, height, 0, 0, width, height);
      const croppedImageData = croppedCanvas.toDataURL('image/png');

      let newX;
      let newY;

      if (type ==='static'){
        newX = x;
        newY = y;
        //cancelliamo l'immagine di sotto
        ctx.clearRect(x,y,width, height);
      }
      else{
        // l'immagine copiata appare nell'angolo
        newX = 0;
        newY = 0;        
      }
      // imposta l'immagine ritagliata come elemento attualmente copiato,
      console.log('aggiorna immagine selezionata')
      setCopiedElement(
        {
          type: 'image',
          data: croppedImageData,
          x: newX, 
          y: newY,
          width: width,
          height: height,
        })

        setSelectionStart({x:newX ,y: newY})
        setSelectionEnd({x:newX + width ,y: newY + height})
        setIsCropping(false);
        setTool('drag')
    }
  }

  //GESTIONE UNDO/REDO

  // Funzione per salvare lo stato corrente del canvas nella cronologia
  const saveCanvasState = useCallback(() => {
    if (!ctx || !canvasRef.current) return;
    console.log('saving at index: ' + historyPointer);

    const currentCanvasData = canvasRef.current.toDataURL();

    setHistory(prevHistory => {
      // Se il puntatore non è alla fine della cronologia,
      // significa che abbiamo annullato delle azioni.
      // Quando si disegna una nuova azione, le azioni "future" vengono eliminate.
      const newHistory = prevHistory.slice(0, historyPointer + 1);
      return [...newHistory, currentCanvasData];
    });
    setHistoryPointer(prevPointer => prevPointer + 1);
  }, [ctx, historyPointer]); // Dipende da ctx e historyPointer per avere i valori più recenti

    const stopDrawing = useCallback(() => {
    if (tool === 'crop') return; // Non fermare il disegno se lo strumento è "crop"
    setIsDrawing(false);
    const ctx = contextRef.current;
    if (ctx) {
      ctx.closePath(); // Chiude il percorso di disegno
    }
     saveCanvasState();
  }, [tool, ctx, saveCanvasState]);

    // Funzione per ripristinare uno stato del canvas da un dataURL
  const restoreCanvasFromDataURL = useCallback((dataURL) => {
    if (!ctx || !canvasRef.current) return;
  
    const img = new Image();
    img.src = dataURL;
    img.onload = () => {
      // Pulisci il canvas prima di disegnare la nuova immagine
      ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
      ctx.drawImage(img, 0, 0);
    };
  }, [ctx]);

  // Funzione per annullare l'ultima azione
  const undo = useCallback(() => {
    if (historyPointer > 0) {
      const newPointer = historyPointer - 1;
      setHistoryPointer(newPointer);
      restoreCanvasFromDataURL(history[newPointer]);
    } else {
      console.log("Non ci sono più azioni da annullare.");
    }
  }, [history, historyPointer, restoreCanvasFromDataURL]);

  // Funzione per ripristinare l'azione annullata
  const redo = useCallback(() => {
    if (historyPointer < history.length - 1) {
      const newPointer = historyPointer + 1;
      setHistoryPointer(newPointer);
      restoreCanvasFromDataURL(history[newPointer]);
    } else {
      console.log("Non ci sono più azioni da ripristinare.");
    }
  }, [history, historyPointer, restoreCanvasFromDataURL]);

   useImperativeHandle(ref, () => {
    return {
      // ... your methods ...
      exportImgDataURL: () =>{

        return canvasRef.current.toDataURL();
      },

      loadImg: (dataURL) =>{
        const context = canvasRef.current.getContext('2d');
        const img = new Image();
        if (dataURL){ 
          img.src = dataURL;
          img.onload = () => {
            // Pulisci il canvas prima di disegnare la nuova immagine
            context.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
            context.drawImage(img, 0, 0, w, h); //disegna l'immagine scalata alle dimensioni w e h del canvas
          }
        }
        else {// Pulisci solo il canvas 
          console.log('nessuno sketch presente');
          context.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
          }
      }, 

    };
  }, []);

      //bounding boxes method

      const drawBB = () =>{

        const scalefactors = [{scale: 3.4, offset: 560}, {scale: 1.2, offset: 24}, {scale: 2.1, offset: 458}, {scale: 1.84, offset: 345}, {scale: 1.12, offset: 50},]

        // Ottieni il riferimento all'elemento canvas
        if(BBCanvasRef.current){
         const BBctx = BBCanvasRef.current.getContext('2d'); // Ottieni il contesto di disegno 2D
        
         BBctx.clearRect(0,0,w,h);
         //console.log(`src/assets/sample_${page}.json`)
       
          fetch(`src/assets/sample_${page}.json`)
          .then(response => {
            if (!response.ok) {
              throw new Error(`HTTP error! Status: ${response.status}`);
                }
            return response.json();
          })
          .then(data => {
           let jsonData = data;

            // Trova le dimensioni massime per impostare la grandezza del canvas
           let maxWidth = 0;
            let maxHeight = 0;

            jsonData.forEach(item => {
                const { x, y, width, height } = item.shape_attributes;
                maxWidth = Math.max(maxWidth, x + width);
               maxHeight = Math.max(maxHeight, y + height);
            });

            // Imposta le dimensioni del canvas
            // Aggiungiamo un piccolo margine per sicurezza
            BBCanvasRef.current.width = maxWidth + 20;
            BBCanvasRef.current.height = maxHeight + 20;            

            // Funzione per disegnare un rettangolo
            function drawRect(x, y, width, height, type) {
                BBctx.beginPath(); // Inizia un nuovo percorso
                BBctx.rect(x, y, width, height); // Disegna il rettangolo

                // Assegna colori diversi in base al tipo di elemento per una migliore visualizzazione
                switch (type) {
                    case 'header':
                        BBctx.strokeStyle = 'blue';
                        BBctx.lineWidth = 2;
                        break;
                    case 'label':
                        BBctx.strokeStyle = 'green';
                        BBctx.lineWidth = 1;
                        break;
                    case 'navbar':
                        BBctx.strokeStyle = 'purple';
                        BBctx.lineWidth = 2;
                        break;
                    case 'button':
                        BBctx.strokeStyle = 'orange';
                        BBctx.lineWidth = 1;
                        break;
                    case 'text':
                        BBctx.strokeStyle = 'brown';
                        BBctx.lineWidth = 1;
                        break;
                    case 'slider':
                        BBctx.strokeStyle = 'red';
                        BBctx.lineWidth = 1;
                        break;
                    case 'checkbox_switch':
                        BBctx.strokeStyle = 'darkgreen';
                        BBctx.lineWidth = 2;
                        break;
                    case 'checkbox_label':
                        BBctx.strokeStyle = 'lightgreen';
                        BBctx.lineWidth = 1;
                        break;
                    default:
                        BBctx.strokeStyle = 'black'; // Colore predefinito
                        BBctx.lineWidth = 1;
                }

               BBctx.stroke(); // Disegna il contorno del rettangolo

               // (Opzionale) Aggiungi un'etichetta per il tipo di elemento
               BBctx.fillStyle = 'black';
               BBctx.font = '10px Arial';
               BBctx.fillText(type, x + 5, y + 15);
            }
            
            const scale = scalefactors[page-1].scale;
            const offset = scalefactors[page-1].offset;

            // Itera sui dati JSON e disegna ogni figura
            jsonData.forEach(item => {
               const { x, y, width, height, name } = item.shape_attributes;
                const type = item.region_attributes.type;

                // Al momento, il tuo JSON contiene solo 'rect' come nome della forma.
                // Se in futuro avessi altre forme (es. 'circle', 'polygon'),
                // potresti aggiungere un blocco switch o if/else qui.
               if (name === 'rect') {
                    drawRect(x/scale+offset, y/scale, width/scale, height/scale, type);
                }
                // else if (name === 'circle') { ... }
           });
           
         })  
         .catch(error => console.error('Failed to fetch data:', error));         
    }
  }

 useEffect(() => {
  drawBB();
 },[visibleBoundingBoxes])


  /*useImperativeHandle(ref, () => ({
    exportImgDataURL: () =>{
      console.log('ok1');
    return currentCanvasData = canvasRef.current.toDataURL();
  } ,
  }));

  useImperativeHandle(ref, () => ({
    loadImg: (dataURL) =>{
      console.log('ok2')
    const img = new Image();
    img.src = dataURL;
    img.onload = () => {
      // Pulisci il canvas prima di disegnare la nuova immagine
      ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
      ctx.drawImage(img, 0, 0);
    }
  },
  }));*/    


   //prova controlli zoom e pan
  const DraggableBarWrapper = () => {

    const [Zstate, setZstate] = useState();

    useTransformEffect(({ state, instance }) => {

      //console.log(state);
      setZstate(state);
      console.log('stato aggiornato')

      })

      //controlli zoom e pan
    const HandleZoomIn2 = () => {
      console.log(Zstate)
      const { zoomIn } = useControls(); 
      const ZoomContext = useTransformContext();
      //console.log(ZoomContext.transformState)
    

      const handleZoomInClick = () =>{
        setTool('pan'); 
        zoomIn(); 
        setisAbletoPan(true);  
        console.log(Zstate);
      }

      return(
        <Button variant="light" size='sm' onPress={()=>handleZoomInClick()}><CiZoomIn size = {20}/></Button>
      );
    };

    const HandleZoomOut2 = () => {
      const { zoomOut } = useControls();   
      const ZoomContext = useTransformContext();

      const handleZoomOutClick = () =>{
        setTool('pan'); 
        zoomOut(); 
        setisAbletoPan(true);   
        console.log(Zstate); 
        }

      return(
        <Button variant="light" size='sm' onPress={()=>handleZoomOutClick()}><CiZoomOut size = {20}/> </Button>
      );
    };

    

    return(
      <DraggableBar  penClick = {handlePenClick} eraserClick = {handleEraserClick} cropClick = {handleCropClick} 
            undoClick = {undo} redoClick = {redo} tool = {tool} setTool = {setTool} isSelection = {isSelection}
            canvasOnTheLeft = {canvasOnTheLeft} initial_x = {10} initial_y = {10} 
            copyCroppedElement = {copyCroppedElement} deleteSelectedElement = {deleteSelectedElement}
            handleZoomIn = {<HandleZoomIn2 />} handleZoomOut = {<HandleZoomOut2 />}/>
    )

  } 

  const WrapperForCanvasZoom = () =>{
    
  }


  return (
    
    <div className={` flex flex-col bg-gray-100 w-[${percentWidth}%] `} >
      <TransformWrapper disabled = {!isAbleToPan}>
        <div className={' absolute ' }>
          {/*<DraggableBar  penClick = {handlePenClick} eraserClick = {handleEraserClick} cropClick = {handleCropClick} 
            undoClick = {undo} redoClick = {redo} tool = {tool} setTool = {setTool} isSelection = {isSelection}
            canvasOnTheLeft = {canvasOnTheLeft} initial_x = {10} initial_y = {10} 
            copyCroppedElement = {copyCroppedElement} deleteSelectedElement = {deleteSelectedElement}
            handleZoomIn = {<HandleZoomIn />} handleZoomOut = {<HandleZoomOut />}/>*/}
            <DraggableBarWrapper/>
       </div>
      
    <TransformComponent>
      {/*Immagine in background */}
      {isImageBackgrounds && 
      <div className="w-[1500px] h-[600px] absolute" 
          style={{backgroundImage: `url("/src/assets/sample_${page}.png")`, backgroundSize: 'contain', backgroundRepeat: 'no-repeat', backgroundPosition: 'center',  opacity: 1}}>          
      </div>}

      {/* Contenitore per i canvas */}
      <div className='w-full h-full '
        style={{ position: 'relative', opacity: transparency }}
        onMouseDown={handleGlobalMouseDown}
        onMouseMove={handleGlobalMouseMove}
        onMouseUp={handleGlobalMouseUp}
        onTouchStart={handleGlobalMouseDown}
        onTouchMove={handleGlobalMouseMove}
        onTouchEnd={handleGlobalMouseUp}
        onMouseLeave={handleGlobalMousLeave} // Importante per resettare lo stato quando il mouse esce dal canvas
        onTouchCancel={handleGlobalMouseUp}
      >
        {/* Canvas principale per il disegno */}
        <canvas
          ref={canvasRef}
         width={w}
         height={h}
          className="border border-gray-300 rounded-md shadow-md bg-white"
          style={{
            cursor:
              tool === 'pen' || tool === 'eraser'
                ? 'crosshair' // Cursore a croce per penna/gomma
                : tool === 'crop'
                ? 'crosshair' // Cursore a croce per ritaglio
                : 'default', // Cursore predefinito
          }}
        />
        {/* Canvas sovrapposto per la selezione del ritaglio */}
        <canvas
          ref={selectionCanvasRef}
          width={w}
          height={h}
          className="border-2 border-gray-700 rounded-md shadow-md"
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            pointerEvents: 'none', // Impedisce a questo canvas di interferire con gli eventi del canvas principale
          }}
        />

        {/* Canvas sovrapposto per le Bounding Boxes */}
        {visibleBoundingBoxes && <canvas
          ref={BBCanvasRef}
          width={w}
          height={h}
          className="border-2 border-gray-700 rounded-md shadow-md"
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            pointerEvents: 'none', // Impedisce a questo canvas di interferire con gli eventi del canvas principale
          }}
        />}
      </div>

      {/* Opzionale: Visualizza l'immagine ritagliata */}
      {/*<AnimatePresence>
        {croppedImage && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="mt-4 p-4 bg-white rounded-md shadow-md border border-gray-200"
          >
            <h2 className="text-lg font-semibold mb-2 text-gray-700">
              Immagine Ritagliata:
            </h2>
            <img
              src={croppedImage}
              alt="Immagine Ritagliata"
              className="max-w-xs rounded-md"
            />
          </motion.div>
        )}
      </AnimatePresence>*/}
       </TransformComponent>
    </TransformWrapper>
    </div>
   
  );
});

export default SketchCavas;
