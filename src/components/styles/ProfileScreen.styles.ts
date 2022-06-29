import styled from "styled-components/native"
import { Card, Paragraph, Title } from "react-native-paper"
Title

export const CardsContainer = styled.SafeAreaView`
    margin-top: 5px;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: auto;
    height: auto;
`

export const StyledTitle = styled(Title)`
font-weight: bold;
`

export const MainCard = styled(Card)`
margin-top: 10px;
    shadow-color: #A9F2F7;
    shadow-offset: 5px 9px;
    shadow-opacity: 0.5;
    box-shadow: 10px 5px 5px #A9F2F7;
    shadow-radius: 10px;
    border-radius: 20px;
    elevation: 5;
    width: 350px;
    height: auto;
    
`

export const Field = styled(Paragraph)`
    color: #cccccc;
    `

export const Content = styled(Paragraph)`
    font-size: 15px;
    font-weight: bold;
`