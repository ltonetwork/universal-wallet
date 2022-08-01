import React, { useEffect, useState } from 'react'
import { StatusBar } from 'react-native'
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
                    <OverviewHeader
                        icon={"menu"}
                        onPress={() => navigation.navigate('Modal')}
                        input={<StyledImage testID="logo-title" source={logoTitle} />} />
                    <OverviewContainer>

                        <StatusBar backgroundColor={'#ffffff'} />

                        <TopCardsContainer>

                            <TopCard>
                                <Card.Content style={{ borderRadius: 80 }}>
                                    <Paragraph>Regular account</Paragraph>
                                    <AmountContainer>
                                        <Title>{formatNumber(regular)}</Title><Paragraph>LTO</Paragraph>
                                    </AmountContainer>
                                    <Paragraph>Equivalent to {formatNumber(change)}$</Paragraph>
                                </Card.Content>
                            </TopCard>

                            <TopCard>
                                <Card.Content>
                                    <Paragraph>Prize</Paragraph>
                                    <Title>{price?.toFixed(3)}</Title>
                                    <Paragraph>{percent_change_24h?.toFixed(2)}%(last 24h)</Paragraph>
                                </Card.Content>
                            </TopCard>

                        </TopCardsContainer>

                        <BottomCardsContainer >

                            <BottomCard>
                                <Card.Content>
                                    <Paragraph>Generating</Paragraph>
                                    <AmountContainer>
                                        <Title>{formatNumber(generating)}</Title><Paragraph>LTO</Paragraph>
                                    </AmountContainer>
                                </Card.Content>
                            </BottomCard>

                            <BottomCard >
                                <Card.Content>
                                    <Paragraph>Available</Paragraph>
                                    <AmountContainer>
                                        <Title>{formatNumber(available)}</Title><Paragraph>LTO</Paragraph>
                                    </AmountContainer>
                                </Card.Content>
                            </BottomCard>

                        </BottomCardsContainer>

                        <BottomCardsContainer>

                            <BottomCard >
                                <Card.Content>
                                    <Paragraph>Effective</Paragraph>
                                    <AmountContainer>
                                        <Title>{formatNumber(change)}</Title><Paragraph>$</Paragraph>
                                    </AmountContainer>
                                </Card.Content>
                            </BottomCard>

                            <BottomCard >
                                <Card.Content>
                                    <Paragraph>Unbonding</Paragraph>
                                    <Title>{formatNumber(unbonding)}</Title>
                                </Card.Content>
                            </BottomCard>

                        </BottomCardsContainer>


                    </OverviewContainer>
                    <QRButton onPress={() => navigation.navigate('ScanTransaction')} />
                </>
            }
        </>
    )
}
