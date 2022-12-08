import React, { useState, useCallback} from 'react'
import { ImageBackground, useWindowDimensions, FlatList, StyleSheet, View, SafeAreaView, StatusBar, TouchableOpacity } from 'react-native'
import { RootTabScreenProps } from '../../../types'
import OverviewHeader from '../../components/OverviewHeader'
import PlusButton from '../../components/PlusButton'
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
import WASMService from '../../services/WASM.service'
import { Modal, Portal, Text, Button, Provider, List, ScrollView } from 'react-native-paper';

export default function OwnablesTabScreen({ navigation }: RootTabScreenProps<'Ownables'>) {

  const { width, height } = useWindowDimensions()

  const [visible, setVisible] = React.useState(false);
  const [result, setResult] = useState<DirectoryPickerResponse | undefined | null>()
  const [ownableOptions, setOwnableOptions] = useState<[]>([])

  const showModal = () => setVisible(true);
  const hideModal = () => setVisible(false);
  const containerStyle = {backgroundColor: 'white', padding: 20};

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

  const importOwnable = async () => {
    try {
      const pickerResult = await DocumentPicker.pickSingle({
        presentationStyle: 'fullScreen',
        type: [types.allFiles],
        copyTo: 'documentDirectory'
      });
      setResult([pickerResult]);
      await PackageService.unzipOwnable(pickerResult);
      await loadOwnableOptions();
    } catch (e) {
      handleError(e)
    }
  }

  const loadOwnableOptions = async () => {
      const availableOwnableOptions = await LocalStorageService.getData('ownable-options');
      setOwnableOptions(availableOwnableOptions ? availableOwnableOptions : []);
      console.log("ownable options:", availableOwnableOptions);
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
              await PackageService.unzipOwnable(result[0]);
              const parsedOwnableFiles = await LocalStorageService.getData('ownable-options');
              setOwnableOptions(parsedOwnableFiles);
              console.log("\n\n ownable options:", ownableOptions);
            } catch (e) {
              handleError(e)
            }
          }}
        />
      </Container>
      <Provider>
        <Portal>
          <Modal visible={visible} onDismiss={hideModal} contentContainerStyle={containerStyle}>
            <List.Section>
              <List.Subheader>Available Ownables</List.Subheader>
              {ownableOptions.map((item) => {
                item.key = item.id;
                return (
                  <List.Item
                    onPress={async () => {
                      console.log(`issuing ${item.name}`);
                      await WASMService.spawnWASMThread(item.name);
                    }}
                    title={item.name}
                  />
                )
              })}
            </List.Section>
            <Button
              mode="contained"
              onPress={importOwnable}
            >Import an Ownable</Button>
          </Modal>
        </Portal>
        <PlusButton onPress={async () => {
          await loadOwnableOptions();
          showModal();
        }} />
      </Provider>
    </>
  )
}
