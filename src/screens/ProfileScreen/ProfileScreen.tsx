import { useClipboard } from '@react-native-community/clipboard'
import React, { useContext, useEffect, useState } from 'react'
import { Pressable, TouchableOpacity } from 'react-native'
import { Card, Title } from 'react-native-paper'
import Spinner from '../../components/Spinner'
import { PROFILE } from '../../constants/Text'
import { MessageContext } from '../../context/UserMessage.context'
import LocalStorageService from '../../services/LocalStorage.service'
import { CardsContainer, Content, Field, HiddenTitle, MainCard, StyledTitle } from './ProfileScreen.styles'

export default function ProfileScreen() {

    const [isLoading, setIsLoading] = useState<boolean>(true)
    const [accountInformation, setAccountInformation] = useState(Object.create(null))
    const [isKeyBlur, setIsKeyBlur] = useState<boolean>(true)
    const [isSeedBlur, setIsSeedBlur] = useState<boolean>(true)
    const [accountNickname, setAccountNickname] = useState<string>("")
    const [data, setString] = useClipboard()

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
                setAccountInformation(accountData[0])
                setIsLoading(false)
            })
            .catch(error => {
                throw new Error(`Error retrieving data. ${error}`)
            })
    }

    const getNickname = () => {
        LocalStorageService.getData('@userAlias')
            .then(data => setAccountNickname(data.nickname))
            .catch(error => {
                throw new Error(`Error retrieving data. ${error}`)
            })
    }

    const { setShowMessage, setMessageInfo } = useContext(MessageContext)

    const copyToClipboard = (data: string) => {
        setString(data)
        setShowMessage(true)
        setMessageInfo('Copied to clipboard!')
    }

    return (
        <>
            {isLoading ? <Spinner /> :

                <CardsContainer>

                    <MainCard >

                        <Card.Content>
                            <StyledTitle>{PROFILE.TITLE}</StyledTitle>

                            <Field>{PROFILE.NICKNAME}</Field>
                            <Pressable
                                style={({ pressed }) => [{ opacity: pressed ? 0.5 : 1.0 }]}
                                onLongPress={() => copyToClipboard(accountNickname)}>
                                <Content>{accountNickname}</Content>
                            </Pressable>

                            <Field>{PROFILE.WALLET}</Field>
                            <Pressable
                                style={({ pressed }) => [{ opacity: pressed ? 0.5 : 1.0 }]}
                                onLongPress={() => copyToClipboard(address)}>
                                <Content>{address}</Content>
                            </Pressable>

                            <Field>{PROFILE.PUBLIC_KEY}</Field>
                            <Pressable
                                style={({ pressed }) => [{ opacity: pressed ? 0.5 : 1.0 }]}
                                onLongPress={() => copyToClipboard(publicKey)}>
                                <Content>{publicKey}</Content>
                            </Pressable>
                        </Card.Content>

                    </MainCard>

                    {!isKeyBlur ?
                        <TouchableOpacity onPress={() => setIsKeyBlur(!isKeyBlur)}>
                            <MainCard justifyContent='center' alignItems='center'>
                                <Card.Content>
                                    <HiddenTitle>{PROFILE.DISCOVER_PRIVATEKEY}</HiddenTitle>
                                </Card.Content>
                            </MainCard>
                        </TouchableOpacity>
                        :
                        <TouchableOpacity
                            onPress={() => setIsKeyBlur(!isKeyBlur)}
                            onLongPress={() => copyToClipboard(privateKey)}>
                            <MainCard justifyContent='center' alignItems='center'>
                                <Card.Content>
                                    <Content>{privateKey}</Content>
                                </Card.Content>
                            </MainCard>
                        </TouchableOpacity>
                    }

                    {!isSeedBlur ?
                        <TouchableOpacity onPress={() => setIsSeedBlur(!isSeedBlur)}>
                            <MainCard justifyContent='center' alignItems='center'>
                                <Card.Content>
                                    <HiddenTitle>{PROFILE.DISCOVER_PHRASE}</HiddenTitle>
                                </Card.Content>
                            </MainCard>
                        </TouchableOpacity>
                        :
                        <TouchableOpacity
                            onPress={() => setIsSeedBlur(!isSeedBlur)}
                            onLongPress={() => copyToClipboard(seed)}>
                            <MainCard justifyContent='center' alignItems='center'>
                                <Card.Content>
                                    <Title >{seed}</Title>
                                </Card.Content>
                            </MainCard>
                        </TouchableOpacity>
                    }
                </CardsContainer>
            }
        </>
    )
}
