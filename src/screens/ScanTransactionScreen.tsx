import { BarCodeScanner } from 'expo-barcode-scanner'
import React, { useEffect, useState } from 'react'
import { Dimensions, SafeAreaView, StyleSheet, View } from 'react-native'
import { Text } from 'react-native-paper'
import { RootStackScreenProps } from '../../types'
import { CenteredView, StyledScanner, StyledText } from '../components/styles/ScanScreen.styles'
import LocalStorageService from '../services/LocalStorage.service'
import { LTO } from '@ltonetwork/lto'


export default function ScanTransactionScreen({ navigation }: RootStackScreenProps<'ScanTransaction'>) {
    const [isLoading, setIsLoading] = useState<boolean>(true)
    const [signature, setSignature] = useState<string>()
    // const [transactionData, setTransactionData] = useState<any>()
    const [permission, setPermission] = useState<boolean>(true)

    useEffect(() => {
        getSignature()
    }, [])

    useEffect(() => {
        handleSignature
    }, [signature])

    const getSignature = () => {
        LocalStorageService.getData('@accountData')
            .then((accountInfo) => {
                setSignature(accountInfo.signature)
            })
    }

    const handleSignature = async (input: any) => {
        try {
            const accountInfo = await LocalStorageService.getData('@accountData')
            const publicKey = accountInfo.publicKey

            const transfer = JSON.parse(input)
            transfer.senderPublicKey = publicKey
            transfer.proofs = [signature]

            const lto = new LTO('T')
            console.log('signature: ', signature, 'transfer: ', transfer)
            const broadcastedTx = await lto.node.broadcast(transfer)
        } catch (error) {
            console.log(error)
        }
    }

    return (
        { isLoading } && (
            <View style={styles.container}>

                <BarCodeScanner
                    style={{
                        width: Dimensions.get('window').width,
                        height: Dimensions.get('window').height

                    }}
                    onBarCodeScanned={({ data }) => {
                        try {
                            handleSignature(data)
                            setIsLoading(false)
                            navigation.goBack()
                        }
                        catch (err) {
                            console.log(err)
                        }
                        finally {
                            setIsLoading(false)
                        }
                    }}
                >
                    <Text>QR Scanner</Text>
                    <Text >Scan the QR code from LTO's web application to import your wallet into your mobile phone</Text>
                </BarCodeScanner>

            </View>


        )
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
    },
})