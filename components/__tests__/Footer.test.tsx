import { render, fireEvent } from '@testing-library/react-native'
import Footer from '../Footer'

const mockedState = { currentSlideIndex: 1 }

const mockedNavigate = jest.fn()

jest.mock('@react-navigation/native', () => {
    const actualNav = jest.requireActual('@react-navigation/native')
    return {
        ...actualNav,
        useNavigation: () => ({
            navigate: mockedNavigate,
        }),
    }
})

it('Should renders items correctly', () => {
    const { findByText, getAllByTestId } = render(<Footer {...mockedState} />)

    const indicator = getAllByTestId('indicator')
    const startBtn = findByText('Start')

    expect(indicator).toBeDefined()
    expect(startBtn).toBeDefined()
})

it('Should call navigate Home when Start is clicked', () => {
    const { getByRole } = render(<Footer {...mockedState} />)

    const startBtn = getByRole('button')
    fireEvent.press(startBtn)

    expect(mockedNavigate).toHaveBeenCalled()
})
