import React from 'react'
import { Button } from 'react-native-paper'

export default function ModalButtons(props: { onPress: () => void, text: string }) {
    return (
        <Button
            mode={"outlined"}
            color={'#A017B7'}
            uppercase={false}
            labelStyle={{ fontWeight: '400', fontSize: 15, color: '#303030' }}
            contentStyle={{ height: 45, justifyContent: 'flex-start' }}
            style={{ borderColor: 'transparent', width: 250, borderRadius: 20, marginBottom: 10 }}
            onPress={props.onPress}
        >{props.text}</Button>
    )
}

