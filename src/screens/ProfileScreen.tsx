import { useClipboard } from '@react-native-community/clipboard'
import React, { useEffect, useState } from 'react'
import { Pressable, StatusBar, TouchableOpacity } from 'react-native'
import { Card, Title } from 'react-native-paper'
import SnackbarMessage from '../components/Snackbar'
import Spinner from '../components/Spinner'
import { CardsContainer, Content, Field, HiddenTitle, MainCard, StyledTitle } from '../components/styles/ProfileScreen.styles'
import LocalStorageService from '../services/LocalStorage.service'

export default function ProfileScreen() {

    const [isLoading, setIsLoading] = useState<boolean>(true)
    const [accountInformation, setAccountInformation] = useState(Object.create(null))
    const [isKeyBlur, setIsKeyBlur] = useState<boolean>(true)
    const [isSeedBlur, setIsSeedBlur] = useState<boolean>(true)
    const [accountNickname, setAccountNickname] = useState<string>("")
    const [data, setString] = useClipboard()
    const [snackbarVisible, setSnackbarVisible] = useState(false)

    const { address, publicKey, privateKey, seed } = accountInformation

    useEffect(() => {
        readStorage()
        getNickname()
    }, [])

    useEffect(() => {
        if (isKeyBlur) {
            setIsKeyBlur(false)
        }
        if (isSeedBlur) {
            setIsSeedBlur(false)
        }
    }, [])

    useEffect(() => {
        setString(data)
    }, [data])

    const readStorage = () => {
        LocalStorageService.getData('@accountData')
            .then(accountData => {
                setAccountInformation(accountData)
                setIsLoading(false)
            })
            .catch(err => console.log(err))
    }

    const getNickname = () => {
        LocalStorageService.getData('@userAlias')
            .then(data => setAccountNickname(data.nickname))
            .catch(err => console.log(err))
    }

    const copyToClipboard = (data: string) => {
        setString(data)
        setSnackbarVisible(true)
        setTimeout(() => {
            setSnackbarVisible(false)
        }, 2000)
    }

    return (
        <>
            {isLoading ? <Spinner /> :

                <CardsContainer>
                    <StatusBar backgroundColor={'#ffffff'} />

                    <MainCard >

                        <Card.Content>
                            <StyledTitle>Public information</StyledTitle>

                            <Field>Nickname</Field>
                            <Pressable
                                style={({ pressed }) => [{ opacity: pressed ? 0.5 : 1.0 }]}
                                onLongPress={() => copyToClipboard(accountNickname)}>
                                <Content>{accountNickname}</Content>
                            </Pressable>


                            <Field>Wallet</Field>
                            <Pressable
                                style={({ pressed }) => [{ opacity: pressed ? 0.5 : 1.0 }]}
                                onLongPress={() => copyToClipboard(address)}>
                                <Content>{address}</Content>
                            </Pressable>

                            <Field>Public Key</Field>
                            <Pressable
                                style={({ pressed }) => [{ opacity: pressed ? 0.5 : 1.0 }]}
                                onLongPress={() => copyToClipboard(publicKey)}>
                                <Content>{publicKey}</Content>
                            </Pressable>
                        </Card.Content>

                    </MainCard>

                    <TouchableOpacity onPress={() => setIsKeyBlur(!isKeyBlur)}>
                        {!isKeyBlur ?
                            <MainCard justifyContent='center' alignItems='center'>

                                <Card.Content>
                                    <HiddenTitle>Press and discover your private key</HiddenTitle>
                                </Card.Content>

                            </MainCard>
                            :
                            <MainCard justifyContent='center' alignItems='center'>
                                <Card.Content>
                                    <Content>{privateKey}</Content>
                                </Card.Content>
                            </MainCard>
                        }
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => setIsSeedBlur(!isSeedBlur)}>
                        {!isSeedBlur ?
                            <MainCard justifyContent='center' alignItems='center'>

                                <Card.Content>
                                    <HiddenTitle>Press and discover your backup phrase</HiddenTitle>
                                </Card.Content>

                            </MainCard>
                            :
                            <MainCard justifyContent='center' alignItems='center'>
                                <Card.Content>
                                    <Title >{seed}</Title>
                                </Card.Content>
                            </MainCard>
                        }
                    </TouchableOpacity>
                    {snackbarVisible && <SnackbarMessage text={'Copied to clipboard!'} />}
                </CardsContainer>
            }
        </>
    )
}