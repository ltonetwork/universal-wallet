import { QRIcon } from '../components/styles/QRIcon.styles'

import React from 'react'

export default function QRButton(props: { onPress: () => void, }) {
    return (
        <QRIcon
            size={30}
            icon="qrcode-scan"
            color='#ffffff'
            onPress={props.onPress} />
    )
}

