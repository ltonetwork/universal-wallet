import styled from "styled-components/native"
import { Text } from "react-native-paper"
import { BarCodeScanner } from "expo-barcode-scanner"

export const ScannerContainer = styled.View`
    flex: 1;
    flex-direction: row;
    justify-content: center;
`

export const StyledScanner = styled(BarCodeScanner)`
    flex: 1;
    padding: 10px;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
`

export const StyledText = styled(Text) <{ title?: any }>`
    color: #ffffff;
    font-weight: 900;
    ${props => props.title && `font-size: 20px; font-weight: bold;`} 
`

export const CenteredView = styled.View`
    flex: 1;
    justify-content: center;
    align-items: center;
`
