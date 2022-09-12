import { txFromData } from '@ltonetwork/lto'
import { BarCodeScanner } from 'expo-barcode-scanner'
import React, { useContext, useEffect, useState } from 'react'
import { Text } from 'react-native-paper'
import { RootStackScreenProps } from '../../../types'
import Spinner from '../../components/Spinner'
import {
    CenteredView,
    ScannerContainer,
    StyledScanner,
    StyledText,
    TextContainer,
} from '../../components/styles/Scanner.styles'
import { MessageContext } from '../../context/UserMessage.context'
import LocalStorageService from '../../services/LocalStorage.service'

export default function ScanTransactionScreen({ navigation }: RootStackScreenProps<'ScanTransaction'>) {
    const [isLoading, setIsLoading] = useState<boolean>(true)
    const [permission, setPermission] = useState<boolean>(true)
    const { setShowMessage, setMessageInfo } = useContext(MessageContext)

    useEffect(() => {
        requestCameraPermission()
    }, [permission])

    const requestCameraPermission = () => {
        BarCodeScanner.requestPermissionsAsync()
            .then(({ status }) => {
                status === 'granted' ? setPermission(true) : setPermission(false)
                setIsLoading(false)
            })
            .catch((err) => {
                setPermission(false)
                setIsLoading(false)
                console.log(err)
            })
    }

    const handleQR = async (transaction: string) => {
        const tx = JSON.parse(transaction)
        if (transaction.includes('http://schema.lto.network/simple-auth-v1.json')) {
            try {
                const accountData = await LocalStorageService.getData('@accountData')
                const LTO = require('@ltonetwork/lto').LTO
                const lto = new LTO(process.env.LTO_NETWORK_ID || 'T')
                const account = lto.account({ seed: accountData[0].seed })
                const auth = {
                    '@schema': 'http://schema.lto.network/simple-auth-v1.json',
                    url: `${tx.url}`,
                }
                const signature = account.sign(`lto:sign:${auth.url}`).base58
                const data = {
                    address: account.address,
                    keyType: 'ed25519',
                    publicKey: account.publicKey,
                    signature,
                }
                const axios = require('axios').default
                await axios.post(`${tx.url}`,
                    {
                        address: data.address,
                        keyType: data.keyType,
                        publicKey: data.publicKey,
                        signature: signature,
                    },
                    { timeout: 5000 })
                setMessageInfo(`Successful log in!`)
                setShowMessage(true)
                navigation.goBack()
            } catch (error) {
                setMessageInfo(`There's been an error! Try again!`)
                setShowMessage(true)
                navigation.goBack()
                console.log(error)
            }

        } else if (transaction.includes(`"type":4`)) {
            try {
                const myAccount = await LocalStorageService.getData('@accountData')
                const LTO = require('@ltonetwork/lto').LTO
                const lto = new LTO(process.env.LTO_NETWORK_ID || 'T')
                const account = lto.account({ seed: myAccount[0].seed })

                if (tx.sender !== account.address) {
                    setMessageInfo('Sender address is not valid!')
                    setShowMessage(true)
                } else {
                    tx.sender = undefined
                    const transferObject = txFromData(tx)
                    const signedTransfer = transferObject.signWith(account)
                    await lto.node.broadcast(signedTransfer)
                    setMessageInfo('Transfer sent successfully!')
                    setShowMessage(true)
                }
            } catch (error) {
                setMessageInfo(`There's been an error! Try again!`)
                setShowMessage(true)
                console.log(error)
            }
        }
    }

    if (isLoading) {
        return (
            <CenteredView>
                <Spinner />
            </CenteredView>
        )
    }

    if (permission) {
        return (
            <ScannerContainer>
                <StyledScanner
                    onBarCodeScanned={({ data }) => {
                        try {
                            handleQR(data)
                            navigation.navigate('Root', { screen: 'Wallet' })
                        } catch (err) {
                            console.log(err)
                        }
                    }}
                ></StyledScanner>
                <TextContainer>
                    <StyledText title>QR Scanner</StyledText>
                    <StyledText>
                        Scan the QR code from LTO's web application to confirm your transfer with your mobile phone
                    </StyledText>
                </TextContainer>
            </ScannerContainer>
        )
    } else {
        return (
            <CenteredView>
                <Text>Permission denied!</Text>
            </CenteredView>
        )
    }
}
