//import { Button } from "@heroui/react"
import {Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Button} from "@heroui/react";
import { useNavigate } from "react-router-dom";
import { FiPlus } from "react-icons/fi"
import { FaRegUser } from "react-icons/fa";
import { GoDot, GoDotFill } from "react-icons/go";


export const UpperBar = (props) => {

    const {style, user, signOut,  userType, mode, setMode, setStyle, setChooseStylePopUp, 
        setLoseStylePopUp, userParametersPath, isCheckingS3, setIsCheckingS3 } = props;
    //console.log(userParametersPath)

    const boh = [1,2,3];
    
    const navigate = useNavigate();

        const pathToName = (path) =>{
            if(path === 'default' || path === 'Default'){
                return 'default';
            } else {
                //console.log(mode);
                const temp = path.split('/')[2]
                const name = temp.split('_')[1]
                return name
            }      
        }

    return(
        <div className="w-full bg-gray-800 h-12 rounded-b-small flex flex-row space-x-5 p-1">
            <h1 className="text-3xl w-full px-5">Sketch to code</h1>
           
            {/*<Dropdown className="border-2 border-black bg-gray-100">
                    <DropdownTrigger className="flex flex-row justify-center items-center">
                       <div className="bg-gray-600 w-[200px] rounded-lg border-white border-1">{mode=='sketch' ? ('Style: ' + pathToName(style)) : ('Personalize style')}</div> 
                    </DropdownTrigger>
                    <DropdownMenu aria-label="Static Actions" >
                        {userParametersPath.length > 0 && <DropdownItem key="change" onPress={()=>setChooseStylePopUp(true)}> Change style</DropdownItem>}
                        {mode == 'sketch' && <DropdownItem  className="text-black text-lg flex flex-row" color="warning" onPress={()=>{setMode('editing'); navigate('/edit')}}> Add a Style <FiPlus size={15}/> </DropdownItem>}
                        {mode == 'editing' && <DropdownItem  className="text-black bg-gray-100" color="warning" onPress={()=>{setLoseStylePopUp(true)}}>Go to sketch</DropdownItem>}
                     </DropdownMenu>
                </Dropdown>*/}

            {mode == 'sketch' ? 
            <Dropdown className="border-2 border-black bg-gray-100" onClose={()=>{if(isCheckingS3.completed){setIsCheckingS3({checking: false, path: '', completed: false})}}}>
                    <DropdownTrigger className="flex flex-row justify-center items-center">
                       <div className="bg-gray-600 w-[270px] rounded-lg border-white border-1">
                            {userParametersPath.length > 0 ? ('Style: ' + pathToName(style)) : ('Personalize style')} 
                            {isCheckingS3.checking && <GoDot size={20} className="text-green-400"></GoDot>} 
                            {isCheckingS3.completed && <GoDotFill size={20} className="text-green-400"></GoDotFill>}
                        </div> 
                    </DropdownTrigger>
                    <DropdownMenu aria-label="Static Actions" className="w-[200px]" >
                        {userParametersPath.map((x) =><DropdownItem onPress={()=>setStyle(x)}>{'Style ' + pathToName(x)}</DropdownItem>)}
                        {!isCheckingS3.checking ? 
                        <DropdownItem  className="text-black text-lg"  onPress={()=>{setMode('editing'); navigate('/edit')}} endContent={<FiPlus size={20}/>}>Add Style</DropdownItem>
                        :
                        <DropdownItem  className="text-black text-lg flex flex-row" isDisabled={true}> Elaborating Style </DropdownItem>
                        }
                     </DropdownMenu>
                </Dropdown>
            : 
            <Button radius="sm" className="w-[250px] bg-gray-600 border-gray-200 border-1 text-md" onPress={()=>{setLoseStylePopUp(true)}}> Exit  personalization</Button> 
            }



            <div className="px-3">
                {/*Deafult con la D grande e bordererd con la b piccola... */}
                <Dropdown>
                    <DropdownTrigger>
                        <Button color="Default" variant ="bordered" radius = "full" > <FaRegUser size={25}/> </Button>  
                    </DropdownTrigger>
                    <DropdownMenu aria-label="Static Actions" disabledKeys={["user"]}>
                        <DropdownItem key = "user"> <h1 className="w-[300px] text-black" >{user}</h1></DropdownItem>
                        <DropdownItem key="logout" onPress={()=>signOut()}>Logout</DropdownItem>
                    </DropdownMenu>
                </Dropdown>
            </div>
        </div>
    )
}