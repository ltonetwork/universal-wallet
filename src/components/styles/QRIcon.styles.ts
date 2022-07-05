import styled from "styled-components/native"
import { IconButton } from "react-native-paper"
import { Dimensions } from "react-native"

export const QRIcon = styled(IconButton)`
    flex: 1;
    background-color: #A017B7;
    border-radius: 60px;
    width: 60px;
    height: 60px;
    margin-top: ${Dimensions.get("window").height * 0.65}px;
    margin-left: ${Dimensions.get("window").width * 0.78}px;
    elevation: 5;
    position: absolute;
`