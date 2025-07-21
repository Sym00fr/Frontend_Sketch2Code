import { FaExpandArrowsAlt } from "react-icons/fa";
import { Image } from "@heroui/react"
import { Button } from "@heroui/react";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
//import LoadingGif from 'src/assets/Loading.gif';


import React, { useRef, useEffect, useState, useCallback } from 'react';

export const InterfacePreview = (props) => {

  const {setfullPreview, generatedHTML, fullScreen, loading } = props

  const iframeRef = useRef(null);
  const [iframeLoaded, setIframeLoaded] = useState(false);

  const updateIframeContent = useCallback(() => {
    if (iframeRef.current) {
      const iframe = iframeRef.current;
      const doc = iframe.contentDocument || iframe.contentWindow.document;

      // Pulisci il contenuto precedente dell'iframe
      doc.open();
      doc.write('');
      doc.close();

      // Crea il contenuto HTML completo con lo stile
      const fullHtml = `
        <!DOCTYPE html>
        <html>
        <head>
          <style>${generatedHTML.css}</style>
        </head>
        <body>
          ${generatedHTML.html}
        </body>
        </html>
      `;

      // Scrivi il nuovo contenuto nell'iframe
      doc.open();
      doc.write(fullHtml);
      doc.close();
    }
  }, [generatedHTML]);

  useEffect(() => {
    // Aggiorna il contenuto dell'iframe ogni volta che htmlCode o cssCode cambiano
    updateIframeContent();
  }, [generatedHTML, updateIframeContent]);

  const handleLoad = () => {
    setIframeLoaded(true);
    // Assicurati che il contenuto sia aggiornato anche al caricamento iniziale
    updateIframeContent();
  };

  


  return (
    <div className={fullScreen ? "w-[full] h-[full]" : "w-[50%]"   + " p-1 border-black border-2 rounded-md  bg-white  "}>

      {loading ?
    <img src={'src/assets/Loading.gif'} className="absolute" style={{top: 270, left: 1000}}/>
    : 
       <>
        <div className="absolute z-20 p-3 flex flex-row space-x-60">
                {!fullScreen && 
                <Button size = 'sm' radius="full" className="border-gray-900 border-2" onPress={()=>setfullPreview(true)}> 
                    <FaExpandArrowsAlt size={19} color="white"/>
                </Button>
                }
            </div>

      
      <iframe
        ref={iframeRef}
        title="Codice Preview"
        style={{
          width: '100%',
          height: '600px', // Puoi regolare l'altezza
          border: 'none',
          backgroundColor: 'white' // Assicurati che lo sfondo sia bianco se non specificato dal CSS
        }}
        onLoad={handleLoad}
        srcDoc={`
          <!DOCTYPE html>
          <html>
          <head>
            <style>${generatedHTML.css}</style>
          </head>
          <body>
            ${generatedHTML.html}
          </body>
          </html>
        `}
      ></iframe>
      {!iframeLoaded && <p>Caricamento anteprima...</p>} 
      </>
}
    </div>
  );
};



/*
export const InterfacePreview = (props) => {

const {setfullPreview, img, loading, generatedHTML } = props

    return(<>
        <div className="w-[50%] p-1 border-black border-2 rounded-md bg-gray-100">

            <div className="absolute z-20 p-3">
                <Button size = 'sm' radius="full" className="border-gray-900 border-2" onPress={()=>setfullPreview(true)}> 
                    <FaExpandArrowsAlt size={19} color="white"/>
                </Button>
            </div>
            {loading &&             
            <div className="absolute z-20 p-3">
                <AiOutlineLoading3Quarters className="text-black" size={100}/>
            </div>}
            {/*<Image
                alt="HeroUI hero Image"
                src={img}
                width={900}
                height={630}/>}

        </div>   
        </>)
}*/