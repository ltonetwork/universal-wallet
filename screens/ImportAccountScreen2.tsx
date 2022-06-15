import { LTO } from '@ltonetwork/lto'
import React, { useEffect, useState } from 'react'
import { StyledTitle, StyledView } from '../components/styles/Signin.styles'
import { StyledButton } from '../components/styles/StyledButton.styles'
import { StyledInput } from '../components/styles/StyledInput.styles'
import LocalStorageService from '../services/LocalStorage.service'
import { RootStackScreenProps } from '../types'


export default function ImportAccountScreen2({ navigation }: RootStackScreenProps<'Import2'>) {
    const [password, setPassword] = useState("")
    const [passwordVisible, setPasswordVisible] = useState(true)
    const [account, setAccount] = useState()

    useEffect(() => {
        LocalStorageService.getData('storageKey')
            .then(data => {
                const factory = require('@ltonetwork/lto').AccountFactoryED25519
                const acc = new factory('T').createFromPrivateKey(data)
                setAccount(acc)
                console.log("yourKey Value:  " + data)
            }
            )
            .catch(err => console.log(err))
    }
        , [])


    const getAccountBalance = () => {
        const lto = new LTO('T')
        lto.getBalance(account)
            .then(data => {
                console.log('test1', data)
                return data

            })
            .catch(err => console.log(err))
    }

    const getAccountAddress = () => {
        return account?.address.toString()
    }

    return (
        <StyledView marginTop={'0'}>

            <StyledTitle>Import account</StyledTitle>

            <StyledInput
                mode={'flat'}
                disabled={true}
                style={{ marginBottom: 15, backgroundColor: '#F5F5F5' }}
                label="Nickname"
                value={'@johndoe'}
            >
            </StyledInput>

            <StyledInput
                mode={'flat'}
                style={{ marginBottom: 15, backgroundColor: '#F5F5F5' }}
                disabled={true}
                label="Wallet address"
                value={getAccountAddress()}
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
                    onPress={() => {
                        console.log('tes2', getAccountBalance())
                        console.log('Victory!:', account)
                        navigation.navigate('Root', { screen: 'Wallet', params: { params: 'account' } })
                    }}>
                    Import your account
                </StyledButton>

            </StyledView>
        </StyledView >
    )
}
