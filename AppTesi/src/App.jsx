import { useState, useEffect } from 'react'
import { TestPage } from "./pages/TestPage";
import { SketchPage } from './pages/SketchPage';
import { EditStylePage } from './pages/editStylePage';
import { EditStylePage2 } from './pages/editStylePage2';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { postPrompt, get_path, create_entry, GetAllUsers, GetUserFromDb, update_entry_add_path } from "./api/api";
import { listObjectOnS3 } from './api/api_S3';

//import './App.css'

import { withAuthenticator } from '@aws-amplify/ui-react';

//amplify push per pushare i cambiamenti sul cloud
//npm run dev to launch
function App({ signOut, user }) { //signOut e user sono dati dal componente withAuthenticator

  //const email = user.signInDetails.loginId;
  const email = "prova2@prova.com";

  const [firstUse, SetFirstUse] = useState(false)
  const [mode, setMode] = useState('sketch') //mode are sketch and editing

  const [userParametersPath, setUserParametersPath] = useState([]);
  const [userType, setUserType] = useState('advanced')  //'absent': non presente nel database,  'new': no parametri salvati, 'advanced,: parametri salvati
  const [firstUsePopUp, setFirstUsePopUp] = useState(false);

  const [style, setStyle] = useState('default');

  const [personalPopUp, setPersonalPopup] = useState(false);

  const [firstPopUp, setFirstPopUp] = useState(true);

  const [isCheckingS3, setIsCheckingS3] = useState({checking: false, path: '', completed: false})

  



    useEffect(()=>{
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
          console.log("utente aggiunto al db");        
        }
        else {
          console.log("utente già in db")
  
          ///controlliamo se ha dei parametri già salvati
          let parametersPath = await get_path(usermail)  //prende l'user email internamente, non serve passarglielo, ritorna null se l'utente non esiste (controllo ridondante), false se non c'è path
          if (parametersPath !=false){
            console.log(parametersPath)
            //setUserParametersPath(stringToArray(parametersPath));  //è gia un array
            setUserParametersPath(parametersPath);
            setUserType('advanced');
            setStyle('default');
  
          }
          else{
            console.log("Nessun parametro salvato")
            setUserType('new');
            setPersonalPopup(false);
            SetFirstUse(true)
            setStyle('default');
  
          }
        }
      }
     
      setMode('sketch');
      checkDB(email)
  
    }, [isCheckingS3])

    useEffect(()=>{

      let S3Interval;
      
      const funct = async () =>{

        let resS3 = await listObjectOnS3(isCheckingS3.path);
        console.log('nella useEffect' + resS3);

        if(resS3.length>0){
          //parametri caricati, fermiamo il check
          clearInterval(S3Interval);
          console.log('Parametri caricati');

          //aggiungiamo il path al database
          console.log('Path aggiunto al database');
          update_entry_add_path(email, [...userParametersPath, isCheckingS3.path])
          

          //fermiamo il check
          setIsCheckingS3({checking: false, path: '', completed: true})
          }
      }

      if(isCheckingS3.checking){
        //cicilicamente controlliamo se i parametri sono stati aggiunti
        S3Interval = setInterval(funct, 30000); //ogni 30 secondi
      }
    },[isCheckingS3])

//per avere l'user in un'altro file, usiamo getCurrentUser()  -> import { getCurrentUser } from "aws-amplifyAuth"
//console.log(user)
  return (
    <BrowserRouter>

            <Routes>               
                <Route path="/test" element={<TestPage signOut={signOut} email = {email}/>} /> 
                
                <Route path="/" element={<SketchPage signOut={signOut} email = {email} mode = {mode} setMode = {setMode} 
                       userParametersPath = {userParametersPath}  userType = {userType}  firstUsePopUp = {firstUsePopUp} setFirstUsePopUp = {setFirstUsePopUp}
                      style = {style} setStyle = {setStyle} personalPopUp = {personalPopUp} setPersonalPopup = {setPersonalPopup} 
                      firstPopUp = {firstPopUp} setFirstPopUp = {setFirstPopUp} isCheckingS3 = {isCheckingS3} setIsCheckingS3 =  {setIsCheckingS3}/>} />  
                
                <Route path="/edit" element={<EditStylePage signOut={signOut} email = {email} firstUse = {firstUse} SetFirstUse = {SetFirstUse}  
                       mode = {mode} setMode = {setMode} setUserParametersPath = {setUserParametersPath} userParametersPath = {userParametersPath} 
                       firstPopUp = {firstPopUp} setFirstPopUp = {setFirstPopUp} setIsCheckingS3 =  {setIsCheckingS3} isCheckingS3 = {isCheckingS3}/>} />
                
                <Route path="/editProva" element={<EditStylePage2 signOut={signOut} email = {email}/>} />      
            </Routes>

        </BrowserRouter>
    
  )
}

export default withAuthenticator(App)
