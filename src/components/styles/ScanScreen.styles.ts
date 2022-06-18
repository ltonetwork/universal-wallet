import styled from "styled-components/native"
import {Text} from "react-native-paper"
import { BarCodeScanner } from "expo-barcode-scanner"

export const StyledScanner = styled(BarCodeScanner)`
flex: 1;
padding: 10px;
align-items: center;
justify-content: center;
width: 100%;
height: 100%;
`

export const StyledText = styled(Text)`
color: #ffffff;
font-weight: 900;
${props => props.title && `font-size: 20px; font-weight: bold;`} 
`