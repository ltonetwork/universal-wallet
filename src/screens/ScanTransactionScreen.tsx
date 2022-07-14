import { Transfer } from '@ltonetwork/lto'
import { BarCodeScanner } from 'expo-barcode-scanner'
import React, { useEffect, useState } from 'react'
import { Dimensions, StyleSheet, View } from 'react-native'
import { Text } from 'react-native-paper'
import { RootStackScreenProps } from '../../types'
import { CenteredView } from '../components/styles/ScanScreen.styles'
import LocalStorageService from '../services/LocalStorage.service'

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

    useEffect(() => {
        if (permission)
            handleSignature
    }, [])

    // CREATING A TRANSFER FROM SCRATCH
    const amount = 1300000000
    const recipient = "3NAuHWZ7hcyN6Yh7oEuzasTFXa95XMV9baV"
    const trans = new Transfer(recipient, amount)
    //

    const handleSignature = async (input: any) => {
        try {
            const myAccount = await LocalStorageService.getData('@accountData')

            // IMPORTING ACCOUNT AGAIN (WITH ITS SEEDS) JUST TO HAVE ".sign" METHOD (SIGNATURE)
            const LTO = require("@ltonetwork/lto").LTO
            const lto = new LTO('T')
            const seed = 'amount embark season idea hero truck exile guilt neck member basket input timber violin amount'
            const account = lto.account({ seed: myAccount.seed })

            // GET SIGNATURE FROM ACCOUNT BUT NOT USING IT AT THE MOMENT
            const auth = { "@context": "http://schema.lto.network/simple-auth-v1.json", "url": "https://auth.lto.network/UkRihLPt8VA1" }
            const signature = account.sign(`lto:sign:${auth.url}`).base58

            const transfer = JSON.parse(input) // TRANSFER FROM QR CODE
            // transfer.senderPublicKey = account2.publicKey
            console.log('TRANSFER BEFORE SIGNATURE: ', trans)
            await account.sign(trans)
            // transfer.signature = signature
            console.log('TRANSFER AFTER SIGNATURE: ', trans)
            console.log(myAccount.seed)

            // BROADCASTING TRANSFER
            await lto.node.broadcast(trans)
            console.log('TRANSFER AFTER BROADCAST: ', trans)
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
                            console.log('QR DATA: ', JSON.parse(data))
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