import { Dimensions, Platform } from "react-native"
import { Title } from "react-native-paper"
import styled from "styled-components/native"

export const Container = styled.SafeAreaView`
    margin-top: 0px;
`

export const StyledView = styled.View`
    align-items: stretch;
    margin-top: 80px;
    margin-left: ${Dimensions.get("window").width * 0.12}px;
    margin-right: ${Dimensions.get("window").width * 0.12}px;
 `

export const StyledTitle = styled.Text`
    text-transform: uppercase;
    font-size: ${Platform.OS === 'android' ? '17px' : '15px'}
    font-weight: bold;
    margin-top: 5px;
`

export const StyledText = styled.Text`
    font-size: ${Platform.OS === 'android' ? '14px' : '13px'}
    margin-top: 5px;
`

export const MainTitle = styled(Title)`
    font-family: Overpass-Regular;
    font-family: Arial;
    text-transform: uppercase;
    font-size: 22px;
    margin-top: 9px;
    margin-left: ${Dimensions.get("window").width * 0.12}px;
`

export const StyledIcon = styled.Image`
    resize-mode: contain;
    width: 21px;    
    height: 21px;
    margin-top: 12px;
`

export const IconContainer = styled.View`
    flex-direction: row;
    justify-content: space-evenly;
    margin-top: 10px;
    width: 100%;
    opacity: 0.4;
`

