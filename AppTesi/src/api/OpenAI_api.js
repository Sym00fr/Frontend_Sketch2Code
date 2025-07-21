import { sketchToUpload } from "../assets/SktechURL_to_Upload";

const modelResponse = `Ecco un esempio di codice HTML e CSS basato sullo sketch dell'interfaccia web. Questo è un esempio basilare e potrebbe essere necessario adattarlo ulteriormente per corrispondere esattamente al design desiderato:

### HTML

---html
<!DOCTYPE html>
<html lang="it">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Interfaccia Web</title>
    <link rel="stylesheet" href="styles.css">
</head>
<body>
    <div class="navbar">
        <div class="logo">Nome</div>
    </div>

    <div class="search-bar">
        <input type="text" placeholder="Cerca...">
    </div>

    <div class="actions">
        <div class="action-item">
            <div class="icon arrow-up"></div>
            <div class="text">Close</div>
        </div>
        <div class="action-item">
            <div class="icon play"></div>
            <div class="text">Remove</div>
            <div class="text">Close</div>
        </div>
        <div class="action-item">
            <div class="icon placeholder"></div>
            <div class="text">Tabs</div>
            <div class="text">Close</div>
        </div>
    </div>

    <div class="footer">
        <button>Share Code: jui9tan</button>
        <button>Another Action</button>
    </div>
</body>
</html>
---

### CSS

---css
body {
    font-family: Arial, sans-serif;
    margin: 0;
    padding: 0;
}

.navbar {
    background-color: #ccc;
    padding: 10px;
    text-align: left;
}

.logo {
    font-weight: bold;
    font-size: 24px;
}

.search-bar {
    padding: 10px;
}

.search-bar input {
    width: calc(100% - 20px);
    padding: 5px;
    font-size: 16px;
}

.actions {
    display: flex;
    justify-content: space-around;
    margin-top: 20px;
}

.action-item {
    text-align: center;
}

.icon {
    width: 50px;
    height: 50px;
    margin: 0 auto;
    background-color: #eee;
    margin-bottom: 10px;
}

.arrow-up {
    background-image: url('arrow-up-icon.png'); /* Usa un'icona appropriata */
    background-size: cover;
}

.play {
    background-image: url('play-icon.png'); /* Usa un'icona appropriata */
    background-size: cover;
}

.placeholder {
    background-image: url('placeholder-icon.png'); /* Usa un'icona appropriata */
    background-size: cover;
}

.footer {
    margin-top: 20px;
    text-align: center;
}

.footer button {
    margin: 0 5px;
    padding: 5px 10px;
    font-size: 16px;
}
---

Nota: Gli URL delle immagini nelle classi -.arrow-up-, -.play- e -.placeholder- devono essere sostituiti con 
i percorsi reali delle icone desiderate. Le icone possono essere icone vettoriali SVG o immagini che corrispondono 
al design che stai cercando di ottenere.`


/*async function callOpenAIapi() {
    console.log("calling the api");

    const reqBody = {
        "prompt" : "Questo è uno sketch di un'interfaccia web. Genera l'HTML e CSS per implementarla",
        "model" : "gpt-image-1",
        "image" : "src/assets/designer_0.png",
    }

    await fetch("https://api.openai.com/v1/images/edits", {
        method: "POST",
        headers: {
            "Content-Type": "text",
            "Authorization" : "Bearer " + API_KEY
        },
        body: JSON.stringify(reqBody)
    }).then((data)=>{
        return data.json();
    }).then((jsondata)=>{
        console.log(jsondata)
    });

}

export {callOpenAIapi}*/


//const fs = require('fs');
//const fetch = require('node-fetch'); // Se usi Node <18

async function callOpenAIapi(imageURL) {
  // Leggi e codifica l'immagine in base64
  //const imageBuffer = fs.readFileSync(imagePath);
  //const base64Image = imageBuffer.toString('base64');

  //const imageURL = sketchToUpload;

  const requestBody = {
    model: "gpt-4o",
    messages: [
      {
        role: "user",
        content: [
          {
            type: "text",
            text: "Questo è uno sketch di un'interfaccia web. Genera il codice HTML e CSS per realizzarla."
          },
          {
            type: "image_url",
            image_url: {
              //url: `data:image/png;base64,${base64Image}`
              url:  `${imageURL}`
            }
          }
        ]
      }
    ],
    max_tokens: 2000
  };

  console.log("connecting to endpoint...");

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${API_KEY}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify(requestBody)
  });

  console.log("analyzing response");

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`API error ${response.status}: ${errorText}`);
  }

  console.log("response ok");

  const data = await response.json();
  return data.choices[0].message.content;
}




const parseApiResponse = (response) =>{
  
  //const stringa = modelResponse.replaceAll('`', "-");
  const stringa = response.replaceAll('`', "-");


  //console.log(prova);

  const firstIndex = stringa.indexOf('<html lang="it">') + 16;
  const secondIndex = stringa.indexOf('</html>') -1;

  let slicehtml = stringa.slice(firstIndex, secondIndex)
  console.log(slicehtml);

  const firstIndexCss = stringa.indexOf('---css') + 6;
  const secondIndexCss = stringa.indexOf('}\n---')+1;

  let sliceCss = stringa.slice(firstIndexCss, secondIndexCss)
  console.log(sliceCss);

  return [slicehtml, sliceCss];




}

export {callOpenAIapi, parseApiResponse}