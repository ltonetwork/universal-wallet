import LocalStorageService from './LocalStorage.service'
import { Thread } from 'react-native-threads'
import RNFS from 'react-native-fs'
import * as FileSystem from 'expo-file-system';

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

    RNFS.readDir(RNFS.DocumentDirectoryPath + `/${ownableType}`)
      .then((result) => {
        console.log(result);
        return Promise.all([RNFS.stat(result[5].path), result[5].path]);
      })
      .then((statResult) => {
        console.log("stat result: ", statResult);
        if (statResult[0].isFile()) {
          const file = RNFS.readFile(statResult[1], 'base64');
          return file;
        }
        return 'no file';
      })
      .then(async (contents) => {
        console.log("File contents", contents);
//            let blob = await fetch(`file://${contents.path}`).blob()

//         let fr = new FileReader();
//         fr.onload = (f) => {
//           console.log("fr read file ", f);
//         }
//         fr.readAsText(contents);
//         let wasm = await fetch("./ownable_potion_bg.wasm");
//         const prefix = "data:text/javascript;base64,";
//         const fileSrc = prefix + contents;
//
//         const byteNumbers = new Array(fileSrc.length);
//         for (let i = 0; i < fileSrc.length; i++) {
//             byteNumbers[i] = fileSrc.charCodeAt(i);
//         }
//         const byteArray = new Uint8Array(byteNumbers);
//         const blob = new Blob([byteArray], {type: 'application/javascript'});
//
//         console.log(fileSrc);
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