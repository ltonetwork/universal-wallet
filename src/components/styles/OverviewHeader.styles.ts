import styled from "styled-components/native"
import { Image } from 'react-native'

export const HeaderContainer = styled.View<{ marginLeft?: number }>`
    justify-content: space-between; 
    flex-direction: row; 
    background-color: #ffffff; 
    margin: 0 15px 0 30px;
    ${props => props.marginLeft && `margin-left: ${props.marginLeft}px;`}
`

export const StyledImage = styled(Image)`
    width: 50%;
    height: 60%;
    margin-top: 10px;
    background-color: #ffffff;
    resize-mode: contain;
`