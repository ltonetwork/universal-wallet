import { StatusBar } from 'expo-status-bar'
import React, { useContext, useEffect, useState } from 'react'
import { Card } from 'react-native-paper'
import { RootStackScreenProps } from '../../../types'
import ModalButton from '../../components/ModalButton'
import OverviewHeader from '../../components/OverviewHeader'
import { ButtonContainer, Container, Content, Field, InfoContainer, MainCard, StyledNickname } from './ModalScreen.styles'
import { StyledImage } from '../../components/styles/OverviewHeader.styles'
import { View } from '../../components/Themed'
import { MessageContext } from '../../context/UserMessage.context'
import LocalStorageService from '../../services/LocalStorage.service'
import { logoTitle } from '../../utils/images'
import { navigateToFacebook, navigateToLinkedin, navigateToTelegram, navigateToTwitter } from '../../utils/redirectSocialMedia'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'


export default function ModalScreen({ navigation }: RootStackScreenProps<'Modal'>) {

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

  const { setShowMessage, setMessageInfo } = useContext(MessageContext)

  const logOut = () => {
    setMessageInfo('Logout successful!')
    setShowMessage(true)
    navigation.replace('SignIn')
  }


  return (
    <Container>
      <StatusBar style={'dark'} backgroundColor={'#ffffff'} />
      <OverviewHeader
        icon={"close"}
        onPress={() => navigation.goBack()}
        input={<StyledImage testID="logo-title" source={logoTitle} />} />

      <InfoContainer>
        <MainCard >
          <Card.Content>
            <Field>Your wallet</Field>
            <View style={{ justifyContent: 'space-evenly' }}>
              <StyledNickname><Icon name='account-circle-outline' size={20} color='#0092aa' />{accountNickname}</StyledNickname>
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

    </Container>

  )

}
