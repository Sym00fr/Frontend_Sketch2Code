
import { get_path,triggerNotebook, update_entry_add_path} from "../api/api";

async function FinetuneModelProva(setResponse, userEmail) {
     
    let res = await get_path()
   
    if (res == 'utente non trovato'){
       setResponse("Errore, l'utente non esiste nel database" )
    } 
    else if (res == 'path non trovato'){
        setResponse("L'utente non ha mai effettuato un finetuning \n Triggering notebook per il finetuning..." )

        const ok = await triggerNotebook()

        if (ok){
            setResponse(x=> x + '\n Finetuning complete ')
            //salviamo il path del finetuning nel database
            let ok = await update_entry_add_path(userEmail)
            setResponse(x=> x + `\n Peft parameters saved in ${userEmail}/peftmodel-checkpoint-local` )
        }



    } 
    else {
        setResponse("L'utente ha già effettuato un finetuning, \n parametri salvati in " + res )
        //let ok = await update_entry_delete_path(userEmail)
    }

}

export {FinetuneModelProva}