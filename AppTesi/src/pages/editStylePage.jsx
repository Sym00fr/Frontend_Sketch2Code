import { useState, useRef, useEffect, useCallback } from "react"

import { UpperBar } from "../components/UpperBar"
import { LowerBarEditing } from "../components/LowerBarEditing"
import SimpleCanvas from "../components/SimpleCanvas";
import { FirstEditPopUp, SendStylePopUp, LoseStyleWarning } from "../components/interfacePopUp";
import { UploadSketchesOnS3 } from "../api/api_S3";
import { triggerFinetuningForStyleCustomization } from "../api/api";

import sketchProva from '/src/assets/sample_1.png';
import { user } from "@heroui/react";

export const EditStylePage = (props) => {
  
const {signOut, email, firstUse, SetFirstUse, setMode, setUserParametersPath, userParametersPath, setIsCheckingS3, isCheckingS3} = props;

const screenWidth = window.innerWidth;
const screenHeight = window.innerHeight;

const [isSplitView, setSplitView] = useState(false)
const [positionSwitched, setPositionSwitched] = useState(false)
const [transparency, setTransparency] = useState(0.5)
const [page, setPage] = useState(1)
const [visibleBoundingBoxes, setVisibleBoundingBoxes] = useState(true);
const [isSendPopUp, setIsSendPopUp] = useState(false);
const [isLoseStylePopUp, setLoseStylePopUp] = useState(false);

//saved sketched
const [savedImages, setSavedImages] = useState([]);
const [savedImagesBLOB, setSavedImagesBLOB] = useState([]);

//stati per la barra degli strumenti
const [draggablePosition, setDraggablePosition] = useState({x: 10, y:10})

//stati per undo/redo e cronologia
const [history1, setHistory1] = useState([]);
const [historyPointer1, setHistoryPointer1] = useState(-1); //one for each page
const [history2, setHistory2] = useState([]);
const [historyPointer2, setHistoryPointer2] = useState(-1); 
const [history3, setHistory3] = useState([]);
const [historyPointer3, setHistoryPointer3] = useState(-1); 
const [history4, setHistory4] = useState([]);
const [historyPointer4, setHistoryPointer4] = useState(-1); 
const [history5, setHistory5] = useState([]);
const [historyPointer5, setHistoryPointer5] = useState(-1); 

  

  const HistoryMapper = {
    1: history1,
    2: history2,
    3: history3,
    4: history4,
    5: history5,
  }

    const SetHistoryMapper = {
    1: setHistory1 ,
    2: setHistory2 ,
    3: setHistory3 ,
    4: setHistory4 ,
    5: setHistory5 ,
  }
  

  const HistoryPointerMapper = {
    1: historyPointer1,
    2: historyPointer2, 
    3: historyPointer3,
    4: historyPointer4,
    5: historyPointer5, 
  }

  const SetHistoryPointerMapper = {
    1: setHistoryPointer1 ,
    2: setHistoryPointer2 ,
    3: setHistoryPointer3 ,
    4: setHistoryPointer4 ,
    5: setHistoryPointer5 ,
  }

  

const numPages = 5;

const editCanvasRef = useRef(null);
const BBCanvasRef = useRef(null); // Riferimento al canvas per i bounding boxes
  

  const saveCanvas = () =>{
    const currentCanvasData = editCanvasRef.current.exportImgDataURL();

    let nextSavedImages = [...savedImages];
    nextSavedImages[page] = currentCanvasData;
    setSavedImages(nextSavedImages)
  }

  const loadCanvas = () => {
   editCanvasRef.current.loadImg(savedImages[page])
  }

  const increasePage = () =>{
    //salviamo lo sketch sempre, anche se siamo a pagina 5
    saveCanvas();

    if (page < numPages ){
      setPage(page+1)
      setVisibleBoundingBoxes(false); 
    }
    else {
      console.log('last page, sending style?');
      setIsSendPopUp(true);
    }  
  }

  const decreasePage = () =>{
     if (page > 1){
      //salviamo lo sketch 
      saveCanvas();
      setPage(page -1) 
      setVisibleBoundingBoxes(false); 
 
    }
    else {console.log('first page')}  
  }

  //Bounding boxes method
    const drawBB = () =>{

      const scalefactors = [{scale: 3.2, offsetX: 185, offsetY: 0}, {scale: 2.25, offsetX: 0, offsetY: 160}, {scale: 2, offsetX: 78, offsetY: 8}, {scale: 1.93, offsetX: 0, offsetY: 35}, {scale: 2.05, offsetX: 5, offsetY: 155},]

      // Ottieni il riferimento all'elemento canvas
      if(BBCanvasRef.current){
        const BBctx = BBCanvasRef.current.getContext('2d'); // Ottieni il contesto di disegno 2D
        
        BBctx.clearRect(0,0,BBctx.width, BBctx.height);
       
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
          //BBCanvasRef.current.width = maxWidth + 20;
          //BBCanvasRef.current.height = maxHeight + 20;            

          // Funzione per disegnare un rettangolo
          function drawRect(x, y, width, height, type) {
              BBctx.beginPath(); // Inizia un nuovo percorso
              BBctx.setLineDash([5,15]);
              BBctx.rect(x, y, width, height); // Disegna il rettangolo

              // Assegna colori diversi in base al tipo di elemento per una migliore visualizzazione
              switch (type) {
                   case 'header':
                      BBctx.strokeStyle = 'blue';
                      BBctx.lineWidth = 1;
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
             /*BBctx.fillStyle = 'black';
             BBctx.font = '10px Arial';
             BBctx.fillText(type, x + 5, y + 15);*/
          }
            
          const scale = scalefactors[page-1].scale;
          const offsetX = scalefactors[page-1].offsetX;
          const offsetY = scalefactors[page-1].offsetY;

          // Itera sui dati JSON e disegna ogni figura
          jsonData.forEach(item => {
            const { x, y, width, height, name } = item.shape_attributes;
            const type = item.region_attributes.type;

              // Se in futuro avessi altre forme (es. 'circle', 'polygon'), potresti aggiungere un blocco switch o if/else qui.
              if (name === 'rect') {
                  drawRect(x/scale+offsetX, y/scale+offsetY, width/scale, height/scale, type);
              }
              // else if (name === 'circle') { ... }
          });
           
        })  
        .catch(error => console.error('Failed to fetch data:', error));         
    }
  }


  //FINETUNING
  //carica gli sketch su s3 e triggera il notebook corrispondente

  function dataURLtoBlob(dataurl) {
    var arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
    while(n--){
        u8arr[n] = bstr.charCodeAt(n);
    }
    return new Blob([u8arr], {type:mime});
}
  
  const SendNewStyle = async (styleName) => {

    console.log('nella send style');
    let i = 0;
    let res = true;
    
    for (const imageURL of savedImages){
      if(i!=0){ //la prima è vuota
        const sketchName = `sketch${i-1}`
        const path = `public/${email}/style_${styleName}/sketches/${sketchName}.png`
        //const ok = await UploadSketchesOnS3(dataURLtoBlob(imageURL), sketchName, email, styleName);
        
        const ok = await UploadSketchesOnS3(dataURLtoBlob(imageURL), path);
        if(ok){
          console.log('sketch ' + i + ' uploaded');
          i++;
        }
        else{
          res = false;
          break;
        }
      }
      else{i++}
      
    }

    if (res){
      //Una volta caricati gli sketch, triggeriamo il notebook per il finetuning.
      //Nella lambda c'è il comando per copiare gli sketch appena caricati su S3 nel 
      //notebook, che è un comando che esegue nel terminae del notebook:
      //"aws s3 cp s3://tuo-bucket-s3/percorso/del/file/nome_file.estensione /home/ec2-user/SageMaker/percorso/locale/" 
     
      //ritorna un false, oppure i dati
      const res2 = await triggerFinetuningForStyleCustomization(email, styleName);

      if(res2){
        console.log('in attesa che finisca il finetuning e i parametri vengano caricati su s3')

        setIsCheckingS3({checking: true, path: `public/${email}/style_${styleName}/params`, completed: false});

      }
      else{
        console.log('errore durante il trigger del notebook');
      }

    }
    else {
      console.log('errore nel caricamento degli sketch');
    }
    
  }


   
  useEffect(() => {
  drawBB();
 },[visibleBoundingBoxes, positionSwitched])

  useEffect(()=>{
    loadCanvas();
    if(isSplitView)
    {setTransparency(1);}
    else {setTransparency(0)}
  }, [page, isSplitView, positionSwitched])

  useEffect(()=>{
    setMode('editing'); 

    //salviamo un canvas vuoto
    const currentCanvasData = editCanvasRef.current.exportImgDataURL();
    let nextSavedImages = [...savedImages];
    nextSavedImages[0] = currentCanvasData;
    setSavedImages(nextSavedImages)

  }, [])


    return(
      
    <div className= " w-full h-screen flex flex-col bg-header bg-gray-400"  >

        <UpperBar signOut = {signOut} user = {email}  mode = {'editing'} setMode = {setMode} setLoseStylePopUp = {setLoseStylePopUp} userParametersPath = {userParametersPath}/>
        <LowerBarEditing setTransparency = {setTransparency} page = {page} increasePage = {increasePage}  decreasePage = {decreasePage} 
                          SetFirstUse = {SetFirstUse} isSplitView = {isSplitView} setSplitView = {setSplitView} setPositionSwitched = {setPositionSwitched} 
                          loadCanvas = {loadCanvas} saveCanvas = {saveCanvas} 
                          visibleBoundingBoxes = { visibleBoundingBoxes} setVisibleBoundingBoxes = {setVisibleBoundingBoxes}/>

      { !isSplitView ? (
        <div title="in transparency">
          <SimpleCanvas ref = {editCanvasRef} w = {screenWidth-20} h={screenHeight-120} percentWidth = {100} 
          draggablePosition = {draggablePosition} setDraggablePosition = {setDraggablePosition}
          isImageBackgrounds = {true} page = {page} transparency = {transparency} visibleBoundingBoxes = {visibleBoundingBoxes}
          history = {HistoryMapper[page]} setHistory = {SetHistoryMapper[page]}  canvasOnTheLeft = {true}
          historyPointer = {HistoryPointerMapper[page]} setHistoryPointer ={SetHistoryPointerMapper[page]}
         />                                         
      </div>)
      :
      (positionSwitched ? (
        <div title="in split view" className="flex flex-row bg-gray-400">
        <div className="w-[50%] h-full p-2" 
          style={{backgroundImage: `url("/src/assets/sample_${page}.png")`, backgroundSize: 'contain', backgroundRepeat: 'no-repeat', backgroundPosition: 'center', opacity: 1}}>
        
        {/*canvas bounding boxes*/}
        {visibleBoundingBoxes && <canvas
          ref={BBCanvasRef}
          width={screenWidth-6}
          height={screenHeight-120}
          className=""
          style={{
            position: 'absolute',
            top: 100,
            left: 0,
            pointerEvents: 'none', // Impedisce a questo canvas di interferire con gli eventi del canvas principale
          }}
        />}
        </div>

        <div className="flex flex-row w-[50%] h-full " style = {{opacity: transparency}}>         
          <SimpleCanvas ref = {editCanvasRef} w = {screenWidth/2 - 4} h={screenHeight-120} percentWidth = {100} page = {page}
          draggablePosition = {draggablePosition} setDraggablePosition = {setDraggablePosition}
          history = {HistoryMapper[page]} setHistory = {SetHistoryMapper[page]} canvasOnTheLeft = {false}
          historyPointer = {HistoryPointerMapper[page]} setHistoryPointer ={SetHistoryPointerMapper[page]} 
          />                                          
        </div>      
      </div>
      )
      :
      (
        <div title="in split view" className="flex flex-row bg-gray-400">
          <div className="flex flex-row w-[50%] h-full " style = {{opacity: transparency}}>         
            <SimpleCanvas ref = {editCanvasRef} w = {screenWidth/2 -4} h={screenHeight-120} percentWidth = {100} page = {page} 
            draggablePosition = {draggablePosition} setDraggablePosition = {setDraggablePosition}
            history = {HistoryMapper[page]} setHistory = {SetHistoryMapper[page]} canvasOnTheLeft = {true}
            historyPointer = {HistoryPointerMapper[page]} setHistoryPointer ={SetHistoryPointerMapper[page]}
             />                                          
          </div>  
          
          <div className="w-[50%] h-full p-2" 
            style={{backgroundImage: `url("/src/assets/sample_${page}.png")`, backgroundSize: 'contain', backgroundRepeat: 'no-repeat', backgroundPosition: 'center', opacity: 1}}>
        
          {/*canvas bounding boxes*/}
          {visibleBoundingBoxes && <canvas
            ref={BBCanvasRef}
            width={screenWidth/2 -4}
            height={screenHeight-120}
            className=""
            style={{
              position: 'absolute',
              top: 100,
              left: 760,
              pointerEvents: 'none', // Impedisce a questo canvas di interferire con gli eventi del canvas principale
            }}
          />}
        
          </div>    
        </div>
      )
      ) }     
        
        {firstUse && <FirstEditPopUp  SetFirstUse = {SetFirstUse} setTransparency = {setTransparency} setDraggablePosition = {setDraggablePosition}/> }

        {isSendPopUp && <SendStylePopUp setIsSendPopUp = {setIsSendPopUp} savedImages = {savedImages} setUserParametersPath = {setUserParametersPath} 
                        setMode = {setMode} SendNewStyle = {SendNewStyle} isCheckingS3 = {isCheckingS3}/> }

        {isLoseStylePopUp && <LoseStyleWarning setLoseStylePopUp = {setLoseStylePopUp} setMode = {setMode}/>}
    </div>)
}