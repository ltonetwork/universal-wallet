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
import ApiClientService from '../../services/ApiClient.service'
import LocalStorageService from '../../services/LocalStorage.service'
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

    const handleLogin = async (auth: TypedTransaction) => {
        setIsLoading(true)
        try {
            const accountFromStorage = await LocalStorageService.getData('@accountData')
            const account = await ApiClientService.importAccount(accountFromStorage[0].seed)
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

    const handleTx = async (data: TypedTransaction) => {
        setIsLoading(true)
        if (data?.type === 4) {
            try {
                const accountFromStorage = await LocalStorageService.getData('@accountData')
                const account = await ApiClientService.importAccount(accountFromStorage[0].seed)
                if (tx?.sender !== account.address) {
                    setMessageInfo('Sender address is not valid!')
                    setShowMessage(true)
                } else {
                    if (tx != undefined) tx.sender = ''
                    const transferObject = tx && txFromData(tx)
                    const signedTransfer = transferObject?.signWith(account)
                    await ApiClientService.broadcast(signedTransfer)
                    setMessageInfo('Transfer sent successfully!')
                    setShowMessage(true)
                }
            } catch (error) {
                setMessageInfo('Transaction failed: try again!')
                setShowMessage(true)
            }
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
