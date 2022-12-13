import AsyncStorage from "@react-native-async-storage/async-storage"

export default class StorageService {
  public static setItem = async (key: string, value: any) => {
    await AsyncStorage.setItem(key, JSON.stringify(value))
  }

  public static getItem = async (key: string) => {
    const value = await AsyncStorage.getItem(key)
    return value ? JSON.parse(value) : null
  }

  public static removeItem = async (key: string) => {
    await AsyncStorage.removeItem(key)
  }

  public static clear = async () => {
    await AsyncStorage.clear()
  }
}
