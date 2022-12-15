import StorageService from './Storage.service'
import { unzip } from 'react-native-zip-archive'
import RNFS from 'react-native-fs'
import {DocumentPickerResponse} from "react-native-document-picker"

const OWNABLE_PATH = RNFS.DocumentDirectoryPath + '/ownables'

export default class OwnableService {
    private static _options: {id: string, name: string}[]
    private static _issued: {id: string, option: {id: string, name: string}}[]

    private static init = async () => {
        if (typeof OwnableService._options === 'undefined') {
            OwnableService._options = await StorageService.getItem('ownable-options') || []
        }

        if (typeof OwnableService._issued === 'undefined') {
            OwnableService._issued = await StorageService.getItem('ownables') || []
        }
    }

    public static listOptions = async (): Promise<{id: string, name: string}[]> => {
        await OwnableService.init()
        return OwnableService._options
            .filter((value, index, self) => self.findIndex(v => v.id === value.id) === index)
    }

    public static getOption = async (id: string): Promise<{id: string, name: string}|undefined> => {
        await OwnableService.init()
        return OwnableService._options.find(option => option.id === id)
    }

    public static import = async (response: DocumentPickerResponse) => {
        await OwnableService.init()
        const name = response.name!.replace(/\.zip$/, '')
        const id = await RNFS.hash(response.fileCopyUri!, 'sha256')

        await RNFS.exists(OWNABLE_PATH) || await RNFS.mkdir(OWNABLE_PATH)

        if (!await RNFS.exists(`${OWNABLE_PATH}/${id}`)) {
            await unzip(`${response.fileCopyUri!}/`, `${OWNABLE_PATH}/${id}`)
        }

        if (OwnableService._options.findIndex(v => v.id === id) < 0) {
            OwnableService._options.push({id, name})
            await StorageService.setItem('ownable-options', OwnableService._options)
        }
    }

    public static getJs = async (optionId: string): Promise<string> => {
        const option = await OwnableService.getOption(optionId)
        if (!option) throw Error('No such ownable option')

        const result = await RNFS.readDir(`${OWNABLE_PATH}/${optionId}`)

        const jsFile = result.find(file => file.name === 'ownable.js' || file.name === `ownable_${option.name}.js`)
        if (!jsFile) throw new Error('Package doesn\'t contain an ownable.js file')

        return RNFS.readFile(jsFile.path, 'utf8')
    }

    public static getWasm = async (optionId: string): Promise<string> => {
        const option = await OwnableService.getOption(optionId)
        if (!option) throw Error('No such ownable option')

        const result = await RNFS.readDir(`${OWNABLE_PATH}/${optionId}`)

        const jsFile = result.find(file => file.name === 'ownable_bg.wasm' || file.name === `ownable_${option.name}_bg.wasm`)
        if (!jsFile) throw new Error('Package doesn\'t contain an ownable_bg.wasm file')

        return RNFS.readFile(jsFile.path, 'base64')
    }

    public static issue = async (optionId: string) => {
        const option = await OwnableService.getOption(optionId)
        if (!option) throw Error('No such ownable option')

        OwnableService._issued.push({id: (Math.random() + 1).toString(36).substring(7), option})
        StorageService.setItem('ownables', OwnableService._issued)
    }

    public static list = async (): Promise<{id: string, option: {id: string, name: string}}[]> => {
        await OwnableService.init()
        return OwnableService._issued
    }
}
