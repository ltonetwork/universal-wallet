import React, { useState} from 'react'
import {ImageBackground, useWindowDimensions} from 'react-native'
import { RootTabScreenProps } from '../../../types'
import OverviewHeader from '../../components/OverviewHeader'
import StatusBarIOS from '../../components/StatusBarIOS'
import { Container, MainTitle } from '../../components/styles/NextFunctionality.styles'
import { OWNABLES } from '../../constants/Text'
import { backgroundImage } from '../../utils/images'
import DocumentPicker, { isInProgress, types } from 'react-native-document-picker'
import OwnableService from '../../services/Ownables/Ownable.service'
import {Button, Provider} from 'react-native-paper'
import {useFocusEffect} from "@react-navigation/native";
import PageFAB from "../../components/PageFAB";
import Ownable from "../../components/Ownable";
import {EventChain} from "@ltonetwork/lto"
import {TypedPackage} from "../../interfaces/TypedPackage"

export default function OwnablesTabScreen({ navigation }: RootTabScreenProps<'Ownables'>) {
  const { width, height } = useWindowDimensions()
  const [ownables, setOwnables] = useState<Array<{chain: EventChain, package: TypedPackage}>>([]);

  useFocusEffect(
      React.useCallback(() => {
          loadOwnables()
      },[])
  )

  const importOwnable = async () => {
    try {
      const pickerResult = await DocumentPicker.pickSingle({
        presentationStyle: 'fullScreen',
        type: [types.allFiles],
        copyTo: 'documentDirectory'
      })
      await OwnableService.import(pickerResult)
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        console.warn('cancelled')
        // User cancelled the picker, exit any dialogs or menus and move on
      } else if (isInProgress(err)) {
        console.warn('multiple pickers were opened, only the last will be considered')
      } else {
        throw err
      }
    }
  }

  const loadOwnables = () => {
    OwnableService.list().then(setOwnables)
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

        { ownables.map(({chain, package: pkg}) => <Ownable chain={chain} package={pkg} />) }
      </Container>

      <Provider>
        <PageFAB onPress={() => importOwnable() } />
      </Provider>
    </>
  )
}
