import React, { useEffect, useState } from 'react'
import { Card, Title } from 'react-native-paper'
import { CardsContainer, Content, Field, MainCard, StyledTitle } from '../components/styles/ProfileScreen.styles'
import LocalStorageService from '../services/LocalStorage.service'


export default function ProfileScreen() {

    const [isLoading, setIsLoading] = useState<boolean>(true)
    const [accountInformation, setAccountInformation] = useState(Object.create(null))

    const { address, publicKey, privateKey, seed } = accountInformation

    useEffect(() => {
        readStorage()
    }
        , [])

    const readStorage = () => {
        LocalStorageService.getData('@accountData')
            .then(accountData => {
                setAccountInformation(accountData)
                setIsLoading(false)
            })
            .catch(err => console.log(err))
    }



    return (
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

            <MainCard >
                <Card.Content>

                    <Content>{privateKey}</Content>
                </Card.Content>
            </MainCard>

            <MainCard >
                <Card.Content>

                    <Title>{seed}</Title>
                </Card.Content>
            </MainCard>

        </CardsContainer>
    )
}
