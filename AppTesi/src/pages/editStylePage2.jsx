import { useState, useRef, useEffect } from "react"

import { UpperBar } from "../components/UpperBar"
import { LowerBarEditing } from "../components/LowerBarEditing"
//import {ReactSketchCanvas} from "react-sketch-canvas";
//import SimpleCanvas from "../components/SimpleCanvas";
import SketchCavas from "../components/skecthCanvas";
import { DraggableBar } from "../components/DraggableBar";
import { FirstEditPopUp } from "../components/interfacePopUp";

export const EditStylePage2 = (props) => {
  
const {email, firstUse, SetFirstUse, mode, setMode } = props;

const [isSplitView, setSplitView] = useState(false)
const [positionSwitched, setPositionSwitched] = useState(false)
const [transparency, setTransparency] = useState(0.4)
const [page, setPage] = useState(1)
const [savedImages, setSavedImages] = useState([]);
const [visibleBoundingBoxes, setVisibleBoundingBoxes] = useState(true);

const numPages = 5;

const editCanvasRef = useRef(null);

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
    if (page < numPages ){
      //salviamo lo sketch 
      saveCanvas();
      setPage(page+1)
      setVisibleBoundingBoxes(false); 
    }
    else {console.log('last page')}  
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
  const loadBB = () =>{
    editCanvasRef.current.drawBB(page);
  }
   
  

  useEffect(()=>{
    loadCanvas();
    if(isSplitView)
    {setTransparency(1);}
    else {setTransparency(0.4)}
  }, [page, isSplitView, positionSwitched])

  const styles = {
    border: '0.1rem solid #000000',
    backgroundColor: 'rgba(201, 76, 76, 0.9)', 
    opacity: 1-transparency
};


    return(
      
    <div className= " w-full h-screen flex flex-col bg-header bg-blue-100"  >

        <UpperBar user = {email}  mode = {mode} setMode = {setMode}/>
        <LowerBarEditing setTransparency = {setTransparency} page = {page} increasePage = {increasePage}  decreasePage = {decreasePage} 
                          SetFirstUse = {SetFirstUse} isSplitView = {isSplitView} setSplitView = {setSplitView} setPositionSwitched = {setPositionSwitched} 
                          loadCanvas = {loadCanvas} saveCanvas = {saveCanvas} visibleBoundingBoxes = { visibleBoundingBoxes} setVisibleBoundingBoxes = {setVisibleBoundingBoxes}/>

      { !isSplitView ? (
        <div title="in transparency">
        {/*<div className="w-[1500px] h-[600px] absolute" 
          style={{backgroundImage: `url("/src/assets/sample_${page}.png")`, backgroundSize: 'contain', backgroundRepeat: 'no-repeat', backgroundPosition: 'center',  opacity: 1, top: 110, left: 10}}>          
        </div>*/}

        {/*<div className="flex flex-row w-full h-full bg-sky-700" style = {{opacity: transparency}}> */}        
              
          {/*<div className="w-full p-2" >
            <Image src="src\assets\interfaccia_prova_1.png"></Image>
          </div>*/}
          <SimpleCanvas ref = {editCanvasRef} w = {1522} h={630} percentWidth = {100} 
          isImageBackgrounds = {true} page = {page} transparency = {transparency} visibleBoundingBoxes = {visibleBoundingBoxes}/>
                                           
        {/*</div>*/}
      </div>)
      :
      (positionSwitched ? (
        <div title="in split view" className="flex flex-row">
        <div className="w-[50%] h-full p-2" 
          style={{backgroundImage: `url("/src/assets/sample_${page}.png")`, backgroundSize: 'contain', backgroundRepeat: 'no-repeat', backgroundPosition: 'center', opacity: 1}}>
        </div>

        <div className="flex flex-row w-[50%] h-full " style = {{opacity: transparency}}>         
          <SimpleCanvas ref = {editCanvasRef} w = {760} h={630} percentWidth = {100}/>                                          
        </div>      
      </div>
      )
      :
      (
         <div title="in split view" className="flex flex-row">
        <div className="flex flex-row w-[50%] h-full " style = {{opacity: transparency}}>         
          <SimpleCanvas ref = {editCanvasRef} w = {760} h={630} percentWidth = {100}/>                                          
        </div>  
         <div className="w-[50%] h-full p-2" 
          style={{backgroundImage: `url("/src/assets/sample_${page}.png")`, backgroundSize: 'contain', backgroundRepeat: 'no-repeat', backgroundPosition: 'center', opacity: 1}}>
        </div>    
      </div>
      )
      ) }     
        
        {firstUse && <FirstEditPopUp  SetFirstUse = {SetFirstUse} setTransparency = {setTransparency}/> }

    </div>)
}