import AsyncStorage from "@react-native-async-storage/async-storage"
import {Binary} from "@ltonetwork/lto"

export default class StorageService {
  private static encode(value: any): string {
    if (value instanceof Map) {
      const encoded = Array.from(value.entries()).map(
        ([key, value]) => Binary.from(key).base64 + ':' + Binary.from(value).base64
      ).join('\n')

      return `!binary-map\n${encoded}`
    }

    return JSON.stringify(value)
  }

  private static decode(value: string | null): any {
    if (value === null) return null

    if (value?.startsWith('!binary-map\n')) {
      const entries = value.trim().split('\n').slice(1).map(
        (line) => line.split(':').map((str) => Binary.fromBase64(str))
      ) as [Binary, Binary][]

      return new Map(entries)
    }

    return JSON.parse(value)
  }

  public static setItem = async (key: string, value: any) => {
    await AsyncStorage.setItem(key, this.encode(value))
  }

  public static getItem = async (key: string) => {
    const value = await AsyncStorage.getItem(key)
    return this.decode(value)
  }

  public static removeItem = async (key: string) => {
    await AsyncStorage.removeItem(key)
  }

  public static clear = async () => {
    await AsyncStorage.clear()
  }

  public static multiGet = async (keys: string[]): Promise<any[]> => {
    const result = await AsyncStorage.multiGet(keys)
    return result.map(([key, value]) => [key, value !== null ? this.decode(value) : null])
  }

  public static multiSet = async (data: Record<string, any> | [string, any][]) => {
    const keyValuePairs = Array.isArray(data) ? data : Object.entries(data)
    await AsyncStorage.multiSet(keyValuePairs.map(([key, value]) => [key, this.encode(value)]))
  }

  public static multiRemove = async (keys: string[]) => {
    await AsyncStorage.multiRemove(keys)
  }
}
