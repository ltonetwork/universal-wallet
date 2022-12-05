import LocalStorageService from './LocalStorage.service'
import { Thread } from 'react-native-threads'
import RNFS from 'react-native-fs'

export default class WASMService {

  public static spawnWASMThread = async (ownableType: string) => {
    console.log(`spawning ${ownableType} thread...`);
//     // get path to bindgen of ownableType
//     const uriPath = await LocalStorageService.getData(`${ownableType}-bindgen`);
//     console.log("uri path: ", uriPath);
//     await RNFS.copyFile(uriPath, RNFS.DocumentDirectoryPath + `/${ownableType}-bindgen.js`);
//     await LocalStorageService.storeData(`${ownableType}-bindgen`, RNFS.DocumentDirectoryPath + `/${ownableType}-bindgen.js`);
//
//     const storedBindgenPath = await LocalStorageService.getData(`${ownableType}-bindgen`);
//     console.log("stored bindgen @", storedBindgenPath);
//     const threadSourceDir =  RNFS.DocumentDirectoryPath + `/${ownableType}/bindgen.js`;
//     console.log("target thread dir: ", threadSourceDir);

    const thread = new Thread("./ownable_potion.js");

    thread.onmessage = (event) => {
      console.log("msg from worker:", event);
    };
    thread.onerror = (err) => console.error(err);
    thread.onmessageerror = (err) => console.error(err);

    RNFS.readDir(RNFS.DocumentDirectoryPath)
      .then((result) => {
        return Promise.all([RNFS.stat(result[0].path), result[0].path]);
      })
      .then((statResult) => {
        if (statResult[0].isFile()) {
          return RNFS.readFile(statResult[1], 'utf8');
        }
        return 'no file';
      })
      .then((contents) => {
        console.log(contents);
      })
      .catch((err) => {
        console.log(err.message, err.code);
      });

//     RNFS.readFileAssets("ownable_potion_bg.wasm", "base64")
//     .then(binary => {
//       console.log(binary);
//     })
//     .catch(console.error)
//     const wasmArrayBuffer = await getBlobFromObjectStoreAsArrayBuffer(ownableType, "wasm");
//     worker.postMessage(wasmArrayBuffer, [wasmArrayBuffer]);
  }
}