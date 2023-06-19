import { unzip } from 'react-native-zip-archive'
import RNFS from 'react-native-fs'
import {DocumentPickerResponse} from "react-native-document-picker"
import {Binary, EventChain} from "@ltonetwork/lto"
import PackageService from "../Ownables/Package.service"
import EventChainService from "../Ownables/EventChain.service"
import {TypedPackage} from "../../interfaces/TypedPackage"

const TEMP_PATH = RNFS.DocumentDirectoryPath + '/temp'

type FileEntry = { name: string; read: () => Promise<Uint8Array> }
export type StateDump = Array<[ArrayLike<number>, ArrayLike<number>]>

export default class OwnableService {
    private static async listFiles(path: string, folder?: string): Promise<FileEntry[]> {
        const result = await RNFS.readDir(path);

        return (await Promise.all(result.map(file => file.isDirectory() ?
            (this.listFiles(file.path, (folder ? `${folder}/`: '') + file.name)) :
            Promise.resolve([{
                name: (folder ? `${folder}/`: '') + file.name,
                read: () => RNFS.readFile(file.path, 'base64').then(contents => Binary.fromBase64(contents))
            }])
        ))).flat();
    }

    public static list = async (): Promise<{chain: EventChain, package: TypedPackage}[]> => {
        const chains = await EventChainService.loadAll();
        const promises = chains.map(async ({ chain, package: packageCid }) => ({ chain, package: await PackageService.info(packageCid) }))

        return Promise.all(promises)
    }

    public static import = async (response: DocumentPickerResponse) => {
        const id = await RNFS.hash(response.fileCopyUri!, 'sha256')

        await RNFS.exists(TEMP_PATH) || await RNFS.mkdir(TEMP_PATH)

        if (await RNFS.exists(`${TEMP_PATH}/${id}`)) {
            throw new Error("Same package imported twice")
        }

        const path = await unzip(`${response.fileCopyUri!}/`, `${TEMP_PATH}/${id}`)

        try {
            const chain = await this.extractChain(path)

            const files = await this.listFiles(path)
            const cid: string = Math.random().toString(36).slice(2, 7); // TODO: generate CID

            await PackageService.store(cid, `${TEMP_PATH}/${id}`)
            await EventChainService.init(chain, cid);
        } finally {
            await RNFS.unlink(path)
        }
    }

    public static extractChain = async (path: string): Promise<EventChain> => {
        if (!await RNFS.exists(`${path}/chain.json`)) {
            throw new Error("Ownable package doesn't contain a chain.json file")
        }

        const contents = await RNFS.readFile(`${path}/chain.json`, 'utf8')

        await RNFS.unlink(`${path}/chain.json`)

        return EventChain.from(JSON.parse(contents));
    }
}
