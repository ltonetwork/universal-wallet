import React, { useRef, useState } from 'react'
import { FlatList, SafeAreaView, StatusBar, useWindowDimensions } from 'react-native'
import Footer from '../components/Footer'
import Header from '../components/Header'
import Slide from '../components/Slide'
import slides from '../utils/slideList'

export default function OnboardingScreen() {

    const { width, height } = useWindowDimensions()
    const [currentSlideIndex, setCurrentSlideIndex] = useState(0)
    const ref = useRef()

    const updateCurrentSlideIndex = e => {
        const contentOffsetX = e.nativeEvent.contentOffset.x
        const currentIndex = Math.round(contentOffsetX / width)
        setCurrentSlideIndex(currentIndex)
    }

    const changeSlide = () => {
        if (currentSlideIndex === slides.length - 1) {
            setCurrentSlideIndex(currentSlideIndex - 1)
            ref?.current.scrollToIndex({ index: currentSlideIndex - 1, animated: true })
        } else {
            setCurrentSlideIndex(currentSlideIndex + 1)
            ref?.current.scrollToIndex({ index: currentSlideIndex + 1, animated: true })
        }
    }

    return (
        <SafeAreaView style={{ flex: 1, paddingTop: 50 }}>
            <StatusBar backgroundColor='#F9E7FD' />
            <Header changeSlide={changeSlide} currentSlideIndex={currentSlideIndex} />
            <FlatList
                ref={ref}
                onMomentumScrollEnd={updateCurrentSlideIndex}
                contentContainerStyle={{ height: height * 0.9, marginTop: 50 }}
                showsHorizontalScrollIndicator={false}
                horizontal
                data={slides}
                pagingEnabled
                renderItem={({ item }) => <Slide item={item} />}
                bounces={false}
            />
            <Footer currentSlideIndex={currentSlideIndex} />
        </SafeAreaView>
    )
}
