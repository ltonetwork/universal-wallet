import { txFromData } from '@ltonetwork/lto'
import { BarCodeScanner } from 'expo-barcode-scanner'
import React, { useContext, useEffect, useState } from 'react'
import { Text } from 'react-native-paper'
import { RootStackScreenProps } from '../../../types'
import ConfirmationDialog from '../../components/ConfirmationDialog'
import Spinner from '../../components/Spinner'
import {
    CenteredView,
    ScannerContainer,
    StyledScanner,
    StyledText,
    TextContainer
} from '../../components/styles/Scanner.styles'
import { QR_READER } from '../../constants/Text'
import { AUTH_SCHEMA, TRANSACTION_SCHEMA } from '../../constants/Urls'
import { MessageContext } from '../../context/UserMessage.context'
import { TypedTransaction } from '../../interfaces/TypedTransaction'
import LTOService from '../../services/LTO.service'
import { confirmationMessage } from '../../utils/confirmationMessage'

export default function QrReader({ navigation }: RootStackScreenProps<'QrReader'>) {
    const [isLoading, setIsLoading] = useState<boolean>(true)
    const [permission, setPermission] = useState<boolean>(true)
    const { setShowMessage, setMessageInfo } = useContext(MessageContext)
    const [scanned, setScanned] = useState(false)

    const [tx, setTx] = useState<TypedTransaction | undefined>()
    const [dialogVisible, setDialogVisible] = useState(false)

    useEffect(() => {
        requestCameraPermission()
    }, [permission])

    const requestCameraPermission = () => {
        BarCodeScanner.requestPermissionsAsync()
            .then(({ status }) => {
                status === 'granted' ? setPermission(true) : setPermission(false)
                setIsLoading(false)
            })
            .catch(() => {
                setPermission(false)
                setIsLoading(false)
            })
    }

    useEffect(() => {
        if (tx) {
            handleTx(tx)
        }
    }, [])

    const handleBarCodeScanned = ({ data }: any) => {
        try {
            setScanned(true)

            const _data = JSON.parse(data)
            const schema = _data['@schema'] || TRANSACTION_SCHEMA

            if (schema === AUTH_SCHEMA) {
                return handleLogin(_data)
            }

            if (schema === TRANSACTION_SCHEMA) {
                setTx(_data)
                setDialogVisible(true)
                return
            }

            throw Error(`Unknown schema ${schema}`)
        } catch (error) {
            console.error(error)
            setMessageInfo('Invalid QR!')
            setShowMessage(true)
            navigation.goBack()
        }
    }

    const handleLogin = async (auth: {url: string}) => {
        setIsLoading(true)
        try {
            const account = await LTOService.getAccount()
            const signature = account.sign(`lto:sign:${auth.url}`).base58
            const data = {
                address: account.address,
                keyType: 'ed25519',
                publicKey: account.publicKey,
                signature,
            }
            const axios = require('axios').default
            await axios.post(
                `${auth.url}`,
                data,
                { timeout: 5000 }
            )
            setMessageInfo(`Successful log in!`)
            setShowMessage(true)
        } catch (error) {
            console.error(error + (error.response? `. ${error.response.data}` : ''))
            setMessageInfo('Login failed: scan QR again!')
            setShowMessage(true)
        }
        setIsLoading(false)
        navigation.goBack()
    }

    const handleTx = async (tx: TypedTransaction) => {
        setIsLoading(true)

        const account = await LTOService.getAccount()
        if (tx?.sender !== account.address) {
            setMessageInfo('Sender address is not valid!')
            setShowMessage(true)
            return
        }

        try {
            const transaction = txFromData({...tx, sender: null}).signWith(account)
            await LTOService.broadcast(transaction)

            setMessageInfo('Transaction sent successfully!')
            setShowMessage(true)
        } catch (error) {
            console.error(`Transaction failed. ${error}`)
            setMessageInfo('Transaction failed: try again!')
            setShowMessage(true)
        }

        setIsLoading(false)
        navigation.goBack()
    }

    if (isLoading) {
        return <Spinner />
    }

    if (permission) {
        return (
            <ScannerContainer>
                <StyledScanner onBarCodeScanned={scanned ? undefined : handleBarCodeScanned} />
                <TextContainer>
                    <StyledText title>{QR_READER.TITLE}</StyledText>
                    <StyledText>{QR_READER.SUBTITLE}</StyledText>
                </TextContainer>
                {tx?.sender ? (
                    <ConfirmationDialog
                        visible={dialogVisible}
                        message={confirmationMessage(tx)}
                        cancelPress={() => navigation.goBack()}
                        onPress={() => handleTx(tx)}
                    />
                ) : null}
            </ScannerContainer>
        )
    } else {
        return (
            <CenteredView>
                <Text>{QR_READER.DENIED}</Text>
            </CenteredView>
        )
    }
}
