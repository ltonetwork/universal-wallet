import React from 'react'
import { ImageBackground, useWindowDimensions, Button } from 'react-native'
import { RootTabScreenProps } from '../../../types'
import OverviewHeader from '../../components/OverviewHeader'
import SocialMediaIcon from '../../components/SocialMediaIcon'
import StatusBarIOS from '../../components/StatusBarIOS'
import { Container, IconContainer, MainTitle, StyledText, StyledTitle, StyledView } from '../../components/styles/NextFunctionality.styles'
import { OWNABLES } from '../../constants/Text'
import { backgroundImage, socialMediaIcons } from '../../utils/images'
import { navigateToFacebook, navigateToLinkedin, navigateToTelegram, navigateToTwitter } from '../../utils/redirectSocialMedia'
import DocumentPicker, {
  DirectoryPickerResponse,
  DocumentPickerResponse,
  isInProgress,
  types,
} from 'react-native-document-picker'
import PackageService from '../../services/Package.service'

export default function OwnablesTabScreen({ navigation }: RootTabScreenProps<'Ownables'>) {

  const { width, height } = useWindowDimensions()
  const [result, setResult] = React.useState<DirectoryPickerResponse | undefined | null>()

  const handleError = (err: unknown) => {
    if (DocumentPicker.isCancel(err)) {
      console.warn('cancelled')
      // User cancelled the picker, exit any dialogs or menus and move on
    } else if (isInProgress(err)) {
      console.warn('multiple pickers were opened, only the last will be considered')
    } else {
      throw err
    }
  }

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
          input={<MainTitle>{OWNABLES.MAINTITLE}</MainTitle>} />
        <Button
          title="open picker for single file selection"
          onPress={async () => {

            try {
              const pickerResult = await DocumentPicker.pickSingle({
                presentationStyle: 'fullScreen',
                type: [types.zip],
                copyTo: 'cachesDirectory'
              })
              setResult([pickerResult]);
              PackageService.unzipOwnable(result[0]);
            } catch (e) {
              handleError(e)
            }
          }}
        />
      </Container>
    </>
  )
}
