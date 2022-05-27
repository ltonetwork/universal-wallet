import { View, Text } from "react-native"
import styled from "styled-components/native"
import { Dimensions } from "react-native"
import slides from "../utils/slideList";
import { useNavigation } from "@react-navigation/native";


export default function Footer({ currentSlideIndex }) {

    const { width, height } = Dimensions.get('window')
    const navigation = useNavigation();

    return (
        <View
            style={{
                height: height * 0.15,
                width,
                justifyContent: 'space-between',
                paddingHorizontal: 20,
            }}>

            <View
                style={{
                    flexDirection: 'row',
                    justifyContent: 'center',
                    marginTop: 0,
                }}>

                {slides.map((_, index) => (
                    <Indicator
                        key={index}
                        style={[
                            currentSlideIndex == index && {
                                backgroundColor: 'black',
                                width: 5
                            }
                        ]}
                    />
                ))}
            </View>

            <View style={{ marginBottom: 20 }}>
                {currentSlideIndex === slides.length - 1 && (
                    <View style={{ height: 50, alignItems: 'center' }}>
                        <StartButton
                            onPress={() => navigation.navigate('Root')}>
                            <Text style={{ fontWeight: 'bold', fontSize: 17, color: '#ffffff' }}>
                                Start
                            </Text>
                        </StartButton>
                    </View>
                )}
            </View>
        </View>
    )
}


const Indicator = styled.View`
    height: 6px;
    width: 6px;
    background-color: #889798;
    margin: 0 3px;
    border-radius: 5px;
`

const StartButton = styled.TouchableOpacity`
    height: 45px;
    width: 240px;
    border-radius: 20px;
    background-color: #A017B7;
    justify-content: center;
    align-items: center;
`