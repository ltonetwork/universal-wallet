import { useNavigation } from "@react-navigation/native"
import React from 'react'
import slides from "../utils/slideList"
import { BtnContainer, Container, Indicator, IndicatorContainer } from "./styles/Footer.styles"
import { StyledButton } from "./styles/StyledButton.styles"
import { ONBOARDING } from "../constants/Text"

export default function Footer({ currentSlideIndex }: any): JSX.Element {
    const navigation = useNavigation()

    return (
        <Container>
            <IndicatorContainer>
                {slides.map((_, index) => (
                    <Indicator
                        testID='indicator'
                        key={index}
                        style={[
                            currentSlideIndex == index && {
                                backgroundColor: 'black',
                                width: 5
                            }
                        ]}
                    />
                ))}
            </IndicatorContainer>

            <BtnContainer>
                {currentSlideIndex === slides.length - 1 && (
                    <StyledButton
                        mode='contained'
                        color="#A017B7"
                        uppercase={false}
                        labelStyle={{ fontWeight: '400', fontSize: 16, width: '100%' }}
                        onPress={() => navigation.navigate('SignUp')}>
                        {ONBOARDING.BUTTON}
                    </StyledButton>
                )}
            </BtnContainer>
        </Container>
    )
}