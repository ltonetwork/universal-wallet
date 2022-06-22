import React, { useEffect, useState } from 'react'
import { SafeAreaView, View } from 'react-native'
import { RootStackScreenProps } from '../../types'
import { StyledTitle, StyledView } from '../components/styles/Signin.styles'
import { StyledButton } from '../components/styles/StyledButton.styles'
import { StyledInput } from '../components/styles/StyledInput.styles'
import LocalStorageService from '../services/LocalStorage.service'
import { Button } from 'react-native-paper'

export default function ImportAccountScreen({ navigation, route }: RootStackScreenProps<'Import'>) {

    const [words, setWords] = useState([])
    const [seedPhrase, setSeedPhrase] = useState<string[]>([])


    useEffect(() => {
        getSeedWords()
    }, [])

    const getSeedWords = () => {
        LocalStorageService.getData('@appAuth')
            .then(response => {
                const LTO = require("@ltonetwork/lto").LTO
                const lto = new LTO('T')
                const account = lto.account()
                const auth = response
                const signature = account.sign(`lto:sign:${auth.url}`).base58
                const data = { address: account.address, publicKey: account.publicKey, signature, seed: account.seed }
                return data.seed
            })
            .then(accountSeed => {
                setSeedPhrase(accountSeed)
            })
            .catch(err => console.log(err))
    }

    return (
        <StyledView marginTop={'0'}>

            <StyledTitle>Import account</StyledTitle>

            <StyledInput
                style={{ marginBottom: 70 }}
                label="Add your backup phrase"
                value=''
                onChangeText={words => setWords(words)}
                placeholder="Tap your backup phrase in the correct order"
            >

            </StyledInput>

            {/* {seedPhrase?.map((word) => {
                <SafeAreaView>
                    <Button>{word}</Button>
                </SafeAreaView>
            })} */}

            <StyledView flexEnd>

                <StyledButton
                    mode="contained"
                    disabled={false} // must be disable until we implement the import words
                    uppercase={false}
                    labelStyle={{ fontWeight: '400', fontSize: 16, width: '100%' }}
                    onPress={() => {
                        // console.log(account2)
                        console.log('seed words :', seedPhrase)
                        // navigation.navigate('Import2')
                    }}>
                    Import your account
                </StyledButton>

            </StyledView>
        </StyledView>
    )
}


