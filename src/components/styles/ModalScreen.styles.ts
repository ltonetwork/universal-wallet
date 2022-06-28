import styled from "styled-components/native"
import { Dimensions, View } from "react-native"

export const InputContainer = styled.View`
    flex: 1;
    flex-direction: column;
    align-self: center;
    width: ${Dimensions.get("window").width * 0.9}px;
`

export const ButtonContainer = styled.View`
    align-items: center;
    width: 100%;
    height: ${Dimensions.get("window").height * 0.75}px;
    `