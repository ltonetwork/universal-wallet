import {Binary, EventChain} from "@ltonetwork/lto"
import LTOService from "../LTO.service"
import {StateDump} from "./Ownable.service"
import {IEventChainJSON} from "@ltonetwork/lto/interfaces"
import StorageService from "../Storage.service"
import {boolean} from "boolean"

const ANCHORING_ENABLED = !boolean(process.env.ANCHORING_DISABLED)

interface StoredChainInfo {
  chain: IEventChainJSON
  state: string
  package: string
  latestHash: string
  created: Date
}

export default class EventChainService {
  static async loadAll(): Promise<Array<{ chain: EventChain, package: string, created: Date }>> {
    const ids = await StorageService.getItem('ownable_ids') as string[]

    return (await Promise.all(ids.map(id => this.load(id))))
      .sort(({created: a}, {created: b}) => a.getTime() - b.getTime())
  }

  static async load(id: string): Promise<{ chain: EventChain, package: string, created: Date }> {
    const key = `ownable:${id}`
    const [chainJson, state, packageCid, latestHash, created] = await StorageService.multiGet([
      `${key}.chain`, `${key}.state`, `${key}.package`, `${key}.latestHash`, `${key}.created`,
    ]) as [IEventChainJSON, string, string, string, number]

    return {chain: EventChain.from(chainJson), package: packageCid, created: new Date(created)}
  }

  static async store(...chains: Array<{ chain: EventChain, stateDump: StateDump }>): Promise<void> {
    const anchors: Array<{ key: Binary, value: Binary }> = []
    const data: Array<[string, any]> = []

    for (const {chain, stateDump} of chains) {
      const storedState = await StorageService.getItem(`ownable:${chain.id}.state`)
      if (storedState === chain.state) continue

      if (ANCHORING_ENABLED) {
        const previousHash = await StorageService.getItem(`ownable:${chain.id}.latestHash`)
        anchors.push(...chain.startingAfter(Binary.fromHex(previousHash)).anchorMap)
      }

      data.push([`ownable:${chain.id}.chain`, chain.toJSON()])
      data.push([`ownable:${chain.id}.state`, chain.state.hex])
      data.push([`ownable:${chain.id}.latestHash`, chain.latestHash.hex])
      data.push([`ownable:${chain.id}.stateDump`, new Map(stateDump)])
    }

    if (anchors.length > 0) {
      await LTOService.anchor(...anchors)
    }

    await StorageService.multiSet(data)
  }

  static async init(chain: EventChain, packageCid: string, stateDump?: StateDump): Promise<void> {
    if (await StorageService.getItem(`ownable:${chain.id}.chain`) !== null) {
      return
    }

    const data: Array<[string, any]> = []
    data.push([`ownable:${chain.id}.chain`, chain.toJSON()])
    data.push([`ownable:${chain.id}.state`, chain.state.hex])
    data.push([`ownable:${chain.id}.latestHash`, chain.latestHash.hex])
    data.push([`ownable:${chain.id}.package`, packageCid])
    data.push([`ownable:${chain.id}.created`, new Date().getTime()])

    if (stateDump) data.push([`ownable:${chain.id}.stateDump`, new Map(stateDump)])

    if (ANCHORING_ENABLED) {
      await LTOService.anchor(...chain.anchorMap)
    }

    await StorageService.multiSet(data)
  }

  // Return `null` if the stored state dump doesn't match the requested event chain state
  static async getStateDump(id: string, state: string | Binary): Promise<StateDump | null> {
    const map = await StorageService.getItem(`ownable:${id}.stateDump`)
    if (!map) return null

    const storedState = await StorageService.getItem(`ownable:${id}.state`)
    if (storedState !== (state instanceof Binary ? state.hex : state)) return null

    return Array.from(map.entries())
  }

  static async delete(id: string): Promise<void> {
    await StorageService.multiRemove([
      `^ownable:${id}.chain`,
      `^ownable:${id}.state`,
      `^ownable:${id}.package`,
      `^ownable:${id}.latestHash`,
      `^ownable:${id}.created`,
      `^ownable:${id}.stateDump`,
    ])
  }

  public static async verify(chain: EventChain) {
    return await LTOService.verifyAnchors(...chain.anchorMap)
  }
}
