import { useNavigation } from "@react-navigation/native"

import slides from "../utils/slideList"
import { HeaderView, HeaderBtn } from "./styles/Header.styles"

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
                    onPress={() => navigation.navigate('Root')}>
                    Skip
                </HeaderBtn>}
        </HeaderView>
    )
}
