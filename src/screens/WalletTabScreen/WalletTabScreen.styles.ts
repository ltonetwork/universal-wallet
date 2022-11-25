import { Card, Paragraph, Title } from 'react-native-paper'
import styled from 'styled-components/native'
import { Platform } from 'react-native'

export const OverviewContainer = styled.SafeAreaView`
    align-content: center;
    margin-top: 1px;
`

export const AmountContainer = styled.View`
    flex-direction: row;
    align-items: baseline;
`

export const TopCardsContainer = styled.View`
    display: flex;
    margin-top: 2px;
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
    box-shadow: 0 0 0 transparent;
`

export const BottomCardsContainer = styled.View`
    margin-top: 20px;
    flex-direction: row;
    justify-content: space-evenly;
    width: 100%;
    height: auto;
`

export const BottomCard = styled(Card)`
    box-shadow: 0 0 0 transparent;
    width: 130px;
    height: auto;
    background-color: transparent;
`

export const ActivityCard = styled(Card)`
    margin: 20px;
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
