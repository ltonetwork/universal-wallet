import React, { useEffect, useState, useContext } from 'react'
import { View } from 'react-native'
import { RootStackScreenProps } from '../../types'
import { StyledText, StyledTitle, Container, ButtonContainer } from '../components/styles/SignInScreen.styles'
import { StyledButton } from '../components/styles/StyledButton.styles'
import { StyledInput } from '../components/styles/StyledInput.styles'
import LocalStorageService from '../services/LocalStorage.service'
import { MessageContext } from '../context/UserMessage.context'


export default function SignInScreen({ navigation }: RootStackScreenProps<'SignIn'>) {
    const [userAlias, setUserAlias] = useState<any>()
    const [password, setPassword] = useState<string>("")
    const [passwordVisible, setPasswordVisible] = useState<boolean>(true)

    useEffect(() => {
        getAlias()
    }, [])

    const getAlias = () => {
        LocalStorageService.getData('@userAlias')
            .then(data => {
                setUserAlias(data)
            })
            .catch(err => console.log(err))
    }

    const { setShowMessage, setMessageInfo } = useContext(MessageContext)

    const handleSignIn = () => {
        if (userAlias?.nickname === undefined) {
            setMessageInfo("Please import your account first!")
            setShowMessage(true)
        } else if (password === "") {
            setMessageInfo("Password is required!")
            setShowMessage(true)
        } else if (password !== userAlias?.password) {
            setMessageInfo("Wrong password!")
            setShowMessage(true)
        } else {
            navigation.navigate('Root')
            setPassword("")
        }
    }

    return (
        <Container>
            <View>

                <StyledTitle>Sign in</StyledTitle>
                <StyledText>Sign in with your account name and password</StyledText>
                <StyledInput
                    mode={'flat'}
                    style={{ marginBottom: 5 }}
                    disabled={true}
                    label="Nickname"
                    value={userAlias?.nickname}
                >
                </StyledInput>
                <StyledInput
                    label="Wallet password"
                    value={password}
                    onChangeText={password => setPassword(password)}
                    secureTextEntry={passwordVisible}
                    placeholder="Type your password"
                    right={<StyledInput.Icon
                        name={passwordVisible ? "eye" : "eye-off"}
                        onPress={() => setPasswordVisible(!passwordVisible)} />}
                >
                </StyledInput>

            </View>


            <ButtonContainer>
                <StyledButton
                    mode="contained"
                    color='#A017B7'
                    uppercase={false}
                    labelStyle={{ fontWeight: '400', fontSize: 16, width: '100%' }}
                    onPress={() => handleSignIn()}>
                    Sign in
                </StyledButton>
                <StyledButton
                    mode="outlined"
                    uppercase={false}
                    labelStyle={{ fontWeight: '400', fontSize: 16, width: '100%' }}
                    onPress={() => navigation.navigate('ScanKey')}>
                    Import your account
                </StyledButton>
            </ButtonContainer>

        </Container>
    )
}

