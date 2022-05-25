import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Onboarding from 'react-native-onboarding-swiper';


const Skip = ({ ...props }) => (
    <TouchableOpacity
        style={{ marginHorizontal: 20 }}
        {...props}
    >
        <Text style={{ fontSize: 16 }}>Skip</Text>
    </TouchableOpacity>
);

const Next = ({ ...props }) => (
    <TouchableOpacity
        style={{ marginHorizontal: 20 }}
        {...props}
    >
        <Text style={{ fontSize: 16 }}>Next</Text>
    </TouchableOpacity>
);

const Start = ({ ...props }) => (
    <TouchableOpacity
        style={styles.button}
        {...props}
    >
        <Text style={styles.buttonText}>Start</Text>

    </TouchableOpacity>
);

export default function OnboardingScreen({ navigation }) {

    return (
        <Onboarding
            containerStyles={{
                alignItems: 'center',
            }}
            imageContainerStyles={{

            }}
            titleStyles={{

            }}
            subTitleStyles={{
                justifyContent: 'center'
            }}
            bottomBarHeight={70}
            bottomBarColor={'#ffffff'}
            SkipButtonComponent={Skip}
            NextButtonComponent={Next}
            DoneButtonComponent={Start}
            onSkip={() => navigation.replace("Root")}
            onDone={() => navigation.navigate("Root")}
            pages={[
                {
                    backgroundColor: '#ffffff',
                    image: <Image style={{ marginTop: -85, resizeMode: 'contain', width: 290, marginBottom: -110 }} source={require('../../assets/images/illustration_slide_1.png')} />,
                    title: 'LTO NETWORK',
                    subtitle: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Sequi maxime necessitatibus odit earum asperiores. Quia sit eum, nam explicabo culpa minus qua',
                },
                {
                    backgroundColor: '#ffffff',
                    image: <Image style={{ marginTop: -210, resizeMode: 'contain', width: 320, marginBottom: -170 }} source={require('../../assets/images/illustration_slide_2.png')} />,
                    title: 'LTO NETWORK2',
                    subtitle: 'ipisicing elit. Sequi maxime necessitatibus odit earum asperiores. Quia sit eum, nam explicabo ',
                },
            ]}
        />
    );
};


const styles = StyleSheet.create({

    button: {
        alignItems: 'center',
        padding: 12,
        width: 100,
        borderRadius: 40,
        backgroundColor: 'purple',
        marginHorizontal: 10,
        color: '#fdeb93'
    },
    buttonText: {
        fontSize: 15,
        fontWeight: '500',
        color: '#ffffff'

    },

});