import React, { useEffect, useState } from 'react'
import { View } from 'react-native'
import { RootStackScreenProps } from '../../types'
import { StyledText, StyledTitle, Container, ButtonContainer } from '../components/styles/SignInScreen.styles'
import { StyledButton } from '../components/styles/StyledButton.styles'
import { StyledInput } from '../components/styles/StyledInput.styles'
import LocalStorageService from '../services/LocalStorage.service'



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

    const handleSignIn = () => {
        if (password === userAlias?.password) {
            navigation.navigate('Root')
            console.log('aliases: ', userAlias)
            setPassword("")
        } else {
            alert('Incorrect password')
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

