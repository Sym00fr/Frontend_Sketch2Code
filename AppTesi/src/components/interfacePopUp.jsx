import { Button, Image, Input } from "@heroui/react"
import { useNavigate } from "react-router-dom"
import { useEffect, useState } from "react"
import { IoMdClose } from "react-icons/io";
import { InterfacePreview } from "./interfacePreview";
import { TiWarning } from "react-icons/ti";
import { FaCheck } from "react-icons/fa";



const InterfacePopup = (props) => {
    const {setfullPreview, generatedHTML}  = props

    return(
        <div className="w-full h-full absolute bg-white z-30  rounded-2xl border-2 border-black ">
        <Button className="absolute z-20 bg-gray-600 text-sm border-gray-800 border-2 opacity-30 inset-3 w-[40px]" onPress={()=>setfullPreview(false)} color=""><IoMdClose size = '20' /></Button>
        <InterfacePreview setfullPreview = {setfullPreview} generatedHTML = {generatedHTML} fullScreen = {true}/>       
        </div>
    )

}

const NewUserPopUp = (props) =>{

    const {setFirstUsePopUp, setFirstPopUp, setStyle, setMode} = props

    const navigate = useNavigate()

   return(<>
    <div className="w-full h-full absolute z-20 bg-gray-100" style={{opacity: 0.5}}></div>
    <div className="absolute z-20 bg-gray-300 rounded-2xl border-2 border-gray-700 shadow-2xl p-2 items-center justify-center flex flex-col" style={{top: 100, left: 500, width: 550}}>
        <h1 className="text-black p-5 text-4xl font-bmedium" >Customize your style</h1>
        
        <p className="text-black p-3 text-xl">
            Welcome to Sketch2Code!</p>
        <p className="text-black text-large p-5">
           Allow us to explain how this app functions.  You can train our model to recognize your unique style, 
           in order to obtain personalized results, or you can use the default version
        </p>
        

             <div className=" flex flex-col p-4 space-y-4 items-center justify-center">
                <Button className="w-[300px] text-md text-gray-900 bg-gray-200 border-black border-2 " onPress={()=>{setStyle('default'); setFirstPopUp(false); setFirstUsePopUp(false); }}>Continue with the default version</Button>
                <Button className='w-[300px] text-md text-gray-200 bg-gray-500 border-gray-200 border-2 ' onPress={()=>{setMode('editing');  setFirstPopUp(false); navigate('/edit');}} >Customize style</Button>
            </div>
       
        </div></>
        
    ) 
}

const PersonalPopUp = (props) =>{

    const {setPersonalPopup, setFirstPopUp, setStyle, setMode} = props

    const navigate = useNavigate()

   return(<>
    <div className="w-full h-full absolute z-20 bg-gray-500 " style={{opacity: 0.5}}></div>
    <div className="absolute z-20 bg-gray-300 rounded-2xl border-2 border-gray-700 shadow-2xl space-y-2 items-center justify-center flex flex-col" style={{top: 125, left: 450, width: 650}}>
        
        <h1 className="text-4xl text-gray-700 font-bmedium p-5" >Customize your style</h1>
        
        
            <p className="text-black p-5 text-large text-gray-700 text-center">
                You are using the default version of our model, 
                and you don't have any styles saved yet. Teach us how to recognize your style for custom results 
            </p>
            <div className=" flex flex-col p-5 space-y-4 items-center justify-center">
                <Button className="w-[300px] text-lg text-gray-900 bg-gray-200 border-black border-2 " radius = "lg" onPress={()=>{setStyle('default'); setFirstPopUp(false); setPersonalPopup(false) }}>Continue with the default version</Button>
                <Button className='w-[300px] text-lg text-gray-200 bg-gray-500 border-gray-200 border-2 ' onPress={()=>{setMode('editing'); setFirstPopUp(false); navigate('/edit');}} >Customize style</Button>
            </div>
        
             
        </div></>
        
    ) 
}



