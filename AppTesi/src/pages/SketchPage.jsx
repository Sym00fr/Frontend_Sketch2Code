
import { UpperBar } from "../components/UpperBar"
import { LowerBar } from "../components/LowerBar"
import { InterfacePreview } from "../components/interfacePreview";
import { InterfacePopup, NewUserPopUp, PersonalPopUp, ChooseStylePopUp } from "../components/interfacePopUp";
import SimpleCanvas from "../components/SimpleCanvas";
import { callOpenAIapi, parseApiResponse } from "../api/OpenAI_api";
import { sketchToUpload } from "../assets/SktechURL_to_Upload";


//import { postPrompt, get_path, create_entry, GetAllUsers, GetUserFromDb } from "../api/api";


import { useRef, useState, useEffect } from "react";
import { html } from "framer-motion/client";
import { isGraphQLScalarType } from "aws-amplify/datastore";

export const SketchPage = (props) => {

  const screenWidth = window.innerWidth;
  const screenHeight = window.innerHeight;

  //console.log(screenWidth);
  //console.log(screenHeight);

  const {signOut, email, mode, setMode,  userParametersPath, 
    userType,  firstUsePopUp, setFirstUsePopUp, style, setStyle, personalPopUp, setPersonalPopup,
  firstPopUp, setFirstPopUp } = props

 //const [style, setStyle] = useState('default');

  const [canvasOnTheLeft, setCanvasOnTheLeft] = useState(true)
  const [fullPreview, setfullPreview] = useState(false)

  //const [userType, setUserType] = useState('advanced')  //'absent': non presente nel database,  'new': no parametri salvati, 'advanced,: parametri salvati
  //const [defaultVersion, setDefaultVersion] = useState(false)
  //const [firstUsePopUp, setFirstUsePopUp] = useState(false)
  //const [personalPopUp, setPersonalPopup] = useState(false)
  const [chooseStylePopUp, setChooseStylePopUp] = useState(false);

  //const [userParametersPath, setUserParametersPath] = useState('');
  const [savedImage, setSavedImage] = useState();

  const [loading, setLoading] = useState(false);

  const canvasBoardRef = useRef(null); // Crea un ref

    //stati per undo/redo e cronologia
  const [history, setHistory] = useState([]);
  const [historyPointer, setHistoryPointer] = useState(-1); // for one page

  //stati generated interface
  const [generatedHTML, setGeneratedHtml] = useState({html: '', css: ''});

  //stati per la barra degli strumenti
  const [draggablePosition, setDraggablePosition] = useState({x: 10, y:10})

  const [isGenerated, setIsGenerated] = useState(false);


  //const [img, setImg] = useState(`url("/src/assets/sample_${1}.png")`);

  const stringToArray = (inputString) => {
  const content = inputString.slice(1, -1);
  return paths;
  
}
    
  /*useEffect(()=>{
    //controlliamo se l'utente è in database
    const checkDB = async(usermail)  => {
      const user  =  await GetUserFromDb(usermail)
      if (user == false){
        console.log("utente non in database")
        setUserType('absent');
        setFirstUsePopUp(true);
        SetFirstUse(true)
        //aggiungiamo l'utent al database
        const res2 =  await create_entry(usermail);
        //console.log("utente aggiunto al db");        
      }
      else {
        //console.log("utente già in db")

        ///controlliamo se ha dei parametri già salvati
        let parametersPath = await get_path(usermail)  //prende l'user email internamente, non serve passarglielo, ritorna null se l'utente non esiste (controllo ridondante), false se non c'è path
        if (parametersPath !=false){
          console.log(parametersPath)
          setUserParametersPath(stringToArray(parametersPath));

          setUserType('advanced');
          setStyle('default');

        }
        else{
          //console.log("Nessun parametro salvato")
          setUserType('new');
          setPersonalPopup(true);
          SetFirstUse(true)
          setStyle('default');

        }
      }
    }
   
    setMode('sketch');
    checkDB(email)
    //canvasBoardRef.current.loadImg(sketchToUpload)

  }, [])*/

  useEffect(()=>{
    loadCanvas();
    console.log(userParametersPath);
    //console.log(userParametersPath.length);
  }, [canvasOnTheLeft])


  const saveCanvas = () =>{
    const currentCanvasData = canvasBoardRef.current.exportImgDataURL();
    setSavedImage(currentCanvasData)
  }

  const loadCanvas = () => {
   canvasBoardRef.current.loadImg(savedImage)
  }

  const generate = async () =>{
    
    //const currentCanvasData = canvasBoardRef.current.exportImgDataURL();
    setLoading(true);

    //console.log(res);

    canvasBoardRef.current.loadImg(sketchToUpload);

    //per ora manda sketchToUpload
    //const res = await callOpenAIapi(sketchToUpload);

    const currentCanvasData = canvasBoardRef.current.exportImgDataURL();
    const res = await callOpenAIapi(sketchToUpload);

    const [htmlCode, CssCode] = parseApiResponse(res);

    setLoading(false);

    setGeneratedHtml({html: htmlCode, css: CssCode});

    setIsGenerated(true);

    

  }


  

    

    return(
    <div className= " w-full h-screen flex flex-col bg-header bg-gray-100"  >
      
        <UpperBar style = {style} user = {email} signOut = {signOut} userType = {userType}  mode = {mode} setMode = {setMode} 
                  userParametersPath={userParametersPath} setChooseStylePopUp = {setChooseStylePopUp} setStyle= {setStyle}/>

        <LowerBar setLeftCanvas = {setCanvasOnTheLeft}  canvasOnTheLeft = {canvasOnTheLeft} saveCanvas={saveCanvas} 
           stylePath = {style} generate = {generate} isGenerated = {isGenerated}/>

        {canvasOnTheLeft ? 
        <div className=" bg-gray-600 flex flex-row w-full h-full">
          <SimpleCanvas ref={canvasBoardRef} canvasOnTheLeft = {canvasOnTheLeft}
           w = {screenWidth/2 -4} h={screenHeight-103} percentWidth = {50} isImageBackgrounds = {false} page={1} 
           draggablePosition = {draggablePosition} setDraggablePosition = {setDraggablePosition}
          history = {history} setHistory = {setHistory} historyPointer = {historyPointer} setHistoryPointer ={setHistoryPointer}/>          
          <InterfacePreview setfullPreview = {setfullPreview}  generatedHTML = {generatedHTML} fullScreen = {false} loading = {loading}/>
        </div> 
        :
        <div className=" bg-gray-600 flex flex-row w-full h-full">
         <InterfacePreview setfullPreview = {setfullPreview} generatedHTML = {generatedHTML} fullScreen = {false} loading = {loading}/>
         <SimpleCanvas ref={canvasBoardRef} canvasOnTheLeft = {canvasOnTheLeft} 
         w = {screenWidth/2 -4} h={screenHeight-103} percentWidth = {50} isImageBackgrounds = {false} page={1}
         draggablePosition = {draggablePosition} setDraggablePosition = {setDraggablePosition}
         history = {history} setHistory = {setHistory} historyPointer = {historyPointer} setHistoryPointer ={setHistoryPointer}/>
        </div>}

        {fullPreview && <InterfacePopup  setfullPreview = {setfullPreview} generatedHTML = {generatedHTML} /> }

        {firstUsePopUp && firstPopUp && <NewUserPopUp setFirstUsePopUp = {setFirstUsePopUp} setFirstPopUp = {setFirstPopUp} setStyle = {setStyle}  setMode = {setMode}/>}

        {personalPopUp && firstPopUp && <PersonalPopUp setPersonalPopup = {setPersonalPopup} setFirstPopUp = {setFirstPopUp} setStyle = {setStyle} setMode = {setMode}/>}

        {/*chooseStylePopUp && <ChooseStylePopUp setChooseStylePopUp = {setChooseStylePopUp} userParametersPath = {userParametersPath} setStyle= {setStyle}/>*/}



    </div>
)
}