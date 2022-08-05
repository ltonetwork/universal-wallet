import { Card } from 'react-native-paper'
import styled from 'styled-components/native'

export const OverviewContainer = styled.SafeAreaView`
    align-content: center;
    margin-top: 20px;
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
    shadow-color: #A9F2F7;
    shadow-offset: 5px 9px;
    shadow-opacity: 0.5;
    box-shadow: 10px 5px 5px #A9F2F7;
    shadow-radius: 10px;
    border-radius: 20px;
    elevation: 5;
    width: 160px;
    height: auto;
`
