import React, { useEffect, useState } from 'react'
import { StatusBar } from 'react-native'
import { Card, Paragraph, Title } from 'react-native-paper'
import { RootTabScreenProps } from '../../types'
import QRButton from '../components/QRIcon'
import Spinner from '../components/Spinner'
import { AmountContainer, BottomCard, BottomCardsContainer, OverviewContainer, TopCard, TopCardsContainer } from '../components/styles/WalletTabScreen.styles'
import ApiClientService from '../services/ApiClient.service'
import LocalStorageService from '../services/LocalStorage.service'
import { formatNumber } from '../utils/formatNumber'

export default function WalletTabScreen({ navigation, route }: RootTabScreenProps<'Wallet'>) {

    const [isLoading, setIsLoading] = useState<boolean>(true)
    const [details, setDetails] = useState(Object.create(null))

    interface TypedDetails {
        available: number
        effective: number
        generating: number
        regular: number
    }

    const { available, effective, generating, regular } = details as unknown as TypedDetails

    useEffect(() => {
        readStorage()
    }, [])

    const readStorage = () => {
        LocalStorageService.getData('@accountData')
            .then(data => {
                return ApiClientService.getAccountDetails(data.address)
            })
            .then(accountDetails => {
                setDetails(accountDetails)
                setIsLoading(false)
                console.log('Details: ', accountDetails)
            })
            .catch(err => console.log(err))
    }

    //Hardcoded for now
    const convertLTOtoUSD = (lto: Number | any): string => {
        const ltoPrice = 0.079821
        const usd = ltoPrice * lto
        const formated = (usd / 100000000).toFixed(2)
        return formated
    }

    return (
        <>
            {isLoading
                ?
                <Spinner />
                :
                <OverviewContainer>

                    <StatusBar backgroundColor={'#ffffff'} />

                    <TopCardsContainer>

                        <TopCard>
                            <Card.Content style={{ borderRadius: 80 }}>
                                <Paragraph>Regular account</Paragraph>
                                <AmountContainer>
                                    <Title>{formatNumber(regular)}</Title><Paragraph>LTO</Paragraph>
                                </AmountContainer>
                                <Paragraph>Equivalent to ...</Paragraph>
                            </Card.Content>
                        </TopCard>

                        <TopCard>
                            <Card.Content>
                                <Paragraph>Prize</Paragraph>
                                <Title>?</Title>
                                <Paragraph>... %(last 24h)</Paragraph>
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
                                    <Title>{convertLTOtoUSD(effective)}</Title><Paragraph>$</Paragraph>
                                </AmountContainer>
                            </Card.Content>
                        </BottomCard>

                        <BottomCard >
                            <Card.Content>
                                <Paragraph>No. of transactions</Paragraph>
                                <Title>?</Title>
                            </Card.Content>
                        </BottomCard>

                    </BottomCardsContainer>

                    <QRButton onPress={() => alert('Here QR code for transactions')} />

                </OverviewContainer>
            }
        </>
    )
}
