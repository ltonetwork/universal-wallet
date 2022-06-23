import React, { useState } from 'react'
import { RootStackScreenProps } from '../../types'
import { StyledText, StyledTitle, StyledView } from '../components/styles/Signin.styles'
import { StyledButton } from '../components/styles/StyledButton.styles'
import { StyledInput } from '../components/styles/StyledInput.styles'


export default function SignInScreen({ navigation }: RootStackScreenProps<'SignIn'>) {
    const [password, setPassword] = useState("")
    const [passwordVisible, setPasswordVisible] = useState(true)

    const handleSignIn = () => { }

    return (
        <StyledView marginTop={70}>

            <StyledTitle>Sign in</StyledTitle>

            <StyledText>Sign in with your account name and password</StyledText>

            <StyledInput
                style={{ marginBottom: 70, marginTop: 15 }}
                label="Wallet password"
                value={password}
                onChangeText={password => setPassword(password)}
                secureTextEntry={passwordVisible}
                placeholder="Type your password"
                right={<StyledInput.Icon
                    name={passwordVisible ? "eye" : "eye-off"}
                    onPress={() => setPasswordVisible(!passwordVisible)} />}
            >

            </StyledInput>

            <StyledView flexEnd>
                <StyledButton
                    mode="contained"
                    uppercase={false}
                    labelStyle={{ fontWeight: '400', fontSize: 16, width: '100%' }}
                    onPress={() => navigation.navigate('Root')}>
                    Sign in
                </StyledButton>

                <StyledButton
                    mode="outlined"
                    uppercase={false}
                    labelStyle={{ fontWeight: '400', fontSize: 16, width: '100%' }}
                    onPress={() => navigation.navigate('ScanKey')}>
                    Import your account
                </StyledButton>

            </StyledView>
        </StyledView>
    )
}

