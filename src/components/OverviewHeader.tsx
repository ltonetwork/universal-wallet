import React from "react"
import { IconButton } from "react-native-paper"
import Colors from '../constants/Colors'
import useColorScheme from '../hooks/useColorScheme'
import { HeaderContainer } from "./styles/OverviewHeader.styles"
import {View} from "react-native";

const QRButton = (props: {onPress?: () => void}): JSX.Element => (
    props.onPress ? <IconButton
        testID='qr-button'
        size={25}
        icon="qrcode-scan"
        color='#A017B7'
        onPress={props.onPress}
    /> : <></>
)

export default function OverviewHeader(props: {
    onPress?: () => void
    onQrPress?: () => void
    icon: React.ComponentProps<typeof IconButton>['icon']
    input: any
    marginLeft: number | undefined
}): JSX.Element {

    const colorScheme = useColorScheme()

    return (
        <HeaderContainer {...props}>
            <>{props.input}</>
            <View style={{flexDirection: "row"}}>
                <QRButton onPress={props.onQrPress} />
                <IconButton
                    icon={props.icon}
                    color={Colors[colorScheme].tint}
                    size={25}
                    onPress={props.onPress}
                />
            </View>
        </HeaderContainer >

    )
}
