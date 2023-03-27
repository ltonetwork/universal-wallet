import * as Keychain from "react-native-keychain"

export type KeyChainData = {
  pin?: string
}

export const setKeychainDataObject = async (
  data: KeyChainData
): Promise<Keychain.Result | null | false> => {
  return await Keychain.setGenericPassword(
    "Wallet",
    JSON.stringify(data)
  ).catch(() => null)
}

export const getKeychainDataObject = async (): Promise<KeyChainData | null> => {
  try {
    const credentials = await Keychain.getGenericPassword()
    if (credentials) {
      return JSON.parse(credentials.password)
    } else {
      console.log("No credentials stored")
      return null
    }
  } catch (error) {
    console.warn("Keychain couldn't be accessed!", error)
    return null
  }
}

export const getPassword = async (): Promise<string | null> => {
  const keyChainDataObject = await getKeychainDataObject()
  return keyChainDataObject?.pin || null
}
