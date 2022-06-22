import React from "react"
import { TouchableOpacity } from "react-native"
import { StyledIcon } from "./styles/NextFunctionality.styles"

export default function SocialMediaIcon(props: { onPress: () => void, source: any }) {
    return (
        <TouchableOpacity onPress={props.onPress}>
            <StyledIcon testID='social-media-icon' source={props.source} />
        </TouchableOpacity>
    )
}

