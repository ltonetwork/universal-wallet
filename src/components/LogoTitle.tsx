import React from "react"
import { logoTitle } from "../utils/images"
import { StyledImage } from "./styles/LogoTitle.styles"
import { IconButton } from "react-native-paper"
import useColorScheme from '../hooks/useColorScheme'
import Colors from '../constants/Colors'
import { useNavigation } from "@react-navigation/native"
import { View } from "react-native"
import { Text } from "react-native-paper"


export default function LogoTitle(props: any): JSX.Element {

  const colorScheme = useColorScheme()
  const navigation = useNavigation()

  return (
    <View style={{ justifyContent: 'space-between', flexDirection: 'row', marginTop: 23, backgroundColor: '#ffffff', height: 60, paddingTop: 10 }}>
      <>{props.input}</>
      <IconButton
        icon="menu"
        color={Colors[colorScheme].tint}
        size={25}
        onPress={() => navigation.navigate('Modal')}
      />
    </View >

  )
}