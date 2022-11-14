import React from 'react'
import { RootStackScreenProps } from '../../../types'
import { StyledButton } from '../../components/styles/StyledButton.styles'
import { SIGNUP } from '../../constants/Text'
import ApiClientService from '../../services/ApiClient.service'
import LocalStorageService from '../../services/LocalStorage.service'
import {
    ButtonContainer,
    Container,
    InputContainer,
    StyledText,
    StyledTitle
} from '../SignInScreen/SignInScreen.styles'

export default function SignUpScreen({ navigation }: RootStackScreenProps<'SignUp'>) {

    const handleCreateAccount = async () => {
        ApiClientService.createAccount()
            .then(account => ({
                address: account.address,
                privateKey: account.privateKey,
                publicKey: account.publicKey,
                seed: account.seed,
            })).then(data => LocalStorageService.storeData('@accountData', [data]))
            .then(() => navigation.navigate('RegisterAccount', { data: 'created' }))
            .catch((error) => {
                throw new Error(`Error storing data. ${error}`)
            })
    }

    return (
        <Container>
            <InputContainer>
                <StyledTitle>{SIGNUP.TITLE}</StyledTitle>
                <StyledText>{SIGNUP.SUBTITLE}</StyledText>
            </InputContainer>

            <ButtonContainer>
                <StyledButton
                    mode="contained"
                    color="#A017B7"
                    uppercase={false}
                    labelStyle={{ fontWeight: '400', fontSize: 16, width: '100%' }}
                    onPress={() => handleCreateAccount()}
                >
                    {SIGNUP.BUTTON_CREATE}
                </StyledButton>
                <StyledButton
                    mode="outlined"
                    uppercase={false}
                    labelStyle={{ fontWeight: '400', fontSize: 16, width: '90%' }}
                    onPress={() => {
                        navigation.navigate('ImportSeed')
                    }}
                >
                    {SIGNUP.BUTTON_IMPORT}
                </StyledButton>
            </ButtonContainer>
        </Container>
    )
}
