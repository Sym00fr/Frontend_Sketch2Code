//import fetch from 'node-fetch';
import { getCurrentUser } from "aws-amplify/auth";
import { client } from "./api-client";
import { listUsers, getUser } from "../graphql/queries";
import { createUser, updateUser } from "../graphql/mutations";
//import { uploadData } from 'aws-amplify/storage';


/*import fs from 'fs' //file stream
import dotenv from 'dotenv'

import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

dotenv.config()

//const accesKey = process.env.AWS_ACCESS_KEY_ID
//const secretaAccesKey = process.env.AWS_SECRET_ACCESS_KEY

const client = new S3Client();
const filestream = fs.createReadStream("nome_file");

const input = { //putObject Request
Bucket : "finetuning-data-bucket",
Key: "STRING_VALUE",  //nome del file da uplodare
Body: filestream
};


 const command = new PutObjectCommand(input);
 const response = await client.send(command);*/


const postPrompt = async (text) => {
    console.log(text);
    const requestOptions = {
        method: 'POST',
        headers: { 
            'Content-Type': 'application/json',
        },
        mode: "cors",
        credentials: "same-origin",
        body: JSON.stringify({"inputs": text })
    };

    try {
        const response = await fetch('https://ucrc2022r2.execute-api.eu-north-1.amazonaws.com/dev/prova', requestOptions);
        const data = await response.json();
        console.log(data);
    } catch (error) {
        console.error('Error:', error);
    }
};

const triggerNotebook = async(email) =>{

    //const email = (await getCurrentUser()).signInDetails.loginId

    console.log("triggering notebook for user " + email);

    const requestOptions = {
        method: 'POST',
        headers: { 
            'Content-Type': 'application/json',
        },
        mode: "cors",
        credentials: "same-origin",
        body: JSON.stringify({
            "input_path": "path dei dati su cui fare il finetuning",
            "output_path": email
         })
    };

    try {
        const response = await fetch('https://ucrc2022r2.execute-api.eu-north-1.amazonaws.com/dev/prova', requestOptions);
        const data = await response.json();
        console.log(data);
        return data

    } catch (error) {
        console.error('Error:', error);
        return false
    }
}


const create_entry = async(email) =>{

    const result = await client.graphql({
        
        query: createUser,
        variables: {
          input: {
            userEmail: email,
            //finetuningParametersPath : "prova/prova"
          }
        }
      });

}

const GetAllUsers = async() =>{
    const result = await client.graphql({ query: listUsers });
    console.log(result);
}

const GetUserFromDb = async(email) =>{
    const result = await client.graphql({
        query: getUser,
        variables : {
           userEmail : email
        },
        });

   if (result.data.getUser == null){
    console.log("non trovato")
    return false
   }
   else{
    console.log(result.data.getUser.userEmail);
    return result.data.getUser
   }

   
}
//ritorna null se l'utente non esiste, false se non c'è path
const get_path = async(email) => {

    //const email = (await getCurrentUser()).signInDetails.loginId

    const result = await client.graphql({
         query: getUser,
         variables : {
            userEmail : email//'prova1@prova.com'
         },
         });

        if (result.data.getUser == null){
            //console.log("utente non trovato")
            console.log("utente non trovato (nella get_path)");
            return null;
        }
        else{
            if (result.data.getUser.finetuningParametersPath == null){
                console.log("path non trovato (nella get_path")
                return false;
            }
            else return result.data.getUser.finetuningParametersPath;
        }

}

const update_entry_add_path = async(email) => {
    let path = `${email}/peftmodel-checkpoint-local-1`
    let path2 = `${email}/peftmodel-checkpoint-local-2`
    let path3 = `${email}/peftmodel-checkpoint-local-3`

    const pathArray = [path, path2, path3];

    console.log('updating user: ' + email + ' with path: ' + pathArray)

    const result = await client.graphql({
        query: updateUser,
        variables: {
          input: {
            userEmail: email,
            finetuningParametersPath:  [path, path2, path3]
          }
        }
      });
      console.log(result);
}

const update_entry_delete_path = async(email) => {  //for test
    let path = `${email}/peftmodel-checkpoint-local`

    const result = await client.graphql({
        query: updateUser,
        variables: {
          input: {
            userEmail: email,
            finetuningParametersPath:  null
          }
        }
      });
      console.log(result);
}

/*function dataURLtoBlob(dataurl) {
    var arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
    while(n--){
        u8arr[n] = bstr.charCodeAt(n);
    }
    return new Blob([u8arr], {type:mime});
}*/

  const dataURLtoBlob = (dataurl) => {
    const arr = dataurl.split(',');
    const mime = arr[0].match(/:(.*?);/)[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new Blob([u8arr], { type: mime });
  };



async function UploadSketchesOnS3(sketchesDataUrl, email, styleName) {  // formato in image/png
  
    let i=0;
    for (const sketch of sketchesDataUrl){
        if(i!=0){  //saltiamo il primo perchè è undefined
        const fileName = `users-sketches-for-finetuning0f38f-dev/${email}/${styleName}/sketch_${i}`; // Percorso e nome del file su S3
        const fileType = 'image/png';

        //console.log(sketch);
        //console.log(fileName)
        const b = dataURLtoBlob(sketch);
        //console.log(b);

        try {
            const result = await uploadData({
                path: fileName, 
                // Alternatively, path: ({identityId}) => `protected/${identityId}/album/2024/1.jpg`
                data: b,
                options: {}
        }).result
            console.log('Succeeded: ', result);
            } catch (error) {
            console.log('Error : ', error);
            }
        }   
        i++;  
    }

  };






export {postPrompt, get_path, triggerNotebook, create_entry, GetAllUsers, GetUserFromDb, update_entry_add_path, update_entry_delete_path, UploadSketchesOnS3 }

