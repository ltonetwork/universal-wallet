import { TouchableOpacity, Text, View } from "react-native"
import slides from "../utils/slideList";
import { useNavigation } from "@react-navigation/native";

export default function Header({ currentSlideIndex, goToOtherSlide }) {

    const navigation = useNavigation();

    return (
        <View
            style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginBottom: -20
            }}>

            <View style={{ height: 35, marginLeft: 40 }}>
                <TouchableOpacity
                    onPress={goToOtherSlide}>
                    <Text
                        style={{
                            fontSize: 15,
                            color: '#A017B7'
                        }}>
                        More info
                    </Text>
                </TouchableOpacity>
            </View>

            {currentSlideIndex !== slides.length - 1 &&
                <View style={{ height: 35, marginRight: 30 }}>
                    <TouchableOpacity
                        onPress={() => navigation.navigate('Root')}>
                        <Text
                            style={{
                                fontSize: 15,
                                color: '#A017B7'
                            }}>
                            Skip
                        </Text>
                    </TouchableOpacity>
                </View>
            }
        </View>
    )
}