import React, { useEffect, useState } from 'react'
import { StatusBar, View } from 'react-native'
import { Card, Paragraph, Title } from 'react-native-paper'
import { RootTabScreenProps } from '../../types'
import Spinner from '../components/Spinner'
import { QRIcon } from '../components/styles/QRIcon.styles'
import ApiClientService from '../services/ApiClient.service'
import LocalStorageService from '../services/LocalStorage.service'
import { formatNumber } from '../utils/formatNumber'

export default function WalletTabScreen({ navigation, route }: RootTabScreenProps<'Wallet'>) {

    const [isLoading, setIsLoading] = useState(true)
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
        LocalStorageService.getData('@accountPublicKey')
            .then(data => {
                const factory = require('@ltonetwork/lto').AccountFactoryED25519
                const account = new factory('T').createFromPublicKey(data)
                return account.address
            })
            .then(address => {
                return ApiClientService.getAccountDetails(address)
            })
            .then(data => {
                setDetails(data)
                setIsLoading(false)
                console.log('Details: ', data)
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
                <View style={{ alignContent: 'center' }}>
                    < StatusBar backgroundColor={'#ffffff'} />

                    <View style={{
                        marginTop: -5,
                        flexDirection: 'row',
                        justifyContent: 'space-evenly',
                        width: '100%',
                        height: 120,
                        backgroundColor: '#ffffff',
                        borderWidth: 1,
                        borderColor: '#ffffff',
                        borderBottomRightRadius: 20,
                        borderBottomLeftRadius: 25,
                    }}>
                        <Card
                            style={{ borderColor: '#ffffff', elevation: 0 }}>
                            <Card.Content>
                                <Paragraph>Regular account</Paragraph>
                                <View style={{ flexDirection: 'row', alignItems: 'baseline' }}>
                                    <Title>{formatNumber(regular)}</Title><Paragraph>LTO</Paragraph>
                                </View>
                                <Paragraph>Equivalent to ...</Paragraph>
                            </Card.Content>

                        </Card>

                        <Card
                            style={{ borderColor: '#ffffff', elevation: 0 }}>
                            <Card.Content>
                                <Paragraph>Prize</Paragraph>
                                <Title>?</Title>
                                <Paragraph>... %(last 24h)</Paragraph>
                            </Card.Content>
                        </Card>

                    </View>

                    <View style={{ marginTop: 10, flexDirection: 'row', justifyContent: 'space-evenly', width: '100%' }}>
                        <Card style={{
                            shadowColor: '#A9F2F7',
                            shadowOffset: { width: 5, height: 9 },
                            shadowOpacity: 0.4,
                            shadowRadius: 9,
                            elevation: 40,
                            borderRadius: 20,
                            width: 150
                        }}>
                            <Card.Content>
                                <Paragraph>Generating</Paragraph>
                                <View style={{ flexDirection: 'row', alignItems: 'baseline' }}>
                                    <Title>{formatNumber(generating)}</Title><Paragraph>LTO</Paragraph>
                                </View>
                            </Card.Content>

                        </Card>

                        <Card style={{
                            shadowColor: '#A9F2F7',
                            shadowOffset: { width: 5, height: 9 },
                            shadowOpacity: 0.4,
                            shadowRadius: 9,
                            elevation: 40,
                            borderRadius: 20,
                            width: 160,
                            height: 100
                        }}>
                            <Card.Content>
                                <Paragraph>Available</Paragraph>
                                <View style={{ flexDirection: 'row', alignItems: 'baseline' }}>
                                    <Title>{formatNumber(available)}</Title><Paragraph>LTO</Paragraph>
                                </View>
                            </Card.Content>
                        </Card>

                    </View>

                    <View style={{ marginTop: 20, flexDirection: 'row', justifyContent: 'space-evenly', width: '100%' }}>
                        <Card style={{
                            shadowColor: '#A9F2F7',
                            shadowOffset: { width: 5, height: 9 },
                            shadowOpacity: 0.4,
                            shadowRadius: 9,
                            elevation: 40,
                            borderRadius: 20,
                            width: 150
                        }}>
                            <Card.Content>
                                <Paragraph>Effective</Paragraph>
                                <View style={{ flexDirection: 'row', alignItems: 'baseline' }}>
                                    <Title>{convertLTOtoUSD(effective)}</Title><Paragraph>$</Paragraph>
                                </View>
                            </Card.Content>

                        </Card>

                        <Card style={{
                            shadowColor: '#A9F2F7',
                            shadowOffset: { width: 5, height: 9 },
                            shadowOpacity: 0.4,
                            shadowRadius: 9,
                            elevation: 40,
                            borderRadius: 20,
                            width: 160,
                            height: 100
                        }}>
                            <Card.Content>
                                <Paragraph>No. of transactions</Paragraph>
                                <Title>?</Title>
                            </Card.Content>
                        </Card>

                    </View>

                    <QRIcon icon="qrcode-scan" color='#ffffff' onPress={() => alert('yeiiiii')} />

                </View>
            }
        </>
    )
}
