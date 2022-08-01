import { QRIcon } from './styles/QRIcon.styles'

import React from 'react'

export default function QRButton(props: { onPress: () => void, }) {
    return (
        <QRIcon
            testID='qr-button'
            size={30}
            icon="qrcode-scan"
            color='#ffffff'
            onPress={props.onPress} />
    )
}

