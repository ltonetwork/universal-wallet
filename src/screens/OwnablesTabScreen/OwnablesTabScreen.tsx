import React, { useState} from 'react'
import {ImageBackground, Text, useWindowDimensions, View} from 'react-native'
import { RootTabScreenProps } from '../../../types'
import OverviewHeader from '../../components/OverviewHeader'
import StatusBarIOS from '../../components/StatusBarIOS'
import { Container, MainTitle } from '../../components/styles/NextFunctionality.styles'
import { OWNABLES } from '../../constants/Text'
import { backgroundImage } from '../../utils/images'
import DocumentPicker, { isInProgress, types } from 'react-native-document-picker'
import OwnableService from '../../services/Ownable.service'
import {Modal, Portal, Button, Provider, List, Card} from 'react-native-paper'
import {useFocusEffect} from "@react-navigation/native";
import ShortList from "../../components/ShortList";
import PageFAB from "../../components/PageFAB";
import WebView from "react-native-webview";
import Ownable from "../../components/Ownable";

export default function OwnablesTabScreen({ navigation }: RootTabScreenProps<'Ownables'>) {

  const { width, height } = useWindowDimensions()

  const [showAddModal, setShowAddModal] = React.useState(false)
  const [ownableOptions, setOwnableOptions] = useState<{id: string, name: string}[]>([])
  const [ownables, setOwnables] = useState<{id: string, option: {id: string, name: string}}[]>([])

  useFocusEffect(
      React.useCallback(() => {
          loadOwnableOptions()
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
      loadOwnableOptions()
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

  const loadOwnableOptions = () => {
    OwnableService.listOptions().then(setOwnableOptions)
  }

  const loadOwnables = () => {
    OwnableService.list().then(setOwnables)
  }

  const renderOwnableOption = (option: {id: string, name: string}) =>
    <List.Item
        key={`ownable-option:${option.id}`}
        onPress={async () => {
          await OwnableService.issue(option.id)
          loadOwnables()
          setShowAddModal(false)
        }}
        title={`${option.name} (${option.id})`}
    />


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

          <Button onPress={() => { OwnableService.clear().then(loadOwnables) }}>Clear</Button>
        { ownables.map(ownable => <Ownable key={ownable.id} ownable={ownable} />) }
      </Container>

      <Provider>
        <Portal>
          <Modal visible={showAddModal} onDismiss={() => setShowAddModal(false)} style={{margin: 20}}>
            <Card>
              <Card.Content>
                <ShortList
                    data={ownableOptions}
                    renderItem={({item}) => renderOwnableOption(item)}
                />
              </Card.Content>
              <Card.Actions>
                <Button onPress={importOwnable} style={{width: '100%'}}>Import</Button>
              </Card.Actions>
            </Card>
          </Modal>
        </Portal>

        <PageFAB onPress={() => { setShowAddModal(true) }} />
      </Provider>
    </>
  )
}
