

import {Button, ButtonGroup, Textarea, Card, CardHeader, CardBody, CardFooter, Chip, Divider} from "@heroui/react";
import { update_entry_add_path } from "../api/api";
import { callOpenAIapi } from "../api/OpenAI_api";
import { listObjectOnS3 } from "../api/api_S3";

import { useState, useEffect } from "react";

//import API from 'aws-amplify'

import { post } from 'aws-amplify/api';
import { postPrompt, get_path, create_entry, GetAllUsers, GetUserFromDb, update_entry_delete_path } from "../api/api";
import { FinetuneModelProva } from "../api/functions";


export const TestPage = (props) => {

const {signOut, email} = props

const color = "bg-slate-400"

const [TexPrompt, setTextPrompt] = useState("")
const [TexPromptDB, setTextPromptDB] = useState("")
const [Response, setResponse] = useState("")
 

useEffect( ()=> {

  const updateDB = async(usermail)  => {

    const user  =  await GetUserFromDb(usermail)

    if (user == false){

      console.log("utente non in database \n aggiornando db...")
     
      const res2 =  await create_entry(usermail);

      console.log("utente aggiunto al db")
    }
    else {
      console.log("utente già in db")
    }
  }

  updateDB(email)

}, [])
     
    return (
        <div className= {" w-full h-screen flex flex-col bg-header " + color} >
    
          <div className="w-full h-1/5 flex flex-row">

             <div className=" w-full text-2xl text-center text-gray-100 p-10"> TESI SKETCH TO CODE </div>
           
              <div className="w-55  bg-gray-400 py-1 px-1">
                <Card>
                    <CardHeader>{email}</CardHeader>
                    <CardBody>
                       <Button className="justify-center " onPress={signOut}>Log Out</Button>
                    </CardBody>
                </Card>
              </div>
          </div>

          <Divider className="my-4" />

          <div className="w-full h-full flex flex-row ">

            <div className=" flex flex-col w-1/2">
              <div>
              <Button size="lg" radius="lg" className="m-5" onPress={()=>FinetuneModelProva(setResponse, email)}>Finetune Model</Button>
              <Textarea className="m-5 max-w-2xl h-48" label="Your prompt" placeholder="Enter your prompt" onChange={(event) => {setTextPrompt(event.target.value);}}/>

            </div>

  
              <div>
              <Button size="lg" radius="lg" className="m-5" onPress={()=>listObjectOnS3("public/prova2@prova.com/style_ciaooo/params")}>Check s3 files </Button>
            </div>

            <div>
              <Button size="lg" radius="lg" className="m-5" onPress={()=>update_entry_add_path(email)}>Aggiorna Db</Button>
            </div>

            <div>
              <Button size="lg" radius="lg" className="m-5" onPress={()=>update_entry_delete_path(email)}>Elimina path per user</Button>

            </div>

            <div>
              <Button size="lg" radius="lg" className="m-5" onPress={()=>callOpenAIapi()}>Call OpenAi API</Button>
              
            </div>
            </div>

            <Divider orientation="vertical" />

            <div  className=" w-1/2 p-5">
              <Card >
                <CardHeader>Model response</CardHeader>
                <CardBody className="h-48">
                 {Response}
                </CardBody>
              </Card>
            </div>

          </div>
            
        </div>
    
    );

}