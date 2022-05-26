import React, { useRef, useState } from 'react';

import {
    SafeAreaView,
    Image,
    StyleSheet,
    FlatList,
    View,
    Text,
    StatusBar,
    TouchableOpacity,
    Dimensions,
} from 'react-native';

const { width, height } = Dimensions.get('window');

const slides = [
    {
        id: '1',
        image: require('../../assets/images/illustration_slide_1.png'),
        titleImg: require('../../assets/images/brand_logo.png'),
        subtitle: 'Lorem ipsum dolor sit amet, consectetur adipisciem ipsum dolor sit amet, consectetur aem ipsum dolor sit amet, constur ang elit.',
    },
    {
        id: '2',
        image: require('../../assets/images/illustration_slide_2.png'),
        titleImg: require('../../assets/images/brand_logo.png'),
        subtitle: 'Lorem ipsum dolor sit amet, consectetur adipisciem ipsum dolor sit amet, consectetur aem ipsum dolor sit amet, constur ang elit.',
    },
];

const Slide = ({ item }) => {
    return (
        <View style={{ alignItems: 'center', width: 392 }}>
            <View style={{ width: 470, alignItems: 'flex-start', marginLeft: 150 }}>
                <Image source={item?.titleImg} style={styles.titleImg} />
                <Text style={styles.subtitle}>{item?.subtitle}</Text>
            </View>
            <Image
                source={item?.image}
                style={{ height: '55%', resizeMode: 'contain' }}
            />
        </View>
    );
};

export default function OnboardingScreen({ navigation }) {

    const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
    const ref = useRef();

    const updateCurrentSlideIndex = e => {
        const contentOffsetX = e.nativeEvent.contentOffset.x;
        const currentIndex = Math.round(contentOffsetX / width);
        setCurrentSlideIndex(currentIndex);
    };

    const goToOtherSlide = () => {
        const nextSlideIndex = currentSlideIndex + 1 || currentSlideIndex - 1;
        if (nextSlideIndex === slides.length) {
            const offset = nextSlideIndex / width;
            ref?.current.scrollToOffset({ offset });
            setCurrentSlideIndex(currentSlideIndex - 1);
        } else if (nextSlideIndex === slides.length - 1) {
            const offset = nextSlideIndex * width;
            ref?.current.scrollToOffset({ offset });
            setCurrentSlideIndex(currentSlideIndex + 1);
        }
    };

    const Header = () => {
        return (
            <View
                style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    marginBottom: -20
                }}>

                {/* Render More Info*/}
                <View style={{ height: 35, marginLeft: 40 }}>
                    <TouchableOpacity
                        onPress={goToOtherSlide}>
                        <Text
                            style={{
                                fontSize: 15,
                                color: 'purple'
                            }}>
                            More info
                        </Text>
                    </TouchableOpacity>
                </View>

                {/* Render Skip */}
                {currentSlideIndex !== slides.length - 1 &&
                    <View style={{ height: 35, marginRight: 30 }}>
                        <TouchableOpacity
                            onPress={() => navigation.replace('Root')}>
                            <Text
                                style={{
                                    fontSize: 15,
                                    color: 'purple'
                                }}>
                                Skip
                            </Text>
                        </TouchableOpacity>
                    </View>
                }
            </View>
        )
    }

    const Footer = () => {
        return (
            <View
                style={{
                    height: height * 0.15,
                    width,
                    justifyContent: 'space-between',
                    paddingHorizontal: 20,
                }}>
                {/* Indicator container */}
                <View
                    style={{
                        flexDirection: 'row',
                        justifyContent: 'center',
                        marginTop: 0,
                    }}>
                    {/* Render indicator */}
                    {slides.map((_, index) => (
                        <View
                            key={index}
                            style={[
                                styles.indicator,
                                currentSlideIndex == index && {
                                    backgroundColor: 'black',
                                    width: 5
                                }
                            ]}
                        />
                    ))}
                </View>

                {/* Render Start button */}
                <View style={{ marginBottom: 20 }}>
                    {currentSlideIndex === slides.length - 1 && (
                        <View style={{ height: 50, alignItems: 'center' }}>
                            <TouchableOpacity
                                style={styles.btn}
                                onPress={() => navigation.replace('Root')}>
                                <Text style={{ fontWeight: 'bold', fontSize: 17, color: '#ffffff' }}>
                                    Start
                                </Text>
                            </TouchableOpacity>
                        </View>
                    )}
                </View>
            </View>
        )
    }

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#ffffff', paddingTop: 50, paddingRight: 30 }}>
            <StatusBar backgroundColor='#ffffff' />
            <Header />
            <FlatList
                ref={ref}
                onMomentumScrollEnd={updateCurrentSlideIndex}
                contentContainerStyle={{ height: height * 0.9, marginTop: 50 }}
                showsHorizontalScrollIndicator={false}
                horizontal
                data={slides}
                pagingEnabled
                renderItem={({ item }) => <Slide item={item} />}
            />
            <Footer />
        </SafeAreaView>
    )
}


const styles = StyleSheet.create({
    subtitle: {
        color: 'black',
        fontSize: 13,
        marginTop: 35,
        maxWidth: '70%',
        textAlign: 'justify',
    },

    titleImg: {
        resizeMode: 'contain',
        height: 200,
        width: 200,
        marginBottom: -90,
        marginTop: -90
    },

    indicator: {
        height: 6,
        width: 6,
        backgroundColor: 'grey',
        marginHorizontal: 3,
        borderRadius: 5,
    },

    btn: {
        height: 45,
        width: 240,
        borderRadius: 20,
        backgroundColor: 'purple',
        justifyContent: 'center',
        alignItems: 'center',
    },
})