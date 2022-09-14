import React from 'react'
import { View } from 'react-native'
import { Checkbox } from 'react-native-paper'


export default function CheckBox(props: {
    onPress: () => void,
    status: 'checked' | 'unchecked' | 'indeterminate',
}): JSX.Element {

    return (
        <View>
            <Checkbox.Item
                style={{ paddingRight: 30 }}
                position='leading'
                onPress={() => props.onPress()}
                color={'#A017B7'}
                label="Accept terms and conditions"
                labelStyle={{ color: '#A017B7' }}
                status={props.status} />
        </View>
    )
}

