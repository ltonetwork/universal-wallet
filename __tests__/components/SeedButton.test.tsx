import { fireEvent, render } from "@testing-library/react-native"
import React from "react"
import SeedButton from "../../src/components/SeedButton"


const mockedState = {
    showButton: true,
    setShowButton: jest.fn(),
}

it('Should renders correctly', () => {
    const { getByRole } = render(<SeedButton text={""} onPress={function (): void {
        throw new Error("Function not implemented.")
    }} />)

    const SeedButtonText = getByRole('button')

    expect(SeedButtonText).toBeTruthy()
})

it('Should hide when pressed', () => {
    const { getByRole } = render(<SeedButton {...mockedState} text={""} onPress={function (): void {
        mockedState.setShowButton(false)
    }} />)

    const SeedButtonText = getByRole('button')
    fireEvent.press(SeedButtonText)

    expect(mockedState.setShowButton).toHaveBeenCalledWith(false)
})




