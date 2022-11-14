import React, { useContext, useEffect, useState } from 'react'
import { Card } from 'react-native-paper'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import { RootStackScreenProps } from '../../../types'
import ModalButton from '../../components/ModalButton'
import OverviewHeader from '../../components/OverviewHeader'
import { StyledImage } from '../../components/styles/OverviewHeader.styles'
import { View } from '../../components/Themed'
import { MessageContext } from '../../context/UserMessage.context'
import LocalStorageService from '../../services/LocalStorage.service'
import {logoTitle, socialMediaIcons} from '../../utils/images'
import {
  navigateToExplorer,
  navigateToFacebook,
  navigateToLinkedin,
  navigateToTelegram,
  navigateToTwitter, navigateToWebsite, navigateToWebWallet
} from '../../utils/redirectSocialMedia'
import { ButtonContainer, Container, Content, Field, InfoContainer, MainCard, StyledNickname } from './ModalScreen.styles'
import {IconContainer} from "../../components/styles/NextFunctionality.styles";
import SocialMediaIcon from "../../components/SocialMediaIcon";
import PressToCopy from "../../components/PressToCopy";


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
        throw new Error(`Error retrieving data. ${error}`)
      })
  }

  const getAccountAddress = () => {
    LocalStorageService.getData('@accountData')
      .then(data => setAccountAddress(data[0].address))
      .catch(error => {
        throw new Error(`Error retrieving data. ${error}`)
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
        marginLeft={undefined}
        icon={"close"}
        onPress={() => navigation.goBack()}
        input={<StyledImage testID="logo-title" source={logoTitle} />} />

      <InfoContainer>
        <MainCard >
          <Card.Content>
            <PressToCopy value={accountAddress}>
              <View style={{ justifyContent: 'space-evenly' }}>
                <StyledNickname><Icon name='account-circle-outline' size={20} color='#0092aa' /> {accountNickname}</StyledNickname>
              </View>
              <Content>{accountAddress}</Content>
            </PressToCopy>
          </Card.Content>
        </MainCard>
      </InfoContainer>

      <ButtonContainer>
        <ModalButton text={'My Account'} bold={true} onPress={() => navigation.navigate('Profile')} />
        <ModalButton text={'Log out'} bold={true} onPress={() => logOut()} />
      </ButtonContainer>

      <ButtonContainer>
        <ModalButton text={'More info'} onPress={navigateToWebsite} />
        <ModalButton text={'LTO Explorer'} onPress={navigateToExplorer} />
        <ModalButton text={'LTO Web Wallet'} onPress={navigateToWebWallet} />
      </ButtonContainer>

      <IconContainer>
        <SocialMediaIcon source={socialMediaIcons.twitter} onPress={navigateToTwitter} />
        <SocialMediaIcon source={socialMediaIcons.facebook} onPress={navigateToFacebook} />
        <SocialMediaIcon source={socialMediaIcons.linkedin} onPress={navigateToLinkedin} />
        <SocialMediaIcon source={socialMediaIcons.telegram} onPress={navigateToTelegram} />
      </IconContainer>
    </Container>
  )
}
