import AsyncStorage from '@react-native-async-storage/async-storage'
import React, { useEffect, useState } from 'react'
import { Button, StatusBar, StyleSheet, View } from 'react-native'
import { Card, Paragraph, Title } from 'react-native-paper'
import { RootTabScreenProps } from '../types'


export default function WalletTabScreen({ navigation, route }: RootTabScreenProps<'Wallet'>) {
    const [account, setAccount] = useState()


    const getData = async (value: string) => {
        // get Data from Storage
        try {
            const data = await AsyncStorage.getItem(value)
            if (data !== null) {
                console.log(data)
                return data
            }
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        getData('storageKey')
            .then(data => {
                const factory = require('@ltonetwork/lto').AccountFactoryED25519
                const acc = new factory('T').createFromPrivateKey(data)
                setAccount(acc)
                console.log("yourKey Value:  " + data)
            })

            .catch(err => console.log(err))
    }
        , [])

    return (
        <>
            <StatusBar backgroundColor={'#ffffff'} />

            <View style={{ alignContent: 'center' }}>

                <View style={{
                    marginTop: -10,
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
                            <Title>4356</Title>
                            <Paragraph>Equivalent to ...</Paragraph>
                        </Card.Content>

                    </Card>

                    <Card
                        style={{ borderColor: '#ffffff', elevation: 0 }}>
                        <Card.Content>
                            <Paragraph>Prize</Paragraph>
                            <Title>4675</Title>
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
                            <Title>34</Title>
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
                            <Title>56</Title>
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
                            <Title>987</Title>
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
                            <Title>5</Title>
                        </Card.Content>
                    </Card>

                </View>

                <Button
                    title="Test"
                    onPress={() => console.log(account)}>
                </Button>


            </View>

        </>
    )
}





