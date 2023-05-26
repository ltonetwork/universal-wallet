import styled from "styled-components/native"
import { Button } from "react-native-paper"

export const StyledButton = styled(Button)`
    margin-top: 20px;
    height: 40px;
    width: 290px;
    border-radius: 20px;
    justify-content: center;
    align-items: center;
    font-size: 16px;
    font-weight: 800;
    ${props => props.mode === `contained` && props.disabled === false
        ? `background-color: ${props.color || '#A017B7'}; border-color: ${props.color || '#A017B7'}; border-width: 1px; color: #ffffff;`
        : `border-width: 1px; color: ${props.color || '#A017B7'}; border-color: ${props.color || '#A017B7'};`};
    ${props => props.disabled === true && `border-color: transparent;`};
`