const FirstEditPopUp = (props) =>{

    const {SetFirstUse, setTransparency, setDraggablePosition} = props

    const [phase, setPhase] = useState(0)
    const [topOverlay, setTopOverlay] = useState({top: 0, left: 0, width: '100%', height: '15%'})
    const [RightOverlay, setRightOverlay] = useState({top: 0, left: 0, width: 0, height: 0})
    const [LeftOverlay, setLeftOverlay] = useState({top: 0, left: 0, width: 0, height: 0})
    const [bottomOverlay, setBottomOverlay] = useState({top: 0, left: 0, width: 0, height: 0})



    useEffect(()=>{
        setTransparency(0);
        setDraggablePosition({x:10, y:10});
    },[])

   return(<>
    <div className=" absolute z-20 bg-gray-100 " style={{opacity: 0.6, top: topOverlay.top, left: topOverlay.left, width: topOverlay.width, height: topOverlay.height}}></div>
    <div className=" absolute z-20 bg-gray-100 " style={{opacity: 0.6, top: RightOverlay.top, left: RightOverlay.left, width: RightOverlay.width, height: RightOverlay.height}}></div>
    <div className=" absolute z-20 bg-gray-100 " style={{opacity: 0.6, top: LeftOverlay.top, left: LeftOverlay.left, width: LeftOverlay.width, height: LeftOverlay.height}}></div>
    <div className=" absolute z-20 bg-gray-100 " style={{opacity: 0.6, top: bottomOverlay.top, left: bottomOverlay.left, width: bottomOverlay.width, height: bottomOverlay.height}}></div>

    {phase === 0 &&
        <div className= "z-20 bg-gray-300 border-2 border-gray-700 shadow-2xl rounded-2xl p-2 items-center justify-center flex flex-col" style={{position: 'absolute', top: 300, left:60, width: 500 }}>
         <p className="text-black p-5 text-large text-center">
            In this section you can teach the model to recognize your drawing style:
            draw the interface in transparency
            </p>
             <div className="flex flex-row p-2 space-x-10 justify-center">
                <Button className = 'bg-gray-500 text-md  text-gray-200 border-gray-200 border-2'  onPress={()=>{
                    setPhase((x)=>x+1);
                    setTopOverlay({top: 0, left: 0, width: '100%', height: '15%'})  //sono le proporzioni del successivo
                    setRightOverlay({top: '15%', left: '35%', width: '65%', height: '85%'})  
                    setLeftOverlay({top: '22%', left: 0 , width: '35%', height: '78%'})
                     }}>OK</Button>
                <Button className = 'bg-gray-200 border-black border-2 text-gray-900 text-md' onPress={()=>SetFirstUse(false) }>Skip</Button>
            </div>    
        </div>}

        {phase === 1 && 
        <div className="z-20 bg-gray-300 border-2 border-black shadow-2xl rounded-2xl items-center justify-center flex flex-col" style={{position: 'absolute', top: 160, left: 20, width: 520 , height:190}}>
            <p className="text-black p-5 text-large text-center">
                 You can move the toolbar around the place, by dragging it from the black hand icon. Use the zoom if you want to detail even the smallest components
            </p>
             <div className="flex flex-row p-2 space-x-10 justify-center">
                <Button className = 'bg-gray-500 text-md  text-gray-200 border-gray-200 border-2'  onPress={()=>{
                    setPhase((x)=>x+1);
                    setTopOverlay({top: 0, left: 0, width: '100%', height: '7%'})
                    setLeftOverlay({top: '7%', left: 0, width: '14%', height: '93%'})
                    setRightOverlay({top: '7%', left: '31%', width: '69%', height: '93%'})
                    setBottomOverlay({top: '14%', left: '14%', width: '17%', height: '86%'})                   
                    }}>OK</Button>
                    <Button className = 'bg-gray-200 border-black border-2 text-gray-900 text-md' onPress={()=>SetFirstUse(false) }>Skip</Button>
            </div>    
        </div>}

        {phase === 2 && 
        <div className=" z-20 bg-gray-300 border-2 border-black shadow-2xl rounded-2xl items-center justify-center flex flex-col " style={{position: 'absolute', top: 100, left: 160, width: 440, height:150}}>
            <p className="text-black p-5 text-large">
                Adjust the transparency of the background image            </p>
             <div className="flex flex-row p-2 space-x-10 justify-center">
                <Button className = 'bg-gray-500 text-md  text-gray-200 border-gray-200 border-2'  onPress={()=>{
                    setPhase((x)=>x+1);
                    setLeftOverlay({top: '7%', left: 0, width: '32%', height: '93%'})
                    setRightOverlay({top: '7%', left: '40%', width: '60%', height: '93%'})
                    setBottomOverlay({top: '14%', left: '32%', width: '8%', height: '86%'}) 
                     }}>OK</Button>
                    <Button className = 'bg-gray-200 border-black border-2 text-gray-900 text-md' onPress={()=>SetFirstUse(false) }>Skip</Button>

            </div>    
        </div>}
        {phase === 3 && 
        <div className=" z-20 bg-gray-300 border-2 border-black shadow-2xl rounded-2xl items-center justify-center flex flex-col " style={{position: 'absolute', top: 100, left: 160, width: 440, height: 190}}>
            <p className="text-black p-5 text-large">
                Hide and show the bounding boxes of the various components, so you can recognize them and not skip any.            </p>
             <div className="flex flex-row p-2 space-x-10 justify-center">
                <Button className = 'bg-gray-500 text-md  text-gray-200 border-gray-200 border-2'  onPress={()=>{
                    setPhase((x)=>x+1);
                    setLeftOverlay({top: '7%', left: 0, width: '4%', height: '93%'})
                    setRightOverlay({top: '7%', left: '14%', width: '86%', height: '93%'})
                    setBottomOverlay({top: '13%', left: '4%', width: '10%', height: '87%'}) 
                     }}>OK</Button>
                    <Button className = 'bg-gray-200 border-black border-2 text-gray-900 text-md' onPress={()=>SetFirstUse(false) }>Skip</Button>

            </div>    
        </div>}
        {phase === 4 && 
        <div className=" z-20 bg-gray-300 border-2 border-black shadow-2xl rounded-2xl items-center justify-center flex flex-col space-y-5" style={{position: 'absolute', top: 50, left: 260, width: 560, height: 120}}>
            <p className="text-black text-large">
                Change view mode between split view and transparency view</p>             
        <div className="flex flex-row p-2 space-x-10 justify-center">
                <Button className = 'bg-gray-500 text-md  text-gray-200 border-gray-200 border-2'  onPress={()=>{
                    setPhase((x)=>x+1);
                    setTopOverlay({top: 0, left: 0, width: '100%', height: '6%'})
                    setLeftOverlay({top: '6%', left: 0, width: '78%', height: '94%'})
                    setRightOverlay({top: '6%', left: '96%', width: '4%', height: '94%'})
                    setBottomOverlay({top: '14%', left: '78%', width: '18%', height: '86%'})                      
                    }}>OK</Button>
                    <Button className = 'bg-gray-200 border-black border-2 text-gray-900 text-md' onPress={()=>SetFirstUse(false) }>Skip</Button>

            </div>    
        </div>}
        {phase === 5 && 
        <div className="z-20 bg-gray-300 border-2 border-black shadow-2xl rounded-2xl items-center justify-center flex flex-col " style={{position: 'absolute', top: 100, left: 700, width: 740, height:170}}>
            <p className="text-black p-5 text-large">
               When you are satisfied with the result, you can move on to the next interface. 
               You can always go back and navigate between the various interfaces.
            </p>
             <div className="flex flex-row p-2 space-x-10 justify-center">
                <Button className = 'bg-gray-500 text-md  text-gray-200 border-gray-200 border-2'  onPress={()=>{SetFirstUse(false) }}>OK</Button>
            </div>    
        </div>}
    </>
        
    ) 
}


