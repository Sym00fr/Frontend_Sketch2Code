import { useState } from "react";

import {Button, ButtonGroup} from "@heroui/react";
import {Slider} from "@heroui/react";

import { FaArrowsRotate } from "react-icons/fa6";
import { MdOutlineRadioButtonUnchecked } from "react-icons/md";
import { MdOutlineRadioButtonChecked } from "react-icons/md";
import { MdNavigateNext } from "react-icons/md";
import { MdNavigateBefore } from "react-icons/md";
import { FaRegQuestionCircle } from "react-icons/fa";
import { FaArrowRightArrowLeft } from "react-icons/fa6";



export const LowerBarEditing = (props) => {

    const {isSplitView, setSplitView, setTransparency, page, increasePage, decreasePage, SetFirstUse, setPositionSwitched, 
        loadCanvas, saveCanvas, visibleBoundingBoxes, setVisibleBoundingBoxes } = props;

    const handleChange = (value) => {
        if (isNaN(Number(value))) return;
    
        setTransparency(Number(value));
        console.log(Number(value))
      };
    
    const handleSplitviewClick= () =>{
        saveCanvas();
        setSplitView((x)=>!x);
        //loadCanvas(); ci pensa la use effect a caricare il canvas
    }
    const handleSwitchPositionClick= () =>{
        saveCanvas();
        setPositionSwitched((x)=>!x)
        //loadCanvas();
    }
    



    
    return(
        <div className="w-full h-14 flex flex-row px-12">
            <div className="w-full bg-gray-700 h-[50px] rounded-b-small flex flex-row border-gray-600 border-2">

                <div className=" w-full flex flex-row p-1 space-x-5 px-6 ">
                    <Button className="bg-gray-800 text-sm border-gray-400 border-1 text-gray-300" radius = "lg"  onPress={()=>handleSplitviewClick()} >
                           {isSplitView ?  "Hide split view" : "Show split view"}
                    </Button>
                    { isSplitView ?  
                        <div>
                            <Button className="bg-gray-800 text-sm border-gray-400 border-1 text-gray-300" radius = "lg"  onPress = {()=>{handleSwitchPositionClick()}} > Switch positions <FaArrowRightArrowLeft/> </Button> 
                        </div>
                        :
                        <div className="w-[250px] p-2 flex flex-row space-x-4 text-gray-300">
                            <h1>Transparency</h1>
                            <Slider size="sm" color = 'foreground' onChange={handleChange} minValue={0} maxValue={1} step={0.01} ></Slider>
                        </div>    
                    }
                    <Button className="bg-gray-800 text-sm border-gray-400 border-1 text-gray-300" radius = "lg" onPress={()=>setVisibleBoundingBoxes((x)=>!x)}>{visibleBoundingBoxes ? 'Hide boxes' : 'Show Boxes'}</Button>
                    <Button className="bg-gray-800 text-sm border-gray-400 border-1" radius = "lg" onPress={()=>{saveCanvas();setSplitView(false);; SetFirstUse(true);}}><FaRegQuestionCircle/></Button>
                </div>
                
                <div className="flex flex-row w-[340px] ">
                    <ButtonGroup className="border-gray-400 border-2 rounded-2xl">
                        <Button className="bg-gray-800 text-gray-300 " onPress={()=>decreasePage()}> <MdNavigateBefore/> Prev</Button>
                        <Button className="bg-sky-600 text-white" isDisabled>{page + ' / 5 '} </Button>
                        <Button className="bg-gray-800 text-gray-300" onPress={()=>increasePage()}> {page==5 ? 'Send' : 'Next'} <MdNavigateNext/> </Button>

                    </ButtonGroup>
                </div>
                
            

            </div>

        </div>
    )
}