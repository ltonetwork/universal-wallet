import React, { useContext, useEffect, useState } from 'react'
import { Card } from 'react-native-paper'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import { RootStackScreenProps } from '../../../types'
import ModalButton from '../../components/ModalButton'
import OverviewHeader from '../../components/OverviewHeader'
import { StyledImage } from '../../components/styles/OverviewHeader.styles'
import { View } from '../../components/Themed'
import { MODAL_SCREEN } from '../../constants/Text'
import { MessageContext } from '../../context/UserMessage.context'
import LocalStorageService from '../../services/LocalStorage.service'
import { logoTitle } from '../../utils/images'
import { navigateToFacebook, navigateToLinkedin, navigateToTelegram, navigateToTwitter } from '../../utils/redirectSocialMedia'
import { ButtonContainer, Container, Content, Field, InfoContainer, MainCard, StyledNickname } from './ModalScreen.styles'


export default function ModalScreen({ navigation }: RootStackScreenProps<'Modal'>) {

  const [accountAddress, setAccountAddress] = useState('')
  const [accountNickname, setAccountNickname] = useState('')
  const { setShowMessage, setMessageInfo } = useContext(MessageContext)


  useEffect(() => {
    getAccountAddress()
    getNickname()
  }, [accountAddress, accountNickname])

  const getNickname = () => {
    LocalStorageService.getData('@userAlias')
      .then(data => setAccountNickname(data.nickname))
      .catch(error => {
        throw new Error('Error retrieving data', error)
      })
  }

  const getAccountAddress = () => {
    LocalStorageService.getData('@accountData')
      .then(data => setAccountAddress(data[0].address))
      .catch(error => {
        throw new Error('Error retrieving data', error)
      })
  }

  const logOut = () => {
    setMessageInfo('Logout successful!')
    setShowMessage(true)
    navigation.reset({
      index: 0,
      routes: [{ name: 'SignIn' }],
    })
  }


  return (
    <Container>
      <OverviewHeader
        icon={"close"}
        onPress={() => navigation.goBack()}
        input={<StyledImage testID="logo-title" source={logoTitle} />} />

      <InfoContainer>
        <MainCard >
          <Card.Content>
            <Field>{MODAL_SCREEN.CARD_TITLE}</Field>
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
