import { useState } from 'react'
import { StyledText, StyledTitle, StyledView } from '../components/styles/Signin.styles'
import { StyledButton } from '../components/styles/StyledButton.styles'
import { StyledInput } from '../components/styles/StyledInput.styles'
import { RootStackScreenProps } from '../types'

// const factory = require('@ltonetwork/lto').AccountFactoryED25519

// const privateKey = process.env.PRIVATE_KEY

// let account = new factory('T').createFromPrivateKey(privateKey)


export default function SignInScreen({ navigation }: RootStackScreenProps<'SignIn'>) {
    const [password, setPassword] = useState("")
    const [passwordVisible, setPasswordVisible] = useState(true)

    const handleSignIn = () => { }


    return (
        <StyledView>

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

                {/* The icon eye to show or hide the password is not in the sketch, ask if we are going to include it */}

            </StyledInput>

            <StyledView flexEnd>
                <StyledButton
                    mode="contained"
                    uppercase={false}
                    labelStyle={{ fontWeight: '400', fontSize: 16, width: '100%' }}
                    onPress={() => navigation.navigate('Import')}>
                    Sign in
                </StyledButton>

                <StyledButton
                    mode="outlined"
                    uppercase={false}
                    labelStyle={{ fontWeight: '400', fontSize: 16, width: '100%' }}
                    onPress={() => navigation.navigate('Scan')}>
                    Import your account
                </StyledButton>

            </StyledView>
        </StyledView>
    )
}

