import React from "react"
import { IconButton } from "react-native-paper"
import Colors from '../constants/Colors'
import useColorScheme from '../hooks/useColorScheme'
import { HeaderContainer } from "./styles/OverviewHeader.styles"

export default function OverviewHeader(props: {
  onPress?: () => void
  icon: React.ComponentProps<typeof IconButton>['icon']
  input: any
}): JSX.Element {

  const colorScheme = useColorScheme()

  return (
    <HeaderContainer>
      <>{props.input}</>
      <IconButton
        icon={props.icon}
        color={Colors[colorScheme].tint}
        size={25}
        onPress={props.onPress}
      />
    </HeaderContainer >

  )
}

// posicion icono de qr