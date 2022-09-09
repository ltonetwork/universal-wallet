import { Transfer, txFromData } from '@ltonetwork/lto'
import { BarCodeScanner } from 'expo-barcode-scanner'
import React, { useContext, useEffect, useState } from 'react'
import { Text } from 'react-native-paper'
import { RootStackScreenProps } from '../../../types'
import Spinner from '../../components/Spinner'
import { MessageContext } from '../../context/UserMessage.context'
import LocalStorageService from '../../services/LocalStorage.service'
import {
    CenteredView,
    ScannerContainer,
    StyledScanner,
    StyledText,
    TextContainer,
} from '../../components/styles/Scanner.styles'

export default function ScanTransactionScreen({ navigation }: RootStackScreenProps<'ScanTransaction'>) {
    const [isLoading, setIsLoading] = useState<boolean>(true)
    const [permission, setPermission] = useState<boolean>(true)
    const [data, setData] = useState<string>('')

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

    useEffect(() => {
        if (permission) {
            handleConfirmation
        }
    }, [])

    const { setShowMessage, setMessageInfo } = useContext(MessageContext)

    const handleConfirmation = async (input: any) => {
        if (input.includes('http://schema.lto.network/simple-auth-v1.json')) {
            try {
                const myAccount = await LocalStorageService.getData('@accountData')
                const LTO = require('@ltonetwork/lto').LTO
                const lto = new LTO('T')
                const account = lto.account({ seed: myAccount[0].seed })
                const qrInfo = JSON.parse(input)
                const auth = {
                    '@schema': 'http://schema.lto.network/simple-auth-v1.json',
                    url: `${qrInfo.url}`,
                }
                const signature = account.sign(`lto:sign:${auth.url}`).base58
                const data = {
                    address: account.address,
                    keyType: 'ed25519',
                    publicKey: account.publicKey,
                    signature
                }

                console.log('INPUT URL: ', qrInfo.url)
                console.log('SIGNATURE: ', signature)
                console.log('DATA: ', data)


                const requestOptions = {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data),
                }
                fetch(`${auth.url}`, requestOptions)
                    .then((response) => response.json())
                    .then((data) => {
                        // setData({ postId: data.id })
                        console.log('IT WORKS!: ', data)
                    })
                    .catch((err) => {
                        console.log(err)
                    })

                // post(auth.url, data);
            } catch (error) {
                setMessageInfo(`There's been an error! Try again!`)
                setShowMessage(true)
                console.log(error)
            }
        } else
            try {
                const myAccount = await LocalStorageService.getData('@accountData')
                const LTO = require('@ltonetwork/lto').LTO
                const lto = new LTO('T')
                const account = lto.account({ seed: myAccount[0].seed })
                const transfer = JSON.parse(input)

                if (transfer.sender !== account.address) {
                    setMessageInfo('Sender address is not valid!')
                    setShowMessage(true)
                } else {
                    transfer.sender = undefined
                    // transfer.timestamp = undefined
                    const transferObject = txFromData(transfer)
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
                            handleConfirmation(data)
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
