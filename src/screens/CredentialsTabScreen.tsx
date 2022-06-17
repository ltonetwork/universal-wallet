import React from 'react'
import { Paragraph } from 'react-native-paper'
import SocialMediaIcon from '../components/SocialMediaIcon'
import { IconContainer, StyledImage, StyledTitle, StyledView } from '../components/styles/NextFunctionality.styles'
import { placeholderImage, socialMediaIcons } from '../utils/images'
import { navigateToFacebook, navigateToLinkedin, navigateToTelegram, navigateToTwitter } from '../utils/redirectSocialMedia'

export default function CredentialsTabScreen() {

  return (
    <StyledView>
      <StyledImage source={placeholderImage}></StyledImage>
      <StyledTitle>This functionality will soon be available</StyledTitle>
      <Paragraph>Follow us on our social networks to stay up to date with the latest news about the application.</Paragraph>
      <IconContainer>
        <SocialMediaIcon source={socialMediaIcons.twitter} onPress={() => navigateToTwitter()} />
        <SocialMediaIcon source={socialMediaIcons.facebook} onPress={() => navigateToFacebook()} />
        <SocialMediaIcon source={socialMediaIcons.linkedin} onPress={() => navigateToLinkedin()} />
        <SocialMediaIcon source={socialMediaIcons.telegram} onPress={() => navigateToTelegram()} />
      </IconContainer>
    </StyledView>
  )
}