const ChooseStylePopUp = (props) =>{

const {setChooseStylePopUp, userParametersPath, setStyle } = props;

const pathToName = (path) =>{
console.log(path);
const temp = path.split('/')[1]
const name = temp.split('-')[3]
  return name
}

//console.log(userParametersPath);

   return(<>
    <div className="w-full h-full absolute z-20 bg-gray-100 " style={{opacity: 0.5}}></div>
    
        <div className= "absolute z-20 bg-gray-300 rounded-2xl border-2 border-gray-700 shadow-2xl p-2 items-center justify-center flex flex-col space-y-5 " style={{top: 220, left: 600, width: 300}}>
            <h1 className=" text-gray-700 text-2xl p-3"> {userParametersPath ? 'Choose your style' : 'No styles saved'} </h1>
            {userParametersPath ? (
                userParametersPath.map((x)=>{
                    return (
                        <Button onPress = {()=>{setStyle(x); setChooseStylePopUp(false);}}  className=" text-lg w-[150px] text-gray-200 bg-gray-500 border-gray-200 border-2">{pathToName(x)}</Button>
                    )
                })
            ) 
            :
            (<></>) }
            <Button onPress = {()=>{setStyle('default'); setChooseStylePopUp(false);}}  className=" bg-gray-200 text-black text-lg border-gray-800 border-2 w-[150px]">Default</Button>
            <Button className="border-gray-200 border-1 bg-gray-600" size="sm" onPress={()=>setChooseStylePopUp(false)}><IoMdClose size={25}/></Button>

        </div>
    </>
    ) 
}

