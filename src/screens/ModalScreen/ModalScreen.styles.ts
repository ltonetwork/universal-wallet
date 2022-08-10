import { Dimensions } from "react-native"
import { Card, Paragraph } from "react-native-paper"
import styled from "styled-components/native"


export const Container = styled.SafeAreaView`
    background-color: #ffffff;
    padding-top: 20px;
`

export const InfoContainer = styled.View`
    flex-direction: column;
    align-self: center;;
    width: ${Dimensions.get("window").width * 0.8}px;
`

export const ButtonContainer = styled.View`
    margin-top: 10px;
    align-items: center;
    width: ${Dimensions.get("window").width * 1}px;
    height: ${Dimensions.get("window").height * 0.75}px;
    `

export const MainCard = styled(Card)`
    width: 370px;
    height: auto;
    margin-left: -12px;
    background-color: transparent;
    box-shadow: 0px 0px 0px #ffffff;
`

export const Field = styled(Paragraph)`
    color: #cccccc;
    `

export const StyledNickname = styled(Paragraph)`
    font-size: 15px;
    font-weight: bold;
    color: #0092aa;
    `

export const Content = styled(Paragraph)`
    font-size: 15px;
    font-weight: bold;
    color: #565656;

    `