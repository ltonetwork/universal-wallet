import { StatusBar } from 'expo-status-bar'
import React, { useEffect, useState } from 'react'
import { Card, Paragraph, Title } from 'react-native-paper'
import { RootTabScreenProps } from '../../types'
import OverviewHeader from '../components/OverviewHeader'
import QRButton from '../components/QRButton'
import Spinner from '../components/Spinner'
import { StyledImage } from '../components/styles/OverviewHeader.styles'
import { AmountContainer, BottomCard, BottomCardsContainer, OverviewContainer, TopCard, TopCardsContainer } from '../components/styles/WalletTabScreen.styles'
import ApiClientService from '../services/ApiClient.service'
import CoinMarketCapService from '../services/CoinMarketCap.service'
import LocalStorageService from '../services/LocalStorage.service'
import { formatNumber } from '../utils/formatNumber'
import { logoTitle } from "../utils/images"
import { FieldName, BlueText, RedText, Amount } from '../components/styles/WalletTabScreen.styles'

export default function WalletTabScreen({ navigation, route }: RootTabScreenProps<'Wallet'>) {

    const [isLoading, setIsLoading] = useState<boolean>(true)
    const [details, setDetails] = useState<TypedDetails>(new Object as TypedDetails)
    const [coinData, setCoinData] = useState<TypedCoinData>(new Object as TypedCoinData)

    const { available, generating, regular, unbonding } = details
    const { price, percent_change_24h } = coinData

    interface TypedCoinData {
        price: number
        percent_change_24h: number
    }

    interface TypedDetails {
        available: number
        effective: number
        generating: number
        regular: number
        unbonding: number
    }

    useEffect(() => {
        getPrizeInfo()
    }, [])

    useEffect(() => {
        readStorage()
    }, [details])

    const readStorage = () => {
        LocalStorageService.getData('@accountData')
            .then(account => {
                return ApiClientService.getAccountDetails(account.address)
            })
            .then(accountDetails => {
                setDetails(accountDetails)
                setIsLoading(false)
            })
            .catch(err => console.log(err))
    }

    const getPrizeInfo = () => {
        CoinMarketCapService.getCoinInfo()
            .then(data => data.data[3714].quote.USD)
            .then(price => setCoinData(price))
            .catch(err => console.log(err))
    }

    const effectiveAmount = () => {
        return regular * price
    }

    const change = effectiveAmount()


    return (
        <>
            {isLoading
                ?
                <Spinner />
                :
                <>
                    <OverviewContainer>
                        <StatusBar style={'dark'} backgroundColor={'#ffffff'} />
                        <OverviewHeader
                            icon={"menu"}
                            onPress={() => navigation.navigate('Modal')}
                            input={<StyledImage testID="logo-title" source={logoTitle} />} />

                        <TopCardsContainer>

                            <TopCard>
                                <Card.Content style={{ borderRadius: 80 }}>
                                    <FieldName>Regular account</FieldName>
                                    <AmountContainer>
                                        <Amount>{formatNumber(regular)}</Amount><Paragraph>LTO</Paragraph>
                                    </AmountContainer>
                                    <BlueText>Equivalent to {formatNumber(change)}$</BlueText>
                                </Card.Content>
                            </TopCard>

                            <TopCard>
                                <Card.Content>
                                    <FieldName>Prize</FieldName>
                                    <Amount>{price?.toFixed(3)}$</Amount>
                                    <RedText>{percent_change_24h?.toFixed(2)}%(last 24h)</RedText>
                                </Card.Content>
                            </TopCard>

                        </TopCardsContainer>

                        <BottomCardsContainer >

                            <BottomCard>
                                <Card.Content>
                                    <FieldName>Generating</FieldName>
                                    <AmountContainer>
                                        <Amount>{formatNumber(generating)}</Amount><Paragraph>LTO</Paragraph>
                                    </AmountContainer>
                                </Card.Content>
                            </BottomCard>

                            <BottomCard >
                                <Card.Content>
                                    <FieldName>Available</FieldName>
                                    <AmountContainer>
                                        <Amount>{formatNumber(available)}</Amount><Paragraph>LTO</Paragraph>
                                    </AmountContainer>
                                </Card.Content>
                            </BottomCard>

                        </BottomCardsContainer>

                        <BottomCardsContainer>

                            <BottomCard >
                                <Card.Content>
                                    <FieldName>Effective</FieldName>
                                    <AmountContainer>
                                        <Amount>{formatNumber(change)}</Amount><Paragraph>$</Paragraph>
                                    </AmountContainer>
                                </Card.Content>
                            </BottomCard>

                            <BottomCard >
                                <Card.Content>
                                    <FieldName>Unbonding</FieldName>
                                    <Amount>{formatNumber(unbonding)}</Amount>
                                </Card.Content>
                            </BottomCard>

                        </BottomCardsContainer>

                        <QRButton onPress={() => navigation.navigate('ScanTransaction')} />
                    </OverviewContainer>
                </>
            }
        </>
    )
}
