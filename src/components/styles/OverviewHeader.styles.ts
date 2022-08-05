import styled from "styled-components/native"
import { Image } from 'react-native'

export const HeaderContainer = styled.View`
    justify-content: space-between; 
    flex-direction: row; 
    background-color: #ffffff; 
    height: 50px; 
`

export const StyledImage = styled(Image)`
    width: 50%;
    height: 60%;
    margin-top: 10px;
    background-color: #ffffff;
    resize-mode: contain;
`

export const ModalImage = styled(Image)`
    width: 190px;
    height: 180px;
    resize-mode: contain;
    position: absolute;
`