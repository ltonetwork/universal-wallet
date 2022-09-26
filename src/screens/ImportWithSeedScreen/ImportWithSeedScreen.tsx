import React, { useContext, useState } from 'react'
import { RootStackScreenProps } from '../../../types'
import { StyledButton } from '../../components/styles/StyledButton.styles'
import { StyledInput } from '../../components/styles/StyledInput.styles'
import { IMPORT_WITHSEEDS } from '../../constants/Text'
import { MessageContext } from '../../context/UserMessage.context'
import ApiClientService from '../../services/ApiClient.service'
import LocalStorageService from '../../services/LocalStorage.service'
import { ButtonContainer, Container, InputContainer, StyledTitle } from '../SignInScreen/SignInScreen.styles'

export default function ImportSeedScreen({ navigation }: RootStackScreenProps<'ImportSeed'>) {
    const [seedPhrase, setSeedPhrase] = useState<string>('')
    const { setShowMessage, setMessageInfo } = useContext(MessageContext)

    const handleImportFromSeed = async () => {
        const seed = seedPhrase.toLowerCase()
        if (seed.split(' ').length === 15) {
            ApiClientService.importAccount(seed)
                .then(response => response)
                .then((account) => {
                    const data = {
                        address: account.address,
                        privateKey: account.privateKey,
                        publicKey: account.publicKey,
                        seed: account.seed,
                    }
                    return data
                })
                .then(data => LocalStorageService.storeData('@accountData', [data]))
                .then(() => navigation.navigate('RegisterAccount', { data: 'seed' }))
                .catch((error) => {
                    throw new Error('Error storing data', error)
                })
        } else {
            setShowMessage(true)
            setMessageInfo('Seed phrase must have 15 words separated by one space!')
        }
    }

    return (
        <Container>
            <InputContainer>
                <StyledTitle>{IMPORT_WITHSEEDS.IMPORT_TITLE}</StyledTitle>
                <StyledInput
                    style={{ marginBottom: 140 }}
                    editable={true}
                    multiline
                    blurOnSubmit={true}
                    returnKeyType="go"
                    label={IMPORT_WITHSEEDS.INPUT_SEEDPHRASE.LABEL}
                    onChangeText={(text) => setSeedPhrase(text)}
                    value={seedPhrase}
                    placeholder={IMPORT_WITHSEEDS.INPUT_SEEDPHRASE.PLACEHOLDER}
                ></StyledInput>
            </InputContainer>

            <ButtonContainer marginBottom={50}>
                <StyledButton
                    mode="contained"
                    color="#A017B7"
                    disabled={false}
                    uppercase={false}
                    labelStyle={{ fontWeight: '400', fontSize: 16, width: '100%' }}
                    onPress={() => {
                        setSeedPhrase('')
                        handleImportFromSeed()
                    }}
                >
                    {IMPORT_WITHSEEDS.BUTTON_IMPORT}
                </StyledButton>
            </ButtonContainer>
        </Container>
    )
}
