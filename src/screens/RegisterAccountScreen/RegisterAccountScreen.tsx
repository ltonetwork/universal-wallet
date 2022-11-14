import React, { useContext, useEffect, useState } from 'react'
import { RootStackScreenProps } from '../../../types'
import CheckBox from '../../components/CheckBox'
import Spinner from '../../components/Spinner'
import { ButtonContainer, Container, InputContainer, StyledTitle } from './RegisterAccountScreen.styles'
import { StyledButton } from '../../components/styles/StyledButton.styles'
import { StyledInput } from '../../components/styles/StyledInput.styles'
import TermsModal from '../../components/TermsModal'
import { MessageContext } from '../../context/UserMessage.context'
import LocalStorageService from '../../services/LocalStorage.service'
import { View } from 'react-native'
import { REGISTER } from '../../constants/Text'


export default function RegisterAccountScreen({ navigation, route }: RootStackScreenProps<'RegisterAccount'>) {
    const [isLoading, setIsLoading] = useState<boolean>(true)

    const [loginForm, setloginForm] = useState({
        nickname: '',
        password: '',
        passwordConfirmation: ''
    })

    const [passwordVisible, setPasswordVisible] = useState<boolean>(true)
    const [repeatedPasswordVisible, setRepeatedPasswordVisible] = useState<boolean>(true)
    const [checked, setChecked] = useState<boolean>(false)
    const [modalVisible, setModalVisible] = useState<boolean>(false)
    const [accountAddress, setAccountAddress] = useState('')
    const { setShowMessage, setMessageInfo } = useContext(MessageContext)

    useEffect(() => {
        getAccountAddress()
    }, [accountAddress])

    const getAccountAddress = () => {
        LocalStorageService.getData('@accountData')
            .then(data => {
                if (data === null) {
                    setShowMessage(true)
                    setMessageInfo('Error creating/importing your account!')
                    navigation.goBack()
                } else {
                    const account = data
                    setIsLoading(false)
                    setAccountAddress(account[0]?.address)
                }
            })
            .catch(error => {
                throw new Error(`Error retrieving data. ${error}`)
            })
    }

    const handleInputChange = (name: string, value: string) => {
        setloginForm({ ...loginForm, [name]: value })
    }

    const handleImportAccount = () => {
        if (loginForm.nickname === '') {
            setShowMessage(true)
            setMessageInfo('Nickname is required!')
        } else if (loginForm.nickname.includes(' ') && loginForm.nickname.length < 3) {
            setShowMessage(true)
            setMessageInfo('Nickname must be at least 3 characters long!')
        } else if (loginForm.password === '') {
            setShowMessage(true)
            setMessageInfo('Password is required!')
        } else if (loginForm.password.includes(' ') && loginForm.password.length < 3) {
            setShowMessage(true)
            setMessageInfo('Password must be at least 3 characters long!')
        } else if (loginForm.password !== loginForm.passwordConfirmation) {
            setShowMessage(true)
            setMessageInfo('Passwords do not match!')
        } else if (!checked) {
            setShowMessage(true)
            setMessageInfo('To continue accept terms and conditions!')
        } else {
            LocalStorageService.storeData('@userAlias', loginForm)
                .then(() => {
                    setIsLoading(true)
                    setShowMessage(true)
                    if (route.params.data === 'created') {
                        setMessageInfo('Account created succesfully!')
                        setShowMessage(true)
                        setTimeout(() => {
                            navigation.navigate('Root')
                        }, 1000)

                    } else {
                        setMessageInfo('Account imported succesfully!')
                        setShowMessage(true)
                        setTimeout(() => {
                            navigation.navigate('Root')
                        }, 1000)
                    }
                })
                .catch(error => {
                    throw new Error(`Error storing account data. ${error}`)
                })
        }
    }

    return (
        <>
            {isLoading
                ?
                <Spinner />
                :
                <Container>
                    <InputContainer>
                        <View>
                            {route.params.data === 'created'
                                ?
                                <StyledTitle>{REGISTER.CREATE_TITLE}</StyledTitle>
                                :

                                <StyledTitle>{REGISTER.IMPORT_TITLE}</StyledTitle>
                            }
                        </View>
                        <StyledInput
                            mode={'flat'}
                            style={{ marginBottom: 5 }}
                            disabled={true}
                            label={REGISTER.INPUT_ADDRESS}
                            value={accountAddress}
                        >
                        </StyledInput>

                        <StyledInput
                            style={{ marginBottom: 5 }}
                            label={REGISTER.INPUT_NICKNAME.LABEL}
                            placeholder={REGISTER.INPUT_NICKNAME.PLACEHOLDER}
                            value={loginForm.nickname}
                            onChangeText={(text) => handleInputChange('nickname', text)}
                        >
                        </StyledInput>

                        <StyledInput
                            style={{ marginBottom: 5 }}
                            label={REGISTER.INPUT_PASSWORD.LABEL}
                            value={loginForm.password}
                            onChangeText={(text) => handleInputChange('password', text)}
                            secureTextEntry={passwordVisible}
                            placeholder={REGISTER.INPUT_PASSWORD.PLACEHOLDER}
                            right={<StyledInput.Icon
                                name={passwordVisible ? "eye" : "eye-off"}
                                onPress={() => setPasswordVisible(!passwordVisible)} />}>
                        </StyledInput>

                        <StyledInput
                            label={REGISTER.INPUT_PASSWORD_REPEAT.LABEL}
                            value={loginForm.passwordConfirmation}
                            onChangeText={(text) => handleInputChange('passwordConfirmation', text)}
                            secureTextEntry={repeatedPasswordVisible}
                            placeholder={REGISTER.INPUT_PASSWORD_REPEAT.PLACEHOLDER}
                            right={<StyledInput.Icon
                                name={repeatedPasswordVisible ? "eye" : "eye-off"}
                                onPress={() => setRepeatedPasswordVisible(!repeatedPasswordVisible)} />}>
                        </StyledInput>

                        <CheckBox
                            status={checked ? 'checked' : 'unchecked'}
                            onCheck={() => {
                                !checked && setModalVisible(true)
                                setChecked(!checked)
                            }}
                            onPressText={() => setModalVisible(true)} />

                        <TermsModal
                            visible={modalVisible}
                            onRequestClose={() => {
                                setModalVisible(!modalVisible)
                                setChecked(false)
                            }}
                            onClose={() => {
                                setModalVisible(!modalVisible)
                                setChecked(true)
                            }}
                        />
                    </InputContainer>

                    <ButtonContainer marginBottom={50}>
                        {route.params.data === 'created'
                            ?
                            <StyledButton
                                mode="contained"
                                disabled={false}
                                uppercase={false}
                                labelStyle={{ fontWeight: '400', fontSize: 16, width: '100%' }}
                                onPress={() => handleImportAccount()
                                }>
                                {REGISTER.BUTTON_CREATE}
                            </StyledButton>
                            :
                            <StyledButton
                                mode="contained"
                                disabled={false}
                                uppercase={false}
                                labelStyle={{ fontWeight: '400', fontSize: 16, width: '100%' }}
                                onPress={() => handleImportAccount()
                                }>
                                {REGISTER.BUTTON_IMPORT}
                            </StyledButton>
                        }
                    </ButtonContainer>
                </Container >

            }
        </>
    )
}


