import React, { useEffect, useState } from 'react'
import { RootStackScreenProps } from '../../types'
import Spinner from '../components/Spinner'
import { StyledTitle, StyledView } from '../components/styles/Signin.styles'
import { StyledButton } from '../components/styles/StyledButton.styles'
import { StyledInput } from '../components/styles/StyledInput.styles'
import LocalStorageService from '../services/LocalStorage.service'

export default function ImportAccountScreen2({ navigation }: RootStackScreenProps<'Import2'>) {
    const [isLoading, setIsLoading] = useState(false)
    const [password, setPassword] = useState("")
    const [passwordVisible, setPasswordVisible] = useState(true)
    const [account, setAccount] = useState<string | Account>()

    interface Account {
        address: string
        privateKey: string
        publicKey: string
        balance: number
        nonce: number
    }

    useEffect(() => {
        getAccount()
    }, [])

    const getAccount = () => {
        LocalStorageService.getData('storageKey')
            .then(data => {
                const factory = require('@ltonetwork/lto').AccountFactoryED25519
                const account = new factory('T').createFromPrivateKey(data)
                setAccount(account)
                setIsLoading(false)
            })
            .catch(err => console.log(err))
    }

    const getAccountAddress = () => {
        return account?.address.toString()
    }

    return (
        <>
            {isLoading
                ?
                <Spinner />
                :
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

                    {/* Put a checkbox with the text Accept terms and conditions (where are they?) */}

                    <StyledView flexEnd>

                        <StyledButton
                            mode="contained"
                            disabled={false} // must be disable until we implement the import words
                            uppercase={false}
                            labelStyle={{ fontWeight: '400', fontSize: 16, width: '100%' }}
                            onPress={() => navigation.navigate('Root', { screen: 'Wallet' })}>
                            Import your account
                        </StyledButton>
                    </StyledView>
                </StyledView >

            }
        </>
    )
}
