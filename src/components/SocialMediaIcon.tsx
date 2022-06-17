import React from "react"
import { TouchableOpacity } from "react-native"
import { Image } from "react-native"
import { StyledIcon } from "./styles/NextFunctionality.styles"

export default function SocialMediaIcon(props: { onPress: () => void, source: any }) {
    return (
        <TouchableOpacity onPress={props.onPress}>
            <StyledIcon source={props.source} />
        </TouchableOpacity>
    )
}

