import React, { useEffect, useState } from 'react'
import { SafeAreaView, TouchableOpacity, Text, View, StyleSheet } from 'react-native'
import { RootStackScreenProps } from '../../types'
import { StyledTitle, StyledView } from '../components/styles/Signin.styles'
import { StyledButton } from '../components/styles/StyledButton.styles'
import { StyledInput } from '../components/styles/StyledInput.styles'
import LocalStorageService from '../services/LocalStorage.service'
import { Button } from 'react-native-paper'
import Clipboard from '@react-native-clipboard/clipboard'
import { SeedButton } from '../components/styles/SeedButton.styles'
import Spinner from '../components/Spinner'

export default function ImportAccountScreen({ navigation, route }: RootStackScreenProps<'Import'>) {
    const [seedPhrase, setSeedPhrase] = useState<string[]>([])
    const [showedPhrase, setShowedPhrase] = useState<string[]>([])
    const [isLoading, setIsLoading] = useState<boolean>(true)
    const [showButton, setShowButton] = useState<boolean>(true)

    let splitWords = seedPhrase[0]?.split(' ')

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
                return data
            })
            .then(accountData => {
                LocalStorageService.storeData('@accountPublicKey', accountData.publicKey)
                return accountData.seed
            })
            .then(accountSeed => {
                setSeedPhrase([accountSeed])
                setIsLoading(false)
                console.log('type of seed data :', typeof accountSeed)
                console.log('seed data :', accountSeed)
            })
            .catch(err => console.log(err))
    }

    const handlePress = (word: string) => {
        setShowedPhrase(prev => [...prev, word])
        setShowButton(false)
    }

    const arraysEqual = (array1: string[], array2: string[]): boolean => {
        return JSON.stringify(array1) == JSON.stringify(array2)
    }

    return (
        <StyledView>

            <StyledTitle>Import account</StyledTitle>

            <View>
                <StyledInput
                    style={{ marginBottom: 140 }}
                    editable={false}
                    multiline
                    caretHidden
                    label="Add your backup phrase"
                    value={showedPhrase.toString()}
                    placeholder="Tap your backup phrase in the correct order"
                >
                </StyledInput>


                <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
                    {isLoading ? <Spinner /> : splitWords?.map((word, idx) => {
                        return <SeedButton
                            key={idx}
                            mode='outlined'
                            uppercase={false}
                            onPress={() => {
                                handlePress(word)
                            }}>
                            {word}
                        </SeedButton>
                    })}
                </View>

            </View>

            <StyledView flexEnd>

                <StyledButton
                    mode="contained"
                    disabled={!arraysEqual(splitWords, showedPhrase)} // Activate button if showed phrase is equal to seed phrase
                    uppercase={false}
                    labelStyle={{ fontWeight: '400', fontSize: 16, width: '100%' }}
                    onPress={() => {
                        console.log('seed words: ', splitWords)
                        console.log('showPhrase: ', showedPhrase)
                        navigation.navigate('Import2')
                    }}>
                    Import your account
                </StyledButton>

            </StyledView>
        </StyledView >
    )
}



