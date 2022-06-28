import { StatusBar } from 'expo-status-bar'
import React, { useEffect, useState } from 'react'
import { Platform } from 'react-native'
import { TextInput } from 'react-native-paper'
import { RootStackScreenProps } from '../../types'
import ModalButton from '../components/ModalButton'
import SnackbarMessage from '../components/Snackbar'
import { StyledInput } from '../components/styles/StyledInput.styles'
import { View } from '../components/Themed'
import LocalStorageService from '../services/LocalStorage.service'
import { navigateToFacebook, navigateToLinkedin, navigateToTelegram, navigateToTwitter } from '../utils/redirectSocialMedia'
import { InputContainer, ButtonContainer } from '../components/styles/ModalScreen.styles'

export default function ModalScreen({ navigation }: RootStackScreenProps<'Modal'>) {

  const [snackbarVisible, setSnackbarVisible] = useState(false)
  const [accountAddress, setAccountAddress] = useState('')
  const [isLoading, setIsLoading] = useState(false)


  useEffect(() => {
    getAccountAddress()
  }, [])


  const getAccountAddress = () => {
    LocalStorageService.getData('@accountData')
      .then(data => {
        setIsLoading(false)
        setAccountAddress(data.address)
      })
      .catch(err => console.log(err))
  }

  const logOut = () => {
    LocalStorageService.clear()
    setSnackbarVisible(true)
    setTimeout(() => {
      navigation.navigate('SignIn')
    }, 2000)
  }

  return (
    <>
      <InputContainer>
        <StyledInput
          mode={'flat'}
          disabled={true}
          underlineColor={'transparent'}
          style={{ marginBottom: 15 }}
          label="@johndoe"
          left={<TextInput.Icon name='account-circle-outline' />}
          value={accountAddress}>
        </StyledInput>
      </InputContainer>

      <ButtonContainer>
        <ModalButton text={'Profile'} onPress={() => navigation.navigate('Profile')} />
        <ModalButton text={'Twitter'} onPress={() => navigateToTwitter()} />
        <ModalButton text={'Facebook'} onPress={() => navigateToFacebook()} />
        <ModalButton text={'Linkedin'} onPress={() => navigateToLinkedin()} />
        <ModalButton text={'Telegram'} onPress={() => navigateToTelegram()} />
        <ModalButton text={'Log out'} onPress={() => logOut()} />
        {snackbarVisible && <SnackbarMessage text={'Session closed!'} />}
        {/* Use a light status bar on iOS to account for the black space above the modal */}

      </ButtonContainer>
      <StatusBar style={Platform.OS === 'ios' ? 'light' : 'auto'} />
    </>
  )
}
