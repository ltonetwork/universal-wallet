import styled from "styled-components/native"
import { IconButton } from "react-native-paper"
import { Dimensions } from "react-native"

export const QRIcon = styled(IconButton)`
    background-color: #A017B7;
    border-radius: 60px;
    width: 60px;
    height: 60px;
    align-items: center;
    justify-content: center;
    margin-top: ${Dimensions.get("window").height * 0.18}px;
    margin-left: ${Dimensions.get("window").width * 0.78}px;
 
    margin-bottom: 10px;
    elevation: 5;
`