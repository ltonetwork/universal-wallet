import React, { useEffect, useState } from 'react'
import { RootStackScreenProps } from '../../types'
import CheckBox from '../components/CheckBox'
import SnackbarMessage from '../components/Snackbar'
import Spinner from '../components/Spinner'
import { StyledTitle, StyledView } from '../components/styles/Signin.styles'
import { StyledButton } from '../components/styles/StyledButton.styles'
import { StyledInput } from '../components/styles/StyledInput.styles'
import TermsModal from '../components/TermsModal'
import LocalStorageService from '../services/LocalStorage.service'


export default function ImportAccountScreen({ navigation }: RootStackScreenProps<'ImportAccount'>) {
    const [isLoading, setIsLoading] = useState(false)
    const [password, setPassword] = useState("")
    const [passwordVisible, setPasswordVisible] = useState(true)
    const [checked, setChecked] = useState(false)
    const [modalVisible, setModalVisible] = useState(false)
    const [accountAddress, setAccountAddress] = useState(Object.create(null))
    const [snackbarVisible, setSnackbarVisible] = useState(false)

    useEffect(() => {
        getAccountAddress()
    }, [])

    const getAccountAddress = () => {
        LocalStorageService.getData('@accountData')
            .then(data => {
                setIsLoading(false)
                setAccountAddress(data.address)
            })
            .catch(err => console.log(err))
    }

    return (
        <>
            {isLoading
                ?
                <Spinner />
                :
                <StyledView marginTop={10}>
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
                        value={accountAddress}
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

                    <CheckBox
                        status={checked ? 'checked' : 'unchecked'}
                        onPress={() => {
                            !checked && setModalVisible(true)
                            setChecked(!checked)
                        }}
                    />

                    <TermsModal
                        modalVisible={modalVisible}
                        setChecked={setChecked}
                        visible={modalVisible}
                        onRequestClose={() => {
                            setModalVisible(!modalVisible)
                        }}
                        onClose={() => {
                            setModalVisible(!modalVisible)
                            setChecked(true)
                        }}
                    />

                    <StyledView flexEnd>

                        <StyledButton
                            mode="contained"
                            disabled={!checked && true}
                            uppercase={false}
                            labelStyle={{ fontWeight: '400', fontSize: 16, width: '100%' }}
                            onPress={() => {
                                setSnackbarVisible(true)
                                setTimeout(() => {
                                    navigation.navigate('Root', { screen: 'Wallet' })
                                }, 2000)
                            }}>
                            Import your account
                        </StyledButton>
                    </StyledView>
                    {snackbarVisible && <SnackbarMessage text={'Wallet imported!'} />}
                </StyledView >
            }
        </>
    )
}


