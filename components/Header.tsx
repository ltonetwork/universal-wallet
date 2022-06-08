import { useNavigation } from "@react-navigation/native"
import React from 'react'
import slides from "../utils/slideList"
import { HeaderBtn, HeaderView } from "./styles/Header.styles"


export default function Header({ currentSlideIndex, changeSlide }: any) {

    const navigation = useNavigation()

    return (
        <HeaderView>
            <HeaderBtn
                icon="information-outline"
                mode="text"
                uppercase={false}
                onPress={changeSlide}>
                More info
            </HeaderBtn>
            {currentSlideIndex !== slides.length - 1 &&
                <HeaderBtn
                    mode="text"
                    uppercase={false}
                    onPress={() => navigation.navigate('SignIn')}>
                    Skip
                </HeaderBtn>}
        </HeaderView>
    )
}
