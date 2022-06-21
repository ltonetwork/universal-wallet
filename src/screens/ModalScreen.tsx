import { StatusBar } from 'expo-status-bar'
import React, { useEffect } from 'react'
import { Platform, StyleSheet } from 'react-native'
import EditScreenInfo from '../components/EditScreenInfo'
import { Text, View } from '../components/Themed'
import { Menu, Drawer, Button, TextInput } from 'react-native-paper'
import { StyledInput } from '../components/styles/StyledInput.styles'
import ModalButtons from '../components/ModalButtons'
import { navigateToFacebook, navigateToLinkedin, navigateToTelegram, navigateToTwitter } from '../utils/redirectSocialMedia'
import LocalStorageService from '../services/LocalStorage.service'
import { useNavigation } from '@react-navigation/native'


export default function ModalScreen() {

  const navigation = useNavigation()

  const logOut = () => {
    LocalStorageService.clear()
    navigation.navigate('OnBoarding')
  }

  return (
    <View style={{ justifyContent: 'center', alignItems: 'center', flexDirection: 'row' }}>
      <View>
        <StyledInput
          mode={'flat'}
          disabled={true}
          style={{ marginBottom: 15, backgroundColor: '#F5F5F5' }}
          label="@johndoe"
          left={<TextInput.Icon name='account' />}
          value={'la key'}
        >
        </StyledInput>

        <ModalButtons text={'Profile'} onPress={() => alert('works')} />
        <ModalButtons text={'Twitter'} onPress={() => navigateToTwitter()} />
        <ModalButtons text={'Facebook'} onPress={() => navigateToFacebook()} />
        <ModalButtons text={'Linkedin'} onPress={() => navigateToLinkedin()} />
        <ModalButtons text={'Telegram'} onPress={() => navigateToTelegram()} />
        <ModalButtons text={'Log out'} onPress={() => logOut()} />




      </View>

      {/* Use a light status bar on iOS to account for the black space above the modal */}
      <StatusBar style={Platform.OS === 'ios' ? 'light' : 'auto'} />
    </View>
  )
}
