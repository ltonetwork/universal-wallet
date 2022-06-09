import styled from "styled-components/native"
import {Text} from "react-native-paper"
import { BarCodeScanner } from "expo-barcode-scanner"

export const StyledScanner = styled(BarCodeScanner)`
flex: 1;
padding: 10px;
align-items: center;
justify-content: center;
`

export const StyledText = styled(Text)`
background-color: '#000000';
color: '#fffff;'
`