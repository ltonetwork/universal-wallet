import React from 'react'
import { PlusIcon } from './styles/PlusIcon.styles'


export default function PlusButton(props: { onPress: () => void, }): JSX.Element {

    return (
        <PlusIcon
            testID='plus-button'
            size={30}
            icon="plus"
            color='#ffffff'
            onPress={props.onPress} />
    )
}

