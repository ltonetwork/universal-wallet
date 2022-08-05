import React from 'react'
import { View } from 'react-native'
import { Checkbox } from 'react-native-paper'

export default function CheckBox(props: {
    onPress: () => void,
    status: 'checked' | 'unchecked' | 'indeterminate',
}) {
    return (
        <View>
            <Checkbox.Item
                style={{ backgroundColor: '#ffffff' }}
                position='leading'
                onPress={() => props.onPress()}
                color={'#A017B7'}
                label="Accept terms and conditions"
                status={props.status} />
        </View>
    )
}

