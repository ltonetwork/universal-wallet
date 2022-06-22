import AsyncStorage from "@react-native-async-storage/async-storage";

export default class LocalStorageService {

  public static storeData = async (key: string, value: string) => {
    try {
      await AsyncStorage.setItem(key, value);
    } catch (error) {
      throw new Error('Error storing data in LocalStorage')
    }
  }

  public static getData = async (key: string) => {
    try {
      const value = await AsyncStorage.getItem(key);
      return value;
    } catch (error) {
      throw new Error('Error getting data from LocalStorage')
    }
  }

  public static removeData = async (key: string) => {
    try {
      await AsyncStorage.removeItem(key);
    } catch (error) {
      throw new Error('Error removing data from LocalStorage')
    }
  }

  public static clear = async () => {
    try {
      await AsyncStorage.clear();
    } catch (error) {
      throw new Error('Error clearing LocalStorage')
    }
  }
}

