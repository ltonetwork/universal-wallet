import React from 'react';
import { Image, StyleSheet } from 'react-native';
import Onboarding from 'react-native-onboarding-swiper';


export default function OnboardingScreen({ navigation }) {

    return (
        <Onboarding
            onSkip={() => navigation.navigate("Root")}
            onDone={() => navigation.navigate("Root")}
            pages={[
                {
                    backgroundColor: '#fff',
                    image: <Image source={require('../../assets/images/favicon.png')} />,
                    title: 'Slide 1',
                    subtitle: 'Connect',
                },
                {
                    backgroundColor: '#fdeb93',
                    image: <Image source={require('../../assets/images/favicon.png')} />,
                    title: 'Slide 2',
                    subtitle: 'Share Your Thoughts',
                },
            ]}
        />
    );
};


const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
});