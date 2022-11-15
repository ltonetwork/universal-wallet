import {Pressable} from "react-native";
import React, {useContext, useEffect} from "react";
import {useClipboard} from "@react-native-community/clipboard";
import {MessageContext} from "../context/UserMessage.context";

export default function PressToCopy(props: { value: string, onPress?: () => void, children: any }): JSX.Element {
    const [data, setString] = useClipboard()
    const onPress = props.onPress || (() => {});

    useEffect(() => {
        setString(data)
    }, [data])

    const { setShowMessage, setMessageInfo } = useContext(MessageContext)

    const copyToClipboard = (data: string) => {
        setString(data)
        setShowMessage(true)
        setMessageInfo('Copied to clipboard!')
    }

    return (<Pressable
        style={({ pressed }) => [{ opacity: pressed ? 0.5 : 1.0 }]}
        onPress={onPress}
        onLongPress={() => copyToClipboard(props.value)}>
        {props.children}
    </Pressable>);
}
