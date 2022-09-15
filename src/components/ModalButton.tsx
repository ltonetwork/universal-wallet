import React from 'react'
import { Button } from 'react-native-paper'

export default function ModalButton(props: { onPress: () => void, text: string }): JSX.Element {


    return (
        <Button
            mode={"text"}
            color={'#A017B7'}
            uppercase={false}
            labelStyle={{ fontWeight: '400', fontSize: 15, color: '#303030' }}
            contentStyle={{ height: 45, justifyContent: 'flex-start' }}
            style={{ width: 300, borderRadius: 20, marginBottom: 10 }}
            onPress={props.onPress}
        >{props.text}</Button>
    )
}