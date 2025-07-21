import { useRef, useEffect, useState, useCallback } from 'react';

// Il componente principale dell'applicazione
const  CanvasUndoRedo = () =>{
  // Riferimento al canvas HTML
  const canvasRef = useRef(null);
  // Stato per il contesto di disegno 2D del canvas
  const [ctx, setCtx] = useState(null);
  // Stato per indicare se l'utente sta disegnando
  const [isDrawing, setIsDrawing] = useState(false);
  // Stato per la cronologia dei disegni (ogni elemento è un dataURL del canvas)
  const [history, setHistory] = useState([]);
  // Puntatore alla posizione attuale nella cronologia
  const [historyPointer, setHistoryPointer] = useState(-1);

  // useEffect per inizializzare il canvas e il contesto
  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const context = canvas.getContext('2d');
      // Impostazioni iniziali del contesto di disegno
      context.lineWidth = 2;
      context.lineCap = 'round';
      context.strokeStyle = '#000000'; // Colore nero di default
      setCtx(context);

      // Salva lo stato iniziale del canvas nella cronologia
      // Questo viene fatto solo una volta all'avvio del componente
      const initialCanvasData = canvas.toDataURL();
      setHistory([initialCanvasData]);
      setHistoryPointer(0);
    }
  }, []); // Dipendenze vuote: esegue solo una volta al mount

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

  // Gestore dell'evento mouse down (inizio del disegno)
  const startDrawing = useCallback((e) => {
    if (!ctx) return;
    setIsDrawing(true);
    ctx.beginPath();
    ctx.moveTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
  }, [ctx]);

  // Gestore dell'evento mouse move (disegno in corso)
  const draw = useCallback((e) => {
    if (!ctx || !isDrawing) return;
    ctx.lineTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
    ctx.stroke();
  }, [ctx, isDrawing]);

  // Gestore dell'evento mouse up o mouse leave (fine del disegno)
  const stopDrawing = useCallback(() => {
    if (!ctx || !isDrawing) return;
    ctx.closePath();
    setIsDrawing(false);
    saveCanvasState(); // Salva lo stato del canvas dopo aver finito di disegnare
  }, [ctx, isDrawing, saveCanvasState]);

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

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4 font-sans rounded-lg">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Canvas con Undo/Redo</h1>

      <div className="mb-4 flex space-x-4">
        <button
          onClick={undo}
          disabled={historyPointer <= 0}
          className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-75 disabled:opacity-50 disabled:cursor-not-allowed transition duration-300 ease-in-out"
        >
          Annulla
        </button>
        <button
          onClick={redo}
          disabled={historyPointer >= history.length - 1}
          className="px-6 py-3 bg-green-600 text-white font-semibold rounded-lg shadow-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-75 disabled:opacity-50 disabled:cursor-not-allowed transition duration-300 ease-in-out"
        >
          Ripristina
        </button>
      </div>

      <canvas
        ref={canvasRef}
        width={600}
        height={400}
        className="border-2 border-gray-400 bg-white rounded-lg shadow-lg cursor-crosshair w-full max-w-2xl"
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={stopDrawing}
        onMouseLeave={stopDrawing} // Ferma il disegno se il mouse esce dal canvas
      ></canvas>

      <p className="mt-4 text-gray-600 text-sm">
        Disegna sul canvas e usa i pulsanti "Annulla" e "Ripristina" per gestire la cronologia.
      </p>
    </div>
    
  );
}

export default CanvasUndoRedo;
