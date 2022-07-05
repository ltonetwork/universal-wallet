import React, { useEffect, useState } from 'react'
import { StyleSheet, Text, TouchableOpacity } from 'react-native'
import { Card, Title } from 'react-native-paper'
import { CardsContainer, Content, Field, MainCard, StyledTitle } from '../components/styles/ProfileScreen.styles'
import LocalStorageService from '../services/LocalStorage.service'
import Spinner from '../components/Spinner'
import { HiddenTitle } from '../components/styles/ProfileScreen.styles'
import { StatusBar } from 'react-native'

export default function ProfileScreen() {

    const [isLoading, setIsLoading] = useState<boolean>(true)
    const [accountInformation, setAccountInformation] = useState(Object.create(null))
    const [isKeyBlur, setIsKeyBlur] = useState<boolean>(true)
    const [isSeedBlur, setIsSeedBlur] = useState<boolean>(true)

    const { address, publicKey, privateKey, seed } = accountInformation

    useEffect(() => {
        readStorage()
    }
        , [])

    useEffect(() => {
        if (isKeyBlur) {
            setIsKeyBlur(false)
        }
        if (isSeedBlur) {
            setIsSeedBlur(false)
        }
    }, [])



    const readStorage = () => {
        LocalStorageService.getData('@accountData')
            .then(accountData => {
                setAccountInformation(accountData)
                setIsLoading(false)
            })
            .catch(err => console.log(err))
    }

    return (
        <>
            {isLoading ? <Spinner /> :

                <CardsContainer>

                    <MainCard >

                        <Card.Content>
                            <StyledTitle>Public information</StyledTitle>

                            <Field>Nickname</Field>
                            <Content>@johndoe</Content>

                            <Field>Wallet</Field>
                            <Content>{address}</Content>

                            <Field>Public Key</Field>
                            <Content>{publicKey}</Content>
                        </Card.Content>

                    </MainCard>


                    <TouchableOpacity onPress={() => setIsKeyBlur(!isKeyBlur)}>
                        {!isKeyBlur ?
                            <MainCard style={styles.container}>

                                <Card.Content>
                                    <HiddenTitle>Press and discover your private key</HiddenTitle>
                                </Card.Content>

                            </MainCard>
                            :
                            <MainCard style={styles.container}>
                                <Card.Content>
                                    <Content>{privateKey}</Content>
                                </Card.Content>
                            </MainCard>
                        }
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => setIsSeedBlur(!isSeedBlur)}>
                        {!isSeedBlur ?
                            <MainCard style={styles.container}>

                                <Card.Content>
                                    <HiddenTitle>Press and discover your backup phrase</HiddenTitle>
                                </Card.Content>

                            </MainCard>
                            :
                            <MainCard style={styles.container}>
                                <Card.Content>
                                    <Title >{seed}</Title>
                                </Card.Content>
                            </MainCard>
                        }
                    </TouchableOpacity>
                    <StatusBar backgroundColor={'#ffffff'} />
                </CardsContainer>
            }
        </>
    )

}


const styles = StyleSheet.create({
    container: {
        justifyContent: "center",
        alignItems: "center"
    },
    absolute: {
        position: "absolute",
        top: 0,
        left: 0,
        bottom: 0,
        right: 0
    }
})