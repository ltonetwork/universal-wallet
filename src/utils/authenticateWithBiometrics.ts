import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import LTOService from '../services/LTO.service'
import { getPassword } from './keychain'
import { RootStackParamList } from '../../types'
import * as LocalAuthentication from 'expo-local-authentication'

interface Props {
  navigation: NativeStackNavigationProp<RootStackParamList, 'LockedScreen' | 'SignIn'>
  goBack?: boolean
}

export const authenticateWithBiometrics = async ({ navigation, goBack }: Props): Promise<void> => {
  try {
    const hasHardware: boolean = await LocalAuthentication.hasHardwareAsync()
    const isEnrolled: boolean = await LocalAuthentication.isEnrolledAsync()

    if (!hasHardware) {
      throw new Error('Biometric authentication not available')
    }

    const passCode: string | null = await getPassword()

    if (!passCode) {
      throw new Error('Unable to retrieve password')
    }

    if (isEnrolled) {
      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: 'Enter your pin',
        cancelLabel: 'Cancel',
      })

      if (!result.success) {
        throw new Error('Authentication failed')
      }

      if (passCode) {
        await LTOService.unlock(passCode)
        setTimeout(() => {
          goBack ? navigation.goBack() : navigation.navigate('Root')
        }, 1000)
      }
    }
  } catch (error: unknown) {
    console.error(`Error during biometric authentication: ${error}`)
  }
}
