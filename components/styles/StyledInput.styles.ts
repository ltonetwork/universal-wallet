import styled from "styled-components/native"
import { TextInput } from "react-native-paper"

export const StyledInput = styled(TextInput)`
background-color: 'transparent';
${props => props.marginTop && `margin-top: ${props.marginTop}px;`}
`
// ${props => props.bottom && `margin-bottom: 70px;`}