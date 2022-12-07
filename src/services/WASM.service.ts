import LocalStorageService from './LocalStorage.service'
import { Thread } from 'react-native-threads'
import RNFS from 'react-native-fs'
import * as FileSystem from 'expo-file-system';
import {decode as atob, encode as btoa} from 'base-64'

export default class WASMService {

  public static spawnWASMThread = async (ownableType: string) => {
    console.log(`spawning ${ownableType} thread...`);

    RNFS.readDir(RNFS.DocumentDirectoryPath + `/${ownableType}`)
      .then((result) => {
        console.log(result);
        return Promise.all([RNFS.stat(result[5].path), result[5].path]);
      })
      .then((statResult) => {
        console.log("stat result: ", statResult);
        if (statResult[0].isFile()) {
          console.log('reading file ', statResult[1]);
          const file = RNFS.readFile(statResult[1], 'utf8');
          return file;
        }
        return 'no file';
      })
      .then(async (contents) => {
        console.log("File contents", contents);
        const blob = new Blob([`(${contents})()`]);
        let worker = new Worker(URL.createObjectURL(blob));
//         const byteCharacters = atob(contents);
//         const byteArrays = [];
//         const sliceSize = 512;
//
//         for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
//           const slice = byteCharacters.slice(offset, offset + sliceSize);
//
//           const byteNumbers = new Array(slice.length);
//           for (let i = 0; i < slice.length; i++) {
//             byteNumbers[i] = slice.charCodeAt(i);
//           }
//           const byteArray = new Uint8Array(byteNumbers);
//           byteArrays.push(byteArray);
//         }
//         const blob = new Blob([byteArrays.buffer], { type: `application/javascript` });
//
//         console.log("blob", blob);
//
//         const reader = new FileReader();
//         reader.addEventListener("loadend", () => {
//           console.log(reader.result);
//         });
//         reader.readAsArrayBuffer(blob);
//         const blobURL = URL.createObjectURL(blob);
//         console.log("blobURL", blobURL);
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