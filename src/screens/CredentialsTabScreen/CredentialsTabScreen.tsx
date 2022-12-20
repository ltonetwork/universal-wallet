import React from 'react'
import { ImageBackground, useWindowDimensions } from 'react-native'
import { RootTabScreenProps } from '../../../types'
import OverviewHeader from '../../components/OverviewHeader'
import SocialMediaIcon from '../../components/SocialMediaIcon'
import StatusBarIOS from '../../components/StatusBarIOS'
import { Container, IconContainer, MainTitle, StyledText, StyledTitle, StyledView } from '../../components/styles/NextFunctionality.styles'
import { CREDENTIALS } from '../../constants/Text'
import { backgroundImage, socialMediaIcons } from '../../utils/images'
import { navigateToFacebook, navigateToLinkedin, navigateToTelegram, navigateToTwitter } from '../../utils/redirectSocialMedia'


export default function CredentialsTabScreen({ navigation }: RootTabScreenProps<'Credentials'>) {

  const { width, height } = useWindowDimensions()

  return (
    <>
      <StatusBarIOS backgroundColor={'#ffffff'} />
      <ImageBackground source={backgroundImage} style={{ width, height, position: "absolute" }} />
      <Container>
        <OverviewHeader
          marginLeft={-10}
          icon={"menu"}
          onPress={() => navigation.navigate('Menu')}
          onQrPress={() => navigation.navigate('QrReader')}
          input={<MainTitle>{CREDENTIALS.MAINTITLE}</MainTitle>} />
        <StyledView>
          <StyledTitle>{CREDENTIALS.TITLE}</StyledTitle>
          <StyledText>{CREDENTIALS.SUBTITLE}</StyledText>
          <IconContainer>
            <SocialMediaIcon source={socialMediaIcons.twitter} onPress={() => navigateToTwitter()} />
            <SocialMediaIcon source={socialMediaIcons.facebook} onPress={() => navigateToFacebook()} />
            <SocialMediaIcon source={socialMediaIcons.linkedin} onPress={() => navigateToLinkedin()} />
            <SocialMediaIcon source={socialMediaIcons.telegram} onPress={() => navigateToTelegram()} />
          </IconContainer>
        </StyledView>
      </Container>
    </>
  )
}
