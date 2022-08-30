import React, { useEffect, useState } from 'react'
import { View } from 'react-native'
import { RootStackScreenProps } from '../../../types'
import SeedButton from '../../components/SeedButton'
import Spinner from '../../components/Spinner'
import { StyledButton } from '../../components/styles/StyledButton.styles'
import { StyledInput } from '../../components/styles/StyledInput.styles'
import LocalStorageService from '../../services/LocalStorage.service'
import { Container, StyledTitle } from '../SignInScreen/SignInScreen.styles'


export default function ImportSeedScreen({ navigation }: RootStackScreenProps<'ImportSeed'>) {
    const [seedPhrase, setSeedPhrase] = useState<string[]>([])
    const [showedPhrase, setShowedPhrase] = useState<string[]>([])
    const [isLoading, setIsLoading] = useState<boolean>(true)

    let splitWords = seedPhrase[0]?.split(' ')

    let seedPhraseCopy = seedPhrase[0]?.split(' ')

    const shuffleArray = (array: string[]) => {
        let currentIndex = array.length, randomIndex

        while (currentIndex != 0) {

            randomIndex = Math.floor(Math.random() * currentIndex)
            currentIndex--;

            [array[currentIndex], array[randomIndex]] = [
                array[randomIndex], array[currentIndex]]
        }
        return array
    }


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
                const data = { address: account.address, privateKey: account.privateKey, publicKey: account.publicKey, signature, seed: account.seed }
                return data
            })
            .then(accountData => {
                LocalStorageService.storeData('@accountData', accountData)
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

    const arraysEqual = (array1: string[], array2: string[]): boolean => {
        return JSON.stringify(array1) == JSON.stringify(array2)
    }

    const handlePress = (item: string) => {
        setShowedPhrase(prev => [
            ...prev, item,
        ])
    }

    return (
        <Container>

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
                    {isLoading ?
                        <Spinner /> :
                        splitWords.map((word, idx) => { // apply shuffleArray Fn to splitWords
                            return <SeedButton text={word}
                                key={idx}
                                onPress={() => {
                                    handlePress(word)
                                }} />
                        })
                    }
                </View>

            </View>

            <Container flexEnd>

                <StyledButton
                    mode="contained"
                    color='#A017B7'
                    disabled={!arraysEqual(seedPhraseCopy, showedPhrase)} // Activate button if showed phrase is equal to seed phrase
                    uppercase={false}
                    labelStyle={{ fontWeight: '400', fontSize: 16, width: '100%' }}
                    onPress={() => {
                        console.log('split seedPhrase: ', seedPhraseCopy)
                        console.log('ordered showPhrase: ', showedPhrase)
                        navigation.navigate('ImportAccount')
                    }}>
                    Import your account
                </StyledButton>

            </Container>

        </Container >
    )
}