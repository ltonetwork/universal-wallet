import { Dimensions } from "react-native";
import { View, Image } from "react-native";
import styled from "styled-components/native";

const { width } = Dimensions.get('window');

export default function Slide({ item }: any) {

    return (
        <View style={{ alignItems: 'center', width }}>
            <View style={{ width: 470, alignItems: 'flex-start', marginLeft: 150 }}>
                <TitleImg testID='titleImg' source={item?.titleImg} />
                <Subtitle testID="subtitle">{item?.subtitle}</Subtitle>
            </View>
            <Image
                testID='image'
                source={item?.image}
                style={{ height: '55%', resizeMode: 'contain' }}
            />
        </View>
    );
};


const Subtitle = styled.Text`
    color: #303030;
    font-size: 16px;
    margin-top: 35px;
    margin-left: -12px;
    text-align: justify;
    width: 340px
`
const TitleImg = styled.Image`
    resize-mode: contain;
    margin-left: -12px;
    height: 205px;
    width: 205px;
    margin-bottom: -90px;
    margin-top: -90px
`