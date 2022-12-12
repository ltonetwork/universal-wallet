import RNFS from 'react-native-fs'
//import { Thread } from 'react-native-threads'

export default class WASMService {
    public static spawnWASMThread = async (ownableType: string) => {
        console.log(`spawning ${ownableType} thread...`)

        const result = await RNFS.readDir(RNFS.DocumentDirectoryPath + `/${ownableType}`)
        console.log(result)

        const jsFile = result.find(file => file.name === 'ownable.js' || file.name === `ownable_${ownableType}.js`)
        if (!jsFile) throw new Error('Package doesn\'t contain an ownable.js file')

        const statResult = await RNFS.stat(jsFile.path)
        console.log("stat result: ", statResult)

        if (!statResult.isFile()) {
            throw new Error('no file')
        }

        console.log('reading file ', jsFile.path)
        const contents = RNFS.readFile(jsFile.path, 'utf8')

        /*const thread = new Thread('worker.js')
        thread.postMessage(contents)*/
    }
}

// === Try using a worker. Code can probably be removed. ===
//
//        let worker = new Worker(URL.createObjectURL(blob))
//         const byteCharacters = atob(contents)
//         const byteArrays = []
//         const sliceSize = 512
//
//         for (let offset = 0 offset < byteCharacters.length offset += sliceSize) {
//           const slice = byteCharacters.slice(offset, offset + sliceSize)
//
//           const byteNumbers = new Array(slice.length)
//           for (let i = 0 i < slice.length i++) {
//             byteNumbers[i] = slice.charCodeAt(i)
//           }
//           const byteArray = new Uint8Array(byteNumbers)
//           byteArrays.push(byteArray)
//         }
//         const blob = new Blob([byteArrays.buffer], { type: `application/javascript` })
//
//         console.log("blob", blob)
//
//         const reader = new FileReader()
//         reader.addEventListener("loadend", () => {
//           console.log(reader.result)
//         })
//         reader.readAsArrayBuffer(blob)
//         const blobURL = URL.createObjectURL(blob)
//         console.log("blobURL", blobURL)
//        })
//        .catch((err) => {
//          console.log(err.message, err.code)
//        })

//     RNFS.readFileAssets("ownable_potion_bg.wasm", "base64")
//     .then(binary => {
//       console.log(binary)
//     })
//     .catch(console.error)
//     const wasmArrayBuffer = await getBlobFromObjectStoreAsArrayBuffer(ownableType, "wasm")
//     worker.postMessage(wasmArrayBuffer, [wasmArrayBuffer])
//  }
//}
