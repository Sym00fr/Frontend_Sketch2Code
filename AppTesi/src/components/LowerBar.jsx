import {Button, ButtonGroup} from "@heroui/react";
import { FaArrowsRotate } from "react-icons/fa6";
import { FaPlay } from "react-icons/fa"
import { HiOutlineSwitchHorizontal } from "react-icons/hi";
import { IoMdDownload } from "react-icons/io";



export const LowerBar = (props) => {
    const {stylePath, generate, saveCanvas, setLeftCanvas, isGenerated} = props;

        const pathToName = (path) =>{
            if(path === 'default' || path === 'Default'){
                return 'Default';
            } else {
                console.log('ok');
                const temp = path.split('/')[1]
                const name = temp.split('-')[3]
                return name
            }      
    }

    /*const generate = () =>{
        const name = pathToName(stylePath);
        console.log(name)
        setImg(`/src/assets/Generated_Sketch_style_${name}.png`);
    }*/


 
    return(
        <div className="w-full h-14 flex flex-row px-12 ">
            <div className="w-full bg-gray-700 h-12 rounded-b-2xl flex flex-row space-x-5 p-2">
                <div className=" items-center justify-center flex space-x-10">
                    <Button className="bg-gray-800 text-gray-300 text-sm border-lime-600 border-2" variant ="bordered" radius = "lg"  onPress={()=>generate()}>   Generate   <FaPlay className="text-lime-400"/> </Button>
                    <Button  className="bg-gray-800 text-gray-300 text-sm border-gray-300 border-1" radius = "lg" onPress = {()=>{saveCanvas(); setLeftCanvas((x)=>!x)}} >   Switch positions <HiOutlineSwitchHorizontal /> </Button>
                    {isGenerated && <Button className="bg-gray-800 text-gray-300 text-sm border-sky-700 border-2" variant ="bordered" radius = "lg" > Download HTML + CSS  <IoMdDownload /></Button>}
                </div>
                               
            </div>
        </div>
    )
}