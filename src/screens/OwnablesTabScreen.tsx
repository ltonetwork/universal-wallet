import React from 'react'
import { View } from 'react-native'
import { Paragraph } from 'react-native-paper'
import { RootTabScreenProps } from '../../types'
import OverviewHeader from '../components/OverviewHeader'
import QRButton from '../components/QRIcon'
import SocialMediaIcon from '../components/SocialMediaIcon'
import { IconContainer, MainTitle, StyledImage, StyledTitle, StyledView } from '../components/styles/NextFunctionality.styles'
import { placeholderImage, socialMediaIcons } from '../utils/images'
import { navigateToFacebook, navigateToLinkedin, navigateToTelegram, navigateToTwitter } from '../utils/redirectSocialMedia'

export default function OwnablesTabScreen({ navigation }: RootTabScreenProps<'Ownables'>) {

  return (
    <View>
      <OverviewHeader
        icon={"menu"}
        onPress={() => navigation.navigate('Modal')}
        input={<MainTitle>Ownables</MainTitle>} />
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
      <QRButton onPress={() => navigation.navigate('ScanTransaction')} />
    </View>
  )
}