const SendStylePopUp = (props) =>{

    const {setIsSendPopUp, savedImages, setUserParametersPath, setMode, SendNewStyle, isCheckingS3} = props

    const [tempName, setTempName]  = useState('');
    const [invalid, setinvalid] = useState(false);
    const [emptyCanvas, setEmptyCanvas] = useState(false);
    const [errors, setErrors] = useState();
    const navigate = useNavigate();

    const isSomeEmptyCanvas = () =>{
        
        const blankCanvasDataURL = savedImages[0]; //il primo è sempre un canvas vuoto
        //console.log(savedImages[0])
        //console.log(savedImages[3])
        let res = false;
        let i = 0;
        for (const imageURL of savedImages){
            if (i!=0){
                if (imageURL === blankCanvasDataURL){
                    res = true;
                    console.log(i);
                }
            }           
            i++;
        }
        if(res){console.log('empty canvas detected')}
        return res;
    }

    const check = (name) =>{
        //controlliamo che nel nome non ci siano caratteri che darebbero problemi '/', ',', '-'
        if(name.includes('/') || name.includes(',') || name.includes('-')){       
            setErrors("name can't contain ' / ' or ' - ' or ' , ' charachters")          
            setinvalid(true);
        }

        else { 
            setErrors(null)
            setinvalid(false);}    
    }

    useEffect(()=>{
        if (isSomeEmptyCanvas()){
            setinvalid(true);
            setEmptyCanvas(true);
            console.log('empty')
        }
    }, [])




    const send = () =>{
        console.log(tempName);
        if (tempName==''){
            setErrors("Name can't be empty");
            setinvalid(true);
        }
        else{
            console.log('sending');
            SendNewStyle(tempName);
        }
        
    }

   return(<>
   {/*No checking dei parametri */}
    <div className="w-full h-full absolute z-20 bg-gray-100" style={{opacity: 0.5}}></div>
    {!isCheckingS3.checking && !isCheckingS3.completed && <div className="absolute z-20 bg-gray-300 rounded-2xl border-2 border-gray-700 shadow-2xl rounded-2xl p-2" style={{top: 200, left: 500, width: 550}}>
        <div className=" flex-col">
            <Button className="text-gray-900 bg-gray-200 border-black border-2 "  size="sm"  onPress={()=>setIsSendPopUp(false)}><IoMdClose size={19}/></Button>
            <h1 className="text-gray-600 p-5 text-2xl font-bmedium " >Name Your Style</h1>
        </div>
        <div className="p-3 flex items-center justify-center">
            <Input size={'lg'} className="w-[300px]" isInvalid = {invalid}  onChange={(e)=>{setTempName(e.target.value); check(e.target.value)}}
            errorMessage={errors}
             ></Input>
        </div>

         {emptyCanvas && <h2 className=" text-red-600 px-5">Warning: Some of the canvas are empty!</h2>}
             <div className=" flex flex-col p-4 space-y-4 items-center justify-center">
                <Button className=' w-[100px] text-md text-gray-200 bg-gray-500 border-gray-200 border-2' isDisabled = {invalid || emptyCanvas} onPress={()=>{send()}}  >Submit</Button>
            </div>
             
    </div>}
    {/*checking dei parametri caricati*/}
    {isCheckingS3.checking && !isCheckingS3.completed && <div className="absolute z-20 bg-gray-300 rounded-2xl border-2 border-gray-700 shadow-2xl rounded-2xl p-2 " style={{top: 200, left: 500, width: 550}}>
        <div className=" flex flex-col items-center justify-center">
            <h1 className="text-gray-600 p-5 text-2xl font-bmedium " >Your style is being processed</h1>
        </div>
        <div className="p-3 flex items-center justify-center">
            <img src='src\assets\loading.gif' className="w-[150px] h-[150px]" ></img>
        </div>
        <h2 className="bg-gray-200 rounded-large p-5 border-gray-700 border-1 text-gray-700 ">This process may take some time. You will receive a notification when your stile is avaiable </h2>
        <div className=" flex flex-col p-4 space-y-4 items-center justify-center">
                <Button className=' w-[100px] text-md text-gray-200 bg-gray-500 border-gray-200 border-2' onPress={()=>{setIsSendPopUp(false); setMode('sketch'); navigate('/')}}  >Continue </Button>
        </div>
             
    </div>
    }
     {/*parametri caricati*/}
    {!isCheckingS3.checking && isCheckingS3.completed && <div className="absolute z-20 bg-gray-300 rounded-2xl border-2 border-gray-700 shadow-2xl rounded-2xl p-2 " style={{top: 200, left: 500, width: 550}}>
        <div className=" flex flex-col items-center justify-center">
            <h1 className="text-gray-600 p-5 text-2xl font-bmedium " >Your style is Ready!</h1>
        </div>
        <div className="p-3 flex items-center justify-center">
          < FaCheck size={80}/>
        </div>
        <div className=" flex flex-col p-4 space-y-4 items-center justify-center">
                <Button className=' w-[100px] text-md text-gray-200 bg-gray-500 border-gray-200 border-2' onPress={()=>{setIsSendPopUp(false); setMode('sketch'); navigate('/')}}  >Continue </Button>
        </div>
             
    </div>
    }
        
    </>
        
    ) 
}


