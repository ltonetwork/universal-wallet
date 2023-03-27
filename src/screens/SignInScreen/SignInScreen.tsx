import React, { useContext, useEffect, useState } from 'react'
import { RootStackScreenProps } from '../../../types'
import { StyledButton } from '../../components/styles/StyledButton.styles'
import { StyledInput } from '../../components/styles/StyledInput.styles'
import { MessageContext } from '../../context/UserMessage.context'
import LocalStorageService from '../../services/LocalStorage.service'
import { ButtonContainer, Container, InputContainer, StyledText, StyledTitle } from './SignInScreen.styles'
import LTOService from '../../services/LTO.service'
import * as LocalAuthentication from 'expo-local-authentication'
import { getPassword } from '../../utils/keychain'
import { SIGNIN } from '../../constants/Text'

export default function SignInScreen({ navigation }: RootStackScreenProps<'SignIn'>) {
    const [userAlias, setUserAlias] = useState<any>()
    const [password, setPassword] = useState<string>('')
    const [passwordVisible, setPasswordVisible] = useState<boolean>(true)
    const { setShowMessage, setMessageInfo } = useContext(MessageContext)

    useEffect(() => {
        getAlias()
    }, [])

    const getAlias = () => {
        LocalStorageService.getData('@userAlias')
            .then((data) => {
                setUserAlias(data)
            })
            .catch((error) => {
                throw new Error(`Error retrieving user data. ${error}`)
            })
    }

    const validateForm = (): { err?: string } => {
        if (!userAlias?.nickname) {
            return { err: 'Please import your account first!' }
        }
        if (password === '') {
            return { err: 'Password is required!' }
        }

        return {}
    }

    const handleSignIn = () => {
        const { err } = validateForm()

        if (err) {
            setMessageInfo(err)
            setShowMessage(true)
            return
        }

        LTOService.unlock(password)
            .then(() => {
                navigation.navigate('Root')
                setPassword('')
            })
            .catch(() => {
                setMessageInfo('Wrong password!')
                setShowMessage(true)
            })
    }

    useEffect(() => {
        const authenticateWithBiometrics = async (): Promise<void> => {
            try {
                const hasHardware: boolean = await LocalAuthentication.hasHardwareAsync()
                const isEnrolled: boolean = await LocalAuthentication.isEnrolledAsync()

                if (!hasHardware) {
                    throw new Error('Biometric authentication not available')
                }

                const passCode: string | null = await getPassword()

                if (!passCode) {
                    throw new Error('Unable to retrieve password')
                }

                if (isEnrolled) {
                    const result = await LocalAuthentication.authenticateAsync({
                        promptMessage: 'Enter your pin',
                        cancelLabel: 'Cancel',
                    })

                    if (!result.success) {
                        throw new Error('Authentication failed')
                    }

                    if (passCode) {
                        await LTOService.unlock(passCode)
                        navigation.navigate('Root')
                    }
                }
            } catch (error: unknown) {
                setMessageInfo('Biometric authentication failed!')
                setShowMessage(true)
                console.error(`Error during biometric authentication: ${error}`)
            }
        }
        authenticateWithBiometrics()
    }, [])


    return (
        <Container>
            <InputContainer>
                <StyledTitle>{SIGNIN.TITLE}</StyledTitle>
                <StyledText>{SIGNIN.SUBTITLE}</StyledText>
                {userAlias?.nickname !== undefined && (
                    <StyledInput
                        mode={'flat'}
                        style={{ marginBottom: 5 }}
                        disabled={true}
                        label={SIGNIN.INPUT_NICKNAME.LABEL}
                        value={userAlias?.nickname}
                    ></StyledInput>
                )}
                <StyledInput
                    label={SIGNIN.INPUT_PASSWORD.LABEL}
                    value={password}
                    onChangeText={(password) => setPassword(password)}
                    secureTextEntry={passwordVisible}
                    placeholder={SIGNIN.INPUT_PASSWORD.PLACEHOLDER}
                    right={
                        <StyledInput.Icon
                            name={passwordVisible ? 'eye' : 'eye-off'}
                            onPress={() => setPasswordVisible(!passwordVisible)}
                        />
                    }
                ></StyledInput>
            </InputContainer>

            <ButtonContainer>
                <StyledButton
                    mode='contained'
                    color='#A017B7'
                    uppercase={false}
                    labelStyle={{ fontWeight: '400', fontSize: 16, width: '100%' }}
                    onPress={() => handleSignIn()}
                >
                    Sign in
                </StyledButton>
            </ButtonContainer>
        </Container>
    )
}
