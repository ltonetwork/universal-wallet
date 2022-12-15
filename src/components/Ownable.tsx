import * as React from 'react'
import {Title} from "react-native-paper";
import {TypedOwnable} from "../interfaces/TypedOwnable";

export default function Ownable(props: {ownable: TypedOwnable, onPress?: () => void}): JSX.Element {
    const { ownable } = props

    return (
        <Title>{ownable.option.name}</Title>
    )
}
