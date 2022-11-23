import { useFocusEffect } from '@react-navigation/native'
import React, { useEffect, useState } from 'react'
import {BackHandler, ImageBackground, SectionList, Text, useWindowDimensions} from 'react-native'
import {Card, List, Paragraph} from 'react-native-paper'
import { RootTabScreenProps } from '../../../types'
import OverviewHeader from '../../components/OverviewHeader'
import QRButton from '../../components/QRButton'
import Spinner from '../../components/Spinner'
import StatusBarIOS from '../../components/StatusBarIOS'
import { StyledImage } from '../../components/styles/OverviewHeader.styles'
import { LATEST_TRANSACTIONS } from '../../constants/Quantities'
import { WALLET } from '../../constants/Text'
import txTypes from '../../constants/TransactionTypes'
import { TypedCoinData } from '../../interfaces/TypedCoinData'
import { TypedDetails } from '../../interfaces/TypedDetails'
import { TypedTransaction } from "../../interfaces/TypedTransaction";
import LTOService from '../../services/LTO.service'
import CoinMarketCapService from '../../services/CoinMarketCap.service'
import { formatNumber } from '../../utils/formatNumber'
import { backgroundImage, logoTitle } from "../../utils/images"
import {
    Amount,
    AmountContainer,
    BlueText,
    BottomCard,
    BottomCardsContainer,
    FieldName,
    GreenText,
    OverviewContainer,
    RedText,
    TopCard,
    TopCardsContainer, TransactionsCard
} from './WalletTabScreen.styles'
import {useInterval} from "../../utils/useInterval";
import {localeDate} from "../../utils/localeDate";
import Header from "../../components/Header";
import {shortAddress} from "../../utils/shortAddress";

