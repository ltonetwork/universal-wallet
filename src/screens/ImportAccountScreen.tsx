import React, { useState } from 'react'
import { StyledTitle, StyledView } from '../components/styles/Signin.styles'
import { StyledButton } from '../components/styles/StyledButton.styles'
import { StyledInput } from '../components/styles/StyledInput.styles'
import { RootStackScreenProps } from '../../types'

export default function ImportAccountScreen({ navigation, route }: RootStackScreenProps<'Import'>) {

    const [words, setWords] = useState("")
    const [backupPhrase, setBackupPhrase] = useState("")


    const getbackupPhrase = () => { }

    // const factory = require('@ltonetwork/lto').AccountFactoryED25519
    const scanData = route.params.data
    // const account = new factory('T').createFromPrivateKey(scanData)

    //INFO FROM LTO:
    const LTO = require("@ltonetwork/lto").LTO
    const lto = new LTO('T')

    const account = lto.account()

    const auth = { "@context": "http://schema.lto.network/simple-auth-v1.json", "url": "https://auth.lto.network/UkRihLPt8VA1" }
    const signature = account.sign(`lto:sign:${auth.url}`).base58

    const data = { address: account.address, publicKey: account.publicKey, signature }
    // post(auth.url, data);


    return (
        <StyledView marginTop={'0'}>

            <StyledTitle>Import account</StyledTitle>

            <StyledInput
                style={{ marginBottom: 70 }}
                label="Add your backup phrase"
                value={words}
                onChangeText={words => setWords(words)}
                placeholder="Tap your backup phrase in the correct order"
            >

            </StyledInput>

            <StyledView flexEnd>

                <StyledButton
                    mode="contained"
                    disabled={false} // must be disable until we implement the import words
                    uppercase={false}
                    labelStyle={{ fontWeight: '400', fontSize: 16, width: '100%' }}
                    onPress={() => {
                        console.log(data)
                        // navigation.navigate('Import2')
                    }}>
                    Import your account
                </StyledButton>

            </StyledView>
        </StyledView>
    )
}


