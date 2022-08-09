import React from 'react'
import { RootTabScreenProps } from '../../../types'
import OverviewHeader from '../../components/OverviewHeader'
import QRButton from '../../components/QRButton'
import SocialMediaIcon from '../../components/SocialMediaIcon'
import StatusBarIOS from '../../components/StatusBarIOS'
import { Container, IconContainer, MainTitle, StyledImage, StyledText, StyledTitle, StyledView } from '../../components/styles/NextFunctionality.styles'
import { placeholderImage, socialMediaIcons } from '../../utils/images'
import { navigateToFacebook, navigateToLinkedin, navigateToTelegram, navigateToTwitter } from '../../utils/redirectSocialMedia'

export default function CredentialsTabScreen({ navigation }: RootTabScreenProps<'Credentials'>) {

  return (
    <>
      <StatusBarIOS backgroundColor={'#ffffff'} />
      <Container>
        <OverviewHeader
          icon={"menu"}
          onPress={() => navigation.navigate('Modal')}
          input={<MainTitle>Credentials</MainTitle>} />
        <StyledView>
          <StyledImage source={placeholderImage}></StyledImage>
          <StyledTitle>This feature will soon be available</StyledTitle>
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
    </>
  )
}