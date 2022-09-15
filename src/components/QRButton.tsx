import React from 'react'
import { QRIcon } from './styles/QRIcon.styles'


export default function QRButton(props: { onPress: () => void, }): JSX.Element {

    return (
        <QRIcon
            testID='qr-button'
            size={30}
            icon="qrcode-scan"
            color='#ffffff'
            onPress={props.onPress} />
    )
}

