import { Card, Paragraph, Title } from 'react-native-paper'
import styled from 'styled-components/native'
import { Platform } from 'react-native'

export const OverviewContainer = styled.SafeAreaView`
    align-content: center;
    margin-top: -1px;
`

export const AmountContainer = styled.View`
    flex-direction: row;
    align-items: baseline;
`

export const TopCardsContainer = styled.View`
    display: flex;
    margin-top: 0px;
    flex-direction: row;
    justify-content: space-around;
    width: 100%;
    height: 120px;
    background-color: #ffffff;
    border-width: 1px;
    border-color: #ffffff;
    border-bottom-right-radius: 25px;
    border-bottom-left-radius: 25px;
    elevation: 1;
`

export const TopCard = styled(Card)`
    width: auto;
    height: auto;
    box-shadow: 0px 0px 0px #ffffff;
`

export const BottomCardsContainer = styled.View`
    margin-top: 20px;
    flex-direction: row;
    justify-content: space-evenly;
    width: 100%;
    height: auto;
`

export const BottomCard = styled(Card)`
    shadow-color: #E1F9FC;
    shadow-offset: 5px 9px;
    shadow-opacity: 0.5;
    box-shadow: 10px 5px 5px #E1F9FC;
    shadow-radius: 10px;
    border-radius: 20px;
    elevation: 5;
    width: 160px;
    height: auto;
`

export const FieldName = styled(Paragraph)`
    opacity: 0.5;
`

export const BlueText = styled(Paragraph)`
    color: #3BCDE3;
`

export const RedText = styled(Paragraph)`
    color: #DD4794;
`

export const GreenText = styled(Paragraph)`
    color: #009E73;
`

export const Amount = styled(Title)`
    font-family: ${Platform.OS === 'android' ? 'Overpass-Regular' : 'Arial'};
    font-size: 23px;
    font-weight: 400;
`
