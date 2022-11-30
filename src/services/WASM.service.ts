import LocalStorageService from './LocalStorage.service'
import { Thread } from 'react-native-threads'
import RNFS from 'react-native-fs'

export default class WASMService {

  public static spawnWASMThread = async (ownableType: string) => {
    console.log(`spawning ${ownableType} thread...`);
    // get path to bindgen of ownableType
    const uriPath = await LocalStorageService.getData(`${ownableType}-bindgen`);
    console.log("uri path: ", uriPath);
    await RNFS.copyFile(uriPath, RNFS.DocumentDirectoryPath + `/${ownableType}-bindgen.js`);
    await LocalStorageService.storeData(`${ownableType}-bindgen`, RNFS.DocumentDirectoryPath + `/${ownableType}-bindgen.js`);

    const storedBindgenPath = await LocalStorageService.getData(`${ownableType}-bindgen`);
    console.log("stored bindgen @", storedBindgenPath);
    
    const thread = new Thread(RNFS.DocumentDirectoryPath + "/potion-bindgen.js");

//     thread.onmessage = (message) => {
//       console.log(`message from thread: ${message}`);
//     }
//     thread.postMessage('ping worker');
    //


//     const wasmArrayBuffer = await getWASMArrayBuffer(ownableType, "wasm");
//     worker.postMessage(wasmArrayBuffer, [wasmArrayBuffer]);
//     thread.onmessage = (message) => {
//       console.log(`message from thread: ${message}`);
//       setMessage(message);
//     }
  }
}