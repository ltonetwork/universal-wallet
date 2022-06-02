import React from 'react'
import { Text, TextInput, Title } from 'react-native-paper'
import styled from 'styled-components/native'
import { StyledButton } from '../components/styles/StyledButton.styles'

export default function SignInScreen() {
    const [password, setPassword] = React.useState("")


    return (
        <StyledView>

            <StyledTitle>Sign in</StyledTitle>

            <StyledText>Sign in with your account name and password</StyledText>

            <StyledInput
                label="Wallet password"
                value={password}
                onChangeText={password => setPassword(password)}
                secureTextEntry={true}
                placeholder="Type your password"

            >

            </StyledInput>

            <StyledView flexEnd>
                <StyledButton
                    mode="contained"
                    uppercase={false}
                    labelStyle={{ fontWeight: '400', fontSize: 16, width: '100%' }}
                    onPress={() => console.log("Login with password: ", password)}>
                    Sign in
                </StyledButton>

                <StyledButton
                    mode="outlined"
                    uppercase={false}
                    labelStyle={{ fontWeight: '400', fontSize: 16, width: '100%' }}
                    onPress={() => console.log("Sign up")}>

                    Import your account
                </StyledButton>

            </StyledView>
        </StyledView>
    )
}

const StyledView = styled.View`
    flex: 1;
    margin: 70px 40px 20px 40px;
    ${props => props.flexEnd && `justify-content: flex-end;`}
`

const StyledInput = styled(TextInput)`
    margin-top: 15px;
    background-color: 'transparent';
`

const StyledText = styled(Text)`
    margin-top: 40px;
`
const StyledTitle = styled(Title)`
    color: #000000;
`
