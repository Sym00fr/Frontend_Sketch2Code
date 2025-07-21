
import Draggable from 'react-draggable';
import {  Button, ButtonGroup } from '@heroui/react';
import { FaPen, FaEraser} from "react-icons/fa";
import { IoMdUndo, IoMdRedo, IoMdClose } from "react-icons/io";
import { TfiHandDrag } from "react-icons/tfi";
import { MdCropFree } from "react-icons/md";
import { FaRegCopy } from "react-icons/fa6";


import { useEffect } from 'react';




export const DraggableBar = (props) => {

    const { penClick, eraserClick, undoClick, redoClick, cropClick, tool, setTool, initial_x, initial_y, 
            isSelection, deleteSelectedElement, copyCroppedElement,
            handleZoomIn, handleZoomOut, setDraggablePosition, canvasOnTheLeft } = props;

    let x_offset;

    useEffect(()=>{
      if(canvasOnTheLeft){
        x_offset =0;
    } else  {
        x_offset = 760;
    }
    }, [canvasOnTheLeft])


    {/*let position =  "inset-y-2 inset-x-4"
    canvasOnTheLeft ? position = "inset-y-28 inset-x-4" : position = "inset-y-28 inset-x-1/2 "*/}
    
    {/* .handle serve per dichiarae un di usato per trascinare, per non rendere l'intero componente trascinabile */}
    return (

        <Draggable handle='.handle' defaultPosition={{x: initial_x, y: initial_y}} onStop={(data)=>{console.log(data); setDraggablePosition({x: data.x-470-x_offset, y: data.y - 117})}}>
            <div className='flex flex-col absolute h-[40px] z-20 '> 
                <div style={{ width: '490px', height: '40px', 
                    borderRadius: '0.5rem', border: " 0.0625rem solid", borderColor: "black" }} className='flex flex-row bg-blue-500'>
                    <ButtonGroup>
                       
                        <Button  variant = {tool ==='pen' ? 'flat' : 'light'}
                        onPress={()=>penClick()}  size='sm'> <FaPen size={20}/> </Button>

                        <Button  variant = {tool ==='eraser'  ? 'flat' : 'light'} 
                        onPress={()=>eraserClick()}  size='sm'> <FaEraser size={20}/> </Button>

                        <Button variant = {tool ==='crop'  ? 'flat' : 'light'}  
                        onPress={()=>cropClick()}  size='sm'> <MdCropFree size={20}/> </Button>
                                               
                        <Button onPress={()=>undoClick()} variant="light" size='sm'> <IoMdUndo size={20}/> </Button>

                        <Button onPress={()=>redoClick()} variant="light" size='sm'> <IoMdRedo size={20}/> </Button>

                        {handleZoomIn}

                        {handleZoomOut}
                        
                        
                    </ButtonGroup>
 
                    {/* handle dichiara questo componente come l'unico trascinabile */}
                    <div className='p-2 handle'>  
                        <div style={{ backgroundColor: 'Black', borderRadius: '2rem', borderColor: "white", width: '25px', height: '25px' }} className='p-0.5'>
                            <TfiHandDrag size={18}/>
                        </div>
                    </div>
                </div>
                {/*Strumenti per il ritaglio */}
                {isSelection &&
                    <div className='items-center justify-center flex flex-row'>
                        <div style={{ width: '195px', height: '40px', 
                            borderRadius: '0rem 0rem 0.5rem 0.5rem', border: " 0.0625rem solid", borderColor: "black" }} className='flex flex-row bg-cyan-500'>
                                <ButtonGroup>
                                    <Button variant="light" size='sm' onPress={()=>{copyCroppedElement('copy')}}> <FaRegCopy  size={20}/> </Button>                                
                               
                                    <Button variant="light" size='sm' onPress={()=>{ setTool('drag'); copyCroppedElement('static');}}> <TfiHandDrag  size={20}/> </Button>
                                
                                    <Button variant="light" size='sm' onPress={()=>deleteSelectedElement()}><IoMdClose  size={20}/></Button>
                                </ButtonGroup>
                            </div>
                        

                    </div> 
                }
            </div> 
        </Draggable>
    );
};
    
  
    