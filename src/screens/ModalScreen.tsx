import { StatusBar } from 'expo-status-bar'
import React, { useState } from 'react'
import { Platform } from 'react-native'
import { TextInput } from 'react-native-paper'
import { RootStackScreenProps } from '../../types'
import ModalButtons from '../components/ModalButtons'
import SnackbarMessage from '../components/Snackbar'
import { StyledInput } from '../components/styles/StyledInput.styles'
import { View } from '../components/Themed'
import LocalStorageService from '../services/LocalStorage.service'
import { navigateToFacebook, navigateToLinkedin, navigateToTelegram, navigateToTwitter } from '../utils/redirectSocialMedia'

export default function ModalScreen({ navigation }: RootStackScreenProps<'Modal'>) {

  const [snackbarVisible, setSnackbarVisible] = useState(false)

  const logOut = () => {
    LocalStorageService.clear()
    setSnackbarVisible(true)
    setTimeout(() => {
      navigation.navigate('SignIn')
    }, 2000)
  }

  return (
    <View style={{ flex: 1, justifyContent: 'center', flexDirection: 'row' }}>
      <View>
        <StyledInput
          mode={'flat'}
          disabled={true}
          underlineColor={'transparent'}
          style={{ marginBottom: 15 }}
          label="@johndoe"
          left={<TextInput.Icon name='account-outline' />}
          value={'la key'}>
        </StyledInput>

        <ModalButtons text={'Profile'} onPress={() => alert('works')} />
        <ModalButtons text={'Twitter'} onPress={() => navigateToTwitter()} />
        <ModalButtons text={'Facebook'} onPress={() => navigateToFacebook()} />
        <ModalButtons text={'Linkedin'} onPress={() => navigateToLinkedin()} />
        <ModalButtons text={'Telegram'} onPress={() => navigateToTelegram()} />
        <ModalButtons text={'Log out'} onPress={() => logOut()} />

      </View>
      {snackbarVisible && <SnackbarMessage text={'Session closed!'} />}
      <SnackbarMessage text={'Session closed succesfully!'} />
      {/* Use a light status bar on iOS to account for the black space above the modal */}
      <StatusBar style={Platform.OS === 'ios' ? 'light' : 'auto'} />
    </View>
  )
}
