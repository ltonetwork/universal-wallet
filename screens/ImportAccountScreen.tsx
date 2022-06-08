import React, { useState } from 'react'
import { StyledTitle, StyledView } from '../components/styles/Signin.styles'
import { StyledButton } from '../components/styles/StyledButton.styles'
import { StyledInput } from '../components/styles/StyledInput.styles'

export default function ImportAccountScreen({ navigation }) {

    const [words, setWords] = useState("")

    const handleImport = () => { }


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

                {/* The icon eye to show or hide the password is not in the sketch, ask if we are going to include it */}

            </StyledInput>

            <StyledView flexEnd>

                <StyledButton
                    mode="contained"
                    disabled={false} // must be disable until we implement the import words
                    uppercase={false}
                    labelStyle={{ fontWeight: '400', fontSize: 16, width: '100%' }}
                    onPress={() => navigation.navigate('Import2')}>
                    Import your account
                </StyledButton>

            </StyledView>
        </StyledView>
    )
}

