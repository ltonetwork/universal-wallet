import Header from './Header';
import { render, fireEvent } from '@testing-library/react-native'

const mockedDispatch = jest.fn();
const mockedState = {
    currentSlideIndex: 0,
    goToOtherSlide: mockedDispatch,
};

jest.mock("@react-navigation/native", () => {
    const actualNav = jest.requireActual("@react-navigation/native");
    return {
        ...actualNav,
        useNavigation: () => ({
            navigate: jest.fn(),
            dispatch: mockedDispatch,
        }),
    };
});

it('Should renders two items correctly', () => {
    const { getByText } = render(<Header />);
    const moreItem = getByText('More info');
    const skipItem = getByText('Skip');
    expect(moreItem).toBeTruthy();
    expect(skipItem).toBeTruthy();
})


it('Should call goToOtherSlide when More info is clicked', () => {
    const { getByText } = render(<Header {...mockedState} />);
    const firstItem = getByText('More info');
    fireEvent.press(firstItem);
    expect(mockedDispatch).toHaveBeenCalled();
})

it('Should call navigate to Home when Skip is clicked', () => {
    const { getByText } = render(<Header {...mockedState} />);
    const secondItem = getByText('Skip');
    fireEvent.press(secondItem);
    expect(mockedDispatch).toHaveBeenCalled();
})