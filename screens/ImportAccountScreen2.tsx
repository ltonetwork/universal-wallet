import React, { useState } from 'react'
import { StyledTitle, StyledView } from '../components/styles/Signin.styles'
import { StyledButton } from '../components/styles/StyledButton.styles'
import { StyledInput } from '../components/styles/StyledInput.styles'
const factory = require('@ltonetwork/lto').AccountFactoryED25519


export default function ImportAccountScreen2({ route }) {
    const [password, setPassword] = useState("")
    const [passwordVisible, setPasswordVisible] = useState(true)

    const scanData = route.params.data
    const account = new factory('T').createFromPrivateKey(scanData)


    const unitArray = account.cypher.encrypt.privateKey
    // let string = new TextDecoder("utf-8").decode(unitArray)


    return (
        <StyledView marginTop={'0'}>

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
                placeholder="Type your password..."
                right={<StyledInput.Icon
                    name={passwordVisible ? "eye" : "eye-off"}
                    onPress={() => setPasswordVisible(!passwordVisible)} />}>
            </StyledInput>

            {/* The icon eye to show or hide the password is not in the sketch, ask if we are going to include it */}
            {/* Put a checkbox with the text Accept terms and conditions (where are they?) */}
            <StyledView flexEnd>

                <StyledButton
                    mode="contained"
                    disabled={false} // must be disable until we implement the import words
                    uppercase={false}
                    labelStyle={{ fontWeight: '400', fontSize: 16, width: '100%' }}
                    onPress={() => console.log(unitArray)}>
                    Import your account
                </StyledButton>

            </StyledView>
        </StyledView >
    )
}
