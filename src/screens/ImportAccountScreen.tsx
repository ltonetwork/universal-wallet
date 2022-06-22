import React, { useEffect, useState } from 'react'
import { SafeAreaView, TouchableOpacity, Text, View, StyleSheet } from 'react-native'
import { RootStackScreenProps } from '../../types'
import { StyledTitle, StyledView } from '../components/styles/Signin.styles'
import { StyledButton } from '../components/styles/StyledButton.styles'
import { StyledInput } from '../components/styles/StyledInput.styles'
import LocalStorageService from '../services/LocalStorage.service'
import { Button } from 'react-native-paper'
import Clipboard from '@react-native-clipboard/clipboard';

export default function ImportAccountScreen({ navigation, route }: RootStackScreenProps<'Import'>) {
    const [word, setWord] = useState([])
    const [copiedText, setCopiedText] = useState('')
    const [showedPhrase, setShowedPhrase] = useState(false)
    const [seedPhrase, setSeedPhrase] = useState<string[]>([]) 

    let splitWords = seedPhrase[0]?.split(' ')

    // const copyToClipboard = () => {
    //     Clipboard.setString(copiedText)
    //     setShowedPhrase(!showedPhrase)
    // }

    // const fetchCopiedText = async () => {
    //     const text = seedPhrase
    //     setCopiedText(text)
    // }

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
                setSeedPhrase([accountSeed])
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
                onChangeText={words => setWord(word)}
                placeholder="Tap your backup phrase in the correct order"
            >

            </StyledInput>


            {/* <SafeAreaView style={{ flex: 1 }}>
                <View style={styles.container}>
                    <Text style={styles.copiedText}>{word}{copiedText}</Text>
                    <TouchableOpacity onPress={copyToClipboard}>
                        <Text>Click here to copy to Clipboard</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={fetchCopiedText}>
                        <Text>View copied text</Text>
                    </TouchableOpacity>

                </View>
            </SafeAreaView> */}

            <View style={{flex: 1, alignItems: 'center'}}>
            {splitWords?.map((word, idx) => {
                   return <Button mode='outlined' style={{width: 120, borderRadius: 20, borderColor: '#A017B7'}} idx={idx}>{word}</Button>
                }) }
                </View>
            <StyledView flexEnd>

                <StyledButton
                    mode="contained"
                    disabled={false} // must be disable until we implement the import words
                    uppercase={false}
                    labelStyle={{ fontWeight: '400', fontSize: 16, width: '100%' }}
                    onPress={() => {
                        // console.log(account2)
                        console.log('seed words :', typeof splitWords)
                        // navigation.navigate('Import2')
                    }}>
                    Import your account
                </StyledButton>

            </StyledView>
        </StyledView>
    )
}
const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    copiedText: {
      marginTop: 10,
      color: 'red',
    },
  });
  


