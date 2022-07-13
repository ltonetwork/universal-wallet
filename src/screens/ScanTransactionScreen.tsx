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
    const [permission, setPermission] = useState<boolean>(true)

    useEffect(() => {
        requestCameraPermission()
    }, [permission])

    const requestCameraPermission = () => {
        BarCodeScanner.requestPermissionsAsync()
            .then(({ status }) => {
                status === 'granted' ? setPermission(true) : setPermission(false)
                setIsLoading(false)
            })
            .catch(err => {
                setPermission(false)
                setIsLoading(false)
                console.log(err)
            })
    }

    // useEffect(() => {
    //     getSignature()
    // }, [])

    useEffect(() => {
        if (permission)
            handleSignature
    }, [])

    const handleSignature = async (input: any) => {
        try {
            const accountInfo = await LocalStorageService.getData('@accountData')
            const publicKey = accountInfo.publicKey
            const signature = accountInfo.signature

            const transfer = JSON.parse(input)
            transfer.senderPublicKey = publicKey
            transfer.signature = signature
            // transfer.amount = 200000000 // just for testing purposes
            // transfer.recipient = "3NAuHWZ7hcyN6Yh7oEuzasTFXa95XMV9baV" // just for testing purposes

            const lto = new LTO('T')
            console.log('signature: ', signature)
            console.log('transfer: ', transfer)
            await lto.node.broadcast(transfer)
        } catch (error) {
            console.log(error)
        }
    }


    if (isLoading) {
        return (
            <CenteredView>
                <Text>Requesting permission...</Text>
            </CenteredView>
        )
    }

    if (permission) {
        return (
            <View style={styles.container}>

                <BarCodeScanner
                    style={{
                        width: Dimensions.get('window').width,
                        height: Dimensions.get('window').height

                    }}
                    onBarCodeScanned={({ data }) => {
                        try {
                            console.log('QR data: ', data)
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
    }

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
    },
})