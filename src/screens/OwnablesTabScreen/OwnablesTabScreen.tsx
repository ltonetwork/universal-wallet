import React, { useState} from 'react'
import { ImageBackground, useWindowDimensions } from 'react-native'
import { RootTabScreenProps } from '../../../types'
import OverviewHeader from '../../components/OverviewHeader'
import PlusButton from '../../components/PlusButton'
import StatusBarIOS from '../../components/StatusBarIOS'
import { Container, MainTitle } from '../../components/styles/NextFunctionality.styles'
import { OWNABLES } from '../../constants/Text'
import { backgroundImage } from '../../utils/images'
import DocumentPicker, { isInProgress, types } from 'react-native-document-picker'
import PackageService from '../../services/Package.service'
import WASMService from '../../services/WASM.service'
import { Modal, Portal, Button, Provider, List } from 'react-native-paper'
import {useFocusEffect} from "@react-navigation/native";

export default function OwnablesTabScreen({ navigation }: RootTabScreenProps<'Ownables'>) {

  const { width, height } = useWindowDimensions()

  const [showAddModal, setShowAddModal] = React.useState(false)
  const [ownableOptions, setOwnableOptions] = useState<{id: string, key: string, name: string}[]>([])

  const containerStyle = {backgroundColor: 'white', padding: 20}

  useFocusEffect(
      React.useCallback(() => { loadOwnableOptions() },[])
  )

  const importOwnable = async () => {
    try {
      const pickerResult = await DocumentPicker.pickSingle({
        presentationStyle: 'fullScreen',
        type: [types.allFiles],
        copyTo: 'documentDirectory'
      })
      await PackageService.importOwnable(pickerResult)
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
    PackageService.getOwnableOptions().then(setOwnableOptions)
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
        <Button onPress={importOwnable}>Select file</Button>
      </Container>

      <Provider>
        <Portal>
          <Modal visible={showAddModal} onDismiss={() => setShowAddModal(false)} contentContainerStyle={containerStyle}>
            <List.Section>
              <List.Subheader>Available Ownables</List.Subheader>
              {ownableOptions.map((item) => {
                item.key = item.id
                return (
                  <List.Item
                    onPress={async () => {
                      console.log(`issuing ${item.name}`)
                      await WASMService.spawnWASMThread(item.name)
                      setShowAddModal(false)
                    }}
                    title={item.name}
                  />
                )
              })}
            </List.Section>
            <Button
              onPress={importOwnable}
            >Import</Button>
          </Modal>
        </Portal>
        <PlusButton onPress={() => { setShowAddModal(true) }} />
      </Provider>
    </>
  )
}
