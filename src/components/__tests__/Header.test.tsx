import { fireEvent, render } from '@testing-library/react-native'
import React from 'react'
import Header from '../Header'

const mockedDispatch = jest.fn()

const mockedState = {
    currentSlideIndex: 0,
    changeSlide: mockedDispatch,
}

jest.mock("@react-navigation/native", () => {
    const actualNav = jest.requireActual("@react-navigation/native")
    return {
        ...actualNav,
        useNavigation: () => ({
            navigate: jest.fn(),
            dispatch: mockedDispatch,
        }),
    }
})

it('Should renders two items correctly', () => {
    const { getByText } = render(<Header />)

    const moreItem = getByText('More info')
    const skipItem = getByText('Skip')

    expect(moreItem).toBeTruthy()
    expect(skipItem).toBeTruthy()
})


it('Should call goToOtherSlide when More info is clicked', () => {
    const { getByText } = render(<Header {...mockedState} />)

    const moreItem = getByText('More info')
    fireEvent.press(moreItem)

    expect(mockedDispatch).toHaveBeenCalled()
})

it('Should call navigate to Home when Skip is clicked', () => {
    const { getByText } = render(<Header {...mockedState} />)

    const skipItem = getByText('Skip')
    fireEvent.press(skipItem)

    expect(mockedDispatch).toHaveBeenCalled()
})