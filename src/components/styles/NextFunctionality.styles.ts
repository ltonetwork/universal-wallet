import { Dimensions, Platform } from "react-native"
import { Title } from "react-native-paper"
import styled from "styled-components/native"

export const Container = styled.SafeAreaView`
    margin-top: 0px;
`

export const StyledView = styled.View`
    align-items: center;
    margin-top: 0px;
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
    font-size: ${Platform.OS === 'android' ? '17px' : '15px'}
    font-weight: bold;
    margin-top: 5px;
`

export const StyledText = styled.Text`
    color: #000000;
    font-size: ${Platform.OS === 'android' ? '14px' : '13px'}
    margin-top: 5px;
`

export const MainTitle = styled(Title)`
    font-size: 22px;
    font-weight: bold;
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
`

