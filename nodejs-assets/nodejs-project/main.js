// Rename this sample file to main.js to use on your project.
// The main.js file will be overwritten in updates/reinstalls.

var rn_bridge = require('rn-bridge');
const path = require('path');
const keyFilename = path.join(__dirname, 'foodit-e5ede-231116db6ea6.json');

async function textDetection (filePath) {

  const vision = require('@google-cloud/vision');

  // Creates a client
  const client = new vision.ImageAnnotatorClient({keyFilename});

  /**
   * TODO(developer): Uncomment the following line before running the sample.
   */
  // const fileName = 'Local image file, e.g. /path/to/image.png';

  // Performs text detection on the local file
  const [result] = await client.textDetection(filePath);
  const detections = result.textAnnotations;
  return detections;
}


// Async function to utilize Google Cloud Natural Language API to extract entities from text document
async function dateExtract (text) {
        
  const language = require('@google-cloud/language');
  
  const client = new language.LanguageServiceClient({keyFilename});
  
  const document = {
      content: text,
      type: 'PLAIN_TEXT'
  }
  
  const [result] = await client.analyzeEntities({document});
  
  const entities = result.entities;
  const date = entities.filter((entity) => {
    return entity.type == 'DATE'
    }).map((entity) =>  {
    return entity.name
    });

    return date;
}


// Echo every message received from react-native.
rn_bridge.channel.on('message', (msg) => {
    // textDetection(msg).then(detectedText => {
    //     dateExtract(detectedText[0].description).then(response => {
    //       rn_bridge.channel.send(response[0]);
    //     }
    //   ).catch(err => {
    //     rn_bridge.channel.send(`${err}`);
    //   })
    // }).catch(err => {
    //   rn_bridge.channel.send(`${err}`);
    // })
    dateExtract(msg).then(response => {
      rn_bridge.channel.send(response[0]);
    }).catch(err => console.log(err));
  // rn_bridge.channel.send(`hey ${msg}`);
});

// Inform react-native node is initialized.
rn_bridge.channel.send(__dirname);


