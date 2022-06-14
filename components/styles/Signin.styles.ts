import styled from "styled-components/native"
import {Text, Title } from "react-native-paper"


export const StyledView = styled.View`
    flex: 1;
    margin: 70px 40px 20px 40px;
    ${props => props.flexEnd && `justify-content: flex-end;`}
    ${props => props.marginTop && `margin-top: ${props.marginTop}px;`}
`

export const StyledText = styled(Text)`
    margin-top: 40px;
`
export const StyledTitle = styled(Title)`
    color: #000000;
`