import React, { useContext, useEffect, useState } from 'react'
import { RootStackScreenProps } from '../../../types'
import * as LocalAuthentication from 'expo-local-authentication'
import { getPassword } from '../../utils/keychain'
import LTOService from '../../services/LTO.service'
import { MessageContext } from '../../context/UserMessage.context'
import { StyledInput } from '../../components/styles/StyledInput.styles'
import { StyledButton } from '../../components/styles/StyledButton.styles'
import { ButtonContainer, Container, InputContainer, StyledText, StyledTitle } from './LockedScreen.styles'
import { LOCKED_SCREEN } from '../../constants/Text'


export default function LockedScreen({ navigation }: RootStackScreenProps<'LockedScreen'>) {

  const [password, setPassword] = useState<string>('')
  const [passwordVisible, setPasswordVisible] = useState<boolean>(true)

  const { setShowMessage, setMessageInfo } = useContext(MessageContext)

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
            navigation.goBack()
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


  const validateForm = (): { err?: string } => {
    if (password === '') {
      return { err: 'Password is required!' }
    } else {
      return { err: undefined }
    }
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
        setPassword('')
        navigation.goBack()
      })
      .catch(() => {
        setMessageInfo('Wrong password')
        setShowMessage(true)
      })
  }


  return (
    <Container>
      <StyledTitle >{LOCKED_SCREEN.TITLE}</StyledTitle>
      <StyledText>{LOCKED_SCREEN.SUBTITLE}</StyledText>


      <InputContainer>
        <StyledInput
          style={{ width: 'auto' }}
          label={LOCKED_SCREEN.INPUT_PASSWORD.LABEL}
          value={password}
          onChangeText={(password) => setPassword(password)}
          secureTextEntry={passwordVisible}
          placeholder={LOCKED_SCREEN.INPUT_PASSWORD.PLACEHOLDER}
          right={
            <StyledInput.Icon
              name={passwordVisible ? 'eye' : 'eye-off'}
              onPress={() => setPasswordVisible(!passwordVisible)}
            />
          }
        ></StyledInput>
      </InputContainer>


      <ButtonContainer >

        <StyledButton
          mode='contained'
          color='#A017B7'
          uppercase={false}
          labelStyle={{ fontWeight: '400', fontSize: 16, width: '100%' }}
          onPress={() => handleSignIn()}
        >
          {LOCKED_SCREEN.BUTTON}
        </StyledButton>

      </ButtonContainer>


    </Container>
  )
}
