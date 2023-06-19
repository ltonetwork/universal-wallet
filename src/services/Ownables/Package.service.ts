import {TypedPackageCapabilities, TypedPackage} from "../../interfaces/TypedPackage"
import {TypedCosmWasmMsg} from "../../interfaces/TypedCosmWasmMsg"
import StorageService from "../Storage.service"
import RNFS from "react-native-fs"

const capabilitiesStaticOwnable = {
  isDynamic: false,
  hasMetadata: false,
  hasWidgetState: false,
  isConsumable: false,
  isConsumer: false,
  isTransferable: false,
}

const PACKAGES_PATH = RNFS.DocumentDirectoryPath + '/packages'

export default class PackageService {
  static async info(cid: string): Promise<TypedPackage> {
    const info = await StorageService.getItem(`package:${cid}`)
    if (!info) throw new Error(`Package not found: ${cid}`)

    return info
  }

  private static async storePackageInfo(
    title: string,
    name: string,
    description: string|undefined,
    cid: string,
    capabilities: TypedPackageCapabilities
  ): Promise<TypedPackage> {
    let pkg = await StorageService.getItem(`package:${cid}`)

    if (!pkg) {
      pkg = {title, name, description, cid, ...capabilities, versions: []}
    } else {
      Object.assign(pkg, {cid, description, ...capabilities})
    }

    pkg.versions.push({date: new Date(), cid})
    await StorageService.setItem(`package:${cid}`, pkg)

    return pkg
  }

  private static async getCapabilities(path: string): Promise<TypedPackageCapabilities> {
    if (!await RNFS.exists(`${path}/package.json`)) {
      throw new Error("Ownable package doesn't contain a package.json file")
    }

    if (!await RNFS.exists(`${path}/ownable_bg.wasm`)) return capabilitiesStaticOwnable

    const query: TypedCosmWasmMsg = await RNFS.readFile(`${path}/query_msg.json`, 'utf8').then(c => JSON.parse(c))
    const execute: TypedCosmWasmMsg = await RNFS.readFile(`${path}/execute_msg.json`, 'utf8').then(c => JSON.parse(c))

    const hasMethod = (schema: TypedCosmWasmMsg, find: string) =>
      schema.oneOf.findIndex(method => method.required.includes(find)) >= 0

    if (!hasMethod(query, 'get_info')) throw new Error('Invalid package: missing `get_info` query method')

    return {
      isDynamic: true,
      hasMetadata: hasMethod(query, 'get_metadata'),
      hasWidgetState: hasMethod(query, 'get_widget_state'),
      isConsumable: hasMethod(execute, 'consume'),
      isConsumer: hasMethod(query, 'is_consumer_of'),
      isTransferable: hasMethod(execute, 'transfer'),
    }
  }

  static async store(cid: string, path: string): Promise<TypedPackage> {
    const packageJson: Record<string, any> = await RNFS.readFile(`${path}/package.json`, 'utf8').then(c => JSON.parse(c))

    const name: string = packageJson.name
    const title = name
      .replace(/^ownable-|-ownable$/, '')
      .replace(/[-_]+/, ' ')
      .replace(/\b\w/, c => c.toUpperCase())
    const description: string|undefined = packageJson.description
    const capabilities = await this.getCapabilities(cid)

    await RNFS.copyFile(path, `${PACKAGES_PATH}/${cid}`)

    return await this.storePackageInfo(title, name, description, cid, capabilities)
  }


  public static getJs = async (cid: string): Promise<string> => {
    return RNFS.readFile(`${PACKAGES_PATH}/${cid}/ownable.js`, 'utf8')
  }

  public static getWasm = async (cid: string): Promise<string> => {
    return RNFS.readFile(`${PACKAGES_PATH}/${cid}/ownable_ws.js`, 'base64')
  }

  public static getHTML = async (cid: string): Promise<string> => {
    return await RNFS.readFile(`${PACKAGES_PATH}/${cid}/index.html`, 'utf8')
  }
}
