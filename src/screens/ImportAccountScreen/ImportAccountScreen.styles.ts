import styled from "styled-components/native"
import { Text, Title } from "react-native-paper"


export const StyledView = styled.View<{ flexEnd?: boolean, marginTop?: number }>`
    flex: 1;
    margin: 0px 40px 20px 40px;
    ${props => props.flexEnd && `justify-content: flex-end;`}
    ${props => props.marginTop && `margin-top: ${props.marginTop}px;`}
`

export const StyledText = styled(Text)`
    margin-top: 40px;
`
export const StyledTitle = styled(Title)`
    margin-bottom: 10px;
    margin-top: -10px;
    font-family: Overpass-Regular;
    font-family: Arial;
    text-transform: uppercase;
`