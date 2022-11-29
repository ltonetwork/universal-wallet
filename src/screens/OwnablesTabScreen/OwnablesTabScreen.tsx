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
import { Modal, Portal, Text, Button, Provider } from 'react-native-paper'

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
      marginTop: StatusBar.currentHeight || 0,
      height: 100,
      backgroundColor: 'black',
    },
    item: {
      padding: 10,
      marginVertical: 8,
      marginHorizontal: 16,
    },
    title: {
      fontSize: 14,
    },
  });


  const Item = ({ item, onPress, backgroundColor, textColor }) => {
    return (
       <TouchableOpacity onPress={onPress} style={[styles.item, backgroundColor]}>
         <Text style={[styles.title, textColor]}>{item.name}</Text>
       </TouchableOpacity>
    );
  }

  const renderItem = ({ item }) => {
    const backgroundColor = "#6e3b6e";
    const color = 'black';
    return (
      <Item
        item={item}
        onPress={() => {
          console.log('clicked button', item);
        }}
        backgroundColor={{ backgroundColor }}
        textColor={{ color }}
      />
    );
  };



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
        <Text>Ownable options:</Text>
        <FlatList
          data={ownableOptions}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
        />
        <PlusButton onPress={() => navigation.navigate('QrReader')} />
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
    </>
  )
}
