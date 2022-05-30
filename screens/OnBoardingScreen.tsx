import React, { useRef, useState } from 'react';
import slides from '../utils/slideList'
import Slide from '../components/Slide';
import Header from '../components/Header';
import Footer from '../components/Footer';
import {
    SafeAreaView,
    FlatList,
    StatusBar,
    Dimensions,
} from 'react-native';

export default function OnboardingScreen() {

    const { width, height } = Dimensions.get('window');
    const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
    const ref = useRef();

    const updateCurrentSlideIndex = e => {
        const contentOffsetX = e.nativeEvent.contentOffset.x;
        const currentIndex = Math.round(contentOffsetX / width);
        setCurrentSlideIndex(currentIndex);
    }

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
    }

    return (
        <SafeAreaView style={{ flex: 1, paddingTop: 50, paddingRight: 30 }}>
            <StatusBar backgroundColor='#F9E7FD' />
            <Header goToOtherSlide={goToOtherSlide} currentSlideIndex={currentSlideIndex} />
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
            <Footer currentSlideIndex={currentSlideIndex} />
        </SafeAreaView>
    )
}
