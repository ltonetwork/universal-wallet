import { StatusBar } from 'expo-status-bar'
import React from 'react'
import { RootTabScreenProps } from '../../types'
import OverviewHeader from '../components/OverviewHeader'
import QRButton from '../components/QRButton'
import SocialMediaIcon from '../components/SocialMediaIcon'
import { Container, IconContainer, MainTitle, StyledImage, StyledText, StyledTitle, StyledView } from '../components/styles/NextFunctionality.styles'
import { placeholderImage, socialMediaIcons } from '../utils/images'
import { navigateToFacebook, navigateToLinkedin, navigateToTelegram, navigateToTwitter } from '../utils/redirectSocialMedia'

export default function OwnablesTabScreen({ navigation }: RootTabScreenProps<'Ownables'>) {

  return (
    <Container>
      <StatusBar style={'dark'} backgroundColor={'#ffffff'} />
      <OverviewHeader
        icon={"menu"}
        onPress={() => navigation.navigate('Modal')}
        input={<MainTitle>Ownables</MainTitle>} />
      <StyledView>
        <StyledImage source={placeholderImage}></StyledImage>
        <StyledTitle>This functionality will soon be available</StyledTitle>
        <StyledText>Follow us on our social networks to stay up to date with the latest news about the application.</StyledText>
        <IconContainer>
          <SocialMediaIcon source={socialMediaIcons.twitter} onPress={() => navigateToTwitter()} />
          <SocialMediaIcon source={socialMediaIcons.facebook} onPress={() => navigateToFacebook()} />
          <SocialMediaIcon source={socialMediaIcons.linkedin} onPress={() => navigateToLinkedin()} />
          <SocialMediaIcon source={socialMediaIcons.telegram} onPress={() => navigateToTelegram()} />
        </IconContainer>
      </StyledView>
      <QRButton onPress={() => navigation.navigate('ScanTransaction')} />
    </Container>
  )
}