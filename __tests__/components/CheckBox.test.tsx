import { fireEvent, render } from "@testing-library/react-native"
import React from "react"
import CheckBox from "../../src/components/CheckBox"

const mockedOpenModal = {
    openModal: jest.fn(),
}

it("Should renders correctly", () => {
    const { getByText } = render(<CheckBox onPress={function (): void {
        throw new Error("Function not implemented.")
    }} status={"checked"} />)

    const CheckBoxText = getByText('Accept terms and conditions')

    expect(CheckBoxText).toBeTruthy()
})

it("Should open modal when checkbox label is clicked", () => {
    const { getByText } = render(<CheckBox onPress={function (): void {
        mockedOpenModal.openModal()
    }} status={"checked"} />)

    const CheckBoxText = getByText('Accept terms and conditions')
    fireEvent.press(CheckBoxText)

    expect(mockedOpenModal.openModal).toHaveBeenCalled()
})

