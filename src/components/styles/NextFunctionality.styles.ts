import styled from "styled-components/native"
import { Title } from "react-native-paper"
import { Dimensions } from "react-native"

export const StyledView = styled.View`
    align-items: center;
    margin-bottom: ${Dimensions.get("window").height * 0.1}px;
    margin-left: ${Dimensions.get("window").width * 0.12}px;
    margin-right: ${Dimensions.get("window").width * 0.12}px;
 `

export const StyledImage = styled.Image`
    resize-mode: contain;
    width: ${Dimensions.get("window").width * 0.8}px;
    height: ${Dimensions.get("window").width * 0.8}px;
    justify-content: flex-start;
`

export const StyledTitle = styled(Title)`
    color: #000000;
    font-size: 17px;
    font-weight: bold;
    margin-top: 5px;
`

export const StyledIcon = styled.Image`
    resize-mode: contain;
    width: 21px;    
    height: 21px;
`

export const IconContainer = styled.View`
    flex-direction: row;
    justify-content: space-evenly;
    margin-top: 10px;
    width: 100%;
`

