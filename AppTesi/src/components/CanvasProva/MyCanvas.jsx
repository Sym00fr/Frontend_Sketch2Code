import { useState, useRef, useEffect, useCallback } from 'react';
import { Button } from '@heroui/react';
import { Input } from '@heroui/react';
//import {Image} from 'lucide-react';

import { FaPen, FaEraser, FaCheck  } from "react-icons/fa";
import { IoMdUndo, IoMdRedo, IoMdClose  } from "react-icons/io";
import { MdCropFree } from "react-icons/md";

//import { Input } from '@/components/ui/input';
import { motion, AnimatePresence } from 'framer-motion';

/*interface DrawingHistory {
  imageData: string | null;
  tool: 'pen' | 'eraser' | 'crop';
}*/

const ReactBoard = () => {
  const canvasRef = useRef(null);
  const selectionCanvasRef = useRef(null);
  const contextRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [tool, setTool] = useState('pen');
  const [penColor, setPenColor] = useState('black');
  const [penSize, setPenSize] = useState(5);
  const [history, setHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [isCropping, setIsCropping] = useState(false);
  const [cropStart, setCropStart] = useState({ x: 0, y: 0 });
  const [cropEnd, setCropEnd] = useState({ x: 0, y: 0 });
  const [croppedImage, setCroppedImage] = useState(null);
  const [backgroundImage, setBackgroundImage] = useState(null);
  const [backgroundOpacity, setBackgroundOpacity] = useState(0.5); // Opacità predefinita
  const [isDragging, setIsDragging] = useState(false);
  const [draggedElementIndex, setDraggedElementIndex] = useState(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [drawnElements, setDrawnElements] = useState([]);

  // Inizializzazione del Canvas e del Context
  useEffect(() => {
    if (canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        contextRef.current = ctx;
        ctx.strokeStyle = penColor;
        ctx.lineWidth = penSize;
        ctx.lineCap = 'round';
        ctx.fillStyle = 'white'; // Sfondo bianco di default
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        saveHistory('initial'); // Salva lo stato iniziale
      }
    }
  }, [penColor, penSize]);

  function Sleep (millisecondi) {return new Promise(resolve => setTimeout(resolve, millisecondi)); }

  // Funzione per caricare l'immagine di sfondo
  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setBackgroundImage(event.target.result); //setBackgroundImage(event.target.result as string); 
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Ridisegna il canvas, includendo lo sfondo
  const redrawCanvas = useCallback(
    (elementsToDraw) => {
      if (canvasRef.current && contextRef.current) {
        const canvas = canvasRef.current;
        const ctx = contextRef.current;
        ctx.clearRect(0, 0, canvas.width, canvas.height); // Pulisci il canvas

        // Disegna prima l'immagine di sfondo, se presente
        if (backgroundImage) {
          const img = new Image();
          img.onload = () => {
            ctx.globalAlpha = backgroundOpacity; // Imposta l'opacità
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
            ctx.globalAlpha = 1; // Ripristina l'opacità a 1 per il disegno normale
            // Disegna gli elementi
            const elements = elementsToDraw? elementsToDraw : drawnElements;
            elements.forEach((element) => {
              if (element.type === 'image') {
                const elImg = new Image();
                elImg.onload = () => {
                  ctx.drawImage(elImg, element.x, element.y);
                };
                elImg.src = element.data;
              } else {
                // Gestisci altri tipi di elementi disegnati (linee, cerchi, ecc.) se presenti
              }
            });
          };
          img.src = backgroundImage;
        } else {
          // Se non c'è immagine di sfondo, disegna solo gli elementi
          const elements = elementsToDraw? elementsToDraw : drawnElements;
          elements.forEach((element) => {
            if (element.type === 'image') {
              const img = new Image();
              img.onload = () => {
                ctx.drawImage(img, element.x, element.y);
              };
              img.src = element.data;
            } else {
              // Gestisci altri tipi di elementi disegnati
            }
          });
        }
      }
    },
    [backgroundImage, backgroundOpacity, drawnElements]
  );

  // Chiamare redrawCanvas quando cambiano gli elementi disegnati
  useEffect(() => {
    redrawCanvas();
  }, [redrawCanvas]);

  // Funzioni di Disegno
  const startDrawing = useCallback(
    (e) => {
      
      if (tool === 'crop') return;
      setIsDrawing(true);
      const canvas = canvasRef.current;
      const ctx = contextRef.current;
      if (!canvas || !ctx) return;

      let clientX = e.clientX;
      let clientY = e.clientY;

      const rect = canvas.getBoundingClientRect();
      const x = clientX - rect.left;
      const y = clientY - rect.top;

      ctx.beginPath();  //inizia a disegnare nel path 
      ctx.moveTo(x, y); 
      e.preventDefault();
    },
    [tool]
  );

  const draw = useCallback(
    (e) => {
      if (!isDrawing || tool === 'crop') return;
      const canvas = canvasRef.current;
      const ctx = contextRef.current;
      if (!canvas || !ctx) return;

      let clientX = e.clientX;
      let clientY = e.clientY;

      const rect = canvas.getBoundingClientRect();
      const x = clientX - rect.left;
      const y = clientY - rect.top;

      if (tool === 'pen') {
        ctx.strokeStyle = penColor;
        ctx.lineWidth = penSize;
        ctx.lineTo(x, y);   //nel path iniziato, collega l'ultimo punto con x,y
        ctx.stroke();       //disegna efettivamente la linea
      } else if (tool === 'eraser') {
        ctx.strokeStyle = 'white'; // Cancella disegnando con il colore di sfondo
        ctx.lineWidth = 20; // Dimensione della gomma
        ctx.lineTo(x, y);
        ctx.stroke();
      }
      e.preventDefault();
    },
    [isDrawing, tool, penColor, penSize]
  );

  const stopDrawing = useCallback(() => {
    if (tool === 'crop') return;
    setIsDrawing(false);
    const ctx = contextRef.current;
    if (ctx) {
      ctx.closePath();
      saveHistory('drawing');
    }
  }, [tool]);

  // Gestione della Cronologia (Undo/Redo)   //non so perchè cancella il disegno
  const saveHistory = (operation) => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    let newHistory;
    
    if (operation === 'crop' && croppedImage) {                        
      newHistory = { imageData: croppedImage, tool: 'crop' };          
    } else {                                                            
      newHistory = { imageData: canvas.toDataURL(), tool: tool };      
    }
    
    /*setHistory((prevHistory) =>                    //cancella il disegno
      prevHistory.slice(0, historyIndex + 1)
    ); // Tronca la cronologia */
    
    setHistory((prevHistory) => [...prevHistory, newHistory]);
    setHistoryIndex((prevIndex) => prevIndex + 1);
  };

  const undo = () => {
    if (historyIndex > 0) {
      setHistoryIndex((prevIndex) => prevIndex - 1);
    }
  };

  const redo = () => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex((prevIndex) => prevIndex + 1);
    }
  };

  // Ridisegna il Canvas dalla Cronologia,                             però cancella il disegno
  useEffect( () => {
    if (canvasRef.current && contextRef.current) {
      const canvas = canvasRef.current;
      const ctx = contextRef.current;
      
      ctx.clearRect(0, 0, canvas.width, canvas.height); // Pulisci il canvas
      
      // Disegna prima lo sfondo
      if (backgroundImage) {
        const img = new Image();
        img.onload = () => {
          ctx.globalAlpha = backgroundOpacity;
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          ctx.globalAlpha = 1; // Ripristina l'opacità
          // Poi disegna la storia
          if (history[historyIndex]) {
            const { imageData, tool: historyTool } = history[historyIndex];
            if (historyTool === 'crop' && imageData) {
              const historyImg = new Image();
              historyImg.onload = () => {
                ctx.drawImage(historyImg, 0, 0);
              };
              historyImg.src = imageData;
            } else if (imageData) {
              const historyImg = new Image();
              historyImg.onload = () => {
                ctx.drawImage(historyImg, 0, 0);
              };
              historyImg.src = imageData;
            }
          }
        };
        img.src = backgroundImage;
      } else {
        // Se non c'è sfondo
        if (history[historyIndex]) {
          const { imageData, tool: historyTool } = history[historyIndex];
          if (historyTool === 'crop' && imageData) {
            const historyImg = new Image();
            historyImg.onload = () => {
              ctx.drawImage(historyImg, 0, 0);
            };
            historyImg.src = imageData;
          } else if (imageData) {
            const historyImg = new Image();
            historyImg.onload = () => {
              ctx.drawImage(historyImg, 0, 0);
            };
            historyImg.src = imageData;
          }
        } else { ///cancella il disegno,                perchè???
          /*ctx.fillStyle = 'white';
          ctx.fillRect(0, 0, canvas.width, canvas.height)*/
        }
      }
    }
  }, [history, historyIndex, backgroundImage, backgroundOpacity]);

  // Gestione del Ritaglio
  const handleMouseDown = (e) => {
    if (tool === 'crop') {
      setIsCropping(true);
      const canvas = canvasRef.current;
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();

      let clientX = e.clientX;
      let clientY = e.clientY;

      setCropStart({ x: clientX - rect.left, y: clientY - rect.top });
    } else if (tool !== 'crop') {
      handleCanvasMouseDown(e); // Passa l'evento al gestore del disegno
    }
  };

  const handleMouseMove = (e) => {
    if (tool === 'crop' && isCropping) {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      let clientX = 0;
      let clientY = 0;

      if (e instanceof MouseEvent) {
        clientX = e.clientX;
        clientY = e.clientY;
      } else {
        clientX = e.touches[0].clientX;
        clientY = e.touches[0].clientY;
      }
      setCropEnd({ x: clientX - rect.left, y: clientY - rect.top });
    } else if (isDrawing) {
      draw(e); // Continua a disegnare se stiamo disegnando
    } else if (isDragging) {
      handleCanvasMouseMove(e);
    }
  };

  const handleMouseUp = (e) => {
    if (tool === 'crop') {
      setIsCropping(false);
      performCrop();
    } else {
      stopDrawing(); // Ferma il disegno
    }
    handleCanvasMouseUp(); // Chiama sempre handleCanvasMouseUp per resettare lo stato di dragging
  };

  // Gestione del Ritaglio Effettivo
  const performCrop = () => {
    if (canvasRef.current) {
      const mainCanvas = canvasRef.current;
      const ctx = mainCanvas.getContext('2d');
      if (!ctx) return;

      const x = Math.min(cropStart.x, cropEnd.x);
      const y = Math.min(cropStart.y, cropEnd.y);
      const width = Math.abs(cropStart.x - cropEnd.x);
      const height = Math.abs(cropStart.y - cropEnd.y);

      // Crea un nuovo canvas per l'immagine ritagliata
      const croppedCanvas = document.createElement('canvas');
      croppedCanvas.width = width;
      croppedCanvas.height = height;
      const croppedCtx = croppedCanvas.getContext('2d');
      if (croppedCtx) {
        croppedCtx.drawImage(mainCanvas, x, y, width, height, 0, 0, width, height);
        const croppedImageData = croppedCanvas.toDataURL('image/png');
        setCroppedImage(croppedImageData); // Imposta l'immagine ritagliata per la visualizzazione
        setDrawnElements((prevElements) => [
          ...prevElements,
          {
            type: 'image',
            data: croppedImageData,
            x: x, // Posizione iniziale
            y: y,
          },
        ]);
        saveHistory('crop');
        redrawCanvas([
          ...drawnElements,
          {
            type: 'image',
            data: croppedImageData,
            x: x, // Posizione iniziale
            y: y,
          },
        ]);
        // Resetta lo stato di ritaglio
        setCropStart({ x: 0, y: 0 });
        setCropEnd({ x: 0, y: 0 });
      }
    }
  };

  // Effetto per disegnare il rettangolo di selezione
  useEffect(() => {
    if (selectionCanvasRef.current && isCropping) {
      const selectionCanvas = selectionCanvasRef.current;
      const ctx = selectionCanvas.getContext('2d');
      if (!ctx) return;
      ctx.clearRect(0, 0, selectionCanvas.width, selectionCanvas.height); // Pulisci il canvas precedente

      const x = Math.min(cropStart.x, cropEnd.x);
      const y = Math.min(cropStart.y, cropEnd.y);
      const width = Math.abs(cropStart.x - cropEnd.x);
      const height = Math.abs(cropStart.y - cropEnd.y);

      ctx.strokeStyle = 'rgba(0, 128, 255, 0.8)'; // Blu traslucido
      ctx.lineWidth = 2;
      ctx.setLineDash([5, 5]); // Linea tratteggiata
      ctx.strokeRect(x, y, width, height);
    } else if (selectionCanvasRef.current) {
      // Pulisci il canvas di selezione quando la modalità di ritaglio è disattivata
      const selectionCanvas = selectionCanvasRef.current;
      const ctx = selectionCanvasRef.current.getContext('2d');
      if (ctx) {
        ctx.clearRect(0, 0, selectionCanvas.width, selectionCanvas.height);
      }
    }
  }, [cropStart, cropEnd, isCropping]);

  // Gestione del Dragging degli Elementi Ritagliati
  const handleCanvasMouseDown = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();

    let clientX = e.clientX;
    let clientY = e.clientY;
    

    const mouseX = clientX - rect.left;
    const mouseY = clientY - rect.top;

    // Controlla se il click è all'interno di un elemento ritagliato
    for (let i = drawnElements.length - 1; i >= 0; i--) {
      const element = drawnElements[i];
      if (element.type === 'image') {
        const img = new Image();
        img.onload = () => {
          // Esegui un controllo sulle coordinate (potrebbe essere necessario un approccio più preciso per forme complesse)
          if (
            mouseX >= element.x &&
            mouseX <= element.x + img.width &&
            mouseY >= element.y &&
            mouseY <= element.y + img.height
          ) {
            setIsDragging(true);
            setDraggedElementIndex(i);
            setDragOffset({ x: mouseX - element.x, y: mouseY - element.y });
            return; // Trovato l'elemento, esci dal loop
          }
        };
        img.src = element.data;
        // Potrebbe essere necessario un modo per ottenere le dimensioni dell'immagine senza caricarla di nuovo
        // Una soluzione potrebbe essere memorizzare larghezza e altezza nell'oggetto drawnElements
      }
    }
    startDrawing(e)
  };

  const handleCanvasMouseMove = (e) => {
    if (isDragging && draggedElementIndex !== null) {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      let clientX = e.clientX;
      let clientY = e.clientY;

      const mouseX = clientX - rect.left;
      const mouseY = clientY - rect.top;

      setDrawnElements((prevElements) =>
        prevElements.map((element, index) =>
          index === draggedElementIndex
            ? { ...element, x: mouseX - dragOffset.x, y: mouseY - dragOffset.y }
            : element
        )
      );
    }
  };

  const handleCanvasMouseUp = () => {
    setIsDragging(false);
    setDraggedElementIndex(null);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-3xl font-bold mb-4 text-gray-800">
        Lavagna Interattiva
      </h1>
      <div className="flex gap-2 mb-4 bg-gray-500">
        <Button
          variant={tool === 'pen' ? 'default' : 'outline'}
          onPress={() => setTool('pen')}
          className="flex items-center gap-2"
          title="Penna"
        >
          <FaPen className="w-4 h-4" />
          Penna
        </Button>
        <Button
          variant={tool === 'eraser' ? 'default' : 'outline'}
          onPress={() => setTool('eraser')}
          className="flex items-center gap-2"
          title="Gomma"
        >
          <FaEraser className="w-4 h-4" />
          Gomma
        </Button>
        <Button
          onPress={undo}
          disabled={historyIndex <= 0}
          className="flex items-center gap-2"
          title="Annulla"
        >
          <IoMdUndo className="w-4 h-4" />
          Annulla
        </Button>
        <Button
          onPress={redo}
          disabled={historyIndex >= history.length - 1}
          className="flex items-center gap-2"
          title="Ripristina"
        >
          <IoMdRedo className="w-4 h-4" />
          Ripristina
        </Button>
        <Button
          variant={tool === 'crop' ? 'default' : 'outline'}
          onPress={() => setTool('crop')}
          className="flex items-center gap-2"
          title="Ritaglio"
        >
          <MdCropFree className="w-4 h-4" />
          Ritaglio
        </Button>
        {tool === 'crop' && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="absolute top-16 right-4 flex gap-2" // Posiziona i pulsanti vicino al canvas
          >
            <Button
              variant="destructive"
              size="icon"
              onPress={() => {
                setIsCropping(false);
                setCropStart({ x: 0, y: 0 });
                setCropEnd({ x: 0, y: 0 });
              }}
              title="Annulla Ritaglio"
            >
              <IoMdClose className="w-4 h-4" />
            </Button>
            <Button
              variant="success"
              size="icon"
              onClick={() => {
                performCrop();
              }}
              title="Conferma Ritaglio"
            >
              <FaCheck className="w-4 h-4" />
            </Button>
          </motion.div>
        )}
      </div>
      {/* Controlli per l'immagine di sfondo */}
      <div className="flex gap-2 mb-4 items-center">
        <label htmlFor="bg-image-input" className="text-sm text-gray-700">
          Sfondo:
        </label>
        <Input
          id="bg-image-input"
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="w-48"
        />
        <label htmlFor="bg-opacity-input" className="text-sm text-gray-700">
          Opacità:
        </label>
        <Input
          id="bg-opacity-input"
          type="number"
          min="0"
          max="1"
          step="0.1"
          value={backgroundOpacity}
          onChange={(e) => setBackgroundOpacity(parseFloat(e.target.value))}
          className="w-20"
        />
      </div>
      <div
        style={{ position: 'relative' }}
        onMouseDown={(e) => handleMouseDown(e)}
        onMouseMove={(e) => handleMouseMove(e)}
        onMouseUp={(e) => handleMouseUp(e)}
        onTouchStart={(e) => handleMouseDown(e)}
        onTouchMove={(e) => handleMouseMove(e)}
        onTouchEnd={(e) => handleMouseUp(e)}
        onMouseLeave={handleMouseUp} // Importante per resettare lo stato quando il mouse esce dal canvas
        onTouchCancel={handleMouseUp}
      >
        <canvas
          ref={canvasRef}
          width={600}
          height={400}
          className="border border-gray-300 rounded-md shadow-md cursor-crosshair bg-white"
          style={{
            cursor:
              tool === 'pen' || tool === 'eraser'
                ? 'crosshair'
                : tool === 'crop'
                ? 'crosshair'
                : 'default',
          }}
        />
        <canvas
          ref={selectionCanvasRef}
          width={600}
          height={400}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            pointerEvents: 'none', // Impedisce a questo canvas di interferire con gli eventi del canvas principale
          }}
        />
      </div>

      {/* Opzionale: Visualizza l'immagine ritagliata */}
      <AnimatePresence>
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
      </AnimatePresence>
    </div>
  );
};

export default ReactBoard;

