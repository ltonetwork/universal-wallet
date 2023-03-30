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
    const hasHardwareSupport: boolean = await LocalAuthentication.hasHardwareAsync()
    const isEnrolledOnDevice: boolean = await LocalAuthentication.isEnrolledAsync()

    if (!hasHardwareSupport) {
      throw new Error('Biometric authentication is not available on this device')
    }

    const passCode: string | null = await getPassword()

    if (!passCode) {
      throw new Error('Unable to retrieve password.')
    }

    if (isEnrolledOnDevice) {
      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: 'Authenticate',
        cancelLabel: 'Cancel',
      })

      if (!result.success) {
        throw new Error('Authentication failed.')
      }

      await LTOService.unlock(passCode)
      setTimeout(() => {
        goBack && navigation.goBack() || navigation.navigate('Root')
      }, 1000)
    } else {
      await LocalAuthentication.authenticateAsync({
        promptMessage: 'You must be enrolled on your device to use biometrics',
        cancelLabel: 'Cancel',
      })

      await LTOService.unlock(passCode)
      setTimeout(() => {
        goBack && navigation.goBack() || navigation.navigate('Root')
      }, 1000)
    }
  } catch (error: unknown) {
    console.error(`Error during biometric authentication: ${error}`)
  }
}