export default function WalletTabScreen({ navigation }: RootTabScreenProps<'Wallet'>) {

    const { width, height } = useWindowDimensions()

    const [accountAddress, setAccountAddress] = useState('')
    const [isLoading, setIsLoading] = useState<boolean>(true)
    const [transactions, setTransactions] = useState<{title: string, data: TypedTransaction[]}[]>([])
    const [details, setDetails] = useState<TypedDetails>({} as TypedDetails)
    const [coinData, setCoinData] = useState<TypedCoinData>({} as TypedCoinData)

    const { available, effective, leasing, regular, unbonding } = details
    const { price, percent_change_24h } = coinData

    useFocusEffect(
        React.useCallback(() => {
            const onBackPress = () => {
                return true
            }
            BackHandler.addEventListener('hardwareBackPress', onBackPress)
            return () =>
                BackHandler.removeEventListener('hardwareBackPress', onBackPress)
        }, []),
    )

    useFocusEffect(
        React.useCallback(() => {
            loadAccount()
        },[])
    )

    useFocusEffect(
        React.useCallback(() => {
            Promise.all([
                loadAccountDetails(),
                loadTransactions(),
            ]).then(() => setIsLoading(false))
        },[accountAddress])
    )

    useInterval(() => {
        loadAccountDetails()
        loadTransactions()
    }, 5 * 1000)

    const loadAccount = () => {
        return LTOService.getAccount()
            .then(account => setAccountAddress(account.address))
    }

    const loadAccountDetails = async () => {
        if (accountAddress === '') {
            setDetails({} as TypedDetails);
            return
        }

        return LTOService.getAccountDetails(accountAddress)
            .then(accountDetails => setDetails(accountDetails))
            .catch(error => { throw new Error(`Error retrieving account data. ${error}`) })
    }

    const loadTransactions = async () => {
        if (accountAddress === '') {
            setTransactions([])
            return
        }

        try {
            const txs: TypedTransaction[] = await LTOService.getTransactions(accountAddress, LATEST_TRANSACTIONS)
            const txsByDate = new Map()

            for (const tx of txs.sort((a, b) => b.timestamp! - a.timestamp!)) {
                const date = localeDate(tx.timestamp!)
                txsByDate.set(date, [...txsByDate.get(date) || [], tx])
            }
            setTransactions(Array.from(txsByDate.entries()).map(([date, txs]) => ({title: date, data: txs})))
        } catch (error) {
            throw new Error(`Error retrieving latest transactions. ${error}`)
        }
    }

    useEffect(() => {
        const controller = new AbortController()
        const signal = controller.signal
        const getPrizeInfo = () => {
            setIsLoading(true)
            CoinMarketCapService.getCoinInfo(signal)
                .then(data => data.data[3714].quote.USD)
                .then(price => {
                    setCoinData(price)
                    setIsLoading(false)
                })
                .catch(error => {
                    throw new Error(`Error retrieving coin data. ${error}`)
                })
        }
        getPrizeInfo()
        return () => {
            controller.abort()
        }
    }, [])

    const effectiveAmount = () => {
        return regular * price
    }

    const change = effectiveAmount()

    const checkPositiveNegative = (value: number) => {
        if (value > 0) {
            return <GreenText>{value?.toFixed(2)}%(last 24h)</GreenText>
        } else if (value < 0) {
            return <RedText>{value?.toFixed(2)}%(last 24h)</RedText>
        } else {
            return <GreenText>{value?.toFixed(2)}%(last 24h)</GreenText>
        }
    }

    const renderTransaction = (tx: TypedTransaction) => {
        const direction = tx.sender === accountAddress ? 'out' : 'in'

        let description = ''
        if (direction === 'out') {
            if (tx.type === 11) {
                description = `To: ${tx.transfers.length} recipients`
            } else if (tx.recipient) {
                description = 'To: ' + shortAddress(tx.recipient)
            }
        } else {
            description = 'From: ' + shortAddress(tx.sender)
        }

        return <List.Item
            style={{ padding: 0}}
            title={txTypes[tx.type].description}
            titleStyle={{ fontSize: 14 }}
            description={description}
            descriptionStyle={{ fontSize: 12, marginBottom: 0 }}
            left={({color, style}) => <List.Icon color={color} style={style} icon={txTypes[tx.type].icon[direction]!}/>}
            right={({style}) => <Text style={{...style, alignSelf: 'center'}}>{tx.amount ? formatNumber(tx.amount) + ' LTO' : ''}</Text>}
        />
    }

    return (
        <>
            {isLoading
                ?
                <Spinner />
                :
                <>
                    <StatusBarIOS backgroundColor={'#ffffff'} />
                    <ImageBackground source={backgroundImage} style={{ width, height, position: "absolute" }} />
                    <OverviewContainer>
                        <OverviewHeader
                            marginLeft={undefined}
                            icon={"menu"}
                            onPress={() => navigation.navigate('Modal')}
                            input={<StyledImage testID="logo-title" source={logoTitle} />} />

                        <TopCardsContainer>
                            <TopCard>
                                <Card.Content style={{ borderRadius: 80 }}>
                                    <FieldName>{WALLET.REGULAR}</FieldName>
                                    <AmountContainer>
                                        <Amount>{formatNumber(regular)}</Amount><Paragraph>LTO</Paragraph>
                                    </AmountContainer>
                                    <BlueText>{WALLET.EQUIVALENT} {formatNumber(change)}{WALLET.DOLLAR_SYMBOL}</BlueText>
                                </Card.Content>
                            </TopCard>

                            <TopCard>
                                <Card.Content>
                                    <FieldName>{WALLET.PRICE}</FieldName>
                                    <Amount>{price?.toFixed(3)}{WALLET.DOLLAR_SYMBOL}</Amount>
                                    {checkPositiveNegative(percent_change_24h)}
                                </Card.Content>
                            </TopCard>
                        </TopCardsContainer>

                        <BottomCardsContainer >
                            <BottomCard>
                                <Card.Content>
                                    <FieldName>{WALLET.LEASING}</FieldName>
                                    <AmountContainer>
                                        <Amount>{formatNumber(leasing)}</Amount><Paragraph>{WALLET.LTO}</Paragraph>
                                    </AmountContainer>
                                </Card.Content>
                            </BottomCard>

                            <BottomCard >
                                <Card.Content>
                                    <FieldName>{WALLET.AVAILABLE}</FieldName>
                                    <AmountContainer>
                                        <Amount>{formatNumber(available)}</Amount><Paragraph>{WALLET.LTO}</Paragraph>
                                    </AmountContainer>
                                </Card.Content>
                            </BottomCard>
                        </BottomCardsContainer>

                        <BottomCardsContainer>
                            <BottomCard >
                                <Card.Content>
                                    <FieldName>{WALLET.EFFECTIVE}</FieldName>
                                    <AmountContainer>
                                        <Amount>{formatNumber(effective)}</Amount><Paragraph>{WALLET.LTO}</Paragraph>
                                    </AmountContainer>
                                </Card.Content>
                            </BottomCard>

                            <BottomCard >
                                <Card.Content>
                                    <FieldName>{WALLET.UNBONDING}</FieldName>
                                    <AmountContainer>
                                        <Amount>{formatNumber(unbonding)}</Amount><Paragraph>{WALLET.LTO}</Paragraph>
                                    </AmountContainer>
                                </Card.Content>
                            </BottomCard>
                        </BottomCardsContainer>

                        <TransactionsCard>
                            <Card.Title title="Recent Activity" />
                            <Card.Content>
                                <SectionList
                                    sections={transactions}
                                    renderSectionHeader={({ section: { title } }) => (
                                        <Text>{title}</Text>
                                    )}
                                    renderItem={({ item }) => renderTransaction(item)}
                                    keyExtractor={item => item.id!.toString()}
                                />
                            </Card.Content>
                        </TransactionsCard>
                    </OverviewContainer>
                    <QRButton onPress={() => navigation.navigate('QrReader')} />
                </>
            }
        </>
    )
}
