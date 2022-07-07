import { StatusBar } from 'expo-status-bar'
import React, { useEffect, useState } from 'react'
import { Platform } from 'react-native'
import { Card } from 'react-native-paper'
import { SafeAreaView } from 'react-native-safe-area-context'
import { RootStackScreenProps } from '../../types'
import ModalButton from '../components/ModalButton'
import SnackbarMessage from '../components/Snackbar'
import { ButtonContainer, Content, Field, InfoContainer, MainCard, StyledNickname } from '../components/styles/ModalScreen.styles'
import { View } from '../components/Themed'
import LocalStorageService from '../services/LocalStorage.service'
import { navigateToFacebook, navigateToLinkedin, navigateToTelegram, navigateToTwitter } from '../utils/redirectSocialMedia'


export default function ModalScreen({ navigation }: RootStackScreenProps<'Modal'>) {

  const [snackbarVisible, setSnackbarVisible] = useState(false)
  const [accountAddress, setAccountAddress] = useState('')
  const [accountNickname, setAccountNickname] = useState('')


  useEffect(() => {
    getAccountAddress()
    getNickname()
  }, [])

  const getNickname = () => {
    LocalStorageService.getData('@userAlias')
      .then(data => setAccountNickname(data.nickname))
      .catch(err => console.log(err))
  }


  const getAccountAddress = () => {
    LocalStorageService.getData('@accountData')
      .then(data => setAccountAddress(data.address))
      .catch(err => console.log(err))
  }

  const logOut = () => {
    setSnackbarVisible(true)
    setTimeout(() => {
      navigation.replace('SignIn')
    }, 2000)
  }

  return (
    <SafeAreaView style={{ backgroundColor: 'white' }}>
      <StatusBar style={Platform.OS === 'ios' ? 'light' : 'auto'} />

      <InfoContainer>
        <MainCard >
          <Card.Content>
            <Field>Your wallet</Field>
            <View style={{ justifyContent: 'space-evenly' }}>
              <StyledNickname>{accountNickname}</StyledNickname>
            </View>
            <Content>{accountAddress}</Content>
          </Card.Content>
        </MainCard>
      </InfoContainer>

      <ButtonContainer>
        <ModalButton text={'Profile'} onPress={() => navigation.navigate('Profile')} />
        <ModalButton text={'Twitter'} onPress={() => navigateToTwitter()} />
        <ModalButton text={'Facebook'} onPress={() => navigateToFacebook()} />
        <ModalButton text={'Linkedin'} onPress={() => navigateToLinkedin()} />
        <ModalButton text={'Telegram'} onPress={() => navigateToTelegram()} />
        <ModalButton text={'Log out'} onPress={() => logOut()} />
      </ButtonContainer>

      {snackbarVisible && <SnackbarMessage text={'Session closed!'} />}

    </SafeAreaView>
  )
}
