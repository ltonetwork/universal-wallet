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
import AsyncStorage from '@react-native-async-storage/async-storage'

export default function ImportAccountScreen({ navigation }: RootStackScreenProps<'ImportAccount'>) {
    const [isLoading, setIsLoading] = useState<boolean>(false)

    const [loginForm, setloginForm] = useState({
        nickname: '',
        password: '',
        passwordConfirmation: ''
    })

    const [passwordVisible, setPasswordVisible] = useState<boolean>(true)

    const [checked, setChecked] = useState<boolean>(false)
    const [modalVisible, setModalVisible] = useState<boolean>(false)
    const [snackbarVisible, setSnackbarVisible] = useState(false)

    const [accountAddress, setAccountAddress] = useState('')

    useEffect(() => {
        getAccountAddress()
    }, [accountAddress])

    const getAccountAddress = () => {
        LocalStorageService.getData('@accountData')
            .then(data => {
                const account = data
                setIsLoading(false)
                setAccountAddress(account.address)
            })
            .catch(err => console.log(err))
    }

    const handleInputChange = (name: string, value: string) => {
        setloginForm({ ...loginForm, [name]: value })
    }

    const getDataFromAsyncStorage = async () => {
        try {
            const value = await AsyncStorage.multiGet(['@userAlias', '@accountData'])
            if (value !== null) {
                console.log('VALORES GUARDADOS EN STORAGE: ', value)
            }
        } catch (error) {
        }
    }

    const handleImportAccount = () => {
        if (loginForm.nickname === '') {
            alert('Nickname is required')
        } else if (loginForm.password === '') {
            alert('Password is required')
        } else if (loginForm.password !== loginForm.passwordConfirmation) {
            alert('Passwords do not match')
        } else {
            LocalStorageService.storeData('@userAlias', loginForm)
                .then(() => {
                    setSnackbarVisible(true)
                    setTimeout(() => {
                        setSnackbarVisible(false)
                        navigation.navigate('Root', { screen: 'Wallet' })
                    }
                        , 2000)
                })
                .catch(err => console.log(err))
        }
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
                        style={{ marginBottom: 5 }}
                        disabled={true}
                        label="Wallet address"
                        value={accountAddress}
                    >
                    </StyledInput>

                    <StyledInput
                        style={{ marginBottom: 5 }}
                        label="Nickname"
                        placeholder='Enter your nickname...'
                        value={loginForm.nickname}
                        onChangeText={(text) => handleInputChange('nickname', text)}

                    >
                    </StyledInput>

                    <StyledInput
                        style={{ marginBottom: 5 }}
                        label="Wallet password"
                        value={loginForm.password}
                        onChangeText={(text) => handleInputChange('password', text)}
                        secureTextEntry={passwordVisible}
                        placeholder="Type your password..."
                        right={<StyledInput.Icon
                            name={passwordVisible ? "eye" : "eye-off"}
                            onPress={() => setPasswordVisible(!passwordVisible)} />}>
                    </StyledInput>

                    <StyledInput
                        label="Repeat password"
                        value={loginForm.passwordConfirmation}
                        onChangeText={(text) => handleInputChange('passwordConfirmation', text)}
                        secureTextEntry={passwordVisible}
                        placeholder="Type your password again..."
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
                        visible={modalVisible}
                        setChecked={setChecked}
                        onRequestClose={() => {
                            setModalVisible(!modalVisible)
                            setChecked(false)
                        }}
                        onClose={() => {
                            setModalVisible(!modalVisible)
                            setChecked(true)
                        }}
                    />

                    <StyledView marginTop={70}>
                        <StyledButton
                            mode="contained"
                            disabled={!checked && true}
                            uppercase={false}
                            labelStyle={{ fontWeight: '400', fontSize: 16, width: '100%' }}
                            onPress={() => handleImportAccount()
                            }>
                            Import your account
                        </StyledButton>
                    </StyledView>
                    {snackbarVisible && <SnackbarMessage text={'Wallet imported!'} />}
                </StyledView >

            }
        </>
    )
}


