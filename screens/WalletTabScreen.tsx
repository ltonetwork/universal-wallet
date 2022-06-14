import React from 'react'
import { StatusBar, StyleSheet } from 'react-native'
import EditScreenInfo from '../components/EditScreenInfo'
// import { Text, View } from '../components/Themed'
import { RootTabScreenProps } from '../types'
import { Avatar, Button, Card, Title, Paragraph } from 'react-native-paper'
import { View } from 'react-native'

export default function WalletTabScreen({ navigation }: RootTabScreenProps<'Wallet'>) {
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
                            <Paragraph>No. Transactions</Paragraph>
                            <Title>5</Title>
                        </Card.Content>
                    </Card>

                </View>


            </View>

            {/* <View style={styles.container}>
                <Text style={styles.title}>Wallet</Text>
                <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
                <EditScreenInfo path="/screens/WalletTabScreen.tsx" />
            </View> */}
        </>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    separator: {
        marginVertical: 30,
        height: 1,
        width: '80%',
    },
})
