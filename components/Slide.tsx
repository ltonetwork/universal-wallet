import { Image, useWindowDimensions, View } from "react-native"
import { Subtitle, TitleImg } from "./styles/Slide.styles"

export default function Slide({ item }: any) {
    const { width, height } = useWindowDimensions()

    return (
        <View style={{ alignItems: 'center', width, height: height * .85 }}>
            <View style={{ width: 470, alignItems: 'center' }}>
                <TitleImg testID='titleImg' source={item?.titleImg} />
                <Subtitle testID="subtitle">{item?.subtitle}</Subtitle>
            </View>
            <Image
                testID='image'
                source={item?.image}
                style={{ height: '55%', resizeMode: 'contain' }}
            />
        </View>
    )
}