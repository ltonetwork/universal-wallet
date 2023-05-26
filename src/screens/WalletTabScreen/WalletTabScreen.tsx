import { useFocusEffect, useIsFocused } from '@react-navigation/native'
import React, { useEffect, useState } from 'react'
import {
    AppState,
    AppStateStatus,
    BackHandler,
    ImageBackground,
    Text,
    useWindowDimensions
} from 'react-native'
import { Button, Card, List, Paragraph } from 'react-native-paper'
import { RootTabScreenProps } from '../../../types'
import OverviewHeader from '../../components/OverviewHeader'
import StatusBarIOS from '../../components/StatusBarIOS'
import { StyledImage } from '../../components/styles/OverviewHeader.styles'
import { LATEST_TRANSACTIONS } from '../../constants/Quantities'
import { WALLET } from '../../constants/Text'
import { TypedCoinData } from '../../interfaces/TypedCoinData'
import { TypedDetails } from '../../interfaces/TypedDetails'
import { TypedTransaction } from "../../interfaces/TypedTransaction"
import LTOService from '../../services/LTO.service'
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
    TopCardsContainer,
    TopCardsRipple,
    TopContainer,
    ActivityCard
} from './WalletTabScreen.styles'
import { useInterval } from "../../utils/useInterval"
import { formatDate } from "../../utils/formatDate"
import { shortAddress } from "../../utils/shortAddress"
import If from "../../components/If"
import { TypedLease } from "../../interfaces/TypedLease"
import CommunityNodesService from "../../services/CommunityNodes.service"
import WalletFAB from "../../components/WalletFAB"
import Collapsible from "react-native-collapsible"
import ShortSectionList from "../../components/ShortSectionList"
import ShortList from "../../components/ShortList"
import ScrollContainer from "../../components/ScrollContainer"
import TransactionListItem from "../../components/TransactionListItem"
import Loader from "../../components/Loader"
import CoinPriceService from "../../services/CoinPrice.service"