const LoseStyleWarning = (props) =>{

    const {setLoseStylePopUp, setMode} = props

    const navigate = useNavigate()

   return(<>
    <div className="w-full h-full absolute z-20 bg-gray-500 " style={{opacity: 0.5}}></div>
    <div className="absolute z-20 bg-gray-400 rounded-2xl border-3 border-gray-700 shadow-2xl  items-center justify-center flex flex-col p-" style={{top: 125, left: 550, width: 450}}>
        <div className="flex flex-row">
            <h1 className="text-3xl text-gray-700 p-3">Warning</h1>
            <TiWarning size={60} className="text-orange-500"/> 
            
        </div>
        <div className="bg-gray-300 rounded-b-xl ">      
            <p className="text-gray-700 p-5 text-large  text-center">
                Going back now you will lose all sketches done in this personalization section. 
            </p>
            <div className=" flex flex-col p-4 space-y-4 items-center justify-center">
                <Button className="w-[200px] text-lg text-gray-200 bg-gray-500 border-gray-200 border-2 " radius = "lg" onPress={()=>{ setLoseStylePopUp(false) }}>Stay in editing </Button>
                <Button className='w-[200px] text-lg text-gray-900 bg-gray-200 border-black border-2 ' onPress={()=>{setMode('sketch');  setLoseStylePopUp(false); navigate('/');}} >Go Back</Button>
            </div>
        </div>  
        </div></>
        
    ) 
}



export {InterfacePopup, NewUserPopUp, PersonalPopUp, FirstEditPopUp, ChooseStylePopUp, SendStylePopUp, LoseStyleWarning}