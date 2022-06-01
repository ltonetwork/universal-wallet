import { useNavigation } from "@react-navigation/native"
import slides from "../utils/slideList"
import { BtnContainer, Container, Indicator, IndicatorContainer } from "./styles/Footer.styles"
import { StyledButton } from "./styles/StyledButton.styles"

export default function Footer({ currentSlideIndex }: any) {

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
                        uppercase={false}
                        labelStyle={{ fontWeight: '800', fontSize: 16, width: '100%' }}
                        onPress={() => navigation.navigate('Root')}>
                        Start
                    </StyledButton>
                )}
            </BtnContainer>
        </Container>
    )
}