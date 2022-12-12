import LocalStorageService from './LocalStorage.service'
import { unzip } from 'react-native-zip-archive'
import RNFS from 'react-native-fs'
import RNFetchBlob from "rn-fetch-blob"
import {DocumentPickerResponse} from "react-native-document-picker"

export default class PackageService {

    public static getOwnableOptions = async() => LocalStorageService.getData('ownable-options')

    public static importOwnable = async (documentPickerResponse: DocumentPickerResponse) => {
        const name = documentPickerResponse.name!
        const nameNoExtension = name.substring(0, name.indexOf('.zip'))
        const fileCopyUri = documentPickerResponse.fileCopyUri!
        const ownableTargetUri = `${fileCopyUri.substring(0, fileCopyUri.indexOf(name))}${nameNoExtension}/`

        const targetPath = RNFS.DocumentDirectoryPath + `/${nameNoExtension}`

        await unzip(`${fileCopyUri}/`, targetPath)

        const directoryFiles = await RNFS.readDir(targetPath)
        for (const file of directoryFiles) {
            await LocalStorageService.storeData(file.name, file)
            if (file.name.endsWith(".js")) {
                RNFetchBlob.fs.stat(file.path)
                    .then((stats) => console.log(stats))
                    .catch((err) => {})

                await LocalStorageService.storeData(`${nameNoExtension}-bindgen`, file.path)
            }
        }
        console.log(`unzip completed at ${targetPath}`)

        try {
            await PackageService.addOwnableOption(nameNoExtension)
        } catch (error) {
            console.error(`\n\n unzip failed at ${targetPath} \n\n`)
            console.error(error)
        }
    }

    public static addOwnableOption = async (ownableName: string) => {
        const ownableOptions: {name: string}[] = (await LocalStorageService.getData('ownable-options')) || []

        if (!ownableOptions.find(option => option.name === ownableName)) {
            const ownableOption = { 'name': ownableName, 'id': ownableOptions.length }
            console.log("ownable option: ", ownableOption)
            ownableOptions.push(ownableOption)
            await LocalStorageService.storeData('ownable-options', ownableOptions)
        } else {
            console.log("Ownable option already exists")
        }
    }
}
