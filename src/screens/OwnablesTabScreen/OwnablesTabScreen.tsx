import React, { useState, useCallback} from 'react'
import { ImageBackground, useWindowDimensions, Button, Text, FlatList, StyleSheet, View, SafeAreaView } from 'react-native'
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
import LocalStorageService from '../../services/LocalStorage.service'

export default function OwnablesTabScreen({ navigation }: RootTabScreenProps<'Ownables'>) {

  const { width, height } = useWindowDimensions()
  const [result, setResult] = useState<DirectoryPickerResponse | undefined | null>()
  const [ownableOptions, setOwnableOptions] = useState<string[]>([])


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

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      paddingTop: 22
    },
    item: {
      padding: 10,
      fontSize: 18,
      height: 44,
    },
  });

  const Item = ({ name }) => (
    <View style={styles.item}>
      <Text style={styles.title}>{name}</Text>
    </View>
  );

  const renderItem = ({ item }) => (
    <Item title={item.title} key={item.id}/>
  );

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
        <SafeAreaView style={styles.container}>
          <FlatList
            data={ownableOptions}
            renderItem={renderItem}
            keyExtractor={item => item.id}
          />
        </SafeAreaView>
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
              await PackageService.unzipOwnable(result[0]);
              setOwnableOptions(await LocalStorageService.getData('ownable-options'));
              console.log("\n\n ownable options:", ownableOptions);
            } catch (e) {
              handleError(e)
            }
          }}
        />
      </Container>
    </>
  )
}
