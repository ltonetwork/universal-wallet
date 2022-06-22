import React from 'react'
import { Paragraph } from 'react-native-paper'
import SocialMediaIcon from '../components/SocialMediaIcon'
import { IconContainer, StyledImage, StyledTitle, StyledView } from '../components/styles/NextFunctionality.styles'
import { placeholderImage, socialMediaIcons } from '../utils/images'
import { navigateToFacebook, navigateToLinkedin, navigateToTelegram, navigateToTwitter } from '../utils/redirectSocialMedia'
import { QRIcon } from '../components/styles/QRIcon.styles'
import { View } from 'react-native'

export default function CredentialsTabScreen() {

  return (
    <View>
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
      <QRIcon icon="qrcode-scan" color='#ffffff' onPress={() => alert('yaiii')} />
    </View>
  )
}