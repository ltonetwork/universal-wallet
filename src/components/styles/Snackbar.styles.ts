import styled from "styled-components/native"
import { Snackbar } from "react-native-paper"
import { Dimensions } from "react-native"

export const SnackbarContainer = styled.View`
    flex: 1;
    position: absolute;
    justify-content: space-between;
    width: 100%;
    height: ${Dimensions.get("window").height * 0.9}px;
    
`

export const StyledSnackbar = styled(Snackbar)`
    background-color: #0092AA;
    borderRadius: 10px;
   
`