export default function WalletTabScreen({ navigation }: RootTabScreenProps<'Wallet'>) {

    const { width, height } = useWindowDimensions()

    const [appState, setAppState] = useState<AppStateStatus>(AppState.currentState)
    const [accountAddress, setAccountAddress] = useState('')
    const [isLoading, setIsLoading] = useState<boolean>(true)
    const [showBalanceDetails, setShowBalanceDetails] = useState<boolean>(false)
    const [leases, setLeases] = useState<{ address: string, name?: string, amount: number }[]>([])
    const [transactions, setTransactions] = useState<{ date: string, data: TypedTransaction[] }[]>([])
    const [details, setDetails] = useState<TypedDetails>({} as TypedDetails)
    const [coinData, setCoinData] = useState<TypedCoinData>({} as TypedCoinData)

    const { available, effective, leasing, regular, unbonding } = details
    const { price, percent_change_24h } = coinData

    const isFocused = useIsFocused()

    useEffect(() => {
        if (isFocused) {
            loadAccount()
        }
    }, [isFocused])


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
        }, [])
    )

    useFocusEffect(
        React.useCallback(() => {
            Promise.all([
                loadAccountDetails(),
                loadLeases(),
                loadTransactions(),
            ]).then(() => setIsLoading(false))
        }, [accountAddress])
    )

    useInterval(() => {
        loadAccountDetails()
        loadLeases()
        loadTransactions()
    }, 5 * 1000)

    const loadAccount = () => {
        return LTOService.getAccount()
            .then(account => setAccountAddress(account.address))
    }

    const loadAccountDetails = async () => {
        if (accountAddress === '') {
            setDetails({} as TypedDetails)
            return
        }

        return LTOService.getBalance(accountAddress)
            .then(accountDetails => setDetails(accountDetails))
            .catch(error => { throw new Error(`Error retrieving account data. ${error}`) })
    }

    const loadLeases = async () => {
        if (accountAddress === '') {
            setLeases([])
            return
        }

        try {
            const leases: TypedLease[] = await LTOService.getLeases(accountAddress)
            const groupedLeases: Map<string, number> = new Map()

            for (const lease of leases) {
                if (lease.sender !== accountAddress) continue
                groupedLeases.set(lease.recipient, lease.amount + (groupedLeases.get(lease.recipient) || 0))
            }

            const activeLeases: { address: string, name?: string, amount: number }[] = []
            for (const [address, amount] of groupedLeases.entries()) {
                const node = await CommunityNodesService.info(address)
                activeLeases.push({ address, name: node?.name, amount })
            }

            setLeases(activeLeases.sort((a, b) => b.amount - a.amount))
        } catch (error) {
            throw new Error(`Error retrieving active leases. ${error}`)
        }
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
                const date = formatDate(tx.timestamp!)
                txsByDate.set(date, [...txsByDate.get(date) || [], tx])
            }
            setTransactions(Array.from(txsByDate.entries()).map(([date, txs]) => ({ date, data: txs })))
        } catch (error) {
            throw new Error(`Error retrieving latest transactions. ${error}`)
        }
    }

    useEffect(() => {
        const controller = new AbortController()
        const signal = controller.signal
        const getPriceInfo = () => {
            setIsLoading(true)
            CoinPriceService.getCoinInfo(signal)
                .then(price => {
                    setCoinData(price)
                })
                .catch(error => {
                    throw new Error(`Error retrieving coin data. ${error}`)
                })
        }
        getPriceInfo()
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

    const renderLease = (lease: { address: string, name?: string, amount: number }) => {
        return <List.Item
            key={`lease:${lease.address}`}
            title={lease.name ?? shortAddress(lease.address)}
            titleStyle={{ fontSize: 14 }}
            description={lease.name || true ? shortAddress(lease.address) : ''}
            descriptionStyle={{ fontSize: 12, marginBottom: 0 }}
            right={({ style }) => <Text style={{ ...style, alignSelf: 'center' }}>{formatNumber(lease.amount)} LTO</Text>}
            onPress={() => navigation.navigate('Lease', { address: lease.address })}
        />
    }

    const handleAppStateChange = (nextAppState: AppStateStatus): void => {
        if (appState === 'active' && nextAppState?.match(/background/)) {
            LTOService.lock()
            setTimeout(() => {
                navigation.navigate('LockedScreen')
            }, 500)
        }
        setAppState(nextAppState)
    }

    useEffect(() => {
        const unsubscribeAppState = AppState.addEventListener('change', handleAppStateChange)
        return () => {
            unsubscribeAppState.remove()
        }
    }, [])


    return (
        <Loader loading={isLoading}>
            <StatusBarIOS backgroundColor={'#ffffff'} />
            <ImageBackground source={backgroundImage} style={{ width, height, position: "absolute" }} />
            <OverviewContainer style={{ height }}>
                <TopContainer>
                    <OverviewHeader
                        icon={"menu"}
                        onPress={() => navigation.navigate('Menu')}
                        onQrPress={() => navigation.navigate('QrReader')}
                        input={<StyledImage testID="logo-title" source={logoTitle} />} />

                    <TopCardsRipple onPress={() => setShowBalanceDetails(!showBalanceDetails)} borderless={true}>
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
                    </TopCardsRipple>
                </TopContainer>

                <ScrollContainer style={{ marginTop: 2 }} innerStyle={{ paddingBottom: 130 }}>
                    <Collapsible collapsed={!showBalanceDetails}>
                        <BottomCardsContainer>
                            <BottomCard>
                                <Card.Content>
                                    <FieldName>{WALLET.LEASING}</FieldName>
                                    <AmountContainer>
                                        <Amount>{formatNumber(leasing, 0)}</Amount><Paragraph>{WALLET.LTO}</Paragraph>
                                    </AmountContainer>
                                </Card.Content>
                            </BottomCard>

                            <BottomCard>
                                <Card.Content>
                                    <FieldName>{WALLET.UNBONDING}</FieldName>
                                    <AmountContainer>
                                        <Amount>{formatNumber(unbonding, 0)}</Amount><Paragraph>{WALLET.LTO}</Paragraph>
                                    </AmountContainer>
                                </Card.Content>
                            </BottomCard>
                        </BottomCardsContainer>

                        <BottomCardsContainer>
                            <BottomCard>
                                <Card.Content>
                                    <FieldName>{WALLET.AVAILABLE}</FieldName>
                                    <AmountContainer>
                                        <Amount>{formatNumber(available, 0)}</Amount><Paragraph>{WALLET.LTO}</Paragraph>
                                    </AmountContainer>
                                </Card.Content>
                            </BottomCard>

                            <BottomCard>
                                <Card.Content>
                                    <FieldName>{WALLET.EFFECTIVE}</FieldName>
                                    <AmountContainer>
                                        <Amount>{formatNumber(effective, 0)}</Amount><Paragraph>{WALLET.LTO}</Paragraph>
                                    </AmountContainer>
                                </Card.Content>
                            </BottomCard>
                        </BottomCardsContainer>
                    </Collapsible>

                    <If condition={leases.length > 0}>
                        <ActivityCard>
                            <Card.Title title={WALLET.ACTIVE_LEASES} />
                            <ShortList
                                data={leases}
                                renderItem={({ item }) => renderLease(item)}
                            />
                        </ActivityCard>
                    </If>

                    <If condition={transactions.length > 0}>
                        <ActivityCard>
                            <Card.Title title={WALLET.RECENT_ACTIVITY} />
                            <Card.Content>
                                <ShortSectionList
                                    sections={transactions}
                                    renderSectionHeader={({ section: { date } }) => (
                                        <List.Subheader key={`transaction.section:${date}`}>{date}</List.Subheader>
                                    )}
                                    renderItem={({ item }) => (
                                        <TransactionListItem
                                            direction={item.sender === accountAddress ? 'out' : 'in'}
                                            tx={item}
                                        />
                                    )}
                                />
                            </Card.Content>
                            <Card.Actions>
                                <Button style={{ width: '100%' }} onPress={() => navigation.navigate('Transactions')}>
                                    {WALLET.MORE}
                                </Button>
                            </Card.Actions>
                        </ActivityCard>
                    </If>
                </ScrollContainer>
            </OverviewContainer>

            <WalletFAB
                transfer={() => navigation.navigate('CreateTransfer')}
                lease={() => navigation.navigate('CreateLease')}
            />
        </Loader>
    )
}
