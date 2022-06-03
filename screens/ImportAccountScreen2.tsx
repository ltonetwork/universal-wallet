import { useState } from 'react'
import { StyledTitle, StyledView } from '../components/styles/Signin.styles'
import { StyledButton } from '../components/styles/StyledButton.styles'
import { StyledInput } from '../components/styles/StyledInput.styles'


export default function ImportAccountScreen2() {
    const [password, setPassword] = useState("")
    const [passwordVisible, setPasswordVisible] = useState(true)

    return (
        <StyledView noMarginTop>

            <StyledTitle>Import account</StyledTitle>

            <StyledInput
                mode={'flat'}
                disabled={true}
                style={{ marginBottom: 15, backgroundColor: '#F5F5F5' }}
                label="Nickname"
                value={'Imported NickName'}
            >
            </StyledInput>

            <StyledInput
                mode={'flat'}
                style={{ marginBottom: 15, backgroundColor: '#F5F5F5' }}
                disabled={true}
                label="Wallet address"
                value={'Imported Wallet address...'}
            >
            </StyledInput>

            <StyledInput
                label="Wallet password"
                value={password}
                onChangeText={password => setPassword(password)}
                secureTextEntry={passwordVisible}
                placeholder="Type your password...">

            </StyledInput>

            {/* The icon eye to show or hide the password is not in the sketch, ask if we are going to include it */}

            <StyledView flexEnd>

                <StyledButton
                    mode="contained"
                    disabled={false} // must be disable until we implement the import words
                    uppercase={false}
                    labelStyle={{ fontWeight: '400', fontSize: 16, width: '100%' }}
                    onPress={() => console.log('account')}>
                    Import your account
                </StyledButton>

            </StyledView>
        </StyledView >
    )
}
