import { LTO } from '@ltonetwork/lto'
import React, { useContext, useState } from 'react'
import { View } from 'react-native'
import { RootStackScreenProps } from '../../../types'
import { StyledButton } from '../../components/styles/StyledButton.styles'
import { StyledInput } from '../../components/styles/StyledInput.styles'
import { MessageContext } from '../../context/UserMessage.context'
import LocalStorageService from '../../services/LocalStorage.service'
import { ButtonContainer, Container, InputContainer, StyledTitle } from '../SignInScreen/SignInScreen.styles'

export default function ImportSeedScreen({ navigation }: RootStackScreenProps<'ImportSeed'>) {
    const [seedPhrase, setSeedPhrase] = useState<string>('')
    const [isLoading, setIsLoading] = useState<boolean>(true)

    const { setShowMessage, setMessageInfo } = useContext(MessageContext)

    const handleImportFromSeed = () => {
        const seed = seedPhrase.toLowerCase()

        if (seed.split(' ').length === 15) {
            const lto = new LTO('T)')
            const account = lto.account({ seed: seed })
            const data = {
                address: account.address,
                privateKey: account.privateKey,
                publicKey: account.publicKey,
                seed: account.seed,
            }
            LocalStorageService.storeData('@accountData', [data])
                .then(() => {
                    setIsLoading(false)
                    navigation.navigate('ImportAccount', { data: 'seed' })
                })
                .catch((err) => {
                    console.log(err)
                })

        } else {
            setShowMessage(true)
            setMessageInfo('Error: seed phrase must have 15 words separated by one space!')
        }
    }

    return (
        <Container >
            <InputContainer>
                <StyledTitle>Import account</StyledTitle>
                <StyledInput
                    style={{ marginBottom: 140 }}
                    editable={true}
                    multiline
                    blurOnSubmit={true}
                    returnKeyType='go'
                    label='Add your seed phrase'
                    onChangeText={(text) => setSeedPhrase(text)}
                    value={seedPhrase}
                    placeholder='Type your seed phrase separated by a space'
                ></StyledInput>
            </InputContainer>

            <ButtonContainer marginBottom={50}>
                <StyledButton
                    mode='contained'
                    color='#A017B7'
                    disabled={false}
                    uppercase={false}
                    labelStyle={{ fontWeight: '400', fontSize: 16, width: '100%' }}
                    onPress={() => {
                        setSeedPhrase('')
                        handleImportFromSeed()
                    }}
                >
                    Import your account
                </StyledButton>
            </ButtonContainer>
        </Container>
    )
